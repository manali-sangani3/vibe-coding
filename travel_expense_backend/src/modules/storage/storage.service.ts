import { Injectable, OnModuleInit, InternalServerErrorException } from '@nestjs/common';
import { S3Client, PutObjectCommand, CreateBucketCommand, HeadBucketCommand } from '@aws-sdk/client-s3';
import * as crypto from 'crypto';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class StorageService implements OnModuleInit {
  private s3Client: S3Client;
  private bucketName = 'travel-receipts';
  private endpoint: string;
  private isOffline = process.env.OFFLINE_MODE === 'true';

  constructor() {
    if (this.isOffline) {
      return;
    }
    this.endpoint = process.env.MINIO_ENDPOINT || 'http://localhost:9000';
    this.s3Client = new S3Client({
      endpoint: this.endpoint,
      credentials: {
        accessKeyId: process.env.MINIO_ACCESS_KEY || 'minioadmin',
        secretAccessKey: process.env.MINIO_SECRET_KEY || 'minioadmin',
      },
      forcePathStyle: true, // Crucial for MinIO local resolution
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
      // Create bucket if it does not exist
      await this.s3Client.send(new HeadBucketCommand({ Bucket: this.bucketName }));
      console.log(`[Storage] MinIO bucket "${this.bucketName}" verified.`);
    } catch (error: any) {
      if (error.name === 'NotFound' || error.$metadata?.httpStatusCode === 404) {
        console.log(`[Storage] MinIO bucket "${this.bucketName}" not found. Creating it...`);
        try {
          await this.s3Client.send(new CreateBucketCommand({ Bucket: this.bucketName }));
          console.log(`[Storage] MinIO bucket "${this.bucketName}" created successfully.`);
        } catch (createError) {
          console.error('[Storage] Failed to auto-create MinIO bucket. Ensure MinIO is running.', createError);
        }
      } else {
        console.error('[Storage] Error checking MinIO connection. Ensure MinIO is running.', error.message);
      }
    }
  }

  async uploadFile(file: any): Promise<string> {
    const fileHash = crypto.randomBytes(16).toString('hex');
    const extension = path.extname(file.originalname);
    const key = `${fileHash}${extension}`;

    if (this.isOffline) {
      try {
        const uploadPath = path.join(process.cwd(), 'uploads', key);
        fs.writeFileSync(uploadPath, file.buffer);
        // Return local mock server URL (port 3000)
        return `http://localhost:3000/uploads/${key}`;
      } catch (error) {
        console.error('[Storage] Error saving file to local filesystem:', error);
        throw new InternalServerErrorException('Failed to upload file to local filesystem.');
      }
    }

    try {
      await this.s3Client.send(
        new PutObjectCommand({
          Bucket: this.bucketName,
          Key: key,
          Body: file.buffer,
          ContentType: file.mimetype,
        }),
      );

      // Return local MinIO public access URL
      return `${this.endpoint}/${this.bucketName}/${key}`;
    } catch (error) {
      console.error('[Storage] Error uploading file to MinIO:', error);
      throw new InternalServerErrorException('Failed to upload file to S3 storage.');
    }
  }
}
