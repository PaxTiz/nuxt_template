CREATE TABLE `__medias` (
	`id` int AUTO_INCREMENT NOT NULL,
	`filename` varchar(191) NOT NULL,
	`original_filename` varchar(191) NOT NULL,
	`public_path` varchar(255) NOT NULL,
	`disk_path` varchar(255) NOT NULL,
	`width` int,
	`height` int,
	`mime_type` varchar(191),
	`modifiers_key` varchar(191),
	`parent_id` int,
	`created_at` datetime NOT NULL,
	CONSTRAINT `__medias_id` PRIMARY KEY(`id`),
	CONSTRAINT `__medias_diskPath_unique` UNIQUE(`disk_path`)
);
--> statement-breakpoint
ALTER TABLE `__medias` ADD CONSTRAINT `__medias_parent_id___medias_id_fk` FOREIGN KEY (`parent_id`) REFERENCES `__medias`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `public_path_index` ON `__medias` (`public_path`);--> statement-breakpoint
CREATE INDEX `public_path_modifiers_index` ON `__medias` (`public_path`,`modifiers_key`);