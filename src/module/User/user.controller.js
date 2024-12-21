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
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const common_2 = require("../../common");
const dto_1 = require("./dto");
const userPost_dto_1 = require("./dto/userPost.dto");
const user_service_1 = require("./user.service");
const mongoose_1 = require("mongoose");
let UserController = class UserController {
    constructor(userService) {
        this.userService = userService;
    }
    async getAllUser() {
        return this.userService.handleGetAllUsers(1, 100, ['_id', 'name', 'firstName', 'lastName', 'picture', 'roles', 'verified', 'gender', 'dateOfBirth']);
    }
    async getUser() {
        const _id = new mongoose_1.Types.ObjectId();
        const userProfile = await this.userService.handleGetUser(_id, ['_id', 'name', 'firstName', 'lastName', 'picture', 'roles', 'verified', 'gender', 'dateOfBirth']);
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
            verified: userProfile.verified,
            gender: userProfile.gender,
            dateOfBirth: userProfile.dateOfBirth,
        };
    }
    async patchUser(body, picture) {
        const _id = new mongoose_1.Types.ObjectId();
        const { email, firstName, lastName, name, oldPassword, password, roles, verified, dateOfBirth, gender, phone, address, clientId } = body;
        await this.userService.handleUpdateUser(_id, { email, firstName, lastName, name, oldPassword, password, roles, verified, dateOfBirth, gender, phone, address, clientId }, picture || null);
    }
    async deleteUser() {
        const _id = new mongoose_1.Types.ObjectId();
        await this.userService.handleDeleteUser(_id);
    }
    async postUser(data) {
        await this.userService.handleCreateUser(data.email, data.firstName, data.lastName, data.name, data.dateOfBirth, data.gender, data.password, data.phone);
    }
    async getResetPassword(email) {
        if (!email)
            throw new common_1.BadRequestException('Email is required');
        await this.userService.handleResetPassword(email);
    }
};
exports.UserController = UserController;
__decorate([
    (0, common_1.Get)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getAllUser", null);
__decorate([
    (0, common_1.Get)('profile'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUser", null);
__decorate([
    (0, common_1.Patch)('update'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
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
    }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.DUserPatch, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "patchUser", null);
__decorate([
    (0, common_1.Delete)('delete'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserController.prototype, "deleteUser", null);
__decorate([
    (0, common_1.Post)('create'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [userPost_dto_1.DUserPost]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "postUser", null);
__decorate([
    (0, common_1.Get)('reset/password'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Query)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getResetPassword", null);
exports.UserController = UserController = __decorate([
    (0, common_1.Controller)('user'),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
//# sourceMappingURL=user.controller.js.map