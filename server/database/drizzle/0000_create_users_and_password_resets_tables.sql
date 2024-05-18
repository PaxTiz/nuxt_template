CREATE TABLE `users` (
	`id` varchar(36) NOT NULL,
	`firstname` varchar(191) NOT NULL,
	`lastname` varchar(191) NOT NULL,
	`email` varchar(191) NOT NULL,
	`password` varchar(191) NOT NULL,
	`address_line1` varchar(191) NOT NULL,
	`address_line2` varchar(191),
	`address_postal_code` varchar(5),
	`address_city` varchar(191) NOT NULL,
	`is_enabled` boolean NOT NULL DEFAULT false,
	`validation_code` varchar(16),
	`role` enum('SUPER_ADMIN','ADMIN','USER') NOT NULL DEFAULT 'USER',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`),
	CONSTRAINT `users_validation_code_unique` UNIQUE(`validation_code`)
);
--> statement-breakpoint
CREATE TABLE `password_resets` (
	`token` varchar(16) NOT NULL,
	`user_id` varchar(36) NOT NULL,
	CONSTRAINT `password_resets_token` PRIMARY KEY(`token`),
	CONSTRAINT `password_resets_token_unique` UNIQUE(`token`)
);
--> statement-breakpoint
ALTER TABLE `password_resets` ADD CONSTRAINT `password_resets_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;