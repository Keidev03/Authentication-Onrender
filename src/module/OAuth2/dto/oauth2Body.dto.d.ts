import { Types } from 'mongoose';
export declare class DOAuth2BodySession {
    sub: Types.ObjectId;
}
export declare class DOAuth2BodyPassword {
    TL: string;
    password: string;
}
