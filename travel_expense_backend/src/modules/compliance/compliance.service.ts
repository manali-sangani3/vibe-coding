import { Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ComplianceService {
  // Hardcoded rules for MVP. In a real system, these would be in a DB.
  private readonly rules = {
    employee: {
      maxExpenseAmount: 1000,
      requiresReceiptAbove: 500,
      blockedCategories: [],
    },
    manager: {
      maxExpenseAmount: 5000,
      requiresReceiptAbove: 1000,
      blockedCategories: [],
    },
    finance: {
      maxExpenseAmount: 10000,
      requiresReceiptAbove: 1000,
      blockedCategories: [],
    },
    admin: {
      maxExpenseAmount: 99999,
      requiresReceiptAbove: 5000,
      blockedCategories: [],
    },
  };

  validateExpenseItem(
    role: string,
    category: string,
    amount: number,
    hasReceipt: boolean,
  ): void {
    const userRole = role.toLowerCase();
    const policy = this.rules[userRole] || this.rules['employee'];

    if (amount > policy.maxExpenseAmount) {
      throw new BadRequestException(
        `Policy violation: ${category} amount (${amount}) exceeds the maximum allowed limit for role ${role} (${policy.maxExpenseAmount}).`,
      );
    }

    if (amount > policy.requiresReceiptAbove && !hasReceipt) {
      throw new BadRequestException(
        `Policy violation: Receipt is required for ${category} expenses above ${policy.requiresReceiptAbove}.`,
      );
    }

    if (policy.blockedCategories.includes(category)) {
      throw new BadRequestException(
        `Policy violation: The category '${category}' is blocked for your role.`,
      );
    }
  }

  validateTravelRequest(
    role: string,
    estimatedCost: number,
  ): void {
    const userRole = role.toLowerCase();
    const policy = this.rules[userRole] || this.rules['employee'];
    
    // Using a simple multiplier for travel requests (e.g., 5x of expense limit)
    const travelLimit = policy.maxExpenseAmount * 5;

    if (estimatedCost > travelLimit) {
      throw new BadRequestException(
        `Policy violation: Estimated cost (${estimatedCost}) exceeds the maximum allowed travel budget for role ${role} (${travelLimit}).`,
      );
    }
  }
}
