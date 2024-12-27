import { Types } from 'mongoose';
import { ERoles } from 'src/common';
export declare class DAccountBodyPatch {
    email: string;
    firstName: string;
    lastName: string;
    name: string;
    oldPassword: string;
    newPassword: string;
    keepSignedIn: boolean;
    roles?: ERoles[];
    verified?: boolean;
    dateOfBirth: Date;
    gender: string;
    phone: string;
    address: string;
    clientId?: Types.ObjectId[];
}
