/* Techno Admin Dashboard - Logic Báo cáo doanh thu chuẩn Mockup dùng thư viện Chart.js */

window.addEventListener('load', () => {
    // 1. DỮ LIỆU ĐẦY ĐỦ CHO CÁC PHÂN HỆ LỌC (NGÀY, TUẦN, THÁNG)
    const REVENUE_DATASET = {
        day: {
            labels: ['08/05', '09/05', '10/05', '11/05', '12/05', '13/05', '14/05', '15/05'],
            revenue: [200000000, 300000000, 250000000, 400000000, 350000000, 450000000, 400000000, 500000000],
            orders: [10, 15, 12, 20, 18, 23, 20, 25],
            customers: [8, 12, 10, 15, 14, 18, 16, 20],
            avgOrder: [20000000, 20000000, 20830000, 20000000, 19440000, 19560000, 20000000, 20000000]
        },
        week: {
            labels: ['Tuần 1', 'Tuần 2', 'Tuần 3', 'Tuần 4'],
            revenue: [450000000, 680000000, 520000000, 800000000],
            orders: [22, 35, 28, 43],
            customers: [18, 26, 22, 32],
            avgOrder: [20450000, 19420000, 18570000, 18600000]
        },
        month: {
            labels: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6'],
            revenue: [1200000000, 1500000000, 1800000000, 1400000000, 2450000000, 2100000000],
            orders: [60, 78, 92, 70, 128, 110],
            customers: [45, 60, 72, 55, 98, 85],
            avgOrder: [20000000, 19230000, 19565000, 20000000, 19140000, 19090000]
        }
    };

    // Điểm dữ liệu để vẽ Sparkline
    const SPARKLINE_POINTS = {
        revenue: [15, 18, 14, 22, 20, 25, 28, 26, 32, 30],
        orders: [10, 12, 11, 14, 13, 16, 15, 14, 18, 17],
        customers: [8, 9, 8.5, 10, 9.5, 11, 10.5, 10, 12, 11.5],
        avgOrder: [12, 13, 12.5, 14, 13.5, 15, 14.5, 14, 16, 15.5]
    };

    // Dữ liệu cho Biểu đồ 2: Doanh thu & Hiệu suất theo giờ
    const HOUR_BAR_LINE_DATA = {
        labels: ['7:00', '8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'],
        revenue: [100000000, 160000000, 200000000, 350000000, 400000000, 450000000, 500000000, 350000000, 400000000, 200000000],
        rate: [40, 42, 48, 45, 38, 43, 48, 46, 55, 62]
    };

    // Dữ liệu cho Donut Chart cơ cấu danh mục
    const DONUT_CATEGORIES = [
        { label: 'VGA', value: 950000000, percent: '38.8%', color: '#E11D48' },
        { label: 'CPU', value: 600000000, percent: '24.5%', color: '#1E293B' },
        { label: 'RAM', value: 350000000, percent: '14.3%', color: '#3B82F6' },
        { label: 'Mainboard', value: 300000000, percent: '12.2%', color: '#64748B' },
        { label: 'SSD', value: 150000000, percent: '6.1%', color: '#93C5FD' },
        { label: 'Nguồn', value: 100000000, percent: '4.1%', color: '#94A3B8' },
        { label: 'Vỏ case', value: 50000000, percent: '2.0%', color: '#CBD5E1' }
    ];

    // Dữ liệu cho Bảng doanh thu chi tiết (Danh sách hóa đơn)
    const INVOICE_LIST = [
        { id: 'HD2545', time: '15/05/2025 14:30', product: 'RTX 4090 24GB', category: 'VGA', value: 59990000, staff: 'Nam Em', method: 'Chuyển khoản', status: 'paid', statusText: 'Đã thanh toán' },
        { id: 'HD2544', time: '15/05/2025 13:15', product: 'Intel i7-14700KF', category: 'CPU', value: 10990000, staff: 'Trần Ngọc', method: 'COD', status: 'shipping', statusText: 'Đã giao hàng' },
        { id: 'HD2543', time: '15/05/2025 11:45', product: 'RAM Corsair 32GB', category: 'RAM', value: 4290000, staff: 'Hoàng Long', method: 'Chuyển khoản', status: 'paid', statusText: 'Đã thanh toán' },
        { id: 'HD2542', time: '15/05/2025 10:20', product: 'Mainboard B760M', category: 'Mainboard', value: 4890000, staff: 'Vũ Anh Tuấn', method: 'MOMO', status: 'paid', statusText: 'Đã thanh toán' },
        { id: 'HD2541', time: '15/05/2025 09:05', product: 'SSD Samsung 990 Pro 1TB', category: 'SSD', value: 2690000, staff: 'Lê Minh Đức', method: 'Chuyển khoản', status: 'pending', statusText: 'Đang xử lý' },
        
        { id: 'HD2540', time: '14/05/2025 16:40', product: 'RTX 4060 Ti 8GB', category: 'VGA', value: 11200000, staff: 'Nam Em', method: 'MOMO', status: 'paid', statusText: 'Đã thanh toán' },
        { id: 'HD2539', time: '14/05/2025 15:10', product: 'AMD Ryzen 5 7600', category: 'CPU', value: 5890000, staff: 'Trần Ngọc', method: 'Chuyển khoản', status: 'paid', statusText: 'Đã thanh toán' },
        { id: 'HD2538', time: '14/05/2025 11:20', product: 'Nguồn Antec 750W', category: 'Nguồn', value: 1890000, staff: 'Vũ Anh Tuấn', method: 'COD', status: 'shipping', statusText: 'Đã giao hàng' },
        { id: 'HD2537', time: '14/05/2025 10:05', product: 'Vỏ Case PC LED RGB', category: 'Vỏ case', value: 1200000, staff: 'Hoàng Long', method: 'Chuyển khoản', status: 'paid', statusText: 'Đã thanh toán' },
        { id: 'HD2536', time: '14/05/2025 09:15', product: 'Intel Core i9-14900K', category: 'CPU', value: 14890000, staff: 'Lê Minh Đức', method: 'Chuyển khoản', status: 'pending', statusText: 'Đang xử lý' },

        { id: 'HD2535', time: '13/05/2025 17:30', product: 'RTX 4070 Super 12GB', category: 'VGA', value: 18990000, staff: 'Nam Em', method: 'Chuyển khoản', status: 'paid', statusText: 'Đã thanh toán' },
        { id: 'HD2534', time: '13/05/2025 15:45', product: 'RAM Kingston Fury 16GB', category: 'RAM', value: 1890000, staff: 'Trần Ngọc', method: 'MOMO', status: 'paid', statusText: 'Đã thanh toán' },
        { id: 'HD2533', time: '13/05/2025 14:00', product: 'SSD WD Blue 500GB', category: 'SSD', value: 1150000, staff: 'Vũ Anh Tuấn', method: 'COD', status: 'shipping', statusText: 'Đã giao hàng' },
        { id: 'HD2532', time: '13/05/2025 10:30', product: 'Mainboard H610M', category: 'Mainboard', value: 2190000, staff: 'Hoàng Long', method: 'Chuyển khoản', status: 'paid', statusText: 'Đã thanh toán' },
        { id: 'HD2531', time: '13/05/2025 08:45', product: 'Nguồn Corsair RM850e', category: 'Nguồn', value: 3290000, staff: 'Lê Minh Đức', method: 'Chuyển khoản', status: 'paid', statusText: 'Đã thanh toán' }
    ];

    let currentPeriod = 'month'; // Mặc định hiển thị Theo tháng
    let currentPage = 1;
    let perPage = 8; // MẶC ĐỊNH LÀ 8 HÀNG TRÊN TRANG ĐỂ LẤP ĐẦY CHIỀU CAO CARD KHÔNG BỊ TRỐNG LƯNG CHỪNG VÀ KHÔNG BỊ CON LĂN
    
    let filteredInvoices = [...INVOICE_LIST];
    let activeRevenueDataset = JSON.parse(JSON.stringify(REVENUE_DATASET));

    // Khởi tạo các biến chứa thực thể biểu đồ Chart.js
    let revenueChartInstance = null;
    let hourChartInstance = null;
    let donutChartInstance = null;

    // ==========================================================================
    // BỘ HÀM TIỆN ÍCH ĐỊNH DẠNG TIỀN TỆ
    // ==========================================================================
    function formatMoney(num) {
        return Math.round(num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "đ";
    }

    function formatMoneyCompact(num) {
        if (num >= 1000000) {
            return (num / 1000000).toLocaleString('vi-VN', { maximumFractionDigits: 1 }) + " Tr";
        }
        return Math.round(num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "đ";
    }

    // ==========================================================================
    // CẬP NHẬT ĐỒNG BỘ 4 THẺ KPI CHỈ SỐ NHANH BẰNG HIỆU ỨNG CHẠY SỐ (COUNT-UP)
    // ==========================================================================
    function animateCountUp(elementId, targetValue, isMoney = false) {
        const el = document.getElementById(elementId);
        if (!el) return;

        const duration = 1200; // 1.2 giây
        const startTime = performance.now();
        const startValue = 0;

        function update(currentTime) {
            const elapsedTime = currentTime - startTime;
            if (elapsedTime >= duration) {
                el.textContent = isMoney ? formatMoney(targetValue) : targetValue.toLocaleString('vi-VN');
                return;
            }

            const progress = elapsedTime / duration;
            const easeProgress = progress * (2 - progress); // easeOutQuad
            const currentValue = Math.floor(startValue + easeProgress * (targetValue - startValue));

            el.textContent = isMoney ? formatMoney(currentValue) : currentValue.toLocaleString('vi-VN');
            requestAnimationFrame(update);
        }

        requestAnimationFrame(update);
    }

    function updateKPICards() {
        const periodData = activeRevenueDataset[currentPeriod];
        const totalRevenue = periodData.revenue.reduce((sum, val) => sum + val, 0);
        const totalOrders = periodData.orders.reduce((sum, val) => sum + val, 0);
        const totalCustomers = periodData.customers.reduce((sum, val) => sum + val, 0);
        const avgOrder = totalOrders > 0 ? (totalRevenue / totalOrders) : 0;

        animateCountUp('kpiTotalRevenue', totalRevenue, true);
        animateCountUp('kpiTotalOrders', totalOrders, false);
        animateCountUp('kpiTotalCustomers', totalCustomers, false);
        animateCountUp('kpiAvgOrderValue', avgOrder, true);

        const donutTotalText = document.getElementById('donutTotalText');
        if (donutTotalText) animateCountUp('donutTotalText', totalRevenue, true);
    }

    // ==========================================================================
    // 2. VẼ MINI SPARKLINE TRONG CÁC THẺ KPI (BẢN VẼ TAY THUẦN RẤT SẮC NÉT)
    // ==========================================================================
    function drawSparkline(canvasId, points, color, isRedBg = false) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);

        const w = rect.width;
        const h = rect.height;
        ctx.clearRect(0, 0, w, h);

        if (points.length < 2) return;

        const maxVal = Math.max(...points);
        const minVal = Math.min(...points);
        const range = maxVal - minVal || 1;
        const stepX = w / (points.length - 1);

        // Vùng mờ dưới line
        ctx.beginPath();
        points.forEach((val, idx) => {
            const x = idx * stepX;
            const ratio = (val - minVal) / range;
            const y = h - 3 - ratio * (h - 8);
            if (idx === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        ctx.lineTo(w, h);
        ctx.lineTo(0, h);
        ctx.closePath();

        const grad = ctx.createLinearGradient(0, 0, 0, h);
        if (isRedBg) {
            grad.addColorStop(0, 'rgba(255, 255, 255, 0.22)');
            grad.addColorStop(1, 'rgba(255, 255, 255, 0.00)');
        } else {
            grad.addColorStop(0, color.replace(', 1)', ', 0.12)'));
            grad.addColorStop(1, color.replace(', 1)', ', 0.00)'));
        }
        ctx.fillStyle = grad;
        ctx.fill();

        // Đường Line viền
        ctx.beginPath();
        ctx.lineWidth = 1.8;
        ctx.strokeStyle = color;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        points.forEach((val, idx) => {
            const x = idx * stepX;
            const ratio = (val - minVal) / range;
            const y = h - 3 - ratio * (h - 8);
            if (idx === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        ctx.stroke();
    }

    function renderSparklines() {
        drawSparkline('sparklineRevenue', SPARKLINE_POINTS.revenue, 'rgba(255, 255, 255, 1)', true);
        drawSparkline('sparklineOrders', SPARKLINE_POINTS.orders, 'rgba(225, 29, 72, 1)');
        drawSparkline('sparklineCustomers', SPARKLINE_POINTS.customers, 'rgba(59, 130, 246, 1)');
        drawSparkline('sparklineAvgOrder', SPARKLINE_POINTS.avgOrder, 'rgba(16, 185, 129, 1)');
    }

    // ==========================================================================
    // 3. BIỂU ĐỒ 1: DOANH THU THEO THỜI GIAN (DÙNG THƯ VIỆN CHART.JS ANIME MƯỢT MÀ)
    // ==========================================================================
    function renderLineRevenueChart() {
        const canvas = document.getElementById('lineRevenueChart');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        // Bóc tách dữ liệu
        const activeSet = activeRevenueDataset[currentPeriod];
        const labels = activeSet.labels;
        const revenue = activeSet.revenue;

        // Tạo dải Gradient đỏ
        const gradient = ctx.createLinearGradient(0, 0, 0, 230);
        gradient.addColorStop(0, 'rgba(225, 29, 72, 0.22)');
        gradient.addColorStop(1, 'rgba(225, 29, 72, 0.00)');

        // Hủy biểu đồ cũ nếu đã tồn tại để chống lỗi đè canvas
        if (revenueChartInstance) {
            revenueChartInstance.destroy();
        }

        // Tạo thực thể Chart.js mới
        revenueChartInstance = new Chart(canvas, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Doanh thu',
                    data: revenue,
                    borderColor: '#E11D48',
                    borderWidth: 2.5,
                    backgroundColor: gradient,
                    fill: true,
                    tension: 0.4, // Bezier uốn lượn mượt mà
                    pointBackgroundColor: '#FFFFFF',
                    pointBorderColor: '#E11D48',
                    pointBorderWidth: 2,
                    pointRadius: 4.5,
                    pointHoverRadius: 6.5
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: {
                    duration: 1200,
                    easing: 'easeOutQuart'
                },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: 'rgba(15, 23, 42, 0.95)',
                        titleFont: { family: 'Inter', size: 12, weight: '700' },
                        bodyFont: { family: 'Inter', size: 12 },
                        padding: 10,
                        cornerRadius: 8,
                        displayColors: false,
                        callbacks: {
                            label: function(context) {
                                return 'Doanh thu: ' + formatMoney(context.raw);
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        grid: {
                            color: '#F1F5F9',
                            tickBorderDash: [4, 4],
                            drawTicks: false
                        },
                        border: { dash: [4, 4] },
                        ticks: {
                            font: { family: 'Inter', size: 10, weight: '500' },
                            color: '#94A3B8',
                            callback: function(value) {
                                return formatMoneyCompact(value);
                            }
                        }
                    },
                    x: {
                        grid: { display: false },
                        ticks: {
                            font: { family: 'Inter', size: 10, weight: '500' },
                            color: '#94A3B8'
                        }
                    }
                }
            }
        });
    }

    // ==========================================================================
    // 4. BIỂU ĐỒ 2: DOANH THU & HIỆU SUẤT THEO KHUNG GIỜ (CHART.JS DUAL Y-AXIS)
    // ==========================================================================
    function renderBarLineHourChart() {
        const canvas = document.getElementById('barLineHourChart');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        const labels = HOUR_BAR_LINE_DATA.labels;
        const revenue = HOUR_BAR_LINE_DATA.revenue;
        const rates = HOUR_BAR_LINE_DATA.rate;

        // Tạo dải Gradient cột
        const barGrad = ctx.createLinearGradient(0, 0, 0, 230);
        barGrad.addColorStop(0, '#E11D48');
        barGrad.addColorStop(1, '#FDA4AF');

        if (hourChartInstance) {
            hourChartInstance.destroy();
        }

        hourChartInstance = new Chart(canvas, {
            data: {
                labels: labels,
                datasets: [
                    {
                        type: 'bar',
                        label: 'Doanh thu (VND)',
                        data: revenue,
                        backgroundColor: barGrad,
                        borderRadius: 4,
                        borderSkipped: 'bottom',
                        yAxisID: 'y'
                    },
                    {
                        type: 'line',
                        label: 'Tỷ lệ (%)',
                        data: rates,
                        borderColor: '#1E293B',
                        borderWidth: 2,
                        backgroundColor: 'transparent',
                        fill: false,
                        tension: 0.4,
                        pointBackgroundColor: '#1E293B',
                        pointBorderColor: '#FFFFFF',
                        pointBorderWidth: 1.5,
                        pointRadius: 4,
                        yAxisID: 'y1'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: {
                    duration: 1200,
                    easing: 'easeOutQuart'
                },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: 'rgba(15, 23, 42, 0.95)',
                        titleFont: { family: 'Inter', size: 12, weight: '700' },
                        bodyFont: { family: 'Inter', size: 12 },
                        padding: 10,
                        cornerRadius: 8,
                        callbacks: {
                            label: function(context) {
                                if (context.datasetIndex === 0) {
                                    return 'Doanh thu: ' + formatMoney(context.raw);
                                }
                                return 'Hiệu suất: ' + context.raw + '%';
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        position: 'left',
                        grid: {
                            color: '#F1F5F9',
                            tickBorderDash: [4, 4],
                            drawTicks: false
                        },
                        border: { dash: [4, 4] },
                        ticks: {
                            font: { family: 'Inter', size: 10, weight: '500' },
                            color: '#94A3B8',
                            callback: function(value) {
                                return formatMoneyCompact(value);
                            }
                        }
                    },
                    y1: {
                        position: 'right',
                        grid: { display: false },
                        min: 0,
                        max: 100,
                        ticks: {
                            font: { family: 'Inter', size: 10, weight: '500' },
                            color: '#94A3B8',
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    },
                    x: {
                        grid: { display: false },
                        ticks: {
                            font: { family: 'Inter', size: 10, weight: '500' },
                            color: '#94A3B8',
                            autoSkip: true,
                            maxTicksLimit: 5 // Tự động giãn đều chỉ hiển thị 5 mốc để tuyệt đối không bị đè chữ
                        }
                    }
                }
            }
        });
    }

    // ==========================================================================
    // 5. BIỂU ĐỒ 3: DOUGHNUT CHART CƠ CẤU DANH MỤC (CHART.JS DOUGHNUT)
    // ==========================================================================
    function renderDonutChart() {
        const canvas = document.getElementById('donutCategoryChart');
        if (!canvas) return;

        // Trích xuất mảng màu và giá trị
        const dataValues = DONUT_CATEGORIES.map(c => c.value);
        const dataLabels = DONUT_CATEGORIES.map(c => c.label);
        const dataColors = DONUT_CATEGORIES.map(c => c.color);

        if (donutChartInstance) {
            donutChartInstance.destroy();
        }

        donutChartInstance = new Chart(canvas, {
            type: 'doughnut',
            data: {
                labels: dataLabels,
                datasets: [{
                    data: dataValues,
                    backgroundColor: dataColors,
                    borderWidth: 1.5,
                    borderColor: '#FFFFFF'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '65%', // Tỷ lệ lòng khuyên trong suốt
                animation: {
                    duration: 1200,
                    animateRotate: true,
                    animateScale: true,
                    easing: 'easeOutQuart'
                },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: 'rgba(15, 23, 42, 0.95)',
                        callbacks: {
                            label: function(context) {
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((context.raw / total) * 100).toFixed(1) + '%';
                                return context.label + ': ' + formatMoney(context.raw) + ' (' + percentage + ')';
                            }
                        }
                    }
                }
            }
        });

        // Vẽ danh sách Legend ở cột bên cạnh bằng mã HTML
        const legendContainer = document.getElementById('donutLegendList');
        if (legendContainer) {
            legendContainer.innerHTML = '';
            DONUT_CATEGORIES.forEach(item => {
                const row = document.createElement('div');
                row.className = 'donut-legend-row';
                row.innerHTML = `
                    <span class="donut-legend-label">
                        <span class="donut-legend-dot" style="background-color: ${item.color};"></span>
                        ${item.label}
                    </span>
                    <span class="donut-legend-values">
                        ${formatMoneyCompact(item.value)}
                        <span class="donut-legend-percent">(${item.percent})</span>
                    </span>
                `;
                legendContainer.appendChild(row);
            });
        }
    }

    // ==========================================================================
    // 6. BẢNG DOANH THU CHI TIẾT ĐỘNG
    // ==========================================================================
    function renderInvoiceTable() {
        const body = document.getElementById('invoiceTableBody');
        if (!body) return;

        body.innerHTML = '';

        const startIndex = (currentPage - 1) * perPage;
        const endIndex = Math.min(startIndex + perPage, filteredInvoices.length);
        const paginatedData = filteredInvoices.slice(startIndex, endIndex);

        if (paginatedData.length === 0) {
            body.innerHTML = `<tr><td colspan="8" class="text-center" style="padding: 24px; color: var(--text-muted); text-align: center;">Không tìm thấy dữ liệu hóa đơn!</td></tr>`;
            return;
        }

        paginatedData.forEach(inv => {
            const tr = document.createElement('tr');
            
            let badgeClass = 'pending';
            if (inv.status === 'paid') badgeClass = 'paid';
            else if (inv.status === 'shipping') badgeClass = 'shipping';

            tr.innerHTML = `
                <td class="bold text-red-bill">${inv.id}</td>
                <td style="color: var(--text-muted);">${inv.time}</td>
                <td class="bold" style="color: var(--text-dark);">${inv.product}</td>
                <td><span style="font-size: 11.5px; font-weight: 500; color: var(--text-muted);">${inv.category}</span></td>
                <td class="bold" style="text-align: right; color: var(--text-dark);">${formatMoney(inv.value)}</td>
                <td>${inv.staff}</td>
                <td>${inv.method}</td>
                <td style="text-align: center;">
                    <span class="status-badge ${badgeClass}">${inv.statusText}</span>
                </td>
            `;
            body.appendChild(tr);
        });

        // Cập nhật text số trang dưới chân
        const summary = document.getElementById('paginationSummary');
        if (summary) {
            summary.textContent = `${filteredInvoices.length === 0 ? 0 : startIndex + 1} - ${endIndex} của ${filteredInvoices.length} đơn hàng`;
        }

        renderPaginationControls();
    }

    function renderPaginationControls() {
        const controls = document.getElementById('paginationControls');
        if (!controls) return;

        controls.innerHTML = '';
        const totalPages = Math.ceil(filteredInvoices.length / perPage) || 1;

        // Nút Trước
        const prevBtn = document.createElement('button');
        prevBtn.className = `page-btn ${currentPage === 1 ? 'disabled' : ''}`;
        prevBtn.textContent = '<';
        prevBtn.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                renderInvoiceTable();
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
                renderInvoiceTable();
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
                renderInvoiceTable();
            }
        });
        controls.appendChild(nextBtn);
    }

    // ==========================================================================
    // 7. LẮNG NGHE CHU KỲ & TƯƠNG TÁC TÌM KIẾM ĐỘNG LỌC TOÀN TRANG
    // ==========================================================================
    const selectRevenuePeriod = document.getElementById('selectRevenuePeriod');
    if (selectRevenuePeriod) {
        selectRevenuePeriod.addEventListener('change', (e) => {
            currentPeriod = e.target.value;
            updateKPICards();
            renderLineRevenueChart();
        });
    }

    const periodButtons = document.querySelectorAll('.time-btn');
    periodButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            periodButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const selectedTime = btn.getAttribute('data-time');
            if (selectedTime === 'day') currentPeriod = 'day';
            else if (selectedTime === 'week') currentPeriod = 'week';
            else currentPeriod = 'month';

            if (selectRevenuePeriod) selectRevenuePeriod.value = currentPeriod;

            updateKPICards();
            renderLineRevenueChart();
        });
    });

    const staffSearchInput = document.getElementById('staffSearchInput');
    if (staffSearchInput) {
        staffSearchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            
            // Lọc hóa đơn bảng dưới
            filteredInvoices = INVOICE_LIST.filter(inv => 
                inv.id.toLowerCase().includes(query) ||
                inv.product.toLowerCase().includes(query) ||
                inv.staff.toLowerCase().includes(query) ||
                inv.category.toLowerCase().includes(query)
            );
            
            // Lọc hiệu ứng scale biểu đồ
            let scaleFactor = 1.0;
            if (query !== '') {
                if (query.includes('nam em') || query.includes('nam')) scaleFactor = 0.38;
                else if (query.includes('ngọc') || query.includes('trần')) scaleFactor = 0.28;
                else if (query.includes('long') || query.includes('hoàng')) scaleFactor = 0.16;
                else if (query.includes('tuấn') || query.includes('vũ')) scaleFactor = 0.12;
                else if (query.includes('đức') || query.includes('lê')) scaleFactor = 0.06;
                else scaleFactor = 0.08;
            }

            activeRevenueDataset = JSON.parse(JSON.stringify(REVENUE_DATASET));
            for (let per in activeRevenueDataset) {
                activeRevenueDataset[per].revenue = REVENUE_DATASET[per].revenue.map(val => val * scaleFactor);
                activeRevenueDataset[per].orders = REVENUE_DATASET[per].orders.map(val => Math.ceil(val * scaleFactor));
                activeRevenueDataset[per].customers = REVENUE_DATASET[per].customers.map(val => Math.ceil(val * scaleFactor));
            }

            currentPage = 1;
            updateKPICards();
            renderLineRevenueChart();
            renderInvoiceTable();
        });
    }

    // ==========================================================================
    // 8. XUẤT CSV OFFLINE & TOAST NOTIFICATION
    // ==========================================================================
    function downloadCSV() {
        let csvContent = "\ufeffMã đơn,Thời gian,Sản phẩm,Danh mục,Giá trị,Nhân viên,Phương thức,Trạng thái\n";
        INVOICE_LIST.forEach(inv => {
            csvContent += `"${inv.id}","${inv.time}","${inv.product}","${inv.category}",${inv.value},"${inv.staff}","${inv.method}","${inv.statusText}"\n`;
        });
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", "bao_cao_doanh_thu_techno.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    const btnExportReport = document.getElementById('btnExportReport');
    if (btnExportReport) {
        btnExportReport.addEventListener('click', () => {
            showToast('Bắt đầu tải xuống báo cáo CSV...');
            downloadCSV();
        });
    }

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
    // 9. ĐỒNG BỘ ACCOUNT TRÊN SIDEBAR
    // ==========================================================================
    const activeUser = JSON.parse(localStorage.getItem('sessionActiveUser'));
    if (activeUser) {
        updateUIProfile(activeUser);
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

    // KHỞI CHẠY BẢN VẼ BAN ĐẦU
    updateKPICards();
    renderSparklines();
    renderLineRevenueChart();
    renderBarLineHourChart();
    renderDonutChart();
    renderInvoiceTable();
    
    const perPageSelect = document.getElementById('perPageSelect');
    if (perPageSelect) {
        perPageSelect.addEventListener('change', (e) => {
            perPage = parseInt(e.target.value);
            currentPage = 1;
            renderInvoiceTable();
        });
    }

    // ==========================================================================
    // 10. BỘ ĐIỀU KHIỂN DROPDOWN THÔNG BÁO CHUYÊN NGHIỆP
    // ==========================================================================
    // (Handled globally by auth_guard.js)

    // ==========================================================================
    // 11. BỘ ĐIỀU KHIỂN CHỈNH SỬA PROFILE
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
        const currentUser = JSON.parse(localStorage.getItem('sessionActiveUser'));
        if (!currentUser) return;
        profileInputName.value = currentUser.name;
        profileInputRole.value = currentUser.role;
        tempAvatarUrl = currentUser.avatarUrl || '';

        const initials = currentUser.name
            .split(' ')
            .map(word => word.charAt(0))
            .join('')
            .toUpperCase()
            .substring(0, 2);

        if (profileModalAvatarPlaceholder) {
            profileModalAvatarPlaceholder.textContent = initials;
        }

        if (currentUser.avatarUrl) {
            if (profileModalAvatarPreview) {
                profileModalAvatarPreview.src = currentUser.avatarUrl;
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

            const currentUser = JSON.parse(localStorage.getItem('sessionActiveUser'));
            if (currentUser) {
                currentUser.name = newName;
                currentUser.avatarUrl = tempAvatarUrl;
                localStorage.setItem('sessionActiveUser', JSON.stringify(currentUser));
                
                // Cập nhật database users
                let users = JSON.parse(localStorage.getItem('users')) || [];
                const userIdx = users.findIndex(u => u.username === currentUser.username);
                if (userIdx !== -1) {
                    users[userIdx].name = newName;
                    users[userIdx].avatarUrl = tempAvatarUrl;
                    localStorage.setItem('users', JSON.stringify(users));
                }

                // Cập nhật database nhân viên thực tế pcpos_staff
                let staffList = JSON.parse(localStorage.getItem('pcpos_staff')) || [];
                const staffIdx = staffList.findIndex(s => s.name === currentUser.name || s.username === currentUser.username);
                if (staffIdx !== -1) {
                    staffList[staffIdx].name = newName;
                    staffList[staffIdx].image = tempAvatarUrl;
                    localStorage.setItem('pcpos_staff', JSON.stringify(staffList));
                }

                // Đồng bộ MySQL Database
                const API_BASE = window.location.port === '3000' ? '' : 'http://127.0.0.1:3000';
                fetch(`${API_BASE}/api/auth/update-profile`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        username: currentUser.username,
                        name: newName,
                        avatarUrl: tempAvatarUrl
                    })
                })
                .then(res => res.json())
                .catch(err => console.error('[DATABASE] Lỗi đồng bộ MySQL:', err));

                // Cập nhật UI ngay lập tức
                updateUIProfile(currentUser);
            }

            closeProfileModal();
            showToast('Đã cập nhật Profile thành công!');
        });
    }

    function updateUIProfile(user) {
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
});
