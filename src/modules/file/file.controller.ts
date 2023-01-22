import {
  Body,
  Controller,
  Delete,
  Get,
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
import { File } from './interfaces/file.interface';
import { Roles, ROLES_KEY } from 'src/common/decorators/roles.decorators';
import { Role } from '../auth/types/roles.enum';

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}
  @Post(':subId')
  @UseInterceptors(FileInterceptor('file', disk))
  async uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 1042 * 1024 * 100 })],
      }),
    )
    file: Express.Multer.File,
    @Body() body: UploadedFileDto,
    @Param('subId', ParseIntPipe) subId: number,
  ) {
    return await this.fileService.saveFile(subId, file.filename, body);
  }

  @Roles(Role.Admin)
  @Get('unverifieds')
  async findUnverifieds(): Promise<File[]> {
    return await this.fileService.findUnverifieds();
  }
  @Roles(Role.Admin)
  @Get('accept/:id')
  async accept(@Param('id', ParseIntPipe) fileId: number) {
    return await this.fileService.accept(fileId);
  }

  @Roles(Role.Admin)
  @Delete('reject/:id')
  async reject(
    @Param('id', ParseIntPipe) fileId: number,
  ): Promise<File | undefined> {
    return await this.fileService.reject(fileId);
  }
}
