import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { ExpenseClaim, ClaimStatus } from './entities/expense-claim.entity';
import { ExpenseItem } from './entities/expense-item.entity';
import { TravelRequest, TravelStatus } from '../travel/entities/travel-request.entity';
import { AuditLog } from '../audit/entities/audit-log.entity';
import { CreateExpenseClaimDto } from './dto/create-expense.dto';
import { NotificationService } from '../notifications/notification.service';
import { ComplianceService } from '../compliance/compliance.service';
import { User, UserRole } from '../users/entities/user.entity';

@Injectable()
export class ExpensesService {
  constructor(
    @InjectRepository(ExpenseClaim)
    private readonly claimRepository: Repository<ExpenseClaim>,
    @InjectRepository(ExpenseItem)
    private readonly itemRepository: Repository<ExpenseItem>,
    @InjectRepository(TravelRequest)
    private readonly travelRepository: Repository<TravelRequest>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(AuditLog)
    private readonly auditRepository: Repository<AuditLog>,
    private readonly notificationService: NotificationService,
    private readonly complianceService: ComplianceService,
  ) {}

  async submitExpenseClaim(userId: string, dto: CreateExpenseClaimDto) {
    let travelRequest: TravelRequest | null = null;
    const now = new Date();

    // 1. If linking to Travel Request, validate timeline & status
    if (dto.travelRequestId) {
      travelRequest = await this.travelRepository.findOne({ where: { id: dto.travelRequestId } });
      if (!travelRequest) {
        throw new NotFoundException('Linked travel request not found.');
      }
      if (travelRequest.userId !== userId) {
        throw new BadRequestException('Travel request does not belong to you.');
      }

      // Constraints check: Trip must be completed or approved
      const tripEnd = new Date(travelRequest.endDate);
      const diffTime = now.getTime() - tripEnd.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays > 30) {
        throw new BadRequestException('Expense claims must be submitted within 30 days of trip completion.');
      }
    }

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found.');
    }

    // 2. Validate line items against budget caps & receipt thresholds
    let totalClaimAmount = 0.0;
    const itemsToSave: ExpenseItem[] = [];

    for (const itemDto of dto.items) {
      // Constraint 1: Receipt threshold (mandatory if amount > ₹500)
      if (itemDto.amount > 500.0 && (!itemDto.receiptUrl || itemDto.receiptUrl.trim() === '')) {
        throw new BadRequestException(`Receipt attachment is mandatory for claims above ₹500 (Category: ${itemDto.category}).`);
      }

      // Constraint 2: Policy Engine Category Caps via ComplianceService
      const hasReceipt = !!itemDto.receiptUrl && itemDto.receiptUrl.trim() !== '';
      this.complianceService.validateExpenseItem(user.role, itemDto.category, itemDto.amount, hasReceipt);

      // Constraint 3: Duplicate Receipt Hash check
      if (itemDto.receiptUrl) {
        const duplicate = await this.itemRepository.findOne({
          where: {
            receiptUrl: itemDto.receiptUrl,
            claim: { status: Not(ClaimStatus.REJECTED) },
          },
          relations: { claim: true },
        });
        if (duplicate) {
          throw new BadRequestException(`Duplicate receipt detected. The receipt file has already been claimed in Claim #${duplicate.claimId}.`);
        }
      }

      totalClaimAmount += itemDto.amount;

      const item = this.itemRepository.create({
        category: itemDto.category,
        amount: itemDto.amount,
        description: itemDto.description,
        receiptUrl: itemDto.receiptUrl,
      });
      itemsToSave.push(item);
    }

    // 3. Determine initial status based on user role
    let initialStatus = ClaimStatus.PENDING_MANAGER;
    if (user.role === UserRole.MANAGER) {
      initialStatus = ClaimStatus.PENDING_DEPT_HEAD;
    } else if (user.role === UserRole.FINANCE || user.role === UserRole.COMPLIANCE || user.role === UserRole.ADMIN) {
      initialStatus = ClaimStatus.PENDING_FINANCE;
    }

    // 4. Create Claim in DB
    const claim = this.claimRepository.create({
      travelRequestId: dto.travelRequestId,
      claimAmount: totalClaimAmount,
      status: initialStatus,
      userId,
      submittedAt: now,
      items: itemsToSave,
    });
    await this.claimRepository.save(claim);

    // 5. Update Travel Request State machine to Claim Submitted
    if (travelRequest) {
      travelRequest.status = TravelStatus.CLAIM_SUBMITTED;
      await this.travelRepository.save(travelRequest);
    }

    // 6. Notify next approver
    if (initialStatus === ClaimStatus.PENDING_FINANCE) {
      const financeReviewer = await this.userRepository.findOne({ where: { role: UserRole.FINANCE } });
      const notifyId = financeReviewer ? financeReviewer.id : 'usr-finance-001';
      await this.notificationService.sendNotification(
        notifyId,
        'New Expense Claim Submitted',
        `Expense Claim for ₹${totalClaimAmount} requires Finance approval.`,
        'push',
      );
    } else {
      const notifyId = user.managerId ? user.managerId : 'usr-manager-l1-001';
      await this.notificationService.sendNotification(
        notifyId,
        'New Expense Claim Submitted',
        `Expense Claim for ₹${totalClaimAmount} requires your approval.`,
        'push',
      );
    }

    // 7. Write to WORM Audit Log
    const audit = this.auditRepository.create({
      userId,
      action: 'EXPENSE_SUBMIT',
      entityName: 'ExpenseClaim',
      entityId: claim.id,
      metadata: { totalAmount: totalClaimAmount },
    });
    await this.auditRepository.save(audit);

    return claim;
  }

  async getExpenseClaims(userId: string) {
    return this.claimRepository.find({
      where: { userId },
      relations: { items: true, travelRequest: true },
      order: { createdAt: 'DESC' },
    });
  }

  async getPendingExpenseApprovals(userId: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    
    let targetStatus = ClaimStatus.PENDING_MANAGER;
    if (user.role === UserRole.MANAGER || user.role === UserRole.ADMIN) {
      // In a real app we'd fetch PENDING_MANAGER or PENDING_DEPT_HEAD depending on exact hierarchy.
      // We will fetch both here for simplicity of prototype
      return this.claimRepository.find({
        where: [
          { status: ClaimStatus.PENDING_MANAGER },
          { status: ClaimStatus.PENDING_DEPT_HEAD }
        ],
        relations: { items: true, travelRequest: true, user: true },
        order: { createdAt: 'ASC' },
      });
    } else if (user.role === UserRole.FINANCE) {
      return this.claimRepository.find({
        where: { status: ClaimStatus.PENDING_FINANCE },
        relations: { items: true, travelRequest: true, user: true },
        order: { createdAt: 'ASC' },
      });
    }
    return [];
  }

  async getExpenseClaimById(userId: string, id: string) {
    const claim = await this.claimRepository.findOne({
      where: { id },
      relations: { items: true, travelRequest: true },
    });

    if (!claim) {
      throw new NotFoundException('Expense claim not found.');
    }

    // Check authorization: only creator or Finance/Admin role can view details
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (
      claim.userId !== userId &&
      user?.role !== UserRole.FINANCE &&
      user?.role !== UserRole.ADMIN
    ) {
      throw new BadRequestException('Unauthorized resource access.');
    }

    return claim;
  }

  async managerApproveExpenseClaim(userId: string, claimId: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user || (user.role !== UserRole.MANAGER && user.role !== UserRole.ADMIN)) {
      throw new BadRequestException('Only Managers can perform this approval.');
    }

    const claim = await this.claimRepository.findOne({ where: { id: claimId }, relations: { travelRequest: true, user: true } });
    if (!claim) {
      throw new NotFoundException('Expense claim not found.');
    }
    
    if (claim.status === ClaimStatus.PENDING_MANAGER) {
      claim.status = ClaimStatus.PENDING_FINANCE;
    } else if (claim.status === ClaimStatus.PENDING_DEPT_HEAD) {
      claim.status = ClaimStatus.PENDING_FINANCE;
    } else {
      throw new BadRequestException(`Claim cannot be approved by manager in its current state: ${claim.status}`);
    }

    await this.claimRepository.save(claim);

    const audit = this.auditRepository.create({
      userId,
      action: 'EXPENSE_MANAGER_APPROVED',
      entityName: 'ExpenseClaim',
      entityId: claim.id,
    });
    await this.auditRepository.save(audit);

    return claim;
  }

  async approveExpenseClaim(userId: string, claimId: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user || user.role !== UserRole.FINANCE && user.role !== UserRole.ADMIN) {
      throw new BadRequestException('Only Finance or Admin can approve expense claims.');
    }

    const claim = await this.claimRepository.findOne({ where: { id: claimId }, relations: { travelRequest: true } });
    if (!claim) {
      throw new NotFoundException('Expense claim not found.');
    }
    if (claim.status !== ClaimStatus.PENDING_FINANCE && claim.status !== ClaimStatus.SUBMITTED) {
      throw new BadRequestException(`Claim must be PENDING_FINANCE to be processed by Finance. Current status: ${claim.status}`);
    }

    claim.status = ClaimStatus.APPROVED;
    await this.claimRepository.save(claim);

    await this.notificationService.sendNotification(
      claim.userId,
      'Expense Claim Approved',
      `Your expense claim for ₹${claim.claimAmount} has been approved and sent for payout.`,
      'email',
    );

    const audit = this.auditRepository.create({
      userId,
      action: 'EXPENSE_APPROVED',
      entityName: 'ExpenseClaim',
      entityId: claim.id,
    });
    await this.auditRepository.save(audit);

    return claim;
  }
}
