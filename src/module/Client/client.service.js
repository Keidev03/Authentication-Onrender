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
let ClientService = class ClientService {
    constructor(clientModel) {
        this.clientModel = clientModel;
    }
    generateClientSecret() {
        return crypto.randomBytes(20).toString('hex');
    }
    async handleCreateClient(owner, nameClient, scopes, redirectUris) {
        try {
            const createClient = new this.clientModel({
                name: nameClient,
                clientSecret: this.generateClientSecret(),
                owner,
                scopes: scopes,
                redirectUris,
            });
            return createClient.save();
        }
        catch (error) {
            console.error('func createClient - Error: ', error.message);
            throw new common_1.InternalServerErrorException(error.message);
        }
    }
    async handleGetClient(_id, fields) {
        try {
            let selectedFields = '-_id';
            if (Array.isArray(fields) && fields.includes('_id')) {
                selectedFields = fields.join(' ');
            }
            else {
                selectedFields += ' ' + (fields ? fields.join(' ') : '');
            }
            return this.clientModel.findById(_id).select(selectedFields).exec();
        }
        catch (error) {
            console.error('func findClientByClientId - Error: ', error.message);
            throw new common_1.InternalServerErrorException(error.message);
        }
    }
    async handleGetClientByAccountId(accountId, fields) {
        try {
            let selectedFields = '-_id';
            if (Array.isArray(fields) && fields.includes('_id')) {
                selectedFields = fields.join(' ');
            }
            else {
                selectedFields += ' ' + (fields ? fields.join(' ') : '');
            }
            return this.clientModel
                .find({ $or: [{ owner: accountId }, { editor: accountId }] })
                .select(selectedFields)
                .exec();
        }
        catch (error) {
            console.error('func findClientByUser - Error: ', error.message);
            throw new common_1.InternalServerErrorException(error.message);
        }
    }
    async handleGetAllClients(page, limit, fields) {
        try {
            let selectedFields = '-_id';
            let query = {};
            if (fields && fields.includes('_id')) {
                selectedFields = fields.join(' ');
            }
            else {
                selectedFields += ' ' + (fields ? fields.join(' ') : '');
            }
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
            console.error('func findClients - Error: ', error.message);
            throw new common_1.InternalServerErrorException(error.message);
        }
    }
    async handleUpdateClient(_id, data, accountId) {
        try {
            const client = await this.handleGetClient(_id, ['owner', 'editor']);
            const isEditorNotAuthorized = accountId && !client.editor.includes(accountId);
            const isNotOwner = client.owner !== accountId;
            if (isEditorNotAuthorized && isNotOwner) {
                throw new common_1.ForbiddenException('Edits are not permitted or user not found in editors list');
            }
            const allowedFields = ['name', 'scopes', 'isActive', 'redirectUris'];
            const updateFields = Object.keys(data)
                .filter((key) => allowedFields.includes(key))
                .reduce((obj, key) => {
                if (key === 'scopes') {
                    obj[`$addToSet`] = {
                        ...obj[`$addToSet`],
                        [key]: {
                            $each: data[key],
                        },
                    };
                }
                else {
                    obj[`$set`] = {
                        ...obj[`$set`],
                        [key]: data[key],
                    };
                }
                return obj;
            }, {});
            const updatedClient = await this.clientModel.updateOne({ _id }, updateFields).exec();
            if (!updatedClient.acknowledged)
                throw new common_1.NotFoundException('Client not found');
        }
        catch (error) {
            if (error instanceof common_1.ForbiddenException)
                throw error;
            console.error('func updateClient - Error: ', error.message);
            throw new common_1.InternalServerErrorException(error.message);
        }
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
            console.error('handleDeleteClient: ', error.message);
            throw new common_1.InternalServerErrorException('Error delete client');
        }
    }
    async handleValidateClient(_id, clientSecret, scope, redirectUri, errorFunc) {
        try {
            const client = await this.handleGetClient(_id, ['_id', 'name', 'clientSecret', 'scope', 'redirectUris']);
            if (!client)
                return errorFunc(null, 'invalid_client', 'Client not found');
            if (clientSecret && client.clientSecret !== clientSecret)
                return errorFunc(null, 'invalid_client', 'Client secret does not match');
            if (redirectUri && !client.redirectUris.includes(redirectUri))
                return errorFunc(null, 'invalid_request', 'Redirect URI is not valid');
            if (scope && !scope.every((scope) => client.scope.includes(scope)))
                return errorFunc(null, 'invalid_scope', 'Requested scope is not allowed');
        }
        catch (error) {
            return errorFunc(null, 'server_error', error.message);
        }
    }
};
exports.ClientService = ClientService;
exports.ClientService = ClientService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(client_schema_1.Client.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], ClientService);
//# sourceMappingURL=client.service.js.map