CREATE TABLE `attendance_records` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`date` timestamp NOT NULL,
	`employment_type` enum('clt','terceirizado','diarista') NOT NULL,
	`daily_value` varchar(20) NOT NULL,
	`pix_key` varchar(255) NOT NULL,
	`function` varchar(100) NOT NULL,
	`observations` text,
	`payment_status` enum('pendente','pago','atrasado','cancelado') NOT NULL DEFAULT 'pendente',
	`paid_at` timestamp,
	`paid_by` int,
	`registered_by` int NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `attendance_records_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `cargo_shipments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`truck_id` int NOT NULL,
	`driver_id` int NOT NULL,
	`date` timestamp NOT NULL,
	`height` varchar(20) NOT NULL,
	`width` varchar(20) NOT NULL,
	`length` varchar(20) NOT NULL,
	`volume` varchar(20) NOT NULL,
	`destination` varchar(255),
	`invoice_number` varchar(100),
	`wood_type` varchar(100),
	`client` varchar(255),
	`images_urls` text,
	`registered_by` int NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `cargo_shipments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `equipment` (
	`id` int AUTO_INCREMENT NOT NULL,
	`type_id` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`brand` varchar(100),
	`model` varchar(100),
	`year` int,
	`serial_number` varchar(100),
	`image_url` text,
	`status` enum('ativo','manutencao','inativo') NOT NULL DEFAULT 'ativo',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `equipment_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `equipment_types` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `equipment_types_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `fuel_records` (
	`id` int AUTO_INCREMENT NOT NULL,
	`equipment_id` int NOT NULL,
	`operator_id` int NOT NULL,
	`date` timestamp NOT NULL,
	`fuel_type` enum('diesel','gasolina','mistura_2t') NOT NULL,
	`liters` varchar(20) NOT NULL,
	`total_value` varchar(20) NOT NULL,
	`price_per_liter` varchar(20),
	`odometer` varchar(20),
	`station` varchar(255),
	`invoice_url` text,
	`odometer_image_url` text,
	`registered_by` int NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `fuel_records_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_profiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`profile_type` enum('administrativo','encarregado','mecanico','motosserrista','carregador','operador','motorista','terceirizado') NOT NULL,
	`cpf` varchar(14),
	`phone` varchar(20),
	`pix_key` varchar(255),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `user_profiles_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `attendance_records` ADD CONSTRAINT `attendance_records_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `attendance_records` ADD CONSTRAINT `attendance_records_paid_by_users_id_fk` FOREIGN KEY (`paid_by`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `attendance_records` ADD CONSTRAINT `attendance_records_registered_by_users_id_fk` FOREIGN KEY (`registered_by`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `cargo_shipments` ADD CONSTRAINT `cargo_shipments_truck_id_equipment_id_fk` FOREIGN KEY (`truck_id`) REFERENCES `equipment`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `cargo_shipments` ADD CONSTRAINT `cargo_shipments_driver_id_users_id_fk` FOREIGN KEY (`driver_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `cargo_shipments` ADD CONSTRAINT `cargo_shipments_registered_by_users_id_fk` FOREIGN KEY (`registered_by`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `equipment` ADD CONSTRAINT `equipment_type_id_equipment_types_id_fk` FOREIGN KEY (`type_id`) REFERENCES `equipment_types`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `fuel_records` ADD CONSTRAINT `fuel_records_equipment_id_equipment_id_fk` FOREIGN KEY (`equipment_id`) REFERENCES `equipment`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `fuel_records` ADD CONSTRAINT `fuel_records_operator_id_users_id_fk` FOREIGN KEY (`operator_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `fuel_records` ADD CONSTRAINT `fuel_records_registered_by_users_id_fk` FOREIGN KEY (`registered_by`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_profiles` ADD CONSTRAINT `user_profiles_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;