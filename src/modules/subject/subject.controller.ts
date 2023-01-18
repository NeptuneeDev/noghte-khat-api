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
import { CreateSubjectDto } from './dto/create-lesson.dto';
import { UpdateSubjectDto } from './dto/update-lesson.dto';
import { ApiTags } from '@nestjs/swagger';

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

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: string,
    @Body() updateSubjectDto: UpdateSubjectDto,
  ) {
    return this.subjectService.update(+id, updateSubjectDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.subjectService.remove(+id);
  }
}
