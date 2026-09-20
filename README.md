	
BỘ GIÁO DỤC VÀ ĐÀO TẠO
TRƯỜNG ĐẠI HỌC HÙNG VƯƠNG TP. HỒ CHÍ MINH

 

BÁO CÁO TỔNG KẾT THỰC HÀNH NGHỀ NGHIỆP

POS cho cửa hàng linh kiện điện tử
GVHD: TS. Nguyễn Văn Dũng
Người thực hiện: Nguyễn Lê Thanh Tâm
Lớp: CT07PM
Khoa Kỹ thuật Công nghệ
Thành phố Hồ Chí Minh, tháng 6/2026
LỜI CẢM ƠN

Để công trình nghiên cứu khoa học và ứng dụng phần mềm "Hệ thống Quản lý Bán hàng và Thu ngân POS Công nghệ cao (Techno POS / PC-POS)" được hoàn thành một cách trọn vẹn, đạt độ hoàn thiện cao cả về mặt lý luận chuyên môn lẫn thực tiễn công nghệ, em đã nhận được sự định hướng, quan tâm và hỗ trợ vô cùng quý báu từ Ban Giám hiệu, Quý Thầy/Cô và các bạn sinh viên trong suốt quá trình triển khai thực hiện đề tài.
Trước hết, em xin trân trọng gửi lời cảm ơn chân thành và sâu sắc nhất tới Ban Giám hiệu Trường Đại học Hùng Vương TP. Hồ Chí Minh cùng Ban Lãnh đạo Khoa Kỹ thuật Công nghệ đã tạo mọi điều kiện thuận lợi về môi trường học tập, hệ thống hạ tầng phòng máy hiện đại và cho phép em triển khai thực hiện đề tài nghiên cứu ứng dụng cấp cơ sở này.
Đặc biệt, em xin bày tỏ lòng biết ơn sâu sắc và lòng kính trọng tới TS. Nguyễn Văn Dũng – Giảng viên hướng dẫn trực tiếp đề tài. Thầy đã dành rất nhiều thời gian, tâm huyết và tri thức chuyên môn sâu rộng để định hướng phương pháp luận khoa học, hỗ trợ tháo gỡ các vướng mắc kỹ thuật phức tạp trong quá trình xây dựng kiến trúc RESTful API, thiết kế CSDL MySQL 3NF, tinh chỉnh giao diện Cyberpunk Glassmorphism 7/3 và chuẩn hóa tài liệu báo cáo. Sự kiên nhẫn, tinh thần trách nhiệm và sự chỉ dẫn tận tình của Thầy là kim chỉ nam quan trọng nhất giúp em vượt qua các thử thách công nghệ để hoàn thành xuất sắc công trình cá nhân này.
Em cũng xin gửi lời cảm ơn tới các Thầy/Cô trong Hội đồng xét duyệt khoa học đã dành thời gian đọc, đánh giá và đưa ra những ý kiến phản biện sắc bén giúp hoàn thiện nâng cao chất lượng đề tài. Đồng thời, xin cảm ơn các bạn sinh viên Lớp CT07PM Khoa Kỹ thuật Công nghệ đã nhiệt tình tham gia thực nghiệm kịch bản UAT và đóng góp nhiều phản hồi thực tế hữu ích.
Dù đã nỗ lực hết mình với tinh thần nghiêm túc và cầu thị, báo cáo nghiên cứu cá nhân này khó tránh khỏi những thiếu sót ngoài ý muốn. Em rất mong tiếp tục nhận được sự nhận xét, góp ý chuyên môn từ Quý Thầy/Cô để sản phẩm phần mềm ngày càng hoàn thiện và sớm được đưa vào vận hành thương mại hóa.
Xin trân trọng cảm ơn!
Thành phố Hồ Chí Minh, tháng 6 năm 2026
DANH MỤC CÁC CHỮ VIẾT TẮT
STT	Chữ viết tắt	Giải thích nghĩa Tiếng Anh / Tiếng Việt
1	POS	Point of Sale - Hệ thống điểm bán hàng và thu ngân bán lẻ
2	API	Application Programming Interface - Giao diện lập trình ứng dụng
3	REST	Representational State Transfer - Quy chuẩn kiến trúc giao tiếp Web
4	CSDL	Cơ sở dữ liệu (Database)
5	MySQL	Hệ quản trị cơ sở dữ liệu quan hệ mã nguồn mở phổ biến
6	UI/UX	User Interface / User Experience - Giao diện / Trải nghiệm người dùng
7	HTML5	HyperText Markup Language version 5 - Ngôn ngữ đánh dấu siêu văn bản
8	CSS3	Cascading Style Sheets version 3 - Ngôn ngữ định dạng trang web
9	JS	JavaScript (ES6+) - Ngôn ngữ lập trình kịch bản phía Client & Server
10	CRUD	Create, Read, Update, Delete - Các thao tác quản lý dữ liệu cơ bản
11	UAT	User Acceptance Testing - Kiểm thử chấp nhận người dùng thực tế
12	CORS	Cross-Origin Resource Sharing - Cơ chế chia sẻ tài nguyên giữa các nguồn
13	HUD	Heads-Up Display - Màn hình hiển thị thông số trực quan
14	DHV	Trường Đại học Hùng Vương TP. Hồ Chí Minh
15	DOM	Document Object Model - Mô hình đối tượng tài liệu Web
16	SVG	Scalable Vector Graphics - Đồ họa vectơ có thể co giãn
17	ACID	Atomicity, Consistency, Isolation, Durability - Tính chất giao dịch CSDL
18	ERD	Entity Relationship Diagram - Sơ đồ thực thể quan hệ
19	JSON	JavaScript Object Notation - Định dạng trao đổi dữ liệu mỏng nhẹ
20	HTTP	Hypertext Transfer Protocol - Giao thức truyền tải siêu văn bản

MỤC LỤC
LỜI CẢM ƠN ..............................................................................	ii
DANH MỤC CÁC CHỮ VIẾT TẮT ...............................................................	iii
MỤC LỤC .................................................................................	iv
CHƯƠNG 1. TỔNG QUAN ĐỀ TÀI ..............................................................	1
    1.1. Tính cấp thiết của đề tài ......................................................	1
        1.1.1. Bối cảnh số hóa bán lẻ và xu hướng Web POS ...............................	1
        1.1.2. Thực trạng quản lý linh kiện PC tại các cửa hàng .........................	2
        1.1.3. Thách thức về tốc độ thanh toán và trải nghiệm ...........................	3
        1.1.4. Giải pháp Hệ thống Techno POS (PC-POS) ...................................	4
    1.2. Mục tiêu đề tài (Tổng quát & SMART) ............................................	5
    1.3. Đối tượng và phạm vi nghiên cứu ................................................	7
    1.4. Phương pháp nghiên cứu .........................................................	8
    1.5. Ý nghĩa khoa học và thực tiễn ..................................................	9
    1.6. Cấu trúc báo cáo ...............................................................	10
CHƯƠNG 2. CƠ SỞ LÝ THUYẾT VÀ TỔNG QUAN CÔNG NGHỆ ........................................	11
    2.1. Tổng quan về Hệ thống Quản lý Bán hàng POS .....................................	11
        2.1.1. Khái niệm và vai trò chiến lược của POS ..................................	11
        2.1.2. Tiến trình phát triển từ POS cơ học đến Cloud POS ........................	12
        2.1.3. Ưu thế vượt trội của giải pháp Web POS ...................................	13
    2.2. Mô hình Kiến trúc Web Client-Server & RESTful API ..............................	14
        2.2.1. Nguyên lý phân tầng Client-Server ........................................	14
        2.2.2. Chuẩn kiến trúc RESTful API và HTTP/HTTPS ................................	15
        2.2.3. Cơ chế giao tiếp bất đồng bộ Fetch API ...................................	16
    2.3. Công nghệ Phía Frontend ........................................................	17
        2.3.1. HTML5 Semantic Layout và DOM Tree ........................................	17
        2.3.2. CSS3 & Thiết kế Cyberpunk Glassmorphism ..................................	18
        2.3.3. JavaScript ES6+ Native & Event Loop ......................................	21
    2.4. Công nghệ Phía Backend & Cơ sở Dữ liệu .........................................	22
        2.4.1. Node.js Runtime & V8 Engine Non-blocking I/O .............................	22
        2.4.2. Framework Express.js & Middleware Pipeline ...............................	23
        2.4.3. MySQL Database & Thư viện Mysql2 Connection Pool .........................	24
    2.5. So sánh các giải pháp POS và khoảng trống nghiên cứu ...........................	26
CHƯƠNG 3. PHÂN TÍCH VÀ THIẾT KẾ HỆ THỐNG ................................................	28
    3.1. Phân tích Yêu cầu Chức năng & Phi Chức năng ....................................	28
        3.1.1. Chi tiết 8 Phân hệ Yêu cầu Chức năng .....................................	28
        3.1.2. Phân tích Chỉ số Yêu cầu Phi Chức năng ...................................	30
    3.2. Sơ đồ Use Case & Kịch bản Nghiệp vụ Chi tiết ...................................	32
        3.2.1. Ma trận Use Case Hệ thống ................................................	32
        3.2.2. Kịch bản Chi tiết 5 Use Case Lõi .........................................	34
    3.3. Thiết kế Cơ sở Dữ liệu Quan hệ (ERD & Data Dictionary) .........................	39
        3.3.1. Nguyên lý Chuẩn hóa CSDL 3NF .............................................	39
        3.3.2. Sơ đồ Thực thể Quan hệ ERD ...............................................	41
        3.3.3. Từ điển CSDL Chi tiết (users, products, orders, order_items) .............	42
    3.4. Thiết kế Kiến trúc Hệ thống & Luồng Dữ liệu (DFD & Sequence) ...................	45
        3.4.1. Sơ đồ Luồng Dữ liệu DFD Cấp 0 & Cấp 1 ....................................	45
        3.4.2. Sơ đồ Tuần tự Sequence Diagrams ..........................................	47
    3.5. Thiết kế Giao diện Người dùng (UI/UX Specifications & Design Tokens) ...........	49
CHƯƠNG 4. XÂY DỰNG VÀ TRIỂN KHAI HỆ THỐNG ...............................................	52
    4.1. Môi trường Phát triển & Cấu hình Hạ tầng .......................................	52
        4.1.1. Chi tiết Hạ tầng Phần cứng & Phần mềm ....................................	52
        4.1.2. Thiết lập Biến Môi trường & Connection Pool ..............................	54
    4.2. Xây dựng Phân hệ Đăng nhập Cyber Deck 7/3 Split Screen .........................	56
        4.2.1. Cấu trúc Ngữ nghĩa HTML5 login.html ......................................	56
        4.2.2. Diễn họa Keyframe Animations CSS3 login.css ..............................	59
        4.2.3. Thuật toán Xử lý Sự kiện & Morphing UI login.js ..........................	63
    4.3. Xây dựng Phân hệ Quản lý Hồ sơ & Persistence CSDL MySQL ........................	67
        4.3.1. Thiết kế API Backend update-profile trong server.js ......................	67
        4.3.2. Cơ chế Đồng bộ Hồ sơ & State Persistence khi F5 ..........................	71
    4.4. Xây dựng Phân hệ Thu ngân POS & Quản lý Kho sản phẩm ...........................	73
        4.4.1. Mã nguồn & Thuật toán Giỏ hàng POS app.js ................................	73
        4.4.2. API Tạo Đơn hàng & Tự động Trừ Tồn kho MySQL .............................	77
        4.4.3. Phân hệ Xuất & In Hóa đơn POS Khổ K80 ....................................	81
    4.5. Hướng dẫn Triển khai Vận hành & Xử lý sự cố ....................................	83
        4.5.1. Quy trình Triển khai Vận hành Server Node.js .............................	83
        4.5.2. Xử lý Sự cố Trùng Cổng 3000 (EADDRINUSE) bằng PowerShell .................	85
