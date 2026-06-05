"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const bullmq_1 = require("@nestjs/bullmq");
const notification_entity_1 = require("./entities/notification.entity");
const notification_service_1 = require("./notification.service");
const notification_processor_1 = require("./notification.processor");
const notification_controller_1 = require("./notification.controller");
const isOffline = process.env.OFFLINE_MODE === 'true';
const moduleImports = [
    typeorm_1.TypeOrmModule.forFeature([notification_entity_1.Notification]),
];
if (!isOffline) {
    moduleImports.push(bullmq_1.BullModule.registerQueue({
        name: 'notification-queue',
    }));
}
const moduleProviders = [notification_service_1.NotificationService];
if (!isOffline) {
    moduleProviders.push(notification_processor_1.NotificationProcessor);
}
let NotificationModule = class NotificationModule {
};
exports.NotificationModule = NotificationModule;
exports.NotificationModule = NotificationModule = __decorate([
    (0, common_1.Module)({
        imports: moduleImports,
        controllers: [notification_controller_1.NotificationController],
        providers: moduleProviders,
        exports: [notification_service_1.NotificationService],
    })
], NotificationModule);
//# sourceMappingURL=notification.module.js.map