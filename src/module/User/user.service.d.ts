/// <reference types="multer" />
import { ConfigService } from '@nestjs/config';
import { Model, Types } from 'mongoose';
import { GoogleDriveService, MailerService } from '../../common';
import { IUserUpdate } from './interface';
import { UserDocument, UserFields } from './user.schema';
export declare class UserService {
    private readonly userModel;
    private readonly driveService;
    private readonly mailerService;
    private readonly configService;
    private readonly idFolderAvatar;
    constructor(userModel: Model<UserDocument>, driveService: GoogleDriveService, mailerService: MailerService, configService: ConfigService);
    private handleBuildUpdateFields;
    private handleValidateAndUpdatePassword;
    handleGetAllUsers(page: number, limit: number, fields?: Array<UserFields>): Promise<{
        users: UserDocument[];
        currentPage: number;
        totalPages: number;
        totalRecords: number;
    }>;
    handleCreateUser(email: string, firstName: string, lastName: string, name: string, dateOfBirth: Date, gender: string, password: string, phone: string): Promise<UserDocument>;
    handleGetUserByEmail(email: string, fields?: Array<UserFields>): Promise<UserDocument | null>;
    handleGetUser(_id: Types.ObjectId, fields?: Array<UserFields>): Promise<UserDocument | null>;
    handleUpdateUser(_id: Types.ObjectId, data: IUserUpdate, picture?: Express.Multer.File | null): Promise<void>;
    handleResetPassword(email: string): Promise<void>;
    handleDeleteUser(_id: Types.ObjectId): Promise<void>;
}
