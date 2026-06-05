"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpensesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const platform_express_1 = require("@nestjs/platform-express");
const expenses_service_1 = require("./expenses.service");
const storage_service_1 = require("../storage/storage.service");
const create_expense_dto_1 = require("./dto/create-expense.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let ExpensesController = class ExpensesController {
    expensesService;
    storageService;
    constructor(expensesService, storageService) {
        this.expensesService = expensesService;
        this.storageService = storageService;
    }
    async submitExpenseClaim(dto, req) {
        return this.expensesService.submitExpenseClaim(req.user.id, dto);
    }
    async getExpenseClaims(req) {
        const list = await this.expensesService.getExpenseClaims(req.user.id);
        return { success: true, data: list };
    }
    async getExpenseClaimById(id, req) {
        const detail = await this.expensesService.getExpenseClaimById(req.user.id, id);
        return { success: true, data: detail };
    }
    async uploadReceipt(file) {
        if (!file) {
            throw new common_1.BadRequestException('No receipt file was supplied in request.');
        }
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'application/pdf'];
        if (!allowedMimeTypes.includes(file.mimetype)) {
            throw new common_1.BadRequestException('Receipt upload only supports PDF, PNG, and JPEG files.');
        }
        const maxSizeBytes = 10 * 1024 * 1024;
        if (file.size > maxSizeBytes) {
            throw new common_1.BadRequestException('Receipt file size must not exceed the 10MB limit.');
        }
        const receiptUrl = await this.storageService.uploadFile(file);
        return { success: true, receiptUrl };
    }
};
exports.ExpensesController = ExpensesController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Submit an itemized expense claim' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Expense claim submitted successfully and routed to Finance' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Validation fails (receipt requirement, limits exceeded, window expired)' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_expense_dto_1.CreateExpenseClaimDto, Object]),
    __metadata("design:returntype", Promise)
], ExpensesController.prototype, "submitExpenseClaim", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List submitted expense claims for the logged-in employee' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of claims returned successfully' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ExpensesController.prototype, "getExpenseClaims", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get details of a specific expense claim' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Expense claim details returned successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Claim not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ExpensesController.prototype, "getExpenseClaimById", null);
__decorate([
    (0, common_1.Post)('upload'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    }),
    (0, swagger_1.ApiOperation)({ summary: 'Upload a supporting receipt image or PDF file to MinIO S3' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'File uploaded successfully and receiptUrl returned' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'No file supplied or unsupported type' }),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ExpensesController.prototype, "uploadReceipt", null);
exports.ExpensesController = ExpensesController = __decorate([
    (0, swagger_1.ApiTags)('Expenses'),
    (0, common_1.Controller)('expenses'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [expenses_service_1.ExpensesService,
        storage_service_1.StorageService])
], ExpensesController);
//# sourceMappingURL=expenses.controller.js.map