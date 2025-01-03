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
exports.TokenController = void 0;
const common_1 = require("@nestjs/common");
const token_service_1 = require("./token.service");
const tokenOAuth2Query_1 = require("./dto/tokenOAuth2Query");
const common_2 = require("../../common");
let TokenController = class TokenController {
    constructor(tokenService) {
        this.tokenService = tokenService;
    }
    async getAccessToken(body) {
        const data = body.grantType === common_2.EOAuth2GrantType.AUTHORIZATION_CODE
            ? this.tokenService.handleGetAccessTokenByAuthorizationCodeGrant(body.clientId, body.clientSecret, body.code, body.redirectUri)
            : this.tokenService.handleGetAccessTokenByRefreshTokenGrant(body.clientId, body.clientSecret, body.refreshToken, body.redirectUri);
        return data;
    }
    async getAllTokens() {
        return this.tokenService.handleFindTokens(100, undefined, ['_id', 'sid', 'clientId', 'accountId', 'scope', 'expiredAt', 'createdAt', 'updatedAt']);
    }
    async getToken(id) {
        return this.tokenService.handleFindOneToken(id, ['_id', 'sid', 'clientId', 'accountId', 'scope', 'expiredAt', 'createdAt', 'updatedAt']);
    }
    async deleteToken(id) {
        return this.tokenService.handleDeleteToken(id);
    }
};
exports.TokenController = TokenController;
__decorate([
    (0, common_1.Post)(),
    (0, common_2.SkipCors)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [tokenOAuth2Query_1.DTokenOAuth2Query]),
    __metadata("design:returntype", Promise)
], TokenController.prototype, "getAccessToken", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TokenController.prototype, "getAllTokens", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TokenController.prototype, "getToken", null);
__decorate([
    (0, common_1.Delete)('delete/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TokenController.prototype, "deleteToken", null);
exports.TokenController = TokenController = __decorate([
    (0, common_1.Controller)('token'),
    __metadata("design:paramtypes", [token_service_1.TokenService])
], TokenController);
//# sourceMappingURL=token.controller.js.map