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
exports.ReportingController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const reporting_service_1 = require("./reporting.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const user_entity_1 = require("../users/entities/user.entity");
let ReportingController = class ReportingController {
    reportingService;
    constructor(reportingService) {
        this.reportingService = reportingService;
    }
    async getDashboardMetrics() {
        return this.reportingService.getDashboardMetrics();
    }
    async exportCsvReport(res) {
        const csvContent = await this.reportingService.generateCsvExport();
        return res.status(200).send(csvContent);
    }
};
exports.ReportingController = ReportingController;
__decorate([
    (0, common_1.Get)('dashboard'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.FINANCE, user_entity_1.UserRole.COMPLIANCE, user_entity_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Retrieve strategic KPI dashboard summary metrics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Aggregate metrics returned successfully' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ReportingController.prototype, "getDashboardMetrics", null);
__decorate([
    (0, common_1.Get)('export'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.FINANCE, user_entity_1.UserRole.COMPLIANCE, user_entity_1.UserRole.ADMIN),
    (0, common_1.Header)('Content-Type', 'text/csv'),
    (0, common_1.Header)('Content-Disposition', 'attachment; filename="claims_report.csv"'),
    (0, swagger_1.ApiOperation)({ summary: 'Export full database expense claim report as a CSV file' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'CSV file compiled and streamed successfully' }),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ReportingController.prototype, "exportCsvReport", null);
exports.ReportingController = ReportingController = __decorate([
    (0, swagger_1.ApiTags)('Reporting & Analytics'),
    (0, common_1.Controller)('reporting'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [reporting_service_1.ReportingService])
], ReportingController);
//# sourceMappingURL=reporting.controller.js.map