import { Types } from 'mongoose';
import { EGrantType } from '../../../common';
export declare class DGetAccessToken {
    client_id: Types.ObjectId;
    client_secret: string;
    code?: string;
    redirect_uri?: string;
    refresh_token?: string;
    grant_type: EGrantType;
}
