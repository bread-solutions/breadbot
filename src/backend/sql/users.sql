CREATE TABLE `users` (
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `clientid` VARCHAR(255) NOT NULL,
    `username` VARCHAR(255) NOT NULL,
    `warns` INT,
    `kicks` INT,
    `mutes` INT,
    `bans` INT,
    `lvl` VARCHAR(255) NOT NULL,
    `xp` VARCHAR(255) NOT NULL,
     PRIMARY KEY (`id`) USING BTREE
);