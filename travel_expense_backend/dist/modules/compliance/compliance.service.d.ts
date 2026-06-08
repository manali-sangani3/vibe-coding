export declare class ComplianceService {
    private readonly rules;
    validateExpenseItem(role: string, category: string, amount: number, hasReceipt: boolean): void;
    validateTravelRequest(role: string, estimatedCost: number): void;
}
