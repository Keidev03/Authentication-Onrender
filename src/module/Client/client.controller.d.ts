/// <reference types="multer" />
import { Types } from 'mongoose';
import { ClientService } from './client.service';
import { DClientBodyPost, DClientBodyPatch } from './dto';
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
    postClient(body: DClientBodyPost): Promise<import("./client.schema").ClientDocument>;
    patchClient(id: Types.ObjectId, body: DClientBodyPatch, picture?: Express.Multer.File): Promise<import("./client.schema").ClientDocument>;
    deleteClient(id: Types.ObjectId): Promise<void>;
}
