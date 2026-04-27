-- CreateTable
CREATE TABLE `tutorial` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `judul` VARCHAR(191) NOT NULL,
    `foto` VARCHAR(191) NOT NULL,
    `kode_matkul` VARCHAR(191) NOT NULL,
    `matkul` VARCHAR(191) NOT NULL,
    `creator_email` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `url_presentation` VARCHAR(191) NOT NULL,
    `url_finished` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `tutorial_url_presentation_key`(`url_presentation`),
    UNIQUE INDEX `tutorial_url_finished_key`(`url_finished`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `detail_tutorial` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tipe` ENUM('text', 'gambar', 'code', 'url') NOT NULL,
    `order` INTEGER NOT NULL,
    `status` ENUM('show', 'hide') NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `tutorial_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `detail_tutorial` ADD CONSTRAINT `detail_tutorial_tutorial_id_fkey` FOREIGN KEY (`tutorial_id`) REFERENCES `tutorial`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
