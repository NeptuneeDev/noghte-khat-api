import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Res,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '../common/decorators';
import { CreateProfessorDto, SearchByNameDto } from './Dto/professor.Dto';
import { Professor } from './interfaces/professor.interface';
import { ProfessorService } from './professor.service';

@ApiTags('professor')
@Controller('professor')
export class ProfessorController {
  constructor(private readonly professorService: ProfessorService) {}

  @Post()
  async createProfessor(@Body() createProfessorDto: CreateProfessorDto) {
    return this.professorService.create(createProfessorDto);
  }

  // body name on change
  @Public()
  @Post('/name')
  async findByName(
    @Body() Body: SearchByNameDto,
  ): Promise<Partial<Professor>[]> {
    return this.professorService.findByName(Body.name);
  }

  @Public()
  @Get('/university/:uni')
  findByUni(@Param('uni') uni: string): Promise<Partial<Professor>[]> {
    return this.professorService.findByUni(uni);
  }

  @Public()
  @Get()
  findAll(): Promise<Professor[]> {
    console.log('asdmasd');
    return this.professorService.findAll();
  }

  @Public()
  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number) {
    return this.professorService.findById(id);
  }
  @Delete('/:id')
  async deleteProfessor(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Professor | undefined> {
    return this.professorService.deleteProfessor(id);
  }
}
