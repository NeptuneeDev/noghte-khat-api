import { Test, TestingModule } from '@nestjs/testing';
import { FileService } from './file.service';
import { SubjectService } from '../subject/subject.service';
import { FileRepository } from './file.repository';
import { S3ManagerService } from '../s3-manager/s3-manager.service';
import { BadRequestException, HttpException } from '@nestjs/common';
import { UploadFileDto } from './Dto/upload.file.Dto';
import { File } from '../../common/interfaces/file.interface';
const mockSubjectService = {
  findById: jest.fn(() => ({
    id: 1,
    title: 'subject1',
  })),
};

const mockFileRepository = {
  saveFile: jest.fn(),
};
const mockS3ManagerService = {
  uploadFile: jest.fn(),
};

describe('FileService', () => {
  let fileService: FileService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FileService,
        {
          provide: SubjectService,
          useValue: mockSubjectService,
        },
        {
          provide: FileRepository,
          useValue: mockFileRepository,
        },
        {
          provide: S3ManagerService,
          useValue: mockS3ManagerService,
        },
      ],
    }).compile();

    fileService = module.get<FileService>(FileService);
  });

  describe('save file', () => {
    it('should throw BadRequestException when subject does not exist', async () => {
      const subjectId = 2;
      mockSubjectService.findById.mockReturnValueOnce(undefined);

      await expect(
        fileService.saveFile(subjectId, {} as any, {} as any),
      ).rejects.toThrowError(BadRequestException);
    });
  });

  it('should throw HttpException when file type is not valid', async () => {
    const subjectId = 1;
    const file = {
      mimetype: 'image/gif',
    } as File;
    mockSubjectService.findById.mockReturnValueOnce({});
    fileService.isValidType = jest.fn().mockReturnValueOnce(false);

    await expect(
      fileService.saveFile(subjectId, file, {} as UploadFileDto),
    ).rejects.toThrowError(HttpException);
  });
});
