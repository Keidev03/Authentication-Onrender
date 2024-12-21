import { Cache } from '@nestjs/cache-manager';
import { Types, Connection } from 'mongoose';
import { CryptoService, EAccessType, EPrompt, EResponseType, EScope } from '../../common';
import { UserService } from '../User/user.service';
import { TokenService } from '../Token/token.service';
import { SessionService } from '../Session/session.service';
import { ClientService } from '../Client/client.service';
export declare class OAuth2Service {
    private readonly userService;
    private readonly sessionService;
    private readonly clientService;
    private readonly tokenService;
    private readonly cryptoService;
    private readonly connection;
    private readonly cacheManager;
    constructor(userService: UserService, sessionService: SessionService, clientService: ClientService, tokenService: TokenService, cryptoService: CryptoService, connection: Connection, cacheManager: Cache);
    handleSigninWithSID(accountId: Types.ObjectId, clientId: Types.ObjectId, redirectUri: string, responseType: EResponseType[], scope: EScope[], accessType: EAccessType, prompt: EPrompt, nonce: string, state: string, sidStr: string): Promise<{
        client_name: string;
        client_picture: string;
        redirect_uri: string;
        email: string;
        picture: string;
        code?: string;
        access_token?: string;
        expires_in?: number;
        token_type?: string;
        id_token?: string;
        scope: string;
        consent?: {
            privacy_policy: string;
            terms_of_service: string;
        };
        authuser: string;
    }>;
    handleSigninWithPassword(accountId: Types.ObjectId, password: string, clientId: Types.ObjectId, redirectUri: string, responseType: EResponseType[], scope: EScope[], accessType: EAccessType, prompt: EPrompt, nonce: string, state: string, os: string, device: string, browser: string, ip: string, sidStr: string, aisStr?: string): Promise<{
        client_name: string;
        client_picture: string;
        newSID: string;
        newAIS: string;
        redirect_uri: string;
        email: string;
        picture: string;
        code?: string;
        access_token?: string;
        expires_in?: number;
        token_type?: string;
        id_token?: string;
        scope: string;
        consent?: {
            privacy_policy: string;
            terms_of_service: string;
        };
        authuser: string;
    }>;
    handleCode(sid: string, accountId: Types.ObjectId, scope: EScope[], accessType: EAccessType, nonce: string): string;
    buildResponse(data: any, state: string, scope: EScope[], prompt: string): any;
}
