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
const mongoose_2 = require("@nestjs/mongoose");
const bcrypt = require("bcryptjs");
const common_2 = require("../../common");
const session_service_1 = require("../Session/session.service");
const account_service_1 = require("../Account/account.service");
let AuthService = class AuthService {
    constructor(accountService, sessionService, cryptoService, connection) {
        this.accountService = accountService;
        this.sessionService = sessionService;
        this.cryptoService = cryptoService;
        this.connection = connection;
    }
    async handleIdentifier(email, useragent) {
        try {
            const account = await this.accountService.handleFindOneAccountByEmail(email, ['_id']);
            const TLEncrypt = this.cryptoService.generateAccessToken({ accountId: account._id, ...useragent, exp: 300 });
            return TLEncrypt;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException)
                throw error;
            throw new common_1.InternalServerErrorException({ message: 'An error occurred while processing your request' });
        }
    }
    async handleGetAccountsSID(sidStr) {
        try {
            const session = await this.sessionService.handleFindOneSession(sidStr, ['linkedAccountIds'], ['_id', 'email', 'name', 'picture']);
            return session.linkedAccountIds.map((account, index) => ({
                primary: account.primary,
                authuser: index,
                email: account._id.email,
                name: account._id.name,
                picture: account._id.picture
                    ? account._id.picture.includes('https://lh3.googleusercontent.com')
                        ? account._id.picture
                        : `https://lh3.googleusercontent.com/d/${account._id.picture}=s96-c`
                    : null,
                signedOut: account.signedOut,
            }));
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException)
                throw error;
            throw new common_1.InternalServerErrorException({ message: 'An error occurred while fetching user data' });
        }
    }
    async handleSigninWithSID(authuser, sidStr) {
        try {
            const accountId = await this.sessionService.hanldeFindOneAccountInSession(authuser, sidStr);
            await this.accountService.handleFindOneAccount(accountId, ['_id', 'email', 'name', 'firstName', 'lastName', 'password', 'picture']);
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException || error instanceof common_1.NotFoundException)
                throw error;
            throw new common_1.InternalServerErrorException({ message: 'An error occurred while fetching user data' });
        }
    }
    async handleSigninWithPassword(accountId, password, os, device, browser, ip, sidStr) {
        const transaction = await this.connection.startSession();
        transaction.startTransaction();
        try {
            const account = await this.accountService.handleFindOneAccount(accountId, ['_id', 'email', 'name', 'firstName', 'lastName', 'password', 'picture']);
            if (!bcrypt.compareSync(password, account.password))
                throw new common_1.UnauthorizedException({ message: 'Invalid password' });
            const session = await this.sessionService.handleFindOneAndCreateOrUpdateSession(sidStr, account._id, os, device, browser, ip, transaction);
            await transaction.commitTransaction();
            return { newSID: session._id };
        }
        catch (error) {
            await transaction.abortTransaction();
            if (error instanceof common_1.UnauthorizedException || error instanceof common_1.BadRequestException || error instanceof common_1.NotFoundException)
                throw error;
            throw new common_1.InternalServerErrorException(error.message);
        }
        finally {
            transaction.endSession();
        }
    }
    async handleSignOut(accountId, sidStr) {
        try {
            await this.sessionService.handleSetLinkedAccountSignOut(sidStr, accountId, true);
        }
        catch (error) {
            if (error instanceof common_1.UnauthorizedException)
                throw error;
            throw new common_1.InternalServerErrorException(error.message);
        }
    }
    async handleSignoutAllAccounts(sidStr) {
        try {
            await this.sessionService.handleSetAllLinkedAccountsSignOut(sidStr, true);
        }
        catch (error) {
            if (error instanceof common_1.UnauthorizedException)
                throw error;
            throw new common_1.InternalServerErrorException(error.message);
        }
    }
    async handleRemoveAccountInSession(authuser, sidStr) {
        try {
            const accountId = await this.sessionService.hanldeFindOneAccountInSession(authuser, sidStr);
            const session = await this.sessionService.handlePullAccountIdsLinkedFromSession(sidStr, accountId, true, true);
            return session;
        }
        catch (error) {
            if (error instanceof common_1.UnauthorizedException)
                throw error;
            throw new common_1.InternalServerErrorException(error.message);
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(3, (0, mongoose_2.InjectConnection)()),
    __metadata("design:paramtypes", [account_service_1.AccountService,
        session_service_1.SessionService,
        common_2.CryptoService,
        mongoose_1.Connection])
], AuthService);
//# sourceMappingURL=auth.service.js.map