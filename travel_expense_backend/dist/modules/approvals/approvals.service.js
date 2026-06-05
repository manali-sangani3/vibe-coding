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
exports.ApprovalsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const approval_stage_entity_1 = require("./entities/approval-stage.entity");
const travel_request_entity_1 = require("../travel/entities/travel-request.entity");
const audit_log_entity_1 = require("../audit/entities/audit-log.entity");
const notification_service_1 = require("../notifications/notification.service");
const bullmq_1 = require("@nestjs/bullmq");
const bullmq_2 = require("bullmq");
const user_entity_1 = require("../users/entities/user.entity");
let ApprovalsService = class ApprovalsService {
    approvalStageRepository;
    travelRepository;
    auditRepository;
    notificationService;
    slaQueue;
    userRepository;
    constructor(approvalStageRepository, travelRepository, auditRepository, notificationService, slaQueue, userRepository) {
        this.approvalStageRepository = approvalStageRepository;
        this.travelRepository = travelRepository;
        this.auditRepository = auditRepository;
        this.notificationService = notificationService;
        this.slaQueue = slaQueue;
        this.userRepository = userRepository;
    }
    async getPendingApprovals(managerId) {
        return this.approvalStageRepository.find({
            where: {
                approverId: managerId,
                status: approval_stage_entity_1.ApprovalStageStatus.PENDING,
            },
            relations: { travelRequest: { user: true } },
            order: { createdAt: 'ASC' },
        });
    }
    async queueSlaJob(stageId) {
        if (process.env.OFFLINE_MODE === 'true' || !this.slaQueue) {
            const delay = 15000;
            console.log(`[Offline SLA] Queueing SLA check for stage ${stageId} (delay: 15s)`);
            setTimeout(async () => {
                try {
                    await this.processOfflineSla(stageId);
                }
                catch (err) {
                    console.error('[Offline SLA Error] Failed:', err);
                }
            }, delay);
            return;
        }
        const delay = process.env.NODE_ENV === 'test' ? 15000 : 8 * 60 * 60 * 1000;
        await this.slaQueue.add('sla-check', { stageId }, { delay, removeOnComplete: true });
    }
    async processOfflineSla(stageId) {
        console.log(`[Offline SLA Worker] Evaluating SLA status for approval stage ${stageId}...`);
        const stage = await this.approvalStageRepository.findOne({
            where: { id: stageId },
            relations: { travelRequest: { user: true } },
        });
        if (!stage) {
            console.log(`[Offline SLA Worker] Stage ${stageId} not found in database.`);
            return;
        }
        if (stage.status !== approval_stage_entity_1.ApprovalStageStatus.PENDING) {
            console.log(`[Offline SLA Worker] Stage ${stageId} is already resolved (${stage.status}). No SLA breach.`);
            return;
        }
        console.log(`\x1b[31m[OFFLINE SLA BREACH ALERT] Stage ${stageId} (Level: ${stage.level}) breached SLA.\x1b[0m`);
        stage.status = approval_stage_entity_1.ApprovalStageStatus.ESCALATED;
        stage.comments = 'SLA threshold breached: auto-escalated by offline background timer.';
        await this.approvalStageRepository.save(stage);
        const travelRequest = stage.travelRequest;
        const l2 = await this.userRepository.findOne({ where: { id: 'usr-manager-l2-001' } });
        const secondaryManagerId = l2 ? l2.id : 'usr-manager-l2-001';
        if (stage.approverId === secondaryManagerId) {
            const financeUser = await this.userRepository.findOne({ where: { role: user_entity_1.UserRole.FINANCE } });
            const nextApproverId = financeUser ? financeUser.id : 'usr-finance-001';
            const escalationStage = this.approvalStageRepository.create({
                requestId: travelRequest.id,
                approverId: nextApproverId,
                level: 'L3_FINANCE_ESCALATED',
                status: approval_stage_entity_1.ApprovalStageStatus.PENDING,
            });
            await this.approvalStageRepository.save(escalationStage);
            travelRequest.status = travel_request_entity_1.TravelStatus.PENDING_L3;
            await this.travelRepository.save(travelRequest);
            await this.notificationService.sendNotification(nextApproverId, 'URGENT: Escalated Travel Request', `Travel request "${travelRequest.title}" breached L2 SLA and is escalated to you.`, 'push');
        }
        else {
            const escalationStage = this.approvalStageRepository.create({
                requestId: travelRequest.id,
                approverId: secondaryManagerId,
                level: `${stage.level}_ESCALATED`,
                status: approval_stage_entity_1.ApprovalStageStatus.PENDING,
            });
            await this.approvalStageRepository.save(escalationStage);
            travelRequest.status = travel_request_entity_1.TravelStatus.PENDING_L2;
            await this.travelRepository.save(travelRequest);
            await this.notificationService.sendNotification(secondaryManagerId, 'URGENT: Escalated Travel Request', `Travel request "${travelRequest.title}" from ${travelRequest.user.name} breached L1 SLA. Requires immediate L2 approval.`, 'push');
        }
    }
    async approveStage(stageId, approverId) {
        const stage = await this.approvalStageRepository.findOne({
            where: { id: stageId },
            relations: { travelRequest: { user: true } },
        });
        if (!stage) {
            throw new common_1.NotFoundException('Approval stage not found.');
        }
        if (stage.approverId !== approverId) {
            throw new common_1.BadRequestException('You are not authorized to sign off on this approval stage.');
        }
        if (stage.status !== approval_stage_entity_1.ApprovalStageStatus.PENDING) {
            throw new common_1.BadRequestException('This stage has already been processed.');
        }
        stage.status = approval_stage_entity_1.ApprovalStageStatus.APPROVED;
        await this.approvalStageRepository.save(stage);
        const travelRequest = stage.travelRequest;
        const allStages = await this.approvalStageRepository.find({
            where: { requestId: travelRequest.id },
            order: { createdAt: 'ASC' },
        });
        const currentStageIndex = allStages.findIndex((s) => s.id === stageId);
        const nextStage = allStages[currentStageIndex + 1];
        if (nextStage) {
            nextStage.status = approval_stage_entity_1.ApprovalStageStatus.PENDING;
            await this.approvalStageRepository.save(nextStage);
            if (nextStage.level === 'L2_DEPT_HEAD') {
                travelRequest.status = travel_request_entity_1.TravelStatus.PENDING_L2;
            }
            else if (nextStage.level === 'L3_FINANCE') {
                travelRequest.status = travel_request_entity_1.TravelStatus.PENDING_L3;
            }
            await this.travelRepository.save(travelRequest);
            await this.queueSlaJob(nextStage.id);
            await this.notificationService.sendNotification(nextStage.approverId, 'Approval Workflow Escalation', `Travel request "${travelRequest.title}" from ${travelRequest.user.name} requires your ${nextStage.level} approval.`, 'push');
        }
        else {
            travelRequest.status = travel_request_entity_1.TravelStatus.APPROVED;
            await this.travelRepository.save(travelRequest);
            await this.notificationService.sendNotification(travelRequest.userId, 'Travel Request Approved', `Pack your bags! Your travel request "${travelRequest.title}" has been fully approved.`, 'email');
        }
        const audit = this.auditRepository.create({
            userId: approverId,
            action: 'APPROVAL_APPROVED',
            entityName: 'TravelRequest',
            entityId: travelRequest.id,
            metadata: { stageLevel: stage.level },
        });
        await this.auditRepository.save(audit);
        return stage;
    }
    async rejectStage(stageId, approverId, reason) {
        const stage = await this.approvalStageRepository.findOne({
            where: { id: stageId },
            relations: { travelRequest: { user: true } },
        });
        if (!stage) {
            throw new common_1.NotFoundException('Approval stage not found.');
        }
        if (stage.approverId !== approverId) {
            throw new common_1.BadRequestException('You are not authorized to sign off on this approval stage.');
        }
        if (stage.status !== approval_stage_entity_1.ApprovalStageStatus.PENDING) {
            throw new common_1.BadRequestException('This stage has already been processed.');
        }
        stage.status = approval_stage_entity_1.ApprovalStageStatus.REJECTED;
        stage.comments = reason;
        await this.approvalStageRepository.save(stage);
        const travelRequest = stage.travelRequest;
        travelRequest.status = travel_request_entity_1.TravelStatus.REJECTED;
        await this.travelRepository.save(travelRequest);
        await this.approvalStageRepository.update({ requestId: travelRequest.id, status: approval_stage_entity_1.ApprovalStageStatus.PENDING }, { status: approval_stage_entity_1.ApprovalStageStatus.SKIPPED, comments: 'Skipped due to rejection in earlier stage.' });
        await this.notificationService.sendNotification(travelRequest.userId, 'Travel Request Rejected', `Your travel request "${travelRequest.title}" was rejected by ${reqUser(stage.approverId)}. Reason: ${reason}`, 'email');
        const audit = this.auditRepository.create({
            userId: approverId,
            action: 'APPROVAL_REJECTED',
            entityName: 'TravelRequest',
            entityId: travelRequest.id,
            metadata: { reason },
        });
        await this.auditRepository.save(audit);
        return stage;
    }
};
exports.ApprovalsService = ApprovalsService;
exports.ApprovalsService = ApprovalsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(approval_stage_entity_1.ApprovalStage)),
    __param(1, (0, typeorm_1.InjectRepository)(travel_request_entity_1.TravelRequest)),
    __param(2, (0, typeorm_1.InjectRepository)(audit_log_entity_1.AuditLog)),
    __param(4, (0, common_1.Optional)()),
    __param(4, (0, bullmq_1.InjectQueue)('sla-queue')),
    __param(5, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        notification_service_1.NotificationService,
        bullmq_2.Queue,
        typeorm_2.Repository])
], ApprovalsService);
function reqUser(id) {
    if (id === 'usr-manager-l1-001')
        return 'Jane Smith';
    if (id === 'usr-manager-l2-001')
        return 'Oscar Martinez';
    if (id === 'usr-finance-001')
        return 'Robert Vance';
    return 'Approver';
}
//# sourceMappingURL=approvals.service.js.map