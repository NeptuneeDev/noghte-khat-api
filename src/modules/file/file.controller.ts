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
import { ApiTags } from '@nestjs/swagger';
import { File } from 'src/common/interfaces';

@ApiTags('file')
@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}
  @Post(':subId')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 1042 * 1024 * 100 })],
      }),
    )
    file: File,
    @Body() body: UploadedFileDto,
    @Param('subId', ParseIntPipe) subId: number,
  ) {
    console.log(file);
    return await this.fileService.saveFile(subId, file, body);
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

  @Roles(Role.Admin)
  @Delete('reject/:id')
  async reject(
    @Param('id', ParseIntPipe) fileId: number,
  ): Promise<FileModel | undefined> {
    return await this.fileService.reject(fileId);
  }
}
