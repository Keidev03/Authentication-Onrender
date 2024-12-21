import { EPermissions } from './permission.enum';
export declare enum ERoles {
    SUPER_ADMIN = "super_admin",
    ADMIN = "admin",
    MANAGER = "manager",
    MODERATOR = "moderator",
    ANALYST = "analyst",
    SUPPORT = "support",
    USER = "user",
    CLIENT = "client",
    PARTNER = "partner"
}
export declare const RolePermissions: {
    super_admin: EPermissions[];
    admin: EPermissions[];
    manager: EPermissions[];
    moderator: EPermissions[];
    analyst: EPermissions[];
    support: EPermissions[];
    user: EPermissions[];
    client: EPermissions[];
    partner: EPermissions[];
};
