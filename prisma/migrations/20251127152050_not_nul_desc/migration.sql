/*
  Warnings:

  - Made the column `desc` on table `tasks` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `tasks` MODIFY `desc` VARCHAR(191) NOT NULL;
