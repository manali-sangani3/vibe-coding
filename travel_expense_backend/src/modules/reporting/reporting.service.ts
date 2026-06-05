import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TravelRequest, TravelStatus } from '../travel/entities/travel-request.entity';
import { ExpenseClaim, ClaimStatus } from '../expenses/entities/expense-claim.entity';
import { Reimbursement, ReimbursementStatus } from '../reimbursements/entities/reimbursement.entity';
import { ApprovalStage, ApprovalStageStatus } from '../approvals/entities/approval-stage.entity';

@Injectable()
export class ReportingService {
  constructor(
    @InjectRepository(TravelRequest)
    private readonly travelRepository: Repository<TravelRequest>,
    @InjectRepository(ExpenseClaim)
    private readonly claimRepository: Repository<ExpenseClaim>,
    @InjectRepository(Reimbursement)
    private readonly reimbursementRepository: Repository<Reimbursement>,
    @InjectRepository(ApprovalStage)
    private readonly stageRepository: Repository<ApprovalStage>,
  ) {}

  async getDashboardMetrics() {
    // 1. Calculate Average approval turnaround duration
    const approvedRequests = await this.travelRepository.find({
      where: { status: TravelStatus.APPROVED },
    });
    let totalApprovalTimeMs = 0;
    approvedRequests.forEach((req) => {
      // Approximate approval duration
      const duration = req.startDate.getTime() - req.createdAt.getTime();
      totalApprovalTimeMs += Math.max(0, duration);
    });
    const avgApprovalTimeDays = approvedRequests.length > 0 
      ? (totalApprovalTimeMs / (1000 * 60 * 60 * 24)) / approvedRequests.length 
      : 0;

    // 2. First-Level Approval SLA compliance rate (Target: >=95%)
    const l1Stages = await this.stageRepository.find({ where: { level: 'L1_MANAGER' } });
    const compliantL1 = l1Stages.filter((s) => s.status !== ApprovalStageStatus.ESCALATED);
    const l1SlaComplianceRate = l1Stages.length > 0
      ? (compliantL1.length / l1Stages.length) * 100
      : 100.0;

    // 3. Average Reimbursement Time (Target: <3 days)
    const paidReimbursements = await this.reimbursementRepository.find({
      where: { status: ReimbursementStatus.PAID },
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

    // 4. Policy Compliance Rate (Target: >=98%)
    const totalClaims = await this.claimRepository.count();
    const rejectedClaims = await this.claimRepository.count({ where: { status: ClaimStatus.REJECTED } });
    const policyComplianceRate = totalClaims > 0
      ? ((totalClaims - rejectedClaims) / totalClaims) * 100
      : 100.0;

    // 5. Total Spend & Savings
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

  async generateCsvExport(): Promise<string> {
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
}
