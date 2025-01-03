import { ClientSession, Model, Types } from 'mongoose';
import { CryptoService, EAuthState } from '../../common';
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
    handleFindAccontsInOneSession(_id: string, sessionFields?: Array<SessionFields>, accountFields?: Array<AccountFields>): Promise<SessionDocument>;
    handleFindOneSession(_id: string, fields?: Array<SessionFields>): Promise<SessionDocument>;
    handleSetLinkedAccountState(_id: string, accountId: Types.ObjectId, state: EAuthState, retrieve?: boolean, transaction?: ClientSession): Promise<SessionDocument>;
    handleSetAllLinkedAccountsState(_id: string, state: EAuthState, retrieve?: boolean, transaction?: ClientSession): Promise<SessionDocument>;
    handleSetLinkedOneAccountStateAllSession(accountId: Types.ObjectId, state: EAuthState, transaction?: ClientSession): Promise<void>;
    handleAddToSetLinkedAccountInSession(_id: string, accountId: Types.ObjectId, state: EAuthState, retrieve?: boolean, transaction?: ClientSession): Promise<SessionDocument>;
    hanldeFindOneAccountInSessionByAuthUser(authuser: number, sidStr: string): Promise<Types.ObjectId>;
    handleFindOneAndCreateOrUpdateSession(sidStr: string, accountId: Types.ObjectId, os: string, device: string, browser: string, ip: string, transaction?: ClientSession): Promise<SessionDocument>;
    handlePullAccountIdsLinkedFromSession(_id: string, accountId: Types.ObjectId, states: EAuthState[], retrieve?: boolean, transaction?: ClientSession): Promise<SessionDocument>;
    handlePullAccountIdsLinkedAllSession(accountId: Types.ObjectId, retrieve?: boolean, transaction?: ClientSession): Promise<SessionDocument | null>;
    handleDeleteSession(_id: string): Promise<void>;
    handleUpdateExpired(_id: string, expiredAt: Date, transaction?: ClientSession): Promise<boolean>;
}
