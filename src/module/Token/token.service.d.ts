/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose/types/inferschematype" />
import { ClientSession, Connection, Model, Types } from 'mongoose';
import { Cache } from '@nestjs/cache-manager';
import { JwtService } from '@nestjs/jwt';
import { Token, TokenDocument, TokenFields } from './token.schema';
import { CryptoService, EScope } from '../../common';
import { ClientService } from '../Client/client.service';
import { SessionService } from '../Session/session.service';
import { AccountService } from '../Account/account.service';
export declare class TokenService {
    private readonly tokenModel;
    private readonly accountService;
    private readonly clientService;
    private readonly sessionService;
    private readonly cryptoService;
    private readonly jwtService;
    private readonly connection;
    private readonly cacheManager;
    constructor(tokenModel: Model<TokenDocument>, accountService: AccountService, clientService: ClientService, sessionService: SessionService, cryptoService: CryptoService, jwtService: JwtService, connection: Connection, cacheManager: Cache);
    handleSaveToken(sid: string, clientId: Types.ObjectId, accountId: Types.ObjectId, scope: EScope[], expireafterSeconds: number, transaction?: ClientSession): Promise<TokenDocument>;
    handleFindOneTokenByFields(sid: string | undefined, accountId: Types.ObjectId | undefined, clientId: Types.ObjectId | undefined, fields?: Array<TokenFields>): Promise<TokenDocument>;
    handleFindTokens(limit: number, lastId: Types.ObjectId | undefined, fields?: Array<TokenFields>): Promise<{
        tokens: TokenDocument[];
        totalRecords: number;
    }>;
    handleFindOneToken(_id: string, fields?: Array<TokenFields>): Promise<TokenDocument>;
    handleDeleteToken(_id: string): Promise<void>;
    handleDeleteAllTokensByClient(clientId: Types.ObjectId): Promise<void>;
    handleDeleteAllTokensByAccountId(accountId: Types.ObjectId): Promise<void>;
    handleDeleteAllTokensByFields(sid: string, accountId: Types.ObjectId, clientId: Types.ObjectId): Promise<void>;
    handleDeleteTokenByFields(sid: string, accountId: Types.ObjectId, clientId: Types.ObjectId, transaction?: ClientSession): Promise<void>;
    handleUpdateScopeInToken(_id: string, scope: EScope[], retrieve?: boolean, transaction?: ClientSession): Promise<import("mongoose").Document<unknown, {}, TokenDocument> & import("mongoose").Document<unknown, {}, Token> & Token & Required<{
        _id: string;
    }> & {
        createdAt: Date;
        updatedAt: Date;
    }>;
    handleCreateAccessToken(clientId: Types.ObjectId, accountId: Types.ObjectId, scope: EScope[]): {
        accessToken: string;
        expiresIn: number;
        tokenType: string;
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
