-- Drops the blogger if it exists currently --
DROP DATABASE IF EXISTS user_db;

-- Creates the "blogger" database --
CREATE DATABASE user_db;
use user_db;
select * from users;
select * from stockpurchasedbyuser;
update users set title = "Master"
where email = "yan@123.com";
update users set title = "Manager"
where email = "saint@123.com";
drop table stocks;
drop table users;
select * from StockPurchasedByUsers;
drop table StockPurchasedByUsers;
update StockPurchasedByUsers set purchasePrice = 1000
where id = 4;

