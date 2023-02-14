import {
  Body,
  Controller,
  Delete,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  ParseIntPipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadedFileDto } from './Dto/upload.file.Dto';
import { FileService } from './file.service';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../auth/types/roles.enum';
import { disk } from './disk.storage';
import { File as FileModel } from '@prisma/client';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { relative } from 'path';
import { ApiDeleteFileDoc, ApiUploadFileDoc } from './Doc/api.response';

@ApiTags('file')
@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post(':subId')
  @UseInterceptors(FileInterceptor('file', disk))
  @ApiUploadFileDoc()
  @ApiConsumes('multipart/form-data')
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
    return await this.fileService.saveFile(subId, file, body);
  }

  @Roles(Role.Admin)
  @ApiDeleteFileDoc()
  @Delete('delete/:fileName')
  async deleteFile(@Param('fileName') fileName: string) {
    return await this.fileService.deleteFile(fileName);
  }

  @Roles(Role.Admin)
  @Get('unverifieds')
  async findUnverifieds(): Promise<FileModel[]> {
    return await this.fileService.findUnverifieds();
  }

  @Roles(Role.Admin)
  @Get('accept/:id')
  async accept(@Param('id', ParseIntPipe) fileId: number) {
    return await this.fileService.accept(fileId);
  }
}