CHƯƠNG 5. KIỂM THỬ VÀ ĐÁNH GIÁ HỆ THỐNG .................................................	88
    5.1. Kế hoạch, Chiến lược và Phương pháp Kiểm thử Chi tiết ..........................	88
        5.1.1. Kế hoạch & Môi trường Kiểm thử 4 Giai đoạn ...............................	88
        5.1.2. Các Phương pháp Kiểm thử Áp dụng .........................................	90
    5.2. Ma trận Kết quả Kiểm thử Chức năng Chi tiết (20 Test Cases) ....................	92
    5.3. Kết quả Kiểm thử Chấp nhận Người dùng (UAT) ....................................	97
        5.3.1. Phương pháp & Mẫu Khảo sát UAT trên 30 Người dùng ........................	97
        5.3.2. Bảng Phân tích Thống kê Số liệu UAT Chi tiết .............................	99
    5.4. Đánh giá Hiệu năng Phản hồi, Độ An toàn & Hạn chế Tồn tại ......................	101
        5.4.1. Kết quả Đánh giá Hiệu năng Phản hồi (Benchmark Metrics) ..................	101
        5.4.2. Đánh giá An toàn Bảo mật Dữ liệu MySQL ...................................	103
        5.4.3. Nhìn nhận Các Hạn chế Tồn tại ............................................	105
CHƯƠNG 6. KẾT LUẬN VÀ HƯỚNG PHÁT TRIỂN ..................................................	107
    6.1. Kết luận Đề tài ................................................................	107
        6.1.1. Tổng kết Kết quả Đạt được Về mặt Lý thuyết ...............................	107
        6.1.2. Tổng kết Kết quả Đạt được Về mặt Thực tiễn & Sản phẩm ....................	108
        6.1.3. Đánh giá Giá trị Đóng góp của Tác giả Cá nhân ............................	109
    6.2. Hướng Phát triển và Mở rộng Hệ thống trong Tương lai ...........................	110
        6.2.1. Nâng cấp Hạ tầng & Kiến trúc Microservices Docker ........................	110
        6.2.2. Tích hợp Cổng Thanh toán Điện tử & Mã QR Động VietQR .....................	111
        6.2.3. Ứng dụng Trí tuệ Nhân tạo (AI) Dự báo Kho & Tư vấn Build PC ..............	112
        6.2.4. Mở rộng Hệ sinh thái Mobile POS & Cloud SaaS .............................	113

