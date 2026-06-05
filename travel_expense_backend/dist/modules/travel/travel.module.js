"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TravelModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const travel_request_entity_1 = require("./entities/travel-request.entity");
const user_entity_1 = require("../users/entities/user.entity");
const workflow_policy_entity_1 = require("../approvals/entities/workflow-policy.entity");
const approval_stage_entity_1 = require("../approvals/entities/approval-stage.entity");
const audit_log_entity_1 = require("../audit/entities/audit-log.entity");
const travel_service_1 = require("./travel.service");
const travel_controller_1 = require("./travel.controller");
const notification_module_1 = require("../notifications/notification.module");
const auth_module_1 = require("../auth/auth.module");
let TravelModule = class TravelModule {
};
exports.TravelModule = TravelModule;
exports.TravelModule = TravelModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                travel_request_entity_1.TravelRequest,
                user_entity_1.User,
                workflow_policy_entity_1.ApprovalWorkflowPolicy,
                approval_stage_entity_1.ApprovalStage,
                audit_log_entity_1.AuditLog,
            ]),
            notification_module_1.NotificationModule,
            auth_module_1.AuthModule,
        ],
        controllers: [travel_controller_1.TravelController],
        providers: [travel_service_1.TravelService],
        exports: [travel_service_1.TravelService],
    })
], TravelModule);
//# sourceMappingURL=travel.module.js.map