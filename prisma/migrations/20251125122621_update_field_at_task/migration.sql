/*
  Warnings:

  - You are about to drop the column `category` on the `tasks` table. All the data in the column will be lost.
  - You are about to drop the column `text` on the `tasks` table. All the data in the column will be lost.
  - Added the required column `title` to the `tasks` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `tasks` DROP COLUMN `category`,
    DROP COLUMN `text`,
    ADD COLUMN `desc` VARCHAR(191) NULL,
    ADD COLUMN `title` VARCHAR(191) NOT NULL;
