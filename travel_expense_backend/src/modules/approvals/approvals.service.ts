import { Injectable, BadRequestException, NotFoundException, Optional } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApprovalStage, ApprovalStageStatus } from './entities/approval-stage.entity';
import { TravelRequest, TravelStatus } from '../travel/entities/travel-request.entity';
import { AuditLog } from '../audit/entities/audit-log.entity';
import { NotificationService } from '../notifications/notification.service';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { User, UserRole } from '../users/entities/user.entity';

@Injectable()
export class ApprovalsService {
  constructor(
    @InjectRepository(ApprovalStage)
    private readonly approvalStageRepository: Repository<ApprovalStage>,
    @InjectRepository(TravelRequest)
    private readonly travelRepository: Repository<TravelRequest>,
    @InjectRepository(AuditLog)
    private readonly auditRepository: Repository<AuditLog>,
    private readonly notificationService: NotificationService,
    @Optional()
    @InjectQueue('sla-queue')
    private readonly slaQueue: Queue,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getPendingApprovals(managerId: string) {
    return this.approvalStageRepository.find({
      where: {
        approverId: managerId,
        status: ApprovalStageStatus.PENDING,
      },
      relations: { travelRequest: { user: true } },
      order: { createdAt: 'ASC' },
    });
  }

  async queueSlaJob(stageId: string) {
    if (process.env.OFFLINE_MODE === 'true' || !this.slaQueue) {
      const delay = 15000; // 15 seconds delay for local testing
      console.log(`[Offline SLA] Queueing SLA check for stage ${stageId} (delay: 15s)`);
      setTimeout(async () => {
        try {
          await this.processOfflineSla(stageId);
        } catch (err) {
          console.error('[Offline SLA Error] Failed:', err);
        }
      }, delay);
      return;
    }

    // 8 hours delay for production; 15 seconds for testing/debug mode
    const delay = process.env.NODE_ENV === 'test' ? 15000 : 8 * 60 * 60 * 1000;
    await this.slaQueue.add('sla-check', { stageId }, { delay, removeOnComplete: true });
  }

  async processOfflineSla(stageId: string) {
    console.log(`[Offline SLA Worker] Evaluating SLA status for approval stage ${stageId}...`);

    const stage = await this.approvalStageRepository.findOne({
      where: { id: stageId },
      relations: { travelRequest: { user: true } },
    });

    if (!stage) {
      console.log(`[Offline SLA Worker] Stage ${stageId} not found in database.`);
      return;
    }

    if (stage.status !== ApprovalStageStatus.PENDING) {
      console.log(`[Offline SLA Worker] Stage ${stageId} is already resolved (${stage.status}). No SLA breach.`);
      return;
    }

    console.log(`\x1b[31m[OFFLINE SLA BREACH ALERT] Stage ${stageId} (Level: ${stage.level}) breached SLA.\x1b[0m`);

    stage.status = ApprovalStageStatus.ESCALATED;
    stage.comments = 'SLA threshold breached: auto-escalated by offline background timer.';
    await this.approvalStageRepository.save(stage);

    const travelRequest = stage.travelRequest;
    const l2 = await this.userRepository.findOne({ where: { id: 'usr-manager-l2-001' } });
    const secondaryManagerId = l2 ? l2.id : 'usr-manager-l2-001';

    if (stage.approverId === secondaryManagerId) {
      const financeUser = await this.userRepository.findOne({ where: { role: UserRole.FINANCE } });
      const nextApproverId = financeUser ? financeUser.id : 'usr-finance-001';

      const escalationStage = this.approvalStageRepository.create({
        requestId: travelRequest.id,
        approverId: nextApproverId,
        level: 'L3_FINANCE_ESCALATED',
        status: ApprovalStageStatus.PENDING,
      });
      await this.approvalStageRepository.save(escalationStage);

      travelRequest.status = TravelStatus.PENDING_L3;
      await this.travelRepository.save(travelRequest);

      await this.notificationService.sendNotification(
        nextApproverId,
        'URGENT: Escalated Travel Request',
        `Travel request "${travelRequest.title}" breached L2 SLA and is escalated to you.`,
        'push',
      );
    } else {
      const escalationStage = this.approvalStageRepository.create({
        requestId: travelRequest.id,
        approverId: secondaryManagerId,
        level: `${stage.level}_ESCALATED`,
        status: ApprovalStageStatus.PENDING,
      });
      await this.approvalStageRepository.save(escalationStage);

      travelRequest.status = TravelStatus.PENDING_L2;
      await this.travelRepository.save(travelRequest);

      await this.notificationService.sendNotification(
        secondaryManagerId,
        'URGENT: Escalated Travel Request',
        `Travel request "${travelRequest.title}" from ${travelRequest.user.name} breached L1 SLA. Requires immediate L2 approval.`,
        'push',
      );
    }
  }

  async approveStage(stageId: string, approverId: string) {
    const stage = await this.approvalStageRepository.findOne({
      where: { id: stageId },
      relations: { travelRequest: { user: true } },
    });

    if (!stage) {
      throw new NotFoundException('Approval stage not found.');
    }

    if (stage.approverId !== approverId) {
      throw new BadRequestException('You are not authorized to sign off on this approval stage.');
    }

    if (stage.status !== ApprovalStageStatus.PENDING) {
      throw new BadRequestException('This stage has already been processed.');
    }

    // 1. Mark stage approved
    stage.status = ApprovalStageStatus.APPROVED;
    await this.approvalStageRepository.save(stage);

    const travelRequest = stage.travelRequest;
    
    // 2. Fetch all stages sorted by creation
    const allStages = await this.approvalStageRepository.find({
      where: { requestId: travelRequest.id },
      order: { createdAt: 'ASC' },
    });

    const currentStageIndex = allStages.findIndex((s) => s.id === stageId);
    const nextStage = allStages[currentStageIndex + 1];

    if (nextStage) {
      // Advance to next approval layer
      nextStage.status = ApprovalStageStatus.PENDING;
      await this.approvalStageRepository.save(nextStage);

      // Update Travel Request Status
      if (nextStage.level === 'L2_DEPT_HEAD') {
        travelRequest.status = TravelStatus.PENDING_L2;
      } else if (nextStage.level === 'L3_FINANCE') {
        travelRequest.status = TravelStatus.PENDING_L3;
      }
      await this.travelRepository.save(travelRequest);

      // Queue SLA escalation check for the new stage
      await this.queueSlaJob(nextStage.id);

      // Notify next approver
      await this.notificationService.sendNotification(
        nextStage.approverId,
        'Approval Workflow Escalation',
        `Travel request "${travelRequest.title}" from ${travelRequest.user.name} requires your ${nextStage.level} approval.`,
        'push',
      );
    } else {
      // Dynamic chain completed -> Fully Approved
      travelRequest.status = TravelStatus.APPROVED;
      await this.travelRepository.save(travelRequest);

      // Notify employee
      await this.notificationService.sendNotification(
        travelRequest.userId,
        'Travel Request Approved',
        `Pack your bags! Your travel request "${travelRequest.title}" has been fully approved.`,
        'email',
      );
    }

    // 3. Write to WORM Audit Log
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

  async rejectStage(stageId: string, approverId: string, reason: string) {
    const stage = await this.approvalStageRepository.findOne({
      where: { id: stageId },
      relations: { travelRequest: { user: true } },
    });

    if (!stage) {
      throw new NotFoundException('Approval stage not found.');
    }

    if (stage.approverId !== approverId) {
      throw new BadRequestException('You are not authorized to sign off on this approval stage.');
    }

    if (stage.status !== ApprovalStageStatus.PENDING) {
      throw new BadRequestException('This stage has already been processed.');
    }

    // 1. Mark stage rejected
    stage.status = ApprovalStageStatus.REJECTED;
    stage.comments = reason;
    await this.approvalStageRepository.save(stage);

    const travelRequest = stage.travelRequest;
    travelRequest.status = TravelStatus.REJECTED;
    await this.travelRepository.save(travelRequest);

    // 2. Skip all other pending stages in this workflow
    await this.approvalStageRepository.update(
      { requestId: travelRequest.id, status: ApprovalStageStatus.PENDING },
      { status: ApprovalStageStatus.SKIPPED, comments: 'Skipped due to rejection in earlier stage.' },
    );

    // 3. Notify employee
    await this.notificationService.sendNotification(
      travelRequest.userId,
      'Travel Request Rejected',
      `Your travel request "${travelRequest.title}" was rejected by ${reqUser(stage.approverId)}. Reason: ${reason}`,
      'email',
    );

    // 4. Write to WORM Audit Log
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
}

// Simple helper to label automated approvers in logs
function reqUser(id: string): string {
  if (id === 'usr-manager-l1-001') return 'Jane Smith';
  if (id === 'usr-manager-l2-001') return 'Oscar Martinez';
  if (id === 'usr-finance-001') return 'Robert Vance';
  return 'Approver';
}
