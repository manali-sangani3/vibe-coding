import { Injectable, Optional } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';

@Injectable()
export class NotificationService {
  constructor(
    @Optional()
    @InjectQueue('notification-queue')
    private readonly notificationQueue: Queue,
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
  ) {}

  async sendNotification(
    userId: string,
    title: string,
    message: string,
    type: string = 'in-app',
  ) {
    if (process.env.OFFLINE_MODE === 'true' || !this.notificationQueue) {
      // Direct database insert & log in offline fallback mode
      const notification = this.notificationRepository.create({
        userId,
        title,
        message,
        type,
      });
      await this.notificationRepository.save(notification);

      if (type === 'email') {
        console.log(`\x1b[35m[OFFLINE EMAIL SENT] To User: ${userId} | Subject: ${title} | Body: ${message}\x1b[0m`);
      } else if (type === 'push') {
        console.log(`\x1b[33m[OFFLINE PUSH SENT] To User: ${userId} | ${title}: ${message}\x1b[0m`);
      } else {
        console.log(`[OFFLINE Notification] In-app notification registered for user: ${userId}`);
      }
      return;
    }

    // Push notification job into background Queue (BullMQ)
    await this.notificationQueue.add(
      'send-notification',
      { userId, title, message, type },
      { removeOnComplete: true },
    );
  }
}
