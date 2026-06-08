"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComplianceService = void 0;
const common_1 = require("@nestjs/common");
let ComplianceService = class ComplianceService {
    rules = {
        employee: {
            maxExpenseAmount: 1000,
            requiresReceiptAbove: 500,
            blockedCategories: [],
        },
        manager: {
            maxExpenseAmount: 5000,
            requiresReceiptAbove: 1000,
            blockedCategories: [],
        },
        finance: {
            maxExpenseAmount: 10000,
            requiresReceiptAbove: 1000,
            blockedCategories: [],
        },
        admin: {
            maxExpenseAmount: 99999,
            requiresReceiptAbove: 5000,
            blockedCategories: [],
        },
    };
    validateExpenseItem(role, category, amount, hasReceipt) {
        const userRole = role.toLowerCase();
        const policy = this.rules[userRole] || this.rules['employee'];
        if (amount > policy.maxExpenseAmount) {
            throw new common_1.BadRequestException(`Policy violation: ${category} amount (${amount}) exceeds the maximum allowed limit for role ${role} (${policy.maxExpenseAmount}).`);
        }
        if (amount > policy.requiresReceiptAbove && !hasReceipt) {
            throw new common_1.BadRequestException(`Policy violation: Receipt is required for ${category} expenses above ${policy.requiresReceiptAbove}.`);
        }
        if (policy.blockedCategories.includes(category)) {
            throw new common_1.BadRequestException(`Policy violation: The category '${category}' is blocked for your role.`);
        }
    }
    validateTravelRequest(role, estimatedCost) {
        const userRole = role.toLowerCase();
        const policy = this.rules[userRole] || this.rules['employee'];
        const travelLimit = policy.maxExpenseAmount * 5;
        if (estimatedCost > travelLimit) {
            throw new common_1.BadRequestException(`Policy violation: Estimated cost (${estimatedCost}) exceeds the maximum allowed travel budget for role ${role} (${travelLimit}).`);
        }
    }
};
exports.ComplianceService = ComplianceService;
exports.ComplianceService = ComplianceService = __decorate([
    (0, common_1.Injectable)()
], ComplianceService);
//# sourceMappingURL=compliance.service.js.map