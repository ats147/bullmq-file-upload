import { Module } from '@nestjs/common';
import { FileUploadService } from './file-upload.service';
import { FileUploadController } from './file-upload.controller';
import { FileUploadProcessor } from '../file-upload/file-upload.processor/file-upload.processor.service';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'file-upload-queue',
    }),
  ],
  providers: [FileUploadService, FileUploadProcessor],
  controllers: [FileUploadController],
})
export class FileUploadModule {}
