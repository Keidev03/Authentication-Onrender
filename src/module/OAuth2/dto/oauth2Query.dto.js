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
exports.DOAuth2Query = void 0;
const class_validator_1 = require("class-validator");
const mongoose_1 = require("mongoose");
const common_1 = require("../../../common");
const class_transformer_1 = require("class-transformer");
class DOAuth2Query {
}
exports.DOAuth2Query = DOAuth2Query;
__decorate([
    (0, class_validator_1.IsMongoId)({ message: 'The "client_id" parameter is required and must be a valid MongoDB ObjectId' }),
    __metadata("design:type", mongoose_1.Types.ObjectId)
], DOAuth2Query.prototype, "clientId", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'The "redirect_uri" parameter is required and must be a valid string' }),
    (0, class_validator_1.IsUrl)({ require_tld: false }, { message: 'The "redirect_uri" parameter must be a valid URL' }),
    __metadata("design:type", String)
], DOAuth2Query.prototype, "redirectUri", void 0);
__decorate([
    (0, class_transformer_1.Transform)(({ value }) => {
        const responseTypes = value
            .split(/[\s,]+/)
            .map((responseType) => responseType.trim().toLowerCase())
            .filter(Boolean);
        const data = responseTypes.map((responseType) => {
            if (Object.values(common_1.EResponseType).includes(responseType)) {
                return responseType;
            }
            throw new Error(`Invalid responseType: ${responseType}`);
        });
        return data;
    }, { toClassOnly: true }),
    (0, class_validator_1.IsArray)({ message: 'The "response_type" parameter is required and must be an array' }),
    (0, class_validator_1.ArrayNotEmpty)({ message: 'The "response_type" parameter cannot be empty' }),
    (0, class_validator_1.IsEnum)(common_1.EResponseType, { each: true, message: 'Each value in "response_type" must be a valid EResponseType' }),
    __metadata("design:type", Array)
], DOAuth2Query.prototype, "responseType", void 0);
__decorate([
    (0, class_transformer_1.Transform)(({ value }) => {
        const scopes = value
            .split(/[\s,]+/)
            .map((scope) => scope.trim().toLowerCase())
            .filter(Boolean);
        const data = scopes.map((scope) => {
            if (Object.values(common_1.EScope).includes(scope)) {
                return scope;
            }
            throw new Error(`Invalid scope: ${scope}`);
        });
        return data;
    }, { toClassOnly: true }),
    (0, class_validator_1.IsArray)({ message: 'The "scope" parameter is required and must be an array' }),
    (0, class_validator_1.ArrayNotEmpty)({ message: 'The "scope" parameter cannot be empty' }),
    (0, class_validator_1.IsEnum)(common_1.EScope, { each: true, message: 'Each value in "scope" must be a valid EScope' }),
    __metadata("design:type", Array)
], DOAuth2Query.prototype, "scope", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(common_1.EResponseMode, { message: 'The "response_mode" parameter is required and must be a valid EResponseMode' }),
    __metadata("design:type", String)
], DOAuth2Query.prototype, "responseMode", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'The "prompt" parameter is required and must be a valid string' }),
    (0, class_validator_1.IsEnum)(common_1.EPrompt, { message: 'The "prompt" parameter must be a valid EPrompt' }),
    __metadata("design:type", String)
], DOAuth2Query.prototype, "prompt", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'The "state" parameter is required and must be a valid string' }),
    __metadata("design:type", String)
], DOAuth2Query.prototype, "state", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(common_1.EAccessType, { message: 'The "access_type" parameter must be a valid EAccessType, if provided' }),
    __metadata("design:type", String)
], DOAuth2Query.prototype, "accessType", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'The "nonce" parameter is required and must be a valid string' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], DOAuth2Query.prototype, "nonce", void 0);
//# sourceMappingURL=oauth2Query.dto.js.map