import { EScope } from '../../../common';
import { Types } from 'mongoose';
export declare class DClientBodyPatch {
    name: string;
    clientSecret: boolean;
    active: boolean;
    editor: Types.ObjectId[];
    scopes: EScope[];
    redirectUris: string[];
    privacyPolicy: string;
    termsOfService: string;
}
