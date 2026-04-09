# Hướng Dẫn Sử Dụng Sơ Đồ

## 📁 Cấu trúc thư mục

```
sodo/
├── README.md                           # Tổng quan về các sơ đồ
├── HUONG-DAN-SU-DUNG.md               # File này
├── 1-phan-cap-chuc-nang.md            # Sơ đồ phân cấp chức năng
├── 2-usecase-tong-quat.md             # Use Case diagram
├── 3-so-do-tuan-tu-dat-hang.md        # Sequence diagram - Đặt hàng
├── 4-so-do-tuan-tu-staff-xu-ly-don.md # Sequence diagram - Staff
├── 5-so-do-hoat-dong-dat-hang.md      # Activity diagram - Đặt hàng
├── 6-so-do-hoat-dong-staff-xu-ly.md   # Activity diagram - Staff
├── 7-so-do-hoat-dong-admin.md         # Activity diagram - Admin
└── 8-so-do-hoat-dong-build-pc.md      # Activity diagram - Build PC
```

## 🎨 Cách xem sơ đồ

### Phương án 1: Xem trực tiếp trên GitHub
- Tất cả file `.md` chứa sơ đồ Mermaid
- GitHub tự động render sơ đồ Mermaid
- Chỉ cần mở file và xem

### Phương án 2: Sử dụng VS Code
1. Cài extension: **Markdown Preview Mermaid Support**
2. Mở file `.md`
3. Nhấn `Ctrl+Shift+V` để xem preview

### Phương án 3: Mermaid Live Editor
1. Truy cập: https://mermaid.live/
2. Copy nội dung trong code block ```mermaid ... ```
3. Paste vào editor
4. Xem và chỉnh sửa trực tiếp
5. Xuất ra PNG, SVG, PDF

### Phương án 4: Tạo file Draw.io
1. Truy cập: https://app.diagrams.net/
2. Tạo file mới
3. Vẽ lại sơ đồ dựa trên các file Mermaid
4. Lưu thành file `.drawio`

## 📊 Danh sách sơ đồ chi tiết

### 1. Sơ Đồ Phân Cấp Chức Năng
**File**: `1-phan-cap-chuc-nang.md`

**Mô tả**: Cây phân cấp tất cả chức năng của hệ thống theo 3 vai trò

**Nội dung**:
- User: 7 nhóm chức năng chính
- Staff: 1 nhóm chức năng quản lý đơn hàng
- Admin: 5 nhóm chức năng quản trị

### 2. Use Case Tổng Quát
**File**: `2-usecase-tong-quat.md`

**Mô tả**: Các ca sử dụng chính và mối quan hệ giữa actors

**Nội dung**:
- 10 use cases cho User
- 3 use cases cho Staff
- 5 use cases cho Admin
- Tích hợp với VNPay và Email

### 3. Sơ Đồ Tuần Tự - Đặt Hàng
**File**: `3-so-do-tuan-tu-dat-hang.md`

**Mô tả**: Luồng tương tác khi user đặt hàng

**Các bước**:
1. Xem sản phẩm
2. Thêm vào giỏ hàng
3. Xem giỏ hàng
4. Đặt hàng (COD/VNPay)
5. Xem đơn hàng

### 4. Sơ Đồ Tuần Tự - Staff Xử Lý
**File**: `4-so-do-tuan-tu-staff-xu-ly-don.md`

**Mô tả**: Luồng staff xử lý đơn hàng

**Các bước**:
1. Đăng nhập
2. Xem danh sách đơn
3. Tìm kiếm/Lọc
4. Xem chi tiết
5. Cập nhật trạng thái
6. In hóa đơn
7. Hủy đơn

### 5. Sơ Đồ Hoạt Động - Đặt Hàng
**File**: `5-so-do-hoat-dong-dat-hang.md`

**Mô tả**: Quy trình nghiệp vụ đặt hàng chi tiết

**Luồng chính**:
- Đăng nhập → Xem sản phẩm → Giỏ hàng → Chọn phương thức → Thanh toán → Hoàn thành

### 6. Sơ Đồ Hoạt Động - Staff
**File**: `6-so-do-hoat-dong-staff-xu-ly.md`

**Mô tả**: Quy trình staff xử lý đơn hàng

**Luồng chính**:
- Tải đơn → Tìm kiếm/Lọc → Xem chi tiết → Cập nhật trạng thái → Hoàn thành

**Workflow**:
- Pickup: Đang chuẩn bị → Sẵn sàng → Hoàn thành
- Delivery: Đang chuẩn bị → Đang giao → Đã giao → Hoàn thành

### 7. Sơ Đồ Hoạt Động - Admin
**File**: `7-so-do-hoat-dong-admin.md`

**Mô tả**: Quy trình admin quản lý hệ thống

**Chức năng**:
- Thống kê với biểu đồ
- Quản lý sản phẩm (CRUD)
- Quản lý danh mục (CRUD)
- Quản lý người dùng (Khóa/Mở khóa)
- Quản lý đơn hàng (Xem tất cả)

### 8. Sơ Đồ Hoạt Động - Build PC
**File**: `8-so-do-hoat-dong-build-pc.md`

**Mô tả**: Thuật toán gợi ý cấu hình PC

**Luồng**:
1. Nhập ngân sách
2. Chọn mục đích (office/gaming/IT/content)
3. Tính toán cấu hình tối ưu
4. Hiển thị kết quả
5. Thêm vào giỏ hàng

## 🎯 Mục đích sử dụng

### Cho Developer
- Hiểu rõ luồng xử lý của hệ thống
- Tham khảo khi implement tính năng mới
- Debug và tìm lỗi logic

### Cho Tester
- Viết test case dựa trên use case
- Kiểm tra luồng nghiệp vụ
- Validate workflow

### Cho Business Analyst
- Phân tích yêu cầu nghiệp vụ
- Thiết kế quy trình mới
- Tối ưu trải nghiệm người dùng

### Cho Documentation
- Tài liệu hóa hệ thống
- Onboarding nhân viên mới
- Báo cáo dự án

## 💡 Tips

1. **Xem theo thứ tự**: Bắt đầu từ sơ đồ phân cấp → Use case → Tuần tự → Hoạt động
2. **Kết hợp với code**: Đối chiếu sơ đồ với source code để hiểu rõ hơn
3. **Cập nhật thường xuyên**: Khi có thay đổi tính năng, cập nhật sơ đồ
4. **Sử dụng màu sắc**: Trong Mermaid, các màu đã được định nghĩa để phân biệt
5. **Export**: Xuất ra PNG/PDF để dùng trong báo cáo

## 🔄 Cập nhật sơ đồ

Khi có thay đổi tính năng:

1. Mở file `.md` tương ứng
2. Chỉnh sửa code Mermaid
3. Preview để kiểm tra
4. Commit và push lên Git
5. GitHub tự động render sơ đồ mới

## 📞 Liên hệ

Nếu có thắc mắc về sơ đồ:
- Email: admin@tdatpc.store
- Hotline: 0909954360
