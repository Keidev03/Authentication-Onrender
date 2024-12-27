import { Types } from 'mongoose';
import { EAccessType, EPrompt, EResponseMode, EResponseType, EScope } from '../../../common';
export declare class DOAuth2Query {
    clientId: Types.ObjectId;
    redirectUri: string;
    responseType: EResponseType[];
    scope: EScope[];
    responseMode: EResponseMode;
    prompt: EPrompt;
    state: string;
    accessType: EAccessType;
    nonce: string;
}
