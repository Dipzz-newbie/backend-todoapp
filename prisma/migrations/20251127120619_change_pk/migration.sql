-- DropForeignKey
ALTER TABLE `tasks` DROP FOREIGN KEY `tasks_userId_fkey`;

-- AlterTable
ALTER TABLE `tasks` MODIFY `userId` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE INDEX `tasks_id_idx` ON `tasks`(`id`);

-- AddForeignKey
ALTER TABLE `tasks` ADD CONSTRAINT `tasks_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
