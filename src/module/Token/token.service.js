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
exports.TokenService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const cache_manager_1 = require("@nestjs/cache-manager");
const mongoose_2 = require("@nestjs/mongoose");
const jwt_1 = require("@nestjs/jwt");
const contants_1 = require("../../common/contants");
const token_schema_1 = require("./token.schema");
const common_2 = require("../../common");
const user_service_1 = require("../User/user.service");
const client_service_1 = require("../Client/client.service");
const session_service_1 = require("../Session/session.service");
let TokenService = class TokenService {
    constructor(tokenModel, userService, clientService, sessionService, cryptoService, jwtService, cacheManager) {
        this.tokenModel = tokenModel;
        this.userService = userService;
        this.clientService = clientService;
        this.sessionService = sessionService;
        this.cryptoService = cryptoService;
        this.jwtService = jwtService;
        this.cacheManager = cacheManager;
    }
    async handleCreateToken(sid, clientId, accountId, scope, expireafterSeconds, transaction) {
        try {
            const tokenEncrypt = this.cryptoService.encrypt({ accountId });
            const createToken = new this.tokenModel({
                _id: tokenEncrypt,
                sid: sid,
                clientId,
                accountId: accountId,
                scope: scope,
                expiredAt: Date.now() + expireafterSeconds * 1000,
            });
            return createToken.save({ session: transaction ? transaction : undefined });
        }
        catch (error) {
            console.error('createToken: ', error.message);
            throw new common_1.InternalServerErrorException('Error creating token');
        }
    }
    async handleGetTokenByFields(sid, accountId, clientId, fields) {
        try {
            let selectedFields = '-_id';
            if (Array.isArray(fields) && fields.includes('_id')) {
                selectedFields = fields.join(' ');
            }
            else {
                selectedFields += ' ' + fields.join(' ');
            }
            const data = await this.tokenModel.findOne({ sid, accountId, clientId }).select(selectedFields).sort({ createAt: 1 }).exec();
            return data;
        }
        catch (error) {
            console.error('handleGetTokenbyFields: ', error.message);
            throw new common_1.InternalServerErrorException('Error finding user');
        }
    }
    async handleGetAllTokens(limit, lastId, fields) {
        try {
            const query = {};
            lastId && (query.id = { $gt: lastId });
            let selectedFields = '-_id';
            if (Array.isArray(fields) && fields.includes('_id')) {
                selectedFields = fields.join(' ');
            }
            else {
                selectedFields += ' ' + fields.join(' ');
            }
            const totalRecords = await this.tokenModel.countDocuments(query);
            const tokens = await this.tokenModel.find(query).select(selectedFields).limit(limit).exec();
            return {
                tokens,
                totalRecords,
            };
        }
        catch (error) {
            console.error('findTokens: ', error.message);
            throw new common_1.InternalServerErrorException('Error finding user');
        }
    }
    async handleGetToken(_id, fields) {
        try {
            let selectedFields = '-_id';
            if (Array.isArray(fields) && fields.includes('_id')) {
                selectedFields = fields.join(' ');
            }
            else {
                selectedFields += ' ' + fields.join(' ');
            }
            return this.tokenModel.findOne({ _id: _id }).select(selectedFields).exec();
        }
        catch (error) {
            console.error('findToken: ', error.message);
            throw new common_1.InternalServerErrorException('Error finding user');
        }
    }
    async handleDeleteTokenByFields(sid, accountId, clientId) {
        try {
            const deletedToken = await this.tokenModel.deleteOne({ sid, accountId, clientId }).exec();
            if (!deletedToken.acknowledged)
                throw new common_1.NotFoundException('Token not found or could not be deleted');
        }
        catch (error) {
            console.error('deleteToken: ', error.message);
            throw new common_1.InternalServerErrorException('Error update token');
        }
    }
    async handleDeleteToken(_id) {
        try {
            const deletedToken = await this.tokenModel.deleteOne({ _id }).exec();
            if (!deletedToken.acknowledged)
                throw new common_1.NotFoundException('Token not found or could not be deleted');
        }
        catch (error) {
            console.error('handleDeleteToken: ', error.message);
            throw new common_1.InternalServerErrorException({ message: 'Error delete token' });
        }
    }
    async handleDeleteAllTokensByFields(sid, accountId, clientId) {
        try {
            const deletedToken = await this.tokenModel.deleteMany({ sid, accountId, clientId }).exec();
            if (!deletedToken.acknowledged)
                throw new common_1.NotFoundException('Token not found or could not be deleted');
        }
        catch (error) {
            console.error('handleDeleteAllTokens: ', error.message);
            throw new common_1.InternalServerErrorException({ message: 'Error delete tokens' });
        }
    }
    async handleDeleteAllTokensInClient(clientId) {
        try {
            const deletedToken = await this.tokenModel.deleteMany({ clientId: clientId }).exec();
            if (!deletedToken.acknowledged)
                throw new common_1.NotFoundException('Token not found or could not be deleted');
        }
        catch (error) {
            console.error('deleteToken: ', error.message);
            throw new common_1.InternalServerErrorException('Error update token');
        }
    }
    async handleDeleteAllTokensInAccountId(accountId) {
        try {
            const deletedToken = await this.tokenModel.deleteMany({ accountId: accountId }).exec();
            if (!deletedToken.acknowledged)
                throw new common_1.NotFoundException('Token not found or could not be deleted');
        }
        catch (error) {
            console.error('deleteToken: ', error.message);
            throw new common_1.InternalServerErrorException('Error update token');
        }
    }
    async handleUpdateScopeInToken(_id, scope, transaction) {
        try {
            const result = await this.tokenModel.updateOne({ _id }, { $set: { scope: scope } }, { session: transaction ? transaction : undefined });
            return result.acknowledged;
        }
        catch (error) {
            console.error('updateScopeInToken: ', error.message);
            throw new common_1.InternalServerErrorException('Error updating tokens');
        }
    }
    handleCreateAccessToken(SID, clientId, accountId, scope) {
        try {
            const dataAccessToken = {
                SID: SID,
                clientId: clientId,
                accountId: accountId,
                scope: scope,
                exp: contants_1.constants.EXPIRED_ACCESS_TOKEN,
            };
            const accessToken = this.cryptoService.generateAccessToken(dataAccessToken);
            return {
                access_token: accessToken,
                expires_in: contants_1.constants.EXPIRED_ACCESS_TOKEN,
                token_type: 'Bearer',
            };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException || error instanceof common_1.BadRequestException)
                throw error;
            console.error('handleCreateAccessToken: ', error.message);
            throw new common_1.InternalServerErrorException('Error create access tokens');
        }
    }
    handleCreateIDToken(sub, aud, exp, name, firstName, lastName, picture, accessToken, nonce) {
        const at_hash = accessToken ? this.cryptoService.calculateAtHash(accessToken) : undefined;
        const payload = {
            iss: 'Knite',
            sub,
            aud,
            exp: Math.floor(new Date().getTime() / 1000 + exp),
            iat: Math.floor(new Date().getTime() / 1000),
            name,
            given_name: firstName,
            family_name: lastName,
            picture,
            nonce,
            ...(at_hash && { at_hash }),
        };
        return this.jwtService.sign(payload);
    }
    async handleUpdateExpiredInToken(_id, expiredAt, transaction) {
        try {
            if (expiredAt.getTime() - new Date().getTime() > contants_1.constants.MIN_EXPIRED_REFRESH_TOKEN)
                return false;
            const result = await this.tokenModel.updateOne({ _id }, { expiredAt: Date.now() + contants_1.constants.EXPIRED_REFRESH_TOKEN * 1000 }, { session: transaction ? transaction : undefined });
            return result.acknowledged;
        }
        catch (error) {
            console.error('updateExpiredToken: ', error.message);
            throw new common_1.InternalServerErrorException('Error updating tokens');
        }
    }
    async handleGetAccessTokenByAuthorizationCodeGrant(clientId, clientSecret, code, redirectUri) {
        try {
            this.cryptoService.decrypt(code);
            const dataStr = await this.cacheManager.get(code);
            if (!dataStr)
                throw new common_1.NotFoundException('Code does not exist.');
            const { sid, accountId, scope, accessType, nonce } = JSON.parse(dataStr);
            const token = accessType ? await this.handleGetTokenByFields(sid, accountId, clientId, ['_id', 'scope']) : undefined;
            const session = await this.sessionService.handleGetSession(sid, ['_id']);
            if (!session)
                throw new common_1.NotFoundException('Session not found');
            const user = await this.userService.handleGetUser(accountId, ['_id', 'name', 'clientId']);
            if (!user)
                throw new common_1.NotFoundException('User not found');
            const client = await this.clientService.handleGetClient(clientId, ['clientSecret', 'redirectUris']);
            if (clientSecret !== client.clientSecret)
                throw new common_1.UnauthorizedException('Invalid client secret');
            if (!client.redirectUris.includes(redirectUri))
                throw new common_1.BadRequestException('Invalid redirect URI');
            const { access_token, expires_in, token_type } = this.handleCreateAccessToken(sid, client._id, user._id, scope);
            const id_token = scope.includes(common_2.EScope.OPENID)
                ? this.handleCreateIDToken(user.email, clientId, contants_1.constants.EXPIRED_ID_TOKEN, user.name, user.firstName, user.lastName, user.picture, access_token, nonce)
                : {};
            return {
                access_token: access_token,
                expires_in: expires_in,
                ...(accessType === common_2.EAccessType.OFFLINE && { refresh_token: token._id }),
                ...(id_token && { id_token }),
                scope: scope.join(' '),
                token_type: token_type,
            };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException || error instanceof common_1.BadRequestException || error instanceof common_1.UnauthorizedException)
                throw error;
            console.error('handleGetAccessTokenByAuthorizationCodeGrant: ', error.message);
            throw new common_1.InternalServerErrorException('Error get token');
        }
    }
    async handleGetAccessTokenByRefreshTokenGrant(clientId, clientSecret, refreshToken, redirectUri) {
        try {
            const tokenData = await this.handleGetToken(refreshToken, ['_id', 'accountId', 'scope', 'expiredAt']);
            if (!tokenData)
                throw new common_1.UnauthorizedException('Invalid or expired refresh token');
            const user = await this.userService.handleGetUser(tokenData.accountId, ['_id', 'name', 'clientId']);
            if (!user)
                throw new common_1.NotFoundException('User not found');
            await this.handleUpdateExpiredInToken(tokenData._id, tokenData.expiredAt);
            const client = await this.clientService.handleGetClient(clientId, ['clientSecret', 'redirectUris']);
            if (clientSecret !== client.clientSecret)
                throw new common_1.UnauthorizedException('Invalid client secret');
            if (!client.redirectUris.includes(redirectUri))
                throw new common_1.BadRequestException('Invalid redirect URI');
            const { access_token, expires_in, token_type } = this.handleCreateAccessToken(tokenData.sid, client._id, user._id, tokenData.scope);
            return {
                access_token: access_token,
                expires_in: expires_in,
                scope: tokenData.scope.join(' '),
                token_type: token_type,
            };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException || error instanceof common_1.BadRequestException || error instanceof common_1.UnauthorizedException)
                throw error;
            console.error('handleGetNewAccessTokenOfClient: ', error.message);
            throw new common_1.InternalServerErrorException('Error updating tokens');
        }
    }
};
exports.TokenService = TokenService;
exports.TokenService = TokenService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_2.InjectModel)(token_schema_1.Token.name)),
    __param(6, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [mongoose_1.Model,
        user_service_1.UserService,
        client_service_1.ClientService,
        session_service_1.SessionService,
        common_2.CryptoService,
        jwt_1.JwtService,
        cache_manager_1.Cache])
], TokenService);
//# sourceMappingURL=token.service.js.map