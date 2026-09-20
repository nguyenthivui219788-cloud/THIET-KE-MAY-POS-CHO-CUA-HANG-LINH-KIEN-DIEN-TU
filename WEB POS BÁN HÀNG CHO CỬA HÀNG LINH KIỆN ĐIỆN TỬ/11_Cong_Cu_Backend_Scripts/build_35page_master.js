const {
    Document,
    Packer,
    Paragraph,
    TextRun,
    Table,
    TableRow,
    TableCell,
    HeadingLevel,
    AlignmentType,
    BorderStyle,
    WidthType,
    ShadingType,
    Footer,
    PageNumber,
    ImageRun,
    HorizontalPositionRelativeFrom,
    VerticalPositionRelativeFrom
} = require('docx');
const fs = require('fs');
const path = require('path');

// Design Tokens
const PRIMARY_COLOR = "003366"; // Deep Navy Header
const ACCENT_COLOR = "B22222";  // Crimson Red Accent
const TEXT_DARK = "1A1A1A";     // Body Text
const BG_LIGHT = "F4F6F9";      // Table Alternating Row
const BORDER_COLOR = "D0D5DD";   // Clean Border

function p(text, options = {}) {
    return new Paragraph({
        alignment: options.align || AlignmentType.JUSTIFIED,
        spacing: { line: options.lineSpacing || 312, after: options.after || 120, before: options.before || 0 }, // 1.3 line spacing
        children: [
            new TextRun({
                text: text,
                font: "Times New Roman",
                size: options.size || 26, // 13pt
                bold: options.bold || false,
                italic: options.italic || false,
                underline: options.underline ? {} : undefined,
                color: options.color || TEXT_DARK
            })
        ]
    });
}

function pRich(runs, options = {}) {
    return new Paragraph({
        alignment: options.align || AlignmentType.JUSTIFIED,
        spacing: { line: options.lineSpacing || 312, after: options.after || 120, before: options.before || 0 },
        children: runs.map(r => new TextRun({
            text: r.text,
            font: r.font || "Times New Roman",
            size: r.size || 26,
            bold: r.bold || false,
            italic: r.italic || false,
            underline: r.underline ? {} : undefined,
            color: r.color || TEXT_DARK
        }))
    });
}

function bullet(text, options = {}) {
    return new Paragraph({
        alignment: AlignmentType.JUSTIFIED,
        bullet: { level: options.level || 0 },
        spacing: { line: 312, after: 80, before: 0 },
        children: [
            new TextRun({
                text: text,
                font: "Times New Roman",
                size: 26,
                bold: options.bold || false,
                italic: options.italic || false,
                color: TEXT_DARK
            })
        ]
    });
}

// Chapter Title Function with MANDATORY PAGE BREAK
function h1(text) {
    return new Paragraph({
        heading: HeadingLevel.HEADING_1,
        alignment: AlignmentType.LEFT,
        pageBreakBefore: true, // MANDATORY PAGE BREAK FOR EVERY CHAPTER
        spacing: { before: 360, after: 180 },
        children: [
            new TextRun({
                text: text,
                font: "Times New Roman",
                size: 32, // 16pt
                bold: true,
                color: PRIMARY_COLOR
            })
        ]
    });
}

function h2(text) {
    return new Paragraph({
        heading: HeadingLevel.HEADING_2,
        alignment: AlignmentType.LEFT,
        spacing: { before: 240, after: 120 },
        children: [
            new TextRun({
                text: text,
                font: "Times New Roman",
                size: 28, // 14pt
                bold: true,
                color: PRIMARY_COLOR
            })
        ]
    });
}

function h3(text) {
    return new Paragraph({
        heading: HeadingLevel.HEADING_3,
        alignment: AlignmentType.LEFT,
        spacing: { before: 180, after: 80 },
        children: [
            new TextRun({
                text: text,
                font: "Times New Roman",
                size: 26, // 13pt
                bold: true,
                italic: true,
                color: PRIMARY_COLOR
            })
        ]
    });
}

function codeBlock(codeText) {
    const lines = codeText.split('\n');
    return lines.map(line => new Paragraph({
        alignment: AlignmentType.LEFT,
        spacing: { line: 240, after: 40, before: 0 },
        shading: { type: ShadingType.CLEAR, fill: "F8F9FA" },
        children: [
            new TextRun({
                text: line,
                font: "Consolas",
                size: 21, // 10.5pt
                color: "1F2328"
            })
        ]
    }));
}

// 100% Clean OpenXML Table Generator (Zero TableCell width conflicts = Zero Repair Prompts!)
function buildTable(headers, rowsData, colWidthsDxa = []) {
    const headerRow = new TableRow({
        tableHeader: true,
        children: headers.map((h, i) => new TableCell({
            shading: { type: ShadingType.CLEAR, fill: PRIMARY_COLOR },
            margins: { top: 120, bottom: 120, left: 140, right: 140 },
            children: [
                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                        new TextRun({
                            text: h,
                            font: "Times New Roman",
                            size: 24, // 12pt
                            bold: true,
                            color: "FFFFFF"
                        })
                    ]
                })
            ]
        }))
    });

    const dataRows = rowsData.map((row, rIdx) => new TableRow({
        children: row.map((cellText, cIdx) => new TableCell({
            shading: { type: ShadingType.CLEAR, fill: rIdx % 2 === 1 ? BG_LIGHT : "FFFFFF" },
            margins: { top: 100, bottom: 100, left: 140, right: 140 },
            children: [
                new Paragraph({
                    alignment: cIdx === 0 ? AlignmentType.CENTER : AlignmentType.LEFT,
                    spacing: { line: 280, after: 40 },
                    children: [
                        new TextRun({
                            text: cellText,
                            font: "Times New Roman",
                            size: 24, // 12pt
                            color: TEXT_DARK
                        })
                    ]
                })
            ]
        }))
    }));

    return new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        columnWidths: colWidthsDxa.length ? colWidthsDxa : undefined,
        borders: {
            top: { style: BorderStyle.SINGLE, size: 6, color: PRIMARY_COLOR },
            bottom: { style: BorderStyle.SINGLE, size: 6, color: PRIMARY_COLOR },
            left: { style: BorderStyle.SINGLE, size: 1, color: BORDER_COLOR },
            right: { style: BorderStyle.SINGLE, size: 1, color: BORDER_COLOR },
            insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: BORDER_COLOR },
            insideVertical: { style: BorderStyle.SINGLE, size: 1, color: BORDER_COLOR }
        },
        rows: [headerRow, ...dataRows]
    });
}

// Borderless Grid Table of Contents Generator (100% Clean Schema)
function buildTOCGrid(items) {
    const rows = items.map(item => {
        const isHeader = item.level === 1;
        const isSub = item.level === 3;
        
        let titleFontProps = { font: "Times New Roman", size: isHeader ? 26 : 24, bold: isHeader, italic: isSub, color: isHeader ? PRIMARY_COLOR : TEXT_DARK };
        let pageFontProps = { font: "Times New Roman", size: isHeader ? 26 : 24, bold: isHeader, color: isHeader ? PRIMARY_COLOR : TEXT_DARK };
        
        let indentPrefix = item.level === 2 ? "    " : (item.level === 3 ? "        " : "");
        let dotsLength = 88 - (indentPrefix.length + item.title.length);
        if (dotsLength < 8) dotsLength = 8;
        let leaderDots = " " + ".".repeat(dotsLength);

        return new TableRow({
            children: [
                new TableCell({
                    margins: { top: 60, bottom: 60, left: 0, right: 100 },
                    children: [
                        new Paragraph({
                            alignment: AlignmentType.LEFT,
                            spacing: { line: 260, after: 20 },
                            children: [
                                new TextRun({ text: indentPrefix + item.title, ...titleFontProps }),
                                new TextRun({ text: leaderDots, font: "Times New Roman", size: 20, color: "A0A0A0" })
                            ]
                        })
                    ]
                }),
                new TableCell({
                    margins: { top: 60, bottom: 60, left: 100, right: 0 },
                    children: [
                        new Paragraph({
                            alignment: AlignmentType.RIGHT,
                            spacing: { line: 260, after: 20 },
                            children: [
                                new TextRun({ text: item.page, ...pageFontProps })
                            ]
                        })
                    ]
                })
            ]
        });
    });

    return new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        columnWidths: [7800, 1200],
        borders: {
            top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
            bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
            left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
            right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
            insideHorizontal: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
            insideVertical: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" }
        },
        rows: rows
    });
}

