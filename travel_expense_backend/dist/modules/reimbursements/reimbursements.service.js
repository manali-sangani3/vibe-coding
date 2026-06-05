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
exports.ReimbursementsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const reimbursement_entity_1 = require("./entities/reimbursement.entity");
const expense_claim_entity_1 = require("../expenses/entities/expense-claim.entity");
const travel_request_entity_1 = require("../travel/entities/travel-request.entity");
const audit_log_entity_1 = require("../audit/entities/audit-log.entity");
const notification_service_1 = require("../notifications/notification.service");
let ReimbursementsService = class ReimbursementsService {
    reimbursementRepository;
    claimRepository;
    travelRepository;
    auditRepository;
    notificationService;
    constructor(reimbursementRepository, claimRepository, travelRepository, auditRepository, notificationService) {
        this.reimbursementRepository = reimbursementRepository;
        this.claimRepository = claimRepository;
        this.travelRepository = travelRepository;
        this.auditRepository = auditRepository;
        this.notificationService = notificationService;
    }
    async getReimbursementHistory(userId) {
        return this.reimbursementRepository.find({
            where: { claim: { userId } },
            relations: { claim: true },
            order: { createdAt: 'DESC' },
        });
    }
    async processErpPayout(apiKey, claimId, paymentRef, status) {
        if (apiKey !== 'erp-mock-key') {
            throw new common_1.UnauthorizedException('Invalid ERP integration secret key.');
        }
        const claim = await this.claimRepository.findOne({
            where: { id: claimId },
            relations: { travelRequest: true },
        });
        if (!claim) {
            throw new common_1.NotFoundException('Expense claim not found.');
        }
        let reimbursement = await this.reimbursementRepository.findOne({ where: { claimId } });
        if (!reimbursement) {
            reimbursement = this.reimbursementRepository.create({ claimId });
        }
        if (status === 'PAID') {
            reimbursement.status = reimbursement_entity_1.ReimbursementStatus.PAID;
            reimbursement.paymentReference = paymentRef;
            reimbursement.paidAt = new Date();
            await this.reimbursementRepository.save(reimbursement);
            claim.status = expense_claim_entity_1.ClaimStatus.REIMBURSED;
            await this.claimRepository.save(claim);
            if (claim.travelRequest) {
                claim.travelRequest.status = travel_request_entity_1.TravelStatus.REIMBURSED;
                await this.travelRepository.save(claim.travelRequest);
            }
            await this.notificationService.sendNotification(claim.userId, 'Reimbursement Paid', `Good news! Your expense claim for ₹${claim.claimAmount} has been paid (Ref: ${paymentRef}).`, 'email');
            const audit = this.auditRepository.create({
                action: 'CLAIM_REIMBURSED',
                entityName: 'ExpenseClaim',
                entityId: claimId,
                metadata: { paymentRef, amount: claim.claimAmount },
            });
            await this.auditRepository.save(audit);
        }
        else {
            reimbursement.status = reimbursement_entity_1.ReimbursementStatus.FAILED;
            await this.reimbursementRepository.save(reimbursement);
            await this.notificationService.sendNotification(claim.userId, 'Reimbursement Payout Failed', `Payout failed for claim reference ID: ${claimId}. Contact Finance.`, 'email');
        }
        return reimbursement;
    }
};
exports.ReimbursementsService = ReimbursementsService;
exports.ReimbursementsService = ReimbursementsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(reimbursement_entity_1.Reimbursement)),
    __param(1, (0, typeorm_1.InjectRepository)(expense_claim_entity_1.ExpenseClaim)),
    __param(2, (0, typeorm_1.InjectRepository)(travel_request_entity_1.TravelRequest)),
    __param(3, (0, typeorm_1.InjectRepository)(audit_log_entity_1.AuditLog)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        notification_service_1.NotificationService])
], ReimbursementsService);
//# sourceMappingURL=reimbursements.service.js.map