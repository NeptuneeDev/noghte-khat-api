import { Module } from '@nestjs/common';
import { S3ManagerService } from './s3-manager.service';
import { AwsSdkModule } from 'nest-aws-sdk';
import { S3 } from 'aws-sdk';
import { S3ManagerController } from './s3-manager.controller';

@Module({
  imports: [AwsSdkModule.forFeatures([S3])],
  controllers: [S3ManagerController],
  providers: [S3ManagerService],
  exports: [S3ManagerService],
})
export class S3ManagerModule {}
