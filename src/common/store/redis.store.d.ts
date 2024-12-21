export declare const redisStore: (options: {
    host: string;
    port: number;
    auth_pass: string;
}) => Promise<{
    set<T>(key: string, value: T, ttl: number): Promise<void>;
    get<T_1>(key: string): Promise<T_1>;
    del(key: string): Promise<void>;
    reset(): Promise<void>;
    keys(pattern?: string): Promise<string[]>;
    ttl(key: string): Promise<number>;
}>;
