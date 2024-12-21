import { Types } from 'mongoose';
import { ClientService } from './client.service';
import { DClientPost, DClientPatch } from './dto';
export declare class ClientController {
    private readonly clientService;
    constructor(clientService: ClientService);
    getAllClients(): Promise<{
        clients: import("./client.schema").ClientDocument[];
        currentPage: number;
        totalPages: number;
        totalRecords: number;
    }>;
    getClient(id: Types.ObjectId): Promise<import("./client.schema").ClientDocument>;
    postClient(body: DClientPost): Promise<import("./client.schema").ClientDocument>;
    patchClient(id: Types.ObjectId, body: DClientPatch): Promise<void>;
    deleteClient(id: Types.ObjectId): Promise<void>;
}
