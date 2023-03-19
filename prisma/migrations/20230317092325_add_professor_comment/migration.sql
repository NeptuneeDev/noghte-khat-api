-- CreateEnum
CREATE TYPE "classType" AS ENUM ('General', 'Professional', 'Science');

-- CreateTable
CREATE TABLE "Comment" (
    "subjectName" TEXT NOT NULL,
    "rollcall" TEXT NOT NULL,
    "type" "classType",
    "teaching" SMALLINT NOT NULL DEFAULT 5,
    "rhetorical" SMALLINT NOT NULL DEFAULT 5,
    "manageClass" SMALLINT NOT NULL DEFAULT 5,
    "ability" SMALLINT NOT NULL DEFAULT 5,
    "semester" TIMESTAMP(3),
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "professorId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("professorId","userId")
);

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_professorId_fkey" FOREIGN KEY ("professorId") REFERENCES "Professor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
