/// <reference types="multer" />
import { Connection } from 'mongoose';
import { DAccountBodyPatch, DAccountBodyPost, DAccountBodyRevoke } from './dto';
import { AccountService } from './account.service';
import { AccountDocument } from './account.schema';
export declare class AccountController {
    private readonly accountService;
    private readonly connection;
    constructor(accountService: AccountService, connection: Connection);
    getAllAccounts(): Promise<{
        users: AccountDocument[];
        currentPage: number;
        totalPages: number;
        totalRecords: number;
    }>;
    getAccount(): Promise<{
        email: any;
        name: string;
        firstName: string;
        lastName: string;
        picture: string;
        roles: import("../../common").ERoles[];
        verified: boolean;
        gender: string;
        dateOfBirth: Date;
    }>;
    patchAccount(body: DAccountBodyPatch, picture?: Express.Multer.File): Promise<AccountDocument>;
    deleteAccount(): Promise<void>;
    postAccount(data: DAccountBodyPost): Promise<void>;
    getResetPassword(email: string): Promise<void>;
    getRevokeAccount(body: DAccountBodyRevoke, sidStr: string): Promise<void>;
}
