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
exports.DAccountBodyPost = exports.IsPhoneNumber = exports.MatchPasswordConstraint = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const libphonenumber_js_1 = require("libphonenumber-js");
let MatchPasswordConstraint = class MatchPasswordConstraint {
    validate(confirm, args) {
        const [relatedPropertyName] = args.constraints;
        const password = args.object[relatedPropertyName];
        return password === confirm;
    }
    defaultMessage(args) {
        return 'Password and confirm password do not match.';
    }
};
exports.MatchPasswordConstraint = MatchPasswordConstraint;
exports.MatchPasswordConstraint = MatchPasswordConstraint = __decorate([
    (0, class_validator_1.ValidatorConstraint)({ name: 'MatchPassword', async: false })
], MatchPasswordConstraint);
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
class DAccountBodyPost {
}
exports.DAccountBodyPost = DAccountBodyPost;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DAccountBodyPost.prototype, "firstName", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DAccountBodyPost.prototype, "lastName", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DAccountBodyPost.prototype, "name", void 0);
__decorate([
    (0, class_transformer_1.Transform)(({ value }) => new Date(value)),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], DAccountBodyPost.prototype, "dateOfBirth", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DAccountBodyPost.prototype, "gender", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    IsPhoneNumber({ message: 'Invalid international phone number format' }),
    __metadata("design:type", String)
], DAccountBodyPost.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], DAccountBodyPost.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
        message: 'Password too weak. It must contain at least 8 characters, including a number, an uppercase letter, a lowercase letter, and a special character.',
    }),
    __metadata("design:type", String)
], DAccountBodyPost.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Validate)(MatchPasswordConstraint, ['password']),
    __metadata("design:type", String)
], DAccountBodyPost.prototype, "confirm", void 0);
//# sourceMappingURL=accountBodyPost.dto.js.map