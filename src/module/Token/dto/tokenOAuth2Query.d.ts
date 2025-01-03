import { Types } from 'mongoose';
import { EOAuth2GrantType } from '../../../common';
export declare class DTokenOAuth2Query {
    clientId: Types.ObjectId;
    clientSecret: string;
    code?: string;
    redirectUri?: string;
    refreshToken?: string;
    grantType: EOAuth2GrantType;
}
