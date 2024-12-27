"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const path = require("path");
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const cache_manager_1 = require("@nestjs/cache-manager");
const account_module_1 = require("./module/Account/account.module");
const client_module_1 = require("./module/Client/client.module");
const oauth2_module_1 = require("./module/OAuth2/oauth2.module");
const session_module_1 = require("./module/Session/session.module");
const throttler_1 = require("@nestjs/throttler");
const common_2 = require("./common");
const auth_module_1 = require("./module/Auth/auth.module");
const app_controller_1 = require("./app.controller");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: ['.env'],
                load: [() => require(path.resolve(process.cwd(), 'keys.json'))],
            }),
            mongoose_1.MongooseModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (configService) => ({
                    uri: configService.get('MONGO_URI'),
                }),
            }),
            jwt_1.JwtModule.registerAsync({
                global: true,
                imports: [config_1.ConfigModule],
                useFactory: async (configService) => {
                    const privateKey = configService.get('privateKey');
                    const publicKey = configService.get('publicKey');
                    return {
                        global: true,
                        privateKey,
                        publicKey,
                        signOptions: {
                            algorithm: 'RS256',
                        },
                    };
                },
                inject: [config_1.ConfigService],
            }),
            cache_manager_1.CacheModule.registerAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                isGlobal: true,
                useFactory: async (configService) => ({
                    store: await (0, common_2.redisStore)({
                        host: configService.get('REDIS_HOST'),
                        port: configService.get('REDIS_PORT'),
                        auth_pass: configService.get('REDIS_PASS'),
                    }),
                }),
            }),
            throttler_1.ThrottlerModule.forRoot([
                {
                    name: 'short',
                    ttl: 1000,
                    limit: 3,
                },
                {
                    name: 'medium',
                    ttl: 10000,
                    limit: 20,
                },
                {
                    name: 'long',
                    ttl: 60000,
                    limit: 100,
                },
            ]),
            auth_module_1.AuthModule,
            oauth2_module_1.OAuth2Module,
            client_module_1.ClientModule,
            account_module_1.AccountModule,
            session_module_1.SessionModule,
        ],
        controllers: [app_controller_1.AppController],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map