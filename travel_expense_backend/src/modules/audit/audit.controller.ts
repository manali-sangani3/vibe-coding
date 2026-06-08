import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuditService } from './audit.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@ApiTags('Audit Trail')
@Controller('audit')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get()
  @Roles(UserRole.COMPLIANCE, UserRole.ADMIN, UserRole.FINANCE)
  @ApiOperation({ summary: 'Get immutable audit logs trail (Compliance / Admin / Finance only)' })
  @ApiResponse({ status: 200, description: 'Audit trail returned successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden access block' })
  async getAuditLogs() {
    const list = await this.auditService.getLogs();
    return { success: true, data: list };
  }
}
