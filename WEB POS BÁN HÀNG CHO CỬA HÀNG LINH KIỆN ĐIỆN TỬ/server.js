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
        
        // Tạo bảng invoices trong MySQL nếu chưa có
        await dbPool.query(`
            CREATE TABLE IF NOT EXISTS invoices (
                id VARCHAR(50) PRIMARY KEY,
                customer VARCHAR(100) DEFAULT 'Khách lẻ',
                seller VARCHAR(100) DEFAULT 'Super Admin',
                total DECIMAL(15,2) DEFAULT 0,
                discount DECIMAL(15,2) DEFAULT 0,
                final_total DECIMAL(15,2) DEFAULT 0,
                payment_method VARCHAR(50) DEFAULT 'Tiền mặt',
                status VARCHAR(50) DEFAULT 'Đã thanh toán',
                date VARCHAR(20),
                time VARCHAR(20),
                items_json LONGTEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        
        // Tạo bảng products trong MySQL nếu chưa có
        await dbPool.query(`
            CREATE TABLE IF NOT EXISTS products (
                id VARCHAR(50) PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                category VARCHAR(100) NOT NULL,
                price DECIMAL(15,2) DEFAULT 0,
                stock INT DEFAULT 0,
                image LONGTEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Tạo bảng vouchers trong MySQL nếu chưa có
        await dbPool.query(`
            CREATE TABLE IF NOT EXISTS vouchers (
                id VARCHAR(50) PRIMARY KEY,
                code VARCHAR(50) UNIQUE NOT NULL,
                discount_type VARCHAR(20) DEFAULT 'percent',
                discount_value DECIMAL(15,2) DEFAULT 0,
                min_order DECIMAL(15,2) DEFAULT 0,
                max_discount DECIMAL(15,2) DEFAULT 0,
                usage_limit INT DEFAULT 100,
                used_count INT DEFAULT 0,
                status VARCHAR(20) DEFAULT 'Hoạt động',
                apply_to VARCHAR(50) DEFAULT 'all',
                apply_value VARCHAR(100) DEFAULT '',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Seed sản phẩm mẫu nếu bảng products trống
        const [prodRows] = await dbPool.query('SELECT COUNT(*) as count FROM products');
        if (prodRows[0].count === 0) {
            console.log('[DATABASE] Bảng products trống. Chèn 25 linh kiện mẫu...');
            const defaultProds = [
                { id: 'M1', name: 'Intel Core i9-14900K', category: 'CPU', price: 14500000, stock: 15, image: 'https://images.unsplash.com/photo-1591453089816-0fbb971b454c?w=400&q=80' },
                { id: 'M2', name: 'Intel Core i7-14700KF', category: 'CPU', price: 7290000, stock: 20, image: 'https://images.unsplash.com/photo-1591453089816-0fbb971b454c?w=400&q=80' },
                { id: 'M3', name: 'AMD Ryzen 7 7800X3D', category: 'CPU', price: 10200000, stock: 12, image: 'https://images.unsplash.com/photo-1591453089816-0fbb971b454c?w=400&q=80' },
                { id: 'M4', name: 'RTX 4090 24GB', category: 'VGA', price: 46000000, stock: 5, image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=400&q=80' },
                { id: 'M5', name: 'RTX 4070 Ti 12GB', category: 'VGA', price: 21000000, stock: 10, image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=400&q=80' },
                { id: 'M6', name: 'MSI RTX 4060 Ventus 2X 8GB', category: 'VGA', price: 8500000, stock: 18, image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=400&q=80' },
                { id: 'M7', name: 'RAM Corsair Vengeance RGB 32GB (2x16GB) DDR5', category: 'RAM', price: 3200000, stock: 25, image: 'https://images.unsplash.com/photo-1562976540-1502c2145186?w=400&q=80' },
                { id: 'M8', name: 'RAM 16GB (2x8GB) DDR4 3200MHz', category: 'RAM', price: 1690000, stock: 30, image: 'https://images.unsplash.com/photo-1562976540-1502c2145186?w=400&q=80' },
                { id: 'M9', name: 'RAM 32GB (2x16GB) DDR5 6000MHz', category: 'RAM', price: 4000000, stock: 20, image: 'https://images.unsplash.com/photo-1562976540-1502c2145186?w=400&q=80' },
                { id: 'M10', name: 'SSD Samsung 990 Pro 2TB NVMe', category: 'SSD', price: 4800000, stock: 15, image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&q=80' },
                { id: 'M11', name: 'SSD Kingston NV2 1TB NVMe PCIe 4.0', category: 'SSD', price: 1390000, stock: 20, image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&q=80' },
                { id: 'M12', name: 'SSD WD Black SN850X 1TB', category: 'SSD', price: 2800000, stock: 14, image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&q=80' },
                { id: 'M13', name: 'Mainboard ASUS TUF B650M-PLUS', category: 'Mainboard', price: 2690000, stock: 15, image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=80' },
                { id: 'M14', name: 'Mainboard MSI B760M Mortar WiFi', category: 'Mainboard', price: 2690000, stock: 8, image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=80' },
                { id: 'M15', name: 'Mainboard Gigabyte Z790 AORUS Elite', category: 'Mainboard', price: 7500000, stock: 10, image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=80' },
                { id: 'M16', name: 'Nguồn Corsair RM850e 850W Gold', category: 'Nguồn', price: 3200000, stock: 15, image: 'https://images.unsplash.com/photo-1616440347437-b1c73416efc2?w=400&q=80' },
                { id: 'M17', name: 'Nguồn MSI MAG A750GL 750W', category: 'Nguồn', price: 2190000, stock: 20, image: 'https://images.unsplash.com/photo-1616440347437-b1c73416efc2?w=400&q=80' },
                { id: 'M18', name: 'Nguồn ASUS ROG Thor 1000W Platinum', category: 'Nguồn', price: 7500000, stock: 6, image: 'https://images.unsplash.com/photo-1616440347437-b1c73416efc2?w=400&q=80' },
                { id: 'M19', name: 'Màn hình ASUS ROG Swift PG27AQDM OLED 27"', category: 'Màn hình', price: 18500000, stock: 8, image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&q=80' },
                { id: 'M20', name: 'Màn hình Samsung Odyssey G5 27" 165Hz', category: 'Màn hình', price: 5490000, stock: 12, image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&q=80' },
                { id: 'M21', name: 'Màn hình Dell UltraSharp U2424H 24"', category: 'Màn hình', price: 4890000, stock: 15, image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&q=80' },
                { id: 'M22', name: 'Chuột Logitech G Pro X Superlight 2', category: 'Gear', price: 3800000, stock: 20, image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=400&q=80' },
                { id: 'M23', name: 'Bàn phím cơ ASUS ROG Azoth', category: 'Gear', price: 6200000, stock: 10, image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&q=80' },
                { id: 'M24', name: 'Tai nghe Kingston HyperX Cloud III', category: 'Gear', price: 2490000, stock: 15, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80' },
                { id: 'M25', name: 'Lót chuột SteelSeries QCK Large', category: 'Gear', price: 450000, stock: 40, image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=400&q=80' }
            ];
            for (const p of defaultProds) {
                await dbPool.query('INSERT INTO products (id, name, category, price, stock, image) VALUES (?, ?, ?, ?, ?, ?)', [p.id, p.name, p.category, p.price, p.stock, p.image]);
            }
        }

        // Seed voucher mẫu nếu bảng vouchers trống
        const [vouchRows] = await dbPool.query('SELECT COUNT(*) as count FROM vouchers');
        if (vouchRows[0].count === 0) {
            console.log('[DATABASE] Bảng vouchers trống. Chèn 4 voucher mẫu...');
            const defaultVouchers = [
                { id: 'VCH1', code: 'SALES10', discount_type: 'percent', discount_value: 10, min_order: 1000000, max_discount: 2000000, usage_limit: 100, used_count: 12, status: 'Hoạt động' },
                { id: 'VCH2', code: 'VIP20', discount_type: 'percent', discount_value: 20, min_order: 5000000, max_discount: 5000000, usage_limit: 50, used_count: 8, status: 'Hoạt động' },
                { id: 'VCH3', code: 'WELCOME50K', discount_type: 'fixed', discount_value: 50000, min_order: 500000, max_discount: 50000, usage_limit: 200, used_count: 45, status: 'Hoạt động' },
                { id: 'VCH4', code: 'TECHNO100K', discount_type: 'fixed', discount_value: 100000, min_order: 2000000, max_discount: 100000, usage_limit: 100, used_count: 19, status: 'Hoạt động' }
            ];
            for (const v of defaultVouchers) {
                await dbPool.query(
                    'INSERT INTO vouchers (id, code, discount_type, discount_value, min_order, max_discount, usage_limit, used_count, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
                    [v.id, v.code, v.discount_type, v.discount_value, v.min_order, v.max_discount, v.usage_limit, v.used_count, v.status]
                );
            }
        }

        await dbPool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id VARCHAR(50) PRIMARY KEY,
                username VARCHAR(50) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                password_raw VARCHAR(100) DEFAULT '123',
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
                    'INSERT INTO users (id, username, password_hash, password_raw, name, role, email, phone, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
                    [user.id, user.username, passHash, user.password, user.name, user.role, user.email, user.phone, user.status]
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
// ENDPOINTS FOR USER / STAFF MANAGEMENT IN DATABASE
// --------------------------------------------------------------------------
app.get('/api/users', async (req, res) => {
    if (!dbPool) return res.status(500).json({ status: 'error', message: 'Hệ thống CSDL chưa sẵn sàng!' });
    try {
        const [rows] = await dbPool.query('SELECT id, username, password_raw, name, role, email, phone, avatar_url, status FROM users');
        res.json({ status: 'success', data: rows });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
});

app.post('/api/users', async (req, res) => {
    if (!dbPool) return res.status(500).json({ status: 'error', message: 'Hệ thống CSDL chưa sẵn sàng!' });
    const { id, username, password, name, role, email, phone, avatar_url, status } = req.body;
    try {
        const passHash = bcrypt.hashSync(password || '123', 10);
        await dbPool.query(
            'INSERT INTO users (id, username, password_hash, password_raw, name, role, email, phone, avatar_url, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [id, username, passHash, password || '123', name, role, email || '', phone || '', avatar_url || '', status || 'Hoạt động']
        );
        res.json({ status: 'success', message: 'Thêm nhân viên thành công!' });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
});

app.put('/api/users/:id', async (req, res) => {
    if (!dbPool) return res.status(500).json({ status: 'error', message: 'Hệ thống CSDL chưa sẵn sàng!' });
    const { id } = req.params;
    const { username, password, name, role, email, phone, avatar_url, status } = req.body;
    try {
        let queryStr = 'UPDATE users SET username = ?, name = ?, role = ?, email = ?, phone = ?, avatar_url = ?, status = ?';
        let params = [username, name, role, email || '', phone || '', avatar_url || '', status];
        
        if (password) {
            const passHash = bcrypt.hashSync(password, 10);
            queryStr += ', password_hash = ?, password_raw = ?';
            params.push(passHash, password);
        }
        
        queryStr += ' WHERE id = ?';
        params.push(id);
        
        await dbPool.query(queryStr, params);
        res.json({ status: 'success', message: 'Cập nhật nhân viên thành công!' });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
});

app.delete('/api/users/:id', async (req, res) => {
    if (!dbPool) return res.status(500).json({ status: 'error', message: 'Hệ thống CSDL chưa sẵn sàng!' });
    const { id } = req.params;
    try {
        await dbPool.query('DELETE FROM users WHERE id = ?', [id]);
        res.json({ status: 'success', message: 'Xóa nhân viên thành công!' });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
});

// ----------------------------------------------------------------------------------------------------------
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



// --------------------------------------------------------------------------
// ENDPOINTS QUẢN LÝ SẢN PHẨM MYSQL (PRODUCTS CRUD)
// --------------------------------------------------------------------------
app.get('/api/products', async (req, res) => {
    if (!dbPool) return res.status(500).json({ status: 'error', message: 'CSDL chưa sẵn sàng!' });
    try {
        const [rows] = await dbPool.query('SELECT * FROM products ORDER BY created_at DESC');
        const data = rows.map(r => ({ id: r.id, name: r.name, category: r.category, price: Number(r.price), stock: Number(r.stock), image: r.image }));
        res.json({ status: 'success', data });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
});

app.post('/api/products', async (req, res) => {
    if (!dbPool) return res.status(500).json({ status: 'error', message: 'CSDL chưa sẵn sàng!' });
    const { id, name, category, price, stock, image } = req.body;
    if (!id || !name) {
        return res.status(400).json({ status: 'error', message: 'Thiếu thông tin sản phẩm (id, name)' });
    }
    try {
        await dbPool.query(
            `INSERT INTO products (id, name, category, price, stock, image)
             VALUES (?, ?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE name = VALUES(name), category = VALUES(category), price = VALUES(price), stock = VALUES(stock), image = VALUES(image)`,
            [id, name, category || 'Gear', price || 0, stock || 0, image || '']
        );
        console.log(`[MYSQL DATABASE] Đã lưu sản phẩm ${id} (${name}) vào MySQL!`);
        res.json({ status: 'success', message: `Đã lưu sản phẩm ${id} vào MySQL CSDL!` });
    } catch (err) {
        console.error('[MYSQL PRODUCT ERROR]:', err.message);
        res.status(500).json({ status: 'error', message: err.message });
    }
});

app.put('/api/products/:id', async (req, res) => {
    if (!dbPool) return res.status(500).json({ status: 'error', message: 'CSDL chưa sẵn sàng!' });
    const { id } = req.params;
    const { name, category, price, stock, image } = req.body;
    try {
        await dbPool.query(
            'UPDATE products SET name = ?, category = ?, price = ?, stock = ?, image = ? WHERE id = ?',
            [name, category, price, stock, image, id]
        );
        res.json({ status: 'success', message: 'Cập nhật sản phẩm thành công!' });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
});

app.delete('/api/products/:id', async (req, res) => {
    if (!dbPool) return res.status(500).json({ status: 'error', message: 'CSDL chưa sẵn sàng!' });
    const { id } = req.params;
    try {
        await dbPool.query('DELETE FROM products WHERE id = ?', [id]);
        res.json({ status: 'success', message: 'Xóa sản phẩm thành công!' });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
});


// --------------------------------------------------------------------------
// ENDPOINTS QUẢN LÝ VOUCHER MYSQL (VOUCHERS CRUD)
// --------------------------------------------------------------------------
app.get('/api/vouchers', async (req, res) => {
    if (!dbPool) return res.status(500).json({ status: 'error', message: 'CSDL chưa sẵn sàng!' });
    try {
        const [rows] = await dbPool.query('SELECT * FROM vouchers ORDER BY created_at DESC');
        const data = rows.map(r => ({
            id: r.id,
            code: r.code,
            discount_type: r.discount_type,
            discount_value: Number(r.discount_value),
            min_order: Number(r.min_order),
            max_discount: Number(r.max_discount),
            usage_limit: Number(r.usage_limit),
            used_count: Number(r.used_count),
            status: r.status
        }));
        res.json({ status: 'success', data });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
});

app.post('/api/vouchers', async (req, res) => {
    if (!dbPool) return res.status(500).json({ status: 'error', message: 'CSDL chưa sẵn sàng!' });
    const v = req.body;
    try {
        await dbPool.query(
            `INSERT INTO vouchers (id, code, discount_type, discount_value, min_order, max_discount, usage_limit, used_count, status, apply_to, apply_value)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE code = VALUES(code), discount_value = VALUES(discount_value), usage_limit = VALUES(usage_limit), used_count = VALUES(used_count), status = VALUES(status), apply_to = VALUES(apply_to), apply_value = VALUES(apply_value)`,
            [v.id || ('VCH_' + v.code), v.code, v.discount_type || 'percent', v.discount_value || 0, v.min_order || 0, v.max_discount || 0, v.usage_limit || 100, v.used_count || 0, v.status || 'Hoạt động', v.apply_to || 'all', v.apply_value || '']
        );
        res.json({ status: 'success', message: `Đã lưu voucher ${v.code} vào MySQL CSDL!` });
    } catch (err) {
        console.error('[MYSQL VOUCHER ERROR]:', err.message);
        res.status(500).json({ status: 'error', message: err.message });
    }
});


app.delete('/api/vouchers/:id', async (req, res) => {
    if (!dbPool) return res.status(500).json({ status: 'error', message: 'CSDL chưa sẵn sàng!' });
    const { id } = req.params;
    try {
        await dbPool.query('DELETE FROM vouchers WHERE id = ?', [id]);
        res.json({ status: 'success', message: 'Xóa voucher thành công!' });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
});


// --------------------------------------------------------------------------
// ENDPOINTS QUẢN LÝ HÓA ĐƠN VÀO MYSQL DATABASE (INVOICES PERSISTENCE)
// --------------------------------------------------------------------------
app.get('/api/invoices', async (req, res) => {
    if (!dbPool) return res.status(500).json({ status: 'error', message: 'Hệ thống CSDL chưa sẵn sàng!' });
    try {
        const [rows] = await dbPool.query('SELECT * FROM invoices ORDER BY created_at DESC');
        const formatted = rows.map(r => ({
            id: r.id,
            customer: r.customer,
            staff: r.seller,
            total: Number(r.total),
            discount: Number(r.discount),
            finalTotal: Number(r.final_total),
            paymentMethod: r.payment_method,
            status: r.status,
            date: r.date,
            time: r.time,
            items: r.items_json ? JSON.parse(r.items_json) : []
        }));
        res.json({ status: 'success', data: formatted });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
});

app.post('/api/invoices', async (req, res) => {
    if (!dbPool) return res.status(500).json({ status: 'error', message: 'Hệ thống CSDL chưa sẵn sàng!' });
    const inv = req.body;
    try {
        await dbPool.query(
            `INSERT INTO invoices (id, customer, seller, total, discount, final_total, payment_method, status, date, time, items_json)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE status = VALUES(status), final_total = VALUES(final_total)`,
            [
                inv.id,
                inv.customer || 'Khách lẻ',
                inv.staff || inv.seller || 'Super Admin',
                inv.total || inv.finalTotal || 0,
                inv.discount || 0,
                inv.finalTotal || inv.total || 0,
                inv.paymentMethod || inv.payment_method || 'Tiền mặt',
                inv.status || 'Đã thanh toán',
                inv.date || (new Date().getFullYear() + '-' + String(new Date().getMonth() + 1).padStart(2, '0') + '-' + String(new Date().getDate()).padStart(2, '0')),
                inv.time || new Date().toLocaleTimeString('vi-VN'),
                JSON.stringify(inv.items || [])
            ]
        );
        console.log(`[MYSQL DATABASE] Đã lưu thành công đơn hàng ${inv.id} vào bảng invoices MySQL!`);
        res.json({ status: 'success', message: `Đã lưu đơn hàng ${inv.id} vào Cơ sở dữ liệu MySQL!` });
    } catch (err) {
        console.error('[MYSQL INVOICE ERROR]:', err.message);
        res.status(500).json({ status: 'error', message: err.message });
    }
});

// Tự động phê duyệt 1,000 đơn hàng trực tuyến cùng lúc (Auto Approve All Orders)
app.post('/api/invoices/auto-approve', async (req, res) => {
    if (!dbPool) return res.status(500).json({ status: 'error', message: 'Hệ thống CSDL chưa sẵn sàng!' });
    try {
        const [result] = await dbPool.query("UPDATE invoices SET status = 'Đã thanh toán' WHERE status != 'Đã thanh toán'");
        res.json({ status: 'success', message: `Đã tự động duyệt ${result.affectedRows} đơn hàng thành công!` });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
});


// Khởi chạy server
app.listen(PORT, async () => {
    console.log('\n============================================================');
    console.log(` SERVER TECHNO POS ĐANG CHẠY TẠI: http://localhost:${PORT}`);
    console.log('============================================================');
    await connectDB();
});
