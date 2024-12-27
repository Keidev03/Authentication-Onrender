"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OAuth2Module = void 0;
const common_1 = require("@nestjs/common");
const oauth2_controller_1 = require("./oauth2.controller");
const client_module_1 = require("../Client/client.module");
const oauth2_service_1 = require("./oauth2.service");
const session_module_1 = require("../Session/session.module");
const token_module_1 = require("../Token/token.module");
const common_2 = require("../../common");
const account_module_1 = require("../Account/account.module");
let OAuth2Module = class OAuth2Module {
};
exports.OAuth2Module = OAuth2Module;
exports.OAuth2Module = OAuth2Module = __decorate([
    (0, common_1.Module)({
        imports: [client_module_1.ClientModule, (0, common_1.forwardRef)(() => account_module_1.AccountModule), session_module_1.SessionModule, (0, common_1.forwardRef)(() => token_module_1.TokenModule)],
        controllers: [oauth2_controller_1.OAuth2Controller],
        providers: [oauth2_service_1.OAuth2Service, common_2.CryptoService],
        exports: [oauth2_service_1.OAuth2Service],
    })
], OAuth2Module);
//# sourceMappingURL=oauth2.module.js.map