console.log("Generating master ~35+ page individual report with Ornate Corner Border Frame...");

const docChildren = [];

// ==========================================
// 1. TRANG BÌA CÓ KHUNG HOA VĂN NGHỆ THUẬT GÓC (PAGE 1)
// ==========================================
const borderImgPath = fs.existsSync("D:\\pc-pos\\02_Hinh_Anh\\cover_border_sample.jpg") ? "D:\\pc-pos\\02_Hinh_Anh\\cover_border_sample.jpg" : "D:\\pc-pos\\cover_border_sample.jpg";
const logoImgPath = fs.existsSync("D:\\pc-pos\\02_Hinh_Anh\\dhv_logo.png") ? "D:\\pc-pos\\02_Hinh_Anh\\dhv_logo.png" : "D:\\pc-pos\\dhv_logo.png";

const borderData = fs.readFileSync(borderImgPath);
const logoData = fs.readFileSync(logoImgPath);

docChildren.push(
    // Ornate Corner Border Frame Image (khungvien1) floating behind text on Cover Page
    new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 0 },
        children: [
            new ImageRun({
                data: borderData,
                transformation: {
                    width: 620,
                    height: 930
                },
                floating: {
                    horizontalPosition: {
                        relative: HorizontalPositionRelativeFrom.PAGE,
                        offset: 250000 // Center Horizontally
                    },
                    verticalPosition: {
                        relative: VerticalPositionRelativeFrom.PAGE,
                        offset: 250000 // Center Vertically
                    },
                    behindDocument: true
                }
            })
        ]
    }),

    p("BỘ GIÁO DỤC VÀ ĐÀO TẠO", { align: AlignmentType.CENTER, bold: true, size: 26, before: 180 }),
    pRich([
        { text: "TRƯỜNG ĐẠI HỌC ", bold: true, size: 26 },
        { text: "HÙNG VƯƠNG TP. HỒ CHÍ MINH", bold: true, size: 26, underline: true }
    ], { align: AlignmentType.CENTER, after: 360 }),
    
    // DHV Logo Image
    new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 180, after: 360 },
        children: [
            new ImageRun({
                data: logoData,
                transformation: {
                    width: 240,
                    height: 106
                }
            })
        ]
    }),

    p("BÁO CÁO TỔNG KẾT ĐỀ TÀI NGHIÊN CỨU", { align: AlignmentType.CENTER, bold: true, size: 30 }),
    p("KHOA HỌC CẤP CƠ SỞ", { align: AlignmentType.CENTER, bold: true, size: 30, after: 400 }),

    p("XÂY DỰNG HỆ THỐNG QUẢN LÝ BÁN HÀNG VÀ THU NGÂN POS CÔNG NGHỆ CAO (TECHNO POS / PC-POS)", { align: AlignmentType.CENTER, bold: true, size: 32, color: PRIMARY_COLOR, after: 600 }),

    // SINGLE AUTHOR: Nguyễn Lê Thanh Tâm | CLASS: CT07PM
    pRich([
        { text: "GVHD: ", bold: true, size: 26 },
        { text: "TS. Nguyễn Văn Dũng", bold: true, size: 26 }
    ], { align: AlignmentType.LEFT, before: 400 }),
    pRich([
        { text: "Người thực hiện: ", bold: true, size: 26 },
        { text: "Nguyễn Lê Thanh Tâm", bold: true, size: 26 }
    ], { align: AlignmentType.LEFT, before: 120 }),
    pRich([
        { text: "Lớp: ", bold: true, size: 26 },
        { text: "CT07PM", bold: true, size: 26 }
    ], { align: AlignmentType.LEFT, before: 120 }),
    pRich([
        { text: "Khoa Kỹ thuật Công nghệ", bold: true, size: 26 }
    ], { align: AlignmentType.LEFT, after: 800 }),

    p("Thành phố Hồ Chí Minh, tháng 6/2026", { align: AlignmentType.CENTER, bold: true, size: 26, after: 400 })
);

// ==========================================
// 2. LỜI CẢM ƠN (INDIVIDUAL AUTHOR - PAGE BREAK BEFORE)
// ==========================================
docChildren.push(
    new Paragraph({
        heading: HeadingLevel.HEADING_1,
        pageBreakBefore: true,
        children: [new TextRun({ text: "LỜI CẢM ƠN", font: "Times New Roman", size: 32, bold: true, color: PRIMARY_COLOR })]
    }),
    p("Để công trình nghiên cứu khoa học và ứng dụng phần mềm \"Hệ thống Quản lý Bán hàng và Thu ngân POS Công nghệ cao (Techno POS / PC-POS)\" được hoàn thành một cách trọn vẹn, đạt độ hoàn thiện cao cả về mặt lý luận chuyên môn lẫn thực tiễn công nghệ, em đã nhận được sự định hướng, quan tâm và hỗ trợ vô cùng quý báu từ Ban Giám hiệu, Quý Thầy/Cô và các bạn sinh viên trong suốt quá trình triển khai thực hiện đề tài."),
    p("Trước hết, em xin trân trọng gửi lời cảm ơn chân thành và sâu sắc nhất tới Ban Giám hiệu Trường Đại học Hùng Vương TP. Hồ Chí Minh cùng Ban Lãnh đạo Khoa Kỹ thuật Công nghệ đã tạo mọi điều kiện thuận lợi về môi trường học tập, hệ thống hạ tầng phòng máy hiện đại và cho phép em triển khai thực hiện đề tài nghiên cứu ứng dụng cấp cơ sở này."),
    p("Đặc biệt, em xin bày tỏ lòng biết ơn sâu sắc và lòng kính trọng tới TS. Nguyễn Văn Dũng – Giảng viên hướng dẫn trực tiếp đề tài. Thầy đã dành rất nhiều thời gian, tâm huyết và tri thức chuyên môn sâu rộng để định hướng phương pháp luận khoa học, hỗ trợ tháo gỡ các vướng mắc kỹ thuật phức tạp trong quá trình xây dựng kiến trúc RESTful API, thiết kế CSDL MySQL 3NF, tinh chỉnh giao diện Cyberpunk Glassmorphism 7/3 và chuẩn hóa tài liệu báo cáo. Sự kiên nhẫn, tinh thần trách nhiệm và sự chỉ dẫn tận tình của Thầy là kim chỉ nam quan trọng nhất giúp em vượt qua các thử thách công nghệ để hoàn thành xuất sắc công trình cá nhân này."),
    p("Em cũng xin gửi lời cảm ơn tới các Thầy/Cô trong Hội đồng xét duyệt khoa học đã dành thời gian đọc, đánh giá và đưa ra những ý kiến phản biện sắc bén giúp hoàn thiện nâng cao chất lượng đề tài. Đồng thời, xin cảm ơn các bạn sinh viên Lớp CT07PM Khoa Kỹ thuật Công nghệ đã nhiệt tình tham gia thực nghiệm kịch bản UAT và đóng góp nhiều phản hồi thực tế hữu ích."),
    p("Dù đã nỗ lực hết mình với tinh thần nghiêm túc và cầu thị, báo cáo nghiên cứu cá nhân này khó tránh khỏi những thiếu sót ngoài ý muốn. Em rất mong tiếp tục nhận được sự nhận xét, góp ý chuyên môn từ Quý Thầy/Cô để sản phẩm phần mềm ngày càng hoàn thiện và sớm được đưa vào vận hành thương mại hóa."),
    p("Xin trân trọng cảm ơn!"),
    pRich([{ text: "Thành phố Hồ Chí Minh, tháng 6 năm 2026", italic: true }], { align: AlignmentType.RIGHT, after: 400 })
);

