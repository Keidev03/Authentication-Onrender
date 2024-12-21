/// <reference types="express-serve-static-core" />
/// <reference types="multer" />
import { FileValidator } from '@nestjs/common';
type FileType = Express.Multer.File | Express.Multer.File[] | Record<string, Express.Multer.File[]>;
type Result = {
    errorFileName?: string;
    isValid: boolean;
};
declare const runFileValidation: (args: {
    multiple: boolean;
    file: FileType;
    validator: (file: Express.Multer.File) => Promise<boolean> | boolean;
}) => Promise<Result>;
declare class FileSizeValidator extends FileValidator {
    private maxSizeBytes;
    private multiple;
    private errorFileName;
    constructor(args: {
        maxSizeBytes: number;
        multiple: boolean;
    });
    isValid(file?: Express.Multer.File | Express.Multer.File[] | Record<string, Express.Multer.File[]>): Promise<boolean>;
    buildErrorMessage(file: any): string;
}
declare class FileTypeValidator extends FileValidator {
    private multiple;
    private errorFileName;
    private filetype;
    constructor(args: {
        multiple: boolean;
        filetype: RegExp | string;
    });
    isMimeTypeValid(file: Express.Multer.File): boolean;
    isValid(file?: Express.Multer.File | Express.Multer.File[] | Record<string, Express.Multer.File[]>): Promise<boolean>;
    buildErrorMessage(file: any): string;
}
export { FileSizeValidator, FileTypeValidator, runFileValidation };
