const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Phục vụ các file tĩnh ở thư mục hiện tại (frontend)
app.use(express.static(__dirname));

const PORT = process.env.PORT || 3000;

let dbPool;

// Kết nối Cơ sở dữ liệu MySQL
async function connectDB() {
    try {
        dbPool = mysql.createPool({
            host: process.env.DB_HOST || '127.0.0.1',
            port: parseInt(process.env.DB_PORT || '3306'),
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'techno_pos',
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });

        // Test connection
        const conn = await dbPool.getConnection();
        console.log('[DATABASE] Kết nối thành công tới Database MySQL!');
        conn.release();

        await initData();
    } catch (err) {
        console.error('\n============================================================');
        console.error('[LỖI DATABASE] Không thể kết nối tới cơ sở dữ liệu MySQL!');
        console.error('Chi tiết lỗi:', err.message);
        console.error('\nHướng dẫn khắc phục:');
        console.error('1. Đảm bảo MySQL Server (XAMPP/Laragon/Workbench) đang chạy.');
        console.error('2. Tạo database "techno_pos" trong MySQL Workbench.');
        console.error('3. Kiểm tra thông tin User/Password trong file .env');
        console.error('============================================================\n');
    }
}

// Khởi tạo bảng và chèn tài khoản mặc định
async function initData() {
    try {
        // Tạo bảng users nếu chưa có
        await dbPool.query(`
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
            )
        `);

        // Kiểm tra xem bảng users đã có dữ liệu chưa
        const [rows] = await dbPool.query('SELECT COUNT(*) as count FROM users');
        if (rows[0].count === 0) {
            console.log('[DATABASE] Bảng users trống. Tiến hành tạo tài khoản mẫu...');

            const defaultUsers = [
                { id: 'ADMIN', username: 'admin', password: '123', name: 'Super Admin', role: 'Super Admin', email: 'admin@techno.vn', phone: '0900000001', status: 'Hoạt động' },
                { id: 'NV001', username: 'messi', password: '123', name: 'Trần Văn Messi', role: 'Quản lý cửa hàng', email: 'messi@techno.vn', phone: '0901234561', status: 'Hoạt động' },
                { id: 'NV002', username: 'namdo', password: '123', name: 'Trần Thị Năm Đô', role: 'Nhân viên bán hàng', email: 'namdo@techno.vn', phone: '0901234562', status: 'Hoạt động' },
                { id: 'NV003', username: 'vanb', password: '123', name: 'Nguyễn Văn B', role: 'Thu ngân', email: 'vanb@techno.vn', phone: '0901234563', status: 'Hoạt động' },
                { id: 'NV008', username: 'ronaldo', password: '123', name: 'Trần Ronaldo', role: 'Nhân viên bán hàng', email: 'ronaldo@techno.vn', phone: '0901234568', status: 'Hoạt động' },
                { id: 'NV009', username: 'neymar', password: '123', name: 'Trần Neymar', role: 'Nhân viên bán hàng', email: 'neymar@techno.vn', phone: '0901234569', status: 'Hoạt động' },
                { id: 'NV010', username: 'namem', password: '123', name: 'Nam Em', role: 'Nhân viên bán hàng', email: 'namem@techno.vn', phone: '0901234570', status: 'Hoạt động' }
            ];

            for (const user of defaultUsers) {
                const passHash = bcrypt.hashSync(user.password, 10);
                await dbPool.query(
                    'INSERT INTO users (id, username, password_hash, name, role, email, phone, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                    [user.id, user.username, passHash, user.name, user.role, user.email, user.phone, user.status]
                );
            }
            console.log('[DATABASE] Đã chèn 7 tài khoản mặc định thành công! (Mật khẩu đều là: 123)');
        }
    } catch (err) {
        console.error('[DATABASE INIT ERROR] Lỗi khởi tạo bảng:', err.message);
    }
}

