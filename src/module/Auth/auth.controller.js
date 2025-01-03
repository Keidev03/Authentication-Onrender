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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const throttler_1 = require("@nestjs/throttler");
const common_2 = require("../../common");
const dto_1 = require("./dto");
const account_service_1 = require("../Account/account.service");
const auth_service_1 = require("./auth.service");
const config_1 = require("@nestjs/config");
let AuthController = class AuthController {
    constructor(authService, accountService, cryptoService, configService) {
        this.authService = authService;
        this.accountService = accountService;
        this.cryptoService = cryptoService;
        this.configService = configService;
    }
    async getIdentifier(query, useragent) {
        if (query.email) {
            return this.authService.handleIdentifier(query.email, query.purpose, useragent);
        }
        if (query.TL) {
            const { os, device, browser, ip } = useragent;
            const TLDecrypt = this.cryptoService.validateAccessToken(query.TL);
            if (!TLDecrypt)
                throw new common_1.UnauthorizedException('Invalid or expired TL');
            if (browser !== TLDecrypt.browser || device !== TLDecrypt.device || os !== TLDecrypt.os || ip !== TLDecrypt.ip)
                throw new common_1.ForbiddenException('TL mismatch with current device');
            const user = await this.accountService.handleFindOneAccount(TLDecrypt.accountId, ['email', 'name', 'picture']);
            return {
                email: user.email,
                name: user.name,
                picture: user.picture ? (user.picture.includes('https://lh3.googleusercontent.com') ? user.picture : `https://lh3.googleusercontent.com/d/${user.picture}=s96-c`) : null,
            };
        }
        throw new common_1.BadRequestException({ message: 'Missing required query parameter: email or TL' });
    }
    async getAccountinSession(query, sidStr, apiSidStr, response) {
        const { accounts, newAPISID } = await this.authService.handleGetAccountinSession(sidStr, query.authuser, apiSidStr);
        const cookieOptions = {
            ...(this.configService.get('BUN_ENV') === 'PRODUCTION' && { domain: this.configService.get('COOKIE_DOMAIN') }),
            maxAge: common_2.constants.EXPIRED_SID * 1000,
            httpOnly: true,
            path: '/',
        };
        newAPISID && response.cookie('APISID', newAPISID, cookieOptions);
        return response.json(accounts);
    }
    async removeAccountinSession(authuser, sidStr) {
        const accounts = await this.authService.handleRemoveAccountinSession(authuser, sidStr);
        return { accounts };
    }
    async postOAuth2SigninSession(query, body, sidStr) {
        await this.authService.handleSigninWithSID(body.authuser, sidStr);
        return { uri: query.continue };
    }
    async postOAuth2SigninPassword(query, body, sidStr, useragent, response) {
        const TLDecrypt = this.cryptoService.validateAccessToken(body.TL);
        if (!TLDecrypt || useragent.browser !== TLDecrypt.browser || useragent.device !== TLDecrypt.device || useragent.os !== TLDecrypt.os || useragent.ip !== TLDecrypt.ip)
            throw new common_1.BadRequestException('Detected');
        const { newSID } = await this.authService.handleSigninWithPassword(TLDecrypt.accountId, body.password, TLDecrypt.os, TLDecrypt.device, TLDecrypt.browser, TLDecrypt.ip, sidStr);
        const cookieOptions = {
            ...(this.configService.get('BUN_ENV') === 'PRODUCTION' && { domain: this.configService.get('COOKIE_DOMAIN') }),
            maxAge: common_2.constants.EXPIRED_SID * 1000,
            httpOnly: true,
            path: '/',
        };
        response.cookie('SID', newSID, cookieOptions);
        return response.json({ uri: query.continue });
    }
    async getSignoutOfAllAccounts(sidStr) {
        await this.authService.handleSignoutAllAccounts(sidStr);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_2.UserAgent)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.DAuthIdentifier, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getIdentifier", null);
__decorate([
    (0, common_1.Get)('session/accounts'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_2.Cookies)('SID')),
    __param(2, (0, common_2.Cookies)('APISID')),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.DAuthSessionInBrowser, String, String, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getAccountinSession", null);
__decorate([
    (0, common_1.Delete)('session/accounts/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.ACCEPTED),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_2.Cookies)('SID')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "removeAccountinSession", null);
__decorate([
    (0, common_1.Post)('session/signin/sid'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_2.Cookies)('SID')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.DAuthQuery, dto_1.DAuthBodySession, String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "postOAuth2SigninSession", null);
__decorate([
    (0, throttler_1.Throttle)({ default: { limit: 1, ttl: 5000 } }),
    (0, common_1.Post)('session/signin/pwd'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_2.Cookies)('SID')),
    __param(3, (0, common_2.UserAgent)()),
    __param(4, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.DAuthQuery,
        dto_1.DAuthBodyPassword, String, Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "postOAuth2SigninPassword", null);
__decorate([
    (0, common_1.Get)('session/signout'),
    (0, common_1.HttpCode)(common_1.HttpStatus.ACCEPTED),
    __param(0, (0, common_2.Cookies)('SID')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getSignoutOfAllAccounts", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        account_service_1.AccountService,
        common_2.CryptoService,
        config_1.ConfigService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map