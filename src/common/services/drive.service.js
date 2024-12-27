"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var GoogleDriveService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleDriveService = void 0;
const googleapis_1 = require("googleapis");
const stream = require("stream");
const Jimp = require("jimp");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const path_1 = require("path");
let GoogleDriveService = GoogleDriveService_1 = class GoogleDriveService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(GoogleDriveService_1.name);
        this.drive = this.initDrive();
    }
    initDrive() {
        const auth = new googleapis_1.google.auth.GoogleAuth({
            keyFile: (0, path_1.resolve)('secret.json'),
            scopes: ['https://www.googleapis.com/auth/drive'],
        });
        return googleapis_1.google.drive({ version: 'v3', auth: auth });
    }
    async PublicFile(id) {
        try {
            const permissions = await this.drive.permissions.create({
                fileId: id,
                requestBody: {
                    role: 'reader',
                    type: 'anyone',
                },
            });
        }
        catch (error) {
            this.logger.error('Error making file public: ', error.stack);
            throw new common_1.InternalServerErrorException(error.message);
        }
    }
    async UploadImage(fileImage, nameImage, width, height, maxFileSizeKB = 500, idFolder) {
        try {
            const image = await Jimp.read(fileImage.buffer);
            let quality = 100;
            let buffer;
            do {
                buffer = await image.resize(width, height).quality(quality).getBufferAsync(Jimp.MIME_JPEG);
                if (buffer.length <= maxFileSizeKB * 1024)
                    break;
                quality -= 5;
            } while (quality > 10);
            const bufferStream = new stream.PassThrough();
            bufferStream.end(buffer);
            const response = await this.drive.files.create({
                media: {
                    mimeType: 'image/jpeg',
                    body: bufferStream,
                },
                requestBody: {
                    name: nameImage,
                    parents: [idFolder],
                },
            });
            const idImage = response.data.id;
            await this.PublicFile(idImage);
            return idImage;
        }
        catch (error) {
            this.logger.error(error.message);
            throw new common_1.InternalServerErrorException(error.message);
        }
    }
    async DeleteFile(id) {
        try {
            await this.drive.files.delete({ fileId: id });
        }
        catch (error) {
            this.logger.error('Error deleting file: ', error.message);
        }
    }
};
exports.GoogleDriveService = GoogleDriveService;
exports.GoogleDriveService = GoogleDriveService = GoogleDriveService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], GoogleDriveService);
//# sourceMappingURL=drive.service.js.map