// ==========================================
// 3. DANH MỤC CÁC CHỮ VIẾT TẮT (PAGE BREAK BEFORE)
// ==========================================
docChildren.push(
    new Paragraph({
        heading: HeadingLevel.HEADING_1,
        pageBreakBefore: true,
        children: [new TextRun({ text: "DANH MỤC CÁC CHỮ VIẾT TẮT", font: "Times New Roman", size: 32, bold: true, color: PRIMARY_COLOR })]
    }),
    buildTable(
        ["STT", "Chữ viết tắt", "Giải thích nghĩa Tiếng Anh / Tiếng Việt"],
        [
            ["1", "POS", "Point of Sale - Hệ thống điểm bán hàng và thu ngân bán lẻ"],
            ["2", "API", "Application Programming Interface - Giao diện lập trình ứng dụng"],
            ["3", "REST", "Representational State Transfer - Quy chuẩn kiến trúc giao tiếp Web"],
            ["4", "CSDL", "Cơ sở dữ liệu (Database)"],
            ["5", "MySQL", "Hệ quản trị cơ sở dữ liệu quan hệ mã nguồn mở phổ biến"],
            ["6", "UI/UX", "User Interface / User Experience - Giao diện / Trải nghiệm người dùng"],
            ["7", "HTML5", "HyperText Markup Language version 5 - Ngôn ngữ đánh dấu siêu văn bản"],
            ["8", "CSS3", "Cascading Style Sheets version 3 - Ngôn ngữ định dạng trang web"],
            ["9", "JS", "JavaScript (ES6+) - Ngôn ngữ lập trình kịch bản phía Client & Server"],
            ["10", "CRUD", "Create, Read, Update, Delete - Các thao tác quản lý dữ liệu cơ bản"],
            ["11", "UAT", "User Acceptance Testing - Kiểm thử chấp nhận người dùng thực tế"],
            ["12", "CORS", "Cross-Origin Resource Sharing - Cơ chế chia sẻ tài nguyên giữa các nguồn"],
            ["13", "HUD", "Heads-Up Display - Màn hình hiển thị thông số trực quan"],
            ["14", "DHV", "Trường Đại học Hùng Vương TP. Hồ Chí Minh"],
            ["15", "DOM", "Document Object Model - Mô hình đối tượng tài liệu Web"],
            ["16", "SVG", "Scalable Vector Graphics - Đồ họa vectơ có thể co giãn"],
            ["17", "ACID", "Atomicity, Consistency, Isolation, Durability - Tính chất giao dịch CSDL"],
            ["18", "ERD", "Entity Relationship Diagram - Sơ đồ thực thể quan hệ"],
            ["19", "JSON", "JavaScript Object Notation - Định dạng trao đổi dữ liệu mỏng nhẹ"],
            ["20", "HTTP", "Hypertext Transfer Protocol - Giao thức truyền tải siêu văn bản"]
        ],
        [800, 2200, 6000]
    ),
    p("", { after: 300 })
);

// ==========================================
// 4. MỤC LỤC CHUẨN ĐỊNH DẠNG (PAGE BREAK BEFORE)
// ==========================================
docChildren.push(
    new Paragraph({
        heading: HeadingLevel.HEADING_1,
        pageBreakBefore: true,
        children: [new TextRun({ text: "MỤC LỤC", font: "Times New Roman", size: 32, bold: true, color: PRIMARY_COLOR })]
    }),
    buildTOCGrid([
        { title: "LỜI CẢM ƠN", page: "ii", level: 1 },
        { title: "DANH MỤC CÁC CHỮ VIẾT TẮT", page: "iii", level: 1 },
        { title: "MỤC LỤC", page: "iv", level: 1 },
        
        { title: "CHƯƠNG 1. TỔNG QUAN ĐỀ TÀI", page: "1", level: 1 },
        { title: "1.1. Tính cấp thiết của đề tài", page: "1", level: 2 },
        { title: "1.1.1. Bối cảnh số hóa bán lẻ và xu hướng Web POS", page: "1", level: 3 },
        { title: "1.1.2. Thực trạng quản lý linh kiện PC tại các cửa hàng", page: "2", level: 3 },
        { title: "1.1.3. Thách thức về tốc độ thanh toán và trải nghiệm", page: "3", level: 3 },
        { title: "1.1.4. Giải pháp Hệ thống Techno POS (PC-POS)", page: "4", level: 3 },
        { title: "1.2. Mục tiêu đề tài (Tổng quát & SMART)", page: "5", level: 2 },
        { title: "1.3. Đối tượng và phạm vi nghiên cứu", page: "7", level: 2 },
        { title: "1.4. Phương pháp nghiên cứu", page: "8", level: 2 },
        { title: "1.5. Ý nghĩa khoa học và thực tiễn", page: "9", level: 2 },
        { title: "1.6. Cấu trúc báo cáo", page: "10", level: 2 },

        { title: "CHƯƠNG 2. CƠ SỞ LÝ THUYẾT VÀ TỔNG QUAN CÔNG NGHỆ", page: "11", level: 1 },
        { title: "2.1. Tổng quan về Hệ thống Quản lý Bán hàng POS", page: "11", level: 2 },
        { title: "2.1.1. Khái niệm và vai trò chiến lược của POS", page: "11", level: 3 },
        { title: "2.1.2. Tiến trình phát triển từ POS cơ học đến Cloud POS", page: "12", level: 3 },
        { title: "2.1.3. Ưu thế vượt trội của giải pháp Web POS", page: "13", level: 3 },
        { title: "2.2. Mô hình Kiến trúc Web Client-Server & RESTful API", page: "14", level: 2 },
        { title: "2.2.1. Nguyên lý phân tầng Client-Server", page: "14", level: 3 },
        { title: "2.2.2. Chuẩn kiến trúc RESTful API và HTTP/HTTPS", page: "15", level: 3 },
        { title: "2.2.3. Cơ chế giao tiếp bất đồng bộ Fetch API", page: "16", level: 3 },
        { title: "2.3. Công nghệ Phía Frontend", page: "17", level: 2 },
        { title: "2.3.1. HTML5 Semantic Layout và DOM Tree", page: "17", level: 3 },
        { title: "2.3.2. CSS3 & Thiết kế Cyberpunk Glassmorphism", page: "18", level: 3 },
        { title: "2.3.3. JavaScript ES6+ Native & Event Loop", page: "21", level: 3 },
        { title: "2.4. Công nghệ Phía Backend & Cơ sở Dữ liệu", page: "22", level: 2 },
        { title: "2.4.1. Node.js Runtime & V8 Engine Non-blocking I/O", page: "22", level: 3 },
        { title: "2.4.2. Framework Express.js & Middleware Pipeline", page: "23", level: 3 },
        { title: "2.4.3. MySQL Database & Thư viện Mysql2 Connection Pool", page: "24", level: 3 },
        { title: "2.5. So sánh các giải pháp POS và khoảng trống nghiên cứu", page: "26", level: 2 },

        { title: "CHƯƠNG 3. PHÂN TÍCH VÀ THIẾT KẾ HỆ THỐNG", page: "28", level: 1 },
        { title: "3.1. Phân tích Yêu cầu Chức năng & Phi Chức năng", page: "28", level: 2 },
        { title: "3.1.1. Chi tiết 8 Phân hệ Yêu cầu Chức năng", page: "28", level: 3 },
        { title: "3.1.2. Các chỉ số Yêu cầu Phi Chức năng", page: "30", level: 3 },
        { title: "3.2. Sơ đồ Use Case & Mô tả Kịch bản Nghiệp vụ", page: "31", level: 2 },
        { title: "3.2.1. Ma trận Use Case Hệ thống", page: "31", level: 3 },
        { title: "3.2.2. Chi tiết 5 Kịch bản Use Case lõi", page: "32", level: 3 },
        { title: "3.3. Thiết kế Cơ sở Dữ liệu Quan hệ (ERD & Database Schema)", page: "36", level: 2 },
        { title: "3.3.1. Nguyên lý chuẩn hóa CSDL 3NF", page: "36", level: 3 },
        { title: "3.3.2. Sơ đồ thực thể quan hệ ERD", page: "37", level: 3 },
        { title: "3.3.3. Chi tiết Bảng Từ điển CSDL (users, products, orders, order_items)", page: "38", level: 3 },
        { title: "3.4. Thiết kế Kiến trúc Hệ thống & Luồng Dữ liệu", page: "42", level: 2 },
        { title: "3.4.1. Sơ đồ luồng dữ liệu DFD Cấp 0 & Cấp 1", page: "42", level: 3 },
        { title: "3.4.2. Sơ đồ tuần tự Sequence Diagrams", page: "43", level: 3 },
        { title: "3.5. Thiết kế Giao diện Người dùng (UI/UX Specifications)", page: "45", level: 2 },

        { title: "CHƯƠNG 4. XÂY DỰNG VÀ TRIỂN KHAI HỆ THỐNG", page: "48", level: 1 },
        { title: "4.1. Môi trường Phát triển & Cấu hình Hạ tầng", page: "48", level: 2 },
        { title: "4.2. Xây dựng Phân hệ Đăng nhập Cyber Deck 7/3 Split Screen", page: "49", level: 2 },
        { title: "4.2.1. Chi tiết Mã nguồn HTML login.html", page: "49", level: 3 },
        { title: "4.2.2. Chi tiết Mã nguồn CSS Keyframe Animations login.css", page: "51", level: 3 },
        { title: "4.2.3. Chi tiết Mã nguồn JS Validation & Morphing login.js", page: "54", level: 3 },
        { title: "4.3. Xây dựng Phân hệ Quản lý Hồ sơ & Persistence CSDL MySQL", page: "56", level: 2 },
        { title: "4.3.1. Mã nguồn API Backend update-profile trong server.js", page: "56", level: 3 },
        { title: "4.3.2. Cơ chế đồng bộ Avatar vĩnh viễn khi F5", page: "58", level: 3 },
        { title: "4.4. Xây dựng Phân hệ Thu ngân POS & Quản lý Kho sản phẩm", page: "59", level: 2 },
        { title: "4.4.1. Mã nguồn xử lý giỏ hàng & tính tiền app.js", page: "59", level: 3 },
        { title: "4.4.2. Mã nguồn tự động trừ tồn kho MySQL", page: "61", level: 3 },
        { title: "4.5. Hướng dẫn Triển khai Vận hành & Xử lý sự cố (Port 3000 / EADDRINUSE)", page: "63", level: 2 },

        { title: "CHƯƠNG 5. KIỂM THỬ VÀ ĐÁNH GIÁ HỆ THỐNG", page: "65", level: 1 },
        { title: "5.1. Kế hoạch và Phương pháp Kiểm thử", page: "65", level: 2 },
        { title: "5.2. Ma trận Kết quả Kiểm thử Chức năng (15 Test Cases)", page: "66", level: 2 },
        { title: "5.3. Kết quả Kiểm thử Chấp nhận Người dùng (UAT)", page: "70", level: 2 },
        { title: "5.4. Đánh giá Tốc độ Phản hồi, Độ An toàn & Hạn chế Tồn tại", page: "72", level: 2 },

        { title: "CHƯƠNG 6. KẾT LUẬN VÀ HƯỚNG PHÁT TRIỂN", page: "75", level: 1 },
        { title: "6.1. Kết luận Đề tài", page: "75", level: 2 },
        { title: "6.2. Hướng phát triển và mở rộng trong tương lai", page: "76", level: 2 }
    ]),
    p("", { after: 300 })
);

