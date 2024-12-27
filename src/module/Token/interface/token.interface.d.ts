import { Types } from 'mongoose';
import { EScope } from 'src/common';
export interface IAccessTokenClient {
    clientId: Types.ObjectId;
    accountId: Types.ObjectId;
    scope: EScope[];
    exp: number;
}
