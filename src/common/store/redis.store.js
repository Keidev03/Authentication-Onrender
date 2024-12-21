"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisStore = void 0;
const redis_1 = require("redis");
const redisStore = async (options) => {
    const redisClient = (0, redis_1.createClient)({
        socket: {
            host: options.host,
            port: options.port,
        },
        password: options.auth_pass,
    });
    await redisClient.connect();
    return {
        async set(key, value, ttl) {
            const serializedValue = JSON.stringify(value);
            if (ttl > 0) {
                await redisClient.setEx(key, ttl, serializedValue);
            }
            else {
                await redisClient.set(key, serializedValue);
            }
        },
        async get(key) {
            const value = await redisClient.get(key);
            return value ? JSON.parse(value) : undefined;
        },
        async del(key) {
            await redisClient.del(key);
        },
        async reset() {
            await redisClient.flushAll();
        },
        async keys(pattern = '*') {
            return redisClient.keys(pattern);
        },
        async ttl(key) {
            return redisClient.ttl(key);
        },
    };
};
exports.redisStore = redisStore;
//# sourceMappingURL=redis.store.js.map