import { Controller, Post, Get, Body, Param, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { TravelService } from './travel.service';
import { CreateTravelRequestDto } from './dto/create-travel-request.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Travel Requests')
@Controller('travel')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TravelController {
  constructor(private readonly travelService: TravelService) {}

  @Post()
  @ApiOperation({ summary: 'Submit a new employee travel request' })
  @ApiResponse({ status: 201, description: 'Travel request submitted successfully and routed to first approver' })
  @ApiResponse({ status: 400, description: 'Validation error (e.g., date checks or missing fields)' })
  @ApiResponse({ status: 409, description: 'Overlapping request conflict error' })
  async submitTravelRequest(@Body() dto: CreateTravelRequestDto, @Req() req: any) {
    return this.travelService.submitTravelRequest(req.user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get list of travel requests for the logged-in employee' })
  @ApiResponse({ status: 200, description: 'List of travel requests returned successfully' })
  async getTravelRequests(@Req() req: any) {
    const list = await this.travelService.getTravelRequests(req.user.id);
    return { success: true, data: list };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get detailed travel request status, including active approval stages timeline' })
  @ApiResponse({ status: 200, description: 'Detailed request context returned successfully' })
  @ApiResponse({ status: 400, description: 'Unauthorized resource view block' })
  @ApiResponse({ status: 404, description: 'Request not found' })
  async getTravelRequestById(@Param('id') id: string, @Req() req: any) {
    const detail = await this.travelService.getTravelRequestById(req.user.id, id);
    return { success: true, data: detail };
  }

  @Post(':id/cancel')
  @ApiOperation({ summary: 'Cancel a pending travel request' })
  @ApiResponse({ status: 200, description: 'Travel request cancelled successfully' })
  @ApiResponse({ status: 400, description: 'Cancellation blocked (approved or completed state)' })
  @ApiResponse({ status: 404, description: 'Request not found' })
  async cancelTravelRequest(@Param('id') id: string, @Req() req: any) {
    const res = await this.travelService.cancelTravelRequest(req.user.id, id);
    return { success: true, message: 'Travel request cancelled successfully', data: res };
  }
}
