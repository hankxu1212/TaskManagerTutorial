/*
  Warnings:

  - You are about to drop the column `teamId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `ProjectTeam` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Team` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ProjectTeam" DROP CONSTRAINT "ProjectTeam_projectId_fkey";

-- DropForeignKey
ALTER TABLE "ProjectTeam" DROP CONSTRAINT "ProjectTeam_teamId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_teamId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "teamId";

-- DropTable
DROP TABLE "ProjectTeam";

-- DropTable
DROP TABLE "Team";
