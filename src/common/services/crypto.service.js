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
exports.CryptoService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const crypto = require("crypto");
let CryptoService = class CryptoService {
    constructor(configService) {
        this.configService = configService;
        this.algorithm = 'aes-256-cbc';
        this.privateKey = this.configService.get('privateKey');
        this.publicKey = this.configService.get('publicKey');
        this.secretKey = Buffer.from(this.configService.get('secretKey'), 'hex');
    }
    calculateAtHash(token) {
        const partOfAccessToken = token.substring(0, Math.floor(token.length / 2));
        const hash = crypto.createHash('sha256').update(partOfAccessToken).digest();
        const base64UrlHash = hash.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
        return base64UrlHash;
    }
    toBase64Url(base64) {
        return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    }
    fromBase64Url(base64Url) {
        const padding = '='.repeat((4 - (base64Url.length % 4)) % 4);
        return base64Url.replace(/-/g, '+').replace(/_/g, '/') + padding;
    }
    encrypt(payload) {
        const jsonString = JSON.stringify(payload);
        this.ivKey = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv(this.algorithm, this.secretKey, this.ivKey);
        const encrypted = Buffer.concat([cipher.update(jsonString, 'utf8'), cipher.final()]);
        return `${this.toBase64Url(encrypted.toString('base64'))}${this.ivKey.toString('hex')}`;
    }
    decrypt(data) {
        this.ivKey = Buffer.from(data.slice(-32), 'hex');
        const encrypted = Buffer.from(this.fromBase64Url(data.slice(0, -32)), 'base64');
        const decipher = crypto.createDecipheriv(this.algorithm, this.secretKey, this.ivKey);
        let decrypted = '';
        try {
            decrypted += decipher.update(encrypted, undefined, 'utf8');
            decrypted += decipher.final('utf8');
        }
        catch (error) {
            console.error('Decryption failed:', error);
            return null;
        }
        return JSON.parse(decrypted);
    }
    generateSignature(payload) {
        const currentTime = Math.floor(Date.now() / 1000);
        if (!payload.exp) {
            payload.exp = currentTime + 300;
        }
        else {
            payload.exp = currentTime + payload.exp;
        }
        const signature = crypto.sign('sha256', Buffer.from(JSON.stringify(payload)), {
            key: this.privateKey,
            padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
        });
        return encodeURIComponent(`${this.toBase64Url(signature.toString('base64'))}%I${this.encrypt(payload)}`);
    }
    validateSignature(tokenURIComponent) {
        const token = decodeURIComponent(tokenURIComponent);
        const currentTime = Math.floor(Date.now() / 1000);
        const [signatureStr, payloadEncryptStr] = token.split('%I');
        const payload = this.decrypt(payloadEncryptStr);
        const signature = this.fromBase64Url(signatureStr);
        const isValid = crypto.verify('sha256', Buffer.from(JSON.stringify(payload)), {
            key: this.publicKey,
            padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
        }, Buffer.from(signature, 'base64'));
        if (!isValid)
            return null;
        if (payload.exp && currentTime > payload.exp)
            return null;
        return payload;
    }
    generateAccessToken(payload) {
        const currentTime = Math.floor(Date.now() / 1000);
        payload.exp = currentTime + payload.exp;
        const signature = crypto.createHmac('sha256', this.privateKey).update(JSON.stringify(payload)).digest('base64');
        return encodeURIComponent(`${this.toBase64Url(signature)}%I${this.encrypt(payload)}`);
    }
    validateAccessToken(tokenURIComponent) {
        const token = decodeURIComponent(tokenURIComponent);
        const currentTime = Math.floor(Date.now() / 1000);
        const [signatureStr, payloadEncryptStr] = token.split('%I');
        const payload = this.decrypt(payloadEncryptStr);
        const signature = this.fromBase64Url(signatureStr);
        const isValid = crypto.createHmac('sha256', this.privateKey).update(JSON.stringify(payload)).digest('base64') === signature;
        if (!isValid)
            return null;
        if (currentTime > payload.exp)
            return null;
        return payload;
    }
    encodeAIS(ids) {
        return ids.map((id) => id.toString()).join('');
    }
    decodeAIS(encodedString) {
        const objectIds = [];
        for (let i = 0; i < encodedString.length; i += 24) {
            const idString = encodedString.slice(i, i + 24);
            objectIds.push(idString);
        }
        return objectIds;
    }
};
exports.CryptoService = CryptoService;
exports.CryptoService = CryptoService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], CryptoService);
//# sourceMappingURL=crypto.service.js.map