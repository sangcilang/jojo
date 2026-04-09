# Sơ Đồ Phân Tích Thiết Kế Hệ Thống Bán Hàng Linh Kiện

Thư mục này chứa tất cả các sơ đồ phân tích và thiết kế hệ thống TDatPC.Store

## 📁 Cấu trúc thư mục

```
sodo/
├── README.md                              # File này
├── HUONG-DAN-SU-DUNG.md                  # Hướng dẫn xem và sử dụng sơ đồ
├── HUONG-DAN-TAO-DRAWIO.md               # Hướng dẫn tạo file Draw.io chi tiết
├── TDatPC-Store-Tat-Ca-So-Do.drawio      # ⭐ File Draw.io tổng hợp 8 sơ đồ
├── 1-phan-cap-chuc-nang.md               # Sơ đồ phân cấp chức năng
├── 2-usecase-tong-quat.md                # Use Case diagram
├── 3-so-do-tuan-tu-dat-hang.md           # Sequence diagram - Đặt hàng
├── 4-so-do-tuan-tu-staff-xu-ly-don.md    # Sequence diagram - Staff
├── 5-so-do-hoat-dong-dat-hang.md         # Activity diagram - Đặt hàng
├── 6-so-do-hoat-dong-staff-xu-ly.md      # Activity diagram - Staff
├── 7-so-do-hoat-dong-admin.md            # Activity diagram - Admin
└── 8-so-do-hoat-dong-build-pc.md         # Activity diagram - Build PC
```

## 📊 Danh sách sơ đồ

1. **Sơ đồ phân cấp chức năng** - Cấu trúc tổng quan các chức năng theo vai trò
2. **Use Case tổng quát** - Các ca sử dụng chính của hệ thống
3. **Sơ đồ tuần tự - Đặt hàng** - Luồng tương tác khi user đặt hàng
4. **Sơ đồ tuần tự - Staff** - Luồng staff xử lý đơn hàng
5. **Sơ đồ hoạt động - Đặt hàng** - Quy trình nghiệp vụ đặt hàng
6. **Sơ đồ hoạt động - Staff** - Quy trình staff xử lý đơn
7. **Sơ đồ hoạt động - Admin** - Quy trình admin quản lý
8. **Sơ đồ hoạt động - Build PC** - Thuật toán gợi ý cấu hình

## 🎨 Cách sử dụng

### Phương án 1: Xem sơ đồ Mermaid trực tiếp
Các file `.md` chứa code Mermaid có thể xem trực tiếp trên GitHub hoặc:
- [Mermaid Live Editor](https://mermaid.live/)
- VS Code với extension "Markdown Preview Mermaid Support"

### Phương án 2: Sử dụng file Draw.io (Khuyến nghị)
1. Mở file **`TDatPC-Store-Tat-Ca-So-Do.drawio`**
2. File có 8 trang (pages), mỗi trang là một sơ đồ
3. Hiện tại chỉ có hướng dẫn, cần import hình ảnh từ Mermaid
4. Xem chi tiết tại: **`HUONG-DAN-TAO-DRAWIO.md`**

### Phương án 3: Tự tạo file Draw.io hoàn chỉnh
Xem hướng dẫn chi tiết trong file **`HUONG-DAN-TAO-DRAWIO.md`** với:
- Cách xuất PNG/SVG từ Mermaid Live Editor
- Cách import vào Draw.io
- Cách vẽ lại thủ công từng loại sơ đồ
- Bảng màu chuẩn và kích thước khuyến nghị

## Hệ thống có 3 vai trò chính

### 👤 User (Khách hàng)
- Xem sản phẩm, tìm kiếm, lọc
- Quản lý giỏ hàng
- Đặt hàng (pickup/delivery)
- Xác nhận nhận hàng
- Build PC thông minh

### 👨‍💼 Staff (Nhân viên)
- Xem danh sách đơn hàng
- Cập nhật trạng thái đơn hàng
- Hủy đơn hàng
- In hóa đơn

### 👨‍💻 Admin (Quản trị viên)
- Quản lý sản phẩm (CRUD)
- Quản lý danh mục
- Quản lý người dùng
- Xem thống kê, báo cáo
- Xem tất cả đơn hàng

## Công nghệ

- **Frontend**: React.js
- **Backend**: Node.js + Express
- **Database**: SQLite
- **Authentication**: JWT
