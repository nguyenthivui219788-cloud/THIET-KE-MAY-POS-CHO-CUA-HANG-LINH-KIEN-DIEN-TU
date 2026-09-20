/* Techno POS - Màn hình Bán hàng Logic */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Kiểm tra tài khoản hoạt động
    const activeUser = JSON.parse(localStorage.getItem('sessionActiveUser'));
    if (!activeUser) {
        window.location.href = "../04_Phan_He_Login_Xac_Thuc/login.html";
        return;
    }

    // 2. Khởi tạo danh sách sản phẩm mẫu ban đầu nếu chưa có (Hoặc danh sách cũ ít hơn 20 sản phẩm)
        const DEFAULT_PRODUCTS = [
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


    
    // Always sync DEFAULT_PRODUCTS to ensure clean hardware images
    // Auto sync from MySQL / LocalStorage
    let products = JSON.parse(localStorage.getItem('pcpos_products')) || DEFAULT_PRODUCTS;

    // Tải dữ liệu danh sách sản phẩm thời gian thực từ MySQL Database
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
                renderProductsGrid();
                console.log('[POS SALES MYSQL SYNC] Đã tải', products.length, 'sản phẩm lên Màn hình Bán Hàng!');
            }
        }).catch(err => console.error('[POS SALES MYSQL SYNC ERROR]', err));



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

    // 3. Khai báo biến giỏ hàng và voucher
    let cart = [];
    let activeVoucher = null; // { code, type, value }
    let selectedCategory = 'Tất cả';
    let searchQuery = '';

    // 4. Các DOM Elements
    const productsGrid = document.getElementById('productsGrid');
    const categoryFilterBar = document.getElementById('categoryFilterBar');
    const searchProductInput = document.getElementById('searchProductInput');
    const cartItemsList = document.getElementById('cartItemsList');
    const emptyCartPlaceholder = document.getElementById('emptyCartPlaceholder');
    const btnClearCartBtn = document.getElementById('btnClearCartBtn');
    
    const customerNameInput = document.getElementById('customerNameInput');
    const paymentMethodSelect = document.getElementById('paymentMethodSelect');
    const voucherCodeInput = document.getElementById('voucherCodeInput');
    const btnApplyVoucher = document.getElementById('btnApplyVoucher');
    const voucherStatusMsg = document.getElementById('voucherStatusMsg');
    const cartNoteInput = document.getElementById('cartNoteInput');

    const priceSubtotal = document.getElementById('priceSubtotal');
    const priceDiscount = document.getElementById('priceDiscount');
    const priceTotal = document.getElementById('priceTotal');
    const btnCheckout = document.getElementById('btnCheckout');

    // Modal preview
    const billPreviewModal = document.getElementById('billPreviewModal');
    const billPreviewImage = document.getElementById('billPreviewImage');
    const btnCloseBillPreview = document.getElementById('btnCloseBillPreview');
    const btnDownloadBillModal = document.getElementById('btnDownloadBillModal');
    const btnFinishCheckout = document.getElementById('btnFinishCheckout');

    // 5. Đồng bộ thông tin Sidebar user
    function updateSidebarProfile() {
        const letter = activeUser.name.charAt(0).toUpperCase();
        document.querySelector('.user-avatar-letter').textContent = letter;
        document.querySelector('.user-name-text').textContent = activeUser.name;
        document.querySelector('.user-role-text').textContent = activeUser.role;
    }
    updateSidebarProfile();

    // Toggle Dropdown người dùng ở sidebar
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

    // Đăng xuất
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('sessionActiveUser');
            window.location.href = "../04_Phan_He_Login_Xac_Thuc/login.html";
        });
    }

    // Định dạng tiền tệ
    function formatMoney(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " đ";
    }

    // 6. Vẽ danh sách sản phẩm (Lưới bên trái)
    function renderProducts() {
        productsGrid.innerHTML = '';
        const filtered = products.filter(p => {
            const matchesCat = (selectedCategory === 'Tất cả' || p.category === selectedCategory);
            const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCat && matchesSearch;
        });

        if (filtered.length === 0) {
            productsGrid.innerHTML = `<div class="text-center" style="grid-column: 1/-1; padding: 40px; color: var(--text-muted);">Không tìm thấy sản phẩm nào phù hợp!</div>`;
            return;
        }

        filtered.forEach(p => {
            const card = document.createElement('div');
            card.className = `product-card ${p.stock <= 0 ? 'disabled' : ''}`;
            
            const imageUrl = p.image || CATEGORY_IMAGES[p.category] || CATEGORY_IMAGES['Gear'];
            
            card.innerHTML = `
                <div class="product-icon-container">
                    <img src="${imageUrl}" alt="${p.name}" class="product-image-img" loading="lazy">
                </div>
                <div class="product-info-wrapper">
                    <span class="product-cat-tag">${p.category}</span>
                    <span class="product-name-text" title="${p.name}">${p.name}</span>
                </div>
                <div class="product-price-row">
                    <span class="product-price-text">${formatMoney(p.price)}</span>
                    <span class="product-stock-text ${p.stock <= 0 ? 'out-of-stock' : ''}">
                        ${p.stock > 0 ? `Còn: ${p.stock}` : 'Hết hàng'}
                    </span>
                </div>
                <button class="btn-add-to-cart" ${p.stock <= 0 ? 'disabled' : ''}>
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                    Thêm vào giỏ
                </button>
            `;

            // Bắt sự kiện thêm vào giỏ hàng
            const addBtn = card.querySelector('.btn-add-to-cart');
            if (addBtn) {
                addBtn.addEventListener('click', () => {
                    addToCart(p);
                });
            }

            productsGrid.appendChild(card);
        });
    }

    // 7. Lọc danh mục sản phẩm
    categoryFilterBar.querySelectorAll('.cat-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            categoryFilterBar.querySelector('.cat-btn.active').classList.remove('active');
            btn.classList.add('active');
            selectedCategory = btn.getAttribute('data-category');
            renderProducts();
        });
    });

    // 8. Tìm kiếm nhanh sản phẩm
    searchProductInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.trim();
        renderProducts();
    });

    // 9. Logic Giỏ hàng
    function addToCart(product) {
        const exist = cart.find(item => item.id === product.id);
        if (exist) {
            if (exist.qty >= product.stock) {
                showToast(`Chỉ còn ${product.stock} sản phẩm trong kho!`, 'error');
                return;
            }
            exist.qty++;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                category: product.category,
                price: product.price,
                qty: 1,
                stock: product.stock
            });
        }
        renderCart();
        showToast(`Đã thêm ${product.name} vào giỏ!`, 'success');
    }

    
    
        // ==========================================================================
    // TRỢ LÝ AI KIỂM TRA TƯƠNG THÍCH HARDWARE & CÔNG SUẤT NGUỜN (SMART SINGLE BUILD GUARD)
    // ==========================================================================
    function updateHardwareGuardUI() {
        const guardStatusBadge = document.getElementById('guardStatusBadge');
        const guardPowerVal = document.getElementById('guardPowerVal');
        const guardPsuVal = document.getElementById('guardPsuVal');
        const guardPowerFill = document.getElementById('guardPowerFill');
        const guardDetailMsg = document.getElementById('guardDetailMsg');

        if (!guardStatusBadge || !guardPowerVal) return;

        if (!cart || cart.length === 0) {
            guardStatusBadge.textContent = '⚡ Sẵn sàng';
            guardStatusBadge.style.background = '#E2E8F0';
            guardStatusBadge.style.color = '#475569';
            guardPowerVal.textContent = '0W';
            if (guardPsuVal) {
                guardPsuVal.textContent = 'Chưa chọn';
                guardPsuVal.style.color = '#64748B';
            }
            if (guardPowerFill) {
                guardPowerFill.style.width = '0%';
                guardPowerFill.style.background = '#10B981';
            }
            if (guardDetailMsg) {
                guardDetailMsg.innerHTML = 'Thêm linh kiện PC (CPU, VGA, Main, RAM, Nguồn...) vào giỏ để kích hoạt AI kiểm tra tương thích tự động.';
            }
            return;
        }

        let cpuWatt = 0;
        let vgaWatt = 0;
        let mainWatt = 0;
        let ramWatt = 0;
        let ssdWatt = 0;
        let selectedPsuWatt = 0;

        let cpuItem = null;
        let mainItem = null;
        let ramItem = null;
        let vgaItem = null;

        let totalCpuQty = 0;
        let totalVgaQty = 0;

        cart.forEach(item => {
            const name = (item.name || '').toLowerCase();
            const cat = (item.category || '').toLowerCase();
            const qty = item.qty || 1;

            // Detect CPU (AI thông minh: 1 bộ máy chỉ tính 1 CPU dù giỏ hàng có số lượng bao nhiêu)
            if (cat === 'cpu' || name.includes('cpu') || name.includes('intel') || name.includes('ryzen') || name.includes('i7') || name.includes('i5') || name.includes('i9')) {
                cpuItem = item;
                totalCpuQty += qty;
                let unitWatt = 75;
                if (name.includes('13700') || name.includes('14700') || name.includes('i9')) unitWatt = 185;
                else if (name.includes('7800x3d') || name.includes('ryzen 7')) unitWatt = 125;
                cpuWatt = Math.max(cpuWatt, unitWatt);
            }
            // Detect VGA (Tối đa 2 VGA cho 1 bộ PC)
            else if (cat === 'vga' || name.includes('vga') || name.includes('rtx') || name.includes('gtx') || name.includes('radeon')) {
                vgaItem = item;
                totalVgaQty += qty;
                let unitWatt = 180;
                if (name.includes('4090') || name.includes('5090')) unitWatt = 450;
                else if (name.includes('4080') || name.includes('5070') || name.includes('7900')) unitWatt = 320;
                else if (name.includes('4070') || name.includes('3080')) unitWatt = 220;
                else if (name.includes('4060') || name.includes('3060')) unitWatt = 160;
                vgaWatt += unitWatt * Math.min(qty, 2);
            }
            // Detect Mainboard (1 Mainboard per build)
            else if (cat === 'mainboard' || cat === 'main' || name.includes('main') || name.includes('b760') || name.includes('z790') || name.includes('b650')) {
                mainItem = item;
                mainWatt = 50;
            }
            // Detect RAM (Tối đa 4 thanh RAM)
            else if (cat === 'ram' || name.includes('ram') || name.includes('corsair') || name.includes('g.skill')) {
                ramItem = item;
                ramWatt += 10 * Math.min(qty, 4);
            }
            // Detect SSD (Tối đa 4 ổ SSD)
            else if (cat === 'ssd' || name.includes('ssd') || name.includes('nvme')) {
                ssdWatt += 10 * Math.min(qty, 4);
            }
            // Detect PSU (Nguồn)
            else if (cat === 'nguồn' || cat === 'psu' || name.includes('nguồn') || name.includes('psu') || name.includes('650w') || name.includes('750w') || name.includes('850w') || name.includes('550w')) {
                let unitPsu = 650;
                if (name.includes('1000')) unitPsu = 1000;
                else if (name.includes('850')) unitPsu = 850;
                else if (name.includes('750')) unitPsu = 750;
                else if (name.includes('650')) unitPsu = 650;
                else if (name.includes('550')) unitPsu = 550;
                selectedPsuWatt = Math.max(selectedPsuWatt, unitPsu);
            }
        });

        // Tính tổng công suất cho 1 dàn máy chuẩn (Baseline 35W)
        let totalWattage = 35 + cpuWatt + vgaWatt + mainWatt + ramWatt + ssdWatt;

        // Extract Socket & RAM specs
        let cpuSocket = cpuItem ? ((cpuItem.name.toLowerCase().includes('ryzen') || cpuItem.name.toLowerCase().includes('am5')) ? 'AM5' : 'LGA1700') : null;
        let mainSocket = mainItem ? ((mainItem.name.toLowerCase().includes('b650') || mainItem.name.toLowerCase().includes('am5')) ? 'AM5' : 'LGA1700') : null;

        let mainRamSlot = mainItem ? (mainItem.name.toLowerCase().includes('ddr4') ? 'DDR4' : 'DDR5') : null;
        let ramType = ramItem ? (ramItem.name.toLowerCase().includes('ddr4') ? 'DDR4' : 'DDR5') : null;

        guardPowerVal.textContent = totalWattage + 'W';

        if (guardPsuVal) {
            if (selectedPsuWatt > 0) {
                guardPsuVal.textContent = selectedPsuWatt + 'W';
                guardPsuVal.style.color = '#059669';
            } else {
                guardPsuVal.textContent = 'Chưa chọn';
                guardPsuVal.style.color = '#DC2626';
            }
        }

        // Check 1: Socket Conflict
        if (cpuSocket && mainSocket && cpuSocket !== mainSocket) {
            guardStatusBadge.textContent = '❌ Lỗi Socket!';
            guardStatusBadge.style.background = '#FEE2E2';
            guardStatusBadge.style.color = '#DC2626';
            if (guardPowerFill) {
                guardPowerFill.style.width = '100%';
                guardPowerFill.style.background = '#EF4444';
            }
            if (guardDetailMsg) {
                guardDetailMsg.innerHTML = `<span style="color:#DC2626; font-weight:700;">❌ Xung đột Socket:</span> ${cpuItem.name} (${cpuSocket}) không cắm vừa ${mainItem.name} (${mainSocket})!`;
            }
            return;
        }

        // Check 2: RAM Slot Conflict
        if (mainRamSlot && ramType && mainRamSlot !== ramType) {
            guardStatusBadge.textContent = '❌ Lỗi Slot RAM!';
            guardStatusBadge.style.background = '#FEE2E2';
            guardStatusBadge.style.color = '#DC2626';
            if (guardPowerFill) {
                guardPowerFill.style.width = '100%';
                guardPowerFill.style.background = '#EF4444';
            }
            if (guardDetailMsg) {
                guardDetailMsg.innerHTML = `<span style="color:#DC2626; font-weight:700;">❌ Xung đột RAM:</span> ${mainItem.name} (${mainRamSlot}) không vừa thanh ${ramItem.name} (${ramType})!`;
            }
            return;
        }

        // Check 3: PSU Load
        if (selectedPsuWatt > 0) {
            const percent = Math.min(100, Math.round((totalWattage / selectedPsuWatt) * 100));
            if (guardPowerFill) guardPowerFill.style.width = percent + '%';

            if (totalWattage > selectedPsuWatt) {
                guardStatusBadge.textContent = '⚠ Quá tải Nguồn!';
                guardStatusBadge.style.background = '#FEE2E2';
                guardStatusBadge.style.color = '#DC2626';
                if (guardPowerFill) guardPowerFill.style.background = '#EF4444';
                const recWatt = totalWattage > 700 ? '850W' : '750W';
                if (guardDetailMsg) guardDetailMsg.innerHTML = `<span style="color:#DC2626; font-weight:700;">⚠ Cảnh báo Nguồn:</span> Công suất 1 dàn (${totalWattage}W) vượt quá Nguồn ${selectedPsuWatt}W (Đề xuất Nguồn ≥ ${recWatt}).`;
            } else if (percent > 85) {
                guardStatusBadge.textContent = '⚡ Tải Nguồn Cao';
                guardStatusBadge.style.background = '#FEF3C7';
                guardStatusBadge.style.color = '#D97706';
                if (guardPowerFill) guardPowerFill.style.background = '#F59E0B';
                if (guardDetailMsg) guardDetailMsg.innerHTML = `Bộ Nguồn ${selectedPsuWatt}W đang chạy ở mức ${percent}% tải (${totalWattage}W). Nên chọn Nguồn công suất lớn hơn.`;
            } else {
                guardStatusBadge.textContent = '✔ Tương thích 100%';
                guardStatusBadge.style.background = '#D1FAE5';
                guardStatusBadge.style.color = '#059669';
                if (guardPowerFill) guardPowerFill.style.background = '#10B981';
                let noteQty = totalCpuQty > 1 ? ` (Tính 1 CPU/bộ máy)` : '';
                if (guardDetailMsg) guardDetailMsg.innerHTML = `✔ <strong style="color:#059669;">Cấu hình chuẩn 100%!</strong> Công suất ${totalWattage}W${noteQty} chạy an toàn trên Nguồn ${selectedPsuWatt}W (Tải ${percent}%).`;
            }
        } else {
            const psuRec = totalWattage > 500 ? '750W' : '650W';
            if (guardPowerFill) {
                guardPowerFill.style.width = '30%';
                guardPowerFill.style.background = '#3B82F6';
            }
            guardStatusBadge.textContent = '💡 Cần chọn Nguồn';
            guardStatusBadge.style.background = '#DBEAFE';
            guardStatusBadge.style.color = '#2563EB';
            if (guardDetailMsg) guardDetailMsg.innerHTML = `Công suất 1 bộ máy: <strong>${totalWattage}W</strong>. Đề xuất thêm Nguồn (PSU) ≥ <strong>${psuRec}</strong>.`;
        }
    }

    function renderCart() {
        if (cart.length === 0) {
            emptyCartPlaceholder.style.display = 'flex';
            cartItemsList.querySelectorAll('.cart-item-row').forEach(row => row.remove());
            btnClearCartBtn.style.display = 'none';
        } else {
            emptyCartPlaceholder.style.display = 'none';
            cartItemsList.querySelectorAll('.cart-item-row').forEach(row => row.remove());
            btnClearCartBtn.style.display = 'block';

            cart.forEach(item => {
                const row = document.createElement('div');
                row.className = 'cart-item-row';
                row.style.cssText = 'display: flex; gap: 8px; align-items: center; padding: 8px 10px; background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 8px; margin-bottom: 6px;';
                
                const itemImg = item.image || CATEGORY_IMAGES[item.category] || CATEGORY_IMAGES['Gear'] || 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=400&q=80';

                row.innerHTML = `
                    <img src="${itemImg}" style="width: 40px; height: 40px; object-fit: cover; border-radius: 6px; border: 1px solid #E2E8F0; flex-shrink: 0;" alt="${item.name}">
                    <div class="cart-item-info" style="flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px;">
                        <span class="cart-item-name" style="font-size: 12px; font-weight: 600; color: #1E293B; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${item.name}">${item.name}</span>
                        <span class="cart-item-price" style="font-size: 11.5px; font-weight: 700; color: var(--accent-red);">${formatMoney(item.price)}</span>
                    </div>
                    <div class="qty-controller" style="display: flex; align-items: center; border: 1px solid #CBD5E1; border-radius: 6px; overflow: hidden; background: #FFFFFF; height: 24px;">
                        <button class="qty-btn dec-btn" style="width: 22px; height: 100%; border: none; background: #F8FAFC; cursor: pointer; font-weight: 700; color: #475569;">-</button>
                        <input type="text" class="qty-val" value="${item.qty}" readonly style="width: 22px; height: 100%; border: none; text-align: center; font-size: 11px; font-weight: 700; color: #1E293B; background: transparent;">
                        <button class="qty-btn inc-btn" style="width: 22px; height: 100%; border: none; background: #F8FAFC; cursor: pointer; font-weight: 700; color: #475569;">+</button>
                    </div>
                    <button class="btn-remove-item" title="Xóa món" style="border: none; background: transparent; cursor: pointer; color: #94A3B8; padding: 2px; display: flex; align-items: center;">
                        <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path>
                        </svg>
                    </button>
                `;

                // Bắt sự kiện giảm số lượng
                row.querySelector('.dec-btn').addEventListener('click', () => {
                    if (item.qty > 1) {
                        item.qty--;
                        renderCart();
                    } else {
                        cart = cart.filter(c => c.id !== item.id);
                        renderCart();
                    }
                });

                // Bắt sự kiện tăng số lượng
                row.querySelector('.inc-btn').addEventListener('click', () => {
                    if (item.qty >= item.stock) {
                        showToast(`Không thể vượt quá số lượng kho (${item.stock})!`, 'error');
                        return;
                    }
                    item.qty++;
                    renderCart();
                });

                // Bắt sự kiện xóa dòng
                row.querySelector('.btn-remove-item').addEventListener('click', () => {
                    cart = cart.filter(c => c.id !== item.id);
                    renderCart();
                });

                cartItemsList.appendChild(row);
            });
        }

        calculatePricing();
        updateHardwareGuardUI();
    }


    // Xóa giỏ hàng
    btnClearCartBtn.addEventListener('click', () => {
        cart = [];
        activeVoucher = null;
        voucherCodeInput.value = '';
        voucherStatusMsg.className = 'voucher-status-msg';
        voucherStatusMsg.textContent = '';
        renderCart();
    });

    // 10. Tính toán tiền thanh toán
    function calculatePricing() {
        let subtotal = cart.reduce((total, item) => total + (item.price * item.qty), 0);
        let discount = 0;

        if (activeVoucher) {
            let eligibleSubtotal = 0;
            const applyTo = activeVoucher.apply_to || 'all';
            const applyValue = (activeVoucher.apply_value || '').toLowerCase();
            
            if (applyTo === 'all') {
                eligibleSubtotal = subtotal;
            } else {
                cart.forEach(item => {
                    const itemName = (item.name || '').toLowerCase();
                    const itemCat = (item.category || '').toLowerCase();
                    const itemId = (item.id || '').toLowerCase();
                    
                    if (applyTo === 'brand' && (itemName.includes(applyValue) || itemCat.includes(applyValue))) {
                        eligibleSubtotal += (item.price * item.qty);
                    } else if (applyTo === 'product' && (itemId === applyValue || itemName.includes(applyValue))) {
                        eligibleSubtotal += (item.price * item.qty);
                    }
                });
            }

            if (activeVoucher.type === 'percent') {
                discount = eligibleSubtotal * (activeVoucher.value / 100);
            } else if (activeVoucher.type === 'flat') {
                // For flat discount on specific items, cap it at eligibleSubtotal
                discount = Math.min(activeVoucher.value, eligibleSubtotal);
            }
        }

        let total = Math.max(0, subtotal - discount);

        priceSubtotal.textContent = formatMoney(subtotal);
        priceDiscount.textContent = `-${formatMoney(discount)}`;
        priceTotal.textContent = formatMoney(total);
    }

    // 11. Áp dụng Voucher
    btnApplyVoucher.addEventListener('click', () => {
        const code = voucherCodeInput.value.trim().toUpperCase();
        if (!code) {
            activeVoucher = null;
            voucherStatusMsg.className = 'voucher-status-msg';
            voucherStatusMsg.textContent = '';
            calculatePricing();
            return;
        }

        // Đọc voucher từ DB (localStorage)
        let dbVouchers = JSON.parse(localStorage.getItem('vouchers')) || [];
        // Support fallback if 'vouchers' is empty but they use the old names
        if (dbVouchers.length === 0) {
            dbVouchers = [
                { code: 'SALES10', discount_type: 'percent', discount_value: 10, status: 'Hoạt động', apply_to: 'all', apply_value: '' },
                { code: 'TECHNO100K', discount_type: 'flat', discount_value: 100000, status: 'Hoạt động', apply_to: 'all', apply_value: '' },
                { code: 'VIP20', discount_type: 'percent', discount_value: 20, status: 'Hoạt động', apply_to: 'all', apply_value: '' }
            ];
        }

        const validVoucher = dbVouchers.find(v => v.code.toUpperCase() === code);

        if (validVoucher) {
            if (validVoucher.status !== 'Hoạt động' && validVoucher.status !== 'running') {
                activeVoucher = null;
                voucherStatusMsg.className = 'voucher-status-msg error';
                voucherStatusMsg.textContent = 'Mã giảm giá đã hết hạn hoặc bị hủy!';
            } else {
                activeVoucher = { 
                    code: validVoucher.code, 
                    type: validVoucher.discount_type || (validVoucher.type === 'percent' ? 'percent' : 'flat'), // fallback
                    value: validVoucher.discount_value || validVoucher.value, // fallback
                    apply_to: validVoucher.apply_to || 'all',
                    apply_value: validVoucher.apply_value || ''
                };
                voucherStatusMsg.className = 'voucher-status-msg success';
                const discountText = activeVoucher.type === 'percent' ? `${activeVoucher.value}%` : `${formatMoney(activeVoucher.value)}`;
                
                let applyText = 'cho toàn bộ đơn hàng';
                if (activeVoucher.apply_to === 'brand') applyText = `cho hãng/loại ${activeVoucher.apply_value}`;
                if (activeVoucher.apply_to === 'product') applyText = `cho sản phẩm mã ${activeVoucher.apply_value}`;
                
                voucherStatusMsg.textContent = `Áp dụng giảm ${discountText} ${applyText} thành công!`;
            }
        } else {
            activeVoucher = null;
            voucherStatusMsg.className = 'voucher-status-msg error';
            voucherStatusMsg.textContent = 'Mã giảm giá không tồn tại!';
        }

        calculatePricing();
    });

    // 12. Xác nhận checkout & Vẽ Hóa đơn Canvas
    let generatedInvoice = null;
    let currentPreviewDataUrl = null;

    function processCheckout() {
        if (cart.length === 0) {
            showToast('Giỏ hàng trống! Vui lòng chọn sản phẩm.', 'error');
            return;
        }

        const customer = customerNameInput.value.trim() || 'Khách lẻ';
        const paymentMethod = paymentMethodSelect.value;
        const note = cartNoteInput.value.trim() || 'Bán trực tiếp tại quầy';
        const subtotal = cart.reduce((total, item) => total + (item.price * item.qty), 0);
        let discount = 0;
        if (activeVoucher) {
            let eligibleSubtotal = 0;
            const applyTo = activeVoucher.apply_to || 'all';
            const applyValue = (activeVoucher.apply_value || '').toLowerCase();
            
            if (applyTo === 'all') {
                eligibleSubtotal = subtotal;
            } else {
                cart.forEach(item => {
                    const itemName = (item.name || '').toLowerCase();
                    const itemCat = (item.category || '').toLowerCase();
                    const itemId = (item.id || '').toLowerCase();
                    
                    if (applyTo === 'brand' && (itemName.includes(applyValue) || itemCat.includes(applyValue))) {
                        eligibleSubtotal += (item.price * item.qty);
                    } else if (applyTo === 'product' && (itemId === applyValue || itemName.includes(applyValue))) {
                        eligibleSubtotal += (item.price * item.qty);
                    }
                });
            }

            if (activeVoucher.type === 'percent') {
                discount = eligibleSubtotal * (activeVoucher.value / 100);
            } else if (activeVoucher.type === 'flat') {
                discount = Math.min(activeVoucher.value, eligibleSubtotal);
            }
        }
        const total = Math.max(0, subtotal - discount);

        // Tạo mã đơn hàng ngẫu nhiên không trùng trong danh sách
        const invoices = JSON.parse(localStorage.getItem('pcpos_invoices')) || [];
        let id;
        do {
            id = 'HD' + Math.floor(1000 + Math.random() * 9000);
        } while (invoices.some(inv => inv.id === id));

        const now = new Date();
        const yyyy = now.getFullYear();
        const mm = String(now.getMonth() + 1).padStart(2, '0');
        const dd = String(now.getDate()).padStart(2, '0');
        const dateStr = `${yyyy}-${mm}-${dd}`; // YYYY-MM-DD (Local Time 100%)
        const displayDate = `${dd}/${mm}/${yyyy}`;
        const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        const displayDateTime = displayDate + ' - ' + timeStr;

        // Tạo đối tượng hóa đơn
        generatedInvoice = {
            id,
            date: dateStr,
            time: timeStr,
            staff: activeUser.name,
            customer,
            total,
            status: 'Đã thanh toán',
            paymentMethod,
            note,
            items: cart.map(item => ({
                name: item.name,
                category: item.category,
                qty: item.qty,
                price: item.price
            })),
            timeline: [
                { title: 'Đã thanh toán', desc: 'Giao dịch đã được thanh toán thành công', time: displayDateTime, type: 'success' },
                { title: '🛡️ Kiểm tra tương thích AI Hardware Guard', desc: (document.getElementById('guardDetailMsg') ? document.getElementById('guardDetailMsg').innerText : 'Cấu hình linh kiện máy tính khớp 100%'), time: displayDateTime, type: 'success' },
                { title: 'Đặt hàng thành công', desc: 'Đơn hàng đã được tạo thành công', time: displayDateTime, type: 'default' }
            ]
        };

        // --- LƯU THỰC TẾ NGAY LẬP TỨC KHI BẤM THANH TOÁN (Tránh lỗi đóng modal mất đơn) ---
                // --- LƯU THỰC TẾ NGAY LẬP TỨC KHI BẤM THANH TOÁN (Tránh lỗi đóng modal mất đơn) ---
        invoices.unshift(generatedInvoice);
        localStorage.setItem('pcpos_invoices', JSON.stringify(invoices));

        // Đồng bộ lưu trực tiếp vào CSDL MySQL Database
        fetch('/api/invoices', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: generatedInvoice.id,
                customer: generatedInvoice.customer,
                seller: generatedInvoice.staff,
                staff: generatedInvoice.staff,
                total: generatedInvoice.total,
                discount: discount,
                finalTotal: generatedInvoice.total,
                paymentMethod: generatedInvoice.paymentMethod,
                status: 'Đã thanh toán',
                date: generatedInvoice.date,
                time: generatedInvoice.time,
                items: generatedInvoice.items
            })
        }).then(res => res.json())
          .then(data => console.log('[MYSQL INVOICE CREATED SUCCESS]', generatedInvoice.id, data.message))
          .catch(err => console.error('[MYSQL INVOICE ERROR]', err));
        if (window.addNotification) {
            const firstItemName = generatedInvoice.items.length > 0 ? generatedInvoice.items[0].name : 'Sản phẩm';
            const extraCount = generatedInvoice.items.length > 1 ? ` (và ${generatedInvoice.items.length - 1} sản phẩm khác)` : '';
            window.addNotification(
                `Đơn hàng mới #${generatedInvoice.id}`,
                `${firstItemName}${extraCount} đã được thanh toán thành công.`,
                'order'
            );
        }


        // Trừ tồn kho trong danh sách sản phẩm pcpos_products
        cart.forEach(item => {
            const product = products.find(p => p.id === item.id);
            if (product) {
                product.stock = Math.max(0, product.stock - item.qty);
            }
        });
        localStorage.setItem('pcpos_products', JSON.stringify(products));

        // Reset giỏ hàng và UI nhập liệu
        cart = [];
        activeVoucher = null;
        voucherCodeInput.value = '';
        customerNameInput.value = 'Khách lẻ';
        cartNoteInput.value = '';
        if (voucherStatusMsg) {
            voucherStatusMsg.className = 'voucher-status-msg';
            voucherStatusMsg.textContent = '';
        }
        
        renderCart();
        renderProducts();

        // Vẽ hóa đơn trên Canvas để preview & lưu
        drawInvoiceCanvas(generatedInvoice);
    }

    btnCheckout.addEventListener('click', () => {
        if (cart.length === 0) {
            showToast('Giỏ hàng trống! Vui lòng chọn sản phẩm.', 'error');
            return;
        }
        
        const paymentMethod = paymentMethodSelect.value;
        if (paymentMethod === 'Chuyển khoản') {
            document.getElementById('qrPaymentModal').classList.remove('hidden');
        } else {
            processCheckout();
        }
    });

    document.getElementById('btnCancelQrPayment')?.addEventListener('click', () => {
        document.getElementById('qrPaymentModal').classList.add('hidden');
    });

    document.getElementById('btnConfirmQrPayment')?.addEventListener('click', () => {
        document.getElementById('qrPaymentModal').classList.add('hidden');
        processCheckout();
    });

    // Vẽ Canvas hóa đơn siêu nét giống hệt admin
    function drawInvoiceCanvas(inv) {
        const canvas = document.getElementById('invoiceRenderCanvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        
        // Tính toán kích thước chiều cao động theo số lượng mặt hàng
        const itemHeight = 35;
        const baseHeight = 440;
        const dynamicHeight = baseHeight + (inv.items.length * itemHeight);
        canvas.height = dynamicHeight;

        // 1. Tô nền trắng tinh khôi
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // 2. Vẽ viền kép đỏ đô xung quanh biên ngoài siêu cao cấp
        ctx.strokeStyle = '#CC182C';
        ctx.lineWidth = 4;
        ctx.strokeRect(8, 8, canvas.width - 16, canvas.height - 16);
        ctx.strokeStyle = '#CC182C';
        ctx.lineWidth = 1;
        ctx.strokeRect(13, 13, canvas.width - 26, canvas.height - 26);
        
        const centerX = canvas.width / 2;
        let currentY = 45;

        // Vẽ biểu tượng sọc đỏ chéo góc (Thương hiệu cao cấp)
        ctx.fillStyle = '#CC182C';
        ctx.beginPath();
        ctx.moveTo(14, 14);
        ctx.lineTo(60, 14);
        ctx.lineTo(14, 60);
        ctx.closePath();
        ctx.fill();

        // 3. Header cửa hàng
        ctx.textAlign = 'center';
        ctx.fillStyle = '#151824';
        ctx.font = 'bold 26px "Rajdhani", sans-serif';
        ctx.fillText('TECHNO COMPUTER STORE', centerX, currentY);
        
        currentY += 20;
        ctx.font = '500 11px "Inter", sans-serif';
        ctx.fillStyle = '#596A77';
        ctx.fillText('Địa chỉ: 182 Lê Duẩn, Hải Châu, Đà Nẵng', centerX, currentY);
        
        currentY += 16;
        ctx.fillText('Hotline: 0905.123.456 | Website: technostore.vn', centerX, currentY);
        
        currentY += 22;
        // Đường phân cách mờ đầu tiên
        function drawDivider(y) {
            ctx.strokeStyle = '#E2E8F0';
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.moveTo(30, y);
            ctx.lineTo(450, y);
            ctx.stroke();
        }
        drawDivider(currentY);

        // 4. Tiêu đề Hóa Đơn
        currentY += 32;
        ctx.fillStyle = '#CC182C';
        ctx.font = 'bold 20px "Rajdhani", sans-serif';
        ctx.fillText('HÓA ĐƠN THANH TOÁN BÁN LẺ', centerX, currentY);
        
        currentY += 18;
        ctx.fillStyle = '#151824';
        ctx.font = 'bold 13px "Rajdhani", sans-serif';
        ctx.fillText(`MÃ SỐ ĐƠN: ${inv.id}`, centerX, currentY);
        
        currentY += 15;
        drawDivider(currentY);

        // 5. Khối Meta thông tin (Nhân viên, Khách hàng, Giờ giấc)
        currentY += 24;
        ctx.textAlign = 'left';
        ctx.fillStyle = '#596A77';
        ctx.font = '600 11.5px "Inter", sans-serif';
        ctx.fillText('Thời gian mua:', 35, currentY);
        ctx.fillText('Nhân viên:', 35, currentY + 18);
        ctx.fillText('Khách hàng:', 35, currentY + 36);
        ctx.fillText('Phương thức:', 35, currentY + 54);

        ctx.textAlign = 'right';
        ctx.fillStyle = '#151824';
        ctx.font = 'bold 11.5px "Inter", sans-serif';
        ctx.fillText(`${inv.time} - ${inv.date.split('-').reverse().join('/')}`, 445, currentY);
        ctx.fillText(inv.staff, 445, currentY + 18);
        ctx.fillText(inv.customer, 445, currentY + 36);
        ctx.fillText(inv.paymentMethod, 445, currentY + 54);

        // Ghi chú nếu có
        let yOffset = 54;
        if (inv.note && inv.note !== 'Bán trực tiếp tại quầy') {
            currentY += 18;
            ctx.textAlign = 'left';
            ctx.fillStyle = '#596A77';
            ctx.fillText('Ghi chú:', 35, currentY + 54);
            ctx.textAlign = 'right';
            ctx.fillStyle = '#151824';
            ctx.fillText(inv.note, 445, currentY + 54);
            yOffset = 72;
        }

        currentY += yOffset + 15;
        drawDivider(currentY);

        // 6. Bảng danh mục sản phẩm thanh toán
        currentY += 24;
        ctx.textAlign = 'left';
        ctx.fillStyle = '#CC182C';
        ctx.font = 'bold 11px "Inter", sans-serif';
        ctx.fillText('TÊN SẢN PHẨM', 35, currentY);
        
        ctx.textAlign = 'center';
        ctx.fillText('SL', 280, currentY);
        
        ctx.textAlign = 'right';
        ctx.fillText('ĐƠN GIÁ', 360, currentY);
        ctx.fillText('T.TIỀN', 445, currentY);

        currentY += 12;
        drawDivider(currentY);

        // Render từng dòng mặt hàng
        ctx.fillStyle = '#151824';
        ctx.font = '500 11.5px "Inter", sans-serif';
        
        inv.items.forEach(item => {
            currentY += 30;
            
            // Vẽ tên sản phẩm (rút gọn nếu quá dài)
            let displayName = item.name;
            if (displayName.length > 30) {
                displayName = displayName.substring(0, 28) + '...';
            }
            ctx.textAlign = 'left';
            ctx.fillText(displayName, 35, currentY);
            
            ctx.textAlign = 'center';
            ctx.fillText(item.qty.toString(), 280, currentY);
            
            ctx.textAlign = 'right';
            ctx.fillText(formatMoney(item.price).replace(' đ', ''), 360, currentY);
            
            const lineTotal = item.price * item.qty;
            ctx.fillText(formatMoney(lineTotal).replace(' đ', ''), 445, currentY);
        });

        currentY += 20;
        drawDivider(currentY);

        // 7. Khối tổng giá trị
        currentY += 24;
        ctx.textAlign = 'left';
        ctx.fillStyle = '#596A77';
        ctx.font = '500 11.5px "Inter", sans-serif';
        ctx.fillText('Tạm tính:', 260, currentY);
        
        ctx.textAlign = 'right';
        ctx.fillStyle = '#151824';
        ctx.fillText(formatMoney(inv.total).replace(' đ', ''), 445, currentY);

        // Dòng giảm giá nếu có
        let subtotal = inv.items.reduce((sum, item) => sum + (item.price * item.qty), 0);
        let discount = subtotal - inv.total;
        if (discount > 0) {
            currentY += 18;
            ctx.textAlign = 'left';
            ctx.fillStyle = '#10B981';
            ctx.fillText('Giảm giá:', 260, currentY);
            ctx.textAlign = 'right';
            ctx.fillText(`-${formatMoney(discount).replace(' đ', '')}`, 445, currentY);
        }

        // Đường gạch nét đứt tổng kết tiền thanh toán
        currentY += 15;
        ctx.strokeStyle = '#E2E8F0';
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(260, currentY);
        ctx.lineTo(445, currentY);
        ctx.stroke();
        ctx.setLineDash([]); // Reset nét liền
        
        // Tổng tiền thanh toán
        currentY += 22;
        ctx.textAlign = 'left';
        ctx.fillStyle = '#151824';
        ctx.font = 'bold 12.5px "Inter", sans-serif';
        ctx.fillText('TỔNG THANH TOÁN:', 220, currentY);
        
        ctx.textAlign = 'right';
        ctx.fillStyle = '#CC182C';
        ctx.font = 'bold 18px "Rajdhani", sans-serif';
        ctx.fillText(formatMoney(inv.total), 445, currentY);
        
        currentY += 25;
        drawDivider(currentY);
        
        // Lời cảm ơn chân thành
        currentY += 45;
        ctx.textAlign = 'center';
        ctx.fillStyle = '#596A77';
        ctx.font = 'italic 11px "Inter", sans-serif';
        ctx.fillText('Cảm ơn bạn đã đồng hành cùng Techno Store!', centerX, currentY);
        ctx.fillText('Mọi phản hồi bảo hành xin liên hệ technostore.vn', centerX, currentY + 16);

        // Trích xuất base64 ảnh PNG
        const dataUrl = canvas.toDataURL('image/png');
        currentPreviewDataUrl = dataUrl;

        // Hiển thị preview modal
        billPreviewImage.src = dataUrl;
        billPreviewModal.classList.remove('hidden');

        // Gửi POST tự động lưu bill về ổ D
        const API_BASE = window.location.port === '3000' ? '' : 'http://127.0.0.1:3000';
        fetch(`${API_BASE}/api/save-bill`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                image: dataUrl,
                filename: `Ngày ${inv.date}/Đơn ${inv.id}.png`
            })
        })
        .then(res => res.json())
        .then(resData => {
            if (resData.status === 'success') {
                showToast(`[TỰ ĐỘNG LƯU] Hóa đơn ${inv.id} thành công!`);
            } else {
                showToast(`Lỗi tự động lưu ổ D: ${resData.message}`);
            }
        })
        .catch(err => {
            console.log("Local auto-save server is offline.", err);
            showToast("Đã vẽ bill thành công! Server backend đang offline.");
        });
    }

    // Nút Tải ảnh hóa đơn thủ công
    btnDownloadBillModal.addEventListener('click', () => {
        if (!currentPreviewDataUrl || !generatedInvoice) return;
        const link = document.createElement('a');
        link.download = `Don_hang_${generatedInvoice.id}.png`;
        link.href = currentPreviewDataUrl;
        link.click();
    });

    // Nút Đóng preview modal
    btnCloseBillPreview.addEventListener('click', () => {
        billPreviewModal.classList.add('hidden');
    });

    // Nút Hoàn tất giao dịch (Đóng modal vì đơn đã lưu ngay khi bấm Thanh toán)
    btnFinishCheckout.addEventListener('click', () => {
        billPreviewModal.classList.add('hidden');
        showToast('Giao dịch hoàn tất!', 'success');
    });

    // Toast Notification helper
    function showToast(msg, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast-message ${type}`;
        toast.style.cssText = `
            position: fixed;
            bottom: 24px;
            right: 24px;
            padding: 12px 24px;
            background-color: ${type === 'success' ? '#10B981' : '#EF4444'};
            color: white;
            font-size: 13.5px;
            font-weight: 600;
            border-radius: 8px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
            z-index: 9999;
            animation: slideIn 0.3s ease-out;
        `;
        toast.textContent = msg;

        // CSS slideIn keyframe injection
        if (!document.getElementById('toastKeyframes')) {
            const style = document.createElement('style');
            style.id = 'toastKeyframes';
            style.innerHTML = `
                @keyframes slideIn {
                    from { transform: translateY(50px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(toast);
        setTimeout(() => {
            toast.style.animation = 'slideIn 0.3s ease-in reverse';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // Khởi chạy ban đầu
    renderProducts();
    renderCart();
});
