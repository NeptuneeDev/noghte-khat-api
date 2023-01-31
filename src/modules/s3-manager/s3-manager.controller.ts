import {
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { S3ManagerService } from './s3-manager.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { File } from '../../common/interfaces/file.interface';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('S3')
@Controller()
export class S3ManagerController {
  constructor(private readonly s3: S3ManagerService) {}

  @Get('buckets')
  getBuckets(): Promise<any> {
    return this.s3.listBuckets();
  }

  @Get('buckets/:bucketName')
  getObjectsByBucket(@Param('bucketName') bucketName: string): Promise<any> {
    return this.s3.listObjects(bucketName);
  }

  @Post('buckets/:bucketName')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
    @Param('bucketName') bucketName: string,
    @UploadedFile() file: File,
  ): Promise<any> {
    return this.s3.uploadFile(bucketName, file);
  }
}
