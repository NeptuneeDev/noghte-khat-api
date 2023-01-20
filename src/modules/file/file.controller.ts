import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  ParseIntPipe,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadedFileDto } from './Dto/upload.file.Dto';
import { FileService } from './file.service';

import { disk } from './disk.storage';

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}
  @Post()
  @UseInterceptors(FileInterceptor('file', disk))
  async uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 1042 * 1024 * 3 })],
      }),
    )
    file: Express.Multer.File,
    @Body() body: UploadedFileDto,
    @Param('subId', ParseIntPipe) subId: number,
  ) {
    console.log(subId);
    console.log(body.title);
    return file;
    // return await this.pictureService.savePicture(
    //   productId,
    //   image.filename,
    //   +proiorty,
    // );
  }
}
// }
// new ParseFilePipe({
//   validators: [new MaxFileSizeValidator({ maxSize: 100 })],
// }),
