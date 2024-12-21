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
exports.SessionService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const common_2 = require("../../common");
const session_schema_1 = require("./session.schema");
let SessionService = class SessionService {
    constructor(sessionModel, cryptoService) {
        this.sessionModel = sessionModel;
        this.cryptoService = cryptoService;
    }
    async handleCreateSession(os, device, browser, ip, accountId, expireafterSeconds, transaction) {
        try {
            const sessionId = this.cryptoService.encrypt({ os, device, browser, ip });
            const createSession = new this.sessionModel({ _id: sessionId, os, device, browser, ip, accountId: [accountId], expiredAt: Date.now() + expireafterSeconds * 1000 });
            return createSession.save({ session: transaction ? transaction : undefined });
        }
        catch (error) {
            console.error('findSessions: ', error.message);
            throw new common_1.InternalServerErrorException('Error creating session');
        }
    }
    async handleGetAllSessions(limit, lastId, fields) {
        try {
            const query = {};
            if (lastId) {
                query._id = { $gt: lastId };
            }
            let selectedFields = '-_id';
            if (Array.isArray(fields) && fields.includes('_id')) {
                selectedFields = fields.join(' ');
            }
            else {
                selectedFields += ' ' + fields.join(' ');
            }
            const totalRecords = await this.sessionModel.countDocuments(query);
            const sessions = await this.sessionModel.find(query).select(selectedFields).limit(limit).sort({ createdAt: -1 }).lean().exec();
            return {
                sessions,
                totalRecords,
            };
        }
        catch (error) {
            console.error('findSessions: ', error.message);
            throw new common_1.InternalServerErrorException('Error finding sessions');
        }
    }
    async handleGetSession(_id, fields) {
        try {
            let selectedFields = '-_id';
            if (Array.isArray(fields) && fields.includes('_id')) {
                selectedFields = fields.join(' ');
            }
            else {
                selectedFields += ' ' + fields.join(' ');
            }
            return this.sessionModel.findOne({ _id }).select(selectedFields).lean().exec();
        }
        catch (error) {
            console.error('handleGetSession: ', error.message);
            throw new common_1.InternalServerErrorException('Error finding session');
        }
    }
    async handleUpdateAccountInSession(_id, accountId, transaction) {
        const updateSession = await this.sessionModel.updateOne({ _id }, { $addToSet: { accountId } }, { session: transaction ? transaction : undefined });
        if (updateSession.matchedCount === 0)
            throw new common_1.NotFoundException('Session not found');
        if (updateSession.modifiedCount === 0)
            throw new common_1.InternalServerErrorException('Session update failed');
    }
    async handleUpdateAndRetrieveAccountInSession(_id, accountId, transaction) {
        const updatedSession = await this.sessionModel.findOneAndUpdate({ _id }, { $addToSet: { accountId } }, { new: true, session: transaction ? transaction : undefined });
        if (!updatedSession)
            throw new common_1.NotFoundException('Session not found');
        return updatedSession;
    }
    async handleUpdateSessionOrCreateNew(_id, userId, os, device, browser, ip, transaction) {
        try {
            return await this.handleUpdateAndRetrieveAccountInSession(_id, userId, transaction);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException)
                return await this.handleCreateSession(os, device, browser, ip, userId, common_2.constants.EXPIRED_SID, transaction);
            throw error;
        }
    }
    async handleDeleteSession(_id) {
        try {
            const deletedSession = await this.sessionModel.deleteOne({ _id }).lean().exec();
            if (!deletedSession.acknowledged)
                throw new common_1.NotFoundException('Session not found or could not be deleted');
        }
        catch (error) {
            console.error('deleteSession: ', error.message);
            throw new common_1.InternalServerErrorException('Error deleting session');
        }
    }
};
exports.SessionService = SessionService;
exports.SessionService = SessionService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(session_schema_1.Session.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        common_2.CryptoService])
], SessionService);
//# sourceMappingURL=session.service.js.map