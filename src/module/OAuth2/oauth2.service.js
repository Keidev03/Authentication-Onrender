"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OAuth2Service = void 0;
const common_1 = require("@nestjs/common");
const cache_manager_1 = require("@nestjs/cache-manager");
const mongoose_1 = require("mongoose");
const mongoose_2 = require("@nestjs/mongoose");
const bcrypt = require("bcryptjs");
const contants_1 = require("../../common/contants");
const common_2 = require("../../common");
const user_service_1 = require("../User/user.service");
const token_service_1 = require("../Token/token.service");
const session_service_1 = require("../Session/session.service");
const client_service_1 = require("../Client/client.service");
let OAuth2Service = class OAuth2Service {
    constructor(userService, sessionService, clientService, tokenService, cryptoService, connection, cacheManager) {
        this.userService = userService;
        this.sessionService = sessionService;
        this.clientService = clientService;
        this.tokenService = tokenService;
        this.cryptoService = cryptoService;
        this.connection = connection;
        this.cacheManager = cacheManager;
    }
    async handleSigninWithSID(accountId, clientId, redirectUri, responseType, scope, accessType, prompt, nonce, state, sidStr) {
        const transaction = await this.connection.startSession();
        transaction.startTransaction();
        try {
            if (!sidStr)
                throw new common_1.BadRequestException({ message: 'No account found in session' });
            const { os, device, browser, ip } = this.cryptoService.decrypt(sidStr);
            const user = await this.userService.handleGetUser(accountId, ['_id', 'email', 'name', 'firstName', 'lastName', 'password', 'picture']);
            if (!user)
                throw new common_1.NotFoundException({ message: 'User not found' });
            const session = await this.sessionService.handleGetSession(sidStr, ['_id', 'accountId']);
            if (!session)
                throw new common_1.NotFoundException({ message: 'Session not found' });
            if (!session.accountId.toString().includes(user._id.toString()))
                throw new common_1.BadRequestException({ message: 'No account found in session' });
            const client = await this.clientService.handleGetClient(clientId, ['_id', 'name', 'picture', 'scope', 'redirectUris', 'privacyPolicy', 'termsOfService']);
            if (!client) {
                throw new common_1.BadRequestException({
                    error: 'unauthorized_client',
                    error_description: `The OAuth client was not found or is unauthorized to use the requested grant type.`,
                });
            }
            if (!client.redirectUris || !client.redirectUris.includes(redirectUri)) {
                throw new common_1.BadRequestException({
                    error: 'redirect_uri_mismatch',
                    error_description: `The redirect URI in the request: <${redirectUri}> does not match any of the registered redirect URIs.`,
                });
            }
            if (scope && scope.some((s) => !client.scope.includes(s))) {
                throw new common_1.BadRequestException({
                    uri: redirectUri,
                    state: state,
                    error: 'invalid_scope',
                    error_description: `One or more of the requested scopes are invalid, unknown, or not authorized. Requested scopes: <${scope.join(', ')}>`,
                });
            }
            const token = accessType ? await this.tokenService.handleGetTokenbyFields(sidStr, user._id, clientId, ['_id', 'scope', 'expiredAt']) : null;
            const consent = token && token.scope && scope.length === token.scope.length
                ? (() => {
                    const sortedScope = [...scope].sort();
                    const sortedTokenScope = [...token.scope].sort();
                    return !sortedScope.every((val, index) => val === sortedTokenScope[index]);
                })()
                : true;
            token &&
                consent &&
                (await this.tokenService.handleUpdateScopeInToken(token._id, scope, transaction)) &&
                (await this.tokenService.handleUpdateExpiredInToken(token._id, token.expiredAt, transaction));
            if (!token && accessType)
                await this.tokenService.handleCreateToken(session._id, client._id, user._id, scope, contants_1.constants.EXPIRED_REFRESH_TOKEN, transaction);
            const code = responseType.includes(common_2.EResponseType.CODE) ? this.handleCode(sidStr, user._id, scope, accessType, nonce) : undefined;
            const access_token = responseType.includes(common_2.EResponseType.TOKEN) ? this.tokenService.handleCreateAccessToken(session._id, client._id, user._id, scope) : undefined;
            const id_token = responseType.includes(common_2.EResponseType.ID_TOKEN) && scope.includes(common_2.EScope.OPENID)
                ? this.tokenService.handleCreateIDToken(user.email, clientId, contants_1.constants.EXPIRED_ID_TOKEN, user.name, user.firstName, user.lastName, user.picture, access_token.access_token, nonce)
                : undefined;
            await transaction.commitTransaction();
            return {
                client_name: client.name,
                client_picture: client.picture,
                redirect_uri: redirectUri,
                email: user.email,
                picture: user.picture,
                ...(code && { code }),
                ...(access_token && { access_token: access_token.access_token, expires_in: access_token.expires_in, token_type: access_token.token_type }),
                ...(id_token && { id_token }),
                scope: scope.join(' '),
                ...((prompt === common_2.EPrompt.CONSENT || consent) && { consent: { privacy_policy: client.privacyPolicy, terms_of_service: client.termsOfService } }),
                authuser: '0',
            };
        }
        catch (error) {
            await transaction.abortTransaction();
            if (error instanceof common_1.BadRequestException || error instanceof common_1.NotFoundException)
                throw error;
            console.error('func handleSigninWithSID - Error: ', error.message);
            throw new common_1.InternalServerErrorException(error.message);
        }
        finally {
            await transaction.endSession();
        }
    }
    async handleSigninWithPassword(accountId, password, clientId, redirectUri, responseType, scope, accessType, prompt, nonce, state, os, device, browser, ip, sidStr, aisStr = null) {
        const transaction = await this.connection.startSession();
        transaction.startTransaction();
        try {
            const accounts = aisStr ? this.cryptoService.decodeAIS(aisStr) : [];
            if (accounts.length >= 10)
                throw new common_1.UnauthorizedException({ message: 'Session limit reached' });
            const client = await this.clientService.handleGetClient(clientId, ['_id', 'name', 'picture', 'scope', 'redirectUris', 'privacyPolicy', 'termsOfService']);
            const user = await this.userService.handleGetUser(accountId, ['_id', 'email', 'name', 'firstName', 'lastName', 'password', 'picture']);
            if (!user)
                throw new common_1.NotFoundException({ message: 'User not found' });
            if (!client) {
                throw new common_1.BadRequestException({
                    error: 'unauthorized_client',
                    error_description: `The OAuth client was not found or is unauthorized to use the requested grant type.`,
                });
            }
            if (!client.redirectUris || !client.redirectUris.includes(redirectUri)) {
                throw new common_1.BadRequestException({
                    error: 'redirect_uri_mismatch',
                    error_description: `The redirect URI in the request: <${redirectUri}> does not match any of the registered redirect URIs.`,
                });
            }
            if (scope && scope.some((s) => !client.scope.includes(s))) {
                throw new common_1.BadRequestException({
                    uri: redirectUri,
                    state: state,
                    error: 'invalid_scope',
                    error_description: `One or more of the requested scopes are invalid, unknown, or not authorized. Requested scopes: <${scope.join(', ')}>`,
                });
            }
            if (!bcrypt.compareSync(password, user.password))
                throw new common_1.UnauthorizedException({ message: 'Invalid password' });
            if (!accounts.includes(user._id.toString()))
                accounts.push(user._id.toString());
            const session = sidStr
                ? await this.sessionService.handleUpdateSessionOrCreateNew(sidStr, user._id, os, device, browser, ip, transaction)
                : await this.sessionService.handleCreateSession(os, device, browser, ip, user._id, contants_1.constants.EXPIRED_SID, transaction);
            const aisEncrypted = this.cryptoService.encodeAIS(accounts);
            const token = accessType ? await this.tokenService.handleGetTokenbyFields(sidStr, user._id, clientId, ['_id', 'scope', 'expiredAt']) : null;
            const consent = token && token.scope && scope.length === token.scope.length
                ? (() => {
                    const sortedScope = [...scope].sort();
                    const sortedTokenScope = [...token.scope].sort();
                    return !sortedScope.every((val, index) => val === sortedTokenScope[index]);
                })()
                : true;
            token &&
                consent &&
                (await this.tokenService.handleUpdateScopeInToken(token._id, scope, transaction)) &&
                (await this.tokenService.handleUpdateExpiredInToken(token._id, token.expiredAt, transaction));
            if (!token && accessType)
                await this.tokenService.handleCreateToken(session._id, client._id, user._id, scope, contants_1.constants.EXPIRED_REFRESH_TOKEN, transaction);
            const code = responseType.includes(common_2.EResponseType.CODE) ? this.handleCode(session._id, user._id, scope, accessType, nonce) : undefined;
            const access_token = responseType.includes(common_2.EResponseType.TOKEN) ? this.tokenService.handleCreateAccessToken(session._id, client._id, user._id, scope) : undefined;
            const id_token = responseType.includes(common_2.EResponseType.ID_TOKEN) && scope.includes(common_2.EScope.OPENID)
                ? this.tokenService.handleCreateIDToken(user.email, clientId, contants_1.constants.EXPIRED_ID_TOKEN, user.name, user.firstName, user.lastName, user.picture, access_token.access_token, nonce)
                : undefined;
            await transaction.commitTransaction();
            return {
                client_name: client.name,
                client_picture: client.picture,
                newSID: session._id,
                newAIS: aisEncrypted,
                redirect_uri: redirectUri,
                email: user.email,
                picture: user.picture,
                ...(code && { code }),
                ...(access_token && { access_token: access_token.access_token, expires_in: access_token.expires_in, token_type: access_token.token_type }),
                ...(id_token && { id_token }),
                scope: scope.join(' '),
                ...((prompt === common_2.EPrompt.CONSENT || consent) && { consent: { privacy_policy: client.privacyPolicy, terms_of_service: client.termsOfService } }),
                authuser: '0',
            };
        }
        catch (error) {
            await transaction.abortTransaction();
            if (error instanceof common_1.UnauthorizedException || error instanceof common_1.BadRequestException || error instanceof common_1.NotFoundException)
                throw error;
            console.error('func handleSigninWithPassword - Error:', error.message);
            throw new common_1.InternalServerErrorException(error.message);
        }
        finally {
            transaction.endSession();
        }
    }
    handleCode(sid, accountId, scope, accessType, nonce) {
        const code = this.cryptoService.encrypt({ accountId });
        this.cacheManager.set(code, JSON.stringify({ sid, accountId, scope, accessType, nonce }), contants_1.constants.EXPIRED_CODE);
        return code;
    }
    buildResponse(data, state, scope, prompt) {
        return {
            ...(data.code && { code: data.code }),
            ...(data.access_token && { access_token: data.access_token, expires_in: data.expires_in, token_type: data.token_type }),
            ...(data.id_token && { id_token: data.id_token, at_hash: data.at_hash }),
            state: state,
            scope: scope,
            authuser: data.authuser,
            prompt: prompt,
        };
    }
};
exports.OAuth2Service = OAuth2Service;
exports.OAuth2Service = OAuth2Service = __decorate([
    (0, common_1.Injectable)(),
    __param(5, (0, mongoose_2.InjectConnection)()),
    __param(6, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [user_service_1.UserService,
        session_service_1.SessionService,
        client_service_1.ClientService,
        token_service_1.TokenService,
        common_2.CryptoService,
        mongoose_1.Connection,
        cache_manager_1.Cache])
], OAuth2Service);
//# sourceMappingURL=oauth2.service.js.map