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
exports.ApprovalWorkflowPolicy = void 0;
const typeorm_1 = require("typeorm");
let ApprovalWorkflowPolicy = class ApprovalWorkflowPolicy {
    id;
    department;
    minBudget;
    maxBudget;
    requiredLevels;
    createdAt;
};
exports.ApprovalWorkflowPolicy = ApprovalWorkflowPolicy;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ApprovalWorkflowPolicy.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ApprovalWorkflowPolicy.prototype, "department", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 12, scale: 2, default: 0.0 }),
    __metadata("design:type", Number)
], ApprovalWorkflowPolicy.prototype, "minBudget", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 12, scale: 2, default: 9999999.0 }),
    __metadata("design:type", Number)
], ApprovalWorkflowPolicy.prototype, "maxBudget", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json' }),
    __metadata("design:type", Array)
], ApprovalWorkflowPolicy.prototype, "requiredLevels", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], ApprovalWorkflowPolicy.prototype, "createdAt", void 0);
exports.ApprovalWorkflowPolicy = ApprovalWorkflowPolicy = __decorate([
    (0, typeorm_1.Entity)('approval_workflow_policies')
], ApprovalWorkflowPolicy);
//# sourceMappingURL=workflow-policy.entity.js.map