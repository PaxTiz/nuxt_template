CREATE TABLE `__jobs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(191) NOT NULL,
	`data` json NOT NULL,
	`allowed_retries` int NOT NULL DEFAULT 0,
	`current_retries` int NOT NULL DEFAULT 0,
	`fatal` boolean NOT NULL DEFAULT false,
	`status` enum('pending','success','failed','retry') DEFAULT 'pending',
	`created_at` datetime NOT NULL DEFAULT NOW(),
	`processed_at` datetime,
	CONSTRAINT `__jobs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `status_index` ON `__jobs` (`status`);