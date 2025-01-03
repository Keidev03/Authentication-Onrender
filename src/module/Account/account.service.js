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
exports.AccountService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const config_1 = require("@nestjs/config");
const mongoose_2 = require("@nestjs/mongoose");
const generate_password_1 = require("generate-password");
const bcrypt = require("bcryptjs");
const common_2 = require("../../common");
const account_schema_1 = require("./account.schema");
const session_service_1 = require("../Session/session.service");
const token_service_1 = require("../Token/token.service");
let AccountService = class AccountService {
    constructor(accountModel, sessionSerivce, tokenService, driveService, mailerService, configService, connection) {
        this.accountModel = accountModel;
        this.sessionSerivce = sessionSerivce;
        this.tokenService = tokenService;
        this.driveService = driveService;
        this.mailerService = mailerService;
        this.configService = configService;
        this.connection = connection;
        this.idFolderAvatar = configService.get('DRIVE_ID_FOLDER_AVATAR');
    }
    handleSaveAccount(email, firstName, lastName, name, dateOfBirth, gender, password) {
        try {
            const hash = bcrypt.hashSync(password, 10);
            const handleCreateUser = new this.accountModel({
                email,
                firstName,
                lastName,
                name,
                dateOfBirth,
                gender,
                password: hash,
            });
            return handleCreateUser.save();
        }
        catch (error) {
            throw new common_1.InternalServerErrorException({ message: 'Error creating account' });
        }
    }
    async handleFindAccounts(page, limit, fields) {
        try {
            const query = {};
            let selectedFields = '-_id';
            Array.isArray(fields) && fields.includes('_id') ? (selectedFields = fields.join(' ')) : (selectedFields += ' ' + fields.join(' '));
            const totalRecords = await this.accountModel.countDocuments();
            const totalPages = Math.ceil(totalRecords / limit);
            const users = await this.accountModel
                .find(query)
                .select(selectedFields)
                .skip((page - 1) * limit)
                .limit(limit)
                .sort({ createdAt: -1 })
                .lean()
                .exec();
            const updatedUsers = users.map((user) => {
                const picture = user.picture ? (user.picture.includes('https://lh3.googleusercontent.com') ? user.picture : `https://lh3.googleusercontent.com/d/${user.picture}=s96-c`) : null;
                return {
                    ...user,
                    picture,
                };
            });
            return { users: updatedUsers, currentPage: page, totalPages, totalRecords };
        }
        catch (error) {
            throw new common_1.InternalServerErrorException({ message: 'Failed to retrieve accounts' });
        }
    }
    async handleFindOneAccountByEmail(email, fields) {
        try {
            let selectedFields = '-_id';
            Array.isArray(fields) && fields.includes('_id') ? (selectedFields = fields.join(' ')) : (selectedFields += ' ' + fields.join(' '));
            const account = await this.accountModel.findOne({ email: email }).select(selectedFields).lean().exec();
            if (!account)
                throw new common_1.NotFoundException({ message: 'Account not found' });
            return account;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException)
                throw error;
            throw new common_1.InternalServerErrorException({ message: 'Error finding account' });
        }
    }
    async handleFindOneAccount(_id, fields) {
        try {
            let selectedFields = '-_id';
            Array.isArray(fields) && fields.includes('_id') ? (selectedFields = fields.join(' ')) : (selectedFields += ' ' + fields.join(' '));
            const account = await this.accountModel.findOne({ _id }).select(selectedFields).lean().exec();
            if (!account)
                throw new common_1.NotFoundException({ message: 'Account not found' });
            return account;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException)
                throw error;
            throw new common_1.InternalServerErrorException({ message: 'Error finding account' });
        }
    }
    async handleUpdateAccount(_id, data, picture, retrieve = false) {
        const transaction = await this.connection.startSession();
        transaction.startTransaction();
        try {
            const account = await this.handleFindOneAccount(_id, ['_id', 'password', 'picture']);
            const updateQuery = {};
            if (data.oldPassword && data.newPassword)
                this.handleValidateAndUpdatePassword(account, data.oldPassword, data.newPassword, updateQuery);
            if (picture) {
                updateQuery.picture = await this.driveService.UploadImage(picture, account._id.toString(), 500, 500, 500, this.idFolderAvatar);
                if (!account.picture.includes('http'))
                    await this.driveService.DeleteFile(account.picture);
            }
            for (const [key, value] of Object.entries(data)) {
                if (value !== undefined && key !== 'oldPassword' && key !== 'newPassword') {
                    updateQuery[key] = value;
                }
            }
            if (retrieve) {
                const response = await this.accountModel.findOneAndUpdate({ _id }, updateQuery, { new: true, session: transaction }).exec();
                if (updateQuery.password && !data.keepSignedIn)
                    await this.sessionSerivce.handleSetLinkedOneAccountStateAllSession(_id, common_2.EAuthState.SIGNED_OUT, transaction);
                await transaction.commitTransaction();
                return response;
            }
            else {
                const response = await this.accountModel.updateOne({ _id }, updateQuery, { session: transaction }).exec();
                if (updateQuery.password && !data.keepSignedIn)
                    await this.sessionSerivce.handleSetLinkedOneAccountStateAllSession(_id, common_2.EAuthState.SIGNED_OUT, transaction);
                if (!response.acknowledged)
                    throw new common_1.NotFoundException('Account not found or could not be updated');
                await transaction.commitTransaction();
            }
        }
        catch (error) {
            await transaction.abortTransaction();
            if (error instanceof common_1.NotFoundException || error instanceof common_1.BadRequestException)
                throw error;
            throw new common_1.InternalServerErrorException({ message: 'Error updating account' });
        }
        finally {
            transaction.endSession();
        }
    }
    async handleUpdatEOAuth2ScopeToAccount(accountId, roles, action, session) {
        const updateQuery = action === 'add' ? { $addToSet: { roles: { $each: roles } } } : { $pull: { roles: { $in: roles } } };
        const response = await this.accountModel.updateOne({ _id: accountId }, updateQuery, { session }).exec();
        if (!response.acknowledged) {
            const actionText = action === 'add' ? 'add roles to' : 'remove roles from';
            throw new common_1.NotFoundException(`Failed to ${actionText} account`);
        }
    }
    async handleUpdateClientIdsToAccount(accountId, clientIds, action, session) {
        const updateQuery = action === 'add' ? { $addToSet: { clientId: { $each: clientIds } } } : { $pull: { clientId: { $in: clientIds } } };
        const response = await this.accountModel.updateOne({ _id: accountId }, updateQuery, { session }).exec();
        if (!response.acknowledged) {
            const actionText = action === 'add' ? 'add client IDs to' : 'remove client IDs from';
            throw new common_1.NotFoundException(`Failed to ${actionText} account`);
        }
    }
    async handleResetPassword(email) {
        try {
            const account = await this.handleFindOneAccountByEmail(email, ['_id']);
            const new_password = (0, generate_password_1.generate)({ length: 8, numbers: true });
            const hashedPassword = bcrypt.hashSync(new_password, 10);
            await this.accountModel.updateOne({ _id: account._id }, { password: hashedPassword }).exec();
            await this.sessionSerivce.handleSetLinkedOneAccountStateAllSession(account._id, common_2.EAuthState.SIGNED_OUT);
            const htmlFormResetPassword = (0, common_2.FormResetPassword)(new_password);
            this.mailerService.Gmail(email, 'Reset Password', htmlFormResetPassword);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException)
                throw error;
            throw new common_1.InternalServerErrorException({ message: 'Error reseting password' });
        }
    }
    async handleRevokeAuthorization(clientId, accountId, sidStr) {
        const transaction = await this.connection.startSession();
        transaction.startTransaction();
        try {
            await this.handleUpdateClientIdsToAccount(accountId, [clientId], 'remove', transaction);
            await this.tokenService.handleDeleteTokenByFields(sidStr, accountId, clientId, transaction);
            await transaction.commitTransaction();
        }
        catch (error) {
            await transaction.abortTransaction();
            if (error instanceof common_1.NotFoundException)
                throw error;
            throw new common_1.InternalServerErrorException(error.message);
        }
        finally {
            transaction.endSession();
        }
    }
    async handleDeleteAccount(_id) {
        try {
            const account = await this.accountModel.deleteOne({ _id: _id }).exec();
            if (!account.acknowledged)
                throw new common_1.NotFoundException({ message: 'Account not found or could not be deleted' });
        }
        catch (error) {
            throw new common_1.InternalServerErrorException({ message: 'Error deleting account' });
        }
    }
    handleValidateAndUpdatePassword(user, oldPassword, newPassword, updateFields) {
        try {
            const isOldPasswordValid = bcrypt.compareSync(oldPassword, user.password);
            if (!isOldPasswordValid)
                throw new common_1.BadRequestException('Old password is incorrect');
            updateFields.password = bcrypt.hashSync(newPassword, 10);
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException)
                throw error;
            throw new common_1.InternalServerErrorException({ message: 'Error validate password' });
        }
    }
};
exports.AccountService = AccountService;
exports.AccountService = AccountService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_2.InjectModel)(account_schema_1.Account.name)),
    __param(2, (0, common_1.Inject)((0, common_1.forwardRef)(() => token_service_1.TokenService))),
    __param(6, (0, mongoose_2.InjectConnection)()),
    __metadata("design:paramtypes", [mongoose_1.Model,
        session_service_1.SessionService,
        token_service_1.TokenService,
        common_2.GoogleDriveService,
        common_2.MailerService,
        config_1.ConfigService,
        mongoose_1.Connection])
], AccountService);
//# sourceMappingURL=account.service.js.map