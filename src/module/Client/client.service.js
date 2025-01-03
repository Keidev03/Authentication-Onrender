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
exports.ClientService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const crypto = require("crypto");
const client_schema_1 = require("./client.schema");
const common_2 = require("../../common");
const config_1 = require("@nestjs/config");
let ClientService = class ClientService {
    constructor(clientModel, driveService, configService) {
        this.clientModel = clientModel;
        this.driveService = driveService;
        this.configService = configService;
        this.idFolderLogo = configService.get('DRIVE_ID_FOLDER_LOGO');
    }
    generateClientSecret() {
        return crypto.randomBytes(20).toString('hex');
    }
    async handleSaveClient(owner, nameClient, scopes, redirectUris) {
        try {
            const createClient = new this.clientModel({ name: nameClient, clientSecret: this.generateClientSecret(), owner, scope: scopes, redirectUris });
            return createClient.save();
        }
        catch (error) {
            throw new common_1.InternalServerErrorException({ message: 'Error saving client' });
        }
    }
    async handleFindOneClient(_id, fields) {
        try {
            let selectedFields = '-_id';
            Array.isArray(fields) && fields.includes('_id') ? (selectedFields = fields.join(' ')) : (selectedFields += ' ' + (fields ? fields.join(' ') : ''));
            const client = await this.clientModel.findById(_id).select(selectedFields).exec();
            if (!client) {
                throw new common_1.BadRequestException({
                    error: 'unauthorized_client',
                    error_description: `The OAuth client was not found or is unauthorized to use the requested grant type.`,
                });
            }
            return client;
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException)
                throw error;
            throw new common_1.InternalServerErrorException({ message: 'Error finding client' });
        }
    }
    async handleFindOneClientByAccountId(accountId, fields) {
        try {
            let selectedFields = '-_id';
            Array.isArray(fields) && fields.includes('_id') ? (selectedFields = fields.join(' ')) : (selectedFields += ' ' + (fields ? fields.join(' ') : ''));
            return this.clientModel
                .find({ $or: [{ owner: accountId }, { editor: accountId }] })
                .select(selectedFields)
                .exec();
        }
        catch (error) {
            throw new common_1.InternalServerErrorException({ message: 'Error finding client' });
        }
    }
    async handleFindClients(page, limit, fields) {
        try {
            let selectedFields = '-_id';
            let query = {};
            fields && fields.includes('_id') ? (selectedFields = fields.join(' ')) : (selectedFields += ' ' + (fields ? fields.join(' ') : ''));
            const totalRecords = await this.clientModel.countDocuments();
            const totalPages = Math.ceil(totalRecords / limit);
            const clients = await this.clientModel
                .find(query)
                .select(selectedFields)
                .skip((page - 1) * limit)
                .limit(limit)
                .sort({ createdAt: -1 })
                .exec();
            return { clients, currentPage: page, totalPages, totalRecords };
        }
        catch (error) {
            throw new common_1.InternalServerErrorException({ message: 'Error finding client' });
        }
    }
    async handleUpdateClient(_id, accountId, data, picture, retrieve = false) {
        try {
            const client = await this.handleFindOneClient(_id, ['owner', 'editor', 'picture']);
            const isEditorNotAuthorized = accountId && !client.editor.includes(accountId);
            const isNotOwner = client.owner !== accountId;
            if (isEditorNotAuthorized && isNotOwner)
                throw new common_1.ForbiddenException('Edits are not permitted or user not found in editors list');
            const updateQuery = {};
            if (picture) {
                updateQuery.picture = await this.driveService.UploadImage(picture, client._id.toString(), 500, 500, 500, this.idFolderLogo);
                if (!client.picture.includes('http'))
                    await this.driveService.DeleteFile(client.picture);
            }
            if (data.clientSecret)
                updateQuery.clientSecret = this.generateClientSecret();
            for (const [key, value] of Object.entries(data))
                if (value !== undefined && key !== 'clientSecret')
                    updateQuery[key] = value;
            if (retrieve) {
                const updatedClient = await this.clientModel.findOneAndUpdate({ _id }, updateQuery, { new: true }).lean().exec();
                if (!updatedClient)
                    throw new common_1.NotFoundException('Client not found');
                return updatedClient;
            }
            else {
                const updateClient = await this.clientModel.updateOne({ _id }, updateQuery).exec();
                if (!updateClient.acknowledged)
                    throw new common_1.NotFoundException('Client not found');
            }
        }
        catch (error) {
            if (error instanceof common_1.ForbiddenException || error instanceof common_1.NotFoundException)
                throw error;
            throw new common_1.InternalServerErrorException({ message: 'Error update client' });
        }
    }
    async handleUpdateEditors(clientId, editors, action) {
        const update = action === 'add' ? { $addToSet: { editor: { $each: editors } } } : { $pull: { editor: { $in: editors } } };
        const result = await this.clientModel.updateOne({ _id: clientId }, update).exec();
        if (!result.acknowledged)
            throw new common_1.NotFoundException('Client not found');
    }
    async handleUpdatEOAuth2Scopes(clientId, scopes, action) {
        const update = action === 'add' ? { $addToSet: { scopes: { $each: scopes } } } : { $pull: { scopes: { $in: scopes } } };
        const result = await this.clientModel.updateOne({ _id: clientId }, update).exec();
        if (!result.acknowledged)
            throw new common_1.NotFoundException('Client not found');
    }
    async handleUpdateRedirectUris(clientId, redirectUris, action) {
        const update = action === 'add' ? { $addToSet: { redirectUris: { $each: redirectUris } } } : { $pull: { redirectUris: { $in: redirectUris } } };
        const result = await this.clientModel.updateOne({ _id: clientId }, update).exec();
        if (!result.acknowledged)
            throw new common_1.NotFoundException('Client not found');
    }
    async handleDeleteClient(_id) {
        try {
            const deleteClient = await this.clientModel.deleteOne({ _id }).exec();
            if (!deleteClient.acknowledged)
                throw new common_1.NotFoundException('Client not found');
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException)
                throw error;
            throw new common_1.InternalServerErrorException({ message: 'Error delete client' });
        }
    }
};
exports.ClientService = ClientService;
exports.ClientService = ClientService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(client_schema_1.Client.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        common_2.GoogleDriveService,
        config_1.ConfigService])
], ClientService);
//# sourceMappingURL=client.service.js.map