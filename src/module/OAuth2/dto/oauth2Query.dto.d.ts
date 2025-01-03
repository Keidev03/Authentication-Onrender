import { Types } from 'mongoose';
import { EOAuth2AccessType, EOAuth2Prompt, EOAuth2ResponseMode, EOAuth2ResponseType, EOAuth2Scope } from '../../../common';
export declare class DOAuth2Query {
    clientId: Types.ObjectId;
    redirectUri: string;
    responseType: EOAuth2ResponseType[];
    scope: EOAuth2Scope[];
    responseMode: EOAuth2ResponseMode;
    prompt: EOAuth2Prompt;
    state: string;
    accessType: EOAuth2AccessType;
    nonce: string;
}
