/*
  Warnings:

  - You are about to alter the column `averageClassRoomManagement` on the `Professor` table. The data in that column could be lost. The data in that column will be cast from `SmallInt` to `Decimal(2,1)`.
  - You are about to alter the column `averageGrading` on the `Professor` table. The data in that column could be lost. The data in that column will be cast from `SmallInt` to `Decimal(2,1)`.
  - You are about to alter the column `averageSubjectMastry` on the `Professor` table. The data in that column could be lost. The data in that column will be cast from `SmallInt` to `Decimal(2,1)`.
  - You are about to alter the column `averageTeachingCoherence` on the `Professor` table. The data in that column could be lost. The data in that column will be cast from `SmallInt` to `Decimal(2,1)`.
  - You are about to alter the column `subjectMastry` on the `ProfessorRate` table. The data in that column could be lost. The data in that column will be cast from `SmallInt` to `Decimal(2,1)`.
  - You are about to alter the column `classRoomManagement` on the `ProfessorRate` table. The data in that column could be lost. The data in that column will be cast from `SmallInt` to `Decimal(2,1)`.
  - You are about to alter the column `teachingCoherence` on the `ProfessorRate` table. The data in that column could be lost. The data in that column will be cast from `SmallInt` to `Decimal(2,1)`.
  - You are about to alter the column `grading` on the `ProfessorRate` table. The data in that column could be lost. The data in that column will be cast from `SmallInt` to `Decimal(2,1)`.

*/
-- AlterTable
ALTER TABLE "Professor" ALTER COLUMN "averageClassRoomManagement" SET DEFAULT 5,
ALTER COLUMN "averageClassRoomManagement" SET DATA TYPE DECIMAL(2,1),
ALTER COLUMN "averageGrading" SET DEFAULT 5,
ALTER COLUMN "averageGrading" SET DATA TYPE DECIMAL(2,1),
ALTER COLUMN "averageSubjectMastry" SET DEFAULT 5,
ALTER COLUMN "averageSubjectMastry" SET DATA TYPE DECIMAL(2,1),
ALTER COLUMN "averageTeachingCoherence" SET DEFAULT 5,
ALTER COLUMN "averageTeachingCoherence" SET DATA TYPE DECIMAL(2,1);

-- AlterTable
ALTER TABLE "ProfessorRate" ALTER COLUMN "subjectMastry" DROP DEFAULT,
ALTER COLUMN "subjectMastry" SET DATA TYPE DECIMAL(2,1),
ALTER COLUMN "classRoomManagement" DROP DEFAULT,
ALTER COLUMN "classRoomManagement" SET DATA TYPE DECIMAL(2,1),
ALTER COLUMN "teachingCoherence" DROP DEFAULT,
ALTER COLUMN "teachingCoherence" SET DATA TYPE DECIMAL(2,1),
ALTER COLUMN "grading" DROP DEFAULT,
ALTER COLUMN "grading" SET DATA TYPE DECIMAL(2,1);
