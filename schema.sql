-- Drops the blogger if it exists currently --
DROP DATABASE IF EXISTS user_db;
-- Creates the "blogger" database --
CREATE DATABASE user_db;
drop table stocks;
select * from stocks;
select * from users;
update users set title = "Manager" 
where id = 1;