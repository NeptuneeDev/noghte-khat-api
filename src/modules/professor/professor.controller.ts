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
import { Public } from '../common/decorators';
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

  @Public()
  @Get('/:id')
  find(@Param('id', ParseIntPipe) id: number, @Res() res) {
    const resl = this.professorService.findById(id);
    res.send(resl);
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

  @Delete('/:id')
  async deleteProfessor(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Professor | undefined> {
    return this.professorService.deleteProfessor(id);
  }
}
