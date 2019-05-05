DROP DATABASE Users;
CREATE DATABASE IF NOT EXISTS `Users` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `Users`;
CREATE TABLE IF NOT EXISTS `accounts` (
`id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
`username` TEXT NOT NULL,
`password` TEXT NOT NULL,
`email` TEXT NOT NULL,
`created` TEXT NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
alter user 'root'@'localhost' identified with mysql_native_password by 'root';