import { ClientSession, Model, Types } from 'mongoose';
import { CryptoService } from '../../common';
import { SessionDocument, SessionFields } from './session.schema';
import { AccountFields } from '../Account/account.schema';
export declare class SessionService {
    private readonly sessionModel;
    private readonly cryptoService;
    constructor(sessionModel: Model<SessionDocument>, cryptoService: CryptoService);
    handleSaveSession(os: string, device: string, browser: string, ip: string, accountId: Types.ObjectId, expireafterSeconds: number, transaction?: ClientSession): Promise<SessionDocument>;
    handleFindSessions(limit: number, lastId: string | undefined, fields?: Array<SessionFields>): Promise<{
        sessions: SessionDocument[];
        totalRecords: number;
    }>;
    handleFindOneSession(_id: string, sessionFields?: Array<SessionFields>, accountFields?: Array<AccountFields>): Promise<SessionDocument>;
    handleSetLinkedAccountSignOut(_id: string, accountId: Types.ObjectId, signedOut: boolean, retrieve?: boolean, transaction?: ClientSession): Promise<SessionDocument>;
    handleSetAllLinkedAccountsSignOut(_id: string, signedOut: boolean, retrieve?: boolean, transaction?: ClientSession): Promise<SessionDocument>;
    handleSetLinkedOneAccountSignOutAllSession(accountId: Types.ObjectId, signedOut: boolean, transaction?: ClientSession): Promise<void>;
    handleAddToSetLinkedAccountInSession(_id: string, accountId: Types.ObjectId, retrieve?: boolean, transaction?: ClientSession): Promise<SessionDocument>;
    hanldeFindOneAccountInSession(authuser: number, sidStr: string): Promise<Types.ObjectId>;
    handleFindOneAndCreateOrUpdateSession(sidStr: string, accountId: Types.ObjectId, os: string, device: string, browser: string, ip: string, transaction?: ClientSession): Promise<SessionDocument>;
    handlePullAccountIdsLinkedFromSession(_id: string, accountId: Types.ObjectId, signedOut: boolean, retrieve?: boolean, transaction?: ClientSession): Promise<SessionDocument>;
    handleDeleteSession(_id: string): Promise<void>;
}
