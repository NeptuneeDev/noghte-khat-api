import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { InjectAwsService } from 'nest-aws-sdk';
import { File } from '../../common/interfaces/file.interface';

@Injectable()
export class S3ManagerService {
  constructor(@InjectAwsService(S3) private readonly s3: S3) {}

  async listBuckets() {
    const listBuckets = await this.s3.listBuckets().promise();
    return listBuckets.Buckets;
  }

  async listBucketContents(bucket: string) {
    const data = await this.s3.listObjectsV2({ Bucket: bucket }).promise();
    return data.Contents.map((c) => c.Key);
  }

  async listObjects(bucket: string): Promise<any> {
    try {
      const result = await this.s3
        .listObjects({
          Bucket: bucket,
        })
        .promise();
      return result;
    } catch (error) {
      throw new InternalServerErrorException(error.message, error);
    }
  }

  async uploadFile(bucket: string, file: File): Promise<any> {
    try {
      const key = 'files/' + file.originalname;
      await this.s3
        .putObject({
          Bucket: bucket,
          Body: file.buffer,
          ACL: 'public-read',
          Key: key,
        })
        .promise()

      return {
        key: key,
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message, error);
    }
  }
}