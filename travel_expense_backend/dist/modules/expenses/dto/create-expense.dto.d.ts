export declare class CreateExpenseItemDto {
    category: string;
    amount: number;
    description: string;
    receiptUrl?: string;
}
export declare class CreateExpenseClaimDto {
    travelRequestId?: string;
    items: CreateExpenseItemDto[];
}
