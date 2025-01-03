import { Connection, Types } from 'mongoose';
import { CryptoService, EAuthState, EPurpose, IUserAgentInfo } from '../../common';
import { SessionService } from '../Session/session.service';
import { SessionDocument } from '../Session/session.schema';
import { AccountService } from '../Account/account.service';
export declare class AuthService {
    private readonly accountService;
    private readonly sessionService;
    private readonly cryptoService;
    private readonly connection;
    private readonly logger;
    constructor(accountService: AccountService, sessionService: SessionService, cryptoService: CryptoService, connection: Connection);
    handleIdentifier(email: string, purpose: EPurpose, useragent: IUserAgentInfo): Promise<{
        TL?: string;
        status?: string;
        email?: string;
    }>;
    handleGetAccountinSession(sidStr: string, authuser: number, apiSidStr: string): Promise<{
        accounts: Array<{
            primary?: boolean;
            authuser: number;
            email: string;
            name: string;
            picture: string;
            state: EAuthState;
        }>;
        newAPISID: string;
    }>;
    handleSigninWithSID(authuser: number, sidStr: string): Promise<void>;
    handleSigninWithPassword(accountId: Types.ObjectId, password: string, os: string, device: string, browser: string, ip: string, sidStr: string): Promise<{
        newSID: string;
    }>;
    handleSignOut(accountId: Types.ObjectId, sidStr: string): Promise<void>;
    handleSignoutAllAccounts(sidStr: string): Promise<void>;
    handleRemoveAccountinSession(authuser: number, sidStr: string): Promise<SessionDocument>;
}
