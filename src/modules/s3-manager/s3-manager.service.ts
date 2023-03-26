import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { InjectAwsService } from 'nest-aws-sdk';
import * as path from 'path';
import { File } from '../../common/interfaces/file.interface';

@Injectable()
export class S3ManagerService {
  constructor(@InjectAwsService(S3) private readonly s3: S3) {}

  async listBuckets() {
    const listBuckets = await this.s3.listBuckets().promise();
    return listBuckets.Buckets;
  }

  async listObjects(bucket: string): Promise<any> {
    try {
      const data = await this.s3.listObjects({ Bucket: bucket }).promise();
      return data.Contents.map((c) => c.Key);
    } catch (error) {
      throw new InternalServerErrorException(error.message, error);
    }
  }

  async uploadFile(bucket: string, file: File): Promise<{ key: string }> {
    try {
      // create unique key
      const fileUniqueName = await this.createUniqueFileKey(file.originalname);
      const key = `files/${fileUniqueName}`;
      await this.s3
        .putObject({
          Bucket: bucket,
          Body: file.buffer,
          ACL: 'public-read',
          Key: key,
        })
        .promise();

      return { key };
    } catch (error) {
      throw new InternalServerErrorException(error.message, error);
    }
  }

  async deleteFile(bucket: string, fileName: string) {
    const params = {
      Bucket: bucket,
      Key: fileName,
    };

    try {
      await this.s3.deleteObject(params).promise();
    } catch (error) {
      throw new InternalServerErrorException(error.message, error);
    }
  }

  async createUniqueFileKey(fileOrginalName: string): Promise<string> {
    const unixSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9); //1,000,000,000
    const ext = path.extname(fileOrginalName);
    return `${path
      .parse(fileOrginalName)
      .name.replace(/\s/g, '')}${unixSuffix}${ext}`;
  }
}
