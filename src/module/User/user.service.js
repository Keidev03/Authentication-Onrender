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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const mongoose_1 = require("@nestjs/mongoose");
const generate_password_1 = require("generate-password");
const bcrypt = require("bcryptjs");
const mongoose_2 = require("mongoose");
const common_2 = require("../../common");
const user_schema_1 = require("./user.schema");
let UserService = class UserService {
    constructor(userModel, driveService, mailerService, configService) {
        this.userModel = userModel;
        this.driveService = driveService;
        this.mailerService = mailerService;
        this.configService = configService;
        this.idFolderAvatar = configService.get('DRIVE_ID_FOLDER_AVATAR');
    }
    async handleBuildUpdateFields(_id, data, picture) {
        try {
            const user = await this.handleGetUser(_id, ['email']);
            if (!user)
                throw new common_1.NotFoundException('User not found');
            const updateFields = {};
            for (const key in data) {
                if (data[key] !== undefined) {
                    if (key === 'old_password') {
                        this.handleValidateAndUpdatePassword(user, data.oldPassword, data.password, updateFields);
                    }
                    else {
                        updateFields[key] = data[key];
                    }
                }
            }
            if (picture) {
                updateFields.picture = await this.driveService.UploadImage(picture, _id.toString(), 150, 150, this.idFolderAvatar);
            }
            return updateFields;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException || error instanceof common_1.BadRequestException)
                throw error;
            console.error('buildUpdateFields: ', error.message);
            throw new common_1.InternalServerErrorException('Error build update user');
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
            console.error('validateAndUpdatePassword: ', error.message);
            throw new common_1.InternalServerErrorException('Error validate password');
        }
    }
    async handleGetAllUsers(page, limit, fields) {
        try {
            const query = {};
            let selectedFields = '-_id';
            if (Array.isArray(fields) && fields.includes('_id')) {
                selectedFields = fields.join(' ');
            }
            else {
                selectedFields += ' ' + fields.join(' ');
            }
            const totalRecords = await this.userModel.countDocuments();
            const totalPages = Math.ceil(totalRecords / limit);
            const users = await this.userModel
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
            console.error('handleFindAllUsers: ', error.message);
            throw new common_1.InternalServerErrorException('Failed to retrieve users');
        }
    }
    handleCreateUser(email, firstName, lastName, name, dateOfBirth, gender, password, phone) {
        try {
            const hash = bcrypt.hashSync(password, 10);
            const handleCreateUser = new this.userModel({
                email,
                firstName,
                lastName,
                name,
                dateOfBirth,
                gender,
                phone,
                password: hash,
            });
            return handleCreateUser.save();
        }
        catch (error) {
            console.error('handleCreateUser: ', error.message);
            throw new common_1.InternalServerErrorException('Error creating user');
        }
    }
    async handleGetUserByEmail(email, fields) {
        try {
            let selectedFields = '-_id';
            if (Array.isArray(fields) && fields.includes('_id')) {
                selectedFields = fields.join(' ');
            }
            else {
                selectedFields += ' ' + fields.join(' ');
            }
            const user = await this.userModel.findOne({ email: email }).select(selectedFields).lean().exec();
            return user;
        }
        catch (error) {
            console.error('handleFindUserByEmail: ', error.message);
            throw new common_1.InternalServerErrorException('Error finding user');
        }
    }
    async handleGetUser(_id, fields) {
        try {
            let selectedFields = '-_id';
            if (Array.isArray(fields) && fields.includes('_id')) {
                selectedFields = fields.join(' ');
            }
            else {
                selectedFields += ' ' + fields.join(' ');
            }
            return this.userModel.findOne({ _id }).select(selectedFields).lean().exec();
        }
        catch (error) {
            console.error('handleFindUserByEmail: ', error.message);
            throw new common_1.InternalServerErrorException('Error finding user');
        }
    }
    async handleUpdateUser(_id, data, picture) {
        try {
            const updateFields = await this.handleBuildUpdateFields(_id, data, picture);
            const handleUpdateUser = await this.userModel.updateOne({ _id }, updateFields).exec();
            if (!handleUpdateUser.acknowledged)
                throw new common_1.NotFoundException('User not found or could not be deleted');
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException || error instanceof common_1.BadRequestException)
                throw error;
            console.error('handleUpdateUser: ', error.message);
            throw new common_1.InternalServerErrorException('Error updating user: ' + error.message);
        }
    }
    async handleResetPassword(email) {
        try {
            const user = await this.handleGetUserByEmail(email);
            if (!user)
                throw new common_1.NotFoundException("Email doesn't exist");
            const new_password = (0, generate_password_1.generate)({ length: 8, numbers: true });
            const hashedPassword = bcrypt.hashSync(new_password, 10);
            await this.userModel.updateOne({ email: email }, { password: hashedPassword }).exec();
            const htmlFormResetPassword = (0, common_2.FormResetPassword)(new_password);
            await this.mailerService.Gmail(email, 'Reset Password', htmlFormResetPassword);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException)
                throw error;
            console.error('handleResetPassword: ', error.message);
            throw new common_1.InternalServerErrorException('Error resetting password', error.message);
        }
    }
    async handleDeleteUser(_id) {
        try {
            const deletedUser = await this.userModel.deleteOne({ _id: _id }).exec();
            if (!deletedUser.acknowledged)
                throw new common_1.NotFoundException('User not found or could not be deleted');
        }
        catch (error) {
            console.error('handleDeleteUser: ', error.message);
            throw new common_1.InternalServerErrorException('Error deleting user');
        }
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        common_2.GoogleDriveService,
        common_2.MailerService,
        config_1.ConfigService])
], UserService);
//# sourceMappingURL=user.service.js.map