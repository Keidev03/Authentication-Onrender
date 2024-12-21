import { ClientSession, Model, Types } from 'mongoose';
import { CryptoService } from '../../common';
import { SessionDocument, SessionFields } from './session.schema';
export declare class SessionService {
    private readonly sessionModel;
    private readonly cryptoService;
    constructor(sessionModel: Model<SessionDocument>, cryptoService: CryptoService);
    handleCreateSession(os: string, device: string, browser: string, ip: string, accountId: Types.ObjectId, expireafterSeconds: number, transaction?: ClientSession): Promise<SessionDocument>;
    handleGetAllSessions(limit: number, lastId: string | undefined, fields?: Array<SessionFields>): Promise<{
        sessions: SessionDocument[];
        totalRecords: number;
    }>;
    handleGetSession(_id: string, fields?: Array<SessionFields>): Promise<SessionDocument>;
    handleUpdateAccountInSession(_id: string, accountId: Types.ObjectId, transaction?: ClientSession): Promise<void>;
    handleUpdateAndRetrieveAccountInSession(_id: string, accountId: Types.ObjectId, transaction?: ClientSession): Promise<SessionDocument>;
    handleUpdateSessionOrCreateNew(_id: string, userId: Types.ObjectId, os: string, device: string, browser: string, ip: string, transaction: ClientSession): Promise<SessionDocument>;
    handleDeleteSession(_id: string): Promise<void>;
}
