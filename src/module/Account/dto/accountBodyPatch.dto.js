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
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsPhoneNumber = exports.DAccountBodyPatch = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const libphonenumber_js_1 = require("libphonenumber-js");
const common_1 = require("../../../common");
const location_account_enum_1 = require("../../../common/enums/account/location.account.enum");
class DAccountBodyPatch {
}
exports.DAccountBodyPatch = DAccountBodyPatch;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], DAccountBodyPatch.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DAccountBodyPatch.prototype, "firstName", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DAccountBodyPatch.prototype, "lastName", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DAccountBodyPatch.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(6),
    __metadata("design:type", String)
], DAccountBodyPatch.prototype, "oldPassword", void 0);
__decorate([
    (0, class_validator_1.ValidateIf)((o) => o.oldPassword !== undefined),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(6),
    __metadata("design:type", String)
], DAccountBodyPatch.prototype, "newPassword", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => {
        const roles = value
            .split(/[\s,]+/)
            .map((role) => role.trim().toLowerCase())
            .filter(Boolean);
        const data = roles.map((role) => {
            if (Object.values(common_1.EOAuth2Scope).includes(role)) {
                return roles;
            }
            throw new Error(`Invalid role: ${role}`);
        });
        return data;
    }, { toClassOnly: true }),
    (0, class_validator_1.IsArray)({ message: 'The "roles" parameter is required and must be an array' }),
    (0, class_validator_1.ArrayNotEmpty)({ message: 'The "roles" parameter cannot be empty' }),
    (0, class_validator_1.IsEnum)(common_1.EOAuth2Scope, { each: true, message: 'Each value in "roles" must be a valid EOAuth2Scope' }),
    __metadata("design:type", Array)
], DAccountBodyPatch.prototype, "roles", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => new Date(value)),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], DAccountBodyPatch.prototype, "dateOfBirth", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DAccountBodyPatch.prototype, "gender", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    IsPhoneNumber({ message: 'Invalid international phone number format' }),
    __metadata("design:type", String)
], DAccountBodyPatch.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DAccountBodyPatch.prototype, "address", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsEnum)(location_account_enum_1.EAccountLocation),
    __metadata("design:type", String)
], DAccountBodyPatch.prototype, "location", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsEnum)(common_1.EAccountLanguage),
    __metadata("design:type", String)
], DAccountBodyPatch.prototype, "language", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsMongoId)(),
    (0, class_validator_1.IsArray)({ message: 'The "roles" parameter is required and must be an array' }),
    (0, class_validator_1.ArrayNotEmpty)({ message: 'The "roles" parameter cannot be empty' }),
    __metadata("design:type", Array)
], DAccountBodyPatch.prototype, "clientId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsEnum)(common_1.EAccountState),
    __metadata("design:type", String)
], DAccountBodyPatch.prototype, "state", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsEnum)(common_1.EAccountVerification),
    __metadata("design:type", String)
], DAccountBodyPatch.prototype, "verification", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsEnum)(common_1.EAccountProcessing),
    __metadata("design:type", String)
], DAccountBodyPatch.prototype, "processing", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], DAccountBodyPatch.prototype, "expiredAt", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => value === 'true'),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], DAccountBodyPatch.prototype, "keepSignedIn", void 0);
function IsPhoneNumber(validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            name: 'isPhoneNumber',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value, args) {
                    if (typeof value !== 'string')
                        return false;
                    try {
                        const phoneNumber = (0, libphonenumber_js_1.default)(value);
                        return phoneNumber?.isValid() || false;
                    }
                    catch {
                        return false;
                    }
                },
                defaultMessage() {
                    return 'Invalid phone number';
                },
            },
        });
    };
}
exports.IsPhoneNumber = IsPhoneNumber;
//# sourceMappingURL=accountBodyPatch.dto.js.map