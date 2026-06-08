import { Controller, Post, Get, Body, Param, Req, UseGuards, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { ExpensesService } from './expenses.service';
import { StorageService } from '../storage/storage.service';
import { CreateExpenseClaimDto } from './dto/create-expense.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@ApiTags('Expenses')
@Controller('expenses')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ExpensesController {
  constructor(
    private readonly expensesService: ExpensesService,
    private readonly storageService: StorageService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Submit an itemized expense claim' })
  @ApiResponse({ status: 201, description: 'Expense claim submitted successfully and routed to Finance' })
  @ApiResponse({ status: 400, description: 'Validation fails (receipt requirement, limits exceeded, window expired)' })
  async submitExpenseClaim(@Body() dto: CreateExpenseClaimDto, @Req() req: any) {
    return this.expensesService.submitExpenseClaim(req.user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List submitted expense claims for the logged-in employee' })
  @ApiResponse({ status: 200, description: 'List of claims returned successfully' })
  async getExpenseClaims(@Req() req: any) {
    const list = await this.expensesService.getExpenseClaims(req.user.id);
    return { success: true, data: list };
  }

  @Get('pending-approvals')
  @Roles(UserRole.MANAGER, UserRole.ADMIN, UserRole.FINANCE)
  @ApiOperation({ summary: 'List expense claims pending my approval' })
  async getPendingExpenseApprovals(@Req() req: any) {
    const list = await this.expensesService.getPendingExpenseApprovals(req.user.id);
    return { success: true, data: list };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get details of a specific expense claim' })
  @ApiResponse({ status: 200, description: 'Expense claim details returned successfully' })
  @ApiResponse({ status: 404, description: 'Claim not found' })
  async getExpenseClaimById(@Param('id') id: string, @Req() req: any) {
    const detail = await this.expensesService.getExpenseClaimById(req.user.id, id);
    return { success: true, data: detail };
  }

  @Post(':id/manager-approve')
  @Roles(UserRole.MANAGER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Manager approval for an expense claim' })
  async managerApproveExpenseClaim(@Param('id') id: string, @Req() req: any) {
    const claim = await this.expensesService.managerApproveExpenseClaim(req.user.id, id);
    return { success: true, data: claim };
  }

  @Post(':id/approve')
  @Roles(UserRole.FINANCE, UserRole.ADMIN)
  @ApiOperation({ summary: 'Finance approval for an expense claim' })
  async approveExpenseClaim(@Param('id') id: string, @Req() req: any) {
    const claim = await this.expensesService.approveExpenseClaim(req.user.id, id);
    return { success: true, data: claim };
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiOperation({ summary: 'Upload a supporting receipt image or PDF file to MinIO S3' })
  @ApiResponse({ status: 201, description: 'File uploaded successfully and receiptUrl returned' })
  @ApiResponse({ status: 400, description: 'No file supplied or unsupported type' })
  async uploadReceipt(@UploadedFile() file: any) {
    if (!file) {
      throw new BadRequestException('No receipt file was supplied in request.');
    }
    
    // File format constraint validation
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('Receipt upload only supports PDF, PNG, and JPEG files.');
    }

    // Size limit constraint verification (10MB)
    const maxSizeBytes = 10 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      throw new BadRequestException('Receipt file size must not exceed the 10MB limit.');
    }

    const receiptUrl = await this.storageService.uploadFile(file);
    return { success: true, receiptUrl };
  }
}
