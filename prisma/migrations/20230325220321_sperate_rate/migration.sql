/*
  Warnings:

  - You are about to drop the column `ability` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `manageClass` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `rhetorical` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `rollcall` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `semester` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `teaching` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Comment` table. All the data in the column will be lost.
  - Added the required column `presenceRoll` to the `Comment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "ability",
DROP COLUMN "manageClass",
DROP COLUMN "rhetorical",
DROP COLUMN "rollcall",
DROP COLUMN "semester",
DROP COLUMN "teaching",
DROP COLUMN "type",
ADD COLUMN     "presenceRoll" TEXT NOT NULL,
ADD COLUMN     "rateId" INTEGER;

-- DropEnum
DROP TYPE "classType";

-- CreateTable
CREATE TABLE "ProfessorRate" (
    "subjectMastry" SMALLINT NOT NULL DEFAULT 5,
    "classRoomManagement" SMALLINT NOT NULL DEFAULT 5,
    "teachingCoherence" SMALLINT NOT NULL DEFAULT 5,
    "grading" SMALLINT NOT NULL DEFAULT 5,
    "commentId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "professorId" INTEGER NOT NULL,

    CONSTRAINT "ProfessorRate_pkey" PRIMARY KEY ("professorId","userId","commentId")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProfessorRate_commentId_key" ON "ProfessorRate"("commentId");

-- AddForeignKey
ALTER TABLE "ProfessorRate" ADD CONSTRAINT "ProfessorRate_professorId_fkey" FOREIGN KEY ("professorId") REFERENCES "Professor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfessorRate" ADD CONSTRAINT "ProfessorRate_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfessorRate" ADD CONSTRAINT "ProfessorRate_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
