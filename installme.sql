CREATE DATABASE IF NOT EXISTS `breadbot`;
USE `breadbot`;


CREATE TABLE `chatlvl` (
	`id` INT(11) NOT NULL AUTO_INCREMENT,
	`discordId` VARCHAR(255) NOT NULL COLLATE 'utf8_general_ci',
	`xplvl` VARCHAR(255) NULL DEFAULT '1' COLLATE 'utf8_general_ci',
	`xpNum` VARCHAR(255) NULL DEFAULT '0' COLLATE 'utf8_general_ci',
	PRIMARY KEY (`id`) USING BTREE
)
COLLATE='utf8_general_ci'
ENGINE=InnoDB
AUTO_INCREMENT=10;

CREATE TABLE `stickymessages` (
	`id` INT(11) NOT NULL AUTO_INCREMENT,
	`channelid` VARCHAR(255) NOT NULL COLLATE 'utf8_general_ci',
	`messageTxT` TEXT NOT NULL COLLATE 'utf8_general_ci',
	PRIMARY KEY (`id`) USING BTREE
)
COLLATE='utf8_general_ci'
ENGINE=InnoDB
AUTO_INCREMENT=10;

CREATE TABLE `moderation` (
	`caseid` INT(11) NOT NULL AUTO_INCREMENT,
	`action` TEXT NOT NULL COLLATE 'utf8_general_ci',
	`perpid` VARCHAR(255) NOT NULL COLLATE 'utf8_general_ci',
	`reason` TEXT NOT NULL COLLATE 'utf8_general_ci',
	`moderator` VARCHAR(255) NOT NULL COLLATE 'utf8_general_ci',
	PRIMARY KEY (`caseid`) USING BTREE
)
COLLATE='utf8_general_ci'
ENGINE=InnoDB
AUTO_INCREMENT=41
;

CREATE TABLE `mutedata` (
	`id` INT(11) NOT NULL AUTO_INCREMENT,
	`discordId` VARCHAR(255) NOT NULL,
	`prevroles` JSON,
	`muteTime` VARCHAR(255),
	PRIMARY KEY (`id`) USING BTREE
);