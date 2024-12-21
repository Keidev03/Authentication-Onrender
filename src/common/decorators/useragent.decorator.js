"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserAgent = void 0;
const common_1 = require("@nestjs/common");
const parser = require("ua-parser-js");
exports.UserAgent = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    const ip = request.clientIP;
    const useragent = request.headers['user-agent'];
    const ua = parser(useragent);
    return {
        browser: ua.browser.name || 'Unknown Browser',
        os: ua.os.name || 'Unknown OS',
        device: ua.device.model || 'Unknown Device',
        ip: ip || 'Unknown IP',
    };
});
//# sourceMappingURL=useragent.decorator.js.map