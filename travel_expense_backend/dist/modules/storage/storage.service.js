"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageService = void 0;
const common_1 = require("@nestjs/common");
const client_s3_1 = require("@aws-sdk/client-s3");
const crypto = __importStar(require("crypto"));
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
let StorageService = class StorageService {
    s3Client;
    bucketName = 'travel-receipts';
    endpoint;
    isOffline = process.env.OFFLINE_MODE === 'true';
    constructor() {
        if (this.isOffline) {
            return;
        }
        this.endpoint = process.env.MINIO_ENDPOINT || 'http://localhost:9000';
        this.s3Client = new client_s3_1.S3Client({
            endpoint: this.endpoint,
            credentials: {
                accessKeyId: process.env.MINIO_ACCESS_KEY || 'minioadmin',
                secretAccessKey: process.env.MINIO_SECRET_KEY || 'minioadmin',
            },
            forcePathStyle: true,
            region: 'us-east-1',
        });
    }
    async onModuleInit() {
        if (this.isOffline) {
            const uploadDir = path.join(process.cwd(), 'uploads');
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }
            console.log(`[Storage] Running in offline local filesystem mode. Uploads saved to: ${uploadDir}`);
            return;
        }
        try {
            await this.s3Client.send(new client_s3_1.HeadBucketCommand({ Bucket: this.bucketName }));
            console.log(`[Storage] MinIO bucket "${this.bucketName}" verified.`);
        }
        catch (error) {
            if (error.name === 'NotFound' || error.$metadata?.httpStatusCode === 404) {
                console.log(`[Storage] MinIO bucket "${this.bucketName}" not found. Creating it...`);
                try {
                    await this.s3Client.send(new client_s3_1.CreateBucketCommand({ Bucket: this.bucketName }));
                    console.log(`[Storage] MinIO bucket "${this.bucketName}" created successfully.`);
                }
                catch (createError) {
                    console.error('[Storage] Failed to auto-create MinIO bucket. Ensure MinIO is running.', createError);
                }
            }
            else {
                console.error('[Storage] Error checking MinIO connection. Ensure MinIO is running.', error.message);
            }
        }
    }
    async uploadFile(file) {
        const fileHash = crypto.randomBytes(16).toString('hex');
        const extension = path.extname(file.originalname);
        const key = `${fileHash}${extension}`;
        if (this.isOffline) {
            try {
                const uploadPath = path.join(process.cwd(), 'uploads', key);
                fs.writeFileSync(uploadPath, file.buffer);
                return `http://localhost:3000/uploads/${key}`;
            }
            catch (error) {
                console.error('[Storage] Error saving file to local filesystem:', error);
                throw new common_1.InternalServerErrorException('Failed to upload file to local filesystem.');
            }
        }
        try {
            await this.s3Client.send(new client_s3_1.PutObjectCommand({
                Bucket: this.bucketName,
                Key: key,
                Body: file.buffer,
                ContentType: file.mimetype,
            }));
            return `${this.endpoint}/${this.bucketName}/${key}`;
        }
        catch (error) {
            console.error('[Storage] Error uploading file to MinIO:', error);
            throw new common_1.InternalServerErrorException('Failed to upload file to S3 storage.');
        }
    }
};
exports.StorageService = StorageService;
exports.StorageService = StorageService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], StorageService);
//# sourceMappingURL=storage.service.js.map