document.addEventListener('DOMContentLoaded', () => {
    const applyToSelect = document.getElementById('voucherApplyTo');
    if (applyToSelect) {
        applyToSelect.addEventListener('change', (e) => {
            const val = e.target.value;
            const container = document.getElementById('voucherApplyValueContainer');
            if (val === 'brand' || val === 'product') {
                container.style.display = 'block';
            } else {
                container.style.display = 'none';
            }
        });
    }
});

/* Techno Admin Dashboard - Logic Quản lý Voucher & Chỉnh sửa Profile */

window.addEventListener('load', () => {
    let activeUser = JSON.parse(localStorage.getItem('sessionActiveUser'));
    
    // 1. KHỞI TẠO DỮ LIỆU MẪU LƯU LOCALSTORAGE (MOCKUP VIẾT TAY 100%)
    const DEFAULT_VOUCHERS = [
        { code: 'A88', campaign: 'Sinh nhật', description: 'Giảm 20% cho CPU', duration: '23/06 - 26/06', limit: 3, used: 1, status: 'running' },
        { code: 'A44', campaign: '8/3', description: 'Giảm 30% cho RAM & SSD', duration: '08/03 - 09/03', limit: 100, used: 4, status: 'ended' },
        { code: 'L03', campaign: '30/4 - 1/5', description: 'Giảm 30% cho tất cả sản phẩm', duration: '30/04 - 01/05', limit: 200, used: 30, status: 'ended' },
        { code: 'X33', campaign: 'Tết MSI', description: 'Giảm 10% cho SP MSI', duration: '11/01 - 30/01', limit: 100, used: 11, status: 'ended' },
        { code: 'B884', campaign: 'ASUS đại hạ giá', description: 'Giảm 10% cho SP ASUS', duration: '11/07 - 30/07', limit: 100, used: 11, status: 'running' },
        { code: 'G63', campaign: 'Gigabyte bùng nổ', description: 'Giảm 10% cho SP Gigabyte', duration: '11/07 - 30/07', limit: 100, used: 30, status: 'running' },
        { code: 'OL3', campaign: 'Build PC combo', description: 'Giảm 10% khi build PC, max 300k', duration: '01/10 - 30/12', limit: 200, used: 40, status: 'running' },
        { code: 'OK4', campaign: 'Build PC', description: 'Giảm 10% tổng hóa đơn', duration: '01/07 - 10/07', limit: 20, used: 10, status: 'running' }
    ];

    if (!localStorage.getItem('vouchers')) {
        localStorage.setItem('vouchers', JSON.stringify(DEFAULT_VOUCHERS));
    }

    let voucherList = JSON.parse(localStorage.getItem('vouchers'));

        // Tải dữ liệu 2 chiều từ MySQL Backend và hợp nhất thông minh (Smart Merge)
    fetch('/api/vouchers')
        .then(res => res.json())
        .then(resData => {
            if (resData.status === 'success' && resData.data && resData.data.length > 0) {
                const mysqlVouchers = resData.data.map(v => ({
                    code: v.code,
                    campaign: 'Chiến dịch ' + v.code,
                    description: 'Giảm giá ' + v.discount_value + (v.discount_type === 'percent' ? '%' : 'đ'),
                    duration: '01/08 - 01/09',
                    limit: v.usage_limit || 100,
                    used: v.used_count || 0,
                    status: v.status === 'Hoạt động' ? 'running' : 'ended',
                    apply_to: v.apply_to || 'all',
                    apply_value: v.apply_value || ''
                }));
                const localVouchers = JSON.parse(localStorage.getItem('vouchers')) || [];

                const voucherMap = {};
                localVouchers.forEach(v => { if (v && v.code) voucherMap[v.code] = v; });
                mysqlVouchers.forEach(v => { if (v && v.code) voucherMap[v.code] = v; });

                voucherList = Object.values(voucherMap);
                localStorage.setItem('vouchers', JSON.stringify(voucherList));
                filteredVouchers = [...voucherList];
                renderVoucherTable();

                localVouchers.forEach(v => {
                    fetch('/api/vouchers', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            id: 'VCH_' + v.code,
                            code: v.code,
                            discount_type: 'percent',
                            discount_value: 10,
                            min_order: 1000000,
                            max_discount: 2000000,
                            usage_limit: v.limit || 100,
                            used_count: v.used || 0,
                            status: v.status === 'running' ? 'Hoạt động' : 'Kết thúc',
                            apply_to: v.apply_to || 'all',
                            apply_value: v.apply_value || ''
                        })
                    }).catch(err => console.error('[POST VOUCHER SYNC ERROR]', err));
                });
            }
        }).catch(err => console.error('[MYSQL 2-WAY VOUCHER SYNC ERROR]', err));


    // Tự động đồng bộ toàn bộ voucher vào CSDL MySQL khi tải trang
    if (voucherList && voucherList.length > 0) {
        voucherList.forEach(v => {
            fetch('/api/vouchers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: 'VCH_' + v.code,
                    code: v.code,
                    discount_type: 'percent',
                    discount_value: 10,
                    min_order: 1000000,
                    max_discount: 2000000,
                    usage_limit: v.limit || 100,
                    used_count: v.used || 0,
                    status: v.status === 'running' ? 'Hoạt động' : 'Kết thúc',
                    apply_to: v.apply_to || 'all',
                    apply_value: v.apply_value || ''
                })
            }).catch(err => console.error('[AUTO VOUCHER SYNC ERROR]', err));
        });
    }

    let filteredVouchers = [...voucherList];

    let currentPage = 1;
    let perPage = 10; // Mặc định hiển thị 10 dòng/trang để lấp đầy khung

    // Trạng thái hiển thị text tiếng Việt
    const statusMap = {
        running: { text: 'Đang chạy', class: 'running' },
        ended: { text: 'Kết thúc', class: 'ended' },
        cancelled: { text: 'Đã hủy', class: 'cancelled' }
    };

    // ==========================================================================
    // 2. HIỂN THỊ BẢNG VOUCHER PHÂN TRANG ĐỘNG
    // ==========================================================================
    function renderVoucherTable() {
        const body = document.getElementById('voucherTableBody');
        if (!body) return;

        body.innerHTML = '';

        const startIndex = (currentPage - 1) * perPage;
        const endIndex = Math.min(startIndex + perPage, filteredVouchers.length);
        const paginatedData = filteredVouchers.slice(startIndex, endIndex);

        if (paginatedData.length === 0) {
            body.innerHTML = `<tr><td colspan="7" class="text-center" style="padding: 24px; color: var(--text-muted); text-align: center;">Không tìm thấy dữ liệu voucher!</td></tr>`;
            return;
        }

        paginatedData.forEach((voucher) => {
            const originalIndex = voucherList.findIndex(v => v.code === voucher.code);

            const tr = document.createElement('tr');
            const st = statusMap[voucher.status] || { text: 'Không rõ', class: 'cancelled' };

            tr.innerHTML = `
                <td class="bold text-red-code">${voucher.code}</td>
                <td class="bold" style="color: var(--text-dark);">${voucher.campaign}</td>
                <td style="color: var(--text-body); font-weight: 500;">${voucher.description}</td>
                <td style="color: var(--text-muted); font-size: 12px;">${voucher.duration}</td>
                <td class="bold" style="text-align: center; color: var(--text-dark);">${voucher.used}/${voucher.limit}</td>
                <td style="text-align: center;">
                    <span class="status-badge ${st.class}">${st.text}</span>
                </td>
                <td style="text-align: center;">
                    <button class="btn-action-icon edit-btn" data-index="${originalIndex}" title="Chỉnh sửa">
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M12 20h9"></path>
                            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                        </svg>
                    </button>
                    <button class="btn-action-icon delete-btn" data-code="${voucher.code}" title="Xóa">
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                    </button>
                </td>
            `;
            body.appendChild(tr);
        });

        const summary = document.getElementById('paginationSummary');
        if (summary) {
            summary.textContent = `${filteredVouchers.length === 0 ? 0 : startIndex + 1} - ${endIndex} của ${filteredVouchers.length} voucher`;
        }

        renderPaginationControls();
        registerTableEvents();
    }

    function renderPaginationControls() {
        const controls = document.getElementById('paginationControls');
        if (!controls) return;

        controls.innerHTML = '';
        const totalPages = Math.ceil(filteredVouchers.length / perPage) || 1;

        // Nút Trước
        const prevBtn = document.createElement('button');
        prevBtn.className = `page-btn ${currentPage === 1 ? 'disabled' : ''}`;
        prevBtn.textContent = '<';
        prevBtn.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                renderVoucherTable();
            }
        });
        controls.appendChild(prevBtn);

        // Các số trang
        for (let i = 1; i <= totalPages; i++) {
            const pageBtn = document.createElement('button');
            pageBtn.className = `page-btn ${currentPage === i ? 'active' : ''}`;
            pageBtn.textContent = i;
            pageBtn.addEventListener('click', () => {
                currentPage = i;
                renderVoucherTable();
            });
            controls.appendChild(pageBtn);
        }

        // Nút Sau
        const nextBtn = document.createElement('button');
        nextBtn.className = `page-btn ${currentPage === totalPages ? 'disabled' : ''}`;
        nextBtn.textContent = '>';
        nextBtn.addEventListener('click', () => {
            if (currentPage < totalPages) {
                currentPage++;
                renderVoucherTable();
            }
        });
        controls.appendChild(nextBtn);
    }

    function registerTableEvents() {
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const idx = btn.getAttribute('data-index');
                openEditModal(idx);
            });
        });

        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const code = btn.getAttribute('data-code');
                openDeleteVoucherModal(code);
            });
        });
    }

    // ==========================================================================
    // 3. XỬ LÝ CRUD VOUCHER LƯU LOCALSTORAGE
    // ==========================================================================
        function saveToStorage() {
        localStorage.setItem('vouchers', JSON.stringify(voucherList));
        filteredVouchers = [...voucherList];
        applyFilterAndSearch();

        // Đồng bộ toàn bộ voucher sang MySQL Database
        voucherList.forEach(v => {
            fetch('/api/vouchers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: 'VCH_' + v.code,
                    code: v.code,
                    discount_type: 'percent',
                    discount_value: 10,
                    min_order: 1000000,
                    max_discount: 2000000,
                    usage_limit: v.limit || 100,
                    used_count: v.used || 0,
                    status: v.status === 'running' ? 'Hoạt động' : 'Kết thúc',
                    apply_to: v.apply_to || 'all',
                    apply_value: v.apply_value || ''
                })
            }).then(res => res.json())
              .then(data => console.log('[MYSQL VOUCHER SYNC]', v.code, data.message))
              .catch(err => console.error('[MYSQL VOUCHER SYNC ERROR]', err));
        });
    }

        
    // ==========================================================================
    // LOGIC MODAL XÁC NHẬN XÓA VOUCHER (ĐẸP GIỐNG ẢNH 2)
    // ==========================================================================
    let pendingDeleteCode = null;
    const deleteVoucherModal = document.getElementById('deleteVoucherModal');
    const deleteVoucherCodeText = document.getElementById('deleteVoucherCodeText');
    const cancelDeleteVoucherBtn = document.getElementById('cancelDeleteVoucherBtn');
    const confirmDeleteVoucherBtn = document.getElementById('confirmDeleteVoucherBtn');

    function openDeleteVoucherModal(code) {
        pendingDeleteCode = code;
        const codeTextEl = document.getElementById('deleteVoucherCodeText');
        const modalEl = document.getElementById('deleteVoucherModal');
        if (codeTextEl) codeTextEl.textContent = code;
        if (modalEl) modalEl.classList.remove('hidden');
    }

    if (cancelDeleteVoucherBtn) {
        cancelDeleteVoucherBtn.addEventListener('click', () => {
            const modalEl = document.getElementById('deleteVoucherModal');
            if (modalEl) modalEl.classList.add('hidden');
            pendingDeleteCode = null;
        });
    }

    if (confirmDeleteVoucherBtn) {
        confirmDeleteVoucherBtn.addEventListener('click', () => {
            if (pendingDeleteCode) {
                deleteVoucher(pendingDeleteCode);
                const modalEl = document.getElementById('deleteVoucherModal');
                if (modalEl) modalEl.classList.add('hidden');
                pendingDeleteCode = null;
            }
        });
    }

    if (deleteVoucherModal) {
        deleteVoucherModal.addEventListener('click', (e) => {
            if (e.target === deleteVoucherModal) {
                deleteVoucherModal.classList.add('hidden');
                pendingDeleteCode = null;
            }
        });
    }


    function deleteVoucher(code) {
        voucherList = voucherList.filter(v => v.code !== code);
        saveToStorage();

        // Xóa trực tiếp khỏi CSDL MySQL Database
        fetch('/api/vouchers/VCH_' + code, { method: 'DELETE' })
            .then(res => res.json())
            .then(data => console.log('[MYSQL DELETE VOUCHER SUCCESS]', code, data.message))
            .catch(err => console.error('[MYSQL DELETE VOUCHER ERROR]', err));

        fetch('/api/vouchers/' + code, { method: 'DELETE' })
            .catch(() => {});

        showToast(`Đã xóa thành công Voucher mã ${code}!`);
    }

    // ==========================================================================
    // 4. ĐIỀU KHIỂN ĐÓNG/MỞ MODAL VOUCHER
    // ==========================================================================
    const modal = document.getElementById('voucherModal');
    const btnCreateVoucher = document.getElementById('btnCreateVoucher');
    const btnCloseModal = document.getElementById('btnCloseModal');
    const btnCancelModal = document.getElementById('btnCancelModal');
    const btnSaveVoucher = document.getElementById('btnSaveVoucher');

    function openCreateModal() {
        document.getElementById('modalTitle').textContent = 'Tạo Voucher Mới';
        document.getElementById('editIndex').value = '';
        
        document.getElementById('voucherCode').value = '';
        document.getElementById('voucherCode').readOnly = false;
        document.getElementById('voucherCampaign').value = '';
        document.getElementById('voucherDesc').value = '';
        if(document.getElementById('voucherApplyTo')) document.getElementById('voucherApplyTo').value = 'all';
        if(document.getElementById('voucherApplyValue')) document.getElementById('voucherApplyValue').value = '';
        if(document.getElementById('voucherApplyValueContainer')) document.getElementById('voucherApplyValueContainer').style.display = 'none';
        document.getElementById('voucherDuration').value = '';
        document.getElementById('voucherLimit').value = '';
        document.getElementById('voucherUsed').value = '0';
        document.getElementById('voucherStatus').value = 'running';

        modal.classList.remove('hidden');
    }

    function openEditModal(idx) {
        document.getElementById('modalTitle').textContent = 'Chỉnh sửa Voucher';
        document.getElementById('editIndex').value = idx;

        const v = voucherList[idx];
        document.getElementById('voucherCode').value = v.code;
        document.getElementById('voucherCode').readOnly = true;
        document.getElementById('voucherCampaign').value = v.campaign;
        document.getElementById('voucherDesc').value = v.description;
        if(document.getElementById('voucherApplyTo')) {
            document.getElementById('voucherApplyTo').value = v.apply_to || 'all';
            document.getElementById('voucherApplyValueContainer').style.display = (v.apply_to === 'brand' || v.apply_to === 'product') ? 'block' : 'none';
        }
        if(document.getElementById('voucherApplyValue')) document.getElementById('voucherApplyValue').value = v.apply_value || '';
        document.getElementById('voucherDuration').value = v.duration;
        document.getElementById('voucherLimit').value = v.limit;
        document.getElementById('voucherUsed').value = v.used;
        document.getElementById('voucherStatus').value = v.status;

        modal.classList.remove('hidden');
    }

    function closeModal() {
        modal.classList.add('hidden');
    }

    if (btnCreateVoucher) btnCreateVoucher.addEventListener('click', openCreateModal);
    if (btnCloseModal) btnCloseModal.addEventListener('click', closeModal);
    if (btnCancelModal) btnCancelModal.addEventListener('click', closeModal);

    // Lưu / Cập nhật Voucher
    if (btnSaveVoucher) {
        btnSaveVoucher.addEventListener('click', () => {
            const code = document.getElementById('voucherCode').value.toUpperCase().trim();
            const campaign = document.getElementById('voucherCampaign').value.trim();
            const description = document.getElementById('voucherDesc').value.trim();
            const duration = document.getElementById('voucherDuration').value.trim();
            const limit = parseInt(document.getElementById('voucherLimit').value);
            const used = parseInt(document.getElementById('voucherUsed').value) || 0;
            const status = document.getElementById('voucherStatus').value;
            const apply_to = document.getElementById('voucherApplyTo') ? document.getElementById('voucherApplyTo').value : 'all';
            const apply_value = document.getElementById('voucherApplyValue') ? document.getElementById('voucherApplyValue').value.trim() : '';
            const editIndexVal = document.getElementById('editIndex').value;

            if (!code || !campaign || !description || !duration || isNaN(limit)) {
                showToast('Vui lòng điền đầy đủ thông tin bắt buộc (*)!', 'warning');
                return;
            }

            if (editIndexVal === '') {
                if (voucherList.some(v => v.code === code)) {
                    showToast(`Mã Voucher ${code} đã tồn tại! Vui lòng nhập mã khác.`, 'error');
                    return;
                }

                voucherList.unshift({ code, campaign, description, duration, limit, used, status, apply_to, apply_value });
                showToast(`Đã tạo thành công Voucher mã ${code}!`);
            } else {
                const idx = parseInt(editIndexVal);
                voucherList[idx] = { code, campaign, description, duration, limit, used, status, apply_to, apply_value };
                showToast(`Đã cập nhật thành công Voucher mã ${code}!`);
            }

            saveToStorage();
            closeModal();
        });
    }

    // ==========================================================================
    // 5. ĐIỀU KHIỂN MODAL CHỈNH SỬA PROFILE ADMIN
    // ==========================================================================
    // 5. ĐIỀU KHIỂN MODAL CHỈNH SỬA PROFILE ADMIN
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
                showToast('Vui lòng điền họ và tên!', 'warning');
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

    // ==========================================================================
    // 6. LỌC VÀ TÌM KIẾM VOUCHER
    // ==========================================================================
    const voucherSearchInput = document.getElementById('voucherSearchInput');
    
    function applyFilterAndSearch() {
        const query = voucherSearchInput ? voucherSearchInput.value.toLowerCase().trim() : '';

        filteredVouchers = voucherList.filter(v => 
            v.code.toLowerCase().includes(query) ||
            v.campaign.toLowerCase().includes(query) ||
            v.description.toLowerCase().includes(query)
        );

        currentPage = 1;
        renderVoucherTable();
    }

    if (voucherSearchInput) {
        voucherSearchInput.addEventListener('input', applyFilterAndSearch);
    }

    const perPageSelect = document.getElementById('perPageSelect');
    if (perPageSelect) {
        perPageSelect.addEventListener('change', (e) => {
            perPage = parseInt(e.target.value);
            currentPage = 1;
            renderVoucherTable();
        });
    }

    // ==========================================================================
    // 7. TOAST NOTIFICATION PHÁT SÁNG
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

    // ==========================================================================
    // 8. ĐỒNG BỘ ACCOUNT TRÊN SIDEBAR & HEADER
    // ==========================================================================
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

    // Cập nhật UI lần đầu
    updateProfileUI();

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

    // Dropdown Thông báo
    // (Handled globally by auth_guard.js)

    // KHỞI CHẠY LẦN ĐẦU
    renderVoucherTable();
});


    function saveVouchersToLocalStorage() {
        localStorage.setItem('pcpos_vouchers', JSON.stringify(vouchers));

        // Đồng bộ voucher sang MySQL Database
        vouchers.forEach(v => {
            fetch('/api/vouchers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(v)
            }).then(res => res.json())
              .then(data => console.log('[MYSQL VOUCHER SYNC]', v.code, data.message))
              .catch(err => console.error('[MYSQL VOUCHER SYNC ERROR]', err));
        });
    }
