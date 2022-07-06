CREATE TABLE `users` (
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `clientid` VARCHAR(64) NOT NULL,
    `username` VARCHAR(64) NOT NULL,
    PRIMARY KEY (`id`) USING BTREE,
);