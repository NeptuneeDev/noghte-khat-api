import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { ProfessorModule } from '../professor/professor.module';
import { ProfessorRepository } from '../professor/professor.repository';
import { CommentRepository } from './comment.repository';
import { CommentService } from './comment.service';

describe('CommentService', () => {
  let service: CommentService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
  providers: [CommentService, CommentRepository,ProfessorRepository],
    }).compile();

    service = module.get<CommentService>(CommentService);
  });


  describe("create",()=>{
    it('should be defined', () => {
      expect(service).toBeDefined();
    });
  

  })



});