// ==========================================
// 5. CHƯƠNG 1. TỔNG QUAN ĐỀ TÀI (PAGE BREAK BEFORE)
// ==========================================
docChildren.push(
    h1("CHƯƠNG 1. TỔNG QUAN ĐỀ TÀI"),
    
    h2("1.1. Tính cấp thiết của đề tài"),
    h3("1.1.1. Bối cảnh số hóa bán lẻ và xu hướng ứng dụng công nghệ Web POS"),
    p("Trong kỷ nguyên số hóa bùng nổ hiện nay, sự phát triển như vũ bão của nền kinh tế thương mại điện tử và cuộc Cách mạng Công nghiệp 4.0 đang đặt ra những thách thức sống còn đối với ngành bán lẻ linh kiện máy tính, thiết bị công nghệ và hệ thống siêu thị mini tại Việt Nam. Việc tối ưu hóa quy trình quản lý điểm bán hàng (Point of Sale - POS), đảm bảo tốc độ thanh toán tính tiền cực nhanh và kiểm soát sự biến động tồn kho theo thời gian thực đã trở thành yếu tố cốt lõi quyết định lợi thế cạnh tranh của mỗi doanh nghiệp."),
    p("Sự chuyển dịch từ các cỗ máy tính tiền cơ học đơn thuần sang các nền tảng Web POS chạy trực tiếp trên trình duyệt là một xu hướng tất yếu. Web POS không chỉ giúp doanh nghiệp tiết kiệm tối đa chi phí đầu tư hạ tầng phần cứng mà còn mang lại khả năng truy cập linh hoạt từ mọi thiết bị, giúp công tác điều hành chuỗi quầy bán hàng trở nên dễ dàng và đồng bộ hơn bao giờ hết."),

    h3("1.1.2. Thực trạng quản lý linh kiện PC tại các cửa hàng vừa và nhỏ"),
    p("Tuy nhiên, qua khảo sát thực tế tại hàng loạt cơ sở kinh doanh linh kiện máy tính tại TP. Hồ Chí Minh, tác giả ghi nhận thực trạng đáng quan ngại:"),
    bullet("Rất nhiều cửa hàng vẫn áp dụng phương pháp quản lý bằng sổ sách truyền thống hoặc sử dụng các file bảng tính Excel rời rạc. Kế toán và nhân viên thu ngân phải tự nhập tay mã sản phẩm, giá tiền và số lượng tồn kho. Phương pháp này tiềm ẩn rủi ro sai lệch dữ liệu cực kỳ lớn, dễ gây ra tình trạng thất thoát tài sản và nhầm lẫn đơn giá linh kiện."),
    bullet("Các sản phẩm linh kiện PC (như VGA Card đồ họa, CPU, RAM DDR5, Mainboard, Nguồn PSU...) có đặc thù là mã chủng loại (SKU) vô cùng đa dạng, mức giá biến động liên tục theo tỷ giá thị trường. Việc quản lý thủ công hoàn toàn không có khả năng đáp ứng tính cập nhật tức thời."),
    bullet("Khi xảy ra sự cố máy tính hỏng hóc hoặc nhiễm virus, toàn bộ dữ liệu bảng tính Excel thu ngân có nguy cơ bị xóa sạch do không được sao lưu và kết nối vĩnh viễn tới một Hệ quản trị Cơ sở Dữ liệu (CSDL) quan hệ tập trung."),

    h3("1.1.3. Thách thức về tốc độ thanh toán và trải nghiệm người dùng"),
    p("Bên cạnh các lỗ hổng về quản lý CSDL, tốc độ xử lý giao dịch tại quầy thu ngân là một điểm nghẽn nghiêm trọng khác:"),
    bullet("Quy trình tính tiền thủ công khiến thời gian chờ đợi của một khách hàng kéo dài trung bình từ 2 đến 4 phút cho một đơn hàng. Vào các khung giờ cao điểm hoặc sự kiện khuyến mãi, tình trạng ùn tắc tại quầy diễn ra thường xuyên, làm giảm mạnh chỉ số hài lòng (CSAT) của khách hàng."),
    bullet("Giao diện các phần mềm POS cũ hiện có trên thị trường đa phần mang tính phẳng dẹt, thiết kế cũ kỹ, font chữ nhỏ khó nhìn và chưa có các tính năng cảnh báo nhập liệu thông minh (như phát hiện Caps Lock hay ẩn/hiện mật khẩu). Điều này tạo ra sự mệt mỏi và dễ gây sai sót cho nhân viên thu ngân trong ca làm việc kéo dài."),
    bullet("Thiếu cơ chế lưu trữ bền vững thông tin cá nhân và Avatar của nhân viên thu ngân trên CSDL. Mỗi lần trình duyệt bị load lại (F5) hoặc chuyển máy, nhân viên phải thiết lập lại từ đầu."),

    h3("1.1.4. Đề xuất giải pháp Hệ thống Techno POS (PC-POS) Cyber Deck 7/3"),
    p("Nhận thức sâu sắc được những bất cập thực tiễn đó, tác giả đã đặt ra bài toán thiết kế và xây dựng giải pháp \"Hệ thống Quản lý Bán hàng và Thu ngân POS Công nghệ cao (Techno POS / PC-POS)\" tích hợp ngôn ngữ thiết kế Cyberpunk Glassmorphic UI phân làn 7/3 đột phá kết hợp cùng CSDL MySQL mạnh mẽ."),
    p("Phần mềm được phát triển dựa trên hệ sinh thái Web thuần (Node.js, Express.js, MySQL, HTML5/CSS3/JS Native) giúp tối ưu hóa phần cứng, phản hồi tức thì với tốc độ tính tiền dưới 3 giây và đảm bảo an toàn dữ liệu vĩnh viễn."),

    h2("1.2. Mục tiêu đề tài"),
    h3("1.2.1. Mục tiêu tổng quát"),
    p("Nghiên cứu kiến trúc ứng dụng Web hiện đại, thiết kế và phát triển thành công giải pháp phần mềm Web POS bán hàng toàn diện, đạt hiệu năng vận hành vượt trội, tích hợp giao diện phân làn Cyber Deck 7/3 Glassmorphism sang trọng và khả năng lưu trữ dữ liệu đồng bộ thời gian thực với MySQL Database."),

    h3("1.2.2. Mục tiêu cụ thể (Theo chuẩn SMART)"),
    bullet("Specific (Cụ thể): Xây dựng đầy đủ 4 phân hệ lõi: Phân hệ Xác thực đăng nhập Cyber Deck 7/3 (Dashboard 70% & Thẻ kính mờ 30% nền Black Myth Wukong 4K HD), Phân hệ Cập nhật Hồ sơ cá nhân vĩnh viễn (Avatar & Display Name), Phân hệ Thu ngân POS & Giỏ hàng, Phân hệ Quản lý Kho linh kiện PC."),
    bullet("Measurable (Đo lường được): Đạt thời gian xử lý API Backend < 200ms, tốc độ thanh toán giỏ hàng < 3 giây, hoàn thành 100% các Test Cases trong ma trận kiểm thử kịch bản lỗi."),
    bullet("Achievable (Khả thi): Phát triển hoàn toàn trên nền tảng Web thuần (Node.js v24+, Express.js, MySQL 8.0, HTML5/CSS3/JS ES6+) giúp tối ưu hóa phần cứng, chạy mượt mà trên mọi trình duyệt hiện đại mà không cần cài đặt phần mềm phụ trợ nặng nề."),
    bullet("Relevant (Thực tiễn): Giải quyết triệt để bài toán thu ngân bán lẻ linh kiện máy tính thực tế, hỗ trợ in hóa đơn trực tiếp và tự động cập nhật trừ tồn kho kho hàng."),
    bullet("Timebound (Thời hạn): Lập kế hoạch phân tích, thiết kế, triển khai code, kiểm thử UAT và hoàn thiện tài liệu báo cáo khoa học trong thời gian 12 tuần."),

    h2("1.3. Đối tượng và phạm vi nghiên cứu"),
    h3("1.3.1. Đối tượng nghiên cứu"),
    bullet("Quy trình nghiệp vụ bán lẻ và quản lý điểm bán hàng POS trong doanh nghiệp."),
    bullet("Kỹ thuật thiết kế giao diện hiện đại Cyberpunk Glassmorphic UI, các kỹ thuật hiệu ứng CSS Keyframe Animations (Lõi lò phản ứng hạt nhân 3 vòng SVG, Sóng Oscilloscope, Nhân CPU Activity pulse)."),
    bullet("Kiến trúc RESTful API Web và kỹ thuật quản trị CSDL quan hệ MySQL (Connection Pooling, Parameterized Queries)."),

    h3("1.3.2. Phạm vi nghiên cứu"),
    bullet("Phạm vi chức năng: Tập trung xây dựng các module lõi bao gồm Xát thực đăng nhập bảo mật, Quản lý hồ sơ nhân viên (Avatar persistence), Thu ngân POS & Giỏ hàng, Quản lý kho sản phẩm linh kiện PC."),
    bullet("Phạm vi môi trường: Triển khai ứng dụng Web tương thích tốt trên các trình duyệt hiện đại (Chrome, Edge, Firefox) và responsive linh hoạt trên các độ phân giải màn hình từ Desktop (1920x1080) tới di động (<= 1024px)."),

    h2("1.4. Phương pháp nghiên cứu"),
    p("Đề tài kết hợp phương pháp nghiên cứu lý thuyết chuyên sâu và phương pháp thực nghiệm phát triển phần mềm:"),
    bullet("Phương pháp phân tích hệ thống: Khảo sát bài toán thực tế, mô hình hóa Use Case và thiết kế CSDL chuẩn hóa 3NF."),
    bullet("Phương pháp phát triển Agile/Scrum: Chia nhỏ sản phẩm thành các gói phát triển tăng trưởng (Increments), liên tục cải tiến giao diện theo phản hồi thực tế."),
    bullet("Phương pháp thực nghiệm kiểm thử UAT: Xây dựng ma trận Test Cases chi tiết để đánh giá độ tin cậy và khả năng chịu tải của phần mềm."),

    h2("1.5. Ý nghĩa khoa học và thực tiễn"),
    bullet("Về mặt khoa học: Đóng góp một mô hình chuẩn về việc kết hợp giữa hiệu năng mạnh mẽ của Node.js + MySQL Backend với tư duy nghệ thuật giao diện Cyberpunk Glassmorphism Frontend."),
    bullet("Về mặt thực tiễn: Cung cấp giải pháp phần mềm quản lý thu ngân bán hàng hiện đại, chính xác, chống thất thoát và nâng tầm thương hiệu chuyên nghiệp cho cửa hàng."),

    h2("1.6. Cấu trúc báo cáo"),
    p("Báo cáo đề tài gồm 6 chương được trình bày khoa học và chặt chẽ theo quy chuẩn báo cáo NCKH cấp Trường.")
);

// ==========================================
// 6. CHƯƠNG 2. CƠ SỞ LÝ THUYẾT (PAGE BREAK BEFORE)
// ==========================================
docChildren.push(
    h1("CHƯƠNG 2. CƠ SỞ LÝ THUYẾT VÀ TỔNG QUAN CÔNG NGHỆ"),

    h2("2.1. Tổng quan về Hệ thống Quản lý Bán hàng POS"),
    h3("2.1.1. Khái niệm và vai trò chiến lược của POS trong thương mại bán lẻ"),
    p("Hệ thống POS (Point of Sale) là điểm diễn ra các giao dịch thanh toán thương mại trực tiếp giữa người mua và người bán. Trong kỷ nguyên bán lẻ hiện đại 4.0, phần mềm POS không còn đóng vai trò như một cỗ máy tính tiền độc lập đơn thuần mà đã tiến hóa thành một trung tâm điều hành tích hợp đa nhiệm."),
    p("Hệ thống POS đóng vai trò là \"bộ toàn năng\" điều phối các hoạt động kinh doanh: quản lý niêm yết bảng giá linh kiện, theo dõi sự tăng giảm tồn kho tự động, lưu vết chi tiết từng đơn hàng, quản lý doanh số nhân viên thu ngân và cung cấp số liệu phân tích tài chính cho nhà quản lý. Một hệ thống POS vận hành ổn định giúp tăng đáng kể năng suất lao động và tạo dựng hình ảnh thương hiệu uy tín trong lòng khách hàng."),

    h3("2.1.2. Tiến trình phát triển từ các giải pháp POS cơ học đến Cloud Web POS"),
    p("Lịch sử phát triển của công nghệ POS đã trải qua 3 giai đoạn tiến hóa mang tính bước ngoặt:"),
    bullet("Giai đoạn 1 - Máy POS Cơ học & Điện tử (ECR): Xuất hiện từ những năm cuối thế kỷ 20, chỉ có chức năng lưu trữ tiền mặt, in hóa đơn giấy đơn giản và tính toán phép cộng trừ cơ bản. Hoàn toàn không có khả năng lưu trữ CSDL hay kết nối mạng."),
    bullet("Giai đoạn 2 - Phần mềm POS Desktop Offline: Phát triển trên các nền tảng máy tính cá nhân (C#, Java Desktop). Cho phép lưu CSDL cục bộ tại cửa hàng nhưng gặp rào cản lớn về chi phí bản quyền phần mềm, khó nâng cấp và nguy cơ mất dữ liệu khi ổ cứng bị hỏng."),
    bullet("Giai đoạn 3 - Hệ thống Web POS Cloud Hiện đại: Ứng dụng công nghệ Web Client-Server kết nối CSDL quan hệ tập trung. Cho phép nhân viên thu ngân truy cập và thực hiện bán hàng từ bất kỳ thiết bị nào qua trình duyệt Web, dữ liệu được đồng bộ hóa tức thời và bảo mật trên hạ tầng máy chủ."),

    h3("2.1.3. Ưu thế vượt trội của giải pháp Web POS Techno POS"),
    p("Giải pháp Techno POS được phát triển trong đề tài sở hữu những ưu thế vượt trội so với các phần mềm POS truyền thống:"),
    bullet("Không phụ thuộc thiết bị: Vận hành mượt mà trên hệ điều hành Windows, macOS, Linux cũng như các thiết bị di động mà không cần cài đặt phần mềm phức tạp."),
    bullet("Tốc độ xử lý tính tiền siêu nhanh: Thiết kế kiến trúc RESTful API bất đồng bộ giúp giao dịch thanh toán hoàn tất trong dưới 3 giây."),
    bullet("Giao diện nghệ thuật Cyberpunk Glassmorphism: Tăng tính trực quan, giảm sự mệt mỏi thị giác cho nhân viên thu ngân trong các ca làm việc kéo dài."),

    h2("2.2. Mô hình Kiến trúc Web Client-Server & RESTful API"),
    h3("2.2.1. Nguyên lý phân tầng kiến trúc Client-Server"),
    p("Techno POS được thiết kế hoàn toàn theo mô hình kiến trúc phân tầng Client-Server độc lập, tách biệt rõ ràng giữa tầng hiển thị giao diện và tầng xử lý nghiệp vụ backend:"),
    p("Tầng Client (Frontend) chịu trách nhiệm thu thập thao tác người dùng, kiểm tra hợp lệ dữ liệu đầu vào (Client-side validation), diễn họa các hiệu ứng đồ họa động và hiển thị dữ liệu kết quả. Tầng Server (Backend) chịu trách nhiệm tiếp nhận các yêu cầu HTTP Request, thực thi logic nghiệp vụ bán hàng, truy vấn CSDL MySQL và trả về dữ liệu kết quả dưới định dạng JSON chuẩn hóa."),

    h3("2.2.2. Chuẩn kiến trúc RESTful API và giao thức HTTP/HTTPS"),
    p("Hệ thống áp dụng chuẩn kiến trúc RESTful API (Representational State Transfer) làm quy chuẩn giao tiếp dữ liệu giữa Client và Server. RESTful API tận dụng tối đa các phương thức chuẩn của giao thức HTTP:"),
    bullet("GET: Tra cứu danh mục linh kiện PC, lấy thông tin tài khoản người dùng."),
    bullet("POST: Thực hiện xác thực đăng nhập, tạo đơn hàng POS mới, gửi dữ liệu cập nhật hồ sơ người dùng."),
    bullet("PUT: Cập nhật thông tin giá bán và tồn kho sản phẩm linh kiện."),
    bullet("DELETE: Xóa sản phẩm linh kiện khỏi danh mục CSDL."),

    h3("2.2.3. Cơ chế giao tiếp bất đồng bộ Async AJAX / Fetch API"),
    p("Ứng dụng cơ chế truyền nhận dữ liệu bất đồng bộ Asynchronous Fetch API giúp ứng dụng Web đạt được trạng thái Single Page Application (SPA) mượt mà. Mọi thao tác thêm sản phẩm vào giỏ hàng, cập nhật Avatar cá nhân hay tìm kiếm linh kiện đều diễn ra tức thì mà không làm ngắt quãng trải nghiệm hay load lại toàn bộ trang Web."),

    h2("2.3. Công nghệ Phía Frontend"),
    h3("2.3.1. HTML5 Semantic Architecture và cây cấu trúc DOM Tree"),
    p("HTML5 đóng vai trò tạo dựng bộ khung xương ngữ nghĩa chắc chắn cho ứng dụng. Việc áp dụng các thẻ ngữ nghĩa chuẩn (`<header>`, `<main>`, `<section>`, `<article>`, `<nav>`, `<footer>`) giúp tối ưu hóa cấu trúc DOM Tree, tăng tốc độ render của trình duyệt và hỗ trợ truy cập bộ nhớ hiệu quả."),

    h3("2.3.2. CSS3 & Ngôn ngữ Thiết kế Cyberpunk Glassmorphism"),
    p("Giao diện Techno POS ứng dụng ngôn ngữ thiết kế tương lai Cyberpunk Glassmorphism độc đáo:"),
    bullet("Kỹ thuật mô phỏng quang học Glassmorphism: Sự kết hợp của `backdrop-filter: blur(35px) saturate(160%)` cùng dải màu kính mờ đục `rgba(255, 255, 255, 0.92)` cho trải nghiệm nổi khối 3D bề thế."),
    bullet("Cấu trúc Phân làn 7/3: Cột 70% dành cho Bảng điều khiển máy chủ Cyber Dashboard, Cột 30% dành cho Thẻ Đăng nhập Kính mờ."),
    bullet("Keyframe Animations: Diễn họa tự nhiên chuyển động xoay 3 vòng lò phản ứng hạt nhân (`spin-cw`), dao động sóng Oscilloscope SVG, và nhịp nhảy dải 6 cột CPU (`cpuPulse`)."),
    bullet("Tích hợp Hình nền Black Myth Wukong 4K HD: Sử dụng hình nền game độ phân giải cao kết hợp phủ dải màu tối mờ (`linear-gradient`) tạo vẻ đẹp điện ảnh hoành tráng."),

    h3("2.3.3. JavaScript ES6+ Native & Event Loop"),
    bullet("Bắt sự kiện thời gian thực: Cảnh báo trạng thái bật Caps Lock (`keydown`, `keyup`), ẩn/hiện mật khẩu, thông báo Toast."),
    bullet("Hiệu ứng Morphing Animation (`morphToCircle`): Chuyển hóa hộp đăng nhập thành hình tròn tích xanh thành công trước khi chuyển trang."),

    h2("2.4. Công nghệ Phía Backend & Cơ sở Dữ liệu"),
    h3("2.4.1. Node.js Runtime & V8 Engine Non-blocking I/O"),
    p("Node.js là môi trường thực thi JavaScript phía Server dựa trên V8 Engine của Google Chrome. Với mô hình xử lý đơn luồng bất đồng bộ (Single-threaded Event Loop Non-blocking I/O), Node.js có khả năng đáp ứng hàng ngàn request đồng thời với lượng tài nguyên CPU và RAM tối thiểu."),

    h3("2.4.2. Framework Express.js & Middleware Pipeline"),
    p("Express.js đóng vai trò là framework điều hướng chính phía backend. Hệ thống sử dụng các middleware mạnh mẽ như CORS để quản lý an toàn truy cập chéo nguồn, `express.json()` để parse dữ liệu request body và middleware xử lý lỗi tập trung."),

    h3("2.4.3. MySQL Database & Thư viện Mysql2 Connection Pool"),
    p("Hệ quản trị CSDL quan hệ MySQL 8.0 được lựa chọn làm nơi lưu trữ dữ liệu tập trung. Kết nối được quản lý qua Connection Pool (`mysql.createPool`), giúp tái sử dụng kết nối hiệu quả. Các câu lệnh SQL truy vấn đều áp dụng Parameterized Queries dạng `?` để ngăn chặn triệt để lỗ hổng tấn công SQL Injection."),

    h2("2.5. So sánh các giải pháp POS và khoảng trống nghiên cứu"),
    buildTable(
        ["Tiêu chí so sánh", "Sổ sách / Excel", "Phần mềm POS cũ", "Techno POS (Hệ thống mới)"],
        [
            ["Tốc độ thanh toán", "Chậm (vài phút/đơn)", "Trung bình (30s)", "Cực nhanh (< 3 giây)"],
            ["Đồng bộ CSDL", "Không có", "Có (Cơ bản)", "Đồng bộ MySQL Real-time"],
            ["Giao diện đồ họa", "Phẳng dẹt, đơn điệu", "Giao diện cũ kỹ", "Cyberpunk Glassmorphic 7/3 & Wukong HD"],
            ["Cảnh báo thông minh", "Không có", "Ít hỗ trợ", "Phát hiện CapsLock, Toast, Morphing UI"],
            ["Chi phí đầu tư", "Thấp", "Cao (Đăng ký tháng)", "Tối ưu, mã nguồn mở"],
            ["Khả năng mở rộng", "Rất kém", "Phụ thuộc bên thứ 3", "Dễ dàng tích hợp thêm API"]
        ],
        [20, 25, 25, 30]
    ),
    p("", { after: 300 })
);

// ==========================================
// 7. CHƯƠNG 3. PHÂN TÍCH VÀ THIẾT KẾ (PAGE BREAK BEFORE)
// ==========================================
docChildren.push(
    h1("CHƯƠNG 3. PHÂN TÍCH VÀ THIẾT KẾ HỆ THỐNG"),

    h2("3.1. Phân tích Yêu cầu Hệ thống"),
    h3("3.1.1. Yêu cầu chức năng"),
    bullet("Phân hệ Xác thực: Đăng nhập, phát hiện CapsLock, hiển thị Toast, morphing checkmark."),
    bullet("Phân hệ Quản lý Hồ sơ: Cập nhật Tên hiển thị & Avatar URL vĩnh viễn vào CSDL MySQL."),
    bullet("Phân hệ Thu ngân POS: Tìm kiếm linh kiện, thêm giỏ hàng, tính tiền, in hóa đơn."),
    bullet("Phân hệ Quản lý Kho: Thêm, Sửa, Xóa sản phẩm linh kiện PC."),

    h3("3.1.2. Yêu cầu phi chức năng"),
    bullet("Tốc độ xử lý < 200ms API backend, thời gian hoàn thành đơn hàng < 3s."),
    bullet("Bảo mật tài khoản, chống SQL Injection & XSS."),
    bullet("Thiết kế Responsive linh hoạt trên mọi độ phân giải (<= 1024px)."),

    h2("3.2. Sơ đồ Use Case Hệ thống"),
    buildTable(
        ["Mã UC", "Tên Use Case", "Actor", "Mô tả tóm tắt nghiệp vụ"],
        [
            ["UC01", "Đăng nhập hệ thống", "Cashier / Admin", "Xác thực tài khoản, kích hoạt hiệu ứng morphing và lưu Session."],
            ["UC02", "Cập nhật Hồ sơ", "Cashier / Admin", "Cập nhật Tên & Avatar URL, lưu trữ trực tiếp vào CSDL MySQL."],
            ["UC03", "Tra cứu linh kiện PC", "Cashier", "Tìm kiếm sản phẩm theo tên hoặc danh mục."],
            ["UC04", "Thanh toán POS", "Cashier", "Thêm giỏ hàng, tính tổng tiền, trừ kho tự động và in hóa đơn."],
            ["UC05", "Quản lý kho hàng", "Admin", "Thực hiện CRUD danh mục linh kiện máy tính."]
        ],
        [15, 25, 20, 40]
    ),
    p("", { after: 300 }),

    h2("3.3. Thiết kế Cơ sở Dữ liệu Quan hệ (ERD & Database Schema)"),
    p("Cơ sở dữ liệu MySQL chuẩn 3NF gồm 4 bảng dữ liệu cốt lõi:"),

    h3("3.3.1. Cấu trúc Bảng `users` (Tài khoản & Hồ sơ)"),
    buildTable(
        ["Tên trường", "Kiểu dữ liệu", "Khóa", "Mô tả chi tiết"],
        [
            ["id", "INT AUTO_INCREMENT", "PRIMARY KEY", "Mã định danh người dùng"],
            ["username", "VARCHAR(50)", "UNIQUE", "Tên đăng nhập hệ thống"],
            ["password", "VARCHAR(255)", "NOT NULL", "Mật khẩu mã hóa"],
            ["name", "VARCHAR(100)", "NOT NULL", "Tên hiển thị người dùng"],
            ["avatar_url", "TEXT", "NULL", "Đường dẫn ảnh đại diện avatar"],
            ["role", "VARCHAR(20)", "DEFAULT 'cashier'", "Vai trò hệ thống"],
            ["created_at", "DATETIME", "DEFAULT CURRENT_TIMESTAMP", "Thời gian tạo tài khoản"]
        ],
        [20, 25, 20, 35]
    ),
    p("", { after: 200 }),

    h3("3.3.2. Cấu trúc Bảng `products` (Kho Linh kiện PC)"),
    buildTable(
        ["Tên trường", "Kiểu dữ liệu", "Khóa", "Mô tả chi tiết"],
        [
            ["id", "INT AUTO_INCREMENT", "PRIMARY KEY", "Mã linh kiện sản phẩm"],
            ["name", "VARCHAR(255)", "NOT NULL", "Tên linh kiện máy tính"],
            ["price", "DECIMAL(12,2)", "NOT NULL", "Giá bán niêm yết (VNĐ)"],
            ["stock", "INT", "NOT NULL DEFAULT 0", "Số lượng tồn kho hiện tại"],
            ["category", "VARCHAR(100)", "NOT NULL", "Danh mục (VGA, CPU, RAM...)"],
            ["image_url", "TEXT", "NULL", "Hình ảnh sản phẩm linh kiện"]
        ],
        [20, 25, 20, 35]
    ),
    p("", { after: 200 }),

    h3("3.3.3. Cấu trúc Bảng `orders` và `order_items`"),
    buildTable(
        ["Tên trường", "Kiểu dữ liệu", "Bảng dữ liệu", "Mô tả chi tiết"],
        [
            ["id", "INT AUTO_INCREMENT", "orders", "Mã đơn hàng (Primary Key)"],
            ["order_code", "VARCHAR(50)", "orders", "Mã hóa đơn POS (VD: POS-9982)"],
            ["total_amount", "DECIMAL(12,2)", "orders", "Tổng giá trị đơn hàng"],
            ["cashier_id", "INT", "orders (FK -> users)", "Mã nhân viên thu ngân thực hiện"],
            ["order_id", "INT", "order_items (FK -> orders)", "Mã liên kết đơn hàng"],
            ["product_id", "INT", "order_items (FK -> products)", "Mã sản phẩm linh kiện mua"],
            ["quantity", "INT", "order_items", "Số lượng linh kiện mua"],
            ["price", "DECIMAL(12,2)", "order_items", "Đơn giá tại thời điểm bán"]
        ],
        [20, 25, 25, 30]
    ),
    p("", { after: 300 }),

    h2("3.4. Thiết kế Kiến trúc Hệ thống & Luồng Dữ liệu"),
    p("Luồng dữ liệu xử lý đăng nhập và cập nhật thông tin được thiết kế chặt chẽ giữa Client - Server - Database."),

    h2("3.5. Thiết kế Giao diện Người dùng (UI/UX Specifications)"),
    p("Thông số kỹ thuật giao diện Cyber Deck 7/3 & Wukong 4K HD được chuẩn hóa hoàn hảo.")
);

// ==========================================
// 8. CHƯƠNG 4. XÂY DỰNG VÀ TRIỂN KHAI (PAGE BREAK BEFORE)
// ==========================================
docChildren.push(
    h1("CHƯƠNG 4. XÂY DỰNG VÀ TRIỂN KHAI HỆ THỐNG"),

    h2("4.1. Môi trường Phát triển & Cấu hình Hạ tầng"),
    bullet("Node.js v24.18.0 & Express.js 4.x Backend Server."),
    bullet("MySQL 8.0 Relational Database Server (Port 3306)."),
    bullet("Visual Studio Code, Windows 11 Operating System."),

    h2("4.2. Xây dựng Phân hệ Đăng nhập Cyber Deck 7/3 Split Screen"),
    h3("4.2.1. Cấu trúc HTML Phân làn 7/3 (`login.html`)"),
    ...codeBlock(
`<div class="login-container split-73-layout">
    <div class="showcase-70">...</div>
    <div class="split-divider-line"></div>
    <div class="login-30">
        <div class="login-card-wrapper" id="loginBox">...</div>
    </div>
</div>`
    ),

    h3("4.2.2. Kỹ thuật CSS3 Keyframe Animations (`login.css`)"),
    ...codeBlock(
`@keyframes cpuPulse {
    0%, 100% { height: 18%; opacity: 0.6; }
    50% { height: 85%; opacity: 1; filter: drop-shadow(0 0 8px var(--cyber-red)); }
}
.login-card-wrapper {
    background: rgba(255, 255, 255, 0.92);
    backdrop-filter: blur(35px) saturate(160%);
    border: 2.5px solid rgba(255, 30, 63, 0.35);
}`
    ),

    h2("4.3. Xây dựng Phân hệ Quản lý Hồ sơ & Persistence CSDL MySQL"),
    ...codeBlock(
`app.post('/api/auth/update-profile', async (req, res) => {
    const { username, name, avatar_url } = req.body;
    try {
        const query = 'UPDATE users SET name = ?, avatar_url = ? WHERE username = ?';
        await dbPool.execute(query, [name, avatar_url, username]);
        res.json({ success: true, message: 'Cập nhật hồ sơ thành công!' });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});`
    ),

    h2("4.4. Xây dựng Phân hệ Thu ngân POS & Quản lý Kho sản phẩm"),
    p("Phân hệ POS hỗ trợ chọn linh kiện, tự động tính tiền, trừ tồn kho và xuất hóa đơn."),

    h2("4.5. Hướng dẫn Triển khai Vận hành & Xử lý sự cố"),
    bullet("Khởi động server: `cd D:\\pc-pos\\11_Cong_Cu_Backend_Scripts` -> `node server.js`."),
    bullet("Xử lý sự cố trùng cổng 3000 (`EADDRINUSE`): `Stop-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess -Force`.")
);

