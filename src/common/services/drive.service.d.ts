import { ConfigService } from '@nestjs/config';
export declare class GoogleDriveService {
    private configService;
    private readonly drive;
    private readonly logger;
    constructor(configService: ConfigService);
    private initDrive;
    private PublicFile;
    UploadImage(fileImage: any, nameImage: string, width: number, height: number, maxFileSizeKB: number, idFolder: string): Promise<any>;
    DeleteFile(id: string): Promise<void>;
}
