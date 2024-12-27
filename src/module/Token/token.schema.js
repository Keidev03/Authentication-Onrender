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
exports.TokenSchema = exports.Token = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const session_schema_1 = require("../Session/session.schema");
const client_schema_1 = require("../Client/client.schema");
const common_1 = require("../../common");
const account_schema_1 = require("../Account/account.schema");
let Token = class Token {
};
exports.Token = Token;
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true }),
    __metadata("design:type", String)
], Token.prototype, "_id", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, index: true, required: true, ref: session_schema_1.Session.name }),
    __metadata("design:type", String)
], Token.prototype, "sid", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: mongoose_2.Types.ObjectId,
        index: true,
        required: true,
        ref: client_schema_1.Client.name,
    }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Token.prototype, "clientId", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: mongoose_2.Types.ObjectId,
        index: true,
        required: true,
        ref: account_schema_1.Account.name,
    }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Token.prototype, "accountId", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [String],
        enum: common_1.EScope,
        default: [common_1.EScope.PROFILE],
    }),
    __metadata("design:type", Array)
], Token.prototype, "scope", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date, index: { expires: '0' } }),
    __metadata("design:type", Date)
], Token.prototype, "expiredAt", void 0);
exports.Token = Token = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true, _id: false })
], Token);
exports.TokenSchema = mongoose_1.SchemaFactory.createForClass(Token);
exports.TokenSchema.index({ createdAt: 1 });
//# sourceMappingURL=token.schema.js.map