ALTER TABLE `users` MODIFY COLUMN `created_at` datetime NOT NULL DEFAULT NOW();--> statement-breakpoint
ALTER TABLE `users` ADD `last_login_at` datetime DEFAULT NOW() NOT NULL;