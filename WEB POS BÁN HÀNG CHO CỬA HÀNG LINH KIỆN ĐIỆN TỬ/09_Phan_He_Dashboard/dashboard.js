/* Techno Admin Dashboard - Logic Trang Quản Trị */

document.addEventListener('DOMContentLoaded', async () => {
    // START FIX: Đồng bộ dữ liệu mới nhất từ MySQL vào localStorage trước khi Dashboard render
    try {
        const [invRes, prodRes, userRes] = await Promise.all([
            fetch('/api/invoices').catch(() => null),
            fetch('/api/products').catch(() => null),
            fetch('/api/users').catch(() => null)
        ]);
        
        if (invRes) {
            const invData = await invRes.json();
            if (invData.status === 'success') {
                localStorage.setItem('pcpos_invoices', JSON.stringify(invData.data));
            }
        }
        if (prodRes) {
            const prodData = await prodRes.json();
            if (prodData.status === 'success') {
                localStorage.setItem('pcpos_products', JSON.stringify(prodData.data));
            }
        }
        if (userRes) {
            const userData = await userRes.json();
            if (userData.status === 'success') {
                localStorage.setItem('users', JSON.stringify(userData.data));
            }
        }
    } catch (e) {
        console.warn("Dashboard sync from MySQL failed:", e);
    }
    // END FIX

    function updateUIProfile(user) {
        if (!user) return;
        const sidebarUser = document.querySelector('.sidebar-user');
        if (!sidebarUser) return;

        const avatarLetter = sidebarUser.querySelector('.user-avatar-letter');
        const userNameText = sidebarUser.querySelector('.user-name-text');
        const userRoleText = sidebarUser.querySelector('.user-role-text');

        if (avatarLetter) avatarLetter.textContent = (user.name || 'A').charAt(0).toUpperCase();
        if (userNameText) userNameText.textContent = user.name || user.username || 'Admin';
        if (userRoleText) userRoleText.textContent = user.role || 'Quản lý cửa hàng';
    }

    // 1. Hiển thị thông tin tài khoản đăng nhập hiện tại từ LocalStorage
    const activeUser = JSON.parse(localStorage.getItem('sessionActiveUser'));
    if (activeUser) {
        updateUIProfile(activeUser);
    }

    // 1.5 Hiệu ứng chạy số KPI (Count-Up Animation)
    function animateCountUp(elementId, targetValue, isMoney = false, suffix = '') {
        const el = document.getElementById(elementId);
        if (!el) return;

        const duration = 1200; // 1.2 giây
        const startTime = performance.now();
        const startValue = 0;

        function update(currentTime) {
            const elapsedTime = currentTime - startTime;
            if (elapsedTime >= duration) {
                const formatted = isMoney ? targetValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") : targetValue;
                el.textContent = formatted + suffix;
                return;
            }

            const progress = elapsedTime / duration;
            const easeProgress = progress * (2 - progress); // easeOutQuad
            const currentValue = Math.floor(startValue + easeProgress * (targetValue - startValue));

            const formatted = isMoney ? currentValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") : currentValue;
            el.textContent = formatted + suffix;
            requestAnimationFrame(update);
        }

        requestAnimationFrame(update);
    }

    // ==========================================================================
    // 1.6 NẠP DỮ LIỆU ĐỘNG TỪ LOCALSTORAGE
    // ==========================================================================
    const invoices = JSON.parse(localStorage.getItem('pcpos_invoices')) || [];
    // Sắp xếp đơn hàng mới nhất lên đầu bảng Dashboard
    invoices.sort((a, b) => {
        const parseDate = (inv) => {
            if (!inv || !inv.date) return 0;
            let parts = inv.date.split(/[-/]/);
            let yyyy, mm, dd;
            if (parts.length === 3) {
                if (parts[0].length === 4) [yyyy, mm, dd] = parts;
                else [dd, mm, yyyy] = parts;
            } else return 0;
            let t = inv.time || '00:00 AM';
            return new Date(`${yyyy}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')} ${t}`).getTime() || 0;
        };
        const timeA = parseDate(a);
        const timeB = parseDate(b);
        if (timeA !== timeB) return timeB - timeA;
        return b.id.localeCompare(a.id);
    });
    const products = JSON.parse(localStorage.getItem('pcpos_products')) || [];
    const usersList = JSON.parse(localStorage.getItem('users')) || [];

    const dateObj = new Date();
    const todayStr = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}`;

    const todayInvoices = invoices.filter(inv => inv.date === todayStr);

    const mockRevenueToday = 20342000;
    const mockNewOrders = 24;
    const mockLowStock = 8;
    const mockTotalStaff = 10;

    const actualRevenueToday = todayInvoices.reduce((sum, inv) => sum + (inv.total || inv.finalTotal || 0), 0);
    const actualNewOrders = todayInvoices.length;
    const actualLowStock = products.filter(p => p.stock > 0 && p.stock < 10).length;
    const actualTotalStaff = usersList.length || 10;

    const displayRevenue = invoices.length > 0 ? actualRevenueToday : mockRevenueToday;
    const displayNewOrders = invoices.length > 0 ? actualNewOrders : mockNewOrders;
    const displayLowStock = products.length > 0 ? actualLowStock : mockLowStock;

    // Chạy các chỉ số KPI động
    animateCountUp('kpiRevenueToday', displayRevenue, true, ' đ');
    animateCountUp('kpiNewOrders', displayNewOrders, false);
    animateCountUp('kpiLowStock', displayLowStock, false);
    animateCountUp('kpiTotalStaff', actualTotalStaff, false);

    // ==========================================================================
    // 1.7 VẼ DỮ LIỆU BẢNG & LƯỚI ĐỘNG TRÊN DASHBOARD
    // ==========================================================================
    const CATEGORY_IMAGES = {
        'CPU': 'https://images.unsplash.com/photo-1591453089816-0fbb971b454c?w=400&q=80',
        'RAM': 'https://images.unsplash.com/photo-1562976540-1502c2145186?w=400&q=80',
        'VGA': 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=400&q=80',
        'Mainboard': 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=80',
        'SSD': 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&q=80',
        'Nguồn': 'https://images.unsplash.com/photo-1616440347437-b1c73416efc2?w=400&q=80',
        'Màn hình': 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&q=80',
        'Tai nghe': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80',
        'Bàn phím': 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&q=80',
        'Chuột': 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=400&q=80',
        'Gear': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80'
    };

    const STAFF_AVATARS = {
        'messi': 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80',
        'năm đô': 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80',
        'nguyễn văn b': 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=80&q=80',
        'huỳnh thị c': 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=80&q=80',
        'admin': 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=80&q=80'
    };

    // A. Render Đơn hàng gần đây (Top 5 mới nhất)
    const recentOrdersTableBody = document.getElementById('recentOrdersTableBody');
    if (recentOrdersTableBody && invoices.length > 0) {
        const sortedInvoices = [...invoices].sort((a, b) => {
            const idA = parseInt(a.id.replace(/\D/g, '')) || 0;
            const idB = parseInt(b.id.replace(/\D/g, '')) || 0;
            return idB - idA;
        });

        const top5Invoices = sortedInvoices.slice(0, 5);
        let tableRowsHtml = '';

        top5Invoices.forEach(inv => {
            let productNames = '';
            let totalQty = 0;
            if (inv.items && inv.items.length > 0) {
                productNames = inv.items[0].name;
                if (inv.items.length > 1) {
                    productNames += ` và ${inv.items.length - 1} món khác`;
                }
                totalQty = inv.items.reduce((sum, item) => sum + item.qty, 0);
            } else {
                productNames = 'N/A';
            }

            let statusBadgeClass = 'success';
            if (inv.status === 'Chờ thanh toán') statusBadgeClass = 'info';
            else if (inv.status === 'Đang xử lý') statusBadgeClass = 'warning';
            else if (inv.status === 'Đã hủy') statusBadgeClass = 'danger';

            const formattedTotal = (inv.total || inv.finalTotal || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + 'đ';

            const displayTimeVal = inv.time ? `${inv.time} - ` : '';
            const displayDateVal = inv.date ? inv.date.split('-').reverse().slice(0, 2).join('/') : '';
            const timestampHtml = `<div style="font-size: 10px; font-weight: normal; color: var(--text-muted); margin-top: 3px;">${displayTimeVal}${displayDateVal}</div>`;

            tableRowsHtml += `
                <tr>
                    <td class="bold text-red">
                        <div>${inv.id}</div>
                        ${timestampHtml}
                    </td>
                    <td>${inv.customer || 'Khách lẻ'}</td>
                    <td>${productNames}</td>
                    <td>${totalQty}</td>
                    <td class="bold">${formattedTotal}</td>
                    <td><span class="status-badge ${statusBadgeClass}">${inv.status || 'Đã thanh toán'}</span></td>
                </tr>
            `;
        });
        recentOrdersTableBody.innerHTML = tableRowsHtml;
    }

            
    // B. Render Sản phẩm bán chạy (Top 5 sản phẩm bán nhiều nhất - ĐỒNG BỘ 100% VỚI QUẢN LÝ SẢN PHẨM)
    const bestsellerGrid = document.getElementById('bestsellerGrid');
    if (bestsellerGrid) {
        const productsList = JSON.parse(localStorage.getItem('pcpos_products')) || [];

        const salesMap = {};
        invoices.forEach(inv => {
            if (inv && inv.items && Array.isArray(inv.items)) {
                inv.items.forEach(item => {
                    const itemName = (item.name || '').trim();
                    const qty = Number(item.qty || 1);
                    if (itemName) salesMap[itemName] = (salesMap[itemName] || 0) + qty;
                });
            }
        });

        // Gán số lượng bán vào từng sản phẩm thực tế
        const rankedProducts = productsList.map(p => {
            const matchedKey = Object.keys(salesMap).find(k => 
                k.toLowerCase() === p.name.toLowerCase() || 
                k.toLowerCase().includes(p.name.toLowerCase()) || 
                p.name.toLowerCase().includes(k.toLowerCase())
            );
            const soldCount = matchedKey ? salesMap[matchedKey] : (p.soldCount || 0);
            return { ...p, soldCount };
        }).sort((a, b) => b.soldCount - a.soldCount);

        const top5Products = rankedProducts.slice(0, 5);

        let gridHtml = '';
        top5Products.forEach((p, idx) => {
            const rank = idx + 1;
            const imageUrl = p.image || 'https://images.unsplash.com/photo-1591453089816-0fbb971b454c?w=400&q=80';
            const formattedPrice = (p.price || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + 'đ';


            gridHtml += `
                <div class="bestseller-card" style="min-width:0; background:#FFF; border:1px solid #E2E8F0; border-radius:12px; padding:10px 8px; text-align:center; position:relative; overflow:hidden;">
                    <div class="bestseller-rank" style="position:absolute; top:6px; left:6px; width:20px; height:20px; border-radius:50%; background:${rank === 1 ? '#FFD700' : rank === 2 ? '#C0C0C0' : rank === 3 ? '#CD7F32' : '#94A3B8'}; color:#FFF; font-weight:700; font-size:10.5px; display:flex; align-items:center; justify-content:center;">${rank}</div>
                    <div class="bestseller-image-wrapper" style="width: 52px; height: 52px; margin: 4px auto 6px auto; overflow: hidden; border-radius: 8px; display: flex; align-items: center; justify-content: center; background: #F8FAFC; border: 1px solid #E2E8F0;">
                        <img src="${imageUrl}" alt="${p.name}" style="width: 100%; height: 100%; object-fit: contain;">
                    </div>
                    <div class="bestseller-name" style="font-weight: 700; font-size: 11.5px; color: #0F172A; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 2px;" title="${p.name}">${p.name}</div>
                    <div class="bestseller-sold" style="font-size: 10.5px; color: #64748B; margin-bottom: 3px;">Đã bán: <span style="font-weight: 700; color: #0F172A;">${p.soldCount}</span></div>
                    <div class="bestseller-price" style="font-weight: 700; font-size: 11.5px; color: #DC2626;">${formattedPrice}</div>
                </div>
            `;

        });
        bestsellerGrid.innerHTML = gridHtml;
    }



    // C. Render Top 3 Nhân viên bán chạy & Bảng xếp hạng Doanh thu Nhân viên Modal
    const topEmployeesList = document.getElementById('topEmployeesList');
    const DEFAULT_STAFF = [
        { id: 'NV001', name: 'Trần Văn Messi', role: 'Quản lý cửa hàng', baseOrders: 36, baseRevenue: 245000000, image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80' },
        { id: 'NV002', name: 'Trần Thị Năm Đô', role: 'Nhân viên bán hàng', baseOrders: 28, baseRevenue: 189000000, image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=80&q=80' },
        { id: 'NV003', name: 'Nguyễn Văn B', role: 'Thu ngân', baseOrders: 22, baseRevenue: 135000000, image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80' },
        { id: 'NV004', name: 'Huỳnh Thị C', role: 'Nhân viên tư vấn', baseOrders: 18, baseRevenue: 98000000, image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=80&q=80' },
        { id: 'NV005', name: 'Lê Văn D', role: 'Nhân viên kho', baseOrders: 12, baseRevenue: 64000000, image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&q=80' },
        { id: 'NV006', name: 'Super Admin', role: 'Super Admin', baseOrders: 15, baseRevenue: 85000000, image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=80&q=80' },
        { id: 'NV007', name: 'Phạm Văn E', role: 'Nhân viên bán hàng', baseOrders: 9, baseRevenue: 42000000, image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=80&q=80' }
    ];

    const staffData = JSON.parse(localStorage.getItem('pcpos_staff')) || DEFAULT_STAFF;

    // Thống kê đơn hàng và doanh thu thực tế từ pcpos_invoices cho từng nhân viên
    const staffStats = {};
    invoices.forEach(inv => {
        const staffName = (inv.staff || inv.seller || '').trim();
        if (staffName) {
            if (!staffStats[staffName]) {
                staffStats[staffName] = { orders: 0, revenue: 0 };
            }
            staffStats[staffName].orders += 1;
            staffStats[staffName].revenue += Number(inv.total || inv.finalTotal || 0);
        }
    });

    const calculatedStaffList = staffData.map(s => {
        // Match name fuzzy
        const matchedName = Object.keys(staffStats).find(k => 
            k.toLowerCase() === s.name.toLowerCase() || 
            k.toLowerCase().includes(s.name.toLowerCase()) || 
            s.name.toLowerCase().includes(k.toLowerCase())
        );

        const realOrders = matchedName ? staffStats[matchedName].orders : 0;
        const realRevenue = matchedName ? staffStats[matchedName].revenue : 0;

        const totalOrders = (s.baseOrders || 10) + realOrders;
        const totalRevenue = (s.baseRevenue || 50000000) + realRevenue;

        return {
            ...s,
            orders: totalOrders,
            revenue: totalRevenue
        };
    }).sort((a, b) => b.revenue - a.revenue);

    // Render Top 3 Card trên Dashboard
    if (topEmployeesList) {
        const top3 = calculatedStaffList.slice(0, 3);
        let staffHtml = '';
        top3.forEach((s, idx) => {
            const rank = idx + 1;
            const avatarUrl = s.image || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80';
            staffHtml += `
                <div class="employee-item" style="display:flex; align-items:center; gap:12px; padding:10px 14px; background:#FFF; border:1px solid #E2E8F0; border-radius:12px; margin-bottom:8px;">
                    <div class="employee-rank rank-${rank}" style="width:24px; height:24px; border-radius:50%; background:${rank === 1 ? '#FFD700' : rank === 2 ? '#C0C0C0' : '#CD7F32'}; color:#FFF; font-weight:700; font-size:12px; display:flex; align-items:center; justify-content:center;">${rank}</div>
                    <div class="employee-avatar" style="width:36px; height:36px; border-radius:50%; overflow:hidden; border:1px solid #CBD5E1;">
                        <img src="${avatarUrl}" style="width:100%; height:100%; object-fit:cover;">
                    </div>
                    <div class="employee-details" style="flex:1;">
                        <div class="employee-name" style="font-weight:700; font-size:13px; color:#0F172A;">${s.name}</div>
                        <div class="employee-role" style="font-size:11px; color:#64748B;">${s.role}</div>
                    </div>
                    <div class="employee-score">
                        <span class="badge-sales" style="background:#FEF2F2; color:#991B1B; font-weight:700; font-size:11.5px; padding:4px 10px; border-radius:12px;">${s.orders} đơn</span>
                    </div>
                </div>
            `;
        });
        topEmployeesList.innerHTML = staffHtml;
    }

    // Render Bảng xếp hạng Doanh thu Nhân viên Modal
    
    // Render Bảng xếp hạng Doanh thu Nhân viên Modal với lọc Hôm nay / Tháng này / Tất cả
    window.renderStaffLeaderboardTable = function(period = 'Hôm nay') {
        const leaderboardTableBody = document.getElementById('leaderboardTableBody');
        const periodTitleText = document.getElementById('periodTitleText');
        if (!leaderboardTableBody) return;

        let multiplier = 1;
        let baseOrdersMod = 1;
        if (period === 'Hôm nay') {
            multiplier = 0.15;
            baseOrdersMod = 0.15;
        } else if (period === 'Tháng này') {
            multiplier = 0.85;
            baseOrdersMod = 0.85;
        } else {
            multiplier = 1.0;
            baseOrdersMod = 1.0;
        }

        const periodStaffList = calculatedStaffList.map(s => {
            const orders = Math.max(1, Math.round(s.orders * baseOrdersMod));
            const revenue = Math.max(5000000, Math.round(s.revenue * multiplier));
            return { ...s, orders, revenue };
        }).sort((a, b) => b.revenue - a.revenue);

        const maxRev = periodStaffList[0].revenue || 1;

        let rowsHtml = '';
        periodStaffList.forEach((s, idx) => {
            const rank = idx + 1;
            const rankBadge = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `#${rank}`;
            const avatarUrl = s.image || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80';
            const formattedRev = s.revenue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + ' đ';
            const effPercent = Math.min(100, Math.max(15, Math.round((s.revenue / maxRev) * 100)));

            rowsHtml += `
                <tr style="border-bottom: 1px solid #F1F5F9;">
                    <td style="padding: 12px; text-align: center; font-weight: 700; font-size: 14px;">${rankBadge}</td>
                    <td style="padding: 12px;">
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <img src="${avatarUrl}" style="width: 34px; height: 34px; border-radius: 50%; object-fit: cover;">
                            <span style="font-weight: 700; color: #0F172A; font-size: 13px;">${s.name}</span>
                        </div>
                    </td>
                    <td style="padding: 12px; color: #64748B; font-size: 12px;">${s.role}</td>
                    <td style="padding: 12px; text-align: center;"><span style="background: #EFF6FF; color: #1D4ED8; font-weight: 700; padding: 4px 10px; border-radius: 12px; font-size: 12px;">${s.orders} đơn</span></td>
                    <td style="padding: 12px; text-align: right; font-weight: 700; color: #991B1B; font-size: 13px;">${formattedRev}</td>
                    <td style="padding: 12px;">
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <span style="font-size: 11px; font-weight: 700; color: #10B981;">${effPercent}%</span>
                            <div style="flex: 1; height: 6px; background: #E2E8F0; border-radius: 3px; overflow: hidden;">
                                <div style="width: ${effPercent}%; height: 100%; background: #10B981; border-radius: 3px;"></div>
                            </div>
                        </div>
                    </td>
                </tr>
            `;
        });
        leaderboardTableBody.innerHTML = rowsHtml;
        if (periodTitleText) {
            const timeLabel = period === 'Hôm nay' ? 'Hôm nay (11/08/2026)' : period === 'Tháng này' ? 'Tháng 08/2026' : 'Tất cả thời gian';
            periodTitleText.textContent = timeLabel;
        }
    };



// 2. Tương tác Dropdown người dùng ở Sidebar (Đăng xuất)
    const sidebarUserBtn = document.getElementById('sidebarUserDropdownBtn');
    const userDropdownMenu = document.getElementById('userDropdownMenu');

    if (sidebarUserBtn && userDropdownMenu) {
        sidebarUserBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            userDropdownMenu.classList.toggle('hidden');
        });

        // Click ra ngoài để ẩn dropdown
        document.addEventListener('click', () => {
            userDropdownMenu.classList.add('hidden');
        });
    }

    // Sự kiện Đăng xuất
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('sessionActiveUser');
            window.location.href = "../04_Phan_He_Login_Xac_Thuc/login.html";
        });
    }

    
    
    
    // ==========================================================================
    // CỬA SỔ MODAL BẢNG XẾP HẠNG DOANH THU NHÂN VIÊN TRONG THÁNG (FILTER ĐỘNG 100%)
    // ==========================================================================
    const btnOpenStaffLeaderboard = document.getElementById('btnOpenStaffLeaderboard');
    const staffRevenueModal = document.getElementById('staffRevenueModal');
    const closeStaffRevenueModalBtn = document.getElementById('closeStaffRevenueModalBtn');
    const leaderboardTableBody = document.getElementById('leaderboardTableBody');
    const leaderboardPeriodText = document.getElementById('leaderboardPeriodText');

    const btnFilterToday = document.getElementById('btnFilterToday');
    const btnFilterMonth = document.getElementById('btnFilterMonth');
    const btnFilterAllTime = document.getElementById('btnFilterAllTime');

    let currentFilterPeriod = 'today';

    function renderStaffLeaderboardTable(period = currentFilterPeriod) {
        if (!leaderboardTableBody) return;
        currentFilterPeriod = period;

        // Full 10 Staff Roster
        const DEFAULT_FULL_STAFF = [
            { name: 'Trần Văn Messi', role: 'Quản lý cửa hàng' },
            { name: 'Trần Thị Năm Đô', role: 'Nhân viên bán hàng' },
            { name: 'Nguyễn Văn B', role: 'Thu ngân' },
            { name: 'Huỳnh Thị C', role: 'Nhân viên tư vấn' },
            { name: 'Lê Văn D', role: 'Nhân viên kho' },
            { name: 'Super Admin', role: 'Super Admin' },
            { name: 'Phạm Văn E', role: 'Nhân viên bán hàng' },
            { name: 'Hoàng Thị F', role: 'Thu ngân' },
            { name: 'Vũ Văn G', role: 'Kỹ thuật viên PC' },
            { name: 'Đặng Thị H', role: 'Nhân viên chăm sóc KH' }
        ];

        const usersList = JSON.parse(localStorage.getItem('users')) || [];
        let allStaff = usersList.length >= 5 ? usersList : DEFAULT_FULL_STAFF;
        const localInvoices = JSON.parse(localStorage.getItem('pcpos_invoices')) || [];

        const now = new Date();
        const yyyy = now.getFullYear();
        const mm = String(now.getMonth() + 1).padStart(2, '0');
        const dd = String(now.getDate()).padStart(2, '0');
        const todayStr = `${yyyy}-${mm}-${dd}`;
        const todaySlash = `${dd}/${mm}/${yyyy}`;
        const monthStr = `${yyyy}-${mm}`;

        // Filter invoices by time period
        let filteredInvoices = localInvoices;
        if (period === 'today') {
            filteredInvoices = localInvoices.filter(inv => {
                return inv.date === todayStr || inv.date === todaySlash || (inv.date && inv.date.includes(todayStr));
            });
            if (leaderboardPeriodText) leaderboardPeriodText.textContent = `Hôm nay (${dd}/${mm}/${yyyy})`;
        } else if (period === 'month') {
            filteredInvoices = localInvoices.filter(inv => {
                return (inv.date && inv.date.includes(monthStr)) || (inv.date && inv.date.includes(`/${mm}/${yyyy}`));
            });
            if (leaderboardPeriodText) leaderboardPeriodText.textContent = `Tháng ${mm}/${yyyy}`;
        } else {
            if (leaderboardPeriodText) leaderboardPeriodText.textContent = 'Toàn thời gian';
        }

        // Aggregate per staff
        const staffStats = {};
        filteredInvoices.forEach(inv => {
            const staffName = inv.staff || inv.seller || 'Chưa rõ';
            const total = Number(inv.total || inv.finalTotal || 0);
            if (!staffStats[staffName]) {
                staffStats[staffName] = { count: 0, revenue: 0 };
            }
            staffStats[staffName].count += 1;
            staffStats[staffName].revenue += total;
        });

        const leaderboardData = allStaff.map((s, idx) => {
            const name = s.name || s.username || `Nhân viên #${idx + 1}`;
            const role = s.role || 'Nhân viên bán hàng';
            
            // Fuzzy match for resilience against typos (Đỏ vs Đô, etc.)
            let stats = { count: 0, revenue: 0 };
            const lowerName = name.toLowerCase().replace(/đỏ/g, 'đô');
            for (const key in staffStats) {
                const lowerKey = key.toLowerCase().replace(/đỏ/g, 'đô');
                if (lowerKey.includes(lowerName) || lowerName.includes(lowerKey)) {
                    stats = staffStats[key];
                    break;
                }
            }
            

            let finalCount = stats.count;
            let finalRev = stats.revenue;

            // Demo baseline numbers if localInvoices has no past transactions
            if (localInvoices.length === 0) {
                if (period === 'today') {
                    if (name.includes('Messi')) { finalCount = 6; finalRev = 24000000; }
                    else if (name.includes('Năm Đô')) { finalCount = 4; finalRev = 12500000; }
                    else if (name.includes('Nguyễn Văn B')) { finalCount = 2; finalRev = 4800000; }
                } else if (period === 'month') {
                    if (name.includes('Messi')) { finalCount = 36; finalRev = 145000000; }
                    else if (name.includes('Năm Đô')) { finalCount = 28; finalRev = 98000000; }
                    else if (name.includes('Nguyễn Văn B')) { finalCount = 22; finalRev = 65000000; }
                    else if (name.includes('Huỳnh Thị C')) { finalCount = 18; finalRev = 42000000; }
                    else if (name.includes('Lê Văn D')) { finalCount = 14; finalRev = 31000000; }
                    else if (name.includes('Admin')) { finalCount = 12; finalRev = 28000000; }
                    else { finalCount = 5 + (idx % 4); finalRev = 12000000 + (idx * 2000000); }
                } else {
                    if (name.includes('Messi')) { finalCount = 142; finalRev = 580000000; }
                    else if (name.includes('Năm Đô')) { finalCount = 98; finalRev = 390000000; }
                    else if (name.includes('Nguyễn Văn B')) { finalCount = 76; finalRev = 245000000; }
                    else if (name.includes('Huỳnh Thị C')) { finalCount = 54; finalRev = 182000000; }
                    else { finalCount = 20 + idx * 3; finalRev = 50000000 + idx * 10000000; }
                }
            }

            return { name, role, image: s.image || '', count: finalCount, revenue: finalRev };
        }).sort((a, b) => b.revenue - a.revenue || b.count - a.count);

        let rowsHtml = '';
        const grandRev = leaderboardData.reduce((sum, item) => sum + item.revenue, 0) || 1;

        leaderboardData.forEach((item, idx) => {
            const rank = idx + 1;
            let rankBadge = `<span style="font-weight:700; color:#64748B;">#${rank}</span>`;
            if (rank === 1) rankBadge = `<span style="display:inline-flex; align-items:center; justify-content:center; width:28px; height:28px; background:#FEF3C7; color:#D97706; border-radius:50%; font-weight:800;">🥇</span>`;
            else if (rank === 2) rankBadge = `<span style="display:inline-flex; align-items:center; justify-content:center; width:28px; height:28px; background:#F1F5F9; color:#475569; border-radius:50%; font-weight:800;">🥈</span>`;
            else if (rank === 3) rankBadge = `<span style="display:inline-flex; align-items:center; justify-content:center; width:28px; height:28px; background:#FFF7ED; color:#C2410C; border-radius:50%; font-weight:800;">🥉</span>`;

            const lowerName = item.name.toLowerCase();
            let avatarUrl = item.image || '';
            if (!avatarUrl) {
                for (const [key, val] of Object.entries(STAFF_AVATARS)) {
                    if (lowerName.includes(key)) { avatarUrl = val; break; }
                }
            }
            if (!avatarUrl) avatarUrl = `https://images.unsplash.com/photo-${1535713875002 + (idx * 1000)}?auto=format&fit=crop&w=80&q=80`;

            const formattedRev = item.revenue.toLocaleString('vi-VN') + ' đ';
            const percent = Math.min(100, Math.round((item.revenue / grandRev) * 100));

            rowsHtml += `
                <tr style="border-bottom: 1px solid var(--border-color); transition: background 0.2s ease;">
                    <td style="padding: 12px; text-align: center;">${rankBadge}</td>
                    <td style="padding: 12px;">
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <img src="${avatarUrl}" style="width: 36px; height: 36px; border-radius: 50%; object-fit: cover; border: 1px solid var(--border-color);" onError="this.src='https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80'">
                            <span style="font-weight: 700; color: var(--text-main); font-size: 13px;">${item.name}</span>
                        </div>
                    </td>
                    <td style="padding: 12px; color: var(--text-muted); font-weight: 500; font-size: 12.5px;">${item.role}</td>
                    <td style="padding: 12px; text-align: center;"><span style="background: rgba(37, 99, 235, 0.08); color: #2563EB; padding: 3px 9px; border-radius: 12px; font-weight: 700; font-size: 12px;">${item.count} đơn</span></td>
                    <td style="padding: 12px; text-align: right; font-weight: 700; color: var(--accent-red); font-size: 13.5px;">${formattedRev}</td>
                    <td style="padding: 12px; text-align: right;">
                        <div style="display: flex; align-items: center; justify-content: flex-end; gap: 6px;">
                            <span style="font-size: 11px; font-weight: 700; color: #059669;">${percent}%</span>
                            <div style="width: 40px; height: 6px; background: #E2E8F0; border-radius: 3px; overflow: hidden;">
                                <div style="width: ${percent}%; height: 100%; background: #10B981;"></div>
                            </div>
                        </div>
                    </td>
                </tr>
            `;
        });

        leaderboardTableBody.innerHTML = rowsHtml;
    }

    // Tab Filter Button Click Handlers
    function updateTabFilterUI(activeBtn) {
        [btnFilterToday, btnFilterMonth, btnFilterAllTime].forEach(btn => {
            if (!btn) return;
            btn.style.background = 'var(--bg-card)';
            btn.style.color = 'var(--text-muted)';
            btn.style.border = '1px solid var(--border-color)';
            btn.classList.remove('active');
        });
        if (activeBtn) {
            activeBtn.style.background = 'var(--accent-red)';
            activeBtn.style.color = '#FFFFFF';
            activeBtn.style.border = '1px solid transparent';
            activeBtn.classList.add('active');
        }
    }

    if (btnFilterToday) {
        btnFilterToday.addEventListener('click', () => {
            updateTabFilterUI(btnFilterToday);
            renderStaffLeaderboardTable('today');
        });
    }
    if (btnFilterMonth) {
        btnFilterMonth.addEventListener('click', () => {
            updateTabFilterUI(btnFilterMonth);
            renderStaffLeaderboardTable('month');
        });
    }
    if (btnFilterAllTime) {
        btnFilterAllTime.addEventListener('click', () => {
            updateTabFilterUI(btnFilterAllTime);
            renderStaffLeaderboardTable('all');
        });
    }

    if (btnOpenStaffLeaderboard && staffRevenueModal) {
        btnOpenStaffLeaderboard.addEventListener('click', (e) => {
            e.preventDefault();
            renderStaffLeaderboardTable('today');
            if (btnFilterToday) updateTabFilterUI(btnFilterToday);
            staffRevenueModal.classList.remove('hidden');
        });
    }

    if (closeStaffRevenueModalBtn && staffRevenueModal) {
        closeStaffRevenueModalBtn.addEventListener('click', () => {
            staffRevenueModal.classList.add('hidden');
        });
    }

    if (staffRevenueModal) {
        staffRevenueModal.addEventListener('click', (e) => {
            if (e.target === staffRevenueModal) {
                staffRevenueModal.classList.add('hidden');
            }
        });
    }


    // 3. Vẽ Biểu đồ doanh thu 7 ngày qua bằng HTML5 Canvas
    drawRevenueChart();

    // Lắng nghe sự kiện resize để vẽ lại biểu đồ sắc nét hơn
    window.addEventListener('resize', () => {
        drawRevenueChart();
    });

        
    // ==========================================================================
    // VẼ BIỂU ĐỒ DOANH THU 7 NGÀY QUA (DỮ LIỆU THẬT 100% - KHÔNG DỮ LIỆU GIẢ)
    // ==========================================================================
    function drawRevenueChart() {
        const canvas = document.getElementById('revenueChart');
        if (!canvas) return;
        
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        
        canvas.width = rect.width * dpr;
        canvas.height = 240 * dpr;
        
        const ctx = canvas.getContext('2d');
        ctx.scale(dpr, dpr);
        
        const width = rect.width;
        const height = 240;
        
        function parseInvDate(dateStr) {
            if (!dateStr) return null;
            if (dateStr.includes('-')) {
                const parts = dateStr.split('T')[0].split('-');
                if (parts[0].length === 4) return `${parts[0]}-${parts[1].padStart(2,'0')}-${parts[2].padStart(2,'0')}`;
            }
            if (dateStr.includes('/')) {
                const parts = dateStr.split('/');
                if (parts[2] && parts[2].length === 4) return `${parts[2]}-${parts[1].padStart(2,'0')}-${parts[0].padStart(2,'0')}`;
            }
            return dateStr;
        }

        const daysOfWeek = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
        const data = [];
        const labels = [];
        const dateSubLabels = [];
        const realTotals = [];

        // Lấy danh sách hóa đơn thực tế từ localStorage
        const localInvoices = JSON.parse(localStorage.getItem('pcpos_invoices')) || [];

        // Lấy chính xác 7 ngày gần nhất tính tới hôm nay
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            
            const yyyy = d.getFullYear();
            const mm = String(d.getMonth() + 1).padStart(2, '0');
            const dd = String(d.getDate()).padStart(2, '0');
            const targetDateStr = `${yyyy}-${mm}-${dd}`;
            const targetDateSlash = `${dd}/${mm}/${yyyy}`;

            // Lọc hóa đơn thực tế bán trong ngày d
            const dayInvoices = localInvoices.filter(inv => {
                const parsed = parseInvDate(inv.date);
                return parsed === targetDateStr || inv.date === targetDateSlash || inv.date === targetDateStr;
            });

            // Tổng doanh thu THẬT 100% của ngày này (Nếu không có hóa đơn nào -> ĐÚNG 0đ)
            const dayTotal = dayInvoices.reduce((sum, inv) => sum + Number(inv.total || inv.finalTotal || 0), 0);

            realTotals.push(dayTotal);
            data.push(dayTotal / 1000000); // Đổi sang Triệu VNĐ
            labels.push(daysOfWeek[d.getDay()]);
            dateSubLabels.push(`${dd}/${mm}`);
        }
        
        const paddingLeft = 48;
        const paddingRight = 24;
        const paddingTop = 30;
        const paddingBottom = 42;
        
        const chartWidth = width - paddingLeft - paddingRight;
        const chartHeight = height - paddingTop - paddingBottom;
        
        const maxValInMillions = Math.max(...data, 0);
        // Nếu không có doanh thu -> Thang đo hiển thị 0M - 10M, nếu có -> Thang đo tăng theo 1.25x
        const maxVal = maxValInMillions > 0 ? Math.ceil(maxValInMillions * 1.25) : 10;

        const duration = 750;
        const startTime = performance.now();
        let hoveredIndex = -1; // -1 means no hover

        function drawFrame(progress, highlightIndex) {
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            
            ctx.clearRect(0, 0, width, height);
            
            // 1. Vẽ các đường lưới ngang Y
            ctx.strokeStyle = '#E2E8F0';
            ctx.lineWidth = 1;
            ctx.fillStyle = '#64748B';
            ctx.font = '11px Inter, sans-serif';
            ctx.textAlign = 'right';
            
            const yTicks = 4;
            for (let i = 0; i <= yTicks; i++) {
                const val = (maxVal / yTicks) * i;
                const y = height - paddingBottom - (i / yTicks) * chartHeight;
                
                ctx.beginPath();
                ctx.moveTo(paddingLeft, y);
                ctx.lineTo(width - paddingRight, y);
                ctx.stroke();
                
                ctx.fillText((val % 1 === 0 ? val.toFixed(0) : val.toFixed(1)) + 'M', paddingLeft - 8, y + 4);
            }
            
            // 2. Vẽ nhãn X (Thứ + Ngày/Tháng)
            ctx.textAlign = 'center';
            const stepX = chartWidth / (labels.length - 1);
            
            labels.forEach((label, i) => {
                const x = paddingLeft + i * stepX;
                const isToday = (i === labels.length - 1);
                
                ctx.fillStyle = isToday ? '#DC2626' : '#64748B';
                ctx.font = isToday ? 'bold 11px Inter, sans-serif' : '11px Inter, sans-serif';
                ctx.fillText(label, x, height - paddingBottom + 16);
                
                ctx.font = '10px Inter, sans-serif';
                ctx.fillStyle = isToday ? '#DC2626' : '#94A3B8';
                ctx.fillText(dateSubLabels[i], x, height - paddingBottom + 28);
            });
            
            // 3. Tính toán tọa độ điểm
            const points = data.map((val, i) => {
                const x = paddingLeft + i * stepX;
                const currentY = height - paddingBottom - ((val * easeProgress) / maxVal) * chartHeight;
                return { x, y: currentY, val, realTotal: realTotals[i], dateStr: dateSubLabels[i], labelStr: labels[i] };
            });
            
            // 4. Vẽ vùng Gradient dưới đường doanh thu
            const gradient = ctx.createLinearGradient(0, paddingTop, 0, height - paddingBottom);
            gradient.addColorStop(0, 'rgba(220, 38, 38, 0.22)');
            gradient.addColorStop(1, 'rgba(220, 38, 38, 0.0)');
            
            ctx.beginPath();
            ctx.moveTo(points[0].x, height - paddingBottom);
            points.forEach(p => ctx.lineTo(p.x, p.y));
            ctx.lineTo(points[points.length - 1].x, height - paddingBottom);
            ctx.closePath();
            ctx.fillStyle = gradient;
            ctx.fill();
            
            // 5. Vẽ đường nối màu đỏ
            ctx.beginPath();
            ctx.strokeStyle = '#DC2626';
            ctx.lineWidth = 2.5;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            
            points.forEach((p, i) => {
                if (i === 0) ctx.moveTo(p.x, p.y);
                else ctx.lineTo(p.x, p.y);
            });
            ctx.stroke();
            
            // 6. Vẽ các điểm nút tròn
            points.forEach((p, i) => {
                ctx.beginPath();
                // Phóng to điểm đang hover
                const radius = (highlightIndex === i) ? 6 : 4;
                ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
                ctx.fillStyle = p.realTotal > 0 ? '#DC2626' : '#FFFFFF';
                ctx.fill();
                ctx.strokeStyle = '#DC2626';
                ctx.lineWidth = 2;
                ctx.stroke();
            });
            
            // 7. Hiển thị Tooltip số tiền thực tế tại điểm có doanh thu hoặc hôm nay
            if (points.length > 0) {
                // Nếu không hover thì mặc định hiển thị điểm hôm nay
                const targetIndex = highlightIndex >= 0 ? highlightIndex : points.length - 1;
                const p = points[targetIndex];
                
                const realRevenueStr = p.realTotal.toLocaleString('vi-VN') + 'đ';
                const prefix = (targetIndex === points.length - 1) ? 'Hôm nay' : p.labelStr;
                const text = `${prefix} (${p.dateStr}): ${realRevenueStr}`;
                
                ctx.font = 'bold 11px Inter, sans-serif';
                const textWidth = ctx.measureText(text).width;
                const rectW = textWidth + 18;
                const rectH = 25;
                const rectX = Math.min(Math.max(p.x - rectW / 2, paddingLeft), width - paddingRight - rectW);
                const rectY = p.y - 34;
                
                ctx.fillStyle = '#0F172A';
                ctx.beginPath();
                if (ctx.roundRect) ctx.roundRect(rectX, rectY, rectW, rectH, 6); else ctx.rect(rectX, rectY, rectW, rectH);
                ctx.fill();
                
                ctx.fillStyle = '#FFFFFF';
                ctx.textAlign = 'center';
                ctx.fillText(text, rectX + rectW / 2, rectY + 16);
            }
        }

        function animate(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            drawFrame(progress, hoveredIndex);
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        }
        
        requestAnimationFrame(animate);
        
        // --- Thêm sự kiện Hover ---
        canvas.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            // Điều chỉnh tọa độ X để phù hợp với DPI
            const mouseX = (e.clientX - rect.left);
            
            // Tìm điểm gần với mouseX nhất
            const stepX = chartWidth / (labels.length - 1);
            let closestIndex = Math.round((mouseX - paddingLeft) / stepX);
            closestIndex = Math.max(0, Math.min(labels.length - 1, closestIndex));
            
            if (hoveredIndex !== closestIndex) {
                hoveredIndex = closestIndex;
                drawFrame(1, hoveredIndex);
            }
        });
        
        canvas.addEventListener('mouseleave', () => {
            hoveredIndex = -1; // Quay về default
            drawFrame(1, -1);
        });
    }

});