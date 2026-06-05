import { Injectable, BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, In, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { TravelRequest, TravelStatus } from './entities/travel-request.entity';
import { User, UserRole } from '../users/entities/user.entity';
import { ApprovalWorkflowPolicy } from '../approvals/entities/workflow-policy.entity';
import { ApprovalStage, ApprovalStageStatus } from '../approvals/entities/approval-stage.entity';
import { AuditLog } from '../audit/entities/audit-log.entity';
import { CreateTravelRequestDto } from './dto/create-travel-request.dto';
import { NotificationService } from '../notifications/notification.service';

@Injectable()
export class TravelService {
  constructor(
    @InjectRepository(TravelRequest)
    private readonly travelRepository: Repository<TravelRequest>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(ApprovalWorkflowPolicy)
    private readonly policyRepository: Repository<ApprovalWorkflowPolicy>,
    @InjectRepository(ApprovalStage)
    private readonly approvalStageRepository: Repository<ApprovalStage>,
    @InjectRepository(AuditLog)
    private readonly auditRepository: Repository<AuditLog>,
    private readonly notificationService: NotificationService,
  ) {}

  async submitTravelRequest(userId: string, dto: CreateTravelRequestDto) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found.');
    }

    const startDate = new Date(dto.startDate);
    const endDate = new Date(dto.endDate);
    const now = new Date();

    // Constraint 1: Advance Submission (7 days)
    const diffTime = startDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays < 7) {
      throw new BadRequestException('Domestic travel requests must be submitted at least 7 days in advance.');
    }

    // Constraint 2: Duration Limits (Max 90 days)
    const durationTime = endDate.getTime() - startDate.getTime();
    const durationDays = Math.ceil(durationTime / (1000 * 60 * 60 * 24));
    if (durationDays < 0) {
      throw new BadRequestException('End date must be after start date.');
    }
    if (durationDays > 90) {
      throw new BadRequestException('Trip duration cannot exceed 90 days.');
    }

    // Constraint 3: Overlapping Trip Check
    const overlap = await this.travelRepository.findOne({
      where: {
        userId,
        status: Not(In([TravelStatus.CANCELLED, TravelStatus.REJECTED])),
        startDate: LessThanOrEqual(endDate),
        endDate: MoreThanOrEqual(startDate),
      },
    });
    if (overlap) {
      throw new ConflictException('An active travel request already overlaps with these dates.');
    }

    // 1. Create and Save Travel Request
    const travelRequest = this.travelRepository.create({
      title: dto.title,
      description: dto.description,
      purpose: dto.purpose,
      destination: dto.destination,
      startDate,
      endDate,
      estimatedCost: dto.estimatedCost,
      status: TravelStatus.SUBMITTED,
      userId,
    });
    await this.travelRepository.save(travelRequest);

    // 2. Fetch WorkFlow policy matching user department and estimatedCost
    let policy = await this.policyRepository.findOne({
      where: {
        department: user.department,
        minBudget: LessThanOrEqual(dto.estimatedCost),
        maxBudget: MoreThanOrEqual(dto.estimatedCost),
      },
    });

    if (!policy) {
      // Wildcard fallback
      policy = await this.policyRepository.findOne({
        where: {
          department: '*',
          minBudget: LessThanOrEqual(dto.estimatedCost),
          maxBudget: MoreThanOrEqual(dto.estimatedCost),
        },
      });
    }

    const levels = policy ? policy.requiredLevels : ['L1_MANAGER', 'L3_FINANCE'];
    const stages: ApprovalStage[] = [];

    // 3. Dynamic Workflow Stages Building
    for (const level of levels) {
      let approverId = '';

      if (level === 'L1_MANAGER') {
        approverId = user.managerId || 'usr-manager-l1-001'; // Fallback to seeded manager
      } else if (level === 'L2_DEPT_HEAD') {
        // Find L2 Dept Head (Oscar)
        const l2 = await this.userRepository.findOne({ where: { id: 'usr-manager-l2-001' } });
        approverId = l2 ? l2.id : 'usr-manager-l2-001';
      } else if (level === 'L3_FINANCE') {
        // Find Finance Role User
        const fin = await this.userRepository.findOne({ where: { role: UserRole.FINANCE } });
        approverId = fin ? fin.id : 'usr-finance-001';
      }

      const stage = this.approvalStageRepository.create({
        requestId: travelRequest.id,
        approverId,
        level,
        status: ApprovalStageStatus.PENDING,
      });
      stages.push(stage);
    }

    await this.approvalStageRepository.save(stages);

    // Set first stage active
    travelRequest.status = TravelStatus.PENDING_L1;
    await this.travelRepository.save(travelRequest);

    // 4. Send Notification to first approver
    const firstStage = stages[0];
    await this.notificationService.sendNotification(
      firstStage.approverId,
      'New Travel Request Approval Needed',
      `Travel request "${travelRequest.title}" submitted by ${user.name} requires your L1 approval.`,
      'push',
    );

    // 5. Write to WORM Audit Log
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

  async getTravelRequests(userId: string) {
    return this.travelRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async getTravelRequestById(userId: string, id: string) {
    const request = await this.travelRepository.findOne({
      where: { id },
      relations: { approvalStages: { approver: true } },
    });

    if (!request) {
      throw new NotFoundException('Travel request not found.');
    }

    // Secure checking: only requester or designated approvers can view details
    const approverIds = request.approvalStages.map((s) => s.approverId);
    if (request.userId !== userId && !approverIds.includes(userId)) {
      throw new BadRequestException('Unauthorized resource access.');
    }

    return request;
  }

  async cancelTravelRequest(userId: string, id: string) {
    const request = await this.travelRepository.findOne({ where: { id, userId } });
    if (!request) {
      throw new NotFoundException('Travel request not found or does not belong to user.');
    }

    // Cancellation is only allowed if request is not yet approved
    if (
      request.status !== TravelStatus.SUBMITTED &&
      request.status !== TravelStatus.PENDING_L1 &&
      request.status !== TravelStatus.PENDING_L2 &&
      request.status !== TravelStatus.PENDING_L3
    ) {
      throw new BadRequestException('Approved, rejected, or completed trips cannot be cancelled.');
    }

    request.status = TravelStatus.CANCELLED;
    await this.travelRepository.save(request);

    // Cancel all pending approval stages
    await this.approvalStageRepository.update(
      { requestId: id, status: ApprovalStageStatus.PENDING },
      { status: ApprovalStageStatus.SKIPPED, comments: 'Trip cancelled by requester.' },
    );

    // Write to WORM Audit Log
    const audit = this.auditRepository.create({
      userId,
      action: 'TRAVEL_CANCEL',
      entityName: 'TravelRequest',
      entityId: id,
    });
    await this.auditRepository.save(audit);

    return request;
  }
}
