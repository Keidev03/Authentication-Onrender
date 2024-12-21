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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const bcrypt = require("bcryptjs");
const common_2 = require("../../common");
const user_service_1 = require("../User/user.service");
const token_service_1 = require("../Token/token.service");
const session_service_1 = require("../Session/session.service");
const mongoose_2 = require("@nestjs/mongoose");
let AuthService = class AuthService {
    constructor(userService, sessionService, tokenService, cryptoService, connection) {
        this.userService = userService;
        this.sessionService = sessionService;
        this.tokenService = tokenService;
        this.cryptoService = cryptoService;
        this.connection = connection;
    }
    async handleIdentifier(email, useragent) {
        try {
            const user = await this.userService.handleGetUserByEmail(email, ['_id']);
            if (!user)
                return null;
            const TLEncrypt = this.cryptoService.generateAccessToken({ accountId: user._id, ...useragent, exp: 300 });
            return TLEncrypt;
        }
        catch (error) {
            console.error('func handleIdentifier - Error occurred while fetching user:', error.message);
            throw new common_1.InternalServerErrorException('An error occurred while processing your request');
        }
    }
    async handleGetAccountsSID(sidStr, aisStr) {
        try {
            const accounts = this.cryptoService.decodeAIS(aisStr);
            const session = sidStr ? await this.sessionService.handleGetSession(sidStr, ['accountId']) : undefined;
            const data = await Promise.all(accounts.map(async (accountId) => {
                const user = await this.userService.handleGetUser(new mongoose_1.Types.ObjectId(accountId), ['email', 'name', 'picture']);
                if (!user)
                    return null;
                return {
                    sub: accountId,
                    email: user.email,
                    name: user.name,
                    picture: user.picture,
                    signed_out: session && session.accountId.toString().includes(accountId.toString()) ? false : true,
                };
            }));
            const containsNull = data.some((item) => item === null);
            if (!containsNull) {
                return { data: data, newAIS: null };
            }
            else {
                const filteredData = data.filter((item) => item !== null);
                const validAccountSet = new Set(filteredData.map((item) => item.sub));
                const validAccounts = accounts.filter((accountId) => validAccountSet.has(accountId));
                const aisEncrypted = this.cryptoService.encodeAIS(validAccounts);
                return { data: filteredData, newAIS: aisEncrypted };
            }
        }
        catch (error) {
            console.error('handleAccountsSID: ', error.message);
            throw new common_1.InternalServerErrorException('An error occurred while fetching user data');
        }
    }
    async handleSignoutOfAllAccounts(sidStr) {
        try {
            if (!sidStr)
                throw new common_1.UnauthorizedException('No account found in session. Please log in again');
            this.cryptoService.decrypt(sidStr);
            await this.sessionService.handleDeleteSession(sidStr);
            await this.tokenService.handleDeleteAllTokensByFields(sidStr, null, null);
        }
        catch (error) {
            if (error instanceof common_1.UnauthorizedException)
                throw error;
            console.error('func handleSignoutOfAllAccounts - Error: ', error.message);
            throw new common_1.InternalServerErrorException(error.message);
        }
    }
    async handleSigninWithSID(accountId, sidStr) {
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
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException || error instanceof common_1.NotFoundException)
                throw error;
            console.error('func handleSigninWithSID - Error: ', error.message);
            throw new common_1.InternalServerErrorException(error.message);
        }
        finally {
        }
    }
    async handleSigninWithPassword(accountId, password, os, device, browser, ip, sidStr, aisStr = null) {
        const transaction = await this.connection.startSession();
        transaction.startTransaction();
        try {
            const accounts = aisStr ? this.cryptoService.decodeAIS(aisStr) : [];
            if (accounts.length >= 10)
                throw new common_1.UnauthorizedException({ message: 'Session limit reached' });
            const user = await this.userService.handleGetUser(accountId, ['_id', 'email', 'name', 'firstName', 'lastName', 'password', 'picture']);
            if (!user)
                throw new common_1.NotFoundException({ message: 'User not found' });
            if (!bcrypt.compareSync(password, user.password))
                throw new common_1.UnauthorizedException({ message: 'Invalid password' });
            if (!accounts.includes(user._id.toString()))
                accounts.push(user._id.toString());
            const session = sidStr
                ? await this.sessionService.handleUpdateSessionOrCreateNew(sidStr, user._id, os, device, browser, ip, transaction)
                : await this.sessionService.handleCreateSession(os, device, browser, ip, user._id, common_2.constants.EXPIRED_SID, transaction);
            const aisEncrypted = this.cryptoService.encodeAIS(accounts);
            await transaction.commitTransaction();
            return { newSID: session._id, newAIS: aisEncrypted };
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
    async handleRemoveAccountSessionClient(accountId, sidStr, aisStr) {
        try {
            if (sidStr)
                throw new common_1.ConflictException('Session ID is already provided, which indicates session persistence on the browser');
            if (!aisStr)
                throw new common_1.UnauthorizedException('No account exists in session. Please log in again');
            const accounts = this.cryptoService.decodeAIS(aisStr);
            const user = await this.userService.handleGetUser(accountId, ['_id', 'email', 'name', 'picture']);
            if (!user)
                throw new common_1.NotFoundException('User not found');
            const newAccounts = accounts.filter((id) => id !== user._id.toString());
            const newAisStr = this.cryptoService.encodeAIS(newAccounts);
            return { newAccounts, newAisStr };
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException || error instanceof common_1.ConflictException || error instanceof common_1.UnauthorizedException)
                throw error;
            console.error('func handleRemoveAccountSIDClient - Error: ', error.message);
            throw new common_1.InternalServerErrorException(error.message);
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(4, (0, mongoose_2.InjectConnection)()),
    __metadata("design:paramtypes", [user_service_1.UserService,
        session_service_1.SessionService,
        token_service_1.TokenService,
        common_2.CryptoService,
        mongoose_1.Connection])
], AuthService);
//# sourceMappingURL=auth.service.js.map