import { ConfigService } from '@nestjs/config';
export declare class GoogleDriveService {
    private configService;
    private readonly drive;
    constructor(configService: ConfigService);
    private initDrive;
    private PublicFile;
    UploadImage(fileImage: any, nameImage: string, width: number, height: number, idFolder: string): Promise<any>;
    DeleteFile(id: string): Promise<void>;
}
