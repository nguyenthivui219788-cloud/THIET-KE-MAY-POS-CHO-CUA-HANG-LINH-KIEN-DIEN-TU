/* Techno Admin Dashboard - Logic Lịch sử giao dịch */

document.addEventListener('DOMContentLoaded', () => {
    const activeUser = JSON.parse(localStorage.getItem('sessionActiveUser'));
    // ==========================================================================
    // A. KHỞI TẠO BẢN GHI GIAO DỊCH MẪU CHI TIẾT (LƯU VÀO LOCALSTORAGE)
    // ==========================================================================
    const DEFAULT_INVOICES = [
        {
            id: 'HD2545',
            date: '2025-06-25',
            time: '10:30 AM',
            staff: 'Messi',
            customer: 'Nam Em',
            total: 12500000,
            status: 'Đã thanh toán',
            paymentMethod: 'Chuyển khoản',
            note: '—',
            items: [
                { name: 'RAM 32GB (2x16GB) DDR5 6000MHz', category: 'RAM', qty: 1, price: 4000000 },
                { name: 'RTX 4060 Ti 8GB', category: 'VGA', qty: 1, price: 8500000 }
            ],
            timeline: [
                { title: 'Đã thanh toán', desc: 'Giao dịch đã được thanh toán thành công', time: '25/06/2025 - 10:35 AM', type: 'success' },
                { title: 'Đang giao hàng', desc: 'Đơn hàng đang được giao đến khách hàng', time: '25/06/2025 - 10:32 AM', type: 'info' },
                { title: 'Xác nhận đơn hàng', desc: 'Nhân viên đã xác nhận đơn hàng', time: '25/06/2025 - 10:30 AM', type: 'warning' },
                { title: 'Đặt hàng thành công', desc: 'Đơn hàng đã được tạo thành công', time: '25/06/2025 - 10:30 AM', type: 'default' }
            ]
        },
        {
            id: 'NV001',
            date: '2025-06-25',
            time: '10:00 AM',
            staff: 'Ronaldo',
            customer: 'Trần Ngọc',
            total: 13000000,
            status: 'Chờ thanh toán',
            paymentMethod: 'Tiền mặt',
            note: 'Khách hẹn trả sau',
            items: [
                { name: 'Intel Core i7-14700K', category: 'CPU', qty: 1, price: 10500000 },
                { name: 'SSD Samsung 990 1TB', category: 'SSD', qty: 1, price: 2500000 }
            ],
            timeline: [
                { title: 'Xác nhận đơn hàng', desc: 'Nhân viên đã xác nhận đơn hàng', time: '25/06/2025 - 10:05 AM', type: 'warning' },
                { title: 'Đặt hàng thành công', desc: 'Đơn hàng đã được tạo thành công', time: '25/06/2025 - 10:00 AM', type: 'default' }
            ]
        },
        {
            id: 'NV002',
            date: '2025-06-25',
            time: '09:15 AM',
            staff: 'Neymar',
            customer: 'Nguyễn Văn B',
            total: 8750000,
            status: 'Đang xử lý',
            paymentMethod: 'Chuyển khoản',
            note: 'Kiểm tra linh kiện kỹ',
            items: [
                { name: 'RTX 4060 Ti 8GB', category: 'VGA', qty: 1, price: 8750000 }
            ],
            timeline: [
                { title: 'Xác nhận đơn hàng', desc: 'Nhân viên đã xác nhận đơn hàng', time: '25/06/2025 - 09:20 AM', type: 'warning' },
                { title: 'Đặt hàng thành công', desc: 'Đơn hàng đã được tạo thành công', time: '25/06/2025 - 09:15 AM', type: 'default' }
            ]
        },
        {
            id: 'HD2544',
            date: '2025-06-24',
            time: '04:45 PM',
            staff: 'Nam Em',
            customer: 'Hoàng Long',
            total: 15600000,
            status: 'Đã thanh toán',
            paymentMethod: 'Chuyển khoản',
            note: 'Giao hàng tận nơi',
            items: [
                { name: 'Intel Core i7-14700K', category: 'CPU', qty: 1, price: 10500000 },
                { name: 'RAM Corsair 16GB', category: 'RAM', qty: 3, price: 1700000 }
            ],
            timeline: [
                { title: 'Đã thanh toán', desc: 'Giao dịch đã được thanh toán thành công', time: '24/06/2025 - 04:55 PM', type: 'success' },
                { title: 'Đang giao hàng', desc: 'Đơn hàng đang được giao đến khách hàng', time: '24/06/2025 - 04:50 PM', type: 'info' },
                { title: 'Xác nhận đơn hàng', desc: 'Nhân viên đã xác nhận đơn hàng', time: '24/06/2025 - 04:46 PM', type: 'warning' },
                { title: 'Đặt hàng thành công', desc: 'Đơn hàng đã được tạo thành công', time: '24/06/2025 - 04:45 PM', type: 'default' }
            ]
        },
        {
            id: 'NV003',
            date: '2025-06-24',
            time: '03:20 PM',
            staff: 'Trần Ngọc',
            customer: 'Lê Minh Đức',
            total: 5290000,
            status: 'Đã hủy',
            paymentMethod: 'Tiền mặt',
            note: 'Khách đổi ý không mua nữa',
            items: [
                { name: 'Mainboard B760M', category: 'Mainboard', qty: 1, price: 2690000 },
                { name: 'SSD Samsung 990 1TB', category: 'SSD', qty: 1, price: 2600000 }
            ],
            timeline: [
                { title: 'Đã hủy đơn', desc: 'Đơn hàng bị hủy do khách đổi ý', time: '24/06/2025 - 03:25 PM', type: 'danger' },
                { title: 'Đặt hàng thành công', desc: 'Đơn hàng đã được tạo thành công', time: '24/06/2025 - 03:20 PM', type: 'default' }
            ]
        },
        {
            id: 'HD2543',
            date: '2025-06-24',
            time: '11:05 AM',
            staff: 'Messi',
            customer: 'Phạm Quốc Huy',
            total: 9990000,
            status: 'Đã thanh toán',
            paymentMethod: 'Chuyển khoản',
            note: '—',
            items: [
                { name: 'RTX 4060 Ti 8GB', category: 'VGA', qty: 1, price: 8500000 },
                { name: 'Nguồn Corsair 650W', category: 'Nguồn', qty: 1, price: 1490000 }
            ],
            timeline: [
                { title: 'Đã thanh toán', desc: 'Giao dịch đã được thanh toán thành công', time: '24/06/2025 - 11:10 AM', type: 'success' },
                { title: 'Đặt hàng thành công', desc: 'Đơn hàng đã được tạo thành công', time: '24/06/2025 - 11:05 AM', type: 'default' }
            ]
        },
        {
            id: 'NV004',
            date: '2025-06-24',
            time: '09:40 AM',
            staff: 'Ronaldo',
            customer: 'Vũ Anh Tuấn',
            total: 3200000,
            status: 'Đang xử lý',
            paymentMethod: 'Chuyển khoản',
            note: 'Chuyển phát nhanh',
            items: [
                { name: 'SSD Samsung 990 1TB', category: 'SSD', qty: 1, price: 2600000 },
                { name: 'Vỏ case PC', category: 'Vỏ case', qty: 1, price: 600000 }
            ],
            timeline: [
                { title: 'Xác nhận đơn hàng', desc: 'Nhân viên đã xác nhận đơn hàng', time: '24/06/2025 - 09:45 AM', type: 'warning' },
                { title: 'Đặt hàng thành công', desc: 'Đơn hàng đã được tạo thành công', time: '24/06/2025 - 09:40 AM', type: 'default' }
            ]
        },
        {
            id: 'HD2542',
            date: '2025-06-23',
            time: '05:30 PM',
            staff: 'Neymar',
            customer: 'Nguyễn Hoàng',
            total: 16800000,
            status: 'Đã thanh toán',
            paymentMethod: 'Chuyển khoản',
            note: 'Đơn hàng VIP',
            items: [
                { name: 'Intel Core i9-14900K', category: 'CPU', qty: 1, price: 14500000 },
                { name: 'RAM Corsair 16GB', category: 'RAM', qty: 1, price: 2300000 }
            ],
            timeline: [
                { title: 'Đã thanh toán', desc: 'Giao dịch đã được thanh toán thành công', time: '23/06/2025 - 05:40 PM', type: 'success' },
                { title: 'Đặt hàng thành công', desc: 'Đơn hàng đã được tạo thành công', time: '23/06/2025 - 05:30 PM', type: 'default' }
            ]
        }
    ];

    if (!localStorage.getItem('pcpos_invoices')) {
        localStorage.setItem('pcpos_invoices', JSON.stringify(DEFAULT_INVOICES));
    }

    let invoicesList = JSON.parse(localStorage.getItem('pcpos_invoices'));

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

    // ==========================================================================
    // B. ĐỊNH NGHĨA ICON LINH KIỆN ĐA MÀU SẮC ĐỂ RENDER CHI TIẾT ĐƠN
    // ==========================================================================
    const COMPONENT_SVGS = {
        'CPU': `
            <svg viewBox="0 0 64 64">
                <defs>
                    <linearGradient id="cpuGold" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#FFD700" />
                        <stop offset="100%" stop-color="#FFA500" />
                    </linearGradient>
                </defs>
                <rect x="8" y="8" width="48" height="48" rx="6" fill="#1A2B20" stroke="#00C49F" stroke-width="1.5"/>
                <rect x="18" y="18" width="28" height="28" rx="2" fill="url(#cpuGold)"/>
                <line x1="24" y1="2" x2="24" y2="8" stroke="#00C49F" stroke-width="2"/>
                <line x1="32" y1="2" x2="32" y2="8" stroke="#00C49F" stroke-width="2"/>
                <line x1="40" y1="2" x2="40" y2="8" stroke="#00C49F" stroke-width="2"/>
                <line x1="24" y1="56" x2="24" y2="62" stroke="#00C49F" stroke-width="2"/>
                <line x1="32" y1="56" x2="32" y2="62" stroke="#00C49F" stroke-width="2"/>
                <line x1="40" y1="56" x2="40" y2="62" stroke="#00C49F" stroke-width="2"/>
                <line x1="2" y1="24" x2="8" y2="24" stroke="#00C49F" stroke-width="2"/>
                <line x1="2" y1="32" x2="8" y2="32" stroke="#00C49F" stroke-width="2"/>
                <line x1="2" y1="40" x2="8" y2="40" stroke="#00C49F" stroke-width="2"/>
                <line x1="56" y1="24" x2="62" y2="24" stroke="#00C49F" stroke-width="2"/>
                <line x1="56" y1="32" x2="62" y2="32" stroke="#00C49F" stroke-width="2"/>
                <line x1="56" y1="40" x2="62" y2="40" stroke="#00C49F" stroke-width="2"/>
            </svg>`,
        'RAM': `
            <svg viewBox="0 0 64 64">
                <defs>
                    <linearGradient id="ramRgb" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stop-color="#FF007F" />
                        <stop offset="50%" stop-color="#7F00FF" />
                        <stop offset="100%" stop-color="#00F0FF" />
                    </linearGradient>
                </defs>
                <rect x="4" y="22" width="56" height="20" rx="2" fill="#1A202C" stroke="#2D3748" stroke-width="1"/>
                <line x1="8" y1="42" x2="56" y2="42" stroke="#FFC107" stroke-width="2.5" stroke-dasharray="1.5 1.5"/>
                <rect x="6" y="16" width="52" height="6" rx="1" fill="url(#ramRgb)"/>
            </svg>`,
        'VGA': `
            <svg viewBox="0 0 64 64">
                <defs>
                    <linearGradient id="vgaFans" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stop-color="#2D3748" />
                        <stop offset="100%" stop-color="#1A202C" />
                    </linearGradient>
                </defs>
                <rect x="4" y="14" width="56" height="36" rx="4" fill="#242B35" stroke="#3A4454" stroke-width="1.5"/>
                <line x1="12" y1="50" x2="48" y2="50" stroke="#FFD700" stroke-width="2" stroke-dasharray="2 1"/>
                <rect x="2" y="10" width="2" height="44" fill="#90A4AE" rx="0.5"/>
                <circle cx="21" cy="32" r="11" fill="url(#vgaFans)" stroke="#CC182C" stroke-width="1.5"/>
                <circle cx="21" cy="32" r="3" fill="#A41326"/>
                <circle cx="43" cy="32" r="11" fill="url(#vgaFans)" stroke="#CC182C" stroke-width="1.5"/>
                <circle cx="43" cy="32" r="3" fill="#A41326"/>
            </svg>`,
        'Mainboard': `
            <svg viewBox="0 0 64 64">
                <rect x="6" y="6" width="52" height="52" rx="4" fill="#121820" stroke="#1F2833" stroke-width="1.5"/>
                <rect x="24" y="18" width="16" height="16" rx="2" fill="#2E3842" stroke="#90A4AE" stroke-width="1.5"/>
                <rect x="36" y="38" width="12" height="12" rx="1" fill="#CC182C"/>
                <rect x="14" y="42" width="34" height="3.5" rx="1" fill="#CC182C"/>
            </svg>`,
        'SSD': `
            <svg viewBox="0 0 64 64">
                <rect x="6" y="18" width="52" height="28" rx="4" fill="#1B2228" stroke="#343E46" stroke-width="1.5"/>
                <rect x="12" y="22" width="32" height="20" rx="1" fill="#CC182C"/>
                <rect x="14" y="24" width="28" height="5" fill="#FFFFFF"/>
                <rect x="52" y="27" width="6" height="10" rx="1" fill="#FFC107" stroke-dasharray="1 1"/>
            </svg>`,
        'Nguồn': `
            <svg viewBox="0 0 64 64">
                <rect x="10" y="10" width="44" height="44" rx="6" fill="#1E2022" stroke="#2D3748" stroke-width="1.5"/>
                <circle cx="32" cy="32" r="16" fill="none" stroke="#596A77" stroke-width="1.5"/>
                <circle cx="32" cy="32" r="14" fill="#CC182C"/>
                <circle cx="32" cy="32" r="4" fill="#1E2022"/>
            </svg>`,
        'Vỏ case': `
            <svg viewBox="0 0 64 64">
                <defs>
                    <linearGradient id="caseRgb" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stop-color="#FF007F" />
                        <stop offset="50%" stop-color="#7F00FF" />
                        <stop offset="100%" stop-color="#00F0FF" />
                    </linearGradient>
                </defs>
                <rect x="12" y="8" width="40" height="48" rx="4" fill="#1E2022" stroke="#2D3748" stroke-width="2"/>
                <rect x="16" y="12" width="32" height="34" rx="2" fill="rgba(255,255,255,0.03)" stroke="#3A4454" stroke-width="1"/>
                <circle cx="24" cy="20" r="4" fill="none" stroke="url(#caseRgb)" stroke-width="1.5"/>
                <circle cx="40" cy="20" r="4" fill="none" stroke="url(#caseRgb)" stroke-width="1.5"/>
                <circle cx="32" cy="36" r="6" fill="none" stroke="url(#caseRgb)" stroke-width="1.5"/>
            </svg>`
    };

    // Helper tạo avatar tròn cho nhân viên bán hàng
    function getStaffAvatar(name) {
        // Ưu tiên đọc ảnh từ danh sách nhân viên thực tế trong pcpos_staff
        const staffList = JSON.parse(localStorage.getItem('pcpos_staff')) || [];
        const foundStaff = staffList.find(s => s.name === name);
        if (foundStaff && foundStaff.image) {
            return `<img src="${foundStaff.image}" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover; display: block;">`;
        }

        const lower = name.toLowerCase();
        const avatars = {
            'messi': 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80',
            'ronaldo': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&q=80',
            'neymar': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80',
            'nam em': 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80',
            'trần ngọc': 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=80&q=80'
        };

        for (const [key, url] of Object.entries(avatars)) {
            if (lower.includes(key)) {
                return `<img src="${url}" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover; display: block;">`;
            }
        }

        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }
        const colors = ['#2ec4b6', '#0288d1', '#9c27b0', '#ff7a00', '#CC182C'];
        const color = colors[Math.abs(hash) % colors.length];
        
        return `
            <svg viewBox="0 0 100 100" style="width:100%; height:100%;">
                <circle cx="50" cy="50" r="50" fill="${color}"/>
                <path d="M50 30c6 0 10 4 10 10s-4 10-10 10-10-4-10-10 4-10 10-10zm0 24c12 0 22 6 22 14H28c0-8 10-14 22-14z" fill="#FFF"/>
            </svg>
        `;
    }

    // ==========================================================================
    // C. KHỞI TẠO ĐỊNH DẠNG STATE LỌC & TÌM KIẾM
    // ==========================================================================
    let filterStatusVal = 'Tất cả trạng thái';
    let filterDateVal = '';
    let searchQuery = '';
    let currentPage = 1;
    let itemsPerPage = 10;
    
    // Ghi nhận ID đơn hàng đang được lựa chọn để hiển thị chi tiết bên phải
    let selectedInvoiceId = 'HD2545'; 

    const tableBody = document.getElementById('invoiceTableBody');
    const paginationControls = document.getElementById('paginationControls');
    const paginationSummary = document.getElementById('paginationSummary');
    const perPageSelect = document.getElementById('perPageSelect');

    const filterStatus = document.getElementById('filterStatus');
    const searchDate = document.getElementById('searchDate');
    const searchInvoice = document.getElementById('searchInvoice');
    const headerSearchInvoice = document.getElementById('headerSearchInvoice');

    const invoiceDetailsContent = document.getElementById('invoiceDetailsContent');

    function saveInvoices() {
        localStorage.setItem('pcpos_invoices', JSON.stringify(invoicesList));
    }

    // Định dạng số có dấu phẩy phân tách hàng nghìn
    function formatMoney(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " đ";
    }

    // Modal Xem trước hóa đơn & Tự động lưu
    const billPreviewModal = document.getElementById('billPreviewModal');
    const billPreviewImage = document.getElementById('billPreviewImage');
    const btnCloseBillPreview = document.getElementById('btnCloseBillPreview');
    const btnDownloadBillModal = document.getElementById('btnDownloadBillModal');
    let currentPreviewDataUrl = '';
    let currentPreviewFilename = '';

    if (btnCloseBillPreview) {
        btnCloseBillPreview.addEventListener('click', () => {
            if (billPreviewModal) billPreviewModal.classList.add('hidden');
        });
    }

    if (billPreviewModal) {
        billPreviewModal.addEventListener('click', (e) => {
            if (e.target === billPreviewModal) {
                billPreviewModal.classList.add('hidden');
            }
        });
    }

    if (btnDownloadBillModal) {
        btnDownloadBillModal.addEventListener('click', () => {
            if (!currentPreviewDataUrl) return;
            const downloadLink = document.createElement('a');
            downloadLink.href = currentPreviewDataUrl;
            downloadLink.download = currentPreviewFilename;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
            showToast('Đã tải ảnh hóa đơn về máy thành công!');
        });
    }

    // ==========================================================================
    // C2. HÀM XUẤT ẢNH GIAO DỊCH PNG ĐỘC ĐÁO QUA CANVAS & TỰ ĐỘNG LƯU
    // ==========================================================================
    function generateInvoiceImage(inv) {
        const canvas = document.createElement('canvas');
        canvas.width = 480; 
        
        const headerHeight = 340;
        const itemsHeight = inv.items.length * 35;
        const footerHeight = 160;
        canvas.height = headerHeight + itemsHeight + footerHeight;
        
        const ctx = canvas.getContext('2d');
        
        // Nền trắng sữa rực rỡ cao cấp
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Viền kép phong cách hóa đơn
        ctx.strokeStyle = '#CC182C';
        ctx.lineWidth = 6;
        ctx.strokeRect(3, 3, canvas.width - 6, canvas.height - 6);
        ctx.strokeStyle = '#151824';
        ctx.lineWidth = 1;
        ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);
        
        function drawDivider(y) {
            ctx.strokeStyle = '#CBD5E1';
            ctx.lineWidth = 1.5;
            ctx.setLineDash([6, 4]);
            ctx.beginPath();
            ctx.moveTo(25, y);
            ctx.lineTo(455, y);
            ctx.stroke();
            ctx.setLineDash([]);
        }
        
        // Tiêu đề thương hiệu
        const centerX = canvas.width / 2;
        ctx.fillStyle = '#CC182C';
        ctx.font = 'bold 22px "Rajdhani", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('TECHNO COMPUTER STORE', centerX, 50);
        
        ctx.fillStyle = '#596A77';
        ctx.font = '11.5px "Inter", sans-serif';
        ctx.fillText('Địa chỉ: 123 Đường Linh Kiện, TP. Hồ Chí Minh', centerX, 72);
        ctx.fillText('Hotline: 1900-8888 | Website: techno.vn', centerX, 88);
        
        // Hóa đơn thanh toán bán lẻ
        ctx.fillStyle = '#151824';
        ctx.font = 'bold 15px "Inter", sans-serif';
        ctx.fillText('HÓA ĐƠN GIAO DỊCH CHÍNH THỨC', centerX, 125);
        
        drawDivider(142);
        
        // Meta thông tin hóa đơn
        ctx.textAlign = 'left';
        ctx.fillStyle = '#384857';
        ctx.font = '12.5px "Inter", sans-serif';
        
        ctx.fillText(`Mã hóa đơn: ${inv.id}`, 30, 170);
        ctx.fillText(`Thời gian: ${inv.time} - ${inv.date.split('-').reverse().join('/')}`, 30, 192);
        ctx.fillText(`Thu ngân: ${inv.staff}`, 30, 214);
        ctx.fillText(`Khách hàng: ${inv.customer}`, 30, 236);
        ctx.fillText(`Hình thức: ${inv.paymentMethod}`, 30, 258);
        
        drawDivider(278);
        
        // Header bảng sản phẩm
        ctx.fillStyle = '#151824';
        ctx.font = 'bold 12.5px "Inter", sans-serif';
        ctx.fillText('Sản phẩm', 30, 305);
        ctx.textAlign = 'right';
        ctx.fillText('SL', 340, 305);
        ctx.fillText('Thành tiền', 450, 305);
        
        ctx.strokeStyle = '#E2E8F0';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(25, 315);
        ctx.lineTo(455, 315);
        ctx.stroke();
        
        // Render danh sách sản phẩm
        let currentY = 340;
        ctx.fillStyle = '#384857';
        ctx.font = '12px "Inter", sans-serif';
        
        inv.items.forEach(item => {
            ctx.textAlign = 'left';
            let itemName = item.name;
            if (itemName.length > 36) {
                itemName = itemName.substring(0, 33) + '...';
            }
            ctx.fillText(itemName, 30, currentY);
            
            ctx.textAlign = 'right';
            ctx.fillText(item.qty.toString(), 340, currentY);
            ctx.fillText(formatMoney(item.qty * item.price), 450, currentY);
            
            currentY += 32;
        });
        
        ctx.strokeStyle = '#E2E8F0';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(25, currentY - 12);
        ctx.lineTo(455, currentY - 12);
        ctx.stroke();
        
        // Tổng tiền thanh toán
        currentY += 15;
        ctx.textAlign = 'left';
        ctx.fillStyle = '#151824';
        ctx.font = 'bold 13.5px "Inter", sans-serif';
        ctx.fillText('TỔNG TIỀN THANH TOÁN:', 30, currentY);
        
        ctx.textAlign = 'right';
        ctx.fillStyle = '#CC182C';
        ctx.font = 'bold 18px "Rajdhani", sans-serif';
        ctx.fillText(formatMoney(inv.total), 450, currentY);
        
        drawDivider(currentY + 25);
        
        // Lời cảm ơn chân thành
        currentY += 60;
        ctx.textAlign = 'center';
        ctx.fillStyle = '#596A77';
        ctx.font = 'italic 11.5px "Inter", sans-serif';
        ctx.fillText('Cảm ơn bạn đã đồng hành cùng Techno Store!', centerX, currentY);
        ctx.fillText('Vui lòng lưu lại ảnh để nhận bảo hành chính hãng.', centerX, currentY + 18);
        
        // Trích xuất base64 ảnh PNG
        const dataUrl = canvas.toDataURL('image/png');
        currentPreviewDataUrl = dataUrl;
        
        const dateFolder = inv.date;
        currentPreviewFilename = `Lịch sử giao dịch/Ngày ${dateFolder}/Đơn ${inv.id}.png`;
        
        // Hiển thị preview modal lập tức
        if (billPreviewImage) billPreviewImage.src = dataUrl;
        if (billPreviewModal) billPreviewModal.classList.remove('hidden');
        
        // Thực hiện gửi yêu cầu tự động lưu vào ổ đĩa D thông qua API Server Node.js
        const API_BASE = window.location.port === '3000' ? '' : 'http://127.0.0.1:3000';
        fetch(`${API_BASE}/api/save-bill`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                image: dataUrl,
                filename: `Ngày ${dateFolder}/Đơn ${inv.id}.png`
            })
        })
        .then(res => res.json())
        .then(resData => {
            if (resData.status === 'success') {
                showToast(`[ĐÃ TỰ ĐỘNG LƯU] Đơn ${inv.id} tại D:\\Lịch sử giao dịch\\`);
            } else {
                showToast(`Lỗi tự động lưu ổ D: ${resData.message}`);
            }
        })
        .catch(err => {
            console.log("Local auto-save server is offline.", err);
            showToast("Đã xem trước bill! Vui lòng khởi động server Node.js.");
        });
    }

    // ==========================================================================
    // D. HÀM VẼ BẢNG DANH SÁCH ĐƠN HÀNG (LEFT COLUMN)
    // ==========================================================================
    function renderTable() {
        const isEmployee = activeUser && activeUser.role !== 'Super Admin';
        let filtered = invoicesList.filter(inv => {
            // Phân quyền: Nhân viên thường chỉ xem hóa đơn của chính mình
            if (isEmployee) {
                const staffNameLower = inv.staff.toLowerCase();
                const userFullNameLower = activeUser.name.toLowerCase();
                const usernameLower = activeUser.username.toLowerCase();
                const isOwnInvoice = userFullNameLower.includes(staffNameLower) || staffNameLower.includes(usernameLower);
                if (!isOwnInvoice) return false;
            }

            const matchesStatus = (filterStatusVal === 'Tất cả trạng thái' || inv.status === filterStatusVal);
            const matchesDate = (!filterDateVal || inv.date === filterDateVal);
            
            const customerLower = inv.customer.toLowerCase();
            const idLower = inv.id.toLowerCase();
            const staffLower = inv.staff.toLowerCase();
            const queryLower = searchQuery.toLowerCase();
            const matchesSearch = customerLower.includes(queryLower) || idLower.includes(queryLower) || staffLower.includes(queryLower);
            
            return matchesStatus && matchesDate && matchesSearch;
        });

                // Sắp xếp các hóa đơn MỚI NHẤT LÊN HÀNG ĐẦU #1 (Thời gian gần nhất ở đầu)
        filtered.sort((a, b) => {
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

        const totalItems = filtered.length;
        const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

        if (currentPage > totalPages) {
            currentPage = totalPages;
        }

        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
        const pageItems = filtered.slice(startIndex, endIndex);

        if (pageItems.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="7" class="text-center" style="padding: 40px; color: var(--text-muted);">
                        Không tìm thấy giao dịch nào phù hợp!
                    </td>
                </tr>
            `;
            paginationSummary.textContent = `0 - 0 của 0 đơn hàng`;
            renderPagination(totalPages);
            invoiceDetailsContent.innerHTML = `
                <div class="text-center" style="padding: 60px 0; color: var(--text-muted);">
                    Không có đơn hàng nào được chọn.
                </div>
            `;
            return;
        }

        // Kiểm tra xem ID đơn hàng đang chọn có tồn tại trong danh sách lọc không. Nếu không, chọn mặc định dòng đầu tiên.
        const isSelectedExist = pageItems.some(item => item.id === selectedInvoiceId);
        if (!isSelectedExist && pageItems.length > 0) {
            selectedInvoiceId = pageItems[0].id;
        }

        tableBody.innerHTML = '';
        pageItems.forEach(inv => {
            const tr = document.createElement('tr');
            if (inv.id === selectedInvoiceId) {
                tr.className = 'selected-row';
            }

            // Badge trạng thái
            let statusClass = 'success';
            if (inv.status === 'Chờ thanh toán') statusClass = 'info';
            else if (inv.status === 'Đang xử lý') statusClass = 'warning';
            else if (inv.status === 'Đã hủy') statusClass = 'danger';

            tr.innerHTML = `
                <td class="bold text-red">${inv.id}</td>
                <td>
                    <div style="font-size:12.5px; font-weight:600; color: var(--text-dark);">${inv.time}</div>
                    <div style="font-size:11px; color:var(--text-muted); margin-top:2px;">${inv.date.split('-').reverse().join('/')}</div>
                </td>
                <td>
                    <div class="staff-badge-cell">
                        <div class="staff-small-avatar">
                            ${getStaffAvatar(inv.staff)}
                        </div>
                        <span class="staff-name-text">${inv.staff}</span>
                    </div>
                </td>
                <td class="bold">${inv.customer}</td>
                <td class="bold">${formatMoney(inv.total)}</td>
                <td>
                    <span class="status-badge ${statusClass}">${inv.status}</span>
                </td>
                <td style="text-align: center; vertical-align: middle;">
                    <div style="display: inline-flex; gap: 8px; align-items: center; justify-content: center; width: 100%;">
                        ${inv.status === 'Đã thanh toán' ? `
                        <button class="eye-btn select-arrow-btn" data-id="${inv.id}" title="Xuất ảnh giao dịch" style="color: var(--accent-red); padding: 4px; display: flex; align-items: center; justify-content: center;">
                            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                <circle cx="12" cy="12" r="3"></circle>
                            </svg>
                        </button>
                        ` : ''}
                        ${!isEmployee ? `
                        <button class="delete-btn select-arrow-btn" data-id="${inv.id}" title="Xóa đơn hàng" style="color: var(--text-muted); padding: 4px; display: flex; align-items: center; justify-content: center;">
                            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            </svg>
                        </button>
                        ` : ''}
                        <button class="select-arrow-btn select-only-btn" data-id="${inv.id}" aria-label="Chọn" style="padding: 4px; display: flex; align-items: center; justify-content: center;">
                            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="9 18 15 12 9 6"></polyline>
                            </svg>
                        </button>
                    </div>
                </td>
            `;

            // Bắt sự kiện click nút con mắt
            const eyeBtn = tr.querySelector('.eye-btn');
            if (eyeBtn) {
                eyeBtn.addEventListener('click', (e) => {
                    e.stopPropagation(); // Không cho chọn dòng khi bấm mắt
                    generateInvoiceImage(inv);
                });
            }

            // Bắt sự kiện click nút xóa
            const deleteBtn = tr.querySelector('.delete-btn');
            if (deleteBtn) {
                deleteBtn.addEventListener('click', (e) => {
                    e.stopPropagation(); // Không cho chọn dòng khi bấm xóa
                    deleteTargetId = inv.id;
                    if (deleteTargetIdText) deleteTargetIdText.textContent = inv.id;
                    if (deleteConfirmModal) deleteConfirmModal.classList.remove('hidden');
                });
            }

            // Cho phép chọn dòng khi click vào toàn bộ tr hoặc nút chọn
            tr.addEventListener('click', (e) => {
                selectedInvoiceId = inv.id;
                renderTable(); // Re-render để đổi màu dòng select
            });

            tableBody.appendChild(tr);
        });

        paginationSummary.textContent = `${startIndex + 1} - ${endIndex} của ${totalItems} giao dịch`;
        renderPagination(totalPages);
        
        // Vẽ chi tiết đơn hàng được lựa chọn sang cột bên phải
        renderInvoiceDetails();
    }

    function renderPagination(totalPages) {
        paginationControls.innerHTML = '';

        const prevBtn = document.createElement('button');
        prevBtn.className = `page-btn ${currentPage === 1 ? 'disabled' : ''}`;
        prevBtn.innerHTML = `
            <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
        `;
        if (currentPage > 1) {
            prevBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                currentPage--;
                renderTable();
            });
        }
        paginationControls.appendChild(prevBtn);

        for (let i = 1; i <= totalPages; i++) {
            const pageNumBtn = document.createElement('button');
            pageNumBtn.className = `page-btn ${currentPage === i ? 'active' : ''}`;
            pageNumBtn.textContent = i;
            pageNumBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                currentPage = i;
                renderTable();
            });
            paginationControls.appendChild(pageNumBtn);
        }

        const nextBtn = document.createElement('button');
        nextBtn.className = `page-btn ${currentPage === totalPages ? 'disabled' : ''}`;
        nextBtn.innerHTML = `
            <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
        `;
        if (currentPage < totalPages) {
            nextBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                currentPage++;
                renderTable();
            });
        }
        paginationControls.appendChild(nextBtn);
    }

    // ==========================================================================
    // E. HÀM VẼ CHI TIẾT HÓA ĐƠN ĐỘNG (RIGHT COLUMN)
    // ==========================================================================
    function renderInvoiceDetails() {
        const inv = invoicesList.find(i => i.id === selectedInvoiceId);
        if (!inv) {
            invoiceDetailsContent.innerHTML = `
                <div class="text-center" style="padding: 60px 0; color: var(--text-muted);">
                    Không tìm thấy dữ liệu chi tiết hóa đơn.
                </div>
            `;
            return;
        }

        // Lớp phủ badge trạng thái
        let statusClass = 'success';
        if (inv.status === 'Chờ thanh toán') statusClass = 'info';
        else if (inv.status === 'Đang xử lý') statusClass = 'warning';
        else if (inv.status === 'Đã hủy') statusClass = 'danger';

        // Render danh sách sản phẩm mua kèm icon rực rỡ
        let itemsHtml = '';
        const items = inv.items || [];
        items.forEach(item => {
            const iconSvg = COMPONENT_SVGS[item.category] || COMPONENT_SVGS['VGA'];
            itemsHtml += `
                <div class="purchased-item-row">
                    <div class="purchased-item-img">
                        ${iconSvg}
                    </div>
                    <div class="purchased-item-info">
                        <span class="purchased-item-name">${item.name}</span>
                        <span class="purchased-item-cat">${item.category}</span>
                    </div>
                    <span class="purchased-item-qty">x${item.qty}</span>
                    <span class="purchased-item-price">${formatMoney(item.price)}</span>
                </div>
            `;
        });

        // Render dải Timeline trạng thái dọc
        let timelineHtml = '';
        const timelineData = inv.timeline || [
            { type: 'completed', title: 'Khách đặt hàng', time: inv.time || '', desc: 'Đơn hàng được tạo thành công trên hệ thống.' },
            { type: 'completed', title: 'Thanh toán', time: inv.time || '', desc: `Đã xác nhận thanh toán qua ${inv.paymentMethod || 'Tiền mặt'}.` },
            { type: 'active', title: 'Hoàn tất giao dịch', time: inv.time || '', desc: 'Giao dịch thành công.' }
        ];

        timelineData.forEach(node => {
            timelineHtml += `
                <div class="timeline-node ${node.type}">
                    <span class="timeline-dot"></span>
                    <div class="timeline-meta-row">
                        <span class="timeline-status-title">${node.title}</span>
                        <span class="timeline-status-time">${node.time}</span>
                    </div>
                    <p class="timeline-status-desc">${node.desc}</p>
                </div>
            `;
        });

        // Ghép nối cấu trúc HTML hoàn chỉnh cho cột chi tiết
        invoiceDetailsContent.innerHTML = `
            <!-- Tiêu đề mã đơn & Trạng thái -->
            <div class="invoice-header-info">
                <span class="invoice-title">${inv.id}</span>
                <span class="status-badge ${statusClass}">${inv.status}</span>
            </div>

            <!-- Tổng tiền -->
            <div class="total-price-box">
                <h2>${formatMoney(inv.total)}</h2>
                <span>Tổng tiền hóa đơn</span>
            </div>

            <!-- Hàng Grid Meta thông tin chi tiết -->
            <div class="meta-grid">
                <div class="meta-item">
                    <span class="meta-item-icon">
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                    </span>
                    <span class="meta-item-label">Thời gian giao dịch</span>
                    <span class="meta-item-value">${inv.time} - ${inv.date.split('-').reverse().join('/')}</span>
                </div>
                <div class="meta-item">
                    <span class="meta-item-icon">
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                    </span>
                    <span class="meta-item-label">Nhân viên thực hiện</span>
                    <span class="meta-item-value">${inv.staff}</span>
                </div>
                <div class="meta-item">
                    <span class="meta-item-icon">
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                            <circle cx="9" cy="7" r="4"></circle>
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                        </svg>
                    </span>
                    <span class="meta-item-label">Khách hàng giao dịch</span>
                    <span class="meta-item-value">${inv.customer}</span>
                </div>
                <div class="meta-item">
                    <span class="meta-item-icon">
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                            <rect x="2" y="4" width="20" height="16" rx="2" ry="2"></rect>
                            <line x1="12" y1="18" x2="12" y2="18"></line>
                            <line x1="2" y1="10" x2="22" y2="10"></line>
                        </svg>
                    </span>
                    <span class="meta-item-label">Phương thức thanh toán</span>
                    <span class="meta-item-value">${inv.paymentMethod}</span>
                </div>
                <div class="meta-item">
                    <span class="meta-item-icon">
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <polyline points="14 2 14 8 20 8"></polyline>
                            <line x1="16" y1="13" x2="8" y2="13"></line>
                            <line x1="16" y1="17" x2="8" y2="17"></line>
                            <polyline points="10 9 9 9 8 9"></polyline>
                        </svg>
                    </span>
                    <span class="meta-item-label">Ghi chú đơn hàng</span>
                    <span class="meta-item-value">${inv.note}</span>
                </div>
            </div>

            <!-- Sản phẩm đã mua -->
            <div class="purchased-items-section">
                <h4>Sản phẩm đã mua</h4>
                <div class="purchased-items-list">
                    ${itemsHtml}
                </div>
            </div>

            <!-- Lịch sử trạng thái -->
            <div class="timeline-section">
                <h4>Lịch sử trạng thái đơn hàng</h4>
                <div class="timeline-list">
                    ${timelineHtml}
                </div>
            </div>
        `;
    }

    // ==========================================================================
    // F. SỰ KIỆN LẮNG NGHE BỘ LỌC ĐỘNG
    // ==========================================================================
    if (filterStatus) {
        filterStatus.addEventListener('change', (e) => {
            filterStatusVal = e.target.value;
            currentPage = 1;
            renderTable();
        });
    }

    if (searchDate) {
        searchDate.addEventListener('change', (e) => {
            filterDateVal = e.target.value; // định dạng YYYY-MM-DD
            currentPage = 1;
            renderTable();
        });
    }

    // Lắng nghe tìm kiếm nhanh góc trái hành động
    if (searchInvoice) {
        searchInvoice.addEventListener('input', (e) => {
            searchQuery = e.target.value.trim();
            if (headerSearchInvoice) headerSearchInvoice.value = searchQuery;
            currentPage = 1;
            renderTable();
        });
    }

    // Lắng nghe tìm kiếm nhanh Header
    if (headerSearchInvoice) {
        headerSearchInvoice.addEventListener('input', (e) => {
            searchQuery = e.target.value.trim();
            if (searchInvoice) searchInvoice.value = searchQuery;
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

    // ==========================================================================
    // G. LOGIC XÓA ĐƠN HÀNG & MODAL XÁC NHẬN
    // ==========================================================================
    const deleteConfirmModal = document.getElementById('deleteConfirmModal');
    const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    const deleteTargetIdText = document.getElementById('deleteTargetIdText');
    const btnDeleteInvoice = document.getElementById('btnDeleteInvoice');

    let deleteTargetId = null;

    if (btnDeleteInvoice) {
        btnDeleteInvoice.addEventListener('click', () => {
            if (!selectedInvoiceId) return;
            deleteTargetId = selectedInvoiceId;
            deleteTargetIdText.textContent = selectedInvoiceId;
            deleteConfirmModal.classList.remove('hidden');
        });
    }

    if (cancelDeleteBtn) {
        cancelDeleteBtn.addEventListener('click', () => {
            deleteConfirmModal.classList.add('hidden');
            deleteTargetId = null;
        });
    }

    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', () => {
            if (deleteTargetId) {
                invoicesList = invoicesList.filter(inv => inv.id !== deleteTargetId);
                saveInvoices();
                deleteConfirmModal.classList.add('hidden');
                deleteTargetId = null;
                
                // Chọn mặc định lại hóa đơn đầu tiên trong bảng
                selectedInvoiceId = invoicesList.length > 0 ? invoicesList[0].id : '';
                renderTable();
                
                showToast('Đã xóa đơn hàng thành công khỏi hệ thống!');
            }
        });
    }

    // Đóng modal khi click ra vùng ngoài overlay
    if (deleteConfirmModal) {
        deleteConfirmModal.addEventListener('click', (e) => {
            if (e.target === deleteConfirmModal) {
                deleteConfirmModal.classList.add('hidden');
                deleteTargetId = null;
            }
        });
    }

    // ==========================================================================
    // H. LOGIC XUẤT FILE BÁO CÁO (TOAST THÔNG BÁO)
    // ==========================================================================
    const toastNotification = document.getElementById('toastNotification');
    const toastText = document.getElementById('toastText');
    
    function showToast(message) {
        if (!toastNotification) return;
        toastText.textContent = message;
        toastNotification.classList.remove('hidden');
        
        setTimeout(() => {
            toastNotification.classList.add('hidden');
        }, 2500);
    }



    // Xuất ảnh giao dịch PNG từ details card
    const btnExportImageInvoice = document.getElementById('btnExportImageInvoice');
    if (btnExportImageInvoice) {
        btnExportImageInvoice.addEventListener('click', () => {
            if (!selectedInvoiceId) return;
            const inv = invoicesList.find(i => i.id === selectedInvoiceId);
            if (inv) {
                if (inv.status === 'Đã thanh toán') {
                    generateInvoiceImage(inv);
                } else {
                    alert('Chỉ hỗ trợ xuất ảnh giao dịch đối với các đơn hàng đã thanh toán thành công!');
                }
            }
        });
    }

    // Xuất báo cáo toàn bộ
    const btnExportAll = document.getElementById('btnExportAll');
    if (btnExportAll) {
        btnExportAll.addEventListener('click', () => {
            showToast('Xuất báo cáo toàn bộ giao dịch hệ thống thành công!');
        });
    }

    // ==========================================================================
    // I. ĐỒNG BỘ ACCOUNT TRÊN SIDEBAR & HEADER
    // ==========================================================================
    if (activeUser) {
        updateProfileUI();
        
        // Phân quyền: Nhân viên thường không được phép xóa đơn hàng
        const isEmployee = activeUser.role !== 'Super Admin';
        if (isEmployee) {
            const btnDeleteInvoice = document.getElementById('btnDeleteInvoice');
            if (btnDeleteInvoice) {
                btnDeleteInvoice.style.display = 'none';
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

    // ==========================================================================
    // J. BỘ ĐIỀU KHIỂN DROPDOWN THÔNG BÁO CHUYÊN NGHIỆP
    // ==========================================================================
    // (Handled globally by auth_guard.js)

    // ==========================================================================
    // K. BỘ ĐIỀU KHIỂN CHỈNH SỬA PROFILE
    // ==========================================================================
    const profileModal = document.getElementById('profileModal');
    const editProfileBtn = document.getElementById('editProfileBtn');
    const headerProfileWidgetBtn = document.getElementById('headerProfileWidgetBtn');
    const btnCloseProfileModal = document.getElementById('btnCloseProfileModal');
    const btnCancelProfileModal = document.getElementById('btnCancelProfileModal');
    const btnSaveProfile = document.getElementById('btnSaveProfile');
    const profileInputName = document.getElementById('profileInputName');
    const profileInputRole = document.getElementById('profileInputRole');

    const profileInputAvatarFile = document.getElementById('profileInputAvatarFile');
    const profileModalAvatarPreview = document.getElementById('profileModalAvatarPreview');
    const profileModalAvatarPlaceholder = document.getElementById('profileModalAvatarPlaceholder');
    let tempAvatarUrl = '';

    function openProfileModal() {
        if (!activeUser) return;
        profileInputName.value = activeUser.name;
        profileInputRole.value = activeUser.role;
        tempAvatarUrl = activeUser.avatarUrl || '';

        const initials = activeUser.name
            .split(' ')
            .map(word => word.charAt(0))
            .join('')
            .toUpperCase()
            .substring(0, 2);

        if (profileModalAvatarPlaceholder) {
            profileModalAvatarPlaceholder.textContent = initials;
        }

        if (activeUser.avatarUrl) {
            if (profileModalAvatarPreview) {
                profileModalAvatarPreview.src = activeUser.avatarUrl;
                profileModalAvatarPreview.style.display = 'block';
            }
            if (profileModalAvatarPlaceholder) {
                profileModalAvatarPlaceholder.style.display = 'none';
            }
        } else {
            if (profileModalAvatarPreview) {
                profileModalAvatarPreview.src = '';
                profileModalAvatarPreview.style.display = 'none';
            }
            if (profileModalAvatarPlaceholder) {
                profileModalAvatarPlaceholder.style.display = 'block';
            }
        }

        profileModal.classList.remove('hidden');
    }

    function closeProfileModal() {
        profileModal.classList.add('hidden');
    }

    if (profileInputAvatarFile) {
        profileInputAvatarFile.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    tempAvatarUrl = event.target.result;
                    if (profileModalAvatarPreview) {
                        profileModalAvatarPreview.src = tempAvatarUrl;
                        profileModalAvatarPreview.style.display = 'block';
                    }
                    if (profileModalAvatarPlaceholder) {
                        profileModalAvatarPlaceholder.style.display = 'none';
                    }
                };
                reader.readAsDataURL(file);
            }
        });
    }

    if (editProfileBtn) editProfileBtn.addEventListener('click', (e) => { e.preventDefault(); openProfileModal(); });
    if (headerProfileWidgetBtn) headerProfileWidgetBtn.addEventListener('click', openProfileModal);
    if (btnCloseProfileModal) btnCloseProfileModal.addEventListener('click', closeProfileModal);
    if (btnCancelProfileModal) btnCancelProfileModal.addEventListener('click', closeProfileModal);

    if (btnSaveProfile) {
        btnSaveProfile.addEventListener('click', () => {
            const newName = profileInputName.value.trim();
            if (!newName) {
                alert('Vui lòng điền họ và tên!');
                return;
            }

            // 1. Cập nhật activeUser
            activeUser.name = newName;
            activeUser.avatarUrl = tempAvatarUrl;
            localStorage.setItem('sessionActiveUser', JSON.stringify(activeUser));

            // 2. Cập nhật trong cơ sở dữ liệu users
            let users = JSON.parse(localStorage.getItem('users')) || [];
            const userIdx = users.findIndex(u => u.username === activeUser.username);
            if (userIdx !== -1) {
                users[userIdx].name = newName;
                users[userIdx].avatarUrl = tempAvatarUrl;
                localStorage.setItem('users', JSON.stringify(users));
            }

            // 2b. Cập nhật database nhân viên thực tế pcpos_staff
            let staffList = JSON.parse(localStorage.getItem('pcpos_staff')) || [];
            const staffIdx = staffList.findIndex(s => s.name === activeUser.name || s.username === activeUser.username);
            if (staffIdx !== -1) {
                staffList[staffIdx].name = newName;
                staffList[staffIdx].image = tempAvatarUrl;
                localStorage.setItem('pcpos_staff', JSON.stringify(staffList));
            }

            // 2c. Đồng bộ MySQL Database
            const API_BASE = window.location.port === '3000' ? '' : 'http://127.0.0.1:3000';
            fetch(`${API_BASE}/api/auth/update-profile`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: activeUser.username,
                    name: newName,
                    avatarUrl: tempAvatarUrl
                })
            })
            .then(res => res.json())
            .catch(err => console.error('[DATABASE] Lỗi đồng bộ MySQL:', err));

            // 3. Cập nhật UI ngay lập tức
            updateProfileUI();

            closeProfileModal();
            showToast('Đã cập nhật Profile thành công!');
        });
    }

    function updateProfileUI() {
        if (!activeUser) return;
        
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

        if (sidebarAvatarLetter) {
            if (activeUser.avatarUrl) {
                sidebarAvatarLetter.innerHTML = `<img src="${activeUser.avatarUrl}" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">`;
                sidebarAvatarLetter.style.backgroundColor = 'transparent';
            } else {
                sidebarAvatarLetter.textContent = initials;
                sidebarAvatarLetter.style.backgroundColor = 'var(--accent-red)';
            }
        }

        if (headerAvatar) {
            if (activeUser.avatarUrl) {
                headerAvatar.innerHTML = `<img src="${activeUser.avatarUrl}" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">`;
                headerAvatar.style.backgroundColor = 'transparent';
            } else {
                headerAvatar.textContent = initials;
                headerAvatar.style.backgroundColor = '#E2E8F0';
            }
        }
    }

    renderTable();
});
