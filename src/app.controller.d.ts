import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
export declare class AppController {
    private readonly configService;
    constructor(configService: ConfigService);
    serveFrontend(res: Response): void;
}
