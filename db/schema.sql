-- Drops the blogger if it exists currently --
DROP DATABASE IF EXISTS user_db;
-- Creates the "blogger" database --
CREATE DATABASE user_db;
drop table users;
select * from users;
update users set title = "Manager"
where email = "yan@123.com";