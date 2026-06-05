import { Controller, Get, Post, Body, Param, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ApprovalsService } from './approvals.service';
import { RejectApprovalDto } from './dto/reject-approval.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@ApiTags('Approvals')
@Controller('approvals')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ApprovalsController {
  constructor(private readonly approvalsService: ApprovalsService) {}

  @Get('pending')
  @Roles(UserRole.MANAGER, UserRole.FINANCE, UserRole.ADMIN)
  @ApiOperation({ summary: 'Get list of pending approvals for the current manager' })
  @ApiResponse({ status: 200, description: 'Queue returned successfully' })
  async getPendingApprovals(@Req() req: any) {
    const data = await this.approvalsService.getPendingApprovals(req.user.id);
    return { success: true, data };
  }

  @Post(':id/approve')
  @Roles(UserRole.MANAGER, UserRole.FINANCE, UserRole.ADMIN)
  @ApiOperation({ summary: 'Approve a travel request stage' })
  @ApiResponse({ status: 200, description: 'Stage approved and workflow advanced' })
  @ApiResponse({ status: 400, description: 'Self-approval block or unauthorized approver action' })
  async approveStage(@Param('id') id: string, @Req() req: any) {
    const res = await this.approvalsService.approveStage(id, req.user.id);
    return { success: true, message: 'Stage approved successfully', data: res };
  }

  @Post(':id/reject')
  @Roles(UserRole.MANAGER, UserRole.FINANCE, UserRole.ADMIN)
  @ApiOperation({ summary: 'Reject a travel request stage (requires comments)' })
  @ApiResponse({ status: 200, description: 'Stage rejected and workflow terminated' })
  @ApiResponse({ status: 400, description: 'Missing rejection reason or unauthorized action' })
  async rejectStage(@Param('id') id: string, @Body() dto: RejectApprovalDto, @Req() req: any) {
    const res = await this.approvalsService.rejectStage(id, req.user.id, dto.reason);
    return { success: true, message: 'Stage rejected successfully', data: res };
  }
}
