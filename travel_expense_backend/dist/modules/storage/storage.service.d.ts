import { OnModuleInit } from '@nestjs/common';
export declare class StorageService implements OnModuleInit {
    private s3Client;
    private bucketName;
    private endpoint;
    private isOffline;
    constructor();
    onModuleInit(): Promise<void>;
    uploadFile(file: any): Promise<string>;
}