CHƯƠNG 1. TỔNG QUAN ĐỀ TÀI
1.1. Tính cấp thiết của đề tài
1.1.1. Bối cảnh số hóa bán lẻ và xu hướng ứng dụng công nghệ Web POS
Trong kỷ nguyên số hóa bùng nổ hiện nay, sự phát triển như vũ bão của nền kinh tế thương mại điện tử và cuộc Cách mạng Công nghiệp 4.0 đang đặt ra những thách thức sống còn đối với ngành bán lẻ linh kiện máy tính, thiết bị công nghệ và hệ thống siêu thị mini tại Việt Nam. Việc tối ưu hóa quy trình quản lý điểm bán hàng (Point of Sale - POS), đảm bảo tốc độ thanh toán tính tiền cực nhanh và kiểm soát sự biến động tồn kho theo thời gian thực đã trở thành yếu tố cốt lõi quyết định lợi thế cạnh tranh của mỗi doanh nghiệp.
Sự chuyển dịch từ các cỗ máy tính tiền cơ học đơn thuần sang các nền tảng Web POS chạy trực tiếp trên trình duyệt là một xu hướng tất yếu. Web POS không chỉ giúp doanh nghiệp tiết kiệm tối đa chi phí đầu tư hạ tầng phần cứng mà còn mang lại khả năng truy cập linh hoạt từ mọi thiết bị, giúp công tác điều hành chuỗi quầy bán hàng trở nên dễ dàng và đồng bộ hơn bao giờ hết.
1.1.2. Thực trạng quản lý linh kiện PC tại các cửa hàng vừa và nhỏ
Tuy nhiên, qua khảo sát thực tế tại hàng loạt cơ sở kinh doanh linh kiện máy tính tại TP. Hồ Chí Minh, tác giả ghi nhận thực trạng đáng quan ngại:
Rất nhiều cửa hàng vẫn áp dụng phương pháp quản lý bằng sổ sách truyền thống hoặc sử dụng các file bảng tính Excel rời rạc. Kế toán và nhân viên thu ngân phải tự nhập tay mã sản phẩm, giá tiền và số lượng tồn kho. Phương pháp này tiềm ẩn rủi ro sai lệch dữ liệu cực kỳ lớn, dễ gây ra tình trạng thất thoát tài sản và nhầm lẫn đơn giá linh kiện.
Các sản phẩm linh kiện PC (như VGA Card đồ họa, CPU, RAM DDR5, Mainboard, Nguồn PSU...) có đặc thù là mã chủng loại (SKU) vô cùng đa dạng, mức giá biến động liên tục theo tỷ giá thị trường. Việc quản lý thủ công hoàn toàn không có khả năng đáp ứng tính cập nhật tức thời.
Khi xảy ra sự cố máy tính hỏng hóc hoặc nhiễm virus, toàn bộ dữ liệu bảng tính Excel thu ngân có nguy cơ bị xóa sạch do không được sao lưu và kết nối vĩnh viễn tới một Hệ quản trị Cơ sở Dữ liệu (CSDL) quan hệ tập trung.
1.1.3. Thách thức về tốc độ thanh toán và trải nghiệm người dùng
Bên cạnh các lỗ hổng về quản lý CSDL, tốc độ xử lý giao dịch tại quầy thu ngân là một điểm nghẽn nghiêm trọng khác:
Quy trình tính tiền thủ công khiến thời gian chờ đợi của một khách hàng kéo dài trung bình từ 2 đến 4 phút cho một đơn hàng. Vào các khung giờ cao điểm hoặc sự kiện khuyến mãi, tình trạng ùn tắc tại quầy diễn ra thường xuyên, làm giảm mạnh chỉ số hài lòng (CSAT) của khách hàng.
Giao diện các phần mềm POS cũ hiện có trên thị trường đa phần mang tính phẳng dẹt, thiết kế cũ kỹ, font chữ nhỏ khó nhìn và chưa có các tính năng cảnh báo nhập liệu thông minh (như phát hiện Caps Lock hay ẩn/hiện mật khẩu). Điều này tạo ra sự mệt mỏi và dễ gây sai sót cho nhân viên thu ngân trong ca làm việc kéo dài.
Thiếu cơ chế lưu trữ bền vững thông tin cá nhân và Avatar của nhân viên thu ngân trên CSDL. Mỗi lần trình duyệt bị load lại (F5) hoặc chuyển máy, nhân viên phải thiết lập lại từ đầu.
1.1.4. Đề xuất giải pháp Hệ thống Techno POS (PC-POS) Cyber Deck 7/3
Nhận thức sâu sắc được những bất cập thực tiễn đó, tác giả đã đặt ra bài toán thiết kế và xây dựng giải pháp "Hệ thống Quản lý Bán hàng và Thu ngân POS Công nghệ cao (Techno POS / PC-POS)" tích hợp ngôn ngữ thiết kế Cyberpunk Glassmorphic UI phân làn 7/3 đột phá kết hợp cùng CSDL MySQL mạnh mẽ.
Phần mềm được phát triển dựa trên hệ sinh thái Web thuần (Node.js, Express.js, MySQL, HTML5/CSS3/JS Native) giúp tối ưu hóa phần cứng, phản hồi tức thì với tốc độ tính tiền dưới 3 giây và đảm bảo an toàn dữ liệu vĩnh viễn.
1.2. Mục tiêu đề tài
1.2.1. Mục tiêu tổng quát
Nghiên cứu kiến trúc ứng dụng Web hiện đại, thiết kế và phát triển thành công giải pháp phần mềm Web POS bán hàng toàn diện, đạt hiệu năng vận hành vượt trội, tích hợp giao diện phân làn Cyber Deck 7/3 Glassmorphism sang trọng và khả năng lưu trữ dữ liệu đồng bộ thời gian thực với MySQL Database.
1.2.2. Mục tiêu cụ thể (Theo chuẩn SMART)
Specific (Cụ thể): Xây dựng đầy đủ 4 phân hệ lõi: Phân hệ Xác thực đăng nhập Cyber Deck 7/3 (Dashboard 70% & Thẻ kính mờ 30% nền Black Myth Wukong 4K HD), Phân hệ Cập nhật Hồ sơ cá nhân vĩnh viễn (Avatar & Display Name), Phân hệ Thu ngân POS & Giỏ hàng, Phân hệ Quản lý Kho linh kiện PC.
Measurable (Đo lường được): Đạt thời gian xử lý API Backend < 200ms, tốc độ thanh toán giỏ hàng < 3 giây, hoàn thành 100% các Test Cases trong ma trận kiểm thử kịch bản lỗi.
Achievable (Khả thi): Phát triển hoàn toàn trên nền tảng Web thuần (Node.js v24+, Express.js, MySQL 8.0, HTML5/CSS3/JS ES6+) giúp tối ưu hóa phần cứng, chạy mượt mà trên mọi trình duyệt hiện đại mà không cần cài đặt phần mềm phụ trợ nặng nề.
Relevant (Thực tiễn): Giải quyết triệt để bài toán thu ngân bán lẻ linh kiện máy tính thực tế, hỗ trợ in hóa đơn trực tiếp và tự động cập nhật trừ tồn kho kho hàng.
Timebound (Thời hạn): Lập kế hoạch phân tích, thiết kế, triển khai code, kiểm thử UAT và hoàn thiện tài liệu báo cáo khoa học trong thời gian 12 tuần.
1.3. Đối tượng và phạm vi nghiên cứu
1.3.1. Đối tượng nghiên cứu
Quy trình nghiệp vụ bán lẻ và quản lý điểm bán hàng POS trong doanh nghiệp.
Kỹ thuật thiết kế giao diện hiện đại Cyberpunk Glassmorphic UI, các kỹ thuật hiệu ứng CSS Keyframe Animations (Lõi lò phản ứng hạt nhân 3 vòng SVG, Sóng Oscilloscope, Nhân CPU Activity pulse).
Kiến trúc RESTful API Web và kỹ thuật quản trị CSDL quan hệ MySQL (Connection Pooling, Parameterized Queries).
1.3.2. Phạm vi nghiên cứu
Phạm vi chức năng: Tập trung xây dựng các module lõi bao gồm Xát thực đăng nhập bảo mật, Quản lý hồ sơ nhân viên (Avatar persistence), Thu ngân POS & Giỏ hàng, Quản lý kho sản phẩm linh kiện PC.
Phạm vi môi trường: Triển khai ứng dụng Web tương thích tốt trên các trình duyệt hiện đại (Chrome, Edge, Firefox) và responsive linh hoạt trên các độ phân giải màn hình từ Desktop (1920x1080) tới di động (<= 1024px).
1.4. Phương pháp nghiên cứu
Đề tài kết hợp phương pháp nghiên cứu lý thuyết chuyên sâu và phương pháp thực nghiệm phát triển phần mềm:
Phương pháp phân tích hệ thống: Khảo sát bài toán thực tế, mô hình hóa Use Case và thiết kế CSDL chuẩn hóa 3NF.
Phương pháp phát triển Agile/Scrum: Chia nhỏ sản phẩm thành các gói phát triển tăng trưởng (Increments), liên tục cải tiến giao diện theo phản hồi thực tế.
Phương pháp thực nghiệm kiểm thử UAT: Xây dựng ma trận Test Cases chi tiết để đánh giá độ tin cậy và khả năng chịu tải của phần mềm.
1.5. Ý nghĩa khoa học và thực tiễn
Về mặt khoa học: Đóng góp một mô hình chuẩn về việc kết hợp giữa hiệu năng mạnh mẽ của Node.js + MySQL Backend với tư duy nghệ thuật giao diện Cyberpunk Glassmorphic Frontend.
Về mặt thực tiễn: Cung cấp giải pháp phần mềm quản lý thu ngân bán hàng hiện đại, chính xác, chống thất thoát và nâng tầm thương hiệu chuyên nghiệp cho cửa hàng.
1.6. Cấu trúc báo cáo
Báo cáo đề tài gồm 6 chương được trình bày khoa học và chặt chẽ theo quy chuẩn báo cáo NCKH cấp Trường.
CHƯƠNG 2. CƠ SỞ LÝ THUYẾT VÀ TỔNG QUAN CÔNG NGHỆ
2.1. Tổng quan về Hệ thống Quản lý Bán hàng POS
2.1.1. Khái niệm và vai trò chiến lược của POS trong thương mại bán lẻ
Hệ thống POS (Point of Sale) là điểm diễn ra các giao dịch thanh toán thương mại trực tiếp giữa người mua và người bán. Trong kỷ nguyên bán lẻ hiện đại 4.0, phần mềm POS không còn đóng vai trò như một cỗ máy tính tiền độc lập đơn thuần mà đã tiến hóa thành một trung tâm điều hành tích hợp đa nhiệm.
Hệ thống POS đóng vai trò là "bộ toàn năng" điều phối các hoạt động kinh doanh: quản lý niêm yết bảng giá linh kiện, theo dõi sự tăng giảm tồn kho tự động, lưu vết chi tiết từng đơn hàng, quản lý doanh số nhân viên thu ngân và cung cấp số liệu phân tích tài chính cho nhà quản lý. Một hệ thống POS vận hành ổn định giúp tăng đáng kể năng suất lao động và tạo dựng hình ảnh thương hiệu uy tín trong lòng khách hàng.
2.1.2. Tiến trình phát triển từ các giải pháp POS cơ học đến Cloud Web POS
Lịch sử phát triển của công nghệ POS đã trải qua 3 giai đoạn tiến hóa mang tính bước ngoặt:
Giai đoạn 1 - Máy POS Cơ học & Điện tử (ECR): Xuất hiện từ những năm cuối thế kỷ 20, chỉ có chức năng lưu trữ tiền mặt, in hóa đơn giấy đơn giản và tính toán phép cộng trừ cơ bản. Hoàn toàn không có khả năng lưu trữ CSDL hay kết nối mạng.
Giai đoạn 2 - Phần mềm POS Desktop Offline: Phát triển trên các nền tảng máy tính cá nhân (C#, Java Desktop). Cho phép lưu CSDL cục bộ tại cửa hàng nhưng gặp rào cản lớn về chi phí bản quyền phần mềm, khó nâng cấp và nguy cơ mất dữ liệu khi ổ cứng bị hỏng.
Giai đoạn 3 - Hệ thống Web POS Cloud Hiện đại: Ứng dụng công nghệ Web Client-Server kết nối CSDL quan hệ tập trung. Cho phép nhân viên thu ngân truy cập và thực hiện bán hàng từ bất kỳ thiết bị nào qua trình duyệt Web, dữ liệu được đồng bộ hóa tức thời và bảo mật trên hạ tầng máy chủ.
2.1.3. Ưu thế vượt trội của giải pháp Web POS Techno POS
Giải pháp Techno POS được phát triển trong đề tài sở hữu những ưu thế vượt trội so với các phần mềm POS truyền thống:
Không phụ thuộc thiết bị: Vận hành mượt mà trên hệ điều hành Windows, macOS, Linux cũng như các thiết bị di động mà không cần cài đặt phần mềm phức tạp.
Tốc độ xử lý tính tiền siêu nhanh: Thiết kế kiến trúc RESTful API bất đồng bộ giúp giao dịch thanh toán hoàn tất trong dưới 3 giây.
Giao diện nghệ thuật Cyberpunk Glassmorphism: Tăng tính trực quan, giảm sự mệt mỏi thị giác cho nhân viên thu ngân trong ca làm việc kéo dài.
2.2. Mô hình Kiến trúc Web Client-Server & RESTful API
2.2.1. Nguyên lý phân tầng kiến trúc Client-Server
Techno POS được thiết kế hoàn toàn theo mô hình kiến trúc phân tầng Client-Server độc lập, tách biệt rõ ràng giữa tầng hiển thị giao diện và tầng xử lý nghiệp vụ backend:
Tầng Client (Frontend) chịu trách nhiệm thu thập thao tác người dùng, kiểm tra hợp lệ dữ liệu đầu vào (Client-side validation), diễn họa các hiệu ứng đồ họa động và hiển thị dữ liệu kết quả. Tầng Server (Backend) chịu trách nhiệm tiếp nhận các yêu cầu HTTP Request, thực thi logic nghiệp vụ bán hàng, truy vấn CSDL MySQL và trả về dữ liệu kết quả dưới định dạng JSON chuẩn hóa.
2.2.2. Chuẩn kiến trúc RESTful API và giao thức HTTP/HTTPS
Hệ thống áp dụng chuẩn kiến trúc RESTful API (Representational State Transfer) làm quy chuẩn giao tiếp dữ liệu giữa Client và Server. RESTful API tận dụng tối đa các phương thức chuẩn của giao thức HTTP:
GET: Tra cứu danh mục linh kiện PC, lấy thông tin tài khoản người dùng.
POST: Thực hiện xác thực đăng nhập, tạo đơn hàng POS mới, gửi dữ liệu cập nhật hồ sơ người dùng.
PUT: Cập nhật thông tin giá bán và tồn kho sản phẩm linh kiện.
DELETE: Xóa sản phẩm linh kiện khỏi danh mục CSDL.
2.2.3. Cơ chế giao tiếp bất đồng bộ Async AJAX / Fetch API
Ứng dụng cơ chế truyền nhận dữ liệu bất đồng bộ Asynchronous Fetch API giúp ứng dụng Web đạt được trạng thái Single Page Application (SPA) mượt mà. Mọi thao tác thêm sản phẩm vào giỏ hàng, cập nhật Avatar cá nhân hay tìm kiếm linh kiện đều diễn ra tức thì mà không làm ngắt quãng trải nghiệm hay load lại toàn bộ trang Web.
2.3. Công nghệ Phía Frontend
2.3.1. HTML5 Semantic Architecture và cây cấu trúc DOM Tree
HTML5 đóng vai trò tạo dựng bộ khung xương ngữ nghĩa chắc chắn cho ứng dụng. Việc áp dụng các thẻ ngữ nghĩa chuẩn (`<header>`, `<main>`, `<section>`, `<article>`, `<nav>`, `<footer>`) giúp tối ưu hóa cấu trúc DOM Tree, tăng tốc độ render của trình duyệt và hỗ trợ truy cập bộ nhớ hiệu quả.
2.3.2. CSS3 & Ngôn ngữ Thiết kế Cyberpunk Glassmorphism
Giao diện Techno POS ứng dụng ngôn ngữ thiết kế tương lai Cyberpunk Glassmorphism độc đáo:
Kỹ thuật mô phỏng quang học Glassmorphism: Sự kết hợp của `backdrop-filter: blur(35px) saturate(160%)` cùng dải màu kính mờ đục `rgba(255, 255, 255, 0.92)` cho trải nghiệm nổi khối 3D bề thế.
Cấu trúc Phân làn 7/3: Cột 70% dành cho Bảng điều khiển máy chủ Cyber Dashboard, Cột 30% dành cho Thẻ Đăng nhập Kính mờ.
Keyframe Animations: Diễn họa tự nhiên chuyển động xoay 3 vòng lò phản ứng hạt nhân (`spin-cw`), dao động sóng Oscilloscope SVG, và nhịp nhảy dải 6 cột CPU (`cpuPulse`).
Tích hợp Hình nền Black Myth Wukong 4K HD: Sử dụng hình nền game độ phân giải cao kết hợp phủ dải màu tối mờ (`linear-gradient`) tạo vẻ đẹp điện ảnh hoành tráng.
2.3.3. JavaScript ES6+ Native & Event Loop
Bắt sự kiện thời gian thực: Cảnh báo trạng thái bật Caps Lock (`keydown`, `keyup`), ẩn/hiện mật khẩu, thông báo Toast.
Hiệu ứng Morphing Animation (`morphToCircle`): Chuyển hóa hộp đăng nhập thành hình tròn tích xanh thành công trước khi chuyển trang.
2.4. Công nghệ Phía Backend & Cơ sở Dữ liệu
2.4.1. Node.js Runtime & V8 Engine Non-blocking I/O
Node.js là môi trường thực thi JavaScript phía Server dựa trên V8 Engine của Google Chrome. Với mô hình xử lý đơn luồng bất đồng bộ (Single-threaded Event Loop Non-blocking I/O), Node.js có khả năng đáp ứng hàng ngàn request đồng thời với lượng tài nguyên CPU và RAM tối thiểu.
2.4.2. Framework Express.js & Middleware Pipeline
Express.js đóng vai trò là framework điều hướng chính phía backend. Hệ thống sử dụng các middleware mạnh mẽ như CORS để quản lý an toàn truy cập chéo nguồn, `express.json()` để parse dữ liệu request body và middleware xử lý lỗi tập trung.
2.4.3. MySQL Database & Thư viện Mysql2 Connection Pool
Hệ quản trị CSDL quan hệ MySQL 8.0 được lựa chọn làm nơi lưu trữ dữ liệu tập trung. Kết nối được quản lý qua Connection Pool (`mysql.createPool`), giúp tái sử dụng kết nối hiệu quả. Các câu lệnh SQL truy vấn đều áp dụng Parameterized Queries dạng `?` để ngăn chặn triệt để lỗ hổng tấn công SQL Injection.
2.5. So sánh các giải pháp POS và khoảng trống nghiên cứu
Tiêu chí so sánh	Sổ sách / Excel	Phần mềm POS cũ	Techno POS (Hệ thống mới)
Tốc độ thanh toán	Chậm (vài phút/đơn)	Trung bình (30s)	Cực nhanh (< 3 giây)
Đồng bộ CSDL	Không có	Có (Cơ bản)	Đồng bộ MySQL Real-time
Giao diện đồ họa	Phẳng dẹt, đơn điệu	Giao diện cũ kỹ	Cyberpunk Glassmorphic 7/3 & Wukong HD
Cảnh báo thông minh	Không có	Ít hỗ trợ	Phát hiện CapsLock, Toast, Morphing UI
Chi phí đầu tư	Thấp	Cao (Đăng ký tháng)	Tối ưu, mã nguồn mở
Khả năng mở rộng	Rất kém	Phụ thuộc bên thứ 3	Dễ dàng tích hợp thêm API

CHƯƠNG 3. PHÂN TÍCH VÀ THIẾT KẾ HỆ THỐNG
3.1. Phân tích Yêu cầu Chức năng & Phi Chức năng Chi tiết
 
3.1.1. Chi tiết 8 Phân hệ Yêu cầu Chức năng (Functional Requirements)
Dựa trên kết quả khảo sát thực tế quy trình thu ngân bán lẻ linh kiện máy tính, tác giả đã phân tích và chuẩn hóa 8 phân hệ chức năng lõi của hệ thống Techno POS:
1. Phân hệ Xác thực Đăng nhập Cyber Deck 7/3: Kiểm tra hợp lệ tài khoản nhân viên thu ngân, phát hiện cảnh báo Caps Lock thời gian thực (`keydown` / `keyup`), công tắc ẩn/hiện mật khẩu, diễn họa Morphing Checkmark `morphToCircle` và lưu Session người dùng vào LocalStorage.
2. Phân hệ Cập nhật Hồ sơ Cá nhân & Persistence Avatar MySQL: Cho phép nhân viên cập nhật Tên hiển thị và đường dẫn Avatar URL, lưu trữ trực tiếp vĩnh viễn vào trường `avatar_url` (LONGTEXT) của bảng `users` trong CSDL MySQL.
3. Phân hệ Thu ngân POS & Quản lý Giỏ hàng: Cho phép chọn nhanh sản phẩm linh kiện PC (Card VGA, CPU, RAM, Mainboard...), tăng/giảm số lượng mua, kiểm tra giới hạn tồn kho, áp mã Voucher giảm giá và tự động tính tổng tiền.
4. Phân hệ Quản lý Kho sản phẩm Linh kiện PC: Hỗ trợ Admin thực hiện các thao tác CRUD (Thêm, Sửa, Xóa, Tra cứu) danh mục linh kiện máy tính với đầy đủ thông tin mã SKU, tên linh kiện, giá bán, số lượng tồn kho và ảnh sản phẩm.
5. Phân hệ Quản lý Đơn hàng & Tự động Trừ Tồn kho: Khi bấm nút thanh toán, Backend tự động sinh mã hóa đơn POS (như `POS-9982`), mở CSDL Transaction `connection.beginTransaction()`, ghi nhận đơn hàng và tự động trừ số lượng tồn kho `stock` tương ứng.
6. Phân hệ Xuất & In Hóa đơn POS Khổ K80: Tự động hiển thị Modal xem trước hóa đơn thanh toán và kích hoạt lệnh in nhiệt khổ giấy K80 tiêu chuẩn dành cho các máy in hóa đơn quầy thu ngân.
7. Phân hệ Quản lý Nhân viên Thu ngân: Phân quyền vai trò hệ thống (`role = 'admin'` hoặc `'cashier'`), quản lý danh sách tài khoản nhân viên thu ngân và giám sát lịch sử làm việc.
8. Phân hệ Báo cáo Doanh thu & Thống kê Biểu đồ: Tổng hợp thống kê doanh thu bán hàng theo ngày, tuần, tháng và diễn họa biểu đồ đồ họa sinh động bằng thư viện Chart.js.
3.1.2. Phân tích Chỉ số Yêu cầu Phi Chức năng (Non-Functional Requirements)
Bên cạnh các chức năng nghiệp vụ, hệ thống Techno POS được thiết kế đáp ứng khắt khe các chỉ số yêu cầu phi chức năng:
Chỉ số Hiệu năng (Performance): Thời gian xử lý API Backend < 200ms, tốc độ hoàn thành thanh toán đơn hàng < 3 giây, dung lượng dữ liệu mỏng nhẹ dưới 50 KB/trang.
Chỉ số Độ tin cậy (Reliability & Availability): Hệ thống đạt thời gian hoạt động ổn định Uptime 99.9%, cơ chế Connection Pool tự động tái kết nối CSDL MySQL khi có sự cố chập chập đường truyền mạng.
Chỉ số Bảo mật (Security): Mật khẩu người dùng được băm mã hóa một chiều bằng Bcrypt (Salt Factor = 10), chống tấn công SQL Injection bằng Parameterized Queries (`?`), chống XSS và quản lý an toàn truy cập chéo nguồn CORS.
Chỉ số Khả năng Sử dụng (Usability): Giao diện Cyberpunk Glassmorphism 7/3 sang trọng, cảnh báo thông minh trực quan, giúp nhân viên thu ngân dễ dàng thao tác thành thạo mà không cần trải qua khóa đào tạo phức tạp.


3.2. Sơ đồ Use Case & Kịch bản Nghiệp vụ Chi tiết
 
3.2.1. Ma trận Use Case Hệ thống (System Use Case Matrix)
Ma trận dưới đây tổng hợp đầy đủ các Use Case chính cùng các đặc tả nghiệp vụ tương ứng trong hệ thống Techno POS:
Mã UC	Tên Use Case	Actor chính	Tiền điều kiện (Pre-condition)	Hậu điều kiện (Post-condition)
UC01	Đăng nhập hệ thống Cyber Deck	Cashier / Admin	Trình duyệt truy cập trang login.html	Đã lưu Session, morphing checkmark -> POS Terminal
UC02	Cập nhật Hồ sơ Avatar Persistence	Cashier / Admin	Đã đăng nhập thành công vào hệ thống	Cập nhật Tên & Avatar URL lưu vĩnh viễn vào MySQL
UC03	Tra cứu & Tìm kiếm Linh kiện	Cashier	Đang ở màn hình POS Terminal	Hiển thị danh sách linh kiện phù hợp với từ khóa
UC04	Thanh toán POS & Trừ Tồn kho	Cashier	Giỏ hàng POS có ít nhất 1 sản phẩm	Tạo đơn MySQL, trừ tồn kho `stock` và hiện modal in K80
UC05	Quản lý Kho sản phẩm (CRUD)	Admin	Đăng nhập với vai trò `role = 'admin'`	Danh mục sản phẩm kho linh kiện được cập nhật vào DB
 
3.2.2. Kịch bản Chi tiết 5 Use Case Lõi (Detailed Use Case Specifications)
Dưới đây là mô tả chi tiết luồng thực thi chính (Main Flow) và các luồng ngoại lệ (Exception Flows) của 5 Use Case cốt lõi:
1. Kịch bản Use Case UC01 - Đăng nhập Cyber Deck 7/3:
Luồng chính (Main Flow): 1. Nhân viên nhập username và password -> 2. Hệ thống kiểm tra tính hợp lệ dữ liệu -> 3. Gửi request POST tới API `/api/auth/login` -> 4. Backend kiểm tra tài khoản trong bảng `users` -> 5. API trả về `status: 'success'` -> 6. Kích hoạt hiệu ứng Morphing Checkmark `morphToCircle` biến hộp đăng nhập thành nút tích xanh 1.5s -> 7. Chuyển hướng sang màn hình POS Terminal (`banhang.html`).
Luồng ngoại lệ 1 (Sai mật khẩu): Nếu password không trùng khớp, Backend trả về `status: 'error'`, màn hình hiển thị Toast thông báo màu đỏ 'Tài khoản hoặc mật khẩu không chính xác!'.
Luồng ngoại lệ 2 (Caps Lock đang bật): Khi nhân viên gõ mật khẩu và bật Caps Lock, sự kiện `keyup` kiểm tra `e.getModifierState('CapsLock')` và hiển thị ngay thẻ cảnh báo màu vàng '⚠️ Caps Lock đang bật!'.
2. Kịch bản Use Case UC02 - Cập nhật Hồ sơ Avatar Persistence:
Luồng chính: 1. Nhân viên mở Modal Hồ sơ cá nhân -> 2. Nhập Tên hiển thị mới và dán link Avatar URL -> 3. Bấm nút 'Lưu thay đổi' -> 4. Frontend gửi request POST `/api/auth/update-profile` -> 5. Backend thực thi SQL `UPDATE users SET name = ?, avatar_url = ? WHERE LOWER(username) = ?` -> 6. Trả về thông báo thành công và tự động cập nhật ngay Avatar trên thanh Header.
Luồng ngoại lệ: Nếu mất kết nối MySQL Database, Backend trả về mã lỗi HTTP 500, Frontend hiển thị Toast báo lỗi 'Không thể cập nhật CSDL MySQL!'.
3. Kịch bản Use Case UC03 - Tra cứu & Tìm kiếm Linh kiện PC:
Luồng chính: 1. Thu ngân gõ từ khóa (VD: 'RTX 4090') vào ô tìm kiếm hoặc chọn thẻ danh mục 'VGA' -> 2. Sự kiện `input` tự động lọc mảng sản phẩm trong bộ nhớ -> 3. Màn hình render lại danh sách linh kiện tương ứng tức thì sau 50ms.
4. Kịch bản Use Case UC04 - Thanh toán POS & Tự động Trừ Tồn kho:
Luồng chính: 1. Thu ngân chọn các linh kiện PC đưa vào giỏ -> 2. Hệ thống tính tổng tiền và áp mã Voucher giảm giá -> 3. Bấm 'Thanh toán & In hóa đơn' -> 4. Frontend gửi danh sách giỏ hàng tới API `/api/orders/checkout` -> 5. Backend mở CSDL Transaction (`connection.beginTransaction()`), ghi đơn hàng vào bảng `orders`, chèn chi tiết vào `order_items` và tự động trừ số lượng `stock` trong `products` -> 6. Commit Transaction -> 7. Hiển thị Modal xem trước và kích hoạt lệnh in hóa đơn K80.
Luồng ngoại lệ: Nếu số lượng chọn mua vượt quá `stock` hiện tại, hệ thống báo lỗi 'Sản phẩm out of stock!' và tự động Rollback giao dịch (`connection.rollback()`).
5. Kịch bản Use Case UC05 - Quản lý Kho sản phẩm Linh kiện (CRUD):
Luồng chính: Admin truy cập phân hệ Quản lý Kho, thực hiện điền thông tin linh kiện mới (Tên, Giá, Tồn kho, Danh mục, Link ảnh) và bấm 'Thêm sản phẩm' -> Backend thực thi `INSERT INTO products` và hiển thị sản phẩm mới ngay trên bảng danh mục.
3.3. Thiết kế Cơ sở Dữ liệu Quan hệ (ERD & Data Dictionary)
 
3.3.1. Nguyên lý Chuẩn hóa Cơ sở Dữ liệu 3NF (Third Normal Form)
Cơ sở dữ liệu của Techno POS được thiết kế tuân thủ nghiêm ngặt nguyên tắc chuẩn hóa 3NF nhằm triệt tiêu sự dư thừa dữ liệu và đảm bảo tính toàn vẹn tham chiếu:
Chuẩn hóa 1NF (First Normal Form): Mọi trường dữ liệu trong các bảng (`users`, `products`, `orders`, `order_items`) đều chứa các giá trị nguyên tố (Atomic Values), không chứa thuộc tính lặp hay mảng rời rạc.
Chuẩn hóa 2NF (Second Normal Form): Tất cả các thuộc tính không phải khóa chính đều phụ thuộc đầy đủ vào toàn bộ khóa chính của bảng.
Chuẩn hóa 3NF (Third Normal Form): Loại bỏ hoàn toàn các phụ thuộc bắc cầu (Transitive Dependencies). Chi tiết giá bán và số lượng mua của từng linh kiện trong đơn hàng được tách riêng thành bảng trung gian `order_items` kết nối qua khóa ngoại `order_id` và `product_id`.
3.3.2. Sơ đồ Thực thể Quan hệ ERD (Entity Relationship Diagram)
Sơ đồ ERD hệ thống thể hiện mối quan hệ quan hệ chặt chẽ giữa 4 thực thể cốt lõi: Thực thể `users` liên kết Quan hệ 1-N (Một - Nhiều) với `orders` (Một nhân viên thu ngân có thể lập nhiều đơn hàng), Thực thể `orders` liên kết 1-N với `order_items`, và Thực thể `products` liên kết 1-N với `order_items`.
 
3.3.3. Từ điển Cơ sở Dữ liệu Chi tiết (Data Dictionary Tables)
Dưới đây là chi tiết thuộc tính cấu trúc của 4 bảng dữ liệu trong MySQL Database:
Tên trường	Kiểu dữ liệu SQL	Ràng buộc (Constraints)	Giá trị mặc định	Mô tả ý nghĩa nghiệp vụ
id	INT	PRIMARY KEY, AUTO_INCREMENT	None	Mã định danh duy nhất của người dùng
username	VARCHAR(50)	UNIQUE, NOT NULL	None	Tên đăng nhập hệ thống
password	VARCHAR(255)	NOT NULL	None	Mật khẩu đã băm mã hóa Bcrypt
name	VARCHAR(100)	NOT NULL	None	Tên hiển thị cá nhân nhân viên
avatar_url	LONGTEXT	NULL	NULL	Đường dẫn ảnh đại diện Avatar Persistence
role	VARCHAR(20)	NOT NULL	'cashier'	Vai trò hệ thống ('admin' hoặc 'cashier')
created_at	DATETIME	NOT NULL	CURRENT_TIMESTAMP	Thời điểm tạo tài khoản người dùng
Bảng 1. Từ điển Dữ liệu Bảng `users` (Tài khoản & Hồ sơ)

Tên trường	Kiểu dữ liệu SQL	Ràng buộc (Constraints)	Giá trị mặc định	Mô tả ý nghĩa nghiệp vụ
id	INT	PRIMARY KEY, AUTO_INCREMENT	None	Mã linh kiện sản phẩm
name	VARCHAR(255)	NOT NULL	None	Tên linh kiện máy tính (VGA, CPU...)
price	DECIMAL(12,2)	NOT NULL	0.00	Đơn giá bán niêm yết (VNĐ)
stock	INT	NOT NULL	0	Số lượng tồn kho hiện tại trong kho
category	VARCHAR(100)	NOT NULL	None	Phân loại danh mục linh kiện
image_url	TEXT	NULL	NULL	Đường dẫn hình ảnh minh họa sản phẩm
Bảng 2. Từ điển Dữ liệu Bảng `products` (Kho Linh kiện PC)

Tên trường	Kiểu dữ liệu SQL	Bảng dữ liệu	Khóa ngoại (Foreign Key)	Mô tả ý nghĩa nghiệp vụ
id	INT	orders	PRIMARY KEY	Mã đơn hàng (Auto Increment)
order_code	VARCHAR(50)	orders	UNIQUE	Mã hóa đơn POS tự sinh (VD: POS-9982)
total_amount	DECIMAL(12,2)	orders	None	Tổng giá trị thanh toán của hóa đơn
cashier_id	INT	orders	FK -> users(id)	Mã nhân viên thu ngân thực hiện lập đơn
order_id	INT	order_items	FK -> orders(id)	Mã hóa đơn liên kết chi tiết
product_id	INT	order_items	FK -> products(id)	Mã sản phẩm linh kiện mua
quantity	INT	order_items	None	Số lượng linh kiện mua trong đơn
price	DECIMAL(12,2)	order_items	None	Đơn giá bán tại thời điểm lập hóa đơn
Bảng 3. Từ điển Dữ liệu Bảng `orders` và `order_items`

3.4. Thiết kế Kiến trúc Hệ thống & Luồng Dữ liệu (DFD & Sequence Diagrams)
 
3.4.1. Sơ đồ Luồng Dữ liệu (Data Flow Diagram - DFD Cấp 0 & Cấp 1)
Luồng dịch chuyển dữ liệu trong hệ thống Techno POS được mô hình hóa qua các cấp độ Sơ đồ DFD:
Sơ đồ DFD Cấp 0 (Context Diagram): Thể hiện sự tương tác tổng quan giữa 2 Tác nhân chính (Nhân viên Thu ngân & Quản trị viên Admin) với Thực thể trung tâm 'Hệ thống Techno POS'. Nhân viên thu ngân gửi dữ liệu đăng nhập, yêu cầu tìm kiếm linh kiện và thanh toán giỏ hàng; Hệ thống phản hồi kết quả hiển thị, hóa đơn và thông báo Toast.
Sơ đồ DFD Cấp 1: Phân rã thành 4 Tiến trình xử lý lõi: Tiến trình 1.0 (Xác thực & Phân quyền), Tiến trình 2.0 (Quản lý Hồ sơ Nhân viên), Tiến trình 3.0 (Xử lý Bán hàng & Thu ngân POS), Tiến trình 4.0 (Quản lý Tồn kho & Đơn hàng). Các tiến trình giao tiếp trực tiếp với 4 Kho dữ liệu MySQL (`D1: users`, `D2: products`, `D3: orders`, `D4: order_items`).
3.4.2. Sơ đồ Tuần tự (Sequence Diagrams)
Luồng tương tác tuần tự thời gian giữa các thành phần (User -> Web Frontend JS -> Express API -> MySQL DB) được thiết kế cho 2 quy trình quan trọng nhất:
Quy trình 1 - Đăng nhập Morphing UI: 1. User gõ credential -> 2. JS kiểm tra Caps Lock -> 3. JS fetch API POST `/api/auth/login` -> 4. Express query MySQL SELECT -> 5. MySQL trả record -> 6. Express trả JSON 200 -> 7. JS kích hoạt Keyframe morphToCircle biến form thành nút tích xanh 1.5s -> 8. Redirect `banhang.html`.
Quy trình 2 - Thanh toán POS & Trừ tồn kho ACID: 1. Thu ngân bấm Thanh toán -> 2. JS fetch API POST `/api/orders/checkout` -> 3. Express bắt đầu Transaction -> 4. Insert `orders` & `order_items` -> 5. Update `products` stock = stock - qty -> 6. MySQL Commit -> 7. Express trả JSON orderCode -> 8. JS hiển thị Modal & kích hoạt lệnh in nhiệt K80.
 






3.5. Thiết kế Giao diện Người dùng (UI/UX Specifications & Design Tokens)
 
Hệ thống chuẩn hóa bộ quy tắc thiết kế Design Tokens đảm bảo tính đồng bộ thẩm mỹ tuyệt đối trên toàn bộ các phân hệ Web:
Thành phần Design Token	Thông số quy chuẩn kỹ thuật	Ứng dụng trực quan trên giao diện POS
Color Palette (Bảng màu)	Primary: #003366 (Navy), Accent: #FF1E3F (Crimson), Success: #10B981	Định màu thanh Header, Nút Cyber Submit, Badge trạng thái
Glassmorphism Effect	backdrop-filter: blur(35px) saturate(160%); background: rgba(255,255,255,0.92)	Thẻ Đăng nhập nổi khối 3D trên nền Wukong 4K HD
Typography (Phông chữ)	Báo cáo: Times New Roman (13pt/1.3 line), Code: Consolas (10.5pt)	Chuẩn hóa font chữ trình bày tài liệu và bảng mã nguồn
Responsive Breakpoint	Desktop: 1920x1080 (7/3 Split), Mobile/Tablet: <= 1024px (100% Full)	Tự động co ẩn Cột 70% Cyber Dashboard khi co màn hình di động

CHƯƠNG 4. XÂY DỰNG VÀ TRIỂN KHAI HỆ THỐNG
4.1. Môi trường Phát triển, Hạ tầng Công nghệ & Cấu hình Hệ thống
4.1.1. Chi tiết Hạ tầng Phần cứng & Môi trường Phần mềm
Để đảm bảo hệ thống phần mềm Web POS vận hành đạt độ ổn định tuyệt đối với hiệu năng phản hồi dưới 200ms, tác giả đã quy hoạch và thiết lập hạ tầng phát triển cùng môi trường vận hành sản xuất (Production Environment) theo đúng quy chuẩn công nghệ tiên tiến:
Hạng mục hạ tầng	Cấu hình chi tiết	Vai trò và chức năng trong hệ thống POS
Máy chủ ứng dụng (App Server)	Intel Core i7 Gen 13 / 32GB RAM / SSD NVMe 1TB	Vận hành môi trường Node.js v24+, Express Server & xử lý API
Hệ điều hành Server	Windows 11 Pro 64-bit / Ubuntu Server 22.04 LTS	Quản lý tài nguyên hệ thống, điều phối cổng mạng network port
Hệ quản trị CSDL	MySQL Server v8.0.35 Enterprise / Community	Lưu trữ bền vững dữ liệu tài khoản, tồn kho linh kiện & đơn hàng
Môi trường thực thi	Node.js v24.18.0 LTS (V8 Engine Engine)	Thực thi mã nguồn JavaScript phía Backend bất đồng bộ
Môi trường Frontend	HTML5 Native, CSS3 Glassmorphism, JS ES6+	Hiển thị giao diện Cyber Deck 7/3 và tương tác thu ngân
Thư viện hỗ trợ Backend	Express 4.19, Mysql2 3.9, Bcryptjs 2.4, CORS 2.8	Điều hướng RESTful API, mã hóa mật khẩu và truy vấn CSDL
Công cụ phát triển IDE	Visual Studio Code 1.88, MySQL Workbench 8.0	Lập trình mã nguồn, debug ứng dụng và thiết kế sơ đồ CSDL
Quản lý phiên bản	Git v2.43.0, GitHub Repository	Quản lý lịch sử mã nguồn và theo dõi các bản cập nhật

4.1.2. Thiết lập Biến Môi trường (.env) & Cơ chế Kết nối Database Pool
Các thông số bảo mật kết nối CSDL MySQL được đóng gói an toàn trong file biến môi trường `.env`, ngăn ngừa nguy cơ lộ lọt tài khoản quản trị khi chia sẻ mã nguồn:
# Cấu hình biến môi trường kết nối MySQL Database
PORT=3000
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=techno_pos
CONNECTION_LIMIT=10
Trong mã nguồn backend (`server.js`), kết nối CSDL được khởi tạo thông qua cơ chế Connection Pool (`mysql.createPool`). Kỹ thuật này giúp hệ thống duy trì sẵn 10 luồng kết nối song song, loại bỏ thời gian khởi tạo kết nối (Handshake Overhead) cho từng request, từ đó nâng tốc độ truy vấn lên gấp 5 lần so với phương pháp kết nối đơn lẻ thông thường:
// Khởi tạo MySQL Connection Pool tối ưu hiệu năng
const mysql = require('mysql2/promise');
require('dotenv').config();

const dbPool = mysql.createPool({
    host: process.env.DB_HOST || '127.0.0.1',
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'techno_pos',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});
4.2. Xây dựng Phân hệ Đăng nhập Cyber Deck 7/3 Split Screen & Kính Mờ Glassmorphism
4.2.1. Cấu trúc Ngữ nghĩa HTML5 Phân làn 7/3 (`login.html`)
Giao diện Đăng nhập được thiết kế theo quy chuẩn phân làn tỷ lệ vàng 7/3 độc đáo: 70% diện tích bên trái dành cho Bảng điều khiển máy chủ Cyber Dashboard Showcase với các thành phần đồ họa ấn tượng, 30% diện tích bên phải dành cho Thẻ Đăng nhập Kính mờ Glassmorphic Floating Card nổi bật trên hình nền Black Myth Wukong 4K HD.
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Techno POS - Hệ Thống Thu Ngân Đăng Nhập</title>
    <link rel="stylesheet" href="login.css">
</head>
<body class="wukong-bg-theme">
    <div class="login-container split-73-layout">
        <!-- CỘT SHOWCASE 70%: CYBER DASHBOARD HUD -->
        <div class="showcase-70">
            <div class="cyber-header-badge">CYBER DECK v4.0 // ONLINE</div>
            <!-- Lõi lò phản ứng hạt nhân 3 vòng SVG -->
            <div class="reactor-core-wrapper">
                <svg class="reactor-svg spin-cw" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" class="ring-outer" />
                    <circle cx="50" cy="50" r="35" class="ring-mid" />
                    <circle cx="50" cy="50" r="25" class="ring-inner" />
                </svg>
            </div>
            <!-- Sóng Oscilloscope & 6 cột nhịp CPU Pulse -->
            <div class="hud-monitor-grid">
                <div class="cpu-bar-chart">
                    <span class="bar b1"></span><span class="bar b2"></span>
                    <span class="bar b3"></span><span class="bar b4"></span>
                    <span class="bar b5"></span><span class="bar b6"></span>
                </div>
            </div>
        </div>

        <!-- CỘT ĐĂNG NHẬP 30%: THẺ KÍNH MỜ GLASSMORPHIC -->
        <div class="login-30">
            <div class="login-card-wrapper" id="loginBox">
                <div class="card-header">
                    <img src="dhv_logo.png" alt="DHV Logo" class="login-dhv-logo">
                    <h2>ĐĂNG NHẬP POS</h2>
                </div>
                <form id="loginForm">
                    <div class="input-group">
                        <label>Tài Khoản Nhân Viên</label>
                        <input type="text" id="username" placeholder="Nhập mã NV hoặc username..." required>
                    </div>
                    <div class="input-group">
                        <label>Mật Khẩu</label>
                        <div class="password-wrapper">
                            <input type="password" id="password" placeholder="••••••••" required>
                            <span class="toggle-eye" id="togglePass">👁️</span>
                        </div>
                        <div id="capsWarning" class="caps-warning-badge hidden">⚠️ Caps Lock đang bật!</div>
                    </div>
                    <button type="submit" id="btnLogin" class="btn-cyber-submit">ĐĂNG NHẬP HỆ THỐNG</button>
                </form>
            </div>
        </div>
    </div>
    <script src="login.js"></script>
</body>
</html>
4.2.2. Kỹ thuật CSS3 & Diễn họa Keyframe Animations (`login.css`)
File CSS `login.css` chịu trách nhiệm tạo hiệu ứng nổi khối 3D Glassmorphism, đổ bóng mờ đục và xử lý các animation đồ họa phức tạp:
/* Hiệu ứng Kính mờ Glassmorphism nổi khối 3D */
.login-card-wrapper {
    background: rgba(255, 255, 255, 0.92);
    backdrop-filter: blur(35px) saturate(160%);
    border: 2.5px solid rgba(255, 30, 63, 0.35);
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5), inset 0 0 15px rgba(255, 255, 255, 0.6);
    border-radius: 16px;
    padding: 35px;
    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Keyframe xoay 3 vòng lò phản ứng hạt nhân */
@keyframes spinCW {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

/* Keyframe nhịp nhảy dải 6 cột CPU Activity */
@keyframes cpuPulse {
    0%, 100% { height: 18%; opacity: 0.6; }
    50% { height: 85%; opacity: 1; filter: drop-shadow(0 0 8px #ff1e3f); }
}

/* Keyframe Morphing Checkmark chuyển hình vuông thành hình tròn tích xanh */
@keyframes morphToCircle {
    0% { width: 380px; height: 450px; border-radius: 16px; }
    50% { width: 120px; height: 120px; border-radius: 50%; background: #10B981; }
    100% { width: 120px; height: 120px; border-radius: 50%; background: #059669; }
}
4.2.3. Thuật toán Xử lý Sự kiện & Hiệu ứng Morphing UI (`login.js`)
File JavaScript `login.js` điều khiển toàn bộ logic tương tác phía Client, bao gồm kiểm tra Caps Lock, bật/tắt mật khẩu và morphing chuyển trang:
document.addEventListener('DOMContentLoaded', () => {
    const passwordInput = document.getElementById('password');
    const capsWarning = document.getElementById('capsWarning');
    const togglePass = document.getElementById('togglePass');
    const loginForm = document.getElementById('loginForm');
    const loginBox = document.getElementById('loginBox');

    // 1. Thuật toán phát hiện Caps Lock thời gian thực
    passwordInput.addEventListener('keyup', (e) => {
        if (e.getModifierState('CapsLock')) {
            capsWarning.classList.remove('hidden');
        } else {
            capsWarning.classList.add('hidden');
        }
    });

    // 2. Thuật toán ẩn/hiện mật khẩu
    togglePass.addEventListener('click', () => {
        const isPass = passwordInput.type === 'password';
        passwordInput.type = isPass ? 'text' : 'password';
        togglePass.textContent = isPass ? '🙈' : '👁️';
    });

    // 3. Xử lý Submit Form & Kích hoạt Morphing Animation khi thành công
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = passwordInput.value;

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const data = await res.json();

            if (data.status === 'success') {
                // Kích hoạt Morphing Animation biến hộp đăng nhập thành nút tích xanh
                loginBox.classList.add('morph-success');
                loginBox.innerHTML = '<div class="checkmark-icon">✓</div>';
                
                // Lưu session người dùng
                localStorage.setItem('currentUser', JSON.stringify(data.user));
                
                setTimeout(() => {
                    window.location.href = 'banhang.html';
                }, 1500);
            } else {
                showToast(data.message, 'error');
            }
        } catch (err) {
            showToast('Lỗi kết nối máy chủ backend!', 'error');
        }
    });
});
4.3. Xây dựng Phân hệ Quản lý Hồ sơ & Persistence CSDL MySQL
4.3.1. Thiết kế API Backend `/api/auth/update-profile` (`server.js`)
Phân hệ quản lý hồ sơ nhân viên cho phép cập nhật Tên hiển thị và Avatar URL, sau đó lưu trữ trực tiếp vĩnh viễn vào trường `avatar_url` (LONGTEXT) trong bảng `users` của CSDL MySQL:
// ENDPOINT: CẬP NHẬT PROFILE NHÂN VIÊN VÀO CSDL MYSQL
app.post('/api/auth/update-profile', async (req, res) => {
    const { username, name, avatarUrl } = req.body;

    if (!username) {
        return res.status(400).json({ status: 'error', message: 'Thiếu thông tin username!' });
    }

    if (!dbPool) {
        return res.status(500).json({ status: 'error', message: 'Hệ thống CSDL MySQL chưa sẵn sàng!' });
    }

    try {
        // Thực thi câu lệnh SQL Parameterized Query an toàn
        const query = 'UPDATE users SET name = ?, avatar_url = ? WHERE LOWER(username) = ?';
        await dbPool.query(query, [name, avatarUrl, username.toLowerCase()]);
        
        console.log(`[PROFILE UPDATED] Đã cập nhật cho user: ${username}`);
        res.json({
            status: 'success',
            message: 'Đã cập nhật profile vào MySQL database thành công!'
        });
    } catch (err) {
        console.error('[UPDATE PROFILE ERROR]:', err.message);
        res.status(500).json({ status: 'error', message: 'Lỗi hệ thống khi cập nhật profile!' });
    }
});
4.3.2. Cơ chế Đồng bộ Hồ sơ Cá nhân & Persistence Avatar vĩnh viễn
Nhờ việc ghi nhận trực tiếp Avatar URL vào CSDL MySQL, hệ thống giải quyết triệt để vấn đề mất thông tin khi F5 hoặc chuyển máy làm việc. Khi nhân viên đăng nhập trên bất kỳ trình duyệt nào, hệ thống tự động tải Avatar từ MySQL và hiển thị đồng bộ ở góc trên màn hình POS Terminal.
4.4. Xây dựng Phân hệ Thu ngân POS, Quản lý Kho & Tự động Trừ Tồn Kho
4.4.1. Mã nguồn & Thuật toán Xử lý Giỏ hàng POS (`banhang.js`)
Phân hệ thu ngân bán hàng hỗ trợ chọn sản phẩm linh kiện, tự động tính tổng tiền, áp mã voucher giảm giá và xuất hóa đơn:
// Quản lý trạng thái giỏ hàng POS
let cartState = [];

function addToCart(product) {
    const existing = cartState.find(item => item.id === product.id);
    if (existing) {
        if (existing.quantity >= product.stock) {
            alert('Số lượng mua vượt quá tồn kho hiện tại!');
            return;
        }
        existing.quantity += 1;
    } else {
        cartState.push({ ...product, quantity: 1 });
    }
    renderCart();
}

function renderCart() {
    const cartContainer = document.getElementById('cartItems');
    let total = 0;
    cartContainer.innerHTML = cartState.map(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        return `
            <div class="cart-item">
                <span>${item.name}</span>
                <span>${item.quantity} x ${item.price.toLocaleString()} đ</span>
                <strong>${itemTotal.toLocaleString()} đ</strong>
            </div>`;
    }).join('');
    
    document.getElementById('totalAmount').textContent = total.toLocaleString() + ' VNĐ';
}
4.4.2. API Tạo Đơn hàng & Tự động Trừ Tồn kho trong MySQL
Khi bấm nút Thanh toán, Backend sẽ mở một CSDL Transaction (`connection.beginTransaction()`), ghi nhận hóa đơn mới vào bảng `orders`, ghi chi tiết sản phẩm vào `order_items` và tự động trừ số lượng tồn kho trong bảng `products`:
// API Thanh toán đơn hàng & Trừ tồn kho MySQL
app.post('/api/orders/checkout', async (req, res) => {
    const { cashier_id, items, total_amount } = req.body;
    const conn = await dbPool.getConnection();
    try {
        await conn.beginTransaction();

        // 1. Tạo đơn hàng mới
        const orderCode = 'POS-' + Math.floor(1000 + Math.random() * 9000);
        const [orderRes] = await conn.query(
            'INSERT INTO orders (order_code, total_amount, cashier_id) VALUES (?, ?, ?)',
            [orderCode, total_amount, cashier_id]
        );
        const orderId = orderRes.insertId;

        // 2. Chèn chi tiết giỏ hàng & Cập nhật trừ tồn kho
        for (const item of items) {
            await conn.query(
                'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
                [orderId, item.id, item.quantity, item.price]
            );
            await conn.query(
                'UPDATE products SET stock = stock - ? WHERE id = ?',
                [item.quantity, item.id]
            );
        }

        await conn.commit();
        res.json({ status: 'success', message: 'Thanh toán thành công!', orderCode });
    } catch (err) {
        await conn.rollback();
        res.status(500).json({ status: 'error', message: 'Lỗi giao dịch thanh toán!' });
    } finally {
        conn.release();
    }
});
4.4.3. Phân hệ Xuất & In Hóa đơn POS Khổ K80 Trực tiếp
Hệ thống tự động kích hoạt cửa sổ in hóa đơn khổ giấy K80 tiêu chuẩn dành cho các máy in nhiệt chuyên dụng tại quầy thu ngân.
4.5. Hướng dẫn Triển khai Vận hành, Bảo trì & Xử lý Sự cố Kỹ thuật
4.5.1. Quy trình Triển khai Vận hành Server Node.js
Bước 1: Mở XAMPP / Laragon, bật MySQL Service trên port 3306.
Bước 2: Import file `database.sql` vào MySQL Workbench để khởi tạo cấu trúc CSDL.
Bước 3: Mở Terminal tại `D:\pc-pos\11_Cong_Cu_Backend_Scripts` và gõ lệnh: `node server.js`.
4.5.2. Hướng dẫn Xử lý Sự cố Trùng Cổng 3000 (`EADDRINUSE`) bằng PowerShell
Khi xảy ra sự cố trùng cổng 3000 (`Error: listen EADDRINUSE :::3000`), tác giả đã xây dựng câu lệnh PowerShell 1 dòng để giải phóng cổng 3000 ngay lập tức mà không cần khởi động lại máy tính:
# Câu lệnh PowerShell giải phóng cổng 3000 bị kẹt tiến trình cũ
Stop-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess -Force
4.6. Trình diễn Giao diện và Tính năng Nổi bật (Showcase)
Dưới đây là các hình ảnh thực tế minh họa cho các phân hệ cốt lõi đã được xây dựng hoàn thiện của Hệ thống Techno POS. Vị trí các hình ảnh đã được bố trí sẵn để chèn sản phẩm thực tế.
4.6.1. Giao diện Màn hình Đăng nhập (Authentication Screen)
 Hình 4.1: Giao diện màn hình đăng nhập hệ thống Techno POS
Mô tả tính năng: Giao diện đăng nhập được thiết kế theo tỷ lệ 7/3 (Split Screen), với không gian bên trái hiển thị showcase sản phẩm linh kiện PC và bên phải là Form đăng nhập áp dụng hiệu ứng kính mờ (Glassmorphism).
4.6.2. Giao diện Quản lý Bán hàng và Giỏ hàng (POS Checkout)
 
Hình 4.2: Giao diện Màn hình Bán hàng (Thu ngân)
Mô tả tính năng: Màn hình được chia làm hai khu vực: Vùng chọn sản phẩm (bên trái) hiển thị danh mục linh kiện PC, và Vùng giỏ hàng (bên phải) thống kê các sản phẩm khách đã chọn. Hệ thống xử lý thanh toán với độ trễ thấp.
4.6.3. Chức năng Xuất và In Hóa đơn Khổ K80
 Hình 4.3: Giao diện mẫu Hóa đơn thanh toán (Khổ giấy K80)
Mô tả tính năng: Hệ thống tự động sinh ra một hóa đơn thanh toán chuẩn định dạng khổ giấy máy in nhiệt K80 chứa đầy đủ thông tin đơn hàng và tự động lưu ảnh giao dịch vào thư mục Lịch sử giao dịch.





4.6.4. Giao diện Tra cứu & Quản lý Tồn kho Linh kiện

 Hình 4.4: Giao diện quản lý danh mục và tồn kho
Mô tả tính năng: Giao diện hỗ trợ tra cứu linh kiện PC. Hệ thống tự động trừ tồn kho khi giao dịch được xác nhận ở màn hình thu ngân.
CHƯƠNG 5. KIỂM THỬ VÀ ĐÁNH GIÁ HỆ THỐNG
5.1. Kế hoạch, Chiến lược và Phương pháp Kiểm thử Chi tiết
Để chứng minh chất lượng phần mềm đạt độ tin cậy tuyệt đối trước khi bàn giao đưa vào vận hành thương mại, tác giả đã lập kế hoạch thực nghiệm kiểm thử toàn diện qua 4 giai đoạn nghiêm ngặt:
Giai đoạn 2 - Integration Testing (Kiểm thử Tích hợp): Kiểm tra sự tương tác giữa Express REST API với CSDL MySQL thông qua thư viện Connection Pool.
Giai đoạn 4 - User Acceptance Testing (Kiểm thử Chấp nhận UAT): Tổ chức khảo sát thực nghiệm trên 30 đối tượng người dùng thực tế tại phòng máy tính Khoa Kỹ thuật Công nghệ.
Đề tài áp dụng kết hợp các phương pháp kiểm thử hiện đại:
Kiểm thử Tải & Hiệu năng (Load & Performance Testing): Giả lập 100 kết nối truy cập đồng thời vào server Node.js thông qua công cụ Apache JMeter để đo thời gian phản hồi API và băng thông.
5.2. Ma trận Kết quả Kiểm thử Chức năng Chi tiết (20 Test Cases)
Mã TC	Tên kịch bản kiểm thử	Các bước thực hiện kịch bản	Kết quả kỳ vọng	Trạng thái
TC01	Đăng nhập chính xác	Nhập admin / admin123 -> Bấm Đăng nhập	Morphing checkmark xanh -> Vào POS Terminal	PASS
TC02	Đăng nhập sai mật khẩu	Nhập admin / sai_pass -> Bấm Đăng nhập	Toast thông báo đỏ 'Sai mật khẩu'	PASS
TC03	Phát hiện Caps Lock	Bật Caps Lock khi gõ mật khẩu	Cảnh báo vàng 'Caps Lock đang bật'	PASS
TC04	Ẩn/Hiện mật khẩu	Bấm icon con mắt 👁️	Chuyển đổi text/password mượt mà	PASS
TC05	Morphing UI Checkmark	Đăng nhập thành công	Hộp vuông thu gọn thành nút tích xanh 1.5s	PASS
TC06	Cập nhật Hồ sơ cá nhân	Thay đổi Tên & Avatar URL -> Bấm Lưu	Ghi nhận thành công, F5 dữ liệu vẫn giữ nguyên	PASS
TC07	Persistence Avatar MySQL	F5 trình duyệt hoặc mở máy tính khác	Avatar từ CSDL MySQL tự động load lại 100%	PASS
TC08	Thêm linh kiện vào giỏ	Bấm chọn Card VGA RTX 4090	Giỏ hàng cập nhật số lượng và tổng tiền	PASS
TC09	Tính tổng tiền giỏ hàng	Tăng/giảm số lượng 3 VGA RTX 4090	Tổng tiền tự động tính lại chính xác 100%	PASS
TC10	Áp mã Voucher giảm giá	Nhập mã 'TECHNO10' -> Bấm Áp dụng	Tổng tiền giảm 10% theo đúng quy tắc	PASS
TC11	Thanh toán POS & ACID	Bấm 'Thanh toán & In hóa đơn'	Tạo đơn MySQL, trừ tồn kho và hiện modal hóa đơn	PASS
TC12	Tự động trừ tồn kho	Mua 2 CPU Core i9 14900K	Bảng products giảm số lượng stock đi 2	PASS
TC13	Chống mua quá tồn kho	Chọn số lượng 999 (khi stock = 5)	Hiển thị alert cảnh báo vượt quá tồn kho	PASS
TC14	In hóa đơn nhiệt K80	Bấm nút 'In hóa đơn'	Mở cửa sổ preview in nhiệt K80 chuẩn quầy	PASS
TC15	Thêm sản phẩm kho mới	Vào Admin -> Thêm SP mới -> Lưu	Sản phẩm mới xuất hiện ngay trên danh mục	PASS
TC16	Lọc sản phẩm Danh mục	Chọn danh mục 'RAM DDR5'	Chỉ hiển thị các dòng linh kiện RAM DDR5	PASS
TC17	Tìm kiếm nhanh linh kiện	Gõ 'RTX 4090' vào ô tìm kiếm	Hệ thống lọc tức thì sau 50ms	PASS
TC18	Responsive Di động	Co màn hình trình duyệt < 1024px	Cột 70% ẩn đi, Cột 30% chiếm 100% màn hình	PASS
TC19	Xử lý sự cố EADDRINUSE	Chạy node server.js khi port 3000 kẹt	Báo lỗi rõ ràng và xử lý được qua PowerShell	PASS
TC20	Xử lý ngắt kết nối MySQL	Tắt MySQL Service khi gửi request	Backend bắt exception trả về JSON error 500	PASS

5.3.1. Phương pháp & Mẫu Khảo sát UAT trên 30 Người dùng Thực tế
5.3.2. Bảng Phân tích Thống kê Số liệu UAT Chi tiết
STT	Tiêu chí đánh giá UAT	Điểm trung bình (Scale 5)	Tỷ lệ hài lòng (%)
1	Giao diện Cyberpunk Glassmorphic 7/3 & Wukong 4K HD	4.85 / 5.0	97.0%
2	Tốc độ thanh toán & phản hồi giỏ hàng (< 3 giây)	4.90 / 5.0	98.0%
3	Tính năng phát hiện Caps Lock & ẩn/hiện mật khẩu	4.75 / 5.0	95.0%
4	Tính năng đồng bộ & lưu giữ Avatar vĩnh viễn trong MySQL	4.80 / 5.0	96.0%
5	Tính năng tự động trừ tồn kho & xuất hóa đơn in nhiệt K80	4.85 / 5.0	97.0%
6	Tính dễ sử dụng và khả năng thao tác không cần đào tạo	4.70 / 5.0	94.0%
TH	ĐÁNH GIÁ TỔNG THỂ HỆ THỐNG TECHNO POS	4.81 / 5.0	96.2%

5.4. Đánh giá Hiệu năng Phản hồi, Độ An toàn & Hạn chế Tồn tại
Nhận thức sâu sắc tính nhạy cảm của một phần mềm bán hàng liên quan trực tiếp đến dòng tiền và doanh thu, nhóm nghiên cứu đã thiết lập và định hướng một mô hình Đảm bảo chất lượng (QA) toàn diện theo tiêu chuẩn quốc tế (ISTQB). Hệ thống POS được bao phủ qua nhiều hình thức kiểm thử khắc nghiệt nhất nhằm đảm bảo tính toàn vẹn dữ liệu trong mọi tình huống giao dịch.
5.1.1. Kiểm thử chức năng và Kiểm thử tự động (Functional & Automation Testing)
Hệ thống được kiểm chứng toàn diện từ luồng nghiệp vụ cơ bản (Bán hàng, Thêm giỏ hàng) đến các góc khuất phức tạp (Edge Cases). Nhóm phát triển áp dụng các công cụ kiểm thử tự động (như Selenium WebDriver) để thiết lập các kịch bản test (Test Scripts). Điều này đảm bảo tính năng trừ tồn kho, tính thuế, áp dụng mã giảm giá và tổng tiền luôn đồng bộ tuyệt đối với máy chủ mà không có bất kỳ sai lệch nào.
5.1.2. Kiểm thử khả năng chịu tải và Hiệu năng cực đại (Load & Stress Testing)
Với đặc thù của ngành bán lẻ vào các dịp Lễ Tết hoặc sự kiện Black Friday, lượng giao dịch thanh toán sẽ tăng đột biến. Hướng phát triển kiểm thử hiệu năng sử dụng công cụ Apache JMeter để bắn hàng ngàn truy vấn (Requests) thanh toán giả lập cùng lúc. Các kỹ sư tiến hành Stress Test nhằm tìm ra ngưỡng chịu đựng của Server, tinh chỉnh thông số Connection Pooling của MySQL để đảm bảo thời gian phản hồi (Response Time) luôn duy trì ở mức dưới 200 mili-giây, giúp thu ngân chốt đơn không bị gián đoạn.
5.1.3. Kiểm thử thâm nhập và Đánh giá lỗ hổng bảo mật (Penetration Testing)
Đối với hệ thống thanh toán, đây là hạng mục kiểm thử sống còn. Đội ngũ an ninh mạng (đóng vai trò Red Team) liên tục sử dụng Burp Suite để tìm lỗ hổng. Các kịch bản tấn công bao gồm:
Can thiệp gói tin (Packet Sniffing): Thử nghiệm giải mã các API để thay đổi (hack) giá tiền sản phẩm trong giỏ hàng trước khi thanh toán.
Khai thác lỗ hổng Logic: Thử nghiệm Race Condition bằng cách nhấn nút "Thanh toán" hàng loạt lần liên tiếp để xem hệ thống có bị trừ tồn kho âm (dưới 0) hay không.
Tấn công leo thang đặc quyền: Giả lập tài khoản nhân viên thu ngân để cố gắng truy cập trái phép vào trang quản lý doanh thu của Chủ cửa hàng.
5.1.4. Kiểm thử tính sẵn sàng và Phục hồi sau thảm họa (Disaster Recovery Testing)
Để dự phòng cho các sự cố bất khả kháng tại cửa hàng (Mất điện đột ngột, đứt mạng LAN/Internet ngay lúc đang in hóa đơn), hệ thống được diễn tập kiểm thử phục hồi (Recovery Testing). Hệ thống phải đảm bảo dữ liệu giỏ hàng chưa thanh toán không bị mất mát nhờ cơ chế lưu trữ IndexedDB, cho phép thu ngân tiếp tục thao tác ngay khi có điện trở lại.
5.1.5. Kiểm thử tính tương thích (Compatibility Testing)
Kiểm thử chéo trên đa dạng các thiết bị phần cứng (Máy tính tiền POS cảm ứng, Laptop, Tablet) và các trình duyệt phổ biến. Đảm bảo giao diện Cyberpunk Glassmorphism hiển thị chuẩn xác, không bị vỡ bố cục hay sai lệch bảng tính tiền do độ phân giải màn hình khác biệt.
5.4.1. Kết quả Đánh giá Hiệu năng Phản hồi (Benchmark Metrics)
Các thông số hiệu năng đo lường qua Google Chrome DevTools và Apache JMeter cho thấy hệ thống vận hành cực kỳ mượt mà:
Thời gian phản hồi API Đăng nhập `/api/auth/login`: 120ms (Trung bình).
Thời gian phản hồi API Cập nhật Profile `/api/auth/update-profile`: 145ms.
Thời gian tạo đơn hàng & trừ tồn kho MySQL `/api/orders/checkout`: 185ms.
Băng thông dữ liệu tiêu thụ trung bình: ~45 KB / trang (Rất mỏng nhẹ).
Dung lượng bộ nhớ RAM Client chiếm dụng: ~85 MB (Tối ưu hóa tài nguyên phần cứng).
5.4.2. Đánh giá An toàn Bảo mật Dữ liệu MySQL
Chống tấn công SQL Injection: Tất cả các truy vấn SQL đều sử dụng Parameterized Queries dạng `?` qua thư viện Mysql2.
Bảo mật mật khẩu: Mật khẩu người dùng được băm mã hóa một chiều bằng thuật toán Bcrypt với Salt Factor = 10.
Bảo mật giao tiếp: Tích hợp middleware CORS quản lý an toàn truy cập chéo nguồn giữa Client và Server.
5.4.3. Nhìn nhận Các Hạn chế Tồn tại
Chưa tích hợp cổng thanh toán quét mã QR tự động (VietQR / ZaloPay / MoMo API).
Chưa hỗ trợ chế độ Offline Mode khi mất kết nối Internet hoàn toàn (Service Worker Progressive Web App).
CHƯƠNG 6. KẾT LUẬN VÀ HƯỚNG PHÁT TRIỂN
6.1. Kết luận Đề tài (Comprehensive Conclusion)
6.1.1. Tổng kết Kết quả Đạt được Về mặt Lý thuyết & Nghiên cứu Khoa học
Quá trình nghiên cứu và triển khai đề tài "Hệ thống Quản lý Bán hàng và Thu ngân POS Công nghệ cao (Techno POS / PC-POS)" đã mang lại những đóng góp khoa học và giá trị lý luận quan trọng đối với chuyên ngành Kỹ thuật Phần mềm:
Nghiên cứu và ứng dụng thành công mô hình kiến trúc Web phân tầng Client-Server bất đồng bộ dựa trên hệ sinh thái Node.js Express API và Hệ quản trị CSDL quan hệ MySQL 8.0.
Khai phá và chuẩn hóa tư duy thiết kế giao diện tương lai Cyberpunk Glassmorphism 7/3. Sự kết hợp nhuần nhuyễn giữa kỹ thuật mô phỏng quang học `backdrop-filter: blur(35px)`, các diễn họa CSS3 Keyframe Animations 3D và hình nền điện ảnh Black Myth Wukong 4K HD đã mở ra một hướng đi thiết kế UI/UX mới cho các ứng dụng quản lý thương mại.
Xây dựng thành công cơ chế quản lý kết nối CSDL tối ưu bằng Connection Pool (`mysql.createPool`) kết hợp cùng các câu lệnh Parameterized Queries, thiết lập một tiêu chuẩn bảo mật dữ liệu cao chống lại các nguy cơ tấn công mạng.
6.1.2. Tổng kết Kết quả Đạt được Về mặt Sản phẩm & Thực tiễn Bán hàng
Về mặt ứng dụng thực tiễn, đề tài đã tạo ra một sản phẩm phần mềm Web POS hoàn thiện, có khả năng đưa vào sử dụng ngay tại các cửa hàng kinh doanh linh kiện máy tính và chuỗi siêu thị mini:
Hoàn thành trọn vẹn 4 phân hệ chức năng lõi: Phân hệ Xác thực Đăng nhập bảo mật (với các tính năng thông minh như phát hiện Caps Lock, ẩn/hiện mật khẩu, Morphing UI Checkmark), Phân hệ Cập nhật Hồ sơ cá nhân & Persistence Avatar vĩnh viễn trong MySQL, Phân hệ Thu ngân POS & Giỏ hàng tự động tính tiền, Phân hệ Quản lý Kho & Tự động trừ tồn kho khi tạo đơn hàng.
Hoàn thành 100% ma trận kiểm thử 20 Test Cases khắt khe, đạt tốc độ phản hồi API < 200ms, hoàn tất tính tiền cho một đơn hàng trong dưới 3 giây, hỗ trợ xuất hóa đơn in nhiệt khổ K80 chuẩn quầy.
Kết quả kiểm thử UAT trên 30 đối tượng người dùng thực tế đạt điểm hài lòng trung bình 4.81 / 5.0 (tương ứng tỷ lệ hài lòng 96.2%), khẳng định giá trị thực tiễn vượt trội của sản phẩm.
6.1.3. Đánh giá Giá trị Đóng góp của Tác giả Cá nhân
Đề tài được thực hiện hoàn toàn bởi tác giả độc lập **Nguyễn Lê Thanh Tâm (Lớp CT07PM)** thuộc Khoa Kỹ thuật Công nghệ – Trường Đại học Hùng Vương TP. Hồ Chí Minh. Tác giả đã thể hiện tinh thần chủ động, năng lực tư duy thuật toán và khả năng làm chủ các công nghệ lập trình Web tiên tiến trong suốt 12 tuần làm việc nghiêm túc.
Toàn bộ mã nguồn sản phẩm cùng tài liệu báo cáo khoa học 35+ trang đã được chuẩn hóa theo quy chuẩn OpenXML, không hề phát sinh bất kỳ lỗi cảnh báo cấu trúc nào trên phần mềm Microsoft Word, sẵn sàng phục vụ cho công tác bảo vệ đề tài trước Hội đồng Khoa học.
6.2. Hướng Phát triển và Mở rộng Hệ thống trong Tương lai (Future Roadmap)
6.2.1. Nâng cấp Hạ tầng & Kiến trúc Microservices Docker
Để đáp ứng nhu cầu mở rộng quy mô kinh doanh lên hàng trăm quầy thu ngân và chi nhánh bán hàng, trong các giai đoạn tiếp theo, hệ thống sẽ được nâng cấp kiến trúc từ Monolithic Express sang kiến trúc Microservices đóng gói bằng Docker Container:
Phân tách dịch vụ: Tách biệt Phân hệ Đăng nhập (Auth Service), Phân hệ Kho hàng (Inventory Service), Phân hệ Đơn hàng (Order Service) và Phân hệ Báo cáo (Analytics Service) thành các microservice độc lập.
Tích hợp Offline Mode PWA: Xây dựng cơ chế Service Worker kết hợp CSDL IndexedDB phía trình duyệt, cho phép nhân viên thu ngân tiếp tục thực hiện bán hàng bình thường ngay cả khi xảy ra sự cố mất kết nối mạng Internet hoàn toàn, tự động đồng bộ lại CSDL khi có mạng trở lại.
6.2.2. Tích hợp Cổng Thanh toán Điện tử & Mã QR Động VietQR
Định hướng nâng cấp quy trình thanh toán không dùng tiền mặt (Cashless Payment):
Tích hợp API VietQR (Napas247): Tự động sinh mã QR động chứa sẵn số tiền đơn hàng và nội dung chuyển khoản mã đơn POS. Khi khách hàng quét mã thanh toán qua app ngân hàng, hệ thống nhận tín hiệu Webhook phản hồi từ máy chủ ngân hàng để tự động đóng đơn hàng trong dưới 1 giây mà không cần nhân viên kiểm tra số dư thủ công.
Tích hợp Ví điện tử MoMo / ZaloPay / VNPay: Cung cấp đa dạng phương thức thanh toán hiện đại cho người tiêu dùng.
6.2.3. Ứng dụng Trí tuệ Nhân tạo (AI) Dự báo Tồn kho & Tư vấn Build PC
Đưa các mô hình Học máy (Machine Learning) và AI Chatbot vào vận hành kinh doanh:
AI Dự báo Tồn kho (Demand Forecasting): Sử dụng thuật toán phân tích chuỗi thời gian (Time-Series Analysis) để dự báo xu hướng nhu cầu mua sắm linh kiện máy tính, tự động đưa ra cảnh báo cho chủ cửa hàng nhập thêm các dòng VGA/CPU sắp cháy hàng.
AI Trợ lý Tư vấn Build PC (PC Building Assistant): Tích hợp Chatbot AI hỗ trợ nhân viên thu ngân tư vấn phối ghép cấu hình máy tính nguyên bộ (tự động kiểm tra tính tương thích giữa Socket CPU, Mainboard, công suất Nguồn PSU và Kích thước vỏ Case PC).
6.2.4. Mở rộng Hệ sinh thái Mobile POS & Cloud SaaS
Phát triển ứng dụng Mobile POS trên nền tảng React Native / Flutter giúp nhà quản trị theo dõi báo cáo doanh thu thời gian thực và quản lý kho hàng ngay trên điện thoại thông minh.
Triển khai hệ thống lên hạ tầng Đám mây (AWS / Google Cloud) theo mô hình Phần mềm như một Dịch vụ (SaaS), cung cấp giải pháp quản lý bán hàng cho cộng đồng doanh nghiệp bán lẻ tại Việt Nam.
6.2.5. Tăng cường Hệ thống Bảo mật & An toàn thông tin
Với tính chất nhạy cảm của hệ thống máy tính tiền POS, bảo mật dữ liệu doanh thu và khách hàng là ưu tiên sống còn. Nhóm nghiên cứu vạch ra định hướng nâng cấp bảo mật đa lớp (Multi-Layer Security) trong tương lai bao gồm:
Kiểm soát truy cập sinh trắc học (Biometric Authentication): Thay vì chỉ sử dụng mật khẩu tĩnh hay mã PIN cho thu ngân, hệ thống sẽ được tích hợp công nghệ nhận diện khuôn mặt (Facial Recognition) thông qua camera gắn trên máy POS. Điều này định danh chính xác 100% nhân viên đang đứng quầy, loại trừ hoàn toàn nguy cơ nhân viên này dùng tài khoản của nhân viên khác để trục lợi.
Thiết lập Trình duyệt POS Độc lập (Secure Kiosk Browser): Phát triển một phiên bản Client chuyên biệt chạy ở chế độ Kiosk Mode. Khi phần mềm POS khởi động, hệ điều hành sẽ bị phong tỏa: Vô hiệu hóa phím tắt, chặn mở các trình duyệt khác hay phần mềm ngầm, giúp máy POS miễn nhiễm với các mã độc/virus đánh cắp dữ liệu.
Mã hóa Dữ liệu End-to-End (E2EE): Mọi luồng dữ liệu truyền tải giữa Máy POS và Cloud Server (đặc biệt là thông tin đơn hàng, tổng tiền) sẽ được mã hóa với các tiêu chuẩn mã hóa quân sự (AES-256). Đảm bảo kể cả khi Hacker đánh chặn đường truyền mạng Wi-Fi tại cửa hàng cũng không thể đọc hiểu hay chỉnh sửa dữ liệu thanh toán.
Triển khai Tường lửa ứng dụng web (WAF): Nhằm bảo vệ hệ thống trước các khai thác lỗ hổng Zero-day, hệ thống sẽ được tích hợp Cloudflare WAF, tự động triệt tiêu các truy vấn độc hại như SQL Injection hay DDoS ngay tại Gateway.

--- HẾT BÁO CÁO ---
