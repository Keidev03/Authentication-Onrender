"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RolePermissions = exports.ERoles = void 0;
const permission_enum_1 = require("./permission.enum");
var ERoles;
(function (ERoles) {
    ERoles["SUPER_ADMIN"] = "super_admin";
    ERoles["ADMIN"] = "admin";
    ERoles["MANAGER"] = "manager";
    ERoles["MODERATOR"] = "moderator";
    ERoles["ANALYST"] = "analyst";
    ERoles["SUPPORT"] = "support";
    ERoles["USER"] = "user";
    ERoles["CLIENT"] = "client";
    ERoles["PARTNER"] = "partner";
})(ERoles || (exports.ERoles = ERoles = {}));
exports.RolePermissions = {
    [ERoles.SUPER_ADMIN]: [
        permission_enum_1.EPermissions.MANAGE_USERS,
        permission_enum_1.EPermissions.MANAGE_CLIENTS,
        permission_enum_1.EPermissions.MANAGE_SESSIONS,
        permission_enum_1.EPermissions.MANAGE_TOKENS,
        permission_enum_1.EPermissions.ACCESS_ANALYTICS,
        permission_enum_1.EPermissions.ACCESS_BASIC_FEATURES,
        permission_enum_1.EPermissions.VIEW_REPORTS,
        permission_enum_1.EPermissions.VIEW_OWN_DATA,
    ],
    [ERoles.ADMIN]: [
        permission_enum_1.EPermissions.MANAGE_CLIENTS,
        permission_enum_1.EPermissions.MANAGE_SESSIONS,
        permission_enum_1.EPermissions.MANAGE_TOKENS,
        permission_enum_1.EPermissions.ACCESS_ANALYTICS,
        permission_enum_1.EPermissions.ACCESS_BASIC_FEATURES,
        permission_enum_1.EPermissions.VIEW_REPORTS,
        permission_enum_1.EPermissions.VIEW_OWN_DATA,
    ],
    [ERoles.MANAGER]: [permission_enum_1.EPermissions.ACCESS_ANALYTICS, permission_enum_1.EPermissions.VIEW_REPORTS, permission_enum_1.EPermissions.VIEW_OWN_DATA],
    [ERoles.MODERATOR]: [permission_enum_1.EPermissions.READ_ONLY_ACCESS],
    [ERoles.ANALYST]: [permission_enum_1.EPermissions.ACCESS_ANALYTICS],
    [ERoles.SUPPORT]: [permission_enum_1.EPermissions.VIEW_REPORTS],
    [ERoles.USER]: [permission_enum_1.EPermissions.READ_ONLY_ACCESS],
    [ERoles.CLIENT]: [permission_enum_1.EPermissions.VIEW_OWN_DATA],
    [ERoles.PARTNER]: [permission_enum_1.EPermissions.ACCESS_BASIC_FEATURES],
};
//# sourceMappingURL=roles.enum.js.map