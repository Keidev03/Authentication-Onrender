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
const account_service_1 = require("../Account/account.service");
const token_service_1 = require("../Token/token.service");
const session_service_1 = require("../Session/session.service");
const client_service_1 = require("../Client/client.service");
let OAuth2Service = class OAuth2Service {
    constructor(accountService, sessionService, clientService, tokenService, cryptoService, connection, cacheManager) {
        this.accountService = accountService;
        this.sessionService = sessionService;
        this.clientService = clientService;
        this.tokenService = tokenService;
        this.cryptoService = cryptoService;
        this.connection = connection;
        this.cacheManager = cacheManager;
    }
    async handleSigninWithSID(authuser, clientId, redirectUri, responseType, scope, accessType, prompt, nonce, state, sidStr) {
        const transaction = await this.connection.startSession();
        transaction.startTransaction();
        try {
            if (!sidStr)
                throw new common_1.BadRequestException({ message: 'No account found in session' });
            const accountId = await this.sessionService.hanldeFindOneAccountInSessionByAuthUser(authuser, sidStr);
            const account = await this.accountService.handleFindOneAccount(accountId, ['_id', 'email', 'name', 'firstName', 'lastName', 'password', 'picture', 'clientId']);
            const client = await this.clientService.handleFindOneClient(clientId, ['_id', 'name', 'picture', 'scopes', 'redirectUris', 'privacyPolicy', 'termsOfService']);
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
            if (scope && scope.some((s) => !client.scopes.includes(s))) {
                throw new common_1.BadRequestException({
                    uri: redirectUri,
                    state: state,
                    error: 'invalid_scope',
                    error_description: `One or more of the requested scopes are invalid, unknown, or not authorized. Requested scopes: <${scope.join(', ')}>`,
                });
            }
            const token = sidStr && accessType
                ? await (async () => {
                    try {
                        const token = await this.tokenService.handleFindOneTokenByFields(sidStr, account._id, client._id, ['_id', 'scope', 'expiredAt']);
                        return token;
                    }
                    catch (error) {
                        return undefined;
                    }
                })()
                : undefined;
            const isClientIncluded = account.clientId ? account.clientId.some((clientId) => clientId.equals(client._id)) : false;
            if (!isClientIncluded)
                await this.accountService.handleUpdateClientIdsToAccount(account._id, [client._id], 'add', transaction);
            const consent = isClientIncluded && token && token.scope && scope.length === token.scope.length
                ? (() => {
                    return ![...scope].sort().every((val, index) => val === [...token.scope].sort()[index]);
                })()
                : true;
            const code = responseType.includes(common_2.EOAuth2ResponseType.CODE) ? this.handleCode(sidStr, account._id, scope, accessType, nonce) : undefined;
            const accessToken = responseType.includes(common_2.EOAuth2ResponseType.TOKEN) ? this.tokenService.handleCreateAccessToken(client._id, account._id, scope) : undefined;
            const idToken = responseType.includes(common_2.EOAuth2ResponseType.ID_TOKEN) && scope.includes(common_2.EOAuth2Scope.OPENID)
                ? this.tokenService.handleCreateIDToken(account.email, clientId, contants_1.constants.EXPIRED_ID_TOKEN, account.name, account.firstName, account.lastName, account.picture, accessToken.accessToken, nonce)
                : undefined;
            await transaction.commitTransaction();
            return {
                clientName: client.name,
                clientPicture: client.picture,
                redirectUri: redirectUri,
                email: account.email,
                picture: account.picture ? (account.picture.includes('https://lh3.googleusercontent.com') ? account.picture : `https://lh3.googleusercontent.com/d/${account.picture}=s96-c`) : null,
                ...(code && { code }),
                ...(accessToken && { access_token: accessToken.accessToken, expires_in: accessToken.expiresIn, token_type: accessToken.tokenType }),
                ...(idToken && { idToken }),
                scope: scope.join(' '),
                ...((prompt === common_2.EOAuth2Prompt.CONSENT || consent) && { consent: { privacyPolicy: client.privacyPolicy, termsOfService: client.termsOfService } }),
                authuser,
            };
        }
        catch (error) {
            await transaction.abortTransaction();
            if (error instanceof common_1.BadRequestException || error instanceof common_1.NotFoundException)
                throw error;
            throw new common_1.InternalServerErrorException({ message: 'Error signin with session' });
        }
        finally {
            await transaction.endSession();
        }
    }
    async handleSigninWithPassword(accountId, password, clientId, redirectUri, responseType, scope, accessType, prompt, nonce, state, os, device, browser, ip, sidStr) {
        const transaction = await this.connection.startSession();
        transaction.startTransaction();
        try {
            const client = await this.clientService.handleFindOneClient(clientId, ['_id', 'name', 'picture', 'scopes', 'redirectUris', 'privacyPolicy', 'termsOfService']);
            const account = await this.accountService.handleFindOneAccount(accountId, ['_id', 'email', 'name', 'firstName', 'lastName', 'password', 'picture', 'clientId']);
            if (!client.redirectUris || !client.redirectUris.includes(redirectUri)) {
                throw new common_1.BadRequestException({
                    error: 'redirect_uri_mismatch',
                    error_description: `The redirect URI in the request: <${redirectUri}> does not match any of the registered redirect URIs.`,
                });
            }
            if (scope && scope.some((s) => !client.scopes.includes(s))) {
                throw new common_1.BadRequestException({
                    uri: redirectUri,
                    state: state,
                    error: 'invalid_scope',
                    error_description: `One or more of the requested scopes are invalid, unknown, or not authorized. Requested scopes: <${scope.join(', ')}>`,
                });
            }
            if (!bcrypt.compareSync(password, account.password))
                throw new common_1.UnauthorizedException({ message: 'Invalid password' });
            const session = await this.sessionService.handleFindOneAndCreateOrUpdateSession(sidStr, account._id, os, device, browser, ip, transaction);
            const indexAuthuser = session.linkedAccountIds.findIndex((account) => account._id._id.toString() === accountId.toString());
            const token = sidStr && accessType
                ? await (async () => {
                    try {
                        const token = await this.tokenService.handleFindOneTokenByFields(sidStr, account._id, client._id, ['_id', 'scope', 'expiredAt']);
                        return token;
                    }
                    catch (error) {
                        return undefined;
                    }
                })()
                : undefined;
            const isClientIncluded = account.clientId ? account.clientId.some((clientId) => clientId.equals(client._id)) : false;
            if (!isClientIncluded)
                await this.accountService.handleUpdateClientIdsToAccount(account._id, [client._id], 'add', transaction);
            const consent = isClientIncluded && token && token.scope && scope.length === token.scope.length
                ? (() => {
                    return ![...scope].sort().every((val, index) => val === [...token.scope].sort()[index]);
                })()
                : true;
            const code = responseType.includes(common_2.EOAuth2ResponseType.CODE) ? this.handleCode(session._id, account._id, scope, accessType, nonce) : undefined;
            const accessToken = responseType.includes(common_2.EOAuth2ResponseType.TOKEN) ? this.tokenService.handleCreateAccessToken(client._id, account._id, scope) : undefined;
            const idToken = responseType.includes(common_2.EOAuth2ResponseType.ID_TOKEN) && scope.includes(common_2.EOAuth2Scope.OPENID)
                ? this.tokenService.handleCreateIDToken(account.email, clientId, contants_1.constants.EXPIRED_ID_TOKEN, account.name, account.firstName, account.lastName, account.picture, accessToken.accessToken, nonce)
                : undefined;
            await transaction.commitTransaction();
            return {
                clientName: client.name,
                clientPicture: client.picture,
                newSID: session._id,
                redirectUri: redirectUri,
                email: account.email,
                picture: account.picture ? (account.picture.includes('https://lh3.googleusercontent.com') ? account.picture : `https://lh3.googleusercontent.com/d/${account.picture}=s96-c`) : null,
                ...(code && { code }),
                ...(accessToken && { access_token: accessToken.accessToken, expires_in: accessToken.expiresIn, token_type: accessToken.tokenType }),
                ...(idToken && { idToken }),
                scope: scope.join(' '),
                ...((prompt === common_2.EOAuth2Prompt.CONSENT || consent) && { consent: { privacyPolicy: client.privacyPolicy, termsOfService: client.termsOfService } }),
                authuser: indexAuthuser,
            };
        }
        catch (error) {
            await transaction.abortTransaction();
            if (error instanceof common_1.UnauthorizedException || error instanceof common_1.BadRequestException || error instanceof common_1.NotFoundException)
                throw error;
            throw new common_1.InternalServerErrorException({ message: 'Error signin with password' });
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
    __metadata("design:paramtypes", [account_service_1.AccountService,
        session_service_1.SessionService,
        client_service_1.ClientService,
        token_service_1.TokenService,
        common_2.CryptoService,
        mongoose_1.Connection,
        cache_manager_1.Cache])
], OAuth2Service);
//# sourceMappingURL=oauth2.service.js.map