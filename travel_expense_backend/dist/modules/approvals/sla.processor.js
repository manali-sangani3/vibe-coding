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
exports.SlaProcessor = void 0;
const bullmq_1 = require("@nestjs/bullmq");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const approval_stage_entity_1 = require("./entities/approval-stage.entity");
const travel_request_entity_1 = require("../travel/entities/travel-request.entity");
const notification_service_1 = require("../notifications/notification.service");
const user_entity_1 = require("../users/entities/user.entity");
let SlaProcessor = class SlaProcessor extends bullmq_1.WorkerHost {
    stageRepository;
    travelRepository;
    userRepository;
    notificationService;
    constructor(stageRepository, travelRepository, userRepository, notificationService) {
        super();
        this.stageRepository = stageRepository;
        this.travelRepository = travelRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
    }
    async process(job) {
        const { stageId } = job.data;
        console.log(`[SLA Worker] Evaluating SLA status for approval stage ${stageId}...`);
        const stage = await this.stageRepository.findOne({
            where: { id: stageId },
            relations: { travelRequest: { user: true } },
        });
        if (!stage) {
            console.log(`[SLA Worker] Stage ${stageId} not found in database.`);
            return;
        }
        if (stage.status !== approval_stage_entity_1.ApprovalStageStatus.PENDING) {
            console.log(`[SLA Worker] Stage ${stageId} is already resolved (${stage.status}). No SLA breach.`);
            return;
        }
        console.log(`\x1b[31m[SLA BREACH ALERT] Stage ${stageId} (Level: ${stage.level}) breached 8-hour window.\x1b[0m`);
        stage.status = approval_stage_entity_1.ApprovalStageStatus.ESCALATED;
        stage.comments = 'SLA threshold breached: auto-escalated by background job.';
        await this.stageRepository.save(stage);
        const travelRequest = stage.travelRequest;
        const l2 = await this.userRepository.findOne({ where: { id: 'usr-manager-l2-001' } });
        const secondaryManagerId = l2 ? l2.id : 'usr-manager-l2-001';
        if (stage.approverId === secondaryManagerId) {
            const financeUser = await this.userRepository.findOne({ where: { role: user_entity_1.UserRole.FINANCE } });
            const nextApproverId = financeUser ? financeUser.id : 'usr-finance-001';
            const escalationStage = this.stageRepository.create({
                requestId: travelRequest.id,
                approverId: nextApproverId,
                level: 'L3_FINANCE_ESCALATED',
                status: approval_stage_entity_1.ApprovalStageStatus.PENDING,
            });
            await this.stageRepository.save(escalationStage);
            travelRequest.status = travel_request_entity_1.TravelStatus.PENDING_L3;
            await this.travelRepository.save(travelRequest);
            await this.notificationService.sendNotification(nextApproverId, 'URGENT: Escallated Travel Request', `Travel request "${travelRequest.title}" breached initial L2 SLA and is escalated to you.`, 'push');
        }
        else {
            const escalationStage = this.stageRepository.create({
                requestId: travelRequest.id,
                approverId: secondaryManagerId,
                level: `${stage.level}_ESCALATED`,
                status: approval_stage_entity_1.ApprovalStageStatus.PENDING,
            });
            await this.stageRepository.save(escalationStage);
            travelRequest.status = travel_request_entity_1.TravelStatus.PENDING_L2;
            await this.travelRepository.save(travelRequest);
            await this.notificationService.sendNotification(secondaryManagerId, 'URGENT: Escalated Travel Request', `Travel request "${travelRequest.title}" from ${travelRequest.user.name} breached L1 SLA. Requires immediate approval.`, 'push');
        }
        return { escalated: true };
    }
};
exports.SlaProcessor = SlaProcessor;
exports.SlaProcessor = SlaProcessor = __decorate([
    (0, bullmq_1.Processor)('sla-queue'),
    __param(0, (0, typeorm_1.InjectRepository)(approval_stage_entity_1.ApprovalStage)),
    __param(1, (0, typeorm_1.InjectRepository)(travel_request_entity_1.TravelRequest)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        notification_service_1.NotificationService])
], SlaProcessor);
//# sourceMappingURL=sla.processor.js.map