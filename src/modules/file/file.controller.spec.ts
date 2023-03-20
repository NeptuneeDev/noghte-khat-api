// import { Test, TestingModule } from '@nestjs/testing';
// import { FileController } from './file.controller';
// import { FileService } from './file.service';
// import { SubjectService } from '../subject/subject.service';
// import { FileRepository } from './file.repository';
// import { SubjectRepository } from '../subject/subject.repository';
// import { ProfessorModule } from '../professor/professor.module';
// import { S3ManagerModule } from '../s3-manager/s3-manager.module';
// import { SubjectModule } from '../subject/subject.module';
// import { PrismaService } from '../prisma/prisma.service';

// describe('FileController', () => {
//   let fileController: FileController;
//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       imports: [SubjectModule, ProfessorModule, S3ManagerModule],
//       controllers: [FileController],
//       providers: [
//         FileService,
//         FileRepository,
//         SubjectService,
//         SubjectRepository,
//         PrismaService,
//       ],
//     }).compile();

//     fileController = module.get<FileController>(FileController);
//   });

//   describe('findAll', () => {
//     it('should return an array of cats', async () => {
//       expect(FileController).toBeDefined();
//     });
//   });
// });