// --------------------------------------------------------------------------
// ENDPOINT 1: ĐĂNG NHẬP (AUTH LOGIN)
// --------------------------------------------------------------------------
app.post('/api/auth/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ status: 'error', message: 'Vui lòng cung cấp đầy đủ tài khoản và mật khẩu!' });
    }

    if (!dbPool) {
        return res.status(500).json({ status: 'error', message: 'Hệ thống Cơ sở dữ liệu MySQL chưa sẵn sàng!' });
    }

    try {
        const queryVal = username.trim().toLowerCase();
        
        // Tìm tài khoản theo username, email hoặc mã ID nhân viên
        const [users] = await dbPool.query(
            'SELECT * FROM users WHERE LOWER(username) = ? OR LOWER(email) = ? OR LOWER(id) = ?',
            [queryVal, queryVal, queryVal]
        );

        if (users.length === 0) {
            return res.status(401).json({ status: 'error', message: 'Tài khoản không tồn tại!' });
        }

        const user = users[0];

        if (user.status !== 'Hoạt động') {
            return res.status(403).json({ status: 'error', message: 'Tài khoản này đã bị khóa hoặc ngưng hoạt động!' });
        }

        // So khớp mật khẩu đã băm
        const isMatch = bcrypt.compareSync(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ status: 'error', message: 'Mật khẩu không chính xác!' });
        }

        // Đăng nhập thành công, trả về thông tin user (loại bỏ password_hash)
        const userProfile = {
            id: user.id,
            username: user.username,
            name: user.name,
            role: user.role,
            email: user.email,
            phone: user.phone,
            avatarUrl: user.avatar_url || '',
            status: user.status
        };

        res.json({
            status: 'success',
            message: 'Đăng nhập thành công!',
            user: userProfile
        });

    } catch (err) {
        console.error('[LOGIN ERROR]:', err.message);
        res.status(500).json({ status: 'error', message: 'Lỗi hệ thống đăng nhập!' });
    }
});

// --------------------------------------------------------------------------
// ENDPOINT 1B: CẬP NHẬT PROFILE TRONG DATABASE MYSQL
// --------------------------------------------------------------------------
app.post('/api/auth/update-profile', async (req, res) => {
    const { username, name, avatarUrl } = req.body;

    if (!username) {
        return res.status(400).json({ status: 'error', message: 'Thiếu thông tin username!' });
    }

    if (!dbPool) {
        return res.status(500).json({ status: 'error', message: 'Hệ thống Cơ sở dữ liệu MySQL chưa sẵn sàng!' });
    }

    try {
        await dbPool.query(
            'UPDATE users SET name = ?, avatar_url = ? WHERE LOWER(username) = ?',
            [name, avatarUrl, username.toLowerCase()]
        );
        res.json({
            status: 'success',
            message: 'Đã cập nhật profile vào MySQL database thành công!'
        });
    } catch (err) {
        console.error('[UPDATE PROFILE ERROR]:', err.message);
        res.status(500).json({ status: 'error', message: 'Lỗi hệ thống khi cập nhật profile!' });
    }
});

// --------------------------------------------------------------------------
// ENDPOINT 2: TỰ ĐỘNG LƯU BILL HÓA ĐƠN VÀO Ổ D
// --------------------------------------------------------------------------
app.post('/api/save-bill', (req, res) => {
    const { image, filename } = req.body;

    if (!image || !filename) {
        return res.status(400).json({ status: 'error', message: 'Thiếu dữ liệu hình ảnh hoặc tên file!' });
    }

    try {
        // Bảo mật chống trỏ ngược thư mục
        const sanitizedFilename = filename.replace(/\.\.\//g, '').replace(/\.\.\\/g, '');
        const targetDir = 'D:\\Lịch sử giao dịch';
        const fullPath = path.join(targetDir, sanitizedFilename);

        // Tạo các thư mục cha nếu chưa có
        const dirName = path.dirname(fullPath);
        if (!fs.existsSync(dirName)) {
            fs.mkdirSync(dirName, { recursive: true });
        }

        // Giải mã Base64 sang nhị phân
        let base64Data = image;
        if (image.includes(',')) {
            base64Data = image.split(',')[1];
        }

        const imageBuffer = Buffer.from(base64Data, 'base64');

        // Ghi file xuống ổ đĩa D
        fs.writeFileSync(fullPath, imageBuffer);
        console.log(`[SUCCESS] Hóa đơn đã được tự động lưu tại: ${fullPath}`);

        res.json({
            status: 'success',
            message: 'Đã lưu hóa đơn tự động thành công!',
            path: fullPath
        });

    } catch (err) {
        console.error('[SAVE BILL ERROR]:', err.message);
        res.status(500).json({ status: 'error', message: 'Không thể ghi tệp xuống ổ D: ' + err.message });
    }
});

// Khởi chạy server
app.listen(PORT, async () => {
    console.log('\n============================================================');
    console.log(` SERVER TECHNO POS ĐANG CHẠY TẠI: http://localhost:${PORT}`);
    console.log('============================================================');
    await connectDB();
});
