import { Test } from '@nestjs/testing';
import { Professor } from '@prisma/client';
import { after, before } from 'lodash';
import { AppModule } from 'src/app.module';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { UserRepository } from 'src/modules/user/user.repository';
import { UserService } from 'src/modules/user/user.service';
import { CommentService } from '../../comment.service';
import { CreateCommentDto } from '../../dto/create-comment.dto';

describe('commentService', () => {
  let commentService: CommentService;
  let userService: UserService;
  let userRepository: UserRepository;
  let prisma: PrismaService;

  let userId: number;
  let professorId: number;
  let commentId: number;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    commentService = moduleRef.get<CommentService>(CommentService);
    userService = moduleRef.get<UserService>(UserService);
    userRepository = moduleRef.get<UserRepository>(UserRepository);
    prisma = moduleRef.get<PrismaService>(PrismaService);

    const professor = await prisma.professor.create({
      data: {
        email: 'rezai@gmail.com',
        name: 'reza',
        university: 'azad',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isVerified: true,
      },
    });
    professorId = professor.id;

    const user = await prisma.user.create({
      data: {
        email: 'khalvai@gmail.com',
        name: 'khalvai',
      },
    });
    userId = user.id;
  });

  afterAll(async () => {
    const deleteComments = prisma.comment.deleteMany();
    const deleteUsers = prisma.user.deleteMany();
    const deleteProfessors = prisma.professor.deleteMany();
    const deleteProfessorRate = prisma.professorRate.deleteMany();
    await prisma.$transaction([
      deleteProfessorRate,
      deleteComments,
      deleteProfessors,
      deleteUsers,
    ]);
    await prisma.$disconnect();
  });

  describe('create comment', () => {
    it('should create comment', async () => {
      const commentDto: CreateCommentDto = {
        subjectName: 'chemestery',
        description: 'some thing cool',
        subjectMastry: '2.3',
        classRoomManagement: '1.2',
        teachingCoherence: '2.3',
        grading: '2.3',
        presenceRoll: 'not matter',
      };
      const comment = await commentService.create(
        commentDto,
        userId,
        professorId,
      );
      commentId = comment.id;
      expect(comment.id).toBeTruthy();
    });
  });

  describe('average of professor', () => {
    it('before accepting the comment', async () => {
      const professor = await prisma.professor.findUnique({
        where: { id: professorId },
      });

      expect(JSON.stringify(professor.averageClassRoomManagement)).toBe(
        JSON.stringify('0'),
      );
    });

    it('after accepting comment', async () => {
      const accepted = await commentService.acceptAndUpdateAverge(commentId);
      const professor = await prisma.professor.findUnique({
        where: { id: professorId },
      });

      expect(JSON.stringify(professor.averageClassRoomManagement)).toBe(
        JSON.stringify('1.2'),
      );
    });
  });

  // before()
  describe("unverified comments",()=>{




  })
});
