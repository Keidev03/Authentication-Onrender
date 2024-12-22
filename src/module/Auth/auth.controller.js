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
const common_2 = require("../../common");
const auth_service_1 = require("./auth.service");
const user_service_1 = require("../User/user.service");
const dto_1 = require("./dto");
const mongoose_1 = require("mongoose");
const throttler_1 = require("@nestjs/throttler");
let AuthController = class AuthController {
    constructor(authService, userService, cryptoService) {
        this.authService = authService;
        this.userService = userService;
        this.cryptoService = cryptoService;
    }
    async getIdentifier(query, useragent) {
        if (query.email) {
            const TLEncrypt = await this.authService.handleIdentifier(query.email, useragent);
            if (!TLEncrypt)
                throw new common_1.NotFoundException("Can't find your Lone account");
            return { TL: TLEncrypt };
        }
        if (query.TL) {
            const { os, device, browser, ip } = useragent;
            const TLDecrypt = this.cryptoService.validateAccessToken(query.TL);
            if (!TLDecrypt)
                throw new common_1.UnauthorizedException('Invalid or expired TL');
            if (browser !== TLDecrypt.browser || device !== TLDecrypt.device || os !== TLDecrypt.os || ip !== TLDecrypt.ip) {
                throw new common_1.ForbiddenException('TL mismatch with current device');
            }
            const user = await this.userService.handleGetUser(TLDecrypt.accountId, ['email', 'name', 'picture']);
            if (!user)
                throw new common_1.NotFoundException('User not found');
            return { email: user.email, name: user.name, picture: user.picture };
        }
        throw new common_1.BadRequestException('Missing required query parameter: email or TL');
    }
    async getAccountsSID(sidStr, aisStr, response) {
        if (!aisStr)
            throw new common_1.BadRequestException('AIS cookie is missing. Please log in again.');
        const { data, newAIS } = await this.authService.handleGetAccountsSID(sidStr, aisStr);
        newAIS && response.cookie('AIS', newAIS, { maxAge: common_2.constants.EXPIRED_SID * 1000, path: '/' });
        return response.json(data);
    }
    async removeAccountSIDClient(accountId, sidStr, aisStr, response) {
        const { newAccounts, newAisStr } = await this.authService.handleRemoveAccountSessionClient(accountId, sidStr, aisStr);
        newAccounts.length > 0 ? response.cookie('AIS', newAisStr, { maxAge: 2 * 365 * 24 * 60 * 60 * 1000, httpOnly: true, path: '/' }) : response.clearCookie('AIS', { path: '/' });
        return response.sendStatus(204);
    }
    async postOAuth2SigninSession(query, body, sidStr) {
        await this.authService.handleSigninWithSID(body.sub, sidStr);
        return { uri: query.continue };
    }
    async postOAuth2SigninPassword(query, body, sidStr, aisStr, useragent, response) {
        const TLDecrypt = this.cryptoService.validateAccessToken(body.TL);
        if (!TLDecrypt || useragent.browser !== TLDecrypt.browser || useragent.device !== TLDecrypt.device || useragent.os !== TLDecrypt.os || useragent.ip !== TLDecrypt.ip)
            throw new common_1.BadRequestException('Detected');
        const { newSID, newAIS } = await this.authService.handleSigninWithPassword(TLDecrypt.accountId, body.password, TLDecrypt.os, TLDecrypt.device, TLDecrypt.browser, TLDecrypt.ip, sidStr, aisStr);
        response.cookie('SID', newSID, { maxAge: common_2.constants.EXPIRED_SID * 1000, httpOnly: true, path: '/' });
        response.cookie('AIS', newAIS, { maxAge: common_2.constants.EXPIRED_SID * 1000, httpOnly: true, path: '/' });
        return response.json({ uri: query.continue });
    }
    async getSignoutOfAllAccounts(sidStr, response) {
        await this.authService.handleSignoutOfAllAccounts(sidStr);
        response.clearCookie('SID');
        return response.sendStatus(204);
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
    (0, common_1.Get)('accounts'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_2.Cookies)('SID')),
    __param(1, (0, common_2.Cookies)('AIS')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getAccountsSID", null);
__decorate([
    (0, common_1.Delete)('accounts/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_2.Cookies)('SID')),
    __param(2, (0, common_2.Cookies)('AIS')),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [mongoose_1.Types.ObjectId, String, String, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "removeAccountSIDClient", null);
__decorate([
    (0, common_1.Post)('signin/session'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_2.Cookies)('SID')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.DAuthQuery, dto_1.DAuthBodySession, String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "postOAuth2SigninSession", null);
__decorate([
    (0, throttler_1.Throttle)({ default: { limit: 1, ttl: 5000 } }),
    (0, common_1.Post)('signin/password'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_2.Cookies)('SID')),
    __param(3, (0, common_2.Cookies)('AIS')),
    __param(4, (0, common_2.UserAgent)()),
    __param(5, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.DAuthQuery,
        dto_1.DAuthBodyPassword, String, String, Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "postOAuth2SigninPassword", null);
__decorate([
    (0, common_1.Get)('accounts/signout'),
    __param(0, (0, common_2.Cookies)('SID')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getSignoutOfAllAccounts", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        user_service_1.UserService,
        common_2.CryptoService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map