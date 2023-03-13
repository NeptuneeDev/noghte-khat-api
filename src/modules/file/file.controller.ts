import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadFileDto } from './Dto/upload.file.Dto';
import { FileService } from './file.service';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../auth/types/roles.enum';
import { File as FileModel } from '@prisma/client';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { File } from 'src/common/interfaces';
import {
  ApiDeleteFileDoc,
  ApiUpdateFileDoc,
  ApiUploadFileDoc,
} from './Doc/api.response';
import { UpdateFileDto } from './Dto/update.file.Dto';
import { GetCurrentUserId, Public } from 'src/common/decorators';
import { RtGuard } from 'src/common/guards/rt.guard';
import { Request } from 'express';

@ApiTags('file')
@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post(':subId')
  @ApiConsumes('multipart/form-data')
  @ApiUploadFileDoc()
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 1042 * 1024 * 100 })],
      }),
    )
    file: File,
    @Body() body: UploadFileDto,
    @Param('subId', ParseIntPipe) subId: number,
  ) {
    return await this.fileService.saveFile(subId, file, body);
  }

  @Roles(Role.Admin)
  @ApiDeleteFileDoc()
  @HttpCode(HttpStatus.OK)
  @Delete('delete/:id')
  async deleteFile(@Param('id') id: number) {
    return await this.fileService.deleteFile(id);
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
  @Patch('update/:id')
  @HttpCode(HttpStatus.OK)
  @ApiUpdateFileDoc()
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateFileDto: UpdateFileDto,
  ) {
    return await this.fileService.update(id, updateFileDto);
  }

  ////////////////////////////////////--------------------

  @UseGuards(RtGuard)
  @Post(':id/like')
  async like(
    @GetCurrentUserId() userId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return await this.fileService.like(userId, id);
  }

  @UseGuards(RtGuard)
  @Get(':id/liked')
  async userHasLikedFile(
    @GetCurrentUserId() userId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return await this.fileService.userHasLikedFile(userId, id);
  }

  @Public()
  @Get(':id/likes')
  async getNumberOfLikes(@Param('id', ParseIntPipe) id: number) {
    return await this.fileService.getNumberOfLikes(id);
  }

  @UseGuards(RtGuard)
  @Post(':id/removalLike')
  async removalLike(
    @GetCurrentUserId() userId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return await this.fileService.removalLike(userId, id);
  }
  ////////////////////////////////////////////////////////////

  @UseGuards(RtGuard)
  @Post(':id/dislike')
  async disLike(
    @GetCurrentUserId() userId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return await this.fileService.disLike(userId, id);
  }

  @UseGuards(RtGuard)
  @Get(':id/disLiked')
  async userHasDisLikedFile(
    @GetCurrentUserId() userId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return await this.fileService.userHasDisLikedFile(userId, id);
  }

  @Public()
  @Get(':id/disLikes')
  async getNumberOfDisLikes(@Param('id', ParseIntPipe) id: number) {
    return await this.fileService.getNumberOfDisLikes(id);
  }
  @UseGuards(RtGuard)
  @Post(':id/removalDislike')
  async removalDisLike(
    @GetCurrentUserId() userId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return await this.fileService.removalDisLike(userId, id);
  }
}
