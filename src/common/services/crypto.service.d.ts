import { ConfigService } from '@nestjs/config';
export declare class CryptoService {
    private configService;
    private privateKey;
    private publicKey;
    private secretKey;
    private ivKey;
    private readonly algorithm;
    constructor(configService: ConfigService);
    calculateAtHash(token: string): string;
    private toBase64Url;
    private fromBase64Url;
    encrypt(payload: Record<string, any>): string;
    decrypt(data: string): Record<string, any> | null;
    generateSignature(payload: {
        exp?: number;
        [key: string]: any;
    }): string;
    validateSignature(tokenURIComponent: string): Record<any, string> | null;
    generateAccessToken(payload: {
        exp: number;
        [key: string]: any;
    }): string;
    validateAccessToken(tokenURIComponent: string): Record<any, any> | null;
    encodeAIS(ids: string[]): string;
    decodeAIS(encodedString: string): string[];
}
