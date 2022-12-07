import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateProfessorDto } from './Dto/create.professor.Dto';
import { Professor } from './professor.interface';
import { ProfessorService } from './professor.service';

@Controller('professor')
export class ProfessorController {
  constructor(private readonly professorService: ProfessorService) {}

  @Post()
  async createProfessor(@Body() createProfessorDto: CreateProfessorDto) {
    return this.professorService.create(createProfessorDto);
  }

  @Get('/:name')
  find(@Param('name') name: string): Promise<Professor[]> {
    return this.professorService.find(name);
  }

  @Get('/university/:uni')
  findByUni(@Param('uni') uni: string): Promise<Professor[]> {
    return this.professorService.findByUni(uni);
  }

  
}
