"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
function initializeKeys() {
    const keysFilePath = path.join(process.cwd(), 'keys.json');
    if (!fs.existsSync(keysFilePath)) {
        const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
            modulusLength: 2048,
            publicKeyEncoding: {
                type: 'spki',
                format: 'pem',
            },
            privateKeyEncoding: {
                type: 'pkcs8',
                format: 'pem',
            },
        });
        const secretKey = crypto.randomBytes(32).toString('hex');
        const keys = {
            privateKey,
            publicKey,
            secretKey,
        };
        fs.writeFileSync(keysFilePath, JSON.stringify(keys, null, 2));
    }
    const keys = JSON.parse(fs.readFileSync(keysFilePath, 'utf8'));
    return keys;
}
initializeKeys();
//# sourceMappingURL=keys.js.map