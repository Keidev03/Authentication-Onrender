/// <reference types="multer" />
import { ClientSession, Connection, Model, Types } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { ERoles, GoogleDriveService, MailerService } from '../../common';
import { AccountDocument, AccountFields } from './account.schema';
import { SessionService } from '../Session/session.service';
import { TokenService } from '../Token/token.service';
export declare class AccountService {
    private readonly accountModel;
    private readonly sessionSerivce;
    private readonly tokenService;
    private readonly driveService;
    private readonly mailerService;
    private readonly configService;
    private readonly connection;
    private readonly idFolderAvatar;
    constructor(accountModel: Model<AccountDocument>, sessionSerivce: SessionService, tokenService: TokenService, driveService: GoogleDriveService, mailerService: MailerService, configService: ConfigService, connection: Connection);
    handleFindAccounts(page: number, limit: number, fields?: Array<AccountFields>): Promise<{
        users: AccountDocument[];
        currentPage: number;
        totalPages: number;
        totalRecords: number;
    }>;
    handleSaveAccount(email: string, firstName: string, lastName: string, name: string, dateOfBirth: Date, gender: string, password: string, phone: string): Promise<AccountDocument>;
    handleFindOneAccountByEmail(email: string, fields?: Array<AccountFields>): Promise<AccountDocument>;
    handleFindOneAccount(_id: Types.ObjectId, fields?: Array<AccountFields>): Promise<AccountDocument>;
    handleUpdateAccount(_id: Types.ObjectId, data: {
        email?: string;
        firstName?: string;
        lastName?: string;
        name?: string;
        oldPassword?: string;
        newPassword?: string;
        keepSignedIn?: boolean;
        roles?: ERoles[];
        verified?: boolean;
        dateOfBirth?: Date;
        gender?: string;
        phone?: string;
        address?: string;
        clientId?: Types.ObjectId[];
    }, picture: Express.Multer.File | undefined, retrieve?: boolean): Promise<AccountDocument>;
    handleUpdateRolesToAccount(accountId: Types.ObjectId, roles: ERoles[], action: 'add' | 'remove', session?: ClientSession): Promise<void>;
    handleUpdateClientIdsToAccount(accountId: Types.ObjectId, clientIds: Types.ObjectId[], action: 'add' | 'remove', session?: ClientSession): Promise<void>;
    handleResetPassword(email: string): Promise<void>;
    handleRevokeAuthorization(clientId: Types.ObjectId, accountId: Types.ObjectId, sidStr: string): Promise<void>;
    handleDeleteAccount(_id: Types.ObjectId): Promise<void>;
    private handleValidateAndUpdatePassword;
}
