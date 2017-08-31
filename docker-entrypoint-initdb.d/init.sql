# create database
CREATE DATABASE IF NOT EXISTS tryit CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# create user
CREATE USER IF NOT EXISTS 'express'@'localhost' IDENTIFIED BY 'mypass';
GRANT ALL ON tryit.* TO 'express'@'localhost';
