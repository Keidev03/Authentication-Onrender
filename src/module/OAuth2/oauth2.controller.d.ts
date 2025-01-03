import { Response } from 'express';
import { IUserAgentInfo, CryptoService } from '../../common';
import { DOAuth2Query, DOAuth2BodyPassword, DOAuth2BodySession } from './dto';
import { OAuth2Service } from './oauth2.service';
import { ConfigService } from '@nestjs/config';
export declare class OAuth2Controller {
    private readonly oauth2Service;
    private readonly cryptoService;
    private readonly configService;
    constructor(oauth2Service: OAuth2Service, cryptoService: CryptoService, configService: ConfigService);
    postOAuth2SigninSession(query: DOAuth2Query, body: DOAuth2BodySession, sidStr: string): Promise<{
        form: any;
        fragment: any;
        query: any;
        uri: string;
        clientName: string;
        clientPicture: string;
        email: string;
        picture: string;
        consent: {
            privacyPolicy: string;
            termsOfService: string;
        };
    }>;
    postOAuth2SigninPassword(query: DOAuth2Query, body: DOAuth2BodyPassword, sidStr: string, useragent: IUserAgentInfo, response: Response): Promise<Response<any, Record<string, any>>>;
}
