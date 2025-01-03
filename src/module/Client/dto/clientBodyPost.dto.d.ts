import { EOAuth2Scope } from '../../../common';
export declare class DClientBodyPost {
    name: string;
    scopes: EOAuth2Scope[];
    redirect_uris: string;
    failed_uris: string;
}
