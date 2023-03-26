-- AlterTable
ALTER TABLE "Professor" ADD COLUMN     "averageClassRoomManagement" SMALLINT NOT NULL DEFAULT 5,
ADD COLUMN     "averageGrading" SMALLINT NOT NULL DEFAULT 5,
ADD COLUMN     "averageSubjectMastry" SMALLINT NOT NULL DEFAULT 5,
ADD COLUMN     "averageTeachingCoherence" SMALLINT NOT NULL DEFAULT 5;
