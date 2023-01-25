import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { SubjectService } from './subject.service';
import { CreateSubjectDto } from './dto/create-update.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../auth/types/roles.enum';
import { Subject } from './interfaces/subject.interface';
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
  @Delete('reject/:id')
  async reject(
    @Param('id', ParseIntPipe) subjectId: number,
  ): Promise<Subject | undefined> {
    return await this.subjectService.reject(subjectId);
  }
}
