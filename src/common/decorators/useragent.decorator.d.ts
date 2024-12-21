export interface IUserAgentInfo {
    browser: string;
    os: string;
    device: string;
    ip: string;
}
export declare const UserAgent: (...dataOrPipes: unknown[]) => ParameterDecorator;
