import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { FileUploadModule } from './file-upload/file-upload.module';

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    BullModule.registerQueue({
      name: 'file-upload-queue',
    }),
    FileUploadModule,
  ],
})
export class AppModule {}
