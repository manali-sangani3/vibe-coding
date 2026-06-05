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
exports.SeedService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../users/entities/user.entity");
const workflow_policy_entity_1 = require("../approvals/entities/workflow-policy.entity");
let SeedService = class SeedService {
    userRepository;
    policyRepository;
    constructor(userRepository, policyRepository) {
        this.userRepository = userRepository;
        this.policyRepository = policyRepository;
    }
    async seed() {
        await this.policyRepository.clear();
        await this.userRepository.clear();
        console.log('Seeding users...');
        const adminUser = this.userRepository.create({
            id: 'usr-admin-001',
            email: 'admin1@enterprise.com',
            name: 'Michael Scott',
            role: user_entity_1.UserRole.ADMIN,
            department: 'Operations',
            avatarUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=MichaelScott',
        });
        await this.userRepository.save(adminUser);
        const complianceUser = this.userRepository.create({
            id: 'usr-compliance-001',
            email: 'comp1@enterprise.com',
            name: 'Angela Martin',
            role: user_entity_1.UserRole.COMPLIANCE,
            department: 'Legal & Compliance',
            avatarUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=AngelaMartin',
        });
        await this.userRepository.save(complianceUser);
        const financeUser = this.userRepository.create({
            id: 'usr-finance-001',
            email: 'fin1@enterprise.com',
            name: 'Robert Vance',
            role: user_entity_1.UserRole.FINANCE,
            department: 'Finance & Accounts',
            avatarUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=RobertVance',
        });
        await this.userRepository.save(financeUser);
        const l2Manager = this.userRepository.create({
            id: 'usr-manager-l2-001',
            email: 'dept1@enterprise.com',
            name: 'Oscar Martinez',
            role: user_entity_1.UserRole.MANAGER,
            department: 'Engineering',
            avatarUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=OscarMartinez',
        });
        await this.userRepository.save(l2Manager);
        const l1Manager = this.userRepository.create({
            id: 'usr-manager-l1-001',
            email: 'mgr1@enterprise.com',
            name: 'Jane Smith',
            role: user_entity_1.UserRole.MANAGER,
            department: 'Engineering',
            managerId: l2Manager.id,
            avatarUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=JaneSmith',
        });
        await this.userRepository.save(l1Manager);
        const employeeUser = this.userRepository.create({
            id: 'usr-employee-001',
            email: 'emp1@enterprise.com',
            name: 'John Doe',
            role: user_entity_1.UserRole.EMPLOYEE,
            department: 'Engineering',
            managerId: l1Manager.id,
            avatarUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=JohnDoe',
        });
        await this.userRepository.save(employeeUser);
        console.log('Seeding workflow policies...');
        const policy1 = this.policyRepository.create({
            department: 'Engineering',
            minBudget: 0.0,
            maxBudget: 50000.0,
            requiredLevels: ['L1_MANAGER', 'L3_FINANCE'],
        });
        const policy2 = this.policyRepository.create({
            department: 'Engineering',
            minBudget: 50000.01,
            maxBudget: 9999999.0,
            requiredLevels: ['L1_MANAGER', 'L2_DEPT_HEAD', 'L3_FINANCE'],
        });
        const policyFallback = this.policyRepository.create({
            department: '*',
            minBudget: 0.0,
            maxBudget: 9999999.0,
            requiredLevels: ['L1_MANAGER', 'L3_FINANCE'],
        });
        await this.policyRepository.save([policy1, policy2, policyFallback]);
        console.log('Database seeding successfully finished!');
    }
};
exports.SeedService = SeedService;
exports.SeedService = SeedService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(workflow_policy_entity_1.ApprovalWorkflowPolicy)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], SeedService);
//# sourceMappingURL=seed.service.js.map