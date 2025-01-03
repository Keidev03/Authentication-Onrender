import { Cache } from '@nestjs/cache-manager';
import { Types, Connection } from 'mongoose';
import { CryptoService, EOAuth2AccessType, EOAuth2Prompt, EOAuth2ResponseType, EOAuth2Scope } from '../../common';
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
    handleSigninWithSID(authuser: number, clientId: Types.ObjectId, redirectUri: string, responseType: EOAuth2ResponseType[], scope: EOAuth2Scope[], accessType: EOAuth2AccessType, prompt: EOAuth2Prompt, nonce: string, state: string, sidStr: string): Promise<{
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
    handleSigninWithPassword(accountId: Types.ObjectId, password: string, clientId: Types.ObjectId, redirectUri: string, responseType: EOAuth2ResponseType[], scope: EOAuth2Scope[], accessType: EOAuth2AccessType, prompt: EOAuth2Prompt, nonce: string, state: string, os: string, device: string, browser: string, ip: string, sidStr: string): Promise<{
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
    handleCode(sid: string, accountId: Types.ObjectId, scope: EOAuth2Scope[], accessType: EOAuth2AccessType, nonce: string): string;
    buildResponse(data: any, state: string, scope: EOAuth2Scope[], prompt: string): any;
}
