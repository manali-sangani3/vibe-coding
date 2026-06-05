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
exports.ExpenseClaim = exports.ClaimStatus = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
const travel_request_entity_1 = require("../../travel/entities/travel-request.entity");
const expense_item_entity_1 = require("./expense-item.entity");
var ClaimStatus;
(function (ClaimStatus) {
    ClaimStatus["DRAFT"] = "draft";
    ClaimStatus["SUBMITTED"] = "submitted";
    ClaimStatus["APPROVED"] = "approved";
    ClaimStatus["REJECTED"] = "rejected";
    ClaimStatus["REIMBURSED"] = "reimbursed";
})(ClaimStatus || (exports.ClaimStatus = ClaimStatus = {}));
let ExpenseClaim = class ExpenseClaim {
    id;
    travelRequestId;
    travelRequest;
    claimAmount;
    status;
    userId;
    user;
    items;
    submittedAt;
    createdAt;
};
exports.ExpenseClaim = ExpenseClaim;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ExpenseClaim.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ExpenseClaim.prototype, "travelRequestId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => travel_request_entity_1.TravelRequest, { nullable: true, onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)({ name: 'travelRequestId' }),
    __metadata("design:type", travel_request_entity_1.TravelRequest)
], ExpenseClaim.prototype, "travelRequest", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 12, scale: 2, default: 0.0 }),
    __metadata("design:type", Number)
], ExpenseClaim.prototype, "claimAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: process.env.OFFLINE_MODE === 'true' ? 'simple-enum' : 'enum',
        enum: ClaimStatus,
        default: ClaimStatus.DRAFT,
    }),
    __metadata("design:type", String)
], ExpenseClaim.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ExpenseClaim.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'userId' }),
    __metadata("design:type", user_entity_1.User)
], ExpenseClaim.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => expense_item_entity_1.ExpenseItem, (item) => item.claim, { cascade: true }),
    __metadata("design:type", Array)
], ExpenseClaim.prototype, "items", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], ExpenseClaim.prototype, "submittedAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], ExpenseClaim.prototype, "createdAt", void 0);
exports.ExpenseClaim = ExpenseClaim = __decorate([
    (0, typeorm_1.Entity)('expense_claims')
], ExpenseClaim);
//# sourceMappingURL=expense-claim.entity.js.map