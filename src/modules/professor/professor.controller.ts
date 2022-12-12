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
import { CreateProfessorDto, SearchByNameDto } from './Dto/professor.Dto';
import { Professor } from './interfaces/professor.interface';
import { ProfessorService } from './professor.service';

@Controller('professor')
export class ProfessorController {
  constructor(private readonly professorService: ProfessorService) {}

  @Post()
  async createProfessor(@Body() createProfessorDto: CreateProfessorDto) {
    return this.professorService.create(createProfessorDto);
  }

  // body id
  // body name on change
  @Get('/:id')
  find(@Param('id', ParseIntPipe) id: number): Promise<Professor | undefined> {
    return this.professorService.findById(id);
  }

  @Post('/name')
  async findByName(
    @Body() Body: SearchByNameDto,
  ): Promise<Partial<Professor>[]> {
    return this.professorService.findByName(Body.name);
  }



  @Get('/university/:uni')
  findByUni(@Param('uni') uni: string): Promise<Professor[]> {
    return this.professorService.findByUni(uni);
  }

  @Get()
  findAll(): Promise<Professor[]> {
    console.log('asdmasd');
    return this.professorService.findAll();
  }

  @Delete('/:id')
  async deleteProfessor(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Professor | undefined> {
    return this.professorService.deleteProfessor(id);
  }
}
