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
    async handleSaveSession(os, device, browser, ip, accountId, expireafterSeconds, transaction) {
        try {
            const sessionId = this.cryptoService.encrypt({ os, device, browser, ip });
            const createSession = new this.sessionModel({
                _id: sessionId,
                os,
                device,
                browser,
                ip,
                linkedAccountIds: [{ _id: accountId, primary: true, state: common_2.EAuthState.SIGNED_IN }],
                expiredAt: Date.now() + expireafterSeconds * 1000,
            });
            return createSession.save({ session: transaction });
        }
        catch (error) {
            throw new common_1.InternalServerErrorException({ message: 'Error creating session' });
        }
    }
    async handleFindSessions(limit, lastId, fields) {
        try {
            const query = {};
            if (lastId)
                query._id = { $gt: lastId };
            let selectedFields = '-_id';
            Array.isArray(fields) && fields.includes('_id') ? (selectedFields = fields.join(' ')) : (selectedFields += ' ' + fields.join(' '));
            const totalRecords = await this.sessionModel.countDocuments(query);
            const sessions = await this.sessionModel.find(query).select(selectedFields).limit(limit).sort({ createdAt: -1 }).lean().exec();
            return { sessions, totalRecords };
        }
        catch (error) {
            throw new common_1.InternalServerErrorException({ message: 'Error finding sessions' });
        }
    }
    async handleFindAccontsInOneSession(_id, sessionFields, accountFields) {
        try {
            let selectedAccountFields = '-_id';
            let selectedSessionFields = '_id';
            if (Array.isArray(sessionFields))
                selectedSessionFields = sessionFields.includes('_id') ? sessionFields.join(' ') : '-_id ' + sessionFields.join(' ');
            if (Array.isArray(accountFields))
                selectedAccountFields = accountFields.includes('_id') ? accountFields.join(' ') : '-_id ' + accountFields.join(' ');
            let query = this.sessionModel.findOne({ _id }).select(selectedSessionFields);
            if (Array.isArray(sessionFields) && sessionFields.includes('linkedAccountIds'))
                query = query.populate('linkedAccountIds._id', selectedAccountFields);
            const session = await query.lean().exec();
            if (!session)
                throw new common_1.NotFoundException({ message: 'Session not found' });
            if (Array.isArray(accountFields) && selectedSessionFields.includes('linkedAccountIds') && session.linkedAccountIds.some((account) => !account._id)) {
                const nullAccountIndexes = session.linkedAccountIds.map((account, index) => (account._id === null ? index : -1)).filter((index) => index !== -1);
                const data = await this.handleFindOneSession(_id, ['linkedAccountIds']);
                for (const index of nullAccountIndexes)
                    this.handlePullAccountIdsLinkedAllSession(data.linkedAccountIds[index]._id, false);
            }
            if (Array.isArray(accountFields) && selectedSessionFields.includes('linkedAccountIds'))
                session.linkedAccountIds = session.linkedAccountIds.filter((account) => account._id != null);
            return session;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException)
                throw error;
            throw new common_1.InternalServerErrorException({ message: 'Error finding session' });
        }
    }
    async handleFindOneSession(_id, fields) {
        try {
            let selectedFields = '-_id';
            Array.isArray(fields) && fields.includes('_id') ? (selectedFields = fields.join(' ')) : (selectedFields += ' ' + fields.join(' '));
            const session = await this.sessionModel.findOne({ _id }).select(selectedFields).lean().exec();
            if (!session)
                throw new common_1.NotFoundException({ message: 'Session not found' });
            return session;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException)
                throw error;
            throw new common_1.InternalServerErrorException({ message: 'Error finding session' });
        }
    }
    async handleSetLinkedAccountState(_id, accountId, state, retrieve = false, transaction) {
        if (retrieve) {
            const updatedSession = await this.sessionModel.findOneAndUpdate({ _id, 'linkedAccountIds._id': accountId }, { $set: { 'linkedAccountIds.$.state': state } }, { new: true, session: transaction });
            if (!updatedSession)
                throw new common_1.NotFoundException('Session not found');
            return updatedSession;
        }
        else {
            const updateSession = await this.sessionModel.updateOne({ _id, 'linkedAccountIds._id': accountId }, { $set: { 'linkedAccountIds.$.state': state } }, { session: transaction });
            if (updateSession.matchedCount === 0)
                throw new common_1.NotFoundException({ message: 'Session or linked account not found' });
            if (updateSession.modifiedCount === 0)
                throw new common_1.InternalServerErrorException({ message: 'Session update failed' });
        }
    }
    async handleSetAllLinkedAccountsState(_id, state, retrieve = false, transaction) {
        if (retrieve) {
            const updatedSession = await this.sessionModel.findOneAndUpdate({ _id }, { $set: { 'linkedAccountIds.$[].state': state } }, { new: true, session: transaction });
            if (!updatedSession)
                throw new common_1.NotFoundException({ message: 'Session not found' });
            return updatedSession;
        }
        else {
            const updateSession = await this.sessionModel.updateOne({ _id }, { $set: { 'linkedAccountIds.$[].state': state } }, { session: transaction });
            if (updateSession.matchedCount === 0)
                throw new common_1.NotFoundException({ message: 'Session not found' });
            if (updateSession.modifiedCount === 0)
                throw new common_1.InternalServerErrorException({ message: 'No linked accounts were updated' });
        }
    }
    async handleSetLinkedOneAccountStateAllSession(accountId, state, transaction) {
        const filter = { 'linkedAccountIds._id': accountId };
        const update = { $set: { 'linkedAccountIds.$.state': state } };
        const updateSession = await this.sessionModel.updateMany(filter, update, { session: transaction });
        if (updateSession.matchedCount === 0)
            throw new common_1.NotFoundException({ message: 'Session not found' });
        if (updateSession.modifiedCount === 0)
            throw new common_1.InternalServerErrorException({ message: 'No linked accounts were updated' });
    }
    async handleAddToSetLinkedAccountInSession(_id, accountId, state, retrieve = false, transaction) {
        try {
            const updateCondition = { _id, 'linkedAccountIds._id': { $ne: accountId } };
            const updateData = { $addToSet: { linkedAccountIds: { _id: accountId, state } } };
            if (retrieve) {
                return await this.sessionModel.findOneAndUpdate(updateCondition, updateData, { new: true, session: transaction });
            }
            else {
                await this.sessionModel.updateOne(updateCondition, updateData, { session: transaction });
            }
        }
        catch (error) {
            throw new common_1.InternalServerErrorException({ message: 'Error adding account to linked accounts' });
        }
    }
    async hanldeFindOneAccountInSessionByAuthUser(authuser, sidStr) {
        try {
            const session = await this.handleFindAccontsInOneSession(sidStr, ['_id', 'linkedAccountIds'], ['_id']);
            return session.linkedAccountIds[authuser]._id._id;
        }
        catch (error) {
            throw error;
        }
    }
    async handleFindOneAndCreateOrUpdateSession(sidStr, accountId, os, device, browser, ip, transaction) {
        try {
            const session = await this.handleFindAccontsInOneSession(sidStr, ['_id', 'linkedAccountIds'], ['_id']);
            if (session && session.linkedAccountIds.length >= 10)
                throw new common_1.BadRequestException('Cannot add more than 10 linked accounts');
            const isLinkedAccount = session.linkedAccountIds.some((linkedAccount) => linkedAccount._id._id.equals(accountId));
            const state = isLinkedAccount && session.linkedAccountIds.find((account) => account._id._id.equals(accountId)).state;
            return isLinkedAccount
                ? state === common_2.EAuthState.SIGNED_OUT || state === common_2.EAuthState.SESSION_EXPIRED || state === common_2.EAuthState.INACTIVE
                    ? await this.handleSetLinkedAccountState(sidStr, accountId, common_2.EAuthState.SIGNED_IN, true, transaction)
                    : session
                : await this.handleAddToSetLinkedAccountInSession(sidStr, accountId, common_2.EAuthState.SIGNED_IN, true, transaction);
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException)
                throw error;
            return await this.handleSaveSession(os, device, browser, ip, accountId, common_2.constants.EXPIRED_SID, transaction);
        }
    }
    async handlePullAccountIdsLinkedFromSession(_id, accountId, states, retrieve = false, transaction) {
        try {
            if (retrieve) {
                const updatedSession = await this.sessionModel.findOneAndUpdate({ _id }, { $pull: { linkedAccountIds: { _id: accountId, state: { $in: states } } } }, { new: true, session: transaction });
                if (!updatedSession)
                    throw new common_1.NotFoundException('Session not found');
                return updatedSession;
            }
            else {
                const updateSession = await this.sessionModel.updateOne({ _id }, { $pull: { linkedAccountIds: { _id: accountId, state: { $in: states } } } }, { session: transaction });
                if (updateSession.matchedCount === 0)
                    throw new common_1.NotFoundException('Session not found');
                if (updateSession.modifiedCount === 0)
                    throw new common_1.InternalServerErrorException('Session update failed');
            }
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException || error instanceof common_1.InternalServerErrorException)
                throw error;
            throw new common_1.InternalServerErrorException({ message: 'Error pulling linked account from session' });
        }
    }
    async handlePullAccountIdsLinkedAllSession(accountId, retrieve = false, transaction) {
        try {
            if (retrieve) {
                const updatedSession = await this.sessionModel.findOneAndUpdate({ 'linkedAccountIds._id': accountId }, { $pull: { linkedAccountIds: { _id: accountId } } }, { new: true, session: transaction });
                if (!updatedSession)
                    throw new common_1.NotFoundException('Session not found');
                return updatedSession;
            }
            else {
                const updateSession = await this.sessionModel.updateMany({ 'linkedAccountIds._id': accountId }, { $pull: { linkedAccountIds: { _id: accountId } } }, { session: transaction });
                if (updateSession.matchedCount === 0)
                    throw new common_1.NotFoundException('No session matched');
                if (updateSession.modifiedCount === 0)
                    throw new common_1.InternalServerErrorException('No session was updated');
            }
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException || error instanceof common_1.InternalServerErrorException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException({ message: 'Error pulling linked account from session' });
        }
    }
    async handleDeleteSession(_id) {
        try {
            const deletedSession = await this.sessionModel.deleteOne({ _id }).lean().exec();
            if (!deletedSession.acknowledged)
                throw new common_1.NotFoundException('Session not found or could not be deleted');
        }
        catch (error) {
            throw new common_1.InternalServerErrorException({ message: 'Error deleting session' });
        }
    }
    async handleUpdateExpired(_id, expiredAt, transaction) {
        try {
            if (expiredAt.getTime() - new Date().getTime() > common_2.constants.MIN_EXPIRED_REFRESH_TOKEN)
                return false;
            const result = await this.sessionModel.updateOne({ _id }, { expiredAt: Date.now() + common_2.constants.EXPIRED_SID * 1000 }, { session: transaction });
            return result.acknowledged;
        }
        catch (error) {
            throw new common_1.InternalServerErrorException({ message: 'Error updating tokens' });
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