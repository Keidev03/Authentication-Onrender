import { TokenService } from './token.service';
import { DTokenOAuth2Query } from './dto/tokenOAuth2Query';
export declare class TokenController {
    private readonly tokenService;
    constructor(tokenService: TokenService);
    getAccessToken(body: DTokenOAuth2Query): Promise<{
        access_token: string;
        expires_in: number;
        scope: string;
        token_type: string;
    }>;
    getAllTokens(): Promise<{
        tokens: import("./token.schema").TokenDocument[];
        totalRecords: number;
    }>;
    getToken(id: string): Promise<import("./token.schema").TokenDocument>;
    deleteToken(id: string): Promise<void>;
}
