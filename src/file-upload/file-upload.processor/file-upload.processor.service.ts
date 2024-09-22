import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bullmq';
import { promises as fs } from 'fs';
import { join } from 'path';

@Processor('file-upload-queue')
export class FileUploadProcessor {
  @Process('process-file')
  async handleFileUpload(job: Job<any>) {
    const { filePath, fileName } = job.data;
    const destinationDir = './final-uploads'; // Final destination directory

    try {
      // Ensure destination directory exists
      await fs.mkdir(destinationDir, { recursive: true });

      // Move file from temporary location to final destination
      const destinationPath = join(destinationDir, fileName);
      await fs.rename(filePath, destinationPath);

      console.log(`File saved to: ${destinationPath}`);
    } catch (error) {
      console.error('Error processing file:', error);
    }
  }
}
