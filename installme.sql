CREATE DATABASE IF NOT EXISTS `breadbot`;

USE `breadbot`;

CREATE TABLE `moderation` (
	`caseid` INT(11) NOT NULL AUTO_INCREMENT,
	`action` TEXT NOT NULL COLLATE 'utf8mb4_general_ci',
	`perpid` VARCHAR(255) NOT NULL COLLATE 'utf8mb4_general_ci',
	`perpusername` VARCHAR(255) NOT NULL COLLATE 'utf8mb4_general_ci',
	`reason` TEXT NOT NULL COLLATE 'utf8mb4_general_ci',
	`modid` VARCHAR(255) NOT NULL COLLATE 'utf8mb4_general_ci',
	`modusername` VARCHAR(255) NOT NULL COLLATE 'utf8mb4_general_ci',
	`date` VARCHAR(255) NOT NULL COLLATE 'utf8mb4_general_ci',
	`isActiveMute` TINYINT(1) NOT NULL,
	`roles` LONGTEXT NULL DEFAULT NULL COLLATE 'utf8mb4_bin',
	`muteTime` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
	PRIMARY KEY (`caseid`) USING BTREE,
	CONSTRAINT `roles` CHECK (json_valid(`roles`))
)
COLLATE='utf8mb4_general_ci'
ENGINE=InnoDB
AUTO_INCREMENT=26
;

CREATE TABLE `users` (
	`id` INT(11) NOT NULL AUTO_INCREMENT,
	`clientid` VARCHAR(255) NOT NULL COLLATE 'utf8mb4_general_ci',
	`username` VARCHAR(255) NOT NULL COLLATE 'utf8mb4_general_ci',
	`messages` INT(11) NULL DEFAULT NULL,
	`lvl` VARCHAR(255) NOT NULL COLLATE 'utf8mb4_general_ci',
	`xp` VARCHAR(255) NOT NULL COLLATE 'utf8mb4_general_ci',
	PRIMARY KEY (`id`) USING BTREE
)
COLLATE='utf8mb4_general_ci'
ENGINE=InnoDB
AUTO_INCREMENT=11
;
