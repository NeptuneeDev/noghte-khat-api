import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';
import clientMessages from 'src/common/translation/fa';

export class UploadFileDto {
  @ApiProperty()
  @IsString()
  @MaxLength(30, { message: clientMessages.file.validation.maxTitle })
  title: string;

  @ApiProperty()
  @IsString()
  @MaxLength(255, {
    message: clientMessages.file.validation.maxDescription,
  })
  description: string;

  @ApiProperty({ type: 'string', format: 'binary' })
  file: any;
}
