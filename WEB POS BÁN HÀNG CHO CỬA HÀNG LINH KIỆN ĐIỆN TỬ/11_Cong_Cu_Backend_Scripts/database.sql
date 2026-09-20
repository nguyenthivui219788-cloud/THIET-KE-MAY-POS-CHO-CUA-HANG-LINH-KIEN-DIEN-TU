-- --------------------------------------------------------------------------
-- SCRIPT KHỞI TẠO CƠ SỞ DỮ LIỆU TECHNO POS CHO MYSQL WORKBENCH
-- --------------------------------------------------------------------------

-- 1. Tạo Database nếu chưa tồn tại
CREATE DATABASE IF NOT EXISTS techno_pos;
USE techno_pos;

-- 2. Tạo bảng quản lý tài khoản người dùng và nhân viên (users)
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(50) PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    role VARCHAR(50) NOT NULL,
    email VARCHAR(100),
    phone VARCHAR(20),
    avatar_url LONGTEXT,
    status VARCHAR(20) DEFAULT 'Hoạt động',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
