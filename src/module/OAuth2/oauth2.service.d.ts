import { Cache } from '@nestjs/cache-manager';
import { Types, Connection } from 'mongoose';
import { CryptoService, EAccessType, EPrompt, EResponseType, EScope } from '../../common';
import { AccountService } from '../Account/account.service';
import { TokenService } from '../Token/token.service';
import { SessionService } from '../Session/session.service';
import { ClientService } from '../Client/client.service';
export declare class OAuth2Service {
    private readonly accountService;
    private readonly sessionService;
    private readonly clientService;
    private readonly tokenService;
    private readonly cryptoService;
    private readonly connection;
    private readonly cacheManager;
    constructor(accountService: AccountService, sessionService: SessionService, clientService: ClientService, tokenService: TokenService, cryptoService: CryptoService, connection: Connection, cacheManager: Cache);
    handleSigninWithSID(authuser: number, clientId: Types.ObjectId, redirectUri: string, responseType: EResponseType[], scope: EScope[], accessType: EAccessType, prompt: EPrompt, nonce: string, state: string, sidStr: string): Promise<{
        clientName: string;
        clientPicture: string;
        redirectUri: string;
        email: string;
        picture: string;
        code?: string;
        accessToken?: string;
        expiresIn?: number;
        tokenType?: string;
        idToken?: string;
        scope: string;
        consent?: {
            privacyPolicy: string;
            termsOfService: string;
        };
        authuser: number;
    }>;
    handleSigninWithPassword(accountId: Types.ObjectId, password: string, clientId: Types.ObjectId, redirectUri: string, responseType: EResponseType[], scope: EScope[], accessType: EAccessType, prompt: EPrompt, nonce: string, state: string, os: string, device: string, browser: string, ip: string, sidStr: string): Promise<{
        clientName: string;
        clientPicture: string;
        newSID: string;
        redirectUri: string;
        email: string;
        picture: string;
        code?: string;
        accessUoken?: string;
        expiresIn?: number;
        tokenType?: string;
        idToken?: string;
        scope: string;
        consent?: {
            privacyPolicy: string;
            termsOfService: string;
        };
        authuser: number;
    }>;
    handleCode(sid: string, accountId: Types.ObjectId, scope: EScope[], accessType: EAccessType, nonce: string): string;
    buildResponse(data: any, state: string, scope: EScope[], prompt: string): any;
}
