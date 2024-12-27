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
const client_service_1 = require("../Client/client.service");
const session_service_1 = require("../Session/session.service");
const account_service_1 = require("../Account/account.service");
let TokenService = class TokenService {
    constructor(tokenModel, accountService, clientService, sessionService, cryptoService, jwtService, connection, cacheManager) {
        this.tokenModel = tokenModel;
        this.accountService = accountService;
        this.clientService = clientService;
        this.sessionService = sessionService;
        this.cryptoService = cryptoService;
        this.jwtService = jwtService;
        this.connection = connection;
        this.cacheManager = cacheManager;
    }
    async handleSaveToken(sid, clientId, accountId, scope, expireafterSeconds, transaction) {
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
            return createToken.save({ session: transaction });
        }
        catch (error) {
            throw new common_1.InternalServerErrorException({ message: 'Error creating token' });
        }
    }
    async handleFindOneTokenByFields(sid, accountId, clientId, fields) {
        try {
            let selectedFields = '-_id';
            Array.isArray(fields) && fields.includes('_id') ? (selectedFields = fields.join(' ')) : (selectedFields += ' ' + fields.join(' '));
            const query = { accountId, clientId };
            if (sid)
                query.sid = sid;
            if (accountId)
                query.accountId = accountId;
            if (clientId)
                query.clientId = clientId;
            const token = await this.tokenModel.findOne(query).select(selectedFields).sort({ createAt: 1 }).exec();
            if (!token)
                throw new common_1.NotFoundException({ message: 'Token not found' });
            return token;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException)
                throw error;
            throw new common_1.InternalServerErrorException({ message: 'Error finding token' });
        }
    }
    async handleFindTokens(limit, lastId, fields) {
        try {
            const query = {};
            lastId && (query.id = { $gt: lastId });
            let selectedFields = '-_id';
            Array.isArray(fields) && fields.includes('_id') ? (selectedFields = fields.join(' ')) : (selectedFields += ' ' + fields.join(' '));
            const totalRecords = await this.tokenModel.countDocuments(query);
            const tokens = await this.tokenModel.find(query).select(selectedFields).limit(limit).exec();
            return {
                tokens,
                totalRecords,
            };
        }
        catch (error) {
            throw new common_1.InternalServerErrorException({ message: 'Error finding token' });
        }
    }
    async handleFindOneToken(_id, fields) {
        try {
            let selectedFields = '-_id';
            Array.isArray(fields) && fields.includes('_id') ? (selectedFields = fields.join(' ')) : (selectedFields += ' ' + fields.join(' '));
            const token = await this.tokenModel.findOne({ _id: _id }).select(selectedFields).exec();
            if (!token)
                throw new common_1.NotFoundException({ message: 'Token not found' });
            return token;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException)
                throw error;
            throw new common_1.InternalServerErrorException({ message: 'Error finding token' });
        }
    }
    async handleDeleteToken(_id) {
        try {
            const deletedToken = await this.tokenModel.deleteOne({ _id }).exec();
            if (!deletedToken.acknowledged)
                throw new common_1.NotFoundException('Token not found or could not be deleted');
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException)
                throw error;
            throw new common_1.InternalServerErrorException({ message: 'Error delete token' });
        }
    }
    async handleDeleteAllTokensByClient(clientId) {
        try {
            const deletedToken = await this.tokenModel.deleteMany({ clientId: clientId }).exec();
            if (!deletedToken.acknowledged)
                throw new common_1.NotFoundException('Token not found or could not be deleted');
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException)
                throw error;
            throw new common_1.InternalServerErrorException({ message: 'Error delete token' });
        }
    }
    async handleDeleteAllTokensByAccountId(accountId) {
        try {
            const deletedToken = await this.tokenModel.deleteMany({ accountId: accountId }).exec();
            if (!deletedToken.acknowledged)
                throw new common_1.NotFoundException('Token not found or could not be deleted');
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException)
                throw error;
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
            if (error instanceof common_1.NotFoundException)
                throw error;
            throw new common_1.InternalServerErrorException({ message: 'Error delete token' });
        }
    }
    async handleDeleteTokenByFields(sid, accountId, clientId, transaction) {
        try {
            const deletedToken = await this.tokenModel.deleteOne({ sid, accountId, clientId }, { session: transaction }).exec();
            if (!deletedToken.acknowledged)
                throw new common_1.NotFoundException('Token not found or could not be deleted');
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException)
                throw error;
            throw new common_1.InternalServerErrorException({ message: 'Error delete token' });
        }
    }
    async handleUpdateScopeInToken(_id, scope, retrieve = false, transaction) {
        try {
            if (retrieve) {
                const updatedToken = await this.tokenModel.findOneAndUpdate({ _id }, { $set: { scope: scope } }, { new: true, session: transaction });
                if (!updatedToken)
                    throw new common_1.NotFoundException('Token not found');
                return updatedToken;
            }
            else {
                const updateToken = await this.tokenModel.updateOne({ _id }, { $set: { scope: scope } }, { session: transaction });
                if (updateToken.matchedCount === 0)
                    throw new common_1.NotFoundException({ message: 'Token or scope not found' });
                if (updateToken.modifiedCount === 0)
                    throw new common_1.InternalServerErrorException({ message: 'Token update failed' });
            }
        }
        catch (error) {
            throw new common_1.InternalServerErrorException({ message: 'Error updating tokens' });
        }
    }
    handleCreateAccessToken(clientId, accountId, scope) {
        try {
            const dataAccessToken = {
                clientId: clientId,
                accountId: accountId,
                scope: scope,
                exp: contants_1.constants.EXPIRED_ACCESS_TOKEN,
            };
            const accessToken = this.cryptoService.generateAccessToken(dataAccessToken);
            return {
                accessToken: accessToken,
                expiresIn: contants_1.constants.EXPIRED_ACCESS_TOKEN,
                tokenType: 'Bearer',
            };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException || error instanceof common_1.BadRequestException)
                throw error;
            throw new common_1.InternalServerErrorException({ message: 'Error create access tokens' });
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
            const result = await this.tokenModel.updateOne({ _id }, { expiredAt: Date.now() + contants_1.constants.EXPIRED_REFRESH_TOKEN * 1000 }, { session: transaction });
            return result.acknowledged;
        }
        catch (error) {
            throw new common_1.InternalServerErrorException({ message: 'Error updating tokens' });
        }
    }
    async handleGetAccessTokenByAuthorizationCodeGrant(clientId, clientSecret, code, redirectUri) {
        const transaction = await this.connection.startSession();
        transaction.startTransaction();
        try {
            this.cryptoService.decrypt(code);
            const dataStr = await this.cacheManager.get(code);
            if (!dataStr)
                throw new common_1.NotFoundException({ message: 'Code does not exist.' });
            const { sid, accountId, scope, accessType, nonce } = JSON.parse(dataStr);
            await this.sessionService.handleFindOneSession(sid, ['_id']);
            const account = await this.accountService.handleFindOneAccount(accountId, ['_id', 'name', 'clientId']);
            const client = await this.clientService.handleFindOneClient(clientId, ['_id', 'clientSecret', 'redirectUris']);
            if (clientSecret !== client.clientSecret)
                throw new common_1.UnauthorizedException({ message: 'Invalid client secret' });
            if (!client.redirectUris.includes(redirectUri))
                throw new common_1.BadRequestException({ message: 'Invalid redirect URI' });
            const token = accessType === common_2.EAccessType.OFFLINE
                ? await (async () => {
                    try {
                        const token = await this.handleFindOneTokenByFields(sid, account._id, client._id, ['_id', 'scope', 'expiredAt']);
                        return token;
                    }
                    catch (error) {
                        return undefined;
                    }
                })()
                : undefined;
            const checkScope = token ? [...scope].sort().every((val, index) => val === [...token.scope].sort()[index]) : undefined;
            const refreshToken = accessType === common_2.EAccessType.OFFLINE
                ? token
                    ? await Promise.all([
                        !checkScope ? this.handleUpdateScopeInToken(token._id, scope, false, transaction) : undefined,
                        this.handleUpdateExpiredInToken(token._id, token.expiredAt, transaction),
                    ]).then(() => token)
                    : await this.handleSaveToken(sid, client._id, account._id, scope, contants_1.constants.EXPIRED_REFRESH_TOKEN)
                : undefined;
            const { accessToken, expiresIn, tokenType } = this.handleCreateAccessToken(client._id, account._id, scope);
            const id_token = scope.includes(common_2.EScope.OPENID)
                ? this.handleCreateIDToken(account.email, clientId, contants_1.constants.EXPIRED_ID_TOKEN, account.name, account.firstName, account.lastName, account.picture, accessToken, nonce)
                : undefined;
            await transaction.commitTransaction();
            return {
                access_token: accessToken,
                expires_in: expiresIn,
                ...(refreshToken && { refresh_token: refreshToken._id }),
                ...(id_token && { id_token }),
                scope: scope.join(' '),
                token_type: tokenType,
            };
        }
        catch (error) {
            await transaction.abortTransaction();
            if (error instanceof common_1.NotFoundException || error instanceof common_1.BadRequestException || error instanceof common_1.UnauthorizedException)
                throw error;
            throw new common_1.InternalServerErrorException({ message: 'Error creating token' });
        }
        finally {
            transaction.endSession();
        }
    }
    async handleGetAccessTokenByRefreshTokenGrant(clientId, clientSecret, refreshToken, redirectUri) {
        try {
            const token = await this.handleFindOneToken(refreshToken, ['_id', 'accountId', 'scope', 'expiredAt']);
            const account = await this.accountService.handleFindOneAccount(token.accountId, ['_id', 'name', 'clientId']);
            await this.handleUpdateExpiredInToken(token._id, token.expiredAt);
            const client = await this.clientService.handleFindOneClient(clientId, ['clientSecret', 'redirectUris']);
            if (clientSecret !== client.clientSecret)
                throw new common_1.UnauthorizedException('Invalid client secret');
            if (!client.redirectUris.includes(redirectUri))
                throw new common_1.BadRequestException('Invalid redirect URI');
            const { accessToken, expiresIn, tokenType } = this.handleCreateAccessToken(client._id, account._id, token.scope);
            return {
                access_token: accessToken,
                expires_in: expiresIn,
                scope: token.scope.join(' '),
                token_type: tokenType,
            };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException || error instanceof common_1.BadRequestException || error instanceof common_1.UnauthorizedException)
                throw error;
            throw new common_1.InternalServerErrorException({ message: 'Error updating tokens' });
        }
    }
};
exports.TokenService = TokenService;
exports.TokenService = TokenService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_2.InjectModel)(token_schema_1.Token.name)),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => account_service_1.AccountService))),
    __param(6, (0, mongoose_2.InjectConnection)()),
    __param(7, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [mongoose_1.Model,
        account_service_1.AccountService,
        client_service_1.ClientService,
        session_service_1.SessionService,
        common_2.CryptoService,
        jwt_1.JwtService,
        mongoose_1.Connection,
        cache_manager_1.Cache])
], TokenService);
//# sourceMappingURL=token.service.js.map