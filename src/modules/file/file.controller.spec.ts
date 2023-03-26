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
// import { PrismaModule } from '../prisma/prisma.module';

// describe('FileController', () => {
//   let fileController: FileController;
//   let fileService: FileService;
//   let fileRepository: FileRepository;
//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       imports: [SubjectModule, ProfessorModule, S3ManagerModule, PrismaModule],
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
//     fileService = module.get<FileService>(FileService);
//     fileRepository = module.get<FileRepository>(FileRepository);
//   });

//   describe('findAll', () => {
//     it('should return an array of cats', async () => {
//       expect(FileController).toBeDefined();
//     });
//   });
// });
