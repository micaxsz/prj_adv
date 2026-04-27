/*
  Warnings:

  - Added the required column `isi` to the `detail_tutorial` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `detail_tutorial` ADD COLUMN `isi` VARCHAR(191) NOT NULL;
