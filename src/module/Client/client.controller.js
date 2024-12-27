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
exports.ClientController = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const client_service_1 = require("./client.service");
const dto_1 = require("./dto");
const common_2 = require("../../common");
const platform_express_1 = require("@nestjs/platform-express");
let ClientController = class ClientController {
    constructor(clientService) {
        this.clientService = clientService;
    }
    async getAllClients() {
        return this.clientService.handleFindClients(1, 100, ['name', 'clientSecret', 'owner', 'editor', 'scopes', 'active', 'redirectUris']);
    }
    async getClient(id) {
        return this.clientService.handleFindOneClient(id, ['name', 'clientSecret', 'owner', 'editor', 'scopes', 'active', 'redirectUris']);
    }
    async postClient(body) {
        const accountId = new mongoose_1.Types.ObjectId();
        return this.clientService.handleSaveClient(accountId, body.name, body.scopes, body.redirect_uris);
    }
    async patchClient(id, body, picture) {
        const accountId = new mongoose_1.Types.ObjectId();
        const { name, clientSecret, active, editor, scopes, redirectUris, privacyPolicy, termsOfService } = body;
        return this.clientService.handleUpdateClient(id, accountId, { name, clientSecret, active, editor, scopes, redirectUris, privacyPolicy, termsOfService }, picture, true);
    }
    async deleteClient(id) {
        return this.clientService.handleDeleteClient(id);
    }
};
exports.ClientController = ClientController;
__decorate([
    (0, common_1.Get)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ClientController.prototype, "getAllClients", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [mongoose_1.Types.ObjectId]),
    __metadata("design:returntype", Promise)
], ClientController.prototype, "getClient", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.DClientBodyPost]),
    __metadata("design:returntype", Promise)
], ClientController.prototype, "postClient", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('picture')),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFile)(new common_1.ParseFilePipe({
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
    __metadata("design:paramtypes", [mongoose_1.Types.ObjectId, dto_1.DClientBodyPatch, Object]),
    __metadata("design:returntype", Promise)
], ClientController.prototype, "patchClient", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [mongoose_1.Types.ObjectId]),
    __metadata("design:returntype", Promise)
], ClientController.prototype, "deleteClient", null);
exports.ClientController = ClientController = __decorate([
    (0, common_1.Controller)('client'),
    __metadata("design:paramtypes", [client_service_1.ClientService])
], ClientController);
//# sourceMappingURL=client.controller.js.map