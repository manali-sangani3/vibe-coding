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
exports.TravelService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const travel_request_entity_1 = require("./entities/travel-request.entity");
const user_entity_1 = require("../users/entities/user.entity");
const workflow_policy_entity_1 = require("../approvals/entities/workflow-policy.entity");
const approval_stage_entity_1 = require("../approvals/entities/approval-stage.entity");
const audit_log_entity_1 = require("../audit/entities/audit-log.entity");
const notification_service_1 = require("../notifications/notification.service");
let TravelService = class TravelService {
    travelRepository;
    userRepository;
    policyRepository;
    approvalStageRepository;
    auditRepository;
    notificationService;
    constructor(travelRepository, userRepository, policyRepository, approvalStageRepository, auditRepository, notificationService) {
        this.travelRepository = travelRepository;
        this.userRepository = userRepository;
        this.policyRepository = policyRepository;
        this.approvalStageRepository = approvalStageRepository;
        this.auditRepository = auditRepository;
        this.notificationService = notificationService;
    }
    async submitTravelRequest(userId, dto) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new common_1.NotFoundException('User not found.');
        }
        const startDate = new Date(dto.startDate);
        const endDate = new Date(dto.endDate);
        const now = new Date();
        const diffTime = startDate.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays < 7) {
            throw new common_1.BadRequestException('Domestic travel requests must be submitted at least 7 days in advance.');
        }
        const durationTime = endDate.getTime() - startDate.getTime();
        const durationDays = Math.ceil(durationTime / (1000 * 60 * 60 * 24));
        if (durationDays < 0) {
            throw new common_1.BadRequestException('End date must be after start date.');
        }
        if (durationDays > 90) {
            throw new common_1.BadRequestException('Trip duration cannot exceed 90 days.');
        }
        const overlap = await this.travelRepository.findOne({
            where: {
                userId,
                status: (0, typeorm_2.Not)((0, typeorm_2.In)([travel_request_entity_1.TravelStatus.CANCELLED, travel_request_entity_1.TravelStatus.REJECTED])),
                startDate: (0, typeorm_2.LessThanOrEqual)(endDate),
                endDate: (0, typeorm_2.MoreThanOrEqual)(startDate),
            },
        });
        if (overlap) {
            throw new common_1.ConflictException('An active travel request already overlaps with these dates.');
        }
        const travelRequest = this.travelRepository.create({
            title: dto.title,
            description: dto.description,
            purpose: dto.purpose,
            destination: dto.destination,
            startDate,
            endDate,
            estimatedCost: dto.estimatedCost,
            status: travel_request_entity_1.TravelStatus.SUBMITTED,
            userId,
        });
        await this.travelRepository.save(travelRequest);
        let policy = await this.policyRepository.findOne({
            where: {
                department: user.department,
                minBudget: (0, typeorm_2.LessThanOrEqual)(dto.estimatedCost),
                maxBudget: (0, typeorm_2.MoreThanOrEqual)(dto.estimatedCost),
            },
        });
        if (!policy) {
            policy = await this.policyRepository.findOne({
                where: {
                    department: '*',
                    minBudget: (0, typeorm_2.LessThanOrEqual)(dto.estimatedCost),
                    maxBudget: (0, typeorm_2.MoreThanOrEqual)(dto.estimatedCost),
                },
            });
        }
        const levels = policy ? policy.requiredLevels : ['L1_MANAGER', 'L3_FINANCE'];
        const stages = [];
        for (const level of levels) {
            let approverId = '';
            if (level === 'L1_MANAGER') {
                approverId = user.managerId || 'usr-manager-l1-001';
            }
            else if (level === 'L2_DEPT_HEAD') {
                const l2 = await this.userRepository.findOne({ where: { id: 'usr-manager-l2-001' } });
                approverId = l2 ? l2.id : 'usr-manager-l2-001';
            }
            else if (level === 'L3_FINANCE') {
                const fin = await this.userRepository.findOne({ where: { role: user_entity_1.UserRole.FINANCE } });
                approverId = fin ? fin.id : 'usr-finance-001';
            }
            const stage = this.approvalStageRepository.create({
                requestId: travelRequest.id,
                approverId,
                level,
                status: approval_stage_entity_1.ApprovalStageStatus.PENDING,
            });
            stages.push(stage);
        }
        await this.approvalStageRepository.save(stages);
        travelRequest.status = travel_request_entity_1.TravelStatus.PENDING_L1;
        await this.travelRepository.save(travelRequest);
        const firstStage = stages[0];
        await this.notificationService.sendNotification(firstStage.approverId, 'New Travel Request Approval Needed', `Travel request "${travelRequest.title}" submitted by ${user.name} requires your L1 approval.`, 'push');
        const audit = this.auditRepository.create({
            userId,
            action: 'TRAVEL_SUBMIT',
            entityName: 'TravelRequest',
            entityId: travelRequest.id,
            metadata: { title: travelRequest.title, cost: travelRequest.estimatedCost },
        });
        await this.auditRepository.save(audit);
        return travelRequest;
    }
    async getTravelRequests(userId) {
        return this.travelRepository.find({
            where: { userId },
            order: { createdAt: 'DESC' },
        });
    }
    async getTravelRequestById(userId, id) {
        const request = await this.travelRepository.findOne({
            where: { id },
            relations: { approvalStages: { approver: true } },
        });
        if (!request) {
            throw new common_1.NotFoundException('Travel request not found.');
        }
        const approverIds = request.approvalStages.map((s) => s.approverId);
        if (request.userId !== userId && !approverIds.includes(userId)) {
            throw new common_1.BadRequestException('Unauthorized resource access.');
        }
        return request;
    }
    async cancelTravelRequest(userId, id) {
        const request = await this.travelRepository.findOne({ where: { id, userId } });
        if (!request) {
            throw new common_1.NotFoundException('Travel request not found or does not belong to user.');
        }
        if (request.status !== travel_request_entity_1.TravelStatus.SUBMITTED &&
            request.status !== travel_request_entity_1.TravelStatus.PENDING_L1 &&
            request.status !== travel_request_entity_1.TravelStatus.PENDING_L2 &&
            request.status !== travel_request_entity_1.TravelStatus.PENDING_L3) {
            throw new common_1.BadRequestException('Approved, rejected, or completed trips cannot be cancelled.');
        }
        request.status = travel_request_entity_1.TravelStatus.CANCELLED;
        await this.travelRepository.save(request);
        await this.approvalStageRepository.update({ requestId: id, status: approval_stage_entity_1.ApprovalStageStatus.PENDING }, { status: approval_stage_entity_1.ApprovalStageStatus.SKIPPED, comments: 'Trip cancelled by requester.' });
        const audit = this.auditRepository.create({
            userId,
            action: 'TRAVEL_CANCEL',
            entityName: 'TravelRequest',
            entityId: id,
        });
        await this.auditRepository.save(audit);
        return request;
    }
};
exports.TravelService = TravelService;
exports.TravelService = TravelService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(travel_request_entity_1.TravelRequest)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(2, (0, typeorm_1.InjectRepository)(workflow_policy_entity_1.ApprovalWorkflowPolicy)),
    __param(3, (0, typeorm_1.InjectRepository)(approval_stage_entity_1.ApprovalStage)),
    __param(4, (0, typeorm_1.InjectRepository)(audit_log_entity_1.AuditLog)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        notification_service_1.NotificationService])
], TravelService);
//# sourceMappingURL=travel.service.js.map