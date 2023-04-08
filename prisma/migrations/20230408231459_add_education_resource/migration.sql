/*
  Warnings:

  - Added the required column `averageRates` to the `Comment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `educationResources` to the `Comment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "averageRates" DECIMAL(2,1) NOT NULL,
ADD COLUMN     "educationResources" TEXT NOT NULL;
