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
exports.Reimbursement = exports.ReimbursementStatus = void 0;
const typeorm_1 = require("typeorm");
const expense_claim_entity_1 = require("../../expenses/entities/expense-claim.entity");
var ReimbursementStatus;
(function (ReimbursementStatus) {
    ReimbursementStatus["PENDING"] = "pending";
    ReimbursementStatus["PROCESSING"] = "processing";
    ReimbursementStatus["PAID"] = "paid";
    ReimbursementStatus["FAILED"] = "failed";
})(ReimbursementStatus || (exports.ReimbursementStatus = ReimbursementStatus = {}));
let Reimbursement = class Reimbursement {
    id;
    claimId;
    claim;
    paymentReference;
    status;
    paidAt;
    createdAt;
};
exports.Reimbursement = Reimbursement;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Reimbursement.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Reimbursement.prototype, "claimId", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => expense_claim_entity_1.ExpenseClaim, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'claimId' }),
    __metadata("design:type", expense_claim_entity_1.ExpenseClaim)
], Reimbursement.prototype, "claim", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Reimbursement.prototype, "paymentReference", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: process.env.OFFLINE_MODE === 'true' ? 'simple-enum' : 'enum',
        enum: ReimbursementStatus,
        default: ReimbursementStatus.PENDING,
    }),
    __metadata("design:type", String)
], Reimbursement.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], Reimbursement.prototype, "paidAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Reimbursement.prototype, "createdAt", void 0);
exports.Reimbursement = Reimbursement = __decorate([
    (0, typeorm_1.Entity)('reimbursements')
], Reimbursement);
//# sourceMappingURL=reimbursement.entity.js.map