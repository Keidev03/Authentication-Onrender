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
var MailerService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailerService = void 0;
const nodemailer = require("nodemailer");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let MailerService = MailerService_1 = class MailerService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(MailerService_1.name);
        this.user = this.configService.get('MAIL_SEND');
        this.password = this.configService.get('MAIL_PASSWORD');
        this.mailsend = this.configService.get('MAIL_SEND');
    }
    async Gmail(emailUser, subject, htmlMailForm) {
        const mailTransporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: this.user,
                pass: this.password,
            },
        });
        const mailOptions = {
            from: this.mailsend,
            to: emailUser,
            subject: subject,
            html: htmlMailForm,
        };
        try {
            const info = await mailTransporter.sendMail(mailOptions);
            this.logger.log('Email sent: ' + info.response);
        }
        catch (error) {
            this.logger.error('Send email with error:', error.stack);
        }
    }
};
exports.MailerService = MailerService;
exports.MailerService = MailerService = MailerService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], MailerService);
//# sourceMappingURL=mailer.service.js.map