"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runFileValidation = exports.FileTypeValidator = exports.FileSizeValidator = void 0;
const common_1 = require("@nestjs/common");
const runFileValidation = async (args) => {
    if (args.multiple) {
        const fileFields = Object.keys(args.file);
        for (const field of fileFields) {
            const fieldFile = args.file[field];
            if (Array.isArray(fieldFile)) {
                for (const f of fieldFile) {
                    if (!(await args.validator(f))) {
                        return { errorFileName: f.originalname, isValid: false };
                    }
                }
            }
            else {
                if (!(await args.validator(fieldFile))) {
                    return { errorFileName: fieldFile.originalname, isValid: false };
                }
            }
        }
        return { isValid: true };
    }
    if (Array.isArray(args.file)) {
        for (const f of args.file) {
            if (!(await args.validator(f))) {
                return { errorFileName: f.originalname, isValid: false };
            }
        }
        return { isValid: true };
    }
    if (!(await args.validator(args.file))) {
        return { errorFileName: args.file.originalname, isValid: false };
    }
    return { isValid: true };
};
exports.runFileValidation = runFileValidation;
class FileSizeValidator extends common_1.FileValidator {
    constructor(args) {
        super({});
        this.maxSizeBytes = args.maxSizeBytes;
        this.multiple = args.multiple;
    }
    async isValid(file) {
        const result = await runFileValidation({
            file,
            multiple: this.multiple,
            validator: (f) => f.size < this.maxSizeBytes,
        });
        this.errorFileName = result.errorFileName;
        return result.isValid;
    }
    buildErrorMessage(file) {
        return `File ${this.errorFileName || ''} exceeded the size limit of ` + parseFloat((this.maxSizeBytes / 1024 / 1024).toFixed(2)) + ' MB';
    }
}
exports.FileSizeValidator = FileSizeValidator;
class FileTypeValidator extends common_1.FileValidator {
    constructor(args) {
        super({});
        this.multiple = args.multiple;
        this.filetype = args.filetype;
    }
    isMimeTypeValid(file) {
        return typeof this.filetype === 'string' ? file.mimetype === this.filetype : this.filetype.test(file.mimetype);
    }
    async isValid(file) {
        const result = await runFileValidation({
            multiple: this.multiple,
            file: file,
            validator: (f) => this.isMimeTypeValid(f),
        });
        this.errorFileName = result.errorFileName;
        return result.isValid;
    }
    buildErrorMessage(file) {
        return `File ${this.errorFileName || ''} must be of type ${this.filetype}`;
    }
}
exports.FileTypeValidator = FileTypeValidator;
//# sourceMappingURL=fileValidator.middleware.js.map