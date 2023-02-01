/*
  Warnings:

  - You are about to drop the column `status` on the `User` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('User', 'Admin');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "status",
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'User';
