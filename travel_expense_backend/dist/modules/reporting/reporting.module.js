"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportingModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const travel_request_entity_1 = require("../travel/entities/travel-request.entity");
const expense_claim_entity_1 = require("../expenses/entities/expense-claim.entity");
const reimbursement_entity_1 = require("../reimbursements/entities/reimbursement.entity");
const approval_stage_entity_1 = require("../approvals/entities/approval-stage.entity");
const reporting_service_1 = require("./reporting.service");
const reporting_controller_1 = require("./reporting.controller");
const auth_module_1 = require("../auth/auth.module");
let ReportingModule = class ReportingModule {
};
exports.ReportingModule = ReportingModule;
exports.ReportingModule = ReportingModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                travel_request_entity_1.TravelRequest,
                expense_claim_entity_1.ExpenseClaim,
                reimbursement_entity_1.Reimbursement,
                approval_stage_entity_1.ApprovalStage,
            ]),
            auth_module_1.AuthModule,
        ],
        controllers: [reporting_controller_1.ReportingController],
        providers: [reporting_service_1.ReportingService],
        exports: [reporting_service_1.ReportingService],
    })
], ReportingModule);
//# sourceMappingURL=reporting.module.js.map