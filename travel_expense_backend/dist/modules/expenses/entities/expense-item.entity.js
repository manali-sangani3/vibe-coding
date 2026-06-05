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
exports.ExpenseItem = void 0;
const typeorm_1 = require("typeorm");
const expense_claim_entity_1 = require("./expense-claim.entity");
let ExpenseItem = class ExpenseItem {
    id;
    claimId;
    claim;
    category;
    amount;
    description;
    receiptUrl;
    createdAt;
};
exports.ExpenseItem = ExpenseItem;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ExpenseItem.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ExpenseItem.prototype, "claimId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => expense_claim_entity_1.ExpenseClaim, (claim) => claim.items, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'claimId' }),
    __metadata("design:type", expense_claim_entity_1.ExpenseClaim)
], ExpenseItem.prototype, "claim", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ExpenseItem.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 12, scale: 2, default: 0.0 }),
    __metadata("design:type", Number)
], ExpenseItem.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ExpenseItem.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ExpenseItem.prototype, "receiptUrl", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], ExpenseItem.prototype, "createdAt", void 0);
exports.ExpenseItem = ExpenseItem = __decorate([
    (0, typeorm_1.Entity)('expense_items')
], ExpenseItem);
//# sourceMappingURL=expense-item.entity.js.map