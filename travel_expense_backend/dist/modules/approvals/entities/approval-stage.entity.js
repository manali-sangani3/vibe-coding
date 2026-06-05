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
exports.ApprovalStage = exports.ApprovalStageStatus = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
const travel_request_entity_1 = require("../../travel/entities/travel-request.entity");
var ApprovalStageStatus;
(function (ApprovalStageStatus) {
    ApprovalStageStatus["PENDING"] = "pending";
    ApprovalStageStatus["APPROVED"] = "approved";
    ApprovalStageStatus["REJECTED"] = "rejected";
    ApprovalStageStatus["ESCALATED"] = "escalated";
    ApprovalStageStatus["SKIPPED"] = "skipped";
})(ApprovalStageStatus || (exports.ApprovalStageStatus = ApprovalStageStatus = {}));
let ApprovalStage = class ApprovalStage {
    id;
    requestId;
    travelRequest;
    approverId;
    approver;
    level;
    status;
    comments;
    updatedAt;
    createdAt;
};
exports.ApprovalStage = ApprovalStage;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ApprovalStage.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ApprovalStage.prototype, "requestId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => travel_request_entity_1.TravelRequest, (tr) => tr.approvalStages, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'requestId' }),
    __metadata("design:type", travel_request_entity_1.TravelRequest)
], ApprovalStage.prototype, "travelRequest", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ApprovalStage.prototype, "approverId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'approverId' }),
    __metadata("design:type", user_entity_1.User)
], ApprovalStage.prototype, "approver", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ApprovalStage.prototype, "level", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: process.env.OFFLINE_MODE === 'true' ? 'simple-enum' : 'enum',
        enum: ApprovalStageStatus,
        default: ApprovalStageStatus.PENDING,
    }),
    __metadata("design:type", String)
], ApprovalStage.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], ApprovalStage.prototype, "comments", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], ApprovalStage.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], ApprovalStage.prototype, "createdAt", void 0);
exports.ApprovalStage = ApprovalStage = __decorate([
    (0, typeorm_1.Entity)('approval_stages')
], ApprovalStage);
//# sourceMappingURL=approval-stage.entity.js.map