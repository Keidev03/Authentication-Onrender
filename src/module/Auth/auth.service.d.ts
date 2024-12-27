import { Connection, Types } from 'mongoose';
import { CryptoService, IUserAgentInfo } from '../../common';
import { SessionService } from '../Session/session.service';
import { SessionDocument } from '../Session/session.schema';
import { AccountService } from '../Account/account.service';
export declare class AuthService {
    private readonly accountService;
    private readonly sessionService;
    private readonly cryptoService;
    private readonly connection;
    constructor(accountService: AccountService, sessionService: SessionService, cryptoService: CryptoService, connection: Connection);
    handleIdentifier(email: string, useragent: IUserAgentInfo): Promise<string>;
    handleGetAccountsSID(sidStr: string): Promise<any>;
    handleSigninWithSID(authuser: number, sidStr: string): Promise<void>;
    handleSigninWithPassword(accountId: Types.ObjectId, password: string, os: string, device: string, browser: string, ip: string, sidStr: string): Promise<{
        newSID: string;
    }>;
    handleSignOut(accountId: Types.ObjectId, sidStr: string): Promise<void>;
    handleSignoutAllAccounts(sidStr: string): Promise<void>;
    handleRemoveAccountInSession(authuser: number, sidStr: string): Promise<SessionDocument>;
}
