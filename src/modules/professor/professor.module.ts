import { Module } from '@nestjs/common';
import { ProfessorService } from './professor.service';
import { ProfessorController } from './professor.controller';
import { ProfessorRepository } from './professor.repository';

@Module({
  controllers: [ProfessorController],
  providers: [ProfessorService,ProfessorRepository],
  exports:[ProfessorService,ProfessorService]
})
export class ProfessorModule {}
