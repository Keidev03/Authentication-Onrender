import { Types } from 'mongoose';
import { EAccessType, EPrompt, EResponseMode, EResponseType, EScope } from '../../../common';
export declare class DOAuth2Query {
    client_id: Types.ObjectId;
    redirect_uri: string;
    response_type: EResponseType[];
    scope: EScope[];
    response_mode: EResponseMode;
    prompt: EPrompt;
    state: string;
    access_type: EAccessType;
    nonce: string;
}
