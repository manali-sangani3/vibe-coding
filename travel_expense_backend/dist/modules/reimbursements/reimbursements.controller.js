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
exports.ReimbursementsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const reimbursements_service_1 = require("./reimbursements.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const class_validator_1 = require("class-validator");
class PayoutCallbackDto {
    claimId;
    paymentRef;
    status;
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], PayoutCallbackDto.prototype, "claimId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], PayoutCallbackDto.prototype, "paymentRef", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], PayoutCallbackDto.prototype, "status", void 0);
let ReimbursementsController = class ReimbursementsController {
    reimbursementsService;
    constructor(reimbursementsService) {
        this.reimbursementsService = reimbursementsService;
    }
    async getReimbursementHistory(req) {
        const list = await this.reimbursementsService.getReimbursementHistory(req.user.id);
        return { success: true, data: list };
    }
    async processErpPayout(apiKey, dto) {
        return this.reimbursementsService.processErpPayout(apiKey, dto.claimId, dto.paymentRef, dto.status);
    }
};
exports.ReimbursementsController = ReimbursementsController;
__decorate([
    (0, common_1.Get)('reimbursements'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get reimbursement payout history for logged-in user' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'History returned successfully' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ReimbursementsController.prototype, "getReimbursementHistory", null);
__decorate([
    (0, common_1.Post)('integrations/erp/payout-callback'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiHeader)({ name: 'x-api-key', description: 'ERP Callback Authentication Key' }),
    (0, swagger_1.ApiOperation)({ summary: 'ERP payout status callback webhook' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'ERP webhook updates processed successfully' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Invalid integration API Key' }),
    __param(0, (0, common_1.Headers)('x-api-key')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, PayoutCallbackDto]),
    __metadata("design:returntype", Promise)
], ReimbursementsController.prototype, "processErpPayout", null);
exports.ReimbursementsController = ReimbursementsController = __decorate([
    (0, swagger_1.ApiTags)('Reimbursements'),
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [reimbursements_service_1.ReimbursementsService])
], ReimbursementsController);
//# sourceMappingURL=reimbursements.controller.js.map