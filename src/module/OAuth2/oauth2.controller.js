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
exports.OAuth2Controller = void 0;
const common_1 = require("@nestjs/common");
const throttler_1 = require("@nestjs/throttler");
const common_2 = require("../../common");
const dto_1 = require("./dto");
const oauth2_service_1 = require("./oauth2.service");
const config_1 = require("@nestjs/config");
let OAuth2Controller = class OAuth2Controller {
    constructor(oauth2Service, cryptoService, configService) {
        this.oauth2Service = oauth2Service;
        this.cryptoService = cryptoService;
        this.configService = configService;
    }
    async postOAuth2SigninSession(query, body, sidStr) {
        if ((query.responseType.includes(common_2.EOAuth2ResponseType.ID_TOKEN) || query.scope.includes(common_2.EOAuth2Scope.OPENID)) && !query.nonce) {
            throw new common_1.BadRequestException({
                error: 'invalid_request',
                error_description: 'The "nonce" parameter is required when requesting an ID token.',
            });
        }
        const data = await this.oauth2Service.handleSigninWithSID(body.authuser, query.clientId, query.redirectUri, query.responseType, query.scope, query.accessType, query.prompt, query.nonce, query.state, sidStr);
        return {
            uri: query.redirectUri,
            clientName: data.clientName,
            clientPicture: data.clientPicture,
            email: data.email,
            picture: data.picture,
            consent: data.consent,
            ...(query.responseMode === common_2.EOAuth2ResponseMode.QUERY && { query: this.oauth2Service.buildResponse(data, query.state, query.scope, query.prompt) }),
            ...(query.responseMode === common_2.EOAuth2ResponseMode.FRAGMENT && { fragment: this.oauth2Service.buildResponse(data, query.state, query.scope, query.prompt) }),
            ...(query.responseMode === common_2.EOAuth2ResponseMode.FORM_POST && { form: this.oauth2Service.buildResponse(data, query.state, query.scope, query.prompt) }),
        };
    }
    async postOAuth2SigninPassword(query, body, sidStr, useragent, response) {
        if ((query.responseType.includes(common_2.EOAuth2ResponseType.ID_TOKEN) || query.scope.includes(common_2.EOAuth2Scope.OPENID)) && !query.nonce) {
            throw new common_1.BadRequestException({
                error: 'invalid_request',
                error_description: 'The "nonce" parameter is required when requesting an ID token.',
            });
        }
        const TLDecrypt = this.cryptoService.validateAccessToken(body.TL);
        if (!TLDecrypt || useragent.browser !== TLDecrypt.browser || useragent.device !== TLDecrypt.device || useragent.os !== TLDecrypt.os || useragent.ip !== TLDecrypt.ip)
            throw new common_1.BadRequestException('Detected');
        const data = await this.oauth2Service.handleSigninWithPassword(TLDecrypt.accountId, body.password, query.clientId, query.redirectUri, query.responseType, query.scope, query.accessType, query.prompt, query.nonce, query.state, TLDecrypt.os, TLDecrypt.device, TLDecrypt.browser, TLDecrypt.ip, sidStr);
        const cookieOptions = {
            ...(this.configService.get('BUN_ENV') === 'PRODUCTION' && { domain: this.configService.get('COOKIE_DOMAIN') }),
            maxAge: common_2.constants.EXPIRED_SID * 1000,
            httpOnly: true,
            path: '/',
        };
        response.cookie('SID', data.newSID, cookieOptions);
        const payload = {
            uri: data.redirectUri,
            clientName: data.clientName,
            clientPicture: data.clientPicture,
            email: data.email,
            picture: data.picture,
            consent: data.consent,
            ...(query.responseMode === common_2.EOAuth2ResponseMode.QUERY && { query: this.oauth2Service.buildResponse(data, query.state, query.scope, query.prompt) }),
            ...(query.responseMode === common_2.EOAuth2ResponseMode.FRAGMENT && { fragment: this.oauth2Service.buildResponse(data, query.state, query.scope, query.prompt) }),
            ...(query.responseMode === common_2.EOAuth2ResponseMode.FORM_POST && { form: this.oauth2Service.buildResponse(data, query.state, query.scope, query.prompt) }),
        };
        return response.json(payload);
    }
};
exports.OAuth2Controller = OAuth2Controller;
__decorate([
    (0, common_1.Post)('session/signin/sid'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_2.Cookies)('SID')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.DOAuth2Query, dto_1.DOAuth2BodySession, String]),
    __metadata("design:returntype", Promise)
], OAuth2Controller.prototype, "postOAuth2SigninSession", null);
__decorate([
    (0, throttler_1.Throttle)({ default: { limit: 1, ttl: 5000 } }),
    (0, common_1.Post)('session/signin/pwd'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_2.Cookies)('SID')),
    __param(3, (0, common_2.UserAgent)()),
    __param(4, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.DOAuth2Query,
        dto_1.DOAuth2BodyPassword, String, Object, Object]),
    __metadata("design:returntype", Promise)
], OAuth2Controller.prototype, "postOAuth2SigninPassword", null);
exports.OAuth2Controller = OAuth2Controller = __decorate([
    (0, common_1.Controller)('oauth2'),
    __metadata("design:paramtypes", [oauth2_service_1.OAuth2Service,
        common_2.CryptoService,
        config_1.ConfigService])
], OAuth2Controller);
//# sourceMappingURL=oauth2.controller.js.map