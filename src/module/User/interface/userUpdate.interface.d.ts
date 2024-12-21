import { Types } from 'mongoose';
import { ERoles } from 'src/common';
export interface IUserUpdate {
    email?: string;
    firstName?: string;
    lastName?: string;
    name?: string;
    oldPassword?: string;
    password?: string;
    roles?: ERoles[];
    verified?: boolean;
    dateOfBirth?: Date;
    gender?: string;
    phone?: string;
    address?: string;
    clientId?: Types.ObjectId[];
}
