import { ValidationOptions } from 'class-validator';
import { Types } from 'mongoose';
import { EAccountLanguage, EAccountProcessing, EAccountState, EAccountVerification, EOAuth2Scope } from 'src/common';
import { EAccountLocation } from 'src/common/enums/account/location.account.enum';
export declare class DAccountBodyPatch {
    email: string;
    firstName: string;
    lastName: string;
    name: string;
    oldPassword: string;
    newPassword: string;
    roles?: EOAuth2Scope[];
    dateOfBirth: Date;
    gender: string;
    phone: string;
    address: string;
    location: EAccountLocation;
    language: EAccountLanguage;
    clientId?: Types.ObjectId[];
    state?: EAccountState;
    verification?: EAccountVerification;
    processing?: EAccountProcessing;
    expiredAt?: Date;
    keepSignedIn: boolean;
}
export declare function IsPhoneNumber(validationOptions?: ValidationOptions): (object: Object, propertyName: string) => void;
