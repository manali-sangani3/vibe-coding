import { Controller, Get, Post, Param, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Notifications')
@Controller('notifications')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class NotificationController {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get list of notifications for the logged-in user' })
  @ApiResponse({ status: 200, description: 'List of notifications returned successfully' })
  async getNotifications(@Req() req: any) {
    const notifications = await this.notificationRepository.find({
      where: { userId: req.user.id },
      order: { createdAt: 'DESC' },
    });
    return { success: true, data: notifications };
  }

  @Post(':id/read')
  @ApiOperation({ summary: 'Mark a notification as read' })
  @ApiResponse({ status: 200, description: 'Notification marked as read successfully' })
  async markAsRead(@Param('id') id: string, @Req() req: any) {
    await this.notificationRepository.update(
      { id, userId: req.user.id },
      { isRead: true },
    );
    return { success: true, message: 'Notification marked as read' };
  }
}
