"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const cookieParser = require("cookie-parser");
const core_1 = require("@nestjs/core");
const process_1 = require("process");
const path = require("path");
const common_2 = require("./common");
const app_module_1 = require("./app.module");
async function Bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.set('trust proxy', true);
    app.use((req, res, next) => {
        const forwardedFor = req.headers['x-forwarded-for'];
        req['clientIP'] = req.ip || (Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor) || req.connection.remoteAddress;
        next();
    });
    const configService = app.get(config_1.ConfigService);
    app.useGlobalPipes(new common_1.ValidationPipe({
        transform: true,
        whitelist: true,
    }));
    app.useGlobalFilters(new common_2.AllExceptionsFilter());
    app.use(cookieParser());
    const allowedOrigins = configService.get('ALLOWED_ORIGINS');
    const allowedOriginsArr = allowedOrigins ? allowedOrigins.split(',') : [];
    app.enableCors({
        origin: (origin, callback) => {
            if (!origin || allowedOriginsArr.includes(origin)) {
                callback(null, true);
            }
            else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        credentials: true,
    });
    app.useStaticAssets(path.join((0, process_1.cwd)(), configService.get('TEMPLATE_DIRECTORY')), {
        prefix: '/',
    });
    const port = configService.get('SERVER_PORT') || 3000;
    await app.listen(port, '0.0.0.0');
}
Bootstrap();
//# sourceMappingURL=main.js.map