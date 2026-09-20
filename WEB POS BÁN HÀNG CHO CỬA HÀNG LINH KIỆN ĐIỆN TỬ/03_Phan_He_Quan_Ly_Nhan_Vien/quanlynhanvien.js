/* Techno Admin Dashboard - Logic Quản lý nhân viên */

document.addEventListener('DOMContentLoaded', () => {
    const activeUser = JSON.parse(localStorage.getItem('sessionActiveUser'));
    // ==========================================================================
    // A. KHỞI TẠO DANH SÁCH NHÂN VIÊN MẪU (NẾU CHƯA CÓ TRONG LOCALSTORAGE)
    // ==========================================================================
    const DEFAULT_STAFF = [
        { id: 'NV001', name: 'Trần Văn Messi', role: 'Quản lý cửa hàng', status: 'Hoạt động' },
        { id: 'NV002', name: 'Trần Thị Năm Đỏ', role: 'Nhân viên bán hàng', status: 'Hoạt động' },
        { id: 'NV003', name: 'Nguyễn Văn B', role: 'Thu ngân', status: 'Hoạt động' },
        { id: 'NV004', name: 'Huỳnh Thị C', role: 'Sale', status: 'Hoạt động' },
        { id: 'NV005', name: 'Tiến Phan', role: 'Kỹ thuật viên', status: 'Nghỉ việc' },
        { id: 'NV006', name: 'Thương Nguyễn', role: 'Kỹ thuật viên', status: 'Nghỉ việc' },
        { id: 'NV007', name: 'Nghĩa', role: 'Kỹ thuật viên', status: 'Nghỉ việc' }
    ];

    let staffList = [];
    const API_BASE = window.location.port === '3000' ? '' : 'http://127.0.0.1:3000';

    function fetchStaffFromBackend() {
        fetch(`${API_BASE}/api/users`)
        .then(res => res.json())
        .then(resData => {
            if (resData.status === 'success') {
                staffList = resData.data.map(u => ({
                    id: u.id,
                    username: u.username,
                    password: u.password_raw,
                    name: u.name,
                    role: u.role,
                    status: u.status,
                    image: u.avatar_url,
                    email: u.email,
                    phone: u.phone
                }));
                renderTable();
            }
        })
        .catch(err => {
            console.error("Failed to load from DB:", err);
            staffList = JSON.parse(localStorage.getItem('pcpos_staff')) || DEFAULT_STAFF;
            renderTable();
        });
    }

    // Biến tạm lưu ảnh chân dung upload (Base64)
    let tempUploadedImage = null;

    // ==========================================================================
    // B. BỘ TẠO AVATAR HOẠT HÌNH DỄ THƯƠNG BẰNG VECTOR SVG (100% OFFLINE)
    // ==========================================================================
    function getAvatarSvg(id, name) {
        // Tạo mã hash dựa trên tên để màu sắc nhất quán
        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }
        
        const backgrounds = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#6366F1', '#8B5CF6', '#EC4899', '#14B8A6'];
        const clothesColors = ['#475569', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#6366F1', '#8B5CF6'];
        const hairColors = ['#1E293B', '#475569', '#78350F', '#B45309', '#0F172A'];
        
        const bg = backgrounds[Math.abs(hash) % backgrounds.length];
        const cloth = clothesColors[Math.abs(hash >> 2) % clothesColors.length];
        const hair = hairColors[Math.abs(hash >> 4) % hairColors.length];
        
        // Phán đoán giới tính dựa trên tên (Thị, C, Thương...)
        const isFemale = name.includes('Thị') || name.endsWith(' C') || name.includes('Thương') || (Math.abs(hash) % 2 === 0);
        
        let hairPath = '';
        if (isFemale) {
            // Tóc dài nữ
            hairPath = `<path d="M32 24c0-8 36-8 36 0v24c0 6-6 10-18 10S32 54 32 48V24z" fill="${hair}"/><path d="M30 30c2-5 10-8 20-8s18 3 20 8c-4-3-10-5-20-5s-16 2-20 5z" fill="#FFF" opacity="0.15"/>`;
        } else {
            // Tóc ngắn nam
            hairPath = `<path d="M32 23c0-7 36-7 36 0v8c0 2-4 3-8 3s-8-3-10-3-8 2-10 3-8-1-8-3v-8z" fill="${hair}"/>`;
        }
        
        return `
            <svg viewBox="0 0 100 100" class="avatar-svg">
                <circle cx="50" cy="50" r="48" fill="${bg}" />
                ${isFemale ? hairPath : ''}
                <rect x="45" y="52" width="10" height="12" fill="#FDBA74" rx="2"/>
                <circle cx="50" cy="38" r="15" fill="#FDBA74" />
                ${!isFemale ? hairPath : ''}
                <circle cx="45" cy="36" r="1.5" fill="#1E293B" />
                <circle cx="55" cy="36" r="1.5" fill="#1E293B" />
                <path d="M47 43 q3 2.5 6 0" stroke="#1E293B" stroke-width="1.5" fill="none" stroke-linecap="round" />
                <path d="M28 78c0-10 10-17 22-17s22 7 22 17v12H28V78z" fill="${cloth}" />
                <path d="M43 61l7 8 7-8" fill="#FDBA74" />
            </svg>
        `;
    }

    // ==========================================================================
    // C. ĐỊNH NGHĨA BIỂU TƯỢNG VAI TRÒ (ROLE ICONS)
    // ==========================================================================
    const ROLE_ICONS = {
        'Quản lý cửa hàng': `
            <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>`,
        'Nhân viên bán hàng': `
            <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
            </svg>`,
        'Thu ngân': `
            <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="12" y1="1" x2="12" y2="23"></line>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
            </svg>`,
        'Sale': `
            <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
                <line x1="7" y1="7" x2="7" y2="7"></line>
            </svg>`,
        'Kỹ thuật viên': `
            <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
            </svg>`
    };

    function getRoleBadgeClass(role) {
        switch (role) {
            case 'Quản lý cửa hàng': return 'quanly';
            case 'Nhân viên bán hàng': return 'banhang';
            case 'Thu ngân': return 'thungan';
            case 'Sale': return 'sale';
            case 'Kỹ thuật viên': return 'kythuat';
            default: return '';
        }
    }

    // ==========================================================================
    // D. ĐIỀU KHIỂN STATE BẢNG & BỘ LỌC
    // ==========================================================================
    let filterRoleVal = 'Tất cả vị trí';
    let filterStatusVal = 'Tất cả trạng thái';
    let searchQuery = '';
    let currentPage = 1;
    let itemsPerPage = 10;

    const tableBody = document.getElementById('staffTableBody');
    const paginationControls = document.getElementById('paginationControls');
    const paginationSummary = document.getElementById('paginationSummary');
    const perPageSelect = document.getElementById('perPageSelect');

    const filterRole = document.getElementById('filterRole');
    const filterStatus = document.getElementById('filterStatus');
    const staffQuickSearchInput = document.getElementById('staffQuickSearchInput');
    const staffHeaderSearchInput = document.getElementById('staffHeaderSearchInput');

    function saveStaff() {
        localStorage.setItem('pcpos_staff', JSON.stringify(staffList));
    }

    // ==========================================================================
    // E. HÀM VẼ BẢNG (RENDER TABLE)
    // ==========================================================================
    function renderTable() {
        // Lọc dữ liệu theo bộ lọc động
        let filtered = staffList.filter(s => {
            const matchesRole = (filterRoleVal === 'Tất cả vị trí' || s.role === filterRoleVal);
            const matchesStatus = (filterStatusVal === 'Tất cả trạng thái' || s.status === filterStatusVal);
            
            const nameLower = s.name.toLowerCase();
            const idLower = s.id.toLowerCase();
            const queryLower = searchQuery.toLowerCase();
            const matchesSearch = nameLower.includes(queryLower) || idLower.includes(queryLower);
            
            return matchesRole && matchesStatus && matchesSearch;
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
                    <td colspan="8" class="text-center" style="padding: 40px; color: var(--text-muted);">
                        Không tìm thấy nhân viên nào phù hợp!
                    </td>
                </tr>
            `;
            paginationSummary.textContent = `0 - 0 của 0 nhân viên`;
            renderPagination(totalPages);
            return;
        }

        tableBody.innerHTML = '';
        pageItems.forEach(s => {
            const tr = document.createElement('tr');
            
            // Xử lý ảnh đại diện
            let avatarContent = '';
            if (s.image) {
                avatarContent = `<img src="${s.image}" class="staff-table-avatar" alt="${s.name}">`;
            } else {
                avatarContent = getAvatarSvg(s.id, s.name);
            }

            // Xử lý trạng thái hoạt động
            const statusClass = s.status === 'Hoạt động' ? 'active' : 'inactive';

            // Xử lý icon vai trò
            const roleIcon = ROLE_ICONS[s.role] || ROLE_ICONS['Nhân viên bán hàng'];

            tr.innerHTML = `
                <td class="bold">${s.id}</td>
                <td>
                    <div class="staff-avatar-container">
                        ${avatarContent}
                    </div>
                </td>
                <td class="bold">${s.name}</td>
                <td style="font-weight: 600; color: #1E293B;">${s.username || '---'}</td>
                <td>
                    <div class="pass-cell-wrapper" style="display: flex; align-items: center; gap: 4px;">
                        <span class="pass-mask" id="pass-mask-${s.id}" style="font-family: monospace; font-weight: 700; color: var(--text-muted); letter-spacing: 2px;">••••••</span>
                        <span class="pass-plain hidden" id="pass-plain-${s.id}" style="font-family: monospace; font-weight: 700; color: var(--accent-red);">${s.password || '123'}</span>
                        
                        <!-- Nút bật/tắt hiện mật khẩu -->
                        <button type="button" class="action-btn-inline toggle-pass-btn" data-id="${s.id}" title="Hiện/Ẩn mật khẩu" style="background: none; border: none; cursor: pointer; padding: 2px 4px; color: var(--text-muted); display: inline-flex; align-items: center;">
                            <svg class="eye-open-icon hidden" viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                                <line x1="1" y1="1" x2="23" y2="23"></line>
                            </svg>
                            <svg class="eye-closed-icon" viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                <circle cx="12" cy="12" r="3"></circle>
                            </svg>
                        </button>
                        
                        <!-- Nút sửa mật khẩu nhanh -->
                        <button type="button" class="action-btn-inline edit-pass-btn" data-id="${s.id}" title="Sửa mật khẩu" style="background: none; border: none; cursor: pointer; padding: 2px 4px; color: var(--accent-red); display: inline-flex; align-items: center;">
                            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                            </svg>
                        </button>
                    </div>
                </td>
                <td>
                    <span class="role-badge ${getRoleBadgeClass(s.role)}">
                        ${roleIcon}
                        ${s.role}
                    </span>
                </td>
                <td>
                    <span class="status-badge ${statusClass}">
                        <span class="status-dot"></span>
                        ${s.status}
                    </span>
                </td>
                <td>
                    <div class="action-buttons-group">
                        <button class="action-btn view" data-id="${s.id}" title="Hồ sơ chi tiết">
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                <circle cx="12" cy="12" r="3"></circle>
                            </svg>
                        </button>
                        <button class="action-btn edit" data-id="${s.id}" title="Chỉnh sửa">
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                        </button>
                        <button class="action-btn delete" data-id="${s.id}" title="Xóa">
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

        paginationSummary.textContent = `${startIndex + 1} - ${endIndex} của ${totalItems} nhân viên`;
        renderPagination(totalPages);
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
            prevBtn.addEventListener('click', () => {
                currentPage--;
                renderTable();
            });
        }
        paginationControls.appendChild(prevBtn);

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
    // F. SỰ KIỆN LẮNG NGHE BỘ LỌC ĐỘNG
    // ==========================================================================
    if (filterRole) {
        filterRole.addEventListener('change', (e) => {
            filterRoleVal = e.target.value;
            currentPage = 1;
            renderTable();
        });
    }

    if (filterStatus) {
        filterStatus.addEventListener('change', (e) => {
            filterStatusVal = e.target.value;
            currentPage = 1;
            renderTable();
        });
    }

    // Tìm kiếm nhanh góc phải
    if (staffQuickSearchInput) {
        staffQuickSearchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value.trim();
            if (staffHeaderSearchInput) staffHeaderSearchInput.value = searchQuery; // Đồng bộ ô header
            currentPage = 1;
            renderTable();
        });
    }

    // Tìm kiếm Header chính
    if (staffHeaderSearchInput) {
        staffHeaderSearchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value.trim();
            if (staffQuickSearchInput) staffQuickSearchInput.value = searchQuery; // Đồng bộ ô góc phải
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
    // G. LOGIC CRUD (THÊM / SỬA / XÓA) & HỘP THOẠI MODAL
    // ==========================================================================
    const staffModal = document.getElementById('staffModal');
    const deleteConfirmModal = document.getElementById('deleteConfirmModal');
    const viewStaffModal = document.getElementById('viewStaffModal');

    const staffForm = document.getElementById('staffForm');
    const modalTitle = document.getElementById('modalTitle');
    const formStaffId = document.getElementById('formStaffId');
    const formStaffName = document.getElementById('formStaffName');
    const formStaffRole = document.getElementById('formStaffRole');
    const formStaffStatus = document.getElementById('formStaffStatus');

    // Chân dung upload ảnh
    const imageUploadZone = document.getElementById('imageUploadZone');
    const formStaffImage = document.getElementById('formStaffImage');
    const uploadZoneContent = document.getElementById('uploadZoneContent');
    const uploadPreviewContainer = document.getElementById('uploadPreviewContainer');
    const uploadPreviewImg = document.getElementById('uploadPreviewImg');
    const btnRemovePreview = document.getElementById('btnRemovePreview');

    const deleteTargetName = document.getElementById('deleteTargetName');
    const viewDetailsBody = document.getElementById('viewDetailsBody');

    let deleteTargetId = null;

    // Logic drag drop và tải tệp ảnh chân dung
    if (imageUploadZone && formStaffImage) {
        imageUploadZone.addEventListener('click', (e) => {
            if (e.target.closest('#btnRemovePreview')) return;
            formStaffImage.click();
        });

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
            if (e.dataTransfer.files.length > 0) {
                handleImageFile(e.dataTransfer.files[0]);
            }
        });

        formStaffImage.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                handleImageFile(e.target.files[0]);
            }
        });
    }

    function handleImageFile(file) {
        if (!file.type.match('image.*')) {
            alert('Vui lòng chỉ chọn tệp hình ảnh!');
            return;
        }
        if (file.size > 2 * 1024 * 1024) {
            alert('Dung lượng tệp ảnh không được quá 2MB!');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            tempUploadedImage = e.target.result;
            uploadPreviewImg.src = tempUploadedImage;
            uploadZoneContent.classList.add('hidden');
            uploadPreviewContainer.classList.remove('hidden');
        };
        reader.readAsDataURL(file);
    }

    if (btnRemovePreview) {
        btnRemovePreview.addEventListener('click', (e) => {
            e.stopPropagation();
            clearImageUpload();
        });
    }

    function clearImageUpload() {
        formStaffImage.value = '';
        uploadPreviewImg.src = '';
        uploadPreviewContainer.classList.add('hidden');
        uploadZoneContent.classList.remove('hidden');
        tempUploadedImage = null;
    }

    function showModal(title, isEdit = false, staffObj = null) {
        modalTitle.textContent = title;
        staffForm.reset();
        clearImageUpload();

        if (isEdit && staffObj) {
            formStaffId.value = staffObj.id;
            formStaffName.value = staffObj.name;
            formStaffRole.value = staffObj.role;
            formStaffStatus.value = staffObj.status;
            
            document.getElementById('formStaffUsername').value = staffObj.username || '';
            document.getElementById('formStaffPassword').value = staffObj.password || '';

            if (staffObj.image) {
                tempUploadedImage = staffObj.image;
                uploadPreviewImg.src = staffObj.image;
                uploadZoneContent.classList.add('hidden');
                uploadPreviewContainer.classList.remove('hidden');
            }
        } else {
            formStaffId.value = '';
            document.getElementById('formStaffUsername').value = '';
            document.getElementById('formStaffPassword').value = '123';
        }

        staffModal.classList.remove('hidden');
    }

    // Mở Modal Thêm nhân viên
    const openAddModalBtn = document.getElementById('openAddModalBtn');
    if (openAddModalBtn) {
        openAddModalBtn.addEventListener('click', () => {
            showModal('Thêm nhân viên mới', false);
        });
    }

    document.getElementById('closeModalBtn').addEventListener('click', () => staffModal.classList.add('hidden'));
    document.getElementById('cancelModalBtn').addEventListener('click', () => staffModal.classList.add('hidden'));

    // Submit Form Lưu (Thêm / Sửa)
    staffForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const idVal = formStaffId.value;
        const nameVal = formStaffName.value.trim();
        const roleVal = formStaffRole.value;
        const statusVal = formStaffStatus.value;
        const usernameVal = document.getElementById('formStaffUsername').value.trim();
        const passwordVal = document.getElementById('formStaffPassword').value.trim();

        if (!nameVal || !roleVal || !statusVal || !usernameVal || !passwordVal) {
            showToast('Vui lòng điền đầy đủ các thông tin bắt buộc *', 'warning');
            return;
        }

        const staffData = {
            id: idVal,
            username: usernameVal,
            password: passwordVal,
            name: nameVal,
            role: roleVal,
            status: statusVal,
            avatar_url: tempUploadedImage
        };

        if (idVal) {
            // Cập nhật nhân viên cũ qua API
            fetch(`${API_BASE}/api/users/${idVal}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(staffData)
            })
            .then(res => res.json())
            .then(resData => {
                if (resData.status === 'success') {
                    fetchStaffFromBackend();
                } else {
                    alert(resData.message);
                }
            })
            .catch(err => {
                console.error(err);
                // Fallback to local storage
                const idx = staffList.findIndex(s => s.id === idVal);
                if (idx !== -1) {
                    staffList[idx].name = nameVal;
                    staffList[idx].username = usernameVal;
                    staffList[idx].password = passwordVal;
                    staffList[idx].role = roleVal;
                    staffList[idx].status = statusVal;
                    staffList[idx].image = tempUploadedImage;
                }
                saveStaff();
                renderTable();
            });
        } else {
            // Thêm nhân viên mới qua API
            const numericIds = staffList.map(s => parseInt(s.id.replace(/\D/g, ''))).filter(n => !isNaN(n));
            const nextNum = Math.max(...numericIds, 0) + 1;
            const newId = 'NV' + String(nextNum).padStart(3, '0'); // Định dạng NV008, NV009...
            staffData.id = newId;

            fetch(`${API_BASE}/api/users`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(staffData)
            })
            .then(res => res.json())
            .then(resData => {
                if (resData.status === 'success') {
                    fetchStaffFromBackend();
                } else {
                    alert(resData.message);
                }
            })
            .catch(err => {
                console.error(err);
                // Fallback to local storage
                staffList.push({
                    id: newId,
                    username: usernameVal,
                    password: passwordVal,
                    name: nameVal,
                    role: roleVal,
                    status: statusVal,
                    image: tempUploadedImage
                });
                saveStaff();
                renderTable();
            });
        }

        // Đồng bộ ảnh đại diện nếu nhân sự này trùng tên với tài khoản đang đăng nhập
        if (activeUser && activeUser.name === nameVal) {
            activeUser.avatarUrl = tempUploadedImage;
            localStorage.setItem('sessionActiveUser', JSON.stringify(activeUser));
            updateProfileUI(activeUser);
        }

        staffModal.classList.add('hidden');
    });

    // Thao tác các nút trong bảng (Hiện/Ẩn MK, Sửa MK nhanh, Xem chi tiết, Sửa, Xóa)
    tableBody.addEventListener('click', (e) => {
        // Nút Hiện/Ẩn mật khẩu
        const toggleBtn = e.target.closest('.toggle-pass-btn');
        if (toggleBtn) {
            const id = toggleBtn.getAttribute('data-id');
            const maskEl = document.getElementById(`pass-mask-${id}`);
            const plainEl = document.getElementById(`pass-plain-${id}`);
            const eyeOpen = toggleBtn.querySelector('.eye-open-icon');
            const eyeClosed = toggleBtn.querySelector('.eye-closed-icon');

            if (maskEl && plainEl) {
                const isMasked = !maskEl.classList.contains('hidden');
                if (isMasked) {
                    maskEl.classList.add('hidden');
                    plainEl.classList.remove('hidden');
                    if (eyeOpen) eyeOpen.classList.remove('hidden');
                    if (eyeClosed) eyeClosed.classList.add('hidden');
                } else {
                    maskEl.classList.remove('hidden');
                    plainEl.classList.add('hidden');
                    if (eyeOpen) eyeOpen.classList.add('hidden');
                    if (eyeClosed) eyeClosed.classList.remove('hidden');
                }
            }
            return;
        }

        // Nút Đổi mật khẩu nhanh
        const editPassBtn = e.target.closest('.edit-pass-btn');
        if (editPassBtn) {
            const id = editPassBtn.getAttribute('data-id');
            const staffObj = staffList.find(s => s.id === id);
            if (staffObj) {
                document.getElementById('editPassStaffId').value = staffObj.id;
                document.getElementById('editPassStaffName').textContent = `${staffObj.name} (${staffObj.id})`;
                document.getElementById('newPasswordInput').value = staffObj.password || '123';
                document.getElementById('editPasswordModal').classList.remove('hidden');
            }
            return;
        }

        // Nút Thao tác chuẩn (Xem chi tiết, Chỉnh sửa, Xóa)
        const btn = e.target.closest('.action-btn');
        if (!btn) return;

        const id = btn.getAttribute('data-id');
        const staffObj = staffList.find(s => s.id === id);
        if (!staffObj) return;

        if (btn.classList.contains('view')) {
            // Xem hồ sơ chi tiết
            let imgHtml = '';
            if (staffObj.image) {
                imgHtml = `<img src="${staffObj.image}" style="width:70px; height:70px; object-fit:cover; border-radius:50%; margin: 0 auto 12px auto; display:block; border: 2.5px solid var(--accent-red);">`;
            } else {
                imgHtml = `<div style="width:70px; height:70px; margin: 0 auto 12px auto; background: var(--bg-main); border-radius: 50%; border: 1.5px solid var(--border-color); overflow:hidden;">${getAvatarSvg(staffObj.id, staffObj.name)}</div>`;
            }

            viewDetailsBody.innerHTML = `
                ${imgHtml}
                <div class="detail-row">
                    <span class="detail-label">Mã nhân viên:</span>
                    <span class="detail-val">${staffObj.id}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Họ và tên:</span>
                    <span class="detail-val" style="color: var(--accent-red);">${staffObj.name}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Tài khoản:</span>
                    <span class="detail-val" style="font-weight: 600; color: #1E293B;">${staffObj.username || '---'}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Vai trò:</span>
                    <span class="detail-val">
                        <span class="role-badge ${getRoleBadgeClass(staffObj.role)}">
                            ${ROLE_ICONS[staffObj.role]}
                            ${staffObj.role}
                        </span>
                    </span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Trạng thái:</span>
                    <span class="detail-val">
                        <span class="status-badge ${staffObj.status === 'Hoạt động' ? 'active' : 'inactive'}">
                            <span class="status-dot"></span>
                            ${staffObj.status}
                        </span>
                    </span>
                </div>
            `;
            viewStaffModal.classList.remove('hidden');
        } 
        else if (btn.classList.contains('edit')) {
            showModal('Chỉnh sửa thông tin nhân viên', true, staffObj);
        } 
        else if (btn.classList.contains('delete')) {
            deleteTargetId = id;
            deleteTargetName.textContent = staffObj.name;
            deleteConfirmModal.classList.remove('hidden');
        }
    });

    // Xử lý đổi mật khẩu nhanh qua Form
    const editPasswordModal = document.getElementById('editPasswordModal');
    const editPasswordForm = document.getElementById('editPasswordForm');

    if (editPasswordForm) {
        editPasswordForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const id = document.getElementById('editPassStaffId').value;
            const newPass = document.getElementById('newPasswordInput').value.trim();

            if (!id || !newPass) {
                alert('Vui lòng nhập mật khẩu mới!');
                return;
            }

            const staffObj = staffList.find(s => s.id === id);
            if (!staffObj) return;

            const updateData = {
                username: staffObj.username,
                password: newPass,
                name: staffObj.name,
                role: staffObj.role,
                status: staffObj.status,
                avatar_url: staffObj.image,
                email: staffObj.email,
                phone: staffObj.phone
            };

            fetch(`${API_BASE}/api/users/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updateData)
            })
            .then(res => res.json())
            .then(resData => {
                if (resData.status === 'success') {
                    staffObj.password = newPass;
                    editPasswordModal.classList.add('hidden');
                    fetchStaffFromBackend();
                } else {
                    alert(resData.message);
                }
            })
            .catch(err => {
                console.error(err);
                staffObj.password = newPass;
                saveStaff();
                editPasswordModal.classList.add('hidden');
                renderTable();
            });
        });

        const closeEditPassModalBtn = document.getElementById('closeEditPassModalBtn');
        const cancelEditPassBtn = document.getElementById('cancelEditPassBtn');

        if (closeEditPassModalBtn) closeEditPassModalBtn.addEventListener('click', () => editPasswordModal.classList.add('hidden'));
        if (cancelEditPassBtn) cancelEditPassBtn.addEventListener('click', () => editPasswordModal.classList.add('hidden'));

        if (editPasswordModal) {
            editPasswordModal.addEventListener('click', (e) => {
                if (e.target === editPasswordModal) editPasswordModal.classList.add('hidden');
            });
        }
    }

    document.getElementById('closeViewModalBtn').addEventListener('click', () => viewStaffModal.classList.add('hidden'));
    document.getElementById('closeViewBtn').addEventListener('click', () => viewStaffModal.classList.add('hidden'));

    document.getElementById('cancelDeleteBtn').addEventListener('click', () => {
        deleteConfirmModal.classList.add('hidden');
        deleteTargetId = null;
    });

    document.getElementById('confirmDeleteBtn').addEventListener('click', () => {
        if (deleteTargetId) {
            fetch(`${API_BASE}/api/users/${deleteTargetId}`, {
                method: 'DELETE'
            })
            .then(res => res.json())
            .then(resData => {
                fetchStaffFromBackend();
            })
            .catch(err => {
                console.error(err);
                staffList = staffList.filter(s => s.id !== deleteTargetId);
                saveStaff();
                renderTable();
            });
            deleteConfirmModal.classList.add('hidden');
            deleteTargetId = null;
        }
    });

    [staffModal, deleteConfirmModal, viewStaffModal].forEach(modalEl => {
        modalEl.addEventListener('click', (e) => {
            if (e.target === modalEl) {
                modalEl.classList.add('hidden');
                if (modalEl === deleteConfirmModal) deleteTargetId = null;
            }
        });
    });

    // ==========================================================================
    // H. PROFILE ACCOUNT SIDEBAR & HEADER
    // ==========================================================================
    function updateProfileUI(user) {
        if (!user) return;
        const sidebarUserName = document.querySelector('.user-name-text');
        const sidebarUserRole = document.querySelector('.user-role-text');
        const sidebarAvatarLetter = document.querySelector('.user-avatar-letter');
        
        const headerUserName = document.querySelector('.profile-name');
        const headerUserRole = document.querySelector('.profile-role');
        const headerAvatar = document.querySelector('.profile-avatar');

        if (sidebarUserName) sidebarUserName.textContent = user.name;
        if (sidebarUserRole) sidebarUserRole.textContent = user.role;
        if (headerUserName) headerUserName.textContent = user.name;
        if (headerUserRole) headerUserRole.textContent = user.role;

        const initials = user.name
            .split(' ')
            .map(word => word.charAt(0))
            .join('')
            .toUpperCase()
            .substring(0, 2);

        const adminAvatar = 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=80&q=80';
        const userAvatarUrl = user.avatarUrl || (user.role === 'Super Admin' ? adminAvatar : '');

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

    if (activeUser) {
        updateProfileUI(activeUser);
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

    fetchStaffFromBackend();
});
