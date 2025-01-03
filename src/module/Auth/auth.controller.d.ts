import { Response } from 'express';
import { IUserAgentInfo, CryptoService } from '../../common';
import { DAuthBodyPassword, DAuthBodySession, DAuthQuery, DAuthIdentifier, DAuthSessionInBrowser } from './dto';
import { AccountService } from '../Account/account.service';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
export declare class AuthController {
    private readonly authService;
    private readonly accountService;
    private readonly cryptoService;
    private readonly configService;
    constructor(authService: AuthService, accountService: AccountService, cryptoService: CryptoService, configService: ConfigService);
    getIdentifier(query: DAuthIdentifier, useragent: IUserAgentInfo): Promise<{
        TL?: string;
        status?: string;
        email?: string;
    } | {
        email: string;
        name: string;
        picture: string;
    }>;
    getAccountinSession(query: DAuthSessionInBrowser, sidStr: string, apiSidStr: string, response: Response): Promise<Response<any, Record<string, any>>>;
    removeAccountinSession(authuser: number, sidStr: string): Promise<{
        accounts: import("../Session/session.schema").SessionDocument;
    }>;
    postOAuth2SigninSession(query: DAuthQuery, body: DAuthBodySession, sidStr: string): Promise<{
        uri: string;
    }>;
    postOAuth2SigninPassword(query: DAuthQuery, body: DAuthBodyPassword, sidStr: string, useragent: IUserAgentInfo, response: Response): Promise<Response<any, Record<string, any>>>;
    getSignoutOfAllAccounts(sidStr: string): Promise<void>;
}
