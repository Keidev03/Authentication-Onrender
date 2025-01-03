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
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const mongoose_2 = require("@nestjs/mongoose");
const bcrypt = require("bcryptjs");
const common_2 = require("../../common");
const session_service_1 = require("../Session/session.service");
const account_service_1 = require("../Account/account.service");
let AuthService = AuthService_1 = class AuthService {
    constructor(accountService, sessionService, cryptoService, connection) {
        this.accountService = accountService;
        this.sessionService = sessionService;
        this.cryptoService = cryptoService;
        this.connection = connection;
        this.logger = new common_1.Logger(AuthService_1.name);
    }
    async handleIdentifier(email, purpose, useragent) {
        try {
            const account = await this.accountService.handleFindOneAccountByEmail(email, ['_id']);
            if (purpose === common_2.EPurpose.LOGIN) {
                const TL = this.cryptoService.generateAccessToken({ accountId: account._id, ...useragent, exp: 300 });
                return { TL: TL };
            }
            if (purpose === common_2.EPurpose.REGISTER)
                throw new common_1.ConflictException({ message: 'Email already registered' });
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException && purpose === common_2.EPurpose.REGISTER)
                return { status: 'available', email: email };
            if (error instanceof common_1.NotFoundException || error instanceof common_1.ConflictException)
                throw error;
            throw new common_1.InternalServerErrorException({ message: 'An error occurred while processing your request' });
        }
    }
    async handleGetAccountinSession(sidStr, authuser, apiSidStr) {
        try {
            const session = await this.sessionService.handleFindAccontsInOneSession(sidStr, ['linkedAccountIds'], ['_id', 'email', 'name', 'picture']);
            if (authuser >= session.linkedAccountIds.length)
                throw new common_1.BadRequestException({ message: "Invalid 'authuser' value" });
            if (session.linkedAccountIds[authuser].state !== common_2.EAuthState.SIGNED_IN)
                throw new common_1.UnauthorizedException({ message: 'The account is not signed in. Please sign in to continue.' });
            const accounts = session.linkedAccountIds.map((account, index) => {
                if (account.primary && account.state !== common_2.EAuthState.SIGNED_IN)
                    throw new common_1.UnauthorizedException({ message: 'The primary account is not signed in. Please sign in to continue.' });
                return {
                    primary: account.primary ? true : false,
                    authuser: index,
                    email: account._id.email,
                    name: account._id.name,
                    picture: account._id.picture
                        ? account._id.picture.includes('https://lh3.googleusercontent.com')
                            ? account._id.picture
                            : `https://lh3.googleusercontent.com/d/${account._id.picture}=s96-c`
                        : undefined,
                    state: account.state,
                };
            });
            const APISID = apiSidStr && this.cryptoService.validateSignature(apiSidStr);
            const currentSub = session.linkedAccountIds[authuser]._id._id.toString();
            const newAPISID = !APISID || APISID.sub !== currentSub ? this.cryptoService.generateSignature({ sub: currentSub, exp: common_2.constants.EXPIRED_SINGATURE }) : undefined;
            return { accounts, newAPISID };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException || error instanceof common_1.BadRequestException || error instanceof common_1.UnauthorizedException)
                throw error;
            throw new common_1.InternalServerErrorException({ message: 'An error occurred while fetching user data' });
        }
    }
    async handleSigninWithSID(authuser, sidStr) {
        try {
            const accountId = await this.sessionService.hanldeFindOneAccountInSessionByAuthUser(authuser, sidStr);
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
            await this.sessionService.handleSetLinkedAccountState(sidStr, accountId, common_2.EAuthState.SIGNED_OUT);
        }
        catch (error) {
            if (error instanceof common_1.UnauthorizedException)
                throw error;
            throw new common_1.InternalServerErrorException(error.message);
        }
    }
    async handleSignoutAllAccounts(sidStr) {
        try {
            await this.sessionService.handleSetAllLinkedAccountsState(sidStr, common_2.EAuthState.SIGNED_OUT);
        }
        catch (error) {
            if (error instanceof common_1.UnauthorizedException)
                throw error;
            throw new common_1.InternalServerErrorException(error.message);
        }
    }
    async handleRemoveAccountinSession(authuser, sidStr) {
        try {
            const accountId = await this.sessionService.hanldeFindOneAccountInSessionByAuthUser(authuser, sidStr);
            const session = await this.sessionService.handlePullAccountIdsLinkedFromSession(sidStr, accountId, [common_2.EAuthState.SIGNED_OUT, common_2.EAuthState.SESSION_EXPIRED, common_2.EAuthState.INACTIVE], true);
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
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(3, (0, mongoose_2.InjectConnection)()),
    __metadata("design:paramtypes", [account_service_1.AccountService,
        session_service_1.SessionService,
        common_2.CryptoService,
        mongoose_1.Connection])
], AuthService);
//# sourceMappingURL=auth.service.js.map