# Chức Năng Nhân Viên Đã Được Thêm Vào

## Tổng Quan

Đã thêm thành công role **Nhân Viên (Staff)** với đầy đủ chức năng quản lý đơn hàng theo use case diagram.

## Thông Tin Đăng Nhập

**Tài khoản nhân viên demo:**
- Username: `nhanvien`
- Password: `Staff@123`

## Các Chức Năng Nhân Viên

### 1. 🔍 Xem Danh Sách Đơn Hàng
- Hiển thị tất cả đơn hàng của khách hàng
- Sắp xếp theo thời gian mới nhất
- Hiển thị thông tin: mã đơn, khách hàng, ngày tạo, tổng tiền, trạng thái

### 2. 🔎 Tìm Kiếm và Lọc Đơn Hàng
- **Tìm kiếm theo mã đơn hàng**: Nhập mã đơn để tìm nhanh
- **Lọc theo trạng thái**:
  - Tất cả
  - 📦 Đang chuẩn bị
  - 🚚 Đang giao
  - 🏪 Sẵn sàng nhận
  - ✅ Đã giao
  - ✅ Hoàn thành
  - ❌ Đã hủy
- Hiển thị số lượng đơn hàng tìm thấy
- Nút "Xóa bộ lọc" để reset

### 3. 📋 Xem Chi Tiết Đơn Hàng
Click vào đơn hàng để xem:
- **Workflow animation**: Hiển thị tiến độ đơn hàng trực quan
- **Danh sách sản phẩm**: Hình ảnh, tên, số lượng, đơn giá
- **Tổng tiền**: Tạm tính, phí ship, tổng cộng
- **Địa chỉ giao hàng** (nếu là giao hàng)
- **Phương thức thanh toán**: VNPay, Tại store, COD

### 4. ✅ Xác Nhận và Cập Nhật Trạng Thái

#### Đơn hàng NHẬN TẠI STORE:
1. **Đang chuẩn bị** → Bấm "✅ Xác nhận sẵn sàng nhận" → **Sẵn sàng nhận**
2. **Sẵn sàng nhận** → Bấm "✅ Xác nhận đã nhận hàng" → **Hoàn thành**

#### Đơn hàng GIAO HÀNG:
1. **Đang chuẩn bị** → Bấm "🚚 Bắt đầu giao hàng" → **Đang giao hàng**
2. **Đang giao hàng** → Bấm "✅ Xác nhận đã giao" → **Đã giao hàng**
3. **Đã giao hàng** → Bấm "✅ Hoàn thành đơn hàng" → **Hoàn thành**

### 5. ❌ Hủy Đơn Hàng
- Nhân viên có thể hủy đơn hàng chưa hoàn thành
- Hiển thị xác nhận trước khi hủy
- Đơn đã hủy hoặc hoàn thành không thể thay đổi

### 6. 🖨️ In Hóa Đơn
- Bấm nút "🖨️ In hóa đơn" để in
- Mở cửa sổ mới với hóa đơn định dạng đẹp
- Bao gồm:
  - Thông tin cửa hàng
  - Thông tin đơn hàng
  - Chi tiết sản phẩm (bảng)
  - Tổng tiền chi tiết
  - Lời cảm ơn khách hàng

## Giao Diện

### Sidebar Nhân Viên
- Icon: 👨‍💼 Nhân Viên
- Menu: 🛒 Quản Lý Đơn Hàng

### Header
Khi đăng nhập với role staff:
- Nút "Quản lý đơn hàng" (màu info)
- Nút "Tài khoản"
- Nút "Đăng xuất"
- Không hiển thị các chức năng user (giỏ hàng, yêu thích, v.v.)

## Kiến Trúc Kỹ Thuật

### Backend API Endpoints

#### 1. GET `/api/staff/orders`
- **Mô tả**: Lấy danh sách tất cả đơn hàng
- **Auth**: Yêu cầu token và role "staff"
- **Response**: Array of orders

#### 2. PATCH `/api/staff/orders/:id/status`
- **Mô tả**: Cập nhật trạng thái đơn hàng
- **Auth**: Yêu cầu token và role "staff"
- **Body**: `{ status: string }`
- **Valid statuses**:
  - "Cho nhan tai store"
  - "Dang chuan bi giao"
  - "Dang giao hang"
  - "Da giao hang"
  - "Hoan thanh"
  - "Da huy"
- **Response**: Updated order

### Frontend Components

#### StaffPage Component
- **Location**: `frontend/src/App.js`
- **Props**:
  - `staffOrders`: Array of orders
  - `onUpdateOrderStatus`: Function to update order status
- **Features**:
  - Search and filter orders
  - Expandable order details
  - Status update buttons
  - Print invoice functionality

### Database

#### Users Table
Đã thêm user staff:
```sql
Id: usr-staff
Username: nhanvien
Email: staff@zanee.store
Phone: 0901234567
Role: staff
```

## Workflow Diagram

```
Nhân viên đăng nhập
    ↓
Xem danh sách đơn hàng
    ↓
Tìm kiếm / Lọc đơn hàng (optional)
    ↓
Click vào đơn hàng → Xem chi tiết
    ↓
Chọn hành động:
    ├─ Cập nhật trạng thái đơn hàng
    ├─ Hủy đơn hàng
    └─ In hóa đơn
```

## Phân Quyền

### Staff có thể:
- ✅ Xem tất cả đơn hàng
- ✅ Cập nhật trạng thái đơn hàng
- ✅ Hủy đơn hàng
- ✅ In hóa đơn
- ✅ Tìm kiếm và lọc đơn hàng

### Staff KHÔNG thể:
- ❌ Quản lý sản phẩm
- ❌ Quản lý danh mục
- ❌ Quản lý người dùng
- ❌ Xem thống kê
- ❌ Mua hàng (giỏ hàng, yêu thích)

## Testing

### Test Scenarios

1. **Đăng nhập nhân viên**
   - Vào trang đăng nhập
   - Nhập: `nhanvien` / `Staff@123`
   - Kiểm tra redirect đến trang staff

2. **Xem danh sách đơn hàng**
   - Kiểm tra hiển thị đầy đủ thông tin
   - Kiểm tra sắp xếp theo thời gian

3. **Tìm kiếm đơn hàng**
   - Nhập mã đơn hàng
   - Kiểm tra kết quả lọc đúng

4. **Lọc theo trạng thái**
   - Click các nút lọc
   - Kiểm tra chỉ hiển thị đơn đúng trạng thái

5. **Cập nhật trạng thái**
   - Click vào đơn hàng
   - Bấm nút cập nhật trạng thái
   - Kiểm tra workflow animation cập nhật

6. **Hủy đơn hàng**
   - Click nút "Hủy đơn hàng"
   - Xác nhận
   - Kiểm tra trạng thái chuyển sang "Đã hủy"

7. **In hóa đơn**
   - Click nút "In hóa đơn"
   - Kiểm tra cửa sổ mới mở ra
   - Kiểm tra nội dung hóa đơn đầy đủ

## Files Changed

### Backend
- ✅ `backend/src/seedData.js` - Thêm user staff
- ✅ `backend/src/server.js` - Thêm staff API endpoints

### Frontend
- ✅ `frontend/src/App.js` - Thêm StaffPage component, routing, handlers

## Notes

- Nhân viên chỉ có thể cập nhật trạng thái theo workflow logic
- Đơn hàng đã hoàn thành hoặc đã hủy không thể thay đổi
- In hóa đơn sử dụng window.print() để in trực tiếp
- Tất cả text đều bằng tiếng Việt

## Hướng Dẫn Sử Dụng

1. **Khởi động ứng dụng**:
   ```bash
   # Terminal 1 - Backend
   cd backend
   node src/server.js
   
   # Terminal 2 - Frontend
   cd frontend
   npm start
   ```

2. **Đăng nhập nhân viên**:
   - Mở http://localhost:3000
   - Click "Đăng nhập / Đăng ký"
   - Nhập: `nhanvien` / `Staff@123`

3. **Quản lý đơn hàng**:
   - Tự động redirect đến trang quản lý đơn hàng
   - Hoặc click "Quản lý đơn hàng" trên header

## Troubleshooting

### Lỗi "403 - Không có quyền"
- Kiểm tra đã đăng nhập với tài khoản staff
- Kiểm tra token còn hiệu lực

### Không thấy đơn hàng
- Kiểm tra backend đang chạy
- Kiểm tra có đơn hàng trong database
- Mở Console (F12) xem lỗi API

### Không cập nhật được trạng thái
- Kiểm tra đơn hàng chưa hoàn thành/hủy
- Kiểm tra trạng thái mới hợp lệ
- Xem Console để debug

## Future Enhancements

Có thể mở rộng thêm:
- 📊 Thống kê đơn hàng cho nhân viên
- 📝 Ghi chú vào đơn hàng
- 📧 Gửi email thông báo cho khách hàng
- 📱 Quét mã QR đơn hàng
- 🔔 Thông báo đơn hàng mới
- 📈 Báo cáo hiệu suất nhân viên
