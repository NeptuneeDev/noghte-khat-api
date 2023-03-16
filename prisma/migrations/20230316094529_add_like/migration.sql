-- CreateEnum
CREATE TYPE "UserReaction" AS ENUM ('like', 'dislike');

-- AlterTable
ALTER TABLE "File" ADD COLUMN     "numberOfDisLikes" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "numberOfLikes" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "UserFileReaction" (
    "fileId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "reaction" "UserReaction" NOT NULL,

    CONSTRAINT "UserFileReaction_pkey" PRIMARY KEY ("fileId","userId")
);

-- AddForeignKey
ALTER TABLE "UserFileReaction" ADD CONSTRAINT "UserFileReaction_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserFileReaction" ADD CONSTRAINT "UserFileReaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
