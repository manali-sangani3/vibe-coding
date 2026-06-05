"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const seed_service_1 = require("./modules/database/seed.service");
async function bootstrap() {
    console.log('Starting standalone database seed context...');
    const app = await core_1.NestFactory.createApplicationContext(app_module_1.AppModule);
    const seeder = app.get(seed_service_1.SeedService);
    try {
        await seeder.seed();
    }
    catch (error) {
        console.error('Seeding process encountered an error:', error);
    }
    finally {
        await app.close();
        console.log('Seeder process closed.');
    }
}
bootstrap();
//# sourceMappingURL=seed.js.map