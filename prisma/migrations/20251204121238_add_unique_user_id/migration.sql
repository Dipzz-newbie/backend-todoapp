/*
  Warnings:

  - A unique constraint covering the columns `[userId,userAgent]` on the table `refresh_token` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userAgent` to the `refresh_token` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `refresh_token_token_key` ON `refresh_token`;

-- AlterTable
ALTER TABLE `refresh_token` ADD COLUMN `userAgent` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `refresh_token_userId_userAgent_key` ON `refresh_token`(`userId`, `userAgent`);
