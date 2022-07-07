CREATE TABLE `moderation` (
    `caseid` INT(11) NOT NULL AUTO_INCREMENT,
    `action` TEXT NOT NULL,
    `prepid` VARCHAR(255) NOT NULL,
    `prepusername` VARCHAR(255) NOT NULL,
    `reason` TEXT NOT NULL,
    `modid` VARCHAR(255) NOT NULL,
    `modeusername` VARCHAR(255) NOT NULL,
    `date` VARCHAR(255) NOT NULL,
    `isActiveMute` BOOLEAN NOT NULL,
    `roles` JSON,
    `muteTime` VARCHAR(255) ,
     PRIMARY KEY (`caseid`) USING BTREE
);