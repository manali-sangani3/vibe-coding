import { ExpensesService } from './expenses.service';
import { StorageService } from '../storage/storage.service';
import { CreateExpenseClaimDto } from './dto/create-expense.dto';
export declare class ExpensesController {
    private readonly expensesService;
    private readonly storageService;
    constructor(expensesService: ExpensesService, storageService: StorageService);
    submitExpenseClaim(dto: CreateExpenseClaimDto, req: any): Promise<import("./entities/expense-claim.entity").ExpenseClaim>;
    getExpenseClaims(req: any): Promise<{
        success: boolean;
        data: import("./entities/expense-claim.entity").ExpenseClaim[];
    }>;
    getPendingExpenseApprovals(req: any): Promise<{
        success: boolean;
        data: import("./entities/expense-claim.entity").ExpenseClaim[];
    }>;
    getExpenseClaimById(id: string, req: any): Promise<{
        success: boolean;
        data: import("./entities/expense-claim.entity").ExpenseClaim;
    }>;
    managerApproveExpenseClaim(id: string, req: any): Promise<{
        success: boolean;
        data: import("./entities/expense-claim.entity").ExpenseClaim;
    }>;
    approveExpenseClaim(id: string, req: any): Promise<{
        success: boolean;
        data: import("./entities/expense-claim.entity").ExpenseClaim;
    }>;
    uploadReceipt(file: any): Promise<{
        success: boolean;
        receiptUrl: string;
    }>;
}
