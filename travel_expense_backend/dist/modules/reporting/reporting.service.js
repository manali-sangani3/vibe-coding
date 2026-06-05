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
exports.ReportingService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const travel_request_entity_1 = require("../travel/entities/travel-request.entity");
const expense_claim_entity_1 = require("../expenses/entities/expense-claim.entity");
const reimbursement_entity_1 = require("../reimbursements/entities/reimbursement.entity");
const approval_stage_entity_1 = require("../approvals/entities/approval-stage.entity");
let ReportingService = class ReportingService {
    travelRepository;
    claimRepository;
    reimbursementRepository;
    stageRepository;
    constructor(travelRepository, claimRepository, reimbursementRepository, stageRepository) {
        this.travelRepository = travelRepository;
        this.claimRepository = claimRepository;
        this.reimbursementRepository = reimbursementRepository;
        this.stageRepository = stageRepository;
    }
    async getDashboardMetrics() {
        const approvedRequests = await this.travelRepository.find({
            where: { status: travel_request_entity_1.TravelStatus.APPROVED },
        });
        let totalApprovalTimeMs = 0;
        approvedRequests.forEach((req) => {
            const duration = req.startDate.getTime() - req.createdAt.getTime();
            totalApprovalTimeMs += Math.max(0, duration);
        });
        const avgApprovalTimeDays = approvedRequests.length > 0
            ? (totalApprovalTimeMs / (1000 * 60 * 60 * 24)) / approvedRequests.length
            : 0;
        const l1Stages = await this.stageRepository.find({ where: { level: 'L1_MANAGER' } });
        const compliantL1 = l1Stages.filter((s) => s.status !== approval_stage_entity_1.ApprovalStageStatus.ESCALATED);
        const l1SlaComplianceRate = l1Stages.length > 0
            ? (compliantL1.length / l1Stages.length) * 100
            : 100.0;
        const paidReimbursements = await this.reimbursementRepository.find({
            where: { status: reimbursement_entity_1.ReimbursementStatus.PAID },
            relations: { claim: true },
        });
        let totalReimbursementTimeMs = 0;
        paidReimbursements.forEach((reim) => {
            if (reim.paidAt && reim.claim.submittedAt) {
                const time = reim.paidAt.getTime() - reim.claim.submittedAt.getTime();
                totalReimbursementTimeMs += Math.max(0, time);
            }
        });
        const avgReimbursementTimeDays = paidReimbursements.length > 0
            ? (totalReimbursementTimeMs / (1000 * 60 * 60 * 24)) / paidReimbursements.length
            : 0;
        const totalClaims = await this.claimRepository.count();
        const rejectedClaims = await this.claimRepository.count({ where: { status: expense_claim_entity_1.ClaimStatus.REJECTED } });
        const policyComplianceRate = totalClaims > 0
            ? ((totalClaims - rejectedClaims) / totalClaims) * 100
            : 100.0;
        const allClaims = await this.claimRepository.find();
        let totalClaimedSpend = 0.0;
        allClaims.forEach((c) => {
            totalClaimedSpend += Number(c.claimAmount);
        });
        return {
            success: true,
            metrics: {
                avgApprovalTimeDays: Number(avgApprovalTimeDays.toFixed(2)),
                l1SlaComplianceRate: Number(l1SlaComplianceRate.toFixed(1)),
                avgReimbursementTimeDays: Number(avgReimbursementTimeDays.toFixed(2)),
                policyComplianceRate: Number(policyComplianceRate.toFixed(1)),
                totalClaimedSpend: Number(totalClaimedSpend.toFixed(2)),
                organizationUsersClaiming: allClaims.length,
            },
        };
    }
    async generateCsvExport() {
        const claims = await this.claimRepository.find({
            relations: { user: true, travelRequest: true },
            order: { createdAt: 'DESC' },
        });
        let csvContent = 'Claim ID,Employee Name,Department,Amount,Status,Linked Trip,Submitted At\n';
        claims.forEach((c) => {
            const tripTitle = c.travelRequest ? c.travelRequest.title.replace(/,/g, ' ') : 'N/A';
            const empName = c.user ? c.user.name.replace(/,/g, ' ') : 'Unknown';
            const dept = c.user ? (c.user.department || 'N/A').replace(/,/g, ' ') : 'N/A';
            const date = c.submittedAt ? c.submittedAt.toISOString() : c.createdAt.toISOString();
            csvContent += `${c.id},${empName},${dept},${c.claimAmount},${c.status},${tripTitle},${date}\n`;
        });
        return csvContent;
    }
};
exports.ReportingService = ReportingService;
exports.ReportingService = ReportingService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(travel_request_entity_1.TravelRequest)),
    __param(1, (0, typeorm_1.InjectRepository)(expense_claim_entity_1.ExpenseClaim)),
    __param(2, (0, typeorm_1.InjectRepository)(reimbursement_entity_1.Reimbursement)),
    __param(3, (0, typeorm_1.InjectRepository)(approval_stage_entity_1.ApprovalStage)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ReportingService);
//# sourceMappingURL=reporting.service.js.map