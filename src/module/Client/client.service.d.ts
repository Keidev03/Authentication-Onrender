import { Model, Types } from 'mongoose';
import { IClientUpdate } from './interface';
import { ClientDocument, ClientFields } from './client.schema';
import { EScope } from '../../common';
export declare class ClientService {
    private readonly clientModel;
    constructor(clientModel: Model<ClientDocument>);
    private generateClientSecret;
    handleCreateClient(owner: Types.ObjectId, nameClient: string, scopes: EScope[], redirectUris: string): Promise<ClientDocument>;
    handleGetClient(_id: Types.ObjectId, fields?: Array<ClientFields>): Promise<ClientDocument | null>;
    handleGetClientByAccountId(accountId: Types.ObjectId, fields?: Array<ClientFields>): Promise<ClientDocument[] | []>;
    handleGetAllClients(page: number, limit: number, fields?: Array<ClientFields>): Promise<{
        clients: ClientDocument[];
        currentPage: number;
        totalPages: number;
        totalRecords: number;
    }>;
    handleUpdateClient(_id: Types.ObjectId, data: IClientUpdate, accountId?: Types.ObjectId): Promise<void>;
    handleDeleteClient(_id: Types.ObjectId): Promise<void>;
    handleValidateClient(_id: Types.ObjectId, clientSecret?: string, scope?: EScope[], redirectUri?: string, errorFunc?: (errorUri: string | null, error: string, errorDescription?: string, state?: string) => void): Promise<void>;
}
