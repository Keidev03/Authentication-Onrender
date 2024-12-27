/// <reference types="multer" />
import { Model, Types } from 'mongoose';
import { ClientDocument, ClientFields } from './client.schema';
import { EScope, GoogleDriveService } from '../../common';
import { ConfigService } from '@nestjs/config';
export declare class ClientService {
    private readonly clientModel;
    private readonly driveService;
    private readonly configService;
    private readonly idFolderLogo;
    constructor(clientModel: Model<ClientDocument>, driveService: GoogleDriveService, configService: ConfigService);
    private generateClientSecret;
    handleSaveClient(owner: Types.ObjectId, nameClient: string, scopes: EScope[], redirectUris: string): Promise<ClientDocument>;
    handleFindOneClient(_id: Types.ObjectId, fields?: Array<ClientFields>): Promise<ClientDocument>;
    handleFindOneClientByAccountId(accountId: Types.ObjectId, fields?: Array<ClientFields>): Promise<ClientDocument[]>;
    handleFindClients(page: number, limit: number, fields?: Array<ClientFields>): Promise<{
        clients: ClientDocument[];
        currentPage: number;
        totalPages: number;
        totalRecords: number;
    }>;
    handleUpdateClient(_id: Types.ObjectId, accountId: Types.ObjectId, data: {
        name?: string;
        clientSecret?: boolean;
        active?: boolean;
        editor?: Types.ObjectId[];
        scopes?: EScope[];
        redirectUris?: string[];
        privacyPolicy?: string;
        termsOfService?: string;
    }, picture: Express.Multer.File | undefined, retrieve?: boolean): Promise<ClientDocument>;
    handleUpdateEditors(clientId: Types.ObjectId, editors: Types.ObjectId[], action: 'add' | 'remove'): Promise<void>;
    handleUpdateScopes(clientId: Types.ObjectId, scopes: EScope[], action: 'add' | 'remove'): Promise<void>;
    handleUpdateRedirectUris(clientId: Types.ObjectId, redirectUris: string[], action: 'add' | 'remove'): Promise<void>;
    handleDeleteClient(_id: Types.ObjectId): Promise<void>;
}
