"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const common_1 = require("@nestjs/common");
const bullmq_1 = require("@nestjs/bullmq");
const bullmq_2 = require("bullmq");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const notification_entity_1 = require("./entities/notification.entity");
let NotificationService = class NotificationService {
    notificationQueue;
    notificationRepository;
    constructor(notificationQueue, notificationRepository) {
        this.notificationQueue = notificationQueue;
        this.notificationRepository = notificationRepository;
    }
    async sendNotification(userId, title, message, type = 'in-app') {
        if (process.env.OFFLINE_MODE === 'true' || !this.notificationQueue) {
            const notification = this.notificationRepository.create({
                userId,
                title,
                message,
                type,
            });
            await this.notificationRepository.save(notification);
            if (type === 'email') {
                console.log(`\x1b[35m[OFFLINE EMAIL SENT] To User: ${userId} | Subject: ${title} | Body: ${message}\x1b[0m`);
            }
            else if (type === 'push') {
                console.log(`\x1b[33m[OFFLINE PUSH SENT] To User: ${userId} | ${title}: ${message}\x1b[0m`);
            }
            else {
                console.log(`[OFFLINE Notification] In-app notification registered for user: ${userId}`);
            }
            return;
        }
        await this.notificationQueue.add('send-notification', { userId, title, message, type }, { removeOnComplete: true });
    }
};
exports.NotificationService = NotificationService;
exports.NotificationService = NotificationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Optional)()),
    __param(0, (0, bullmq_1.InjectQueue)('notification-queue')),
    __param(1, (0, typeorm_1.InjectRepository)(notification_entity_1.Notification)),
    __metadata("design:paramtypes", [bullmq_2.Queue,
        typeorm_2.Repository])
], NotificationService);
//# sourceMappingURL=notification.service.js.map