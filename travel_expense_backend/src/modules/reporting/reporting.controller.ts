import { Controller, Get, Header, Res, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Response } from 'express';
import { ReportingService } from './reporting.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@ApiTags('Reporting & Analytics')
@Controller('reporting')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ReportingController {
  constructor(private readonly reportingService: ReportingService) {}

  @Get('dashboard')
  @Roles(UserRole.FINANCE, UserRole.COMPLIANCE, UserRole.ADMIN)
  @ApiOperation({ summary: 'Retrieve strategic KPI dashboard summary metrics' })
  @ApiResponse({ status: 200, description: 'Aggregate metrics returned successfully' })
  async getDashboardMetrics() {
    return this.reportingService.getDashboardMetrics();
  }

  @Get('export')
  @Roles(UserRole.FINANCE, UserRole.COMPLIANCE, UserRole.ADMIN)
  @Header('Content-Type', 'text/csv')
  @Header('Content-Disposition', 'attachment; filename="claims_report.csv"')
  @ApiOperation({ summary: 'Export full database expense claim report as a CSV file' })
  @ApiResponse({ status: 200, description: 'CSV file compiled and streamed successfully' })
  async exportCsvReport(@Res() res: any) {
    const csvContent = await this.reportingService.generateCsvExport();
    return res.status(200).send(csvContent);
  }
}
