"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApprovalsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const bullmq_1 = require("@nestjs/bullmq");
const approval_stage_entity_1 = require("./entities/approval-stage.entity");
const travel_request_entity_1 = require("../travel/entities/travel-request.entity");
const user_entity_1 = require("../users/entities/user.entity");
const audit_log_entity_1 = require("../audit/entities/audit-log.entity");
const approvals_service_1 = require("./approvals.service");
const sla_processor_1 = require("./sla.processor");
const approvals_controller_1 = require("./approvals.controller");
const notification_module_1 = require("../notifications/notification.module");
const auth_module_1 = require("../auth/auth.module");
const isOffline = process.env.OFFLINE_MODE === 'true';
const moduleImports = [
    typeorm_1.TypeOrmModule.forFeature([
        approval_stage_entity_1.ApprovalStage,
        travel_request_entity_1.TravelRequest,
        user_entity_1.User,
        audit_log_entity_1.AuditLog,
    ]),
    notification_module_1.NotificationModule,
    auth_module_1.AuthModule,
];
if (!isOffline) {
    moduleImports.push(bullmq_1.BullModule.registerQueue({
        name: 'sla-queue',
    }));
}
const moduleProviders = [approvals_service_1.ApprovalsService];
if (!isOffline) {
    moduleProviders.push(sla_processor_1.SlaProcessor);
}
let ApprovalsModule = class ApprovalsModule {
};
exports.ApprovalsModule = ApprovalsModule;
exports.ApprovalsModule = ApprovalsModule = __decorate([
    (0, common_1.Module)({
        imports: moduleImports,
        controllers: [approvals_controller_1.ApprovalsController],
        providers: moduleProviders,
        exports: [approvals_service_1.ApprovalsService, typeorm_1.TypeOrmModule],
    })
], ApprovalsModule);
//# sourceMappingURL=approvals.module.js.map