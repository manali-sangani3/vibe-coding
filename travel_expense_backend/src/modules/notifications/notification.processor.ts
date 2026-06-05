import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';

@Processor('notification-queue')
export class NotificationProcessor extends WorkerHost {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
  ) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    const { userId, title, message, type } = job.data;
    
    console.log(`[NotificationProcessor] Processing background job ${job.id} for user ${userId}...`);

    // 1. Store in-app notification in DB
    const notification = this.notificationRepository.create({
      userId,
      title,
      message,
      type,
    });
    await this.notificationRepository.save(notification);

    // 2. Execute mock delivery log actions
    if (type === 'email') {
      console.log(`\x1b[35m[MOCK EMAIL SENT] To User: ${userId} | Subject: ${title} | Body: ${message}\x1b[0m`);
    } else if (type === 'push') {
      console.log(`\x1b[33m[MOCK PUSH NOTIFICATION SENT] To User: ${userId} | ${title}: ${message}\x1b[0m`);
    } else {
      console.log(`[Notification] In-app notification registered for user: ${userId}`);
    }

    return { success: true };
  }
}
