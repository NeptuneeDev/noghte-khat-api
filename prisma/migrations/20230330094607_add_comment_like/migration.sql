/*
  Warnings:

  - You are about to drop the column `rateId` on the `Comment` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_professorId_fkey";

-- DropForeignKey
ALTER TABLE "ProfessorRate" DROP CONSTRAINT "ProfessorRate_commentId_fkey";

-- DropForeignKey
ALTER TABLE "ProfessorRate" DROP CONSTRAINT "ProfessorRate_professorId_fkey";

-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "rateId",
ADD COLUMN     "numberOfDisLikes" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "numberOfLikes" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Professor" ALTER COLUMN "averageClassRoomManagement" SET DEFAULT 0,
ALTER COLUMN "averageGrading" SET DEFAULT 0,
ALTER COLUMN "averageSubjectMastry" SET DEFAULT 0,
ALTER COLUMN "averageTeachingCoherence" SET DEFAULT 0;

-- CreateTable
CREATE TABLE "UserCommentReaction" (
    "commentId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "reaction" "UserReaction" NOT NULL,

    CONSTRAINT "UserCommentReaction_pkey" PRIMARY KEY ("commentId","userId")
);

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_professorId_fkey" FOREIGN KEY ("professorId") REFERENCES "Professor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfessorRate" ADD CONSTRAINT "ProfessorRate_professorId_fkey" FOREIGN KEY ("professorId") REFERENCES "Professor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfessorRate" ADD CONSTRAINT "ProfessorRate_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCommentReaction" ADD CONSTRAINT "UserCommentReaction_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCommentReaction" ADD CONSTRAINT "UserCommentReaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
