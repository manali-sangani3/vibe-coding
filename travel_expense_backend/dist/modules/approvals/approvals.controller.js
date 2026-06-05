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
exports.ApprovalsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const approvals_service_1 = require("./approvals.service");
const reject_approval_dto_1 = require("./dto/reject-approval.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const user_entity_1 = require("../users/entities/user.entity");
let ApprovalsController = class ApprovalsController {
    approvalsService;
    constructor(approvalsService) {
        this.approvalsService = approvalsService;
    }
    async getPendingApprovals(req) {
        const data = await this.approvalsService.getPendingApprovals(req.user.id);
        return { success: true, data };
    }
    async approveStage(id, req) {
        const res = await this.approvalsService.approveStage(id, req.user.id);
        return { success: true, message: 'Stage approved successfully', data: res };
    }
    async rejectStage(id, dto, req) {
        const res = await this.approvalsService.rejectStage(id, req.user.id, dto.reason);
        return { success: true, message: 'Stage rejected successfully', data: res };
    }
};
exports.ApprovalsController = ApprovalsController;
__decorate([
    (0, common_1.Get)('pending'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.MANAGER, user_entity_1.UserRole.FINANCE, user_entity_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Get list of pending approvals for the current manager' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Queue returned successfully' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ApprovalsController.prototype, "getPendingApprovals", null);
__decorate([
    (0, common_1.Post)(':id/approve'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.MANAGER, user_entity_1.UserRole.FINANCE, user_entity_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Approve a travel request stage' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Stage approved and workflow advanced' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Self-approval block or unauthorized approver action' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ApprovalsController.prototype, "approveStage", null);
__decorate([
    (0, common_1.Post)(':id/reject'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.MANAGER, user_entity_1.UserRole.FINANCE, user_entity_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Reject a travel request stage (requires comments)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Stage rejected and workflow terminated' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Missing rejection reason or unauthorized action' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, reject_approval_dto_1.RejectApprovalDto, Object]),
    __metadata("design:returntype", Promise)
], ApprovalsController.prototype, "rejectStage", null);
exports.ApprovalsController = ApprovalsController = __decorate([
    (0, swagger_1.ApiTags)('Approvals'),
    (0, common_1.Controller)('approvals'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [approvals_service_1.ApprovalsService])
], ApprovalsController);
//# sourceMappingURL=approvals.controller.js.map