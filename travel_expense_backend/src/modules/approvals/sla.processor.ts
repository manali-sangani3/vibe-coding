import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApprovalStage, ApprovalStageStatus } from './entities/approval-stage.entity';
import { TravelRequest, TravelStatus } from '../travel/entities/travel-request.entity';
import { NotificationService } from '../notifications/notification.service';
import { User, UserRole } from '../users/entities/user.entity';

@Processor('sla-queue')
export class SlaProcessor extends WorkerHost {
  constructor(
    @InjectRepository(ApprovalStage)
    private readonly stageRepository: Repository<ApprovalStage>,
    @InjectRepository(TravelRequest)
    private readonly travelRepository: Repository<TravelRequest>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly notificationService: NotificationService,
  ) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
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

    // SLA triggers ONLY if stage remains in pending state
    if (stage.status !== ApprovalStageStatus.PENDING) {
      console.log(`[SLA Worker] Stage ${stageId} is already resolved (${stage.status}). No SLA breach.`);
      return;
    }

    console.log(`\x1b[31m[SLA BREACH ALERT] Stage ${stageId} (Level: ${stage.level}) breached 8-hour window.\x1b[0m`);

    // 1. Update current stage to escalated
    stage.status = ApprovalStageStatus.ESCALATED;
    stage.comments = 'SLA threshold breached: auto-escalated by background job.';
    await this.stageRepository.save(stage);

    const travelRequest = stage.travelRequest;

    // 2. Escalate workflow routing to secondary manager
    // Determine escalation approver (L2 manager: Oscar)
    const l2 = await this.userRepository.findOne({ where: { id: 'usr-manager-l2-001' } });
    const secondaryManagerId = l2 ? l2.id : 'usr-manager-l2-001';

    if (stage.approverId === secondaryManagerId) {
      // If already at L2, escalate to L3 (Finance) or Admin
      const financeUser = await this.userRepository.findOne({ where: { role: UserRole.FINANCE } });
      const nextApproverId = financeUser ? financeUser.id : 'usr-finance-001';

      const escalationStage = this.stageRepository.create({
        requestId: travelRequest.id,
        approverId: nextApproverId,
        level: 'L3_FINANCE_ESCALATED',
        status: ApprovalStageStatus.PENDING,
      });
      await this.stageRepository.save(escalationStage);

      travelRequest.status = TravelStatus.PENDING_L3;
      await this.travelRepository.save(travelRequest);

      await this.notificationService.sendNotification(
        nextApproverId,
        'URGENT: Escallated Travel Request',
        `Travel request "${travelRequest.title}" breached initial L2 SLA and is escalated to you.`,
        'push',
      );
    } else {
      // Escalate L1 to L2
      const escalationStage = this.stageRepository.create({
        requestId: travelRequest.id,
        approverId: secondaryManagerId,
        level: `${stage.level}_ESCALATED`,
        status: ApprovalStageStatus.PENDING,
      });
      await this.stageRepository.save(escalationStage);

      travelRequest.status = TravelStatus.PENDING_L2;
      await this.travelRepository.save(travelRequest);

      await this.notificationService.sendNotification(
        secondaryManagerId,
        'URGENT: Escalated Travel Request',
        `Travel request "${travelRequest.title}" from ${travelRequest.user.name} breached L1 SLA. Requires immediate approval.`,
        'push',
      );
    }

    return { escalated: true };
  }
}
