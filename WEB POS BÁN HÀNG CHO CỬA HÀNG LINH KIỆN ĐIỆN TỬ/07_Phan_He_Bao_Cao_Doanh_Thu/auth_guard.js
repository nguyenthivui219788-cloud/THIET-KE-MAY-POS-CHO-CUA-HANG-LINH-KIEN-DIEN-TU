
    // Global User Profile Updater
    window.updateUIProfile = function(user) {
        if (!user) return;
        const sidebarUser = document.querySelector('.sidebar-user');
        if (!sidebarUser) return;

        const avatarLetter = sidebarUser.querySelector('.user-avatar-letter');
        const userNameText = sidebarUser.querySelector('.user-name-text');
        const userRoleText = sidebarUser.querySelector('.user-role-text');

        if (avatarLetter) avatarLetter.textContent = (user.name || 'A').charAt(0).toUpperCase();
        if (userNameText) userNameText.textContent = user.name || user.username || 'Admin';
        if (userRoleText) userRoleText.textContent = user.role || 'Quản lý cửa hàng';
    };

(function() {
    const activeUserJson = localStorage.getItem('sessionActiveUser');
    const currentPath = window.location.pathname.split('/').pop().toLowerCase();

    // Trang login.html không cần bảo vệ, nhưng nếu đã đăng nhập thì tự động đưa đi
    if (currentPath === 'login.html') {
        if (activeUserJson) {
            try {
                const user = JSON.parse(activeUserJson);
                if (user.role === 'Super Admin') {
                    window.location.href = '../09_Phan_He_Dashboard/dashboard.html';
                } else {
                    window.location.href = '../05_Phan_He_Ban_Hang_POS/banhang.html';
                }
            } catch (e) {
                localStorage.removeItem('sessionActiveUser');
            }
        }
        return;
    }

    // Nếu chưa đăng nhập -> Đưa về trang login
    if (!activeUserJson) {
        window.location.href = '../04_Phan_He_Login_Xac_Thuc/login.html';
        return;
    }

    let user;
    try {
        user = JSON.parse(activeUserJson);
    } catch (e) {
        localStorage.removeItem('sessionActiveUser');
        window.location.href = "../04_Phan_He_Login_Xac_Thuc/login.html";
        return;
    }

    // Danh sách các trang quản lý chỉ dành cho Admin/Quản lý
    const adminPages = [
        'dashboard.html',
        'baocaodoanhthu.html',
        'voucher.html',
        'quanlisanpham.html',
        'quanlynhanvien.html'
    ];

    const isAdminPage = adminPages.some(page => currentPath === page || currentPath === '');

    if (isAdminPage) {
        // Chỉ Super Admin mới có quyền truy cập trang quản trị
        const hasAdminAccess = (user.role === 'Super Admin');
        if (!hasAdminAccess) {
            alert('Tài khoản của bạn không có quyền truy cập khu vực Quản trị! Hệ thống sẽ đưa bạn về trang Bán hàng.');
            window.location.href = '../05_Phan_He_Ban_Hang_POS/banhang.html';
        }
    }

    // Tự động quản lý hiển thị các mục ở Sidebar dựa trên phân quyền
    
    // ==========================================================================
    // ĐỒNG HỒ THỜI GIAN THỰC (REALTIME LIVE CLOCK CONTROLLER)
    // ==========================================================================
    function initLiveClock() {
        const headerActions = document.querySelector('.header-actions-section') || document.querySelector('.main-header');
        if (!headerActions) return;

        let clockWidget = document.getElementById('globalLiveClock');
        if (!clockWidget) {
            clockWidget = document.createElement('div');
            clockWidget.id = 'globalLiveClock';
            clockWidget.style.cssText = `
                display: inline-flex;
                align-items: center;
                gap: 8px;
                background: #FFFFFF;
                border: 1px solid #E2E8F0;
                padding: 6px 14px;
                border-radius: 20px;
                box-shadow: 0 1px 4px rgba(0,0,0,0.04);
                margin-right: 12px;
                font-family: 'Rajdhani', 'Inter', sans-serif;
            `;
            clockWidget.innerHTML = `
                <span style="display: inline-block; width: 8px; height: 8px; background: #10B981; border-radius: 50%; box-shadow: 0 0 8px #10B981; animation: pulseClockDot 1.5s infinite;"></span>
                <span id="liveClockDate" style="font-size: 12.5px; font-weight: 600; color: #64748B;">--/--/----</span>
                <span style="color: #CBD5E1; font-weight: 300;">|</span>
                <span id="liveClockTime" style="font-size: 14px; font-weight: 700; color: #0F172A; letter-spacing: 0.5px;">--:--:--</span>
            `;

            if (!document.getElementById('pulseClockStyle')) {
                const styleEl = document.createElement('style');
                styleEl.id = 'pulseClockStyle';
                styleEl.textContent = `
                    @keyframes pulseClockDot {
                        0% { opacity: 1; transform: scale(1); }
                        50% { opacity: 0.3; transform: scale(0.8); }
                        100% { opacity: 1; transform: scale(1); }
                    }
                `;
                document.head.appendChild(styleEl);
            }

            if (headerActions.firstChild) {
                headerActions.insertBefore(clockWidget, headerActions.firstChild);
            } else {
                headerActions.appendChild(clockWidget);
            }
        }

        function updateClock() {
            const now = new Date();
            const daysOfWeek = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
            const dayName = daysOfWeek[now.getDay()];
            const dateStr = `${dayName}, ${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;
            const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

            const dateEl = document.getElementById('liveClockDate');
            const timeEl = document.getElementById('liveClockTime');
            if (dateEl) dateEl.textContent = dateStr;
            if (timeEl) timeEl.textContent = timeStr;
        }

        updateClock();
        setInterval(updateClock, 1000);
    }

    document.addEventListener('DOMContentLoaded', () => {
        initLiveClock();
        if (typeof user !== 'undefined') window.updateUIProfile(user);
        const sidebarNavUl = document.querySelector('.sidebar-nav ul');
        if (!sidebarNavUl) return;

        const isEmployee = user && user.role !== 'Super Admin';

        if (isEmployee) {
            const isBanhangActive = currentPath === 'banhang.html';
            const isLichsuActive = currentPath === 'lichsugiaodich.html';

            sidebarNavUl.innerHTML = `
                <li class="${isBanhangActive ? 'active' : ''}">
                    <a href="../05_Phan_He_Ban_Hang_POS/banhang.html">
                        <span class="nav-icon">
                            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                <circle cx="9" cy="21" r="1"></circle>
                                <circle cx="20" cy="21" r="1"></circle>
                                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                            </svg>
                        </span>
                        <span class="nav-text">Bán hàng</span>
                    </a>
                </li>
                <li class="${isLichsuActive ? 'active' : ''}">
                    <a href="../08_Phan_He_Lich_Su_Giao_Dich/lichsugiaodich.html">
                        <span class="nav-icon">
                            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                <polyline points="12 6 12 12 16 14"></polyline>
                            </svg>
                        </span>
                        <span class="nav-text">Lịch sử giao dịch</span>
                    </a>
                </li>
            `;
        }
    });

            // ==========================================================================
    // HỆ THỐNG THÔNG BÁO THỜI GIAN THỰC (REALTIME NOTIFICATION CONTROLLER)
    // ==========================================================================
    const nowTime = Date.now();
    const DEFAULT_NOTIFICATIONS = [
        {
            id: 'notif_1',
            title: 'Đơn hàng mới #HD2545',
            desc: 'RTX 4090 24GB đã được thanh toán thành công.',
            timestamp: nowTime - (5 * 60 * 1000), // 5 phút trước
            unread: true
        },
        {
            id: 'notif_2',
            title: 'Cảnh báo Voucher',
            desc: 'Voucher A88 chỉ còn 1 lượt sử dụng.',
            timestamp: nowTime - (60 * 60 * 1000), // 1 giờ trước
            unread: true
        },
        {
            id: 'notif_3',
            title: 'Đăng nhập mới',
            desc: 'Nhân viên Nam Em vừa đăng nhập hệ thống.',
            timestamp: nowTime - (2 * 60 * 60 * 1000), // 2 giờ trước
            unread: false
        }
    ];

    // Khởi tạo hoặc cập nhật timestamp nếu là dữ liệu cũ
    let existingNotifs = null;
    try {
        existingNotifs = JSON.parse(localStorage.getItem('pcpos_notifications'));
    } catch(e) {}

    if (!existingNotifs || !Array.isArray(existingNotifs) || existingNotifs.length === 0 || typeof existingNotifs[0].timestamp !== 'number') {
        localStorage.setItem('pcpos_notifications', JSON.stringify(DEFAULT_NOTIFICATIONS));
    }

    // Hàm tính thời gian tương đối động (Relative Time Calculator)
    window.getTimeAgo = function(timestamp) {
        if (!timestamp || isNaN(Number(timestamp))) return 'Vừa xong';
        const now = Date.now();
        const diffSec = Math.max(0, Math.floor((now - Number(timestamp)) / 1000));

        if (diffSec < 30) return 'Vừa xong';
        if (diffSec < 60) return `${diffSec} giây trước`;

        const diffMin = Math.floor(diffSec / 60);
        if (diffMin < 60) return `${diffMin} phút trước`;

        const diffHour = Math.floor(diffMin / 60);
        if (diffHour < 24) return `${diffHour} giờ trước`;

        const diffDay = Math.floor(diffHour / 24);
        if (diffDay < 30) return `${diffDay} ngày trước`;

        const d = new Date(Number(timestamp));
        return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')} ${d.getDate()}/${d.getMonth() + 1}`;
    };

    // Hàm thêm thông báo mới từ bất kỳ đâu (Ví dụ: khi Thanh toán xong hoặc Đăng nhập)
    window.addNotification = function(title, desc, type = 'info') {
        const list = JSON.parse(localStorage.getItem('pcpos_notifications')) || [];
        const newNotif = {
            id: 'notif_' + Date.now(),
            title: title,
            desc: desc,
            timestamp: Date.now(), // Lưu mốc thời gian thực tế!
            unread: true,
            type: type
        };
        list.unshift(newNotif);
        if (list.length > 30) list.pop();
        localStorage.setItem('pcpos_notifications', JSON.stringify(list));

        if (window.renderNotificationsUI) {
            window.renderNotificationsUI();
        }
    };

    // Hàm render danh sách thông báo & tính toán thời gian sống động
    window.renderNotificationsUI = function() {
        const notifBtn = document.getElementById('notificationBtn');
        const notifDropdown = document.getElementById('notificationDropdown');
        const notifList = document.getElementById('notificationList');

        const notifications = JSON.parse(localStorage.getItem('pcpos_notifications')) || [];
        const unreadCount = notifications.filter(n => n.unread).length;

        // Cập nhật Chấm đỏ Badge trên nút Chuông thông báo
        let badge = document.querySelector('.notification-badge');
        if (!badge && notifBtn) {
            badge = document.createElement('span');
            badge.className = 'notification-badge';
            badge.style.cssText = 'position: absolute; top: 2px; right: 2px; background: var(--accent-red); color: white; border-radius: 10px; font-size: 10px; font-weight: 700; padding: 1px 5px; min-width: 16px; text-align: center; border: 2px solid white; line-height: 1.2;';
            notifBtn.style.position = 'relative';
            notifBtn.appendChild(badge);
        }
        if (badge) {
            if (unreadCount > 0) {
                badge.textContent = unreadCount > 9 ? '9+' : unreadCount;
                badge.style.display = 'inline-flex';
            } else {
                badge.style.display = 'none';
            }
        }

        // Render các item trong Dropdown
        if (notifList) {
            notifList.innerHTML = '';
            if (notifications.length === 0) {
                notifList.innerHTML = '<div style="padding: 20px; text-align: center; color: var(--text-muted); font-size: 13px;">Không có thông báo nào</div>';
                return;
            }

            notifications.forEach(n => {
                const item = document.createElement('div');
                item.className = `notification-item ${n.unread ? 'unread' : ''}`;
                const timeAgoStr = window.getTimeAgo(n.timestamp);

                item.innerHTML = `
                    <div class="notification-title" style="font-weight: 600; font-size: 13.5px; color: var(--text-dark); margin-bottom: 2px;">${n.title}</div>
                    <div class="notification-desc" style="font-size: 12.5px; color: var(--text-muted); line-height: 1.4;">${n.desc}</div>
                    <div class="notification-time" style="font-size: 11px; color: #94A3B8; margin-top: 4px; font-weight: 500;">${timeAgoStr}</div>
                `;
                notifList.appendChild(item);
            });
        }
    };

    // Khởi tạo các sự kiện khi DOM tải xong
    document.addEventListener('DOMContentLoaded', () => {
        if (window.renderNotificationsUI) {
            window.renderNotificationsUI();
        }

        // Tự động cập nhật dòng thời gian tương đối mỗi 10 giây (Realtime Auto Refresh)
        setInterval(() => {
            if (window.renderNotificationsUI) {
                window.renderNotificationsUI();
            }
        }, 10000);

        // Bật/tắt dropdown thông báo
        const notifBtn = document.getElementById('notificationBtn');
        const notifDropdown = document.getElementById('notificationDropdown');

        if (notifBtn && notifDropdown) {
            notifBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                e.preventDefault();
                const isHidden = notifDropdown.classList.contains('hidden');
                if (isHidden) {
                    notifDropdown.classList.remove('hidden');
                    const notifications = JSON.parse(localStorage.getItem('pcpos_notifications')) || [];
                    notifications.forEach(n => n.unread = false);
                    localStorage.setItem('pcpos_notifications', JSON.stringify(notifications));
                    if (window.renderNotificationsUI) window.renderNotificationsUI();
                } else {
                    notifDropdown.classList.add('hidden');
                }
            });

            document.addEventListener('click', (e) => {
                if (notifDropdown && notifBtn && !notifDropdown.contains(e.target) && !notifBtn.contains(e.target)) {
                    notifDropdown.classList.add('hidden');
                }
            });
        }
    });
})();
