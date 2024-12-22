import { ClientSession, Model, Types } from 'mongoose';
import { Cache } from '@nestjs/cache-manager';
import { JwtService } from '@nestjs/jwt';
import { TokenDocument, TokenFields } from './token.schema';
import { CryptoService, EScope } from '../../common';
import { UserService } from '../User/user.service';
import { ClientService } from '../Client/client.service';
import { SessionService } from '../Session/session.service';
export declare class TokenService {
    private readonly tokenModel;
    private readonly userService;
    private readonly clientService;
    private readonly sessionService;
    private readonly cryptoService;
    private readonly jwtService;
    private readonly cacheManager;
    constructor(tokenModel: Model<TokenDocument>, userService: UserService, clientService: ClientService, sessionService: SessionService, cryptoService: CryptoService, jwtService: JwtService, cacheManager: Cache);
    handleCreateToken(sid: string, clientId: Types.ObjectId, accountId: Types.ObjectId, scope: EScope[], expireafterSeconds: number, transaction?: ClientSession): Promise<TokenDocument>;
    handleGetTokenByFields(sid: string, accountId: Types.ObjectId, clientId: Types.ObjectId, fields?: Array<TokenFields>): Promise<TokenDocument>;
    handleGetAllTokens(limit: number, lastId: Types.ObjectId | undefined, fields?: Array<TokenFields>): Promise<{
        tokens: TokenDocument[];
        totalRecords: number;
    }>;
    handleGetToken(_id: string, fields?: Array<TokenFields>): Promise<TokenDocument | null>;
    handleDeleteTokenByFields(sid: string, accountId: Types.ObjectId, clientId: Types.ObjectId): Promise<void>;
    handleDeleteToken(_id: string): Promise<void>;
    handleDeleteAllTokensByFields(sid: string, accountId: Types.ObjectId, clientId: Types.ObjectId): Promise<void>;
    handleDeleteAllTokensInClient(clientId: Types.ObjectId): Promise<void>;
    handleDeleteAllTokensInAccountId(accountId: Types.ObjectId): Promise<void>;
    handleUpdateScopeInToken(_id: string, scope: EScope[], transaction?: ClientSession): Promise<boolean>;
    handleCreateAccessToken(SID: string, clientId: Types.ObjectId, accountId: Types.ObjectId, scope: EScope[]): {
        access_token: string;
        expires_in: number;
        token_type: string;
    };
    handleCreateIDToken(sub: string, aud: Types.ObjectId, exp: number, name: string, firstName: string, lastName: string, picture: string, accessToken: string, nonce: string): string;
    handleUpdateExpiredInToken(_id: string, expiredAt: Date, transaction?: ClientSession): Promise<boolean>;
    handleGetAccessTokenByAuthorizationCodeGrant(clientId: Types.ObjectId, clientSecret: string, code: string, redirectUri: string): Promise<{
        access_token: string;
        expires_in: number;
        refresh_token?: string;
        scope: string;
        token_type: string;
    }>;
    handleGetAccessTokenByRefreshTokenGrant(clientId: Types.ObjectId, clientSecret: string, refreshToken: string, redirectUri: string): Promise<{
        access_token: string;
        expires_in: number;
        scope: string;
        token_type: string;
    }>;
}
