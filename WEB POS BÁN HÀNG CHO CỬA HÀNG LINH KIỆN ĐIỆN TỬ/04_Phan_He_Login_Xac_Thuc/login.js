/* Nexus POS - Xử lý logic Trang Đăng nhập Cao cấp */

document.addEventListener('DOMContentLoaded', () => {
    // Tự động làm sạch LocalStorage lỗi mã hóa (không reload tránh lặp đăng nhập)
    if (!localStorage.getItem('db_cleaned_v17')) {
        const activeUser = localStorage.getItem('sessionActiveUser');
        localStorage.clear();
        if (activeUser) {
            localStorage.setItem('sessionActiveUser', activeUser);
        }
        localStorage.setItem('db_cleaned_v17', 'true');
    }

    // 1. Khai báo các hằng số biểu tượng mắt SVG ẩn/hiện mật khẩu
    const EYE_OPEN_SVG = `
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
        <circle cx="12" cy="12" r="3"></circle>
    `;
    const EYE_CLOSED_SVG = `
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
        <line x1="1" y1="1" x2="23" y2="23"></line>
    `;

    // 2. Khai báo các phần tử DOM
    const loginBox = document.getElementById('loginBox');
    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const togglePasswordBtn = document.getElementById('togglePassword');
    const eyeIcon = document.getElementById('eyeIcon');
    const submitBtn = document.querySelector('.submit-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoader = submitBtn.querySelector('.btn-loader');
    const toast = document.getElementById('toastNotification');
    const toastMessage = toast.querySelector('.toast-message');
    const capsLockWarning = document.getElementById('capsLockWarning');
    const morphCircle = document.getElementById('morphCircle');

    // Tài khoản Admin thử nghiệm mặc định
    const DEMO_ACCOUNT = {
        username: 'admin',
        password: '123'
    };

    // Danh sách nhân viên mặc định ban đầu
    const defaultEmployees = [
        { id: 'NV001', name: 'Trần Văn Messi', role: 'Quản lý cửa hàng', status: 'Hoạt động', img: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80', email: 'messi@techno.vn', phone: '0901234561', salesCount: 36 },
        { id: 'NV002', name: 'Trần Thị Năm Đô', role: 'Nhân viên bán hàng', status: 'Hoạt động', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80', email: 'namdo@techno.vn', phone: '0901234562', salesCount: 28 },
        { id: 'NV003', name: 'Nguyễn Văn B', role: 'Thu ngân', status: 'Hoạt động', img: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=80&q=80', email: 'vanb@techno.vn', phone: '0901234563', salesCount: 22 },
        { id: 'NV004', name: 'Huỳnh Thị C', role: 'Sale', status: 'Hoạt động', img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=80&q=80', email: 'thic@techno.vn', phone: '0901234564', salesCount: 15 },
        { id: 'NV005', name: 'Tiến Phan', role: 'Kỹ thuật viên', status: 'Nghỉ việc', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80', email: 'tienphan@techno.vn', phone: '0901234565', salesCount: 5 },
        { id: 'NV006', name: 'Thương Nguyễn', role: 'Kỹ thuật viên', status: 'Hoạt động', img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=80&q=80', email: 'thuongnguyen@techno.vn', phone: '0901234566', salesCount: 3 },
        { id: 'NV007', name: 'Nghĩa Phan', role: 'Kỹ thuật viên', status: 'Hoạt động', img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=80&q=80', email: 'nghia@techno.vn', phone: '0901234567', salesCount: 0 },
        { id: 'NV008', name: 'Trần Ronaldo', role: 'Nhân viên bán hàng', status: 'Hoạt động', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&q=80', email: 'ronaldo@techno.vn', phone: '0901234568', salesCount: 19 },
        { id: 'NV009', name: 'Trần Neymar', role: 'Nhân viên bán hàng', status: 'Hoạt động', img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80', email: 'neymar@techno.vn', phone: '0901234569', salesCount: 16 },
        { id: 'NV010', name: 'Nam Em', role: 'Nhân viên bán hàng', status: 'Hoạt động', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80', email: 'namem@techno.vn', phone: '0901234570', salesCount: 12 },
        { id: 'NV011', name: 'Trần Ngọc', role: 'Nhân viên bán hàng', status: 'Hoạt động', img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=80&q=80', email: 'tranngoc@techno.vn', phone: '0901234571', salesCount: 8 }
    ];

    // 3. Logic ẩn/hiện mật khẩu sử dụng SVG
    togglePasswordBtn.addEventListener('click', () => {
        const isPassword = passwordInput.getAttribute('type') === 'password';
        passwordInput.setAttribute('type', isPassword ? 'text' : 'password');
        
        // Thay đổi phần ruột của icon SVG
        if (isPassword) {
            eyeIcon.innerHTML = EYE_CLOSED_SVG;
            togglePasswordBtn.setAttribute('aria-label', 'Ẩn mật khẩu');
        } else {
            eyeIcon.innerHTML = EYE_OPEN_SVG;
            togglePasswordBtn.setAttribute('aria-label', 'Hiện mật khẩu');
        }
    });

    // 4. Phát hiện Caps Lock
    const checkCapsLock = (e) => {
        if (e.getModifierState && e.getModifierState('CapsLock')) {
            capsLockWarning.classList.remove('hidden');
        } else {
            capsLockWarning.classList.add('hidden');
        }
    };
    passwordInput.addEventListener('keydown', checkCapsLock);
    passwordInput.addEventListener('keyup', checkCapsLock);

    // 5. Hiển thị thông báo Toast Notification
    let toastTimeout = null;
    function showToast(message, type = 'success') {
        if (toastTimeout) {
            clearTimeout(toastTimeout);
        }

        toast.className = 'toast show';
        toast.classList.add(type);
        toastMessage.textContent = message;

        toastTimeout = setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    // 6. Logic Đăng nhập hệ thống gọi API
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const username = usernameInput.value.trim();
        const password = passwordInput.value;

        // Vô hiệu hóa form
        submitBtn.disabled = true;
        usernameInput.disabled = true;
        passwordInput.disabled = true;
        togglePasswordBtn.style.pointerEvents = 'none';
        
        btnText.classList.add('hidden');
        btnLoader.classList.remove('hidden');

        // Xác định địa chỉ API động dựa trên cổng (Hỗ trợ Live Server trên port 5500 kết nối đến Express trên port 3000)
        const API_BASE = window.location.port === '3000' ? '' : 'http://127.0.0.1:3000';

        fetch(`${API_BASE}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        })
        .then(async res => {
            const contentType = res.headers.get('content-type');
            let resData;
            if (contentType && contentType.includes('application/json')) {
                resData = await res.json();
            } else {
                const errorText = await res.text();
                throw new Error('Lỗi Server (Không phải JSON). Vui lòng kiểm tra server backend!');
            }

            if (!res.ok) {
                throw new Error(resData.message || 'Đăng nhập thất bại!');
            }
            return resData;
        })
        .then(resData => {
            const loggedInUser = resData.user;
            
            // Lưu phiên làm việc hoạt động vào localStorage
            localStorage.setItem('sessionActiveUser', JSON.stringify(loggedInUser));
            // Thêm thông báo đăng nhập mới vào hệ thống thông báo thời gian thực
            try {
                const notifications = JSON.parse(localStorage.getItem('pcpos_notifications')) || [];
                notifications.unshift({
                    id: 'notif_' + Date.now(),
                    title: 'Đăng nhập mới',
                    desc: `Nhân viên ${loggedInUser.name} vừa đăng nhập hệ thống.`,
                    timestamp: Date.now(),
                    unread: true,
                    type: 'login'
                });
                if (notifications.length > 30) notifications.pop();
                localStorage.setItem('pcpos_notifications', JSON.stringify(notifications));
            } catch (err) { console.error(err); }

            
            // Kích hoạt hiệu ứng thành công gom cụm (Morph Success)
            loginBox.classList.add('success-morph');
            
            setTimeout(() => {
                // Hiện vòng tròn tích xanh hoàn thành
                morphCircle.classList.remove('hidden');
                showToast(`Đăng nhập thành công! Xin chào ${loggedInUser.name}.`, 'success');
            }, 300);

            // Chuyển trang sau khi hoàn tất hiệu ứng (1.5 giây sau thành công)
            setTimeout(() => {
                if (loggedInUser.role === 'Super Admin') {
                    window.location.href = '../09_Phan_He_Dashboard/dashboard.html';
                } else {
                    window.location.href = '../05_Phan_He_Ban_Hang_POS/banhang.html';
                }
            }, 1600);
        })
        .catch(err => {
            console.error('Login error:', err);
            // Đăng nhập thất bại -> Rung lắc và hiện thông báo lỗi
            loginBox.classList.add('shake');
            showToast(err.message || 'Không thể kết nối đến máy chủ MySQL/Node.js!', 'error');
            
            // Xóa class shake sau khi hoàn thành hiệu ứng rung lắc (400ms) để có thể rung tiếp
            setTimeout(() => {
                loginBox.classList.remove('shake');
                resetLoginForm();
            }, 400);
        });
    });

    function resetLoginForm() {
        submitBtn.disabled = false;
        usernameInput.disabled = false;
        passwordInput.disabled = false;
        togglePasswordBtn.style.pointerEvents = 'auto';
        
        btnText.classList.remove('hidden');
        btnLoader.classList.add('hidden');
        passwordInput.value = '';
    }
});
