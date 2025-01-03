import { EOAuth2Scope } from '../../../common';
import { Types } from 'mongoose';
export declare class DClientBodyPatch {
    name: string;
    clientSecret: boolean;
    active: boolean;
    editor: Types.ObjectId[];
    scopes: EOAuth2Scope[];
    redirectUris: string[];
    privacyPolicy: string;
    termsOfService: string;
}
