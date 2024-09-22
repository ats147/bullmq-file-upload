import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bull';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('file-upload')
export class FileUploadController {
  constructor(
    @InjectQueue('file-upload-queue') private readonly fileUploadQueue: Queue,
  ) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads', // Temporary location before processing
        filename: (req, file, callback) => {
          const ext = extname(file.originalname);
          const fileName = `${Date.now()}-${Math.round(
            Math.random() * 1e9,
          )}${ext}`;
          callback(null, fileName);
        },
      }),
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log('File received:', file);
    // Add the file to the BullMQ queue for processing
    await this.fileUploadQueue.add('process-file', {
      filePath: file.path,
      fileName: file.filename,
    });
    return { message: 'File uploaded and queued for processing' };
  }
}
