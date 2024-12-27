"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const account_service_1 = require("./account.service");
const account_controller_1 = require("./account.controller");
const account_schema_1 = require("./account.schema");
const common_2 = require("../../common");
const session_module_1 = require("../Session/session.module");
const token_module_1 = require("../Token/token.module");
let AccountModule = class AccountModule {
};
exports.AccountModule = AccountModule;
exports.AccountModule = AccountModule = __decorate([
    (0, common_1.Module)({
        imports: [mongoose_1.MongooseModule.forFeature([{ name: account_schema_1.Account.name, schema: account_schema_1.AccountSchema }]), session_module_1.SessionModule, (0, common_1.forwardRef)(() => token_module_1.TokenModule)],
        controllers: [account_controller_1.AccountController],
        providers: [account_service_1.AccountService, common_2.GoogleDriveService, common_2.MailerService],
        exports: [account_service_1.AccountService],
    })
], AccountModule);
//# sourceMappingURL=account.module.js.map