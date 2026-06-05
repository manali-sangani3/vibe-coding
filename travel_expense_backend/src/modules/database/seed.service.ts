import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../users/entities/user.entity';
import { ApprovalWorkflowPolicy } from '../approvals/entities/workflow-policy.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(ApprovalWorkflowPolicy)
    private readonly policyRepository: Repository<ApprovalWorkflowPolicy>,
  ) {}

  async seed() {
    // 1. Clear existing database tables
    await this.policyRepository.clear();
    await this.userRepository.clear();

    // 2. Create Users
    console.log('Seeding users...');
    
    // Seed Admin
    const adminUser = this.userRepository.create({
      id: 'usr-admin-001',
      email: 'admin1@enterprise.com',
      name: 'Michael Scott',
      role: UserRole.ADMIN,
      department: 'Operations',
      avatarUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=MichaelScott',
    });
    await this.userRepository.save(adminUser);

    // Seed Compliance
    const complianceUser = this.userRepository.create({
      id: 'usr-compliance-001',
      email: 'comp1@enterprise.com',
      name: 'Angela Martin',
      role: UserRole.COMPLIANCE,
      department: 'Legal & Compliance',
      avatarUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=AngelaMartin',
    });
    await this.userRepository.save(complianceUser);

    // Seed Finance Reviewer
    const financeUser = this.userRepository.create({
      id: 'usr-finance-001',
      email: 'fin1@enterprise.com',
      name: 'Robert Vance',
      role: UserRole.FINANCE,
      department: 'Finance & Accounts',
      avatarUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=RobertVance',
    });
    await this.userRepository.save(financeUser);

    // Seed L2 Department Head
    const l2Manager = this.userRepository.create({
      id: 'usr-manager-l2-001',
      email: 'dept1@enterprise.com',
      name: 'Oscar Martinez',
      role: UserRole.MANAGER,
      department: 'Engineering',
      avatarUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=OscarMartinez',
    });
    await this.userRepository.save(l2Manager);

    // Seed L1 Manager
    const l1Manager = this.userRepository.create({
      id: 'usr-manager-l1-001',
      email: 'mgr1@enterprise.com',
      name: 'Jane Smith',
      role: UserRole.MANAGER,
      department: 'Engineering',
      managerId: l2Manager.id,
      avatarUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=JaneSmith',
    });
    await this.userRepository.save(l1Manager);

    // Seed Standard Employee
    const employeeUser = this.userRepository.create({
      id: 'usr-employee-001',
      email: 'emp1@enterprise.com',
      name: 'John Doe',
      role: UserRole.EMPLOYEE,
      department: 'Engineering',
      managerId: l1Manager.id,
      avatarUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=JohnDoe',
    });
    await this.userRepository.save(employeeUser);

    console.log('Seeding workflow policies...');
    // 3. Create Approval Workflow Policies
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
}
