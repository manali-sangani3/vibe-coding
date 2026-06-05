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
exports.TravelRequest = exports.TravelStatus = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
const approval_stage_entity_1 = require("../../approvals/entities/approval-stage.entity");
var TravelStatus;
(function (TravelStatus) {
    TravelStatus["DRAFT"] = "draft";
    TravelStatus["SUBMITTED"] = "submitted";
    TravelStatus["PENDING_L1"] = "pending_l1";
    TravelStatus["PENDING_L2"] = "pending_l2";
    TravelStatus["PENDING_L3"] = "pending_l3";
    TravelStatus["APPROVED"] = "approved";
    TravelStatus["BOOKED"] = "booked";
    TravelStatus["TRAVEL_COMPLETED"] = "travel_completed";
    TravelStatus["CLAIM_DRAFT"] = "claim_draft";
    TravelStatus["CLAIM_SUBMITTED"] = "claim_submitted";
    TravelStatus["CLAIM_FINANCE_APPROVED"] = "claim_finance_approved";
    TravelStatus["REIMBURSED"] = "reimbursed";
    TravelStatus["REJECTED"] = "rejected";
    TravelStatus["CANCELLED"] = "cancelled";
})(TravelStatus || (exports.TravelStatus = TravelStatus = {}));
let TravelRequest = class TravelRequest {
    id;
    title;
    description;
    purpose;
    destination;
    startDate;
    endDate;
    estimatedCost;
    status;
    userId;
    user;
    approvalStages;
    createdAt;
};
exports.TravelRequest = TravelRequest;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], TravelRequest.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], TravelRequest.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], TravelRequest.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], TravelRequest.prototype, "purpose", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], TravelRequest.prototype, "destination", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], TravelRequest.prototype, "startDate", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], TravelRequest.prototype, "endDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 12, scale: 2, default: 0.0 }),
    __metadata("design:type", Number)
], TravelRequest.prototype, "estimatedCost", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: process.env.OFFLINE_MODE === 'true' ? 'simple-enum' : 'enum',
        enum: TravelStatus,
        default: TravelStatus.DRAFT,
    }),
    __metadata("design:type", String)
], TravelRequest.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], TravelRequest.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'userId' }),
    __metadata("design:type", user_entity_1.User)
], TravelRequest.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => approval_stage_entity_1.ApprovalStage, (stage) => stage.travelRequest),
    __metadata("design:type", Array)
], TravelRequest.prototype, "approvalStages", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], TravelRequest.prototype, "createdAt", void 0);
exports.TravelRequest = TravelRequest = __decorate([
    (0, typeorm_1.Entity)('travel_requests')
], TravelRequest);
//# sourceMappingURL=travel-request.entity.js.map