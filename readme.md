# Website Đoàn Khoa Mạng máy tính và Truyền thông — UIT

Trang thông tin giới thiệu chính thức của **Đoàn TNCS Hồ Chí Minh Khoa Mạng máy tính và Truyền thông** (Trường Đại học Công nghệ Thông tin – ĐHQG-HCM).

## 1. Công nghệ sử dụng (v3 React)
- **Frontend:** React 19, React Router v7, Motion (`motion/react`), CSS3 thuần chia theo module.
- **Công cụ đóng gói:** Vite 6.
- **Phong cách thiết kế:** Modern Frosted Glassmorphism (tông màu xanh Royal Blue & Ice đặc trưng của Khoa MMT&TT, hiệu ứng kính mờ `backdrop-filter`, chuyển động vật lý `spring`, font chữ `Montserrat` đồng bộ, tương thích 100% Desktop / Tablet / Mobile).
- **Bảo vệ tài nguyên:** Không cho phép tải file tài liệu `.docx` từ giao diện web, loại bỏ toàn bộ file `.docx` khỏi gói `dist/` khi xuất bản và chặn thao tác kéo/lưu ảnh trực tiếp.

---

## 2. Cấu trúc thư mục

```text
vibecodeweb/
├── resources/                        # Toàn bộ ảnh hoạt động, thành tích & tư liệu tham khảo gốc
│   ├── CHUỖI TRAINING/
│   ├── GIẢI ĐẤU TFT/
│   ├── GIỚI THIỆU ÁO KHOA/
│   ├── HOLD THE FLAG/
│   ├── HỘI THI CÁN BỘ ĐOÀN GIỎI/
│   ├── images/
│   ├── NC OPEN BADMINTON 2026/
│   ├── NETSECDAY/
│   ├── NEWBIE TO CREWBIE/
│   ├── NGỌN ĐUỐC XANH/
│   ├── NoiDungChinh/                 # Tài liệu nội dung & bảng màu gốc (chỉ lưu nội bộ)
│   ├── THANH NIÊN TIÊN TIẾN LÀM THEO LỜI BÁC/
│   ├── Thanh Tich/
│   ├── TRUYỀN THÔNG TẾT/
│   └── VNU TOUR/
├── src/
│   ├── pages/                        # Các trang định tuyến (HomePage, DepartmentPage)
│   ├── components/
│   │   ├── layout/                   # Header, Footer
│   │   ├── sections/                 # HeroSection, AboutSection, ActivitiesSection,
│   │   │                             # AchievementsSection, ContactSection, CommunityPhotoDeck
│   │   └── ui/                       # Icons, LightboxDialog, ChatWidget (Trợ lý ảo FAQ)
│   ├── hooks/                        # Custom hooks (useModalDialog, useAutoCycle)
│   ├── data/                         # Dữ liệu tĩnh tách biệt khỏi giao diện
│   │   ├── heroSlides.js             # 4 slide ảnh cộng đồng ở Hero
│   │   ├── activities.js             # 12 hoạt động tiêu biểu & danh mục bộ lọc
│   │   ├── departments.js            # 3 ban chuyên môn (Tuyên truyền, Phong trào, Tổ chức)
│   │   └── faqData.js                # 25 câu hỏi thường gặp cho Trợ lý Đoàn Khoa
│   ├── utils/                        # Thuật toán tìm kiếm & so khớp câu hỏi (faqSearch.js)
│   ├── styles/                       # Hệ thống CSS chia theo module
│   │   ├── index.css                 # Điểm nhập CSS duy nhất
│   │   ├── base.css                  # Biến màu (:root), reset & nền trang
│   │   ├── layout.css                # Thanh điều hướng (Header) & chân trang (Footer)
│   │   ├── hero.css                  # Khối mở đầu (Hero) & nhãn cộng đồng tương tác
│   │   ├── sections.css              # Giới thiệu, Cơ cấu, Hoạt động, Thành tích, Liên hệ & bộ bài Polaroid
│   │   ├── department.css            # Trang chi tiết các Ban chuyên môn
│   │   ├── dialogs.css               # Hộp thoại chi tiết hoạt động & phóng to ảnh (Lightbox)
│   │   ├── responsive.css            # Media queries cho Tablet, Mobile & Reduced Motion
│   │   └── chatbox.css               # Giao diện Trợ lý Đoàn Khoa MMT&TT
│   ├── App.jsx                       # Cấu hình định tuyến (Routes) & cuộn trang
│   └── main.jsx                      # Điểm khởi chạy ứng dụng React
├── index.html
├── package.json
├── vercel.json
└── vite.config.js                    # Cấu hình Vite & plugin phục vụ ảnh từ resources/
```

---

## 3. Hướng dẫn cài đặt & chạy dự án

Yêu cầu cài đặt sẵn **Node.js** (phiên bản 18 trở lên):

```bash
# 1. Cài đặt các gói thư viện
npm install

# 2. Chạy máy chủ phát triển (Development Server)
npm run dev

# 3. Đóng gói bản chính thức (Production Build ra thư mục dist/)
npm run build

# 4. Xem thử bản Production trên máy cục bộ
npm run preview
```

---

## 4. Hướng dẫn cập nhật nội dung
- **Thêm/sửa hoạt động:** Chỉnh sửa mảng `ACTIVITIES` trong `src/data/activities.js`. Nhóm hợp lệ (`category`): `'study'` (Học thuật), `'volunteer'` (Tình nguyện), `'connect'` (Gắn kết), `'sport'` (Thể thao).
- **Chỉnh sửa thông tin các Ban chuyên môn:** Cập nhật đối tượng `DEPARTMENTS_DATA` trong `src/data/departments.js`.
- **Chỉnh sửa câu hỏi Trợ lý ảo (ChatWidget):** Cập nhật danh sách `FAQ_DATA` và `SUGGESTED_QUESTIONS` trong `src/data/faqData.js`.
- **Thêm hình ảnh mới:** Đặt hình ảnh vào thư mục tương ứng bên trong `resources/`. Plugin `preserveOriginalAssetsPlugin` trong `vite.config.js` sẽ tự động phục vụ và đóng gói các tệp ảnh (`.jpg`, `.jpeg`, `.png`, `.pdf`) mà không xuất các tệp `.docx` nội bộ.
