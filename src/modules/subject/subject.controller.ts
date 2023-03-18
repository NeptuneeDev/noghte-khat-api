import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { SubjectService } from './subject.service';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../auth/types/roles.enum';
import { Subject } from '@prisma/client';
import { ApiDeleteFileDoc, ApiUpdateFileDoc } from '../file/Doc/api.response';
@ApiTags('Subject')
@Controller('subject')
export class SubjectController {
  constructor(private readonly subjectService: SubjectService) {}

  @Post(':id')
  create(@Body() createSubjectDto: CreateSubjectDto, @Param('id') id: number) {
    return this.subjectService.create(createSubjectDto, id);
  }

  @Get()
  findAll() {
    return this.subjectService.findAll();
  }

  @Roles(Role.Admin)
  @Get('unverifieds')
  async findUnverifieds() {
    return await this.subjectService.findUnverifieds();
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiUpdateFileDoc()
  update(
    @Param('id', ParseIntPipe) id: string,
    @Body() updateSubjectDto: UpdateSubjectDto,
  ) {
    return this.subjectService.update(+id, updateSubjectDto);
  }

  @Roles(Role.Admin)
  @Get('accept/:id')
  async accept(@Param('id', ParseIntPipe) subjectId: number) {
    return await this.subjectService.accept(subjectId);
  }

  @Roles(Role.Admin)
  @HttpCode(HttpStatus.OK)
  @ApiDeleteFileDoc()
  @Delete('delete/:id')
  async reject(@Param('id', ParseIntPipe) subjectId: number) {
    return await this.subjectService.delete(subjectId);
  }
}
