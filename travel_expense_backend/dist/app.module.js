"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const user_entity_1 = require("./modules/users/entities/user.entity");
const session_entity_1 = require("./modules/auth/entities/session.entity");
const travel_request_entity_1 = require("./modules/travel/entities/travel-request.entity");
const workflow_policy_entity_1 = require("./modules/approvals/entities/workflow-policy.entity");
const approval_stage_entity_1 = require("./modules/approvals/entities/approval-stage.entity");
const expense_claim_entity_1 = require("./modules/expenses/entities/expense-claim.entity");
const expense_item_entity_1 = require("./modules/expenses/entities/expense-item.entity");
const reimbursement_entity_1 = require("./modules/reimbursements/entities/reimbursement.entity");
const notification_entity_1 = require("./modules/notifications/entities/notification.entity");
const audit_log_entity_1 = require("./modules/audit/entities/audit-log.entity");
const seed_service_1 = require("./modules/database/seed.service");
const auth_module_1 = require("./modules/auth/auth.module");
const storage_module_1 = require("./modules/storage/storage.module");
const notification_module_1 = require("./modules/notifications/notification.module");
const travel_module_1 = require("./modules/travel/travel.module");
const approvals_module_1 = require("./modules/approvals/approvals.module");
const expenses_module_1 = require("./modules/expenses/expenses.module");
const reimbursements_module_1 = require("./modules/reimbursements/reimbursements.module");
const audit_module_1 = require("./modules/audit/audit.module");
const reporting_module_1 = require("./modules/reporting/reporting.module");
const bullmq_1 = require("@nestjs/bullmq");
const isOffline = process.env.OFFLINE_MODE === 'true';
const moduleImports = [
    config_1.ConfigModule.forRoot({
        isGlobal: true,
    }),
    auth_module_1.AuthModule,
    storage_module_1.StorageModule,
    notification_module_1.NotificationModule,
    travel_module_1.TravelModule,
    approvals_module_1.ApprovalsModule,
    expenses_module_1.ExpensesModule,
    reimbursements_module_1.ReimbursementsModule,
    audit_module_1.AuditModule,
    reporting_module_1.ReportingModule,
    typeorm_1.TypeOrmModule.forRoot(isOffline
        ? {
            type: 'better-sqlite3',
            database: 'db.sqlite',
            entities: [
                user_entity_1.User,
                session_entity_1.UserSession,
                travel_request_entity_1.TravelRequest,
                workflow_policy_entity_1.ApprovalWorkflowPolicy,
                approval_stage_entity_1.ApprovalStage,
                expense_claim_entity_1.ExpenseClaim,
                expense_item_entity_1.ExpenseItem,
                reimbursement_entity_1.Reimbursement,
                notification_entity_1.Notification,
                audit_log_entity_1.AuditLog,
            ],
            synchronize: true,
        }
        : {
            type: 'postgres',
            host: process.env.DB_HOST || 'localhost',
            port: parseInt(process.env.DB_PORT || '5432', 10),
            username: process.env.DB_USERNAME || 'postgres',
            password: process.env.DB_PASSWORD || 'postgres',
            database: process.env.DB_DATABASE || 'travelexpense',
            entities: [
                user_entity_1.User,
                session_entity_1.UserSession,
                travel_request_entity_1.TravelRequest,
                workflow_policy_entity_1.ApprovalWorkflowPolicy,
                approval_stage_entity_1.ApprovalStage,
                expense_claim_entity_1.ExpenseClaim,
                expense_item_entity_1.ExpenseItem,
                reimbursement_entity_1.Reimbursement,
                notification_entity_1.Notification,
                audit_log_entity_1.AuditLog,
            ],
            synchronize: true,
        }),
    typeorm_1.TypeOrmModule.forFeature([user_entity_1.User, workflow_policy_entity_1.ApprovalWorkflowPolicy]),
];
if (!isOffline) {
    moduleImports.push(bullmq_1.BullModule.forRoot({
        connection: {
            host: process.env.REDIS_HOST || 'localhost',
            port: parseInt(process.env.REDIS_PORT || '6379', 10),
        },
    }));
}
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: moduleImports,
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService, seed_service_1.SeedService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map