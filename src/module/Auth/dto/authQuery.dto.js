"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DAuthQuery = exports.IsKniteDomainConstraint = void 0;
const class_validator_1 = require("class-validator");
const url_1 = require("url");
const class_validator_2 = require("class-validator");
let IsKniteDomainConstraint = class IsKniteDomainConstraint {
    validate(value, args) {
        try {
            const parsedUrl = new url_1.URL(value);
            const hostname = parsedUrl.hostname;
            return hostname === 'knite.online' || hostname.endsWith('.knite.online');
        }
        catch (err) {
            return false;
        }
    }
    defaultMessage(args) {
        return 'The URL must belong to knite.online or its subdomains.';
    }
};
exports.IsKniteDomainConstraint = IsKniteDomainConstraint;
exports.IsKniteDomainConstraint = IsKniteDomainConstraint = __decorate([
    (0, class_validator_2.ValidatorConstraint)({ name: 'IsKniteDomain', async: false })
], IsKniteDomainConstraint);
class DAuthQuery {
}
exports.DAuthQuery = DAuthQuery;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Validate)(IsKniteDomainConstraint),
    __metadata("design:type", String)
], DAuthQuery.prototype, "continue", void 0);
//# sourceMappingURL=authQuery.dto.js.map