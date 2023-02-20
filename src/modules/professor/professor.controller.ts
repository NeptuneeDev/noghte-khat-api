import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  ParseIntPipe,
  Post,
  Res,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Role } from '../auth/types/roles.enum';
import { Public } from '../../common/decorators';
import { Roles } from '../../common/decorators/roles.decorator';
import { CreateProfessorDto, SearchByNameDto } from './Dto/professor.Dto';
import { Professor } from './interfaces/professor.interface';
import { ProfessorService } from './professor.service';

@ApiTags('professor')
@Controller('professor')
export class ProfessorController {
  constructor(private readonly professorService: ProfessorService) {}

  @Post()
  async createProfessor(
    @Body() createProfessorDto: CreateProfessorDto,
  ): Promise<Partial<Professor>> {
    return await this.professorService.create(createProfessorDto);
  }
  @Roles(Role.Admin)
  @Get('unverifieds')
  async getUnverifieds(): Promise<Professor[]> {
    return await this.professorService.findUnverifids();
  }

  // body name on change
  @Public()
  @Post('/name')
  async findByName(
    @Body() Body: SearchByNameDto,
  ): Promise<Partial<Professor>[]> {
    return await this.professorService.findByName(Body.name);
  }

  @Public()
  @Get('/university/:uni')
  async findByUni(@Param('uni') uni: string): Promise<Partial<Professor>[]> {
    return await this.professorService.findByUni(uni);
  }

  @Public()
  @Get()
  async findAll(): Promise<Professor[]> {
    return await this.professorService.findAll();
  }

  @Public()
  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number) {
    return await this.professorService.findById(id);
  }

  @Roles(Role.Admin)
  @Get('acceptt/:id')
  async accept(@Param('id', ParseIntPipe) professorId: number) {
    return await this.professorService.accept(professorId);
  }

  @Roles(Role.Admin)
  @Delete('delete/:id')
  async reject(
    @Param('id', ParseIntPipe) professorId: number,
  ): Promise<Professor | undefined> {
    return await this.professorService.reject(professorId);
  }
}
