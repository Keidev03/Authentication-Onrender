import { Response } from 'express';
import { IUserAgentInfo, CryptoService } from '../../common';
import { AuthService } from './auth.service';
import { UserService } from '../User/user.service';
import { DAuthBodyPassword, DAuthBodySession, DAuthQuery, DAuthIdentifier } from './dto';
import { Types } from 'mongoose';
export declare class AuthController {
    private readonly authService;
    private readonly userService;
    private readonly cryptoService;
    constructor(authService: AuthService, userService: UserService, cryptoService: CryptoService);
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
    getAccountsSID(sidStr: string, aisStr: string, response: Response): Promise<Response<any, Record<string, any>>>;
    removeAccountSIDClient(accountId: Types.ObjectId, sidStr: string, aisStr: string, response: Response): Promise<Response<any, Record<string, any>>>;
    postOAuth2SigninSession(query: DAuthQuery, body: DAuthBodySession, sidStr: string): Promise<{
        uri: string;
    }>;
    postOAuth2SigninPassword(query: DAuthQuery, body: DAuthBodyPassword, sidStr: string, aisStr: string, useragent: IUserAgentInfo, response: Response): Promise<Response<any, Record<string, any>>>;
    getSignoutOfAllAccounts(sidStr: string, response: Response): Promise<Response<any, Record<string, any>>>;
}
