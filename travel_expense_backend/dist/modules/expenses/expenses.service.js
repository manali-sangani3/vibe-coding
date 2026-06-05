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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpensesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const expense_claim_entity_1 = require("./entities/expense-claim.entity");
const expense_item_entity_1 = require("./entities/expense-item.entity");
const travel_request_entity_1 = require("../travel/entities/travel-request.entity");
const audit_log_entity_1 = require("../audit/entities/audit-log.entity");
const notification_service_1 = require("../notifications/notification.service");
const user_entity_1 = require("../users/entities/user.entity");
let ExpensesService = class ExpensesService {
    claimRepository;
    itemRepository;
    travelRepository;
    userRepository;
    auditRepository;
    notificationService;
    constructor(claimRepository, itemRepository, travelRepository, userRepository, auditRepository, notificationService) {
        this.claimRepository = claimRepository;
        this.itemRepository = itemRepository;
        this.travelRepository = travelRepository;
        this.userRepository = userRepository;
        this.auditRepository = auditRepository;
        this.notificationService = notificationService;
    }
    async submitExpenseClaim(userId, dto) {
        let travelRequest = null;
        const now = new Date();
        if (dto.travelRequestId) {
            travelRequest = await this.travelRepository.findOne({ where: { id: dto.travelRequestId } });
            if (!travelRequest) {
                throw new common_1.NotFoundException('Linked travel request not found.');
            }
            if (travelRequest.userId !== userId) {
                throw new common_1.BadRequestException('Travel request does not belong to you.');
            }
            const tripEnd = new Date(travelRequest.endDate);
            const diffTime = now.getTime() - tripEnd.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            if (diffDays > 30) {
                throw new common_1.BadRequestException('Expense claims must be submitted within 30 days of trip completion.');
            }
        }
        let totalClaimAmount = 0.0;
        const itemsToSave = [];
        for (const itemDto of dto.items) {
            if (itemDto.amount > 500.0 && (!itemDto.receiptUrl || itemDto.receiptUrl.trim() === '')) {
                throw new common_1.BadRequestException(`Receipt attachment is mandatory for claims above ₹500 (Category: ${itemDto.category}).`);
            }
            const categoryLower = itemDto.category.toLowerCase();
            if (categoryLower.includes('meal') && itemDto.amount > 1500.0) {
                throw new common_1.BadRequestException('Meals category claim exceeds individual limit of ₹1,500.');
            }
            if (categoryLower.includes('transport') && itemDto.amount > 10000.0) {
                throw new common_1.BadRequestException('Transport category claim exceeds individual limit of ₹10,000.');
            }
            if (categoryLower.includes('accommodation') && itemDto.amount > 15000.0) {
                throw new common_1.BadRequestException('Accommodation category claim exceeds individual limit of ₹15,000.');
            }
            if (itemDto.receiptUrl) {
                const duplicate = await this.itemRepository.findOne({
                    where: {
                        receiptUrl: itemDto.receiptUrl,
                        claim: { status: (0, typeorm_2.Not)(expense_claim_entity_1.ClaimStatus.REJECTED) },
                    },
                    relations: { claim: true },
                });
                if (duplicate) {
                    throw new common_1.BadRequestException(`Duplicate receipt detected. The receipt file has already been claimed in Claim #${duplicate.claimId}.`);
                }
            }
            totalClaimAmount += itemDto.amount;
            const item = this.itemRepository.create({
                category: itemDto.category,
                amount: itemDto.amount,
                description: itemDto.description,
                receiptUrl: itemDto.receiptUrl,
            });
            itemsToSave.push(item);
        }
        const claim = this.claimRepository.create({
            travelRequestId: dto.travelRequestId,
            claimAmount: totalClaimAmount,
            status: expense_claim_entity_1.ClaimStatus.SUBMITTED,
            userId,
            submittedAt: now,
            items: itemsToSave,
        });
        await this.claimRepository.save(claim);
        if (travelRequest) {
            travelRequest.status = travel_request_entity_1.TravelStatus.CLAIM_SUBMITTED;
            await this.travelRepository.save(travelRequest);
        }
        const financeReviewer = await this.userRepository.findOne({ where: { role: user_entity_1.UserRole.FINANCE } });
        const notifyId = financeReviewer ? financeReviewer.id : 'usr-finance-001';
        await this.notificationService.sendNotification(notifyId, 'New Expense Claim Submitted', `Expense Claim for ₹${totalClaimAmount} submitted by user. Action required.`, 'push');
        const audit = this.auditRepository.create({
            userId,
            action: 'EXPENSE_SUBMIT',
            entityName: 'ExpenseClaim',
            entityId: claim.id,
            metadata: { totalAmount: totalClaimAmount },
        });
        await this.auditRepository.save(audit);
        return claim;
    }
    async getExpenseClaims(userId) {
        return this.claimRepository.find({
            where: { userId },
            relations: { items: true, travelRequest: true },
            order: { createdAt: 'DESC' },
        });
    }
    async getExpenseClaimById(userId, id) {
        const claim = await this.claimRepository.findOne({
            where: { id },
            relations: { items: true, travelRequest: true },
        });
        if (!claim) {
            throw new common_1.NotFoundException('Expense claim not found.');
        }
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (claim.userId !== userId &&
            user?.role !== user_entity_1.UserRole.FINANCE &&
            user?.role !== user_entity_1.UserRole.ADMIN) {
            throw new common_1.BadRequestException('Unauthorized resource access.');
        }
        return claim;
    }
};
exports.ExpensesService = ExpensesService;
exports.ExpensesService = ExpensesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(expense_claim_entity_1.ExpenseClaim)),
    __param(1, (0, typeorm_1.InjectRepository)(expense_item_entity_1.ExpenseItem)),
    __param(2, (0, typeorm_1.InjectRepository)(travel_request_entity_1.TravelRequest)),
    __param(3, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(4, (0, typeorm_1.InjectRepository)(audit_log_entity_1.AuditLog)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        notification_service_1.NotificationService])
], ExpensesService);
//# sourceMappingURL=expenses.service.js.map