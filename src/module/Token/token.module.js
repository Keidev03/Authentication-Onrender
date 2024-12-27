"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const token_schema_1 = require("./token.schema");
const token_service_1 = require("./token.service");
const token_controller_1 = require("./token.controller");
const client_module_1 = require("../Client/client.module");
const common_2 = require("../../common");
const session_module_1 = require("../Session/session.module");
const oauth2_module_1 = require("../OAuth2/oauth2.module");
const account_module_1 = require("../Account/account.module");
let TokenModule = class TokenModule {
};
exports.TokenModule = TokenModule;
exports.TokenModule = TokenModule = __decorate([
    (0, common_1.Module)({
        imports: [mongoose_1.MongooseModule.forFeature([{ name: token_schema_1.Token.name, schema: token_schema_1.TokenSchema }]), (0, common_1.forwardRef)(() => account_module_1.AccountModule), (0, common_1.forwardRef)(() => oauth2_module_1.OAuth2Module), client_module_1.ClientModule, session_module_1.SessionModule],
        controllers: [token_controller_1.TokenController],
        providers: [token_service_1.TokenService, common_2.CryptoService],
        exports: [token_service_1.TokenService],
    })
], TokenModule);
//# sourceMappingURL=token.module.js.map