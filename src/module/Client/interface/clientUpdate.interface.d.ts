import { EScope } from '../../../common';
export interface IClientUpdate {
    name?: string;
    scopes?: EScope[];
    isActive?: boolean;
    redirectUris?: string;
    failedRedirectUri?: string;
}
