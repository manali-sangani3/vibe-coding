import { Controller, Get, Post, Body, Headers, Req, UseGuards, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiHeader, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { ReimbursementsService } from './reimbursements.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { IsNotEmpty, IsString } from 'class-validator';

class PayoutCallbackDto {
  @IsString()
  @IsNotEmpty()
  claimId: string;

  @IsString()
  @IsNotEmpty()
  paymentRef: string;

  @IsString()
  @IsNotEmpty()
  status: 'PAID' | 'FAILED';
}

@ApiTags('Reimbursements')
@Controller()
export class ReimbursementsController {
  constructor(private readonly reimbursementsService: ReimbursementsService) {}

  @Get('reimbursements')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get reimbursement payout history for logged-in user' })
  @ApiResponse({ status: 200, description: 'History returned successfully' })
  async getReimbursementHistory(@Req() req: any) {
    const list = await this.reimbursementsService.getReimbursementHistory(req.user.id);
    return { success: true, data: list };
  }

  @Get('reimbursements/pending')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all approved claims waiting for payout (Finance only)' })
  async getPendingReimbursements() {
    const list = await this.reimbursementsService.getPendingReimbursements();
    return { success: true, data: list };
  }

  @Post('reimbursements/:claimId/pay')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Manually mark an approved claim as paid (Finance only)' })
  async markAsPaid(
    @Req() req: any,
    @Param('claimId') claimId: string,
    @Body('paymentRef') paymentRef: string,
  ) {
    // In a real app, verify req.user.role === UserRole.FINANCE
    const result = await this.reimbursementsService.markAsPaid(claimId, paymentRef || `MANUAL-${Date.now()}`);
    return { success: true, data: result };
  }

  @Post('integrations/erp/payout-callback')
  @HttpCode(HttpStatus.OK)
  @ApiHeader({ name: 'x-api-key', description: 'ERP Callback Authentication Key' })
  @ApiOperation({ summary: 'ERP payout status callback webhook' })
  @ApiResponse({ status: 200, description: 'ERP webhook updates processed successfully' })
  @ApiResponse({ status: 401, description: 'Invalid integration API Key' })
  async processErpPayout(
    @Headers('x-api-key') apiKey: string,
    @Body() dto: PayoutCallbackDto,
  ) {
    return this.reimbursementsService.processErpPayout(
      apiKey,
      dto.claimId,
      dto.paymentRef,
      dto.status,
    );
  }
}
