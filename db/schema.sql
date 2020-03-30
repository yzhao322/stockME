-- Drops the blogger if it exists currently --
DROP DATABASE IF EXISTS user_db;

-- Creates the "blogger" database --
CREATE DATABASE user_db;
use user_db;
update users set title = "Manager"
where email = "yan@123.com";
update users set title = "Master"
where email = "yan@234.com";
select * from stocks;
select * from users;
select * from StockPurchasedByUsers;


