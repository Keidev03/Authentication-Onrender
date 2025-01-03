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
exports.DTokenOAuth2Query = void 0;
const class_validator_1 = require("class-validator");
const mongoose_1 = require("mongoose");
const common_1 = require("../../../common");
class DTokenOAuth2Query {
}
exports.DTokenOAuth2Query = DTokenOAuth2Query;
__decorate([
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", mongoose_1.Types.ObjectId)
], DTokenOAuth2Query.prototype, "clientId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DTokenOAuth2Query.prototype, "clientSecret", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.ValidateIf)((o) => o.grant_type === common_1.EOAuth2GrantType.AUTHORIZATION_CODE),
    __metadata("design:type", String)
], DTokenOAuth2Query.prototype, "code", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.ValidateIf)((o) => o.grant_type === common_1.EOAuth2GrantType.AUTHORIZATION_CODE),
    __metadata("design:type", String)
], DTokenOAuth2Query.prototype, "redirectUri", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.ValidateIf)((o) => o.grant_type === common_1.EOAuth2GrantType.REFRESH_TOKEN),
    __metadata("design:type", String)
], DTokenOAuth2Query.prototype, "refreshToken", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsEnum)(common_1.EOAuth2GrantType),
    __metadata("design:type", String)
], DTokenOAuth2Query.prototype, "grantType", void 0);
//# sourceMappingURL=tokenOAuth2Query.js.map