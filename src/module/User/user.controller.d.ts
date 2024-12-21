/// <reference types="multer" />
import { DUserPatch } from './dto';
import { DUserPost } from './dto/userPost.dto';
import { UserDocument } from './user.schema';
import { UserService } from './user.service';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    getAllUser(): Promise<{
        users: UserDocument[];
        currentPage: number;
        totalPages: number;
        totalRecords: number;
    }>;
    getUser(): Promise<{
        email: any;
        name: string;
        firstName: string;
        lastName: string;
        picture: string;
        roles: import("../../common").ERoles[];
        verified: boolean;
        gender: string;
        dateOfBirth: Date;
    }>;
    patchUser(body: DUserPatch, picture?: Express.Multer.File): Promise<void>;
    deleteUser(): Promise<void>;
    postUser(data: DUserPost): Promise<void>;
    getResetPassword(email: string): Promise<void>;
}
