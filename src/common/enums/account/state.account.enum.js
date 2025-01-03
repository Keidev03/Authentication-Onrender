"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EAccountProcessing = exports.EAccountVerification = exports.EAccountState = void 0;
var EAccountState;
(function (EAccountState) {
    EAccountState["ACTIVE"] = "active";
    EAccountState["INACTIVE"] = "inactive";
    EAccountState["SUSPENDED"] = "suspended";
    EAccountState["DEACTIVATED"] = "deactivated";
    EAccountState["LOCKED"] = "loked";
})(EAccountState || (exports.EAccountState = EAccountState = {}));
var EAccountVerification;
(function (EAccountVerification) {
    EAccountVerification["VERIFIED"] = "verified";
    EAccountVerification["UNVERIFIED"] = "unverified";
    EAccountVerification["PENDING_APPROVAL"] = "pending_approval";
})(EAccountVerification || (exports.EAccountVerification = EAccountVerification = {}));
var EAccountProcessing;
(function (EAccountProcessing) {
    EAccountProcessing["NONE"] = "none";
    EAccountProcessing["PENDING"] = "pending";
    EAccountProcessing["DELETED"] = "delete";
    EAccountProcessing["BANNED"] = "banned";
})(EAccountProcessing || (exports.EAccountProcessing = EAccountProcessing = {}));
//# sourceMappingURL=state.account.enum.js.map