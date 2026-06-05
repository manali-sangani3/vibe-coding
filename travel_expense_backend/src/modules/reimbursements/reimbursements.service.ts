import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reimbursement, ReimbursementStatus } from './entities/reimbursement.entity';
import { ExpenseClaim, ClaimStatus } from '../expenses/entities/expense-claim.entity';
import { TravelRequest, TravelStatus } from '../travel/entities/travel-request.entity';
import { AuditLog } from '../audit/entities/audit-log.entity';
import { NotificationService } from '../notifications/notification.service';

@Injectable()
export class ReimbursementsService {
  constructor(
    @InjectRepository(Reimbursement)
    private readonly reimbursementRepository: Repository<Reimbursement>,
    @InjectRepository(ExpenseClaim)
    private readonly claimRepository: Repository<ExpenseClaim>,
    @InjectRepository(TravelRequest)
    private readonly travelRepository: Repository<TravelRequest>,
    @InjectRepository(AuditLog)
    private readonly auditRepository: Repository<AuditLog>,
    private readonly notificationService: NotificationService,
  ) {}

  async getReimbursementHistory(userId: string) {
    return this.reimbursementRepository.find({
      where: { claim: { userId } },
      relations: { claim: true },
      order: { createdAt: 'DESC' },
    });
  }

  async processErpPayout(apiKey: string, claimId: string, paymentRef: string, status: string) {
    // Basic API Key security check for integration webhook
    if (apiKey !== 'erp-mock-key') {
      throw new UnauthorizedException('Invalid ERP integration secret key.');
    }

    const claim = await this.claimRepository.findOne({
      where: { id: claimId },
      relations: { travelRequest: true },
    });

    if (!claim) {
      throw new NotFoundException('Expense claim not found.');
    }

    let reimbursement = await this.reimbursementRepository.findOne({ where: { claimId } });
    if (!reimbursement) {
      reimbursement = this.reimbursementRepository.create({ claimId });
    }

    if (status === 'PAID') {
      reimbursement.status = ReimbursementStatus.PAID;
      reimbursement.paymentReference = paymentRef;
      reimbursement.paidAt = new Date();
      await this.reimbursementRepository.save(reimbursement);

      claim.status = ClaimStatus.REIMBURSED;
      await this.claimRepository.save(claim);

      if (claim.travelRequest) {
        claim.travelRequest.status = TravelStatus.REIMBURSED;
        await this.travelRepository.save(claim.travelRequest);
      }

      // Notify user
      await this.notificationService.sendNotification(
        claim.userId,
        'Reimbursement Paid',
        `Good news! Your expense claim for ₹${claim.claimAmount} has been paid (Ref: ${paymentRef}).`,
        'email',
      );

      // Write to WORM Audit Log
      const audit = this.auditRepository.create({
        action: 'CLAIM_REIMBURSED',
        entityName: 'ExpenseClaim',
        entityId: claimId,
        metadata: { paymentRef, amount: claim.claimAmount },
      });
      await this.auditRepository.save(audit);
    } else {
      reimbursement.status = ReimbursementStatus.FAILED;
      await this.reimbursementRepository.save(reimbursement);

      // Notify user
      await this.notificationService.sendNotification(
        claim.userId,
        'Reimbursement Payout Failed',
        `Payout failed for claim reference ID: ${claimId}. Contact Finance.`,
        'email',
      );
    }

    return reimbursement;
  }
}
