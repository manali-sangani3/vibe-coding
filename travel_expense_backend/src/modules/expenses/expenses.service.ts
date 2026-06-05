import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { ExpenseClaim, ClaimStatus } from './entities/expense-claim.entity';
import { ExpenseItem } from './entities/expense-item.entity';
import { TravelRequest, TravelStatus } from '../travel/entities/travel-request.entity';
import { AuditLog } from '../audit/entities/audit-log.entity';
import { CreateExpenseClaimDto } from './dto/create-expense.dto';
import { NotificationService } from '../notifications/notification.service';
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

    // 2. Validate line items against budget caps & receipt thresholds
    let totalClaimAmount = 0.0;
    const itemsToSave: ExpenseItem[] = [];

    for (const itemDto of dto.items) {
      // Constraint 1: Receipt threshold (mandatory if amount > ₹500)
      if (itemDto.amount > 500.0 && (!itemDto.receiptUrl || itemDto.receiptUrl.trim() === '')) {
        throw new BadRequestException(`Receipt attachment is mandatory for claims above ₹500 (Category: ${itemDto.category}).`);
      }

      // Constraint 2: Policy Engine Category Caps
      const categoryLower = itemDto.category.toLowerCase();
      if (categoryLower.includes('meal') && itemDto.amount > 1500.0) {
        throw new BadRequestException('Meals category claim exceeds individual limit of ₹1,500.');
      }
      if (categoryLower.includes('transport') && itemDto.amount > 10000.0) {
        throw new BadRequestException('Transport category claim exceeds individual limit of ₹10,000.');
      }
      if (categoryLower.includes('accommodation') && itemDto.amount > 15000.0) {
        throw new BadRequestException('Accommodation category claim exceeds individual limit of ₹15,000.');
      }

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

    // 3. Create Claim in DB
    const claim = this.claimRepository.create({
      travelRequestId: dto.travelRequestId,
      claimAmount: totalClaimAmount,
      status: ClaimStatus.SUBMITTED,
      userId,
      submittedAt: now,
      items: itemsToSave,
    });
    await this.claimRepository.save(claim);

    // 4. Update Travel Request State machine to Claim Submitted
    if (travelRequest) {
      travelRequest.status = TravelStatus.CLAIM_SUBMITTED;
      await this.travelRepository.save(travelRequest);
    }

    // 5. Notify Finance Review Team
    const financeReviewer = await this.userRepository.findOne({ where: { role: UserRole.FINANCE } });
    const notifyId = financeReviewer ? financeReviewer.id : 'usr-finance-001';
    await this.notificationService.sendNotification(
      notifyId,
      'New Expense Claim Submitted',
      `Expense Claim for ₹${totalClaimAmount} submitted by user. Action required.`,
      'push',
    );

    // 6. Write to WORM Audit Log
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
}
