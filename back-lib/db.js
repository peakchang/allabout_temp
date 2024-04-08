import mysql, {} from "mysql2"
import dotenv from "dotenv"
dotenv.config();


export const sql_con = mysql.createConnection({
    host: process.env.HOST || '127.0.0.1',
    user: 'root',
    password: process.env.DBPWD,
    database: process.env.SHEMA
})


/*

CREATE DATABASE atb default CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE DATABASE happy_toad default CHARACTER SET UTF8;
CREATE DATABASE joy_shark default CHARACTER SET UTF8;

CREATE TABLE IF NOT EXISTS config(
    cf_base VARCHAR(10),
    cf_pwd VARCHAR(255)
);

INSERT INTO config (cf_base) VALUES ('base');

CREATE TABLE IF NOT EXISTS board(
    bo_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    bo_category VARCHAR(255),
    bo_subject VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    bo_content TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    bo_created_at DATETIME,
    bo_updated_at DATETIME
);

CREATE TABLE IF NOT EXISTS reply(
    re_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    re_type VARCHAR(50) NOT NULL,
    re_parent VARCHAR(10) NOT NULL,
    re_re_parent VARCHAR(10),
    re_ip VARCHAR(50),
    re_content TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    re_created_at DATETIME
);

CREATE TABLE IF NOT EXISTS sub_board(
    sb_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    sb_domain VARCHAR(255),
    sb_subject VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    sb_content TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    sb_created_at DATETIME,
    sb_updated_at DATETIME
);

*/