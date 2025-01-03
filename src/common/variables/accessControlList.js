"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccessControlList = void 0;
const permission_account_enum_1 = require("../enums/account/permission.account.enum");
const roles_account_enum_1 = require("../enums/account/roles.account.enum");
exports.AccessControlList = {
    [roles_account_enum_1.EAccountRoles.SUPER_ADMIN]: [
        permission_account_enum_1.EAccountPermissions.MANAGE_USERS,
        permission_account_enum_1.EAccountPermissions.MANAGE_CLIENTS,
        permission_account_enum_1.EAccountPermissions.MANAGE_SESSIONS,
        permission_account_enum_1.EAccountPermissions.MANAGE_TOKENS,
        permission_account_enum_1.EAccountPermissions.ACCESS_ANALYTICS,
        permission_account_enum_1.EAccountPermissions.ACCESS_BASIC_FEATURES,
        permission_account_enum_1.EAccountPermissions.VIEW_REPORTS,
        permission_account_enum_1.EAccountPermissions.VIEW_OWN_DATA,
    ],
    [roles_account_enum_1.EAccountRoles.ADMIN]: [
        permission_account_enum_1.EAccountPermissions.MANAGE_CLIENTS,
        permission_account_enum_1.EAccountPermissions.MANAGE_SESSIONS,
        permission_account_enum_1.EAccountPermissions.MANAGE_TOKENS,
        permission_account_enum_1.EAccountPermissions.ACCESS_ANALYTICS,
        permission_account_enum_1.EAccountPermissions.ACCESS_BASIC_FEATURES,
        permission_account_enum_1.EAccountPermissions.VIEW_REPORTS,
        permission_account_enum_1.EAccountPermissions.VIEW_OWN_DATA,
    ],
    [roles_account_enum_1.EAccountRoles.MANAGER]: [permission_account_enum_1.EAccountPermissions.ACCESS_ANALYTICS, permission_account_enum_1.EAccountPermissions.VIEW_REPORTS, permission_account_enum_1.EAccountPermissions.VIEW_OWN_DATA],
    [roles_account_enum_1.EAccountRoles.MODERATOR]: [permission_account_enum_1.EAccountPermissions.READ_ONLY_ACCESS],
    [roles_account_enum_1.EAccountRoles.ANALYST]: [permission_account_enum_1.EAccountPermissions.ACCESS_ANALYTICS],
    [roles_account_enum_1.EAccountRoles.SUPPORT]: [permission_account_enum_1.EAccountPermissions.VIEW_REPORTS],
    [roles_account_enum_1.EAccountRoles.USER]: [permission_account_enum_1.EAccountPermissions.READ_ONLY_ACCESS],
    [roles_account_enum_1.EAccountRoles.CLIENT]: [permission_account_enum_1.EAccountPermissions.VIEW_OWN_DATA],
    [roles_account_enum_1.EAccountRoles.PARTNER]: [permission_account_enum_1.EAccountPermissions.ACCESS_BASIC_FEATURES],
};
//# sourceMappingURL=accessControlList.js.map