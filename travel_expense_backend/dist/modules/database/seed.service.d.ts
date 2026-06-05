import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { ApprovalWorkflowPolicy } from '../approvals/entities/workflow-policy.entity';
export declare class SeedService {
    private readonly userRepository;
    private readonly policyRepository;
    constructor(userRepository: Repository<User>, policyRepository: Repository<ApprovalWorkflowPolicy>);
    seed(): Promise<void>;
}
