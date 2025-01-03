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
exports.AccountController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const common_2 = require("../../common");
const dto_1 = require("./dto");
const account_service_1 = require("./account.service");
let AccountController = class AccountController {
    constructor(accountService, connection) {
        this.accountService = accountService;
        this.connection = connection;
    }
    async getAllAccounts() {
        return this.accountService.handleFindAccounts(1, 100, [
            '_id',
            'email',
            'firstName',
            'lastName',
            'name',
            'password',
            'roles',
            'dateOfBirth',
            'gender',
            'phone',
            'address',
            'location',
            'language',
            'picture',
            'clientId',
            'state',
            'verification',
            'processing',
            'expiredAt',
            'createdAt',
            'updatedAt',
        ]);
    }
    async getAccount() {
        const _id = new mongoose_2.Types.ObjectId();
        const userProfile = await this.accountService.handleFindOneAccount(_id, [
            '_id',
            'email',
            'firstName',
            'lastName',
            'name',
            'password',
            'roles',
            'dateOfBirth',
            'gender',
            'phone',
            'address',
            'location',
            'language',
            'picture',
            'clientId',
            'state',
            'verification',
            'processing',
            'expiredAt',
            'createdAt',
            'updatedAt',
        ]);
        const picture = userProfile.picture
            ? userProfile.picture.includes('https://lh3.googleusercontent.com')
                ? userProfile.picture
                : `https://lh3.googleusercontent.com/d/${userProfile.picture}=s96-c`
            : null;
        return {
            email: userProfile.id,
            name: userProfile.name,
            firstName: userProfile.firstName,
            lastName: userProfile.lastName,
            picture: picture,
            roles: userProfile.roles,
            gender: userProfile.gender,
            dateOfBirth: userProfile.dateOfBirth,
        };
    }
    async patchAccount(body, picture) {
        const _id = new mongoose_2.Types.ObjectId('64a2b1f4c8e1e6a4f2a1d3b5');
        const { email, firstName, lastName, name, oldPassword, newPassword, roles, dateOfBirth, gender, phone, address, location, language, clientId, state, verification, processing, expiredAt, keepSignedIn, } = body;
        return this.accountService.handleUpdateAccount(_id, {
            email,
            firstName,
            lastName,
            name,
            oldPassword,
            newPassword,
            roles,
            dateOfBirth,
            gender,
            phone,
            address,
            location,
            language,
            clientId,
            state,
            verification,
            processing,
            expiredAt,
            keepSignedIn,
        }, picture, true);
    }
    async deleteAccount() {
        const _id = new mongoose_2.Types.ObjectId();
        await this.accountService.handleDeleteAccount(_id);
    }
    async postAccount(data) {
        await this.accountService.handleSaveAccount(data.email, data.firstName, data.lastName, data.name, data.dateOfBirth, data.gender, data.password);
    }
    async getResetPassword(email) {
        if (!email)
            throw new common_1.BadRequestException('Email is required');
        await this.accountService.handleResetPassword(email);
    }
    async getRevokeAccount(body, sidStr) {
        await this.accountService.handleRevokeAuthorization(body.clientId, body.accountId, sidStr);
    }
};
exports.AccountController = AccountController;
__decorate([
    (0, common_1.Get)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AccountController.prototype, "getAllAccounts", null);
__decorate([
    (0, common_1.Get)('profile'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AccountController.prototype, "getAccount", null);
__decorate([
    (0, common_1.Patch)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('picture')),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFile)(new common_1.ParseFilePipe({
        validators: [
            new common_2.FileSizeValidator({
                multiple: false,
                maxSizeBytes: 5 * 1024 * 1024,
            }),
            new common_2.FileTypeValidator({
                multiple: false,
                filetype: /^image\/(jpeg|png)$/i,
            }),
        ],
        fileIsRequired: false,
    }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.DAccountBodyPatch, Object]),
    __metadata("design:returntype", Promise)
], AccountController.prototype, "patchAccount", null);
__decorate([
    (0, common_1.Delete)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AccountController.prototype, "deleteAccount", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.DAccountBodyPost]),
    __metadata("design:returntype", Promise)
], AccountController.prototype, "postAccount", null);
__decorate([
    (0, common_1.Get)('reset/password'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Query)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AccountController.prototype, "getResetPassword", null);
__decorate([
    (0, common_1.Post)('revoke'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_2.Cookies)('SID')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.DAccountBodyRevoke, String]),
    __metadata("design:returntype", Promise)
], AccountController.prototype, "getRevokeAccount", null);
exports.AccountController = AccountController = __decorate([
    (0, common_1.Controller)('account'),
    __param(1, (0, mongoose_1.InjectConnection)()),
    __metadata("design:paramtypes", [account_service_1.AccountService,
        mongoose_2.Connection])
], AccountController);
//# sourceMappingURL=account.controller.js.map