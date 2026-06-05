"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReimbursementsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const reimbursement_entity_1 = require("./entities/reimbursement.entity");
const expense_claim_entity_1 = require("../expenses/entities/expense-claim.entity");
const travel_request_entity_1 = require("../travel/entities/travel-request.entity");
const user_entity_1 = require("../users/entities/user.entity");
const audit_log_entity_1 = require("../audit/entities/audit-log.entity");
const reimbursements_service_1 = require("./reimbursements.service");
const reimbursements_controller_1 = require("./reimbursements.controller");
const notification_module_1 = require("../notifications/notification.module");
const auth_module_1 = require("../auth/auth.module");
let ReimbursementsModule = class ReimbursementsModule {
};
exports.ReimbursementsModule = ReimbursementsModule;
exports.ReimbursementsModule = ReimbursementsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                reimbursement_entity_1.Reimbursement,
                expense_claim_entity_1.ExpenseClaim,
                travel_request_entity_1.TravelRequest,
                user_entity_1.User,
                audit_log_entity_1.AuditLog,
            ]),
            notification_module_1.NotificationModule,
            auth_module_1.AuthModule,
        ],
        controllers: [reimbursements_controller_1.ReimbursementsController],
        providers: [reimbursements_service_1.ReimbursementsService],
        exports: [reimbursements_service_1.ReimbursementsService],
    })
], ReimbursementsModule);
//# sourceMappingURL=reimbursements.module.js.map