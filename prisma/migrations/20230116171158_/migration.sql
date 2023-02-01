-- AlterTable
ALTER TABLE "Professor" ADD COLUMN     "isVerified" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Subject" ADD COLUMN     "isVerified" BOOLEAN NOT NULL DEFAULT false;
