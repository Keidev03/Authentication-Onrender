import { Response } from 'express';
import { IUserAgentInfo, CryptoService } from '../../common';
import { DOAuth2Query } from './dto';
import { OAuth2Service } from './oauth2.service';
import { DOAuth2BodyPassword, DOAuth2BodySession } from './dto/oauth2Body.dto';
export declare class OAuth2Controller {
    private readonly oauth2Service;
    private readonly cryptoService;
    constructor(oauth2Service: OAuth2Service, cryptoService: CryptoService);
    postOAuth2SigninSession(query: DOAuth2Query, body: DOAuth2BodySession, sidStr: string): Promise<{
        form: any;
        fragment: any;
        query: any;
        uri: string;
        client_name: string;
        client_picture: string;
        email: string;
        picture: string;
        consent: {
            privacy_policy: string;
            terms_of_service: string;
        };
    }>;
    postOAuth2SigninPassword(query: DOAuth2Query, body: DOAuth2BodyPassword, sidStr: string, aisStr: string, useragent: IUserAgentInfo, response: Response): Promise<Response<any, Record<string, any>>>;
}
