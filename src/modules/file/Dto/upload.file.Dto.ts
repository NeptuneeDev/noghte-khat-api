import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class UploadedFileDto {
  @ApiProperty()
  @IsString()
  @MaxLength(30, { message: "title shouldn't be more than 30 characters" })
  title: string;

  @ApiProperty()
  @IsString()
  @MaxLength(255, {
    message: "disciption shouldn't be more than 30 characters",
  })
  description: string;

  @ApiProperty({ type: 'string', format: 'binary' })
  file: any;
}
