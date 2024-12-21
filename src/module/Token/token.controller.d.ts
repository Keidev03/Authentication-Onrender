import { TokenService } from './token.service';
import { DGetAccessToken } from './dto/getAccessToken.dto';
export declare class TokenController {
    private readonly tokenService;
    constructor(tokenService: TokenService);
    getAccessToken(body: DGetAccessToken): Promise<{
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
