import { Types } from 'mongoose';
export declare class DAuthBodySession {
    sub: Types.ObjectId;
}
export declare class DAuthBodyPassword {
    TL: string;
    password: string;
}