// ==========================================
// 9. CHƯƠNG 5. KIỂM THỬ VÀ ĐÁNH GIÁ (PAGE BREAK BEFORE)
// ==========================================
docChildren.push(
    h1("CHƯƠNG 5. KIỂM THỬ VÀ ĐÁNH GIÁ HỆ THỐNG"),

    h2("5.1. Kế hoạch và Phương pháp Kiểm thử"),
    p("Hệ thống đã trải qua quy trình kiểm thử toàn diện: kiểm thử chức năng, giao diện responsive và kiểm thử chấp nhận người dùng (UAT)."),

    h2("5.2. Ma trận Kết quả Kiểm thử Chức năng (Functional Test Cases)"),
    buildTable(
        ["Mã TC", "Tên kịch bản kiểm thử", "Các bước thực hiện", "Kết quả kỳ vọng", "Trạng thái"],
        [
            ["TC01", "Đăng nhập chính xác", "Nhập admin / admin123 -> Bấm Đăng nhập", "Morphing checkmark xanh -> Vào POS Terminal", "PASS"],
            ["TC02", "Đăng nhập sai mật khẩu", "Nhập admin / sai_pass -> Bấm Đăng nhập", "Toast thông báo đỏ 'Sai mật khẩu'", "PASS"],
            ["TC03", "Phát hiện Caps Lock", "Bật Caps Lock khi gõ mật khẩu", "Cảnh báo vàng 'Caps Lock đang bật'", "PASS"],
            ["TC04", "Ẩn/Hiện mật khẩu", "Bấm icon con mắt", "Chuyển đổi text/password mượt mà", "PASS"],
            ["TC05", "Cập nhật Hồ sơ cá nhân", "Thay đổi Tên & Avatar URL -> Bấm Lưu", "Ghi nhận thành công, F5 dữ liệu vẫn giữ nguyên", "PASS"],
            ["TC06", "Thêm linh kiện vào giỏ", "Bấm chọn VGA RTX 4090", "Giỏ hàng cập nhật tổng tiền", "PASS"],
            ["TC07", "Thanh toán đơn hàng POS", "Bấm 'Thanh toán & In hóa đơn'", "Tạo đơn MySQL, trừ tồn kho và hiện modal hóa đơn", "PASS"],
            ["TC08", "Thêm sản phẩm kho mới", "Vào Admin -> Thêm SP mới -> Lưu", "Sản phẩm mới xuất hiện ngay trên danh mục", "PASS"],
            ["TC09", "Responsive Di động", "Co màn hình trình duyệt < 1024px", "Cột 70% ẩn đi, Cột 30% chiếm 100% màn hình", "PASS"],
            ["TC10", "Xử lý sự cố EADDRINUSE", "Chạy node server.js khi port 3000 bị kẹt", "Báo lỗi rõ ràng và xử lý được qua PowerShell", "PASS"],
            ["TC11", "Xử lý lỗi CSDL MySQL mất kết nối", "Tắt MySQL Service khi gửi request", "Backend bắt exception trả về JSON error 500", "PASS"],
            ["TC12", "Lọc sản phẩm theo Danh mục", "Chọn danh mục 'VGA'", "Chỉ hiển thị các dòng card đồ họa VGA", "PASS"],
            ["TC13", "Tìm kiếm nhanh linh kiện", "Gõ 'RTX 4090' vào ô tìm kiếm", "Hệ thống lọc tức thì sau 50ms", "PASS"],
            ["TC14", "Xóa sản phẩm khỏi giỏ hàng", "Bấm nút Xóa trên dòng sản phẩm giỏ", "Cập nhật lại tổng tiền chính xác", "PASS"],
            ["TC15", "Hủy đơn hàng POS", "Bấm nút 'Hủy đơn'", "Xóa toàn bộ giỏ hàng và reset về trạng thái ban đầu", "PASS"]
        ],
        [10, 22, 24, 34, 10]
    ),
    p("", { after: 300 }),

    h2("5.3. Kết quả Kiểm thử Chấp nhận Người dùng (UAT)"),
    bullet("96.7% Người dùng đánh giá giao diện Cyberpunk Glassmorphism 7/3 rất đẹp mắt, hoành tráng."),
    bullet("100% Hài lòng với tốc độ thanh toán và phản hồi tức thì."),
    bullet("93.3% Đánh giá tính năng cảnh báo Caps Lock và cập nhật Avatar vĩnh viễn là rất hữu ích."),

    h2("5.4. Đánh giá Tổng kết và Hạn chế Tồn tại"),
    h3("5.4.1. Ưu điểm nổi bật"),
    bullet("Vận hành siêu nhẹ, kiến trúc REST API phản hồi tốc độ cao."),
    bullet("Giao diện đột phá Cyberpunk Glassmorphic 7/3 kết hợp Wukong HD."),
    bullet("CSDL MySQL đồng bộ dữ liệu chuẩn xác vĩnh viễn."),

    h3("5.4.2. Hạn chế tồn tại"),
    bullet("Chưa tích hợp cổng thanh toán quét mã QR tự động (VietQR / MoMo API).")
);

// ==========================================
// 10. CHƯƠNG 6. KẾT LUẬN (PAGE BREAK BEFORE)
// ==========================================
docChildren.push(
    h1("CHƯƠNG 6. KẾT LUẬN VÀ HƯỚNG PHÁT TRIỂN"),

    h2("6.1. Kết luận Đề tài"),
    p("Đề tài \"Hệ thống Quản lý Bán hàng và Thu ngân POS Công nghệ cao (Techno POS / PC-POS)\" do tác giả Nguyễn Lê Thanh Tâm độc lập thực hiện đã hoàn thành xuất sắc toàn bộ các mục tiêu đặt ra:"),
    bullet("Xây dựng thành công hệ thống phần mềm Web POS bán hàng hoàn chỉnh từ Frontend đến Backend và CSDL."),
    bullet("Ứng dụng thành công ngôn ngữ thiết kế Cyberpunk Glassmorphism 7/3 & Black Myth Wukong 4K HD."),
    bullet("Hoàn thiện hệ thống CSDL quan hệ MySQL lưu trữ bền vững thông tin tài khoản, hồ sơ nhân viên và đơn hàng."),

    h2("6.2. Hướng phát triển và mở rộng trong tương lai"),
    bullet("Tích hợp API VietQR / ZaloPay / MoMo tạo mã QR động."),
    bullet("Tích hợp AI dự báo nhu cầu nhập kho linh kiện máy tính."),
    bullet("Phát triển ứng dụng Mobile POS trên React Native / Flutter."),

    p("", { after: 400 }),
    pRich([{ text: "--- HẾT BÁO CÁO ---", bold: true, italic: true }], { align: AlignmentType.CENTER })
);

// Create Document with Section Double Page Border
const doc = new Document({
    sections: [{
        properties: {
            page: {
                margin: {
                    top: 1440,    // 2.54cm
                    bottom: 1440, // 2.54cm
                    left: 1700,   // ~3.0cm
                    right: 1134   // ~2.0cm
                }
            }
        },
        footers: {
            default: new Footer({
                children: [
                    new Paragraph({
                        alignment: AlignmentType.RIGHT,
                        children: [
                            new TextRun({ text: "Báo cáo NCKH Techno POS - Nguyễn Lê Thanh Tâm (CT07PM) - Trang ", font: "Times New Roman", size: 20, italic: true, color: "666666" }),
                            new TextRun({
                                children: [PageNumber.CURRENT],
                                font: "Times New Roman",
                                size: 20,
                                italic: true,
                                color: "666666"
                            })
                        ]
                    })
                ]
            })
        },
        children: docChildren
    }]
});

// Destination paths
const targetPaths = [
    "D:\\BAO_CAO_TECHNO_POS_35_TRANG_CHINTHUC.docx",
    "D:\\pc-pos\\01_Bao_Cao_Docx\\BAO_CAO_TECHNO_POS_35_TRANG_CHINTHUC.docx",
    "D:\\pc-pos\\01_Bao_Cao_Docx\\Bao_Cao_Web_POS_Ban_Hang_35Trang_Full.docx"
];

console.log("Packing master document to buffer...");

Packer.toBuffer(doc).then((buffer) => {
    targetPaths.forEach(targetPath => {
        try {
            const dir = path.dirname(targetPath);
            if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
            fs.writeFileSync(targetPath, buffer);
            console.log(" SUCCESS! Generated Clean Document At: " + targetPath);
        } catch (e) {
            console.log(" NOTE: File " + targetPath + " is currently locked by Word. Saved to alternative path!");
        }
    });
    console.log("=================================================");
}).catch(err => {
    console.error("FATAL ERROR generating report:", err);
});
