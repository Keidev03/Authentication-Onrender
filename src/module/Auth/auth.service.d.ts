import { Connection, Types } from 'mongoose';
import { CryptoService, IUserAgentInfo } from '../../common';
import { UserService } from '../User/user.service';
import { TokenService } from '../Token/token.service';
import { SessionService } from '../Session/session.service';
export declare class AuthService {
    private readonly userService;
    private readonly sessionService;
    private readonly tokenService;
    private readonly cryptoService;
    private readonly connection;
    constructor(userService: UserService, sessionService: SessionService, tokenService: TokenService, cryptoService: CryptoService, connection: Connection);
    handleIdentifier(email: string, useragent: IUserAgentInfo): Promise<string>;
    handleGetAccountsSID(sidStr: string, aisStr: string): Promise<{
        data: {
            sub: string;
            email: string;
            name: string;
            picture: string;
            signed_out: boolean;
        }[];
        newAIS: string;
    }>;
    handleSignoutOfAllAccounts(sidStr: string): Promise<void>;
    handleSigninWithSID(accountId: Types.ObjectId, sidStr: string): Promise<void>;
    handleSigninWithPassword(accountId: Types.ObjectId, password: string, os: string, device: string, browser: string, ip: string, sidStr: string, aisStr?: string): Promise<{
        newSID: string;
        newAIS: string;
    }>;
    handleRemoveAccountSessionClient(accountId: Types.ObjectId, sidStr: string, aisStr: string): Promise<{
        newAccounts: string[];
        newAisStr: string;
    }>;
}
