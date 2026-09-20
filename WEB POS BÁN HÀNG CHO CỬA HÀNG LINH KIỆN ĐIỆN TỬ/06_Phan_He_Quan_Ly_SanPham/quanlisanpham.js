/* Techno Admin Dashboard - Logic Quản lý sản phẩm */

document.addEventListener('DOMContentLoaded', () => {
    const activeUser = JSON.parse(localStorage.getItem('sessionActiveUser'));
    // ==========================================================================
    // A. KHỞI TẠO DỮ LIỆU SẢN PHẨM MẪU BAN ĐẦU (NẾU CHƯA CÓ TRONG LOCALSTORAGE)
    // ==========================================================================
    const DEFAULT_PRODUCTS = [
        { id: 'M1', name: 'Intel Core i9-14900K', category: 'CPU', price: 14500000, stock: 15 },
        { id: 'M2', name: 'Intel Core i7-14700KF', category: 'CPU', price: 7290000, stock: 20 },
        { id: 'M3', name: 'AMD Ryzen 7 7800X3D', category: 'CPU', price: 10200000, stock: 12 },
        { id: 'M4', name: 'RTX 5090 24GB', category: 'VGA', price: 26000000, stock: 5 },
        { id: 'M5', name: 'RTX 5070 Ti 16GB', category: 'VGA', price: 16000000, stock: 10 },
        { id: 'M6', name: 'MSI RTX 4060 Ventus 2X 8GB', category: 'VGA', price: 8500000, stock: 18 },
        { id: 'M7', name: 'RAM Corsair Vengeance RGB 32GB (2x16GB) DDR5', category: 'RAM', price: 3200000, stock: 25 },
        { id: 'M8', name: 'RAM 16GB (2x8GB) DDR4 3200MHz', category: 'RAM', price: 1690000, stock: 30 },
        { id: 'M9', name: 'RAM 32GB (2x16GB) DDR5 6000MHz', category: 'RAM', price: 4000000, stock: 20 },
        { id: 'M10', name: 'SSD Samsung 990 Pro 2TB NVMe', category: 'SSD', price: 4800000, stock: 15 },
        { id: 'M11', name: 'SSD Kingston NV2 1TB NVMe PCIe 4.0', category: 'SSD', price: 1390000, stock: 20 },
        { id: 'M12', name: 'SSD WD Black SN850X 1TB', category: 'SSD', price: 2800000, stock: 14 },
        { id: 'M13', name: 'Mainboard ASUS TUF B650M-PLUS', category: 'Mainboard', price: 2690000, stock: 15 },
        { id: 'M14', name: 'Mainboard MSI B760M Mortar WiFi', category: 'Mainboard', price: 2690000, stock: 8 },
        { id: 'M15', name: 'Mainboard Gigabyte Z790 AORUS Elite', category: 'Mainboard', price: 7500000, stock: 10 },
        { id: 'M16', name: 'Nguồn Corsair RM850e 850W Gold', category: 'Nguồn', price: 3200000, stock: 15 },
        { id: 'M17', name: 'Nguồn MSI MAG A750GL 750W', category: 'Nguồn', price: 2190000, stock: 20 },
        { id: 'M18', name: 'Nguồn ASUS ROG Thor 1000W Platinum', category: 'Nguồn', price: 7500000, stock: 6 },
        { id: 'M19', name: 'Màn hình ASUS ROG Swift PG27AQDM OLED 27"', category: 'Màn hình', price: 18500000, stock: 8 },
        { id: 'M20', name: 'Màn hình Samsung Odyssey G5 27" 165Hz', category: 'Màn hình', price: 5490000, stock: 12 },
        { id: 'M21', name: 'Màn hình Dell UltraSharp U2424H 24"', category: 'Màn hình', price: 4890000, stock: 15 },
        { id: 'M22', name: 'Chuột Logitech G Pro X Superlight 2', category: 'Gear', price: 3800000, stock: 20 },
        { id: 'M23', name: 'Bàn phím cơ ASUS ROG Azoth', category: 'Gear', price: 6200000, stock: 10 },
        { id: 'M24', name: 'Tai nghe Kingston HyperX Cloud III', category: 'Gear', price: 2490000, stock: 15 },
        { id: 'M25', name: 'Lót chuột SteelSeries QCK Large', category: 'Gear', price: 450000, stock: 40 }
    ];

    const currentLocalProducts = localStorage.getItem('pcpos_products');
    if (!currentLocalProducts || JSON.parse(currentLocalProducts).length < 20) {
        localStorage.setItem('pcpos_products', JSON.stringify(DEFAULT_PRODUCTS));
    }

    let products = JSON.parse(localStorage.getItem('pcpos_products'));

        // Tải dữ liệu 2 chiều từ MySQL Backend và hợp nhất thông minh (Smart Merge)
    fetch('/api/products')
        .then(res => res.json())
        .then(resData => {
            if (resData.status === 'success' && resData.data && resData.data.length > 0) {
                const mysqlProducts = resData.data;
                const localProducts = JSON.parse(localStorage.getItem('pcpos_products')) || [];

                const productMap = {};
                localProducts.forEach(p => { if (p && p.id) productMap[p.id] = p; });
                mysqlProducts.forEach(p => { if (p && p.id) productMap[p.id] = p; });

                products = Object.values(productMap);
                localStorage.setItem('pcpos_products', JSON.stringify(products));
                renderTable();

                // Đẩy các sản phẩm vừa thêm trên web vào CSDL MySQL nếu MySQL chưa có
                localProducts.forEach(p => {
                    fetch('/api/products', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(p)
                    }).catch(err => console.error('[POST SYNC ERROR]', err));
                });
            }
        }).catch(err => console.error('[MYSQL 2-WAY SYNC ERROR]', err));


    // Tự động đồng bộ toàn bộ sản phẩm từ web vào CSDL MySQL ngay khi tải trang
    if (products && products.length > 0) {
        products.forEach(p => {
            fetch('/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: p.id,
                    name: p.name,
                    category: p.category,
                    price: p.price,
                    stock: p.stock,
                    image: p.image || ''
                })
            }).catch(err => console.error('[AUTO PRODUCT SYNC ERROR]', err));
        });
    }


    // Hình ảnh minh họa chất lượng cao từ Unsplash cho từng danh mục
    const CATEGORY_IMAGES = {
        'CPU': 'https://images.unsplash.com/photo-1591453089816-0fbb971b454c?w=400&q=80',
        'RAM': 'https://images.unsplash.com/photo-1562976540-1502c2145186?w=400&q=80',
        'VGA': 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=400&q=80',
        'Mainboard': 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=80',
        'SSD': 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&q=80',
        'Nguồn': 'https://images.unsplash.com/photo-1616440347437-b1c73416efc2?w=400&q=80',
        'Màn hình': 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&q=80',
        'Gear': 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=400&q=80'
    };

    // Biến tạm để lưu ảnh tải lên dưới dạng base64
    let tempUploadedImage = null;

    // ==========================================================================
    // B. CÁC ĐỊNH NGHĨA HÌNH ẢNH MINH HỌA VECTOR SVG SIÊU RỰC RỠ, ĐA MÀU SẮC
    // ==========================================================================
    const SVG_TEMPLATES = {
        'CPU': `
            <svg viewBox="0 0 64 64" class="product-svg">
                <defs>
                    <linearGradient id="cpuGold" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#FFE259" />
                        <stop offset="100%" stop-color="#FFA751" />
                    </linearGradient>
                    <linearGradient id="cpuBase" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#0F2027" />
                        <stop offset="50%" stop-color="#203A43" />
                        <stop offset="100%" stop-color="#2C5364" />
                    </linearGradient>
                </defs>
                <!-- Board mạch xanh lục tối -->
                <rect x="6" y="6" width="52" height="52" rx="6" fill="#005A36" stroke="#003d24" stroke-width="1"/>
                <!-- Tiếp điểm đồng vàng xung quanh -->
                <path d="M12 6h40M6 12v40M58 12v40M12 58h40" stroke="#FFC107" stroke-width="2" stroke-dasharray="2 2"/>
                <!-- Đế kim loại CPU -->
                <rect x="14" y="14" width="36" height="36" rx="4" fill="url(#cpuBase)"/>
                <!-- Nhân Silicon trung tâm mạ vàng -->
                <rect x="22" y="22" width="20" height="20" rx="2" fill="url(#cpuGold)" stroke="#D4AF37" stroke-width="1"/>
                <!-- Điện trở tụ nhỏ xung quanh nhân -->
                <circle cx="18" cy="20" r="1.5" fill="#E2E8F0"/>
                <circle cx="18" cy="25" r="1.5" fill="#E2E8F0"/>
                <circle cx="46" cy="20" r="1.5" fill="#E2E8F0"/>
                <circle cx="46" cy="25" r="1.5" fill="#E2E8F0"/>
            </svg>`,
            
        'RAM': `
            <svg viewBox="0 0 64 64" class="product-svg">
                <defs>
                    <linearGradient id="ramRgb" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stop-color="#FF007F" />
                        <stop offset="50%" stop-color="#7F00FF" />
                        <stop offset="100%" stop-color="#00F0FF" />
                    </linearGradient>
                </defs>
                <!-- Board RAM xám tối -->
                <rect x="4" y="24" width="56" height="18" rx="2" fill="#1A202C"/>
                <!-- Chân cắm đồng vàng -->
                <line x1="8" y1="42" x2="56" y2="42" stroke="#FFC107" stroke-width="2" stroke-dasharray="1 1"/>
                <!-- Dải tản nhiệt thép đen nhám -->
                <rect x="6" y="20" width="52" height="14" rx="1" fill="#2D3748"/>
                <!-- Dải LED RGB rực rỡ ở cạnh trên cùng -->
                <rect x="8" y="16" width="48" height="4" rx="1" fill="url(#ramRgb)"/>
                <!-- Các rãnh tản nhiệt kim loại dọc -->
                <line x1="16" y1="20" x2="16" y2="34" stroke="#4A5568" stroke-width="1.5"/>
                <line x1="28" y1="20" x2="28" y2="34" stroke="#4A5568" stroke-width="1.5"/>
                <line x1="40" y1="20" x2="40" y2="34" stroke="#4A5568" stroke-width="1.5"/>
            </svg>`,
            
        'VGA': `
            <svg viewBox="0 0 64 64" class="product-svg">
                <defs>
                    <linearGradient id="vgaFans" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stop-color="#2D3748" />
                        <stop offset="100%" stop-color="#1A202C" />
                    </linearGradient>
                </defs>
                <!-- Khung vỏ card ngoài xám/đen hầm hố -->
                <rect x="4" y="14" width="56" height="36" rx="4" fill="#242B35" stroke="#3A4454" stroke-width="1"/>
                <!-- Chân tiếp xúc PCIe bên dưới -->
                <line x1="12" y1="50" x2="48" y2="50" stroke="#FFD700" stroke-width="2" stroke-dasharray="2 1"/>
                <!-- Cổng kết nối thép (Bracket) bên trái -->
                <rect x="2" y="10" width="2" height="44" fill="#90A4AE" rx="0.5"/>
                <!-- Quạt kép 1 rực rỡ LED đỏ -->
                <circle cx="21" cy="32" r="11" fill="url(#vgaFans)" stroke="var(--accent-red)" stroke-width="1.5"/>
                <circle cx="21" cy="32" r="3" fill="#A41326"/>
                <line x1="21" y1="21" x2="21" y2="43" stroke="rgba(255, 255, 255, 0.2)" stroke-width="1"/>
                <line x1="10" y1="32" x2="32" y2="32" stroke="rgba(255, 255, 255, 0.2)" stroke-width="1"/>
                
                <!-- Quạt kép 2 rực rỡ LED đỏ -->
                <circle cx="43" cy="32" r="11" fill="url(#vgaFans)" stroke="var(--accent-red)" stroke-width="1.5"/>
                <circle cx="43" cy="32" r="3" fill="#A41326"/>
                <line x1="43" y1="21" x2="43" y2="43" stroke="rgba(255, 255, 255, 0.2)" stroke-width="1"/>
                <line x1="32" y1="32" x2="54" y2="32" stroke="rgba(255, 255, 255, 0.2)" stroke-width="1"/>
            </svg>`,
            
        'Mainboard': `
            <svg viewBox="0 0 64 64" class="product-svg">
                <!-- Board mạch đen tuyền -->
                <rect x="6" y="6" width="52" height="52" rx="4" fill="#121820" stroke="#1F2833" stroke-width="1"/>
                <!-- Socket CPU trung tâm có viền bạc -->
                <rect x="24" y="18" width="16" height="16" rx="2" fill="#2E3842" stroke="#90A4AE" stroke-width="1.5"/>
                <!-- Khe cắm RAM (4 khe đứng bên phải) -->
                <line x1="46" y1="12" x2="46" y2="34" stroke="#FF5722" stroke-width="1"/>
                <line x1="49" y1="12" x2="49" y2="34" stroke="#2196F3" stroke-width="1"/>
                <line x1="52" y1="12" x2="52" y2="34" stroke="#FF5722" stroke-width="1"/>
                <!-- Khe PCIe x16 ngang màu đỏ rực -->
                <rect x="14" y="40" width="34" height="3.5" rx="1" fill="var(--accent-red)"/>
                <!-- Các tụ điện màu vàng kim -->
                <circle cx="16" cy="14" r="2" fill="#FFC107"/>
                <circle cx="16" cy="20" r="2" fill="#FFC107"/>
                <circle cx="20" cy="14" r="2" fill="#FFC107"/>
                <!-- Tản nhiệt Chipset có logo LED -->
                <rect x="36" y="38" width="12" height="12" rx="1" fill="#CC182C"/>
                <polygon points="40,41 44,45 42,49" fill="#FFFFFF"/>
            </svg>`,
            
        'SSD': `
            <svg viewBox="0 0 64 64" class="product-svg">
                <!-- Vỏ ổ SSD đen xám nhám -->
                <rect x="6" y="16" width="52" height="32" rx="4" fill="#1B2228" stroke="#343E46" stroke-width="1.5"/>
                <!-- Tem sản phẩm màu đỏ nhấn -->
                <rect x="12" y="20" width="32" height="24" rx="1" fill="#A41326"/>
                <rect x="14" y="22" width="28" height="6" fill="#FFFFFF"/>
                <text x="16" y="27" font-family="'Rajdhani', sans-serif" font-weight="bold" font-size="5" fill="#A41326">SSD M.2</text>
                <!-- Đầu pin kết nối mạ vàng bên phải -->
                <rect x="52" y="26" width="6" height="12" rx="1" fill="#FFC107" stroke-dasharray="1 1"/>
            </svg>`,
            
        'Nguồn': `
            <svg viewBox="0 0 64 64" class="product-svg">
                <!-- Khung nguồn thép đen -->
                <rect x="10" y="10" width="44" height="44" rx="6" fill="#1E2022" stroke="#2D3748" stroke-width="1.5"/>
                <!-- Lưới tròn quạt tản nhiệt -->
                <circle cx="32" cy="32" r="16" fill="none" stroke="#596A77" stroke-width="1.5"/>
                <!-- Quạt gió đỏ tươi tản nhiệt bên trong -->
                <circle cx="32" cy="32" r="14" fill="#A41326"/>
                <!-- Trục quạt trung tâm màu đen -->
                <circle cx="32" cy="32" r="4" fill="#1E2022"/>
                <!-- Các nan lưới thép hướng ngoại -->
                <line x1="32" y1="16" x2="32" y2="48" stroke="#E2E8F0" stroke-width="1"/>
                <line x1="16" y1="32" x2="48" y2="32" stroke="#E2E8F0" stroke-width="1"/>
            </svg>`,
            
        'Màn hình': `
            <svg viewBox="0 0 64 64" class="product-svg">
                <rect x="6" y="10" width="52" height="34" rx="4" fill="#0F172A" stroke="#384857" stroke-width="2"/>
                <rect x="8" y="12" width="48" height="30" fill="#1E293B"/>
                <path d="M22 44h20l-4 8H26z" fill="#475569"/>
                <rect x="28" y="52" width="8" height="2" fill="#334155"/>
            </svg>`,
            
        'Gear': `
            <svg viewBox="0 0 64 64" class="product-svg">
                <rect x="6" y="24" width="52" height="26" rx="4" fill="#1E293B" stroke="#475569" stroke-width="1.5"/>
                <rect x="10" y="28" width="6" height="6" rx="1" fill="#EF4444"/>
                <rect x="18" y="28" width="6" height="6" rx="1" fill="#475569"/>
                <rect x="26" y="28" width="6" height="6" rx="1" fill="#475569"/>
                <rect x="34" y="28" width="6" height="6" rx="1" fill="#475569"/>
                <rect x="42" y="28" width="12" height="6" rx="1" fill="#FFC107"/>
                <rect x="10" y="38" width="22" height="6" rx="1" fill="#3B82F6"/>
                <rect x="34" y="38" width="6" height="6" rx="1" fill="#475569"/>
                <rect x="42" y="38" width="12" height="6" rx="1" fill="#10B981"/>
            </svg>`
    };

    // Định dạng tiền tệ
    function formatCurrency(number) {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })
            .format(number)
            .replace('₫', 'đ');
    }

    // Lọc danh mục nhãn CSS
    function getCategoryClass(category) {
        switch (category) {
            case 'CPU': return 'cpu';
            case 'VGA': return 'vga';
            case 'RAM': return 'ram';
            case 'Mainboard': return 'mainboard';
            case 'SSD': return 'ssd';
            case 'Nguồn': return 'nguon';
            case 'Màn hình': return 'manhinh';
            case 'Gear': return 'gear';
            default: return '';
        }
    }

    // ==========================================================================
    // C. BIẾN STATE ĐIỀU KHIỂN BẢNG
    // ==========================================================================
    let currentCategory = 'Tất cả';
    let searchQuery = '';
    let currentPage = 1;
    let itemsPerPage = 10;

    const tableBody = document.getElementById('productsTableBody');
    const paginationControls = document.getElementById('paginationControls');
    const paginationSummary = document.getElementById('paginationSummary');
    const perPageSelect = document.getElementById('perPageSelect');
    const searchInput = document.getElementById('productSearchInput');

    // Hàm lưu danh sách sản phẩm mới vào LocalStorage
        // Hàm lưu danh sách sản phẩm mới vào LocalStorage & Đồng bộ MySQL Database
    function saveProducts() {
        localStorage.setItem('pcpos_products', JSON.stringify(products));

        // Đồng bộ từng sản phẩm sang MySQL Database
        products.forEach(p => {
            fetch('/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: p.id,
                    name: p.name,
                    category: p.category,
                    price: p.price,
                    stock: p.stock,
                    image: p.image || ''
                })
            }).then(res => res.json())
              .then(data => console.log('[MYSQL PRODUCT SYNC]', p.id, data.message))
              .catch(err => console.error('[MYSQL PRODUCT SYNC ERROR]', err));
        });
    }

    // ==========================================================================
    // D. HÀM VẼ BẢNG VÀ PHÂN TRANG (RENDER TABLE)
    // ==========================================================================
    // Helper tính số lượng đã bán thực tế hoặc giả lập nếu chưa có đơn hàng
    function getProductSales(p, invoices) {
        let sales = 0;
        invoices.forEach(inv => {
            if (inv.items) {
                inv.items.forEach(item => {
                    if (item.name === p.name) {
                        sales += item.qty;
                    }
                });
            }
        });
        
        if (invoices.length === 0) {
            const mockSales = {
                'M1': 56, 'M8': 48, 'M10': 42, 'M14': 38, 'M17': 33,
                'M2': 24, 'M3': 19, 'M4': 15, 'M5': 12, 'M6': 8,
                'M7': 29, 'M9': 18, 'M11': 14, 'M12': 11, 'M13': 7,
                'M15': 5, 'M16': 22, 'M18': 4, 'M19': 3, 'M20': 13,
                'M21': 16, 'M22': 27, 'M23': 9, 'M24': 15, 'M25': 31
            };
            return mockSales[p.id] || 0;
        }
        return sales;
    }

    function renderTable() {

        // Tính toán số lượng Đã bán chính xác từ lịch sử hóa đơn pcpos_invoices
        const allInvoices = JSON.parse(localStorage.getItem('pcpos_invoices')) || [];
        const productSalesCountMap = {};
        allInvoices.forEach(inv => {
            if (inv && inv.items && Array.isArray(inv.items)) {
                inv.items.forEach(item => {
                    const itemName = (item.name || '').trim();
                    const qty = Number(item.qty || 1);
                    if (itemName) {
                        productSalesCountMap[itemName] = (productSalesCountMap[itemName] || 0) + qty;
                    }
                });
            }
        });

        products.forEach(p => {
            const matchedKey = Object.keys(productSalesCountMap).find(k => 
                k.toLowerCase() === p.name.toLowerCase() || 
                k.toLowerCase().includes(p.name.toLowerCase()) || 
                p.name.toLowerCase().includes(k.toLowerCase())
            );
            p.soldCount = matchedKey ? productSalesCountMap[matchedKey] : (p.soldCount || 0);
        });

        // 1. Lọc sản phẩm theo danh mục và tìm kiếm
        let filtered = products.filter(p => {
            const matchesCategory = (currentCategory === 'Tất cả' || p.category === currentCategory);
            const nameLower = p.name.toLowerCase();
            const idLower = p.id.toLowerCase();
            const queryLower = searchQuery.toLowerCase();
            const matchesSearch = nameLower.includes(queryLower) || idLower.includes(queryLower);
            return matchesCategory && matchesSearch;
        });

        // Đọc danh sách hóa đơn từ localStorage để phục vụ tính toán sắp xếp và hiển thị đã bán
        const invoices = JSON.parse(localStorage.getItem('pcpos_invoices')) || [];

        // Gán tạm thời số lượng đã bán để thực hiện sort
        filtered.forEach(p => {
            p.tempSales = getProductSales(p, invoices);
        });

        // Thực hiện sắp xếp
        const sortSelect = document.getElementById('sortProductSelect');
        const sortValue = sortSelect ? sortSelect.value : 'default';

        if (sortValue === 'salesDesc') {
            filtered.sort((a, b) => b.tempSales - a.tempSales);
        } else if (sortValue === 'salesAsc') {
            filtered.sort((a, b) => a.tempSales - b.tempSales);
        } else if (sortValue === 'stockDesc') {
            filtered.sort((a, b) => b.stock - a.stock);
        } else if (sortValue === 'stockAsc') {
            filtered.sort((a, b) => a.stock - b.stock);
        } else if (sortValue === 'priceDesc') {
            filtered.sort((a, b) => b.price - a.price);
        } else if (sortValue === 'priceAsc') {
            filtered.sort((a, b) => a.price - b.price);
        } else {
            // Mặc định: ID sản phẩm tăng dần (M1, M2...)
            filtered.sort((a, b) => {
                const idA = parseInt(a.id.replace(/\D/g, '')) || 0;
                const idB = parseInt(b.id.replace(/\D/g, '')) || 0;
                return idA - idB;
            });
        }

        // 2. Tính toán phân trang
        const totalItems = filtered.length;
        const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

        if (currentPage > totalPages) {
            currentPage = totalPages;
        }

        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
        const pageItems = filtered.slice(startIndex, endIndex);

        // 3. Hiển thị thông báo nếu không tìm thấy dữ liệu
        if (pageItems.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="8" class="text-center" style="padding: 40px; color: var(--text-muted);">
                        Không tìm thấy sản phẩm linh kiện nào phù hợp!
                    </td>
                </tr>
            `;
            paginationSummary.textContent = `Hiển thị 0 - 0 của 0 sản phẩm`;
            renderPagination(totalPages);
            return;
        }

        // 4. Render các dòng sản phẩm
        tableBody.innerHTML = '';
        pageItems.forEach(p => {
            const tr = document.createElement('tr');
            
            // Xử lý badge kho hàng
            let stockClass = 'in-stock';
            let stockText = p.stock;
            if (p.stock === 0) {
                stockClass = 'out-of-stock';
                stockText = 'Hết';
            } else if (p.stock < 10) {
                stockClass = 'low-stock';
            }

            // Kiểm tra xem sản phẩm có ảnh thật (Base64) do người dùng tải lên không, ngược lại dùng Unsplash
            const imageUrl = p.image || CATEGORY_IMAGES[p.category] || CATEGORY_IMAGES['Gear'];
            const imageContent = `<img src="${imageUrl}" class="product-table-image" alt="${p.name}" loading="lazy">`;

            tr.innerHTML = `
                <td class="bold">${p.id}</td>
                <td>
                    <div class="product-image-container">
                        ${imageContent}
                    </div>
                </td>
                <td class="bold">${p.name}</td>
                <td>
                    <span class="category-badge ${getCategoryClass(p.category)}">${p.category}</span>
                </td>
                <td class="bold text-red">${formatCurrency(p.price)}</td>
                <td>
                    <span class="stock-badge ${stockClass}">${stockText}</span>
                </td>
                <td class="bold" style="text-align: center; color: var(--accent-red); font-family: 'Rajdhani', sans-serif; font-size: 15px;">
                    ${p.tempSales}
                </td>
                <td>
                    <div class="action-buttons-group">
                        <button class="action-btn view" data-id="${p.id}" title="Xem chi tiết">
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                <circle cx="12" cy="12" r="3"></circle>
                            </svg>
                        </button>
                        <button class="action-btn edit" data-id="${p.id}" title="Chỉnh sửa">
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                        </button>
                        <button class="action-btn delete" data-id="${p.id}" title="Xóa">
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                <line x1="10" y1="11" x2="10" y2="17"></line>
                                <line x1="14" y1="11" x2="14" y2="17"></line>
                            </svg>
                        </button>
                    </div>
                </td>
            `;
            tableBody.appendChild(tr);
        });

        // 5. Cập nhật thông tin phân trang tóm tắt
        paginationSummary.textContent = `Hiển thị ${startIndex + 1} - ${endIndex} của ${totalItems} sản phẩm`;
        renderPagination(totalPages);
    }

    // Hàm tạo các nút phân trang
    function renderPagination(totalPages) {
        paginationControls.innerHTML = '';

        // Nút Trước (Prev)
        const prevBtn = document.createElement('button');
        prevBtn.className = `page-btn ${currentPage === 1 ? 'disabled' : ''}`;
        prevBtn.innerHTML = `
            <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
        `;
        if (currentPage > 1) {
            prevBtn.addEventListener('click', () => {
                currentPage--;
                renderTable();
            });
        }
        paginationControls.appendChild(prevBtn);

        // Các nút số trang
        for (let i = 1; i <= totalPages; i++) {
            const pageNumBtn = document.createElement('button');
            pageNumBtn.className = `page-btn ${currentPage === i ? 'active' : ''}`;
            pageNumBtn.textContent = i;
            pageNumBtn.addEventListener('click', () => {
                currentPage = i;
                renderTable();
            });
            paginationControls.appendChild(pageNumBtn);
        }

        // Nút Tiếp (Next)
        const nextBtn = document.createElement('button');
        nextBtn.className = `page-btn ${currentPage === totalPages ? 'disabled' : ''}`;
        nextBtn.innerHTML = `
            <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
        `;
        if (currentPage < totalPages) {
            nextBtn.addEventListener('click', () => {
                currentPage++;
                renderTable();
            });
        }
        paginationControls.appendChild(nextBtn);
    }

    // ==========================================================================
    // E. SỰ KIỆN: BỘ LỌC DANH MỤC & TÌM KIẾM
    // ==========================================================================
    const categoryButtons = document.querySelectorAll('.filter-btn');
    categoryButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            categoryButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            currentCategory = btn.getAttribute('data-category');
            currentPage = 1;
            renderTable();
        });
    });

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value.trim();
            currentPage = 1;
            renderTable();
        });
    }

    if (perPageSelect) {
        perPageSelect.addEventListener('change', (e) => {
            itemsPerPage = parseInt(e.target.value);
            currentPage = 1;
            renderTable();
        });
    }

    const sortProductSelect = document.getElementById('sortProductSelect');
    if (sortProductSelect) {
        sortProductSelect.addEventListener('change', () => {
            currentPage = 1;
            renderTable();
        });
    }

    // ==========================================================================
    // F. LẬP TRÌNH LOGIC UPLOAD ẢNH & THAO TÁC CRUD VỚI MODAL
    // ==========================================================================
    const productModal = document.getElementById('productModal');
    const deleteConfirmModal = document.getElementById('deleteConfirmModal');
    const viewProductModal = document.getElementById('viewProductModal');

    const productForm = document.getElementById('productForm');
    const modalTitle = document.getElementById('modalTitle');
    const formProductId = document.getElementById('formProductId');
    const formProductName = document.getElementById('formProductName');
    const formProductCategory = document.getElementById('formProductCategory');
    const formProductStock = document.getElementById('formProductStock');
    const formProductPrice = document.getElementById('formProductPrice');

    // Các thành phần upload hình ảnh
    const imageUploadZone = document.getElementById('imageUploadZone');
    const formProductImage = document.getElementById('formProductImage');
    const uploadZoneContent = document.getElementById('uploadZoneContent');
    const uploadPreviewContainer = document.getElementById('uploadPreviewContainer');
    const uploadPreviewImg = document.getElementById('uploadPreviewImg');
    const btnRemovePreview = document.getElementById('btnRemovePreview');

    const deleteTargetName = document.getElementById('deleteTargetName');
    const viewDetailsBody = document.getElementById('viewDetailsBody');

    let deleteTargetId = null;

    // Logic Upload hình ảnh tương tác kéo thả / chọn tệp
    if (imageUploadZone && formProductImage) {
        imageUploadZone.addEventListener('click', (e) => {
            // Không mở lại chọn tệp khi click nút xoá ảnh xem trước
            if (e.target.closest('#btnRemovePreview')) return;
            formProductImage.click();
        });

        // Hỗ trợ kéo thả ảnh
        imageUploadZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            imageUploadZone.style.borderColor = 'var(--accent-red)';
        });

        imageUploadZone.addEventListener('dragleave', () => {
            imageUploadZone.style.borderColor = 'var(--border-color)';
        });

        imageUploadZone.addEventListener('drop', (e) => {
            e.preventDefault();
            imageUploadZone.style.borderColor = 'var(--border-color)';
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                handleImageFile(files[0]);
            }
        });

        // Xử lý khi chọn file ảnh xong
        formProductImage.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                handleImageFile(e.target.files[0]);
            }
        });
    }

    // Đọc file ảnh dưới dạng Base64
    function handleImageFile(file) {
        if (!file.type.match('image.*')) {
            showToast('Vui lòng chỉ chọn các tệp tin hình ảnh!', 'warning');
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            showToast('Dung lượng hình ảnh quá lớn (nhỏ hơn 2MB)!', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            tempUploadedImage = e.target.result; // Lưu trữ base64
            
            // Cập nhật giao diện hiển thị ảnh xem trước
            uploadPreviewImg.src = tempUploadedImage;
            uploadZoneContent.classList.add('hidden');
            uploadPreviewContainer.classList.remove('hidden');
        };
        reader.readAsDataURL(file);
    }

    // Click nút Xoá ảnh xem trước
    if (btnRemovePreview) {
        btnRemovePreview.addEventListener('click', (e) => {
            e.stopPropagation(); // Ngừng lan truyền để tránh click mở chọn tệp
            clearImageUpload();
        });
    }

    // Hàm xoá sạch khu vực upload ảnh
    function clearImageUpload() {
        formProductImage.value = '';
        uploadPreviewImg.src = '';
        uploadPreviewContainer.classList.add('hidden');
        uploadZoneContent.classList.remove('hidden');
        tempUploadedImage = null;
    }

    // Định dạng số tiền khi gõ
    if (formProductPrice) {
        formProductPrice.addEventListener('input', (e) => {
            let val = e.target.value.replace(/\D/g, '');
            if (val) {
                e.target.value = parseInt(val).toLocaleString('vi-VN');
            } else {
                e.target.value = '';
            }
        });
    }

    // Hiển thị Modal nhập liệu (Có nạp ảnh nếu có sẵn)
    function showModal(title, isEdit = false, productObj = null) {
        modalTitle.textContent = title;
        productForm.reset();
        clearImageUpload();
        
        if (isEdit && productObj) {
            formProductId.value = productObj.id;
            formProductName.value = productObj.name;
            formProductCategory.value = productObj.category;
            formProductStock.value = productObj.stock;
            formProductPrice.value = parseInt(productObj.price).toLocaleString('vi-VN');
            
            // Nếu sản phẩm đã có hình ảnh sẵn
            if (productObj.image) {
                tempUploadedImage = productObj.image;
                uploadPreviewImg.src = productObj.image;
                uploadZoneContent.classList.add('hidden');
                uploadPreviewContainer.classList.remove('hidden');
            }
        } else {
            formProductId.value = '';
        }
        
        productModal.classList.remove('hidden');
    }

    // Nhấp "+ Thêm sản phẩm"
    const openAddModalBtn = document.getElementById('openAddModalBtn');
    if (openAddModalBtn) {
        openAddModalBtn.addEventListener('click', () => {
            showModal('Thêm sản phẩm mới', false);
        });
    }

    document.getElementById('closeModalBtn').addEventListener('click', () => productModal.classList.add('hidden'));
    document.getElementById('cancelModalBtn').addEventListener('click', () => productModal.classList.add('hidden'));

    // Submit Form
    productForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const idVal = formProductId.value;
        const nameVal = formProductName.value.trim();
        const catVal = formProductCategory.value;
        const stockVal = parseInt(formProductStock.value);
        const priceVal = parseInt(formProductPrice.value.replace(/\D/g, ''));

        
        if (isNaN(stockVal) || stockVal < 0) {
            showToast('⚠️ Số lượng tồn kho không được là số âm (phải từ 0 trở lên)!', 'error');
            return;
        }

        if (isNaN(priceVal) || priceVal < 0) {
            showToast('⚠️ Giá bán sản phẩm không được là số âm!', 'error');
            return;
        }

        if (!nameVal || !catVal || isNaN(stockVal) || isNaN(priceVal)) {
            showToast('Vui lòng nhập đầy đủ các trường thông tin có dấu *', 'warning');
            return;
        }

        if (idVal) {
            // A. UPDATE sản phẩm
            const index = products.findIndex(p => p.id === idVal);
            if (index !== -1) {
                products[index].name = nameVal;
                products[index].category = catVal;
                products[index].stock = stockVal;
                products[index].price = priceVal;
                products[index].image = tempUploadedImage; // Lưu ảnh Base64
            }
        } else {
            // B. CREATE sản phẩm mới
            const numericIds = products.map(p => parseInt(p.id.replace(/\D/g, ''))).filter(n => !isNaN(n));
            const nextNum = Math.max(...numericIds, 0) + 1;
            const newId = 'M' + nextNum;

            products.push({
                id: newId,
                name: nameVal,
                category: catVal,
                price: priceVal,
                stock: stockVal,
                image: tempUploadedImage // Lưu ảnh Base64
            });
        }

        saveProducts();
        productModal.classList.add('hidden');
        renderTable();
    });

    // Sự kiện Click bảng
    tableBody.addEventListener('click', (e) => {
        const targetBtn = e.target.closest('.action-btn');
        if (!targetBtn) return;

        const id = targetBtn.getAttribute('data-id');
        const productObj = products.find(p => String(p.id) === String(id));
        if (!productObj) {
            console.error("Không tìm thấy sản phẩm:", id);
            return;
        }

        if (targetBtn.classList.contains('view')) {
            // Xem chi tiết linh kiện
            const imageUrl = productObj.image || CATEGORY_IMAGES[productObj.category] || CATEGORY_IMAGES['Gear'];
            let viewImgHtml = `<img src="${imageUrl}" style="max-width:100%; max-height:120px; object-fit:contain; border-radius:6px; margin: 4px auto 12px auto; display:block; border: 1px solid var(--border-color);">`;

            viewDetailsBody.innerHTML = `
                ${viewImgHtml}
                <div class="detail-row">
                    <span class="detail-label">Mã sản phẩm:</span>
                    <span class="detail-val">${productObj.id}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Tên linh kiện:</span>
                    <span class="detail-val" style="color: var(--accent-red);">${productObj.name}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Danh mục:</span>
                    <span class="detail-val"><span class="category-badge ${getCategoryClass(productObj.category)}">${productObj.category}</span></span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Giá niêm yết:</span>
                    <span class="detail-val bold" style="color: var(--accent-red);">${formatCurrency(productObj.price)}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Số lượng tồn kho:</span>
                    <span class="detail-val">${productObj.stock} chiếc</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Trạng thái kho:</span>
                    <span class="detail-val">${productObj.stock > 0 ? '<span style="color:#2ec4b6; font-weight:bold;">Còn hàng</span>' : '<span style="color:var(--accent-red); font-weight:bold;">Hết hàng</span>'}</span>
                </div>
            `;
            viewProductModal.classList.remove('hidden');
        } 
        else if (targetBtn.classList.contains('edit')) {
            showModal('Chỉnh sửa sản phẩm', true, productObj);
        } 
        else if (targetBtn.classList.contains('delete')) {
            deleteTargetId = id;
            deleteTargetName.textContent = productObj.name;
            deleteConfirmModal.classList.remove('hidden');
        }
    });

    document.getElementById('closeViewModalBtn').addEventListener('click', () => viewProductModal.classList.add('hidden'));
    document.getElementById('closeViewBtn').addEventListener('click', () => viewProductModal.classList.add('hidden'));

    document.getElementById('cancelDeleteBtn').addEventListener('click', () => {
        deleteConfirmModal.classList.add('hidden');
        deleteTargetId = null;
    });

        document.getElementById('confirmDeleteBtn').addEventListener('click', () => {
        if (deleteTargetId) {
            const idToDelete = deleteTargetId;
            products = products.filter(p => p.id !== idToDelete);
            saveProducts();

            // Xóa trực tiếp khỏi CSDL MySQL Database
            fetch('/api/products/' + idToDelete, {
                method: 'DELETE'
            }).then(res => res.json())
              .then(data => console.log('[MYSQL DELETE PRODUCT SUCCESS]', idToDelete, data.message))
              .catch(err => console.error('[MYSQL DELETE PRODUCT ERROR]', err));

            deleteConfirmModal.classList.add('hidden');
            deleteTargetId = null;
            renderTable();
        }
    });

    [productModal, deleteConfirmModal, viewProductModal].forEach(modalEl => {
        modalEl.addEventListener('click', (e) => {
            if (e.target === modalEl) {
                modalEl.classList.add('hidden');
                if (modalEl === deleteConfirmModal) deleteTargetId = null;
            }
        });
    });

    // ==========================================================================
    // G. LIÊN KẾT PROFILE ACCOUNT
    // ==========================================================================
    if (activeUser) {
        const sidebarUserName = document.querySelector('.user-name-text');
        const sidebarUserRole = document.querySelector('.user-role-text');
        const sidebarAvatarLetter = document.querySelector('.user-avatar-letter');
        
        const headerUserName = document.querySelector('.profile-name');
        const headerUserRole = document.querySelector('.profile-role');
        const headerAvatar = document.querySelector('.profile-avatar');

        if (sidebarUserName) sidebarUserName.textContent = activeUser.name;
        if (sidebarUserRole) sidebarUserRole.textContent = activeUser.role;
        if (headerUserName) headerUserName.textContent = activeUser.name;
        if (headerUserRole) headerUserRole.textContent = activeUser.role;

        const initials = activeUser.name
            .split(' ')
            .map(word => word.charAt(0))
            .join('')
            .toUpperCase()
            .substring(0, 2);

        const adminAvatar = 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=80&q=80';
        const userAvatarUrl = activeUser.avatarUrl || (activeUser.role === 'Super Admin' ? adminAvatar : '');

        if (sidebarAvatarLetter) {
            if (userAvatarUrl) {
                sidebarAvatarLetter.innerHTML = `<img src="${userAvatarUrl}" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">`;
                sidebarAvatarLetter.style.backgroundColor = 'transparent';
            } else {
                sidebarAvatarLetter.textContent = initials;
                sidebarAvatarLetter.style.backgroundColor = 'var(--accent-red)';
            }
        }
        if (headerAvatar) {
            if (userAvatarUrl) {
                headerAvatar.innerHTML = `<img src="${userAvatarUrl}" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">`;
                headerAvatar.style.backgroundColor = 'transparent';
            } else {
                headerAvatar.textContent = initials;
                headerAvatar.style.backgroundColor = '#E2E8F0';
            }
        }
    }

    const sidebarUserBtn = document.getElementById('sidebarUserDropdownBtn');
    const userDropdownMenu = document.getElementById('userDropdownMenu');

    if (sidebarUserBtn && userDropdownMenu) {
        sidebarUserBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            userDropdownMenu.classList.toggle('hidden');
        });

        document.addEventListener('click', () => {
            userDropdownMenu.classList.add('hidden');
        });
    }

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('sessionActiveUser');
            window.location.href = "../04_Phan_He_Login_Xac_Thuc/login.html";
        });
    }

    renderTable();
});
