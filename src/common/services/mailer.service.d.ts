import { ConfigService } from '@nestjs/config';
export declare class MailerService {
    private readonly configService;
    private readonly user;
    private readonly password;
    private readonly mailsend;
    constructor(configService: ConfigService);
    Gmail(emailUser: string, subject: string, htmlMailForm: string): Promise<void>;
}
