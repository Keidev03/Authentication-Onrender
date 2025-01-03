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
exports.AccountSchema = exports.Account = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const common_1 = require("../../common");
const location_account_enum_1 = require("../../common/enums/account/location.account.enum");
let Account = class Account {
};
exports.Account = Account;
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        required: true,
        unique: true,
        match: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    }),
    __metadata("design:type", String)
], Account.prototype, "email", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true }),
    __metadata("design:type", String)
], Account.prototype, "firstName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true }),
    __metadata("design:type", String)
], Account.prototype, "lastName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true }),
    __metadata("design:type", String)
], Account.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true }),
    __metadata("design:type", String)
], Account.prototype, "password", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], enum: common_1.EAccountRoles, default: [common_1.EAccountRoles.USER] }),
    __metadata("design:type", Array)
], Account.prototype, "roles", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date }),
    __metadata("design:type", Date)
], Account.prototype, "dateOfBirth", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], Account.prototype, "gender", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], Account.prototype, "phone", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], Account.prototype, "address", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: location_account_enum_1.EAccountLocation, default: location_account_enum_1.EAccountLocation.USA }),
    __metadata("design:type", String)
], Account.prototype, "location", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: common_1.EAccountLanguage, default: common_1.EAccountLanguage.English_US }),
    __metadata("design:type", String)
], Account.prototype, "language", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], Account.prototype, "picture", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [mongoose_2.Types.ObjectId], ref: 'Client' }),
    __metadata("design:type", Array)
], Account.prototype, "clientId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: common_1.EAccountState, default: common_1.EAccountState.ACTIVE }),
    __metadata("design:type", String)
], Account.prototype, "state", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: common_1.EAccountVerification, default: common_1.EAccountVerification.UNVERIFIED }),
    __metadata("design:type", String)
], Account.prototype, "verification", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: common_1.EAccountProcessing, default: common_1.EAccountProcessing.NONE }),
    __metadata("design:type", String)
], Account.prototype, "processing", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date, index: { expires: '0' } }),
    __metadata("design:type", Date)
], Account.prototype, "expiredAt", void 0);
exports.Account = Account = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Account);
exports.AccountSchema = mongoose_1.SchemaFactory.createForClass(Account);
//# sourceMappingURL=account.schema.js.map