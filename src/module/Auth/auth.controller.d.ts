import { Response } from 'express';
import { IUserAgentInfo, CryptoService } from '../../common';
import { DAuthBodyPassword, DAuthBodySession, DAuthQuery, DAuthIdentifier } from './dto';
import { AccountService } from '../Account/account.service';
import { AuthService } from './auth.service';
export declare class AuthController {
    private readonly authService;
    private readonly accountService;
    private readonly cryptoService;
    constructor(authService: AuthService, accountService: AccountService, cryptoService: CryptoService);
    getIdentifier(query: DAuthIdentifier, useragent: IUserAgentInfo): Promise<{
        TL: string;
        email?: undefined;
        name?: undefined;
        picture?: undefined;
    } | {
        email: string;
        name: string;
        picture: string;
        TL?: undefined;
    }>;
    getAccountsSID(sidStr: string): Promise<any>;
    removeAccountSIDClient(authuser: number, sidStr: string): Promise<{
        accounts: import("../Session/session.schema").SessionDocument;
    }>;
    postOAuth2SigninSession(query: DAuthQuery, body: DAuthBodySession, sidStr: string): Promise<{
        uri: string;
    }>;
    postOAuth2SigninPassword(query: DAuthQuery, body: DAuthBodyPassword, sidStr: string, useragent: IUserAgentInfo, response: Response): Promise<Response<any, Record<string, any>>>;
    getSignoutOfAllAccounts(sidStr: string): Promise<void>;
}
