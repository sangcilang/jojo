# ✅ ĐÃ BỔ SUNG BIỂU ĐỒ THỐNG KÊ CHO TRANG ADMIN

## Các biểu đồ đã thêm

### 1. 📊 Thẻ thống kê tổng quan (Cards)
- 👥 Người dùng
- 👨‍💼 Admin
- 📦 Sản phẩm
- 🛒 Đơn hàng
- 💰 Doanh thu

### 2. 📈 Biểu đồ Doanh Thu 7 Ngày Gần Đây (Line Chart)
- Hiển thị xu hướng doanh thu theo ngày
- Màu xanh lá với gradient fill
- Tooltip hiển thị số tiền format VNĐ
- Trục Y hiển thị đơn vị triệu (M)

### 3. 📊 Biểu đồ Trạng Thái Đơn Hàng (Doughnut Chart)
- Phân bố đơn hàng theo trạng thái
- Màu sắc đa dạng cho mỗi trạng thái
- Legend hiển thị ở dưới

### 4. 🏆 Biểu đồ Top 5 Sản Phẩm Bán Chạy (Bar Chart)
- Hiển thị 5 sản phẩm bán chạy nhất
- Màu xanh lá
- Trục Y hiển thị số lượng bán

### 5. 👥 Biểu đồ Người Dùng Mới Theo Tháng (Bar Chart)
- Hiển thị 6 tháng gần nhất
- Màu xanh dương
- Trục Y hiển thị số người dùng

## Công nghệ sử dụng

- **Chart.js 4.x** - Thư viện biểu đồ JavaScript mạnh mẽ
- **react-chartjs-2** - React wrapper cho Chart.js
- **SQLite queries** - Truy vấn dữ liệu thống kê từ database

## Cách xem biểu đồ

1. Mở trình duyệt: http://localhost:3000
2. Đăng nhập với tài khoản admin:
   - Username: `admin`
   - Password: `Admin@123`
3. Click vào tab "stats" trong trang admin
4. Xem các biểu đồ thống kê

## Dữ liệu mẫu

Đã tạo 20 đơn hàng mẫu trong 7 ngày gần đây với:
- Tổng doanh thu: ~101,760,000đ
- Các trạng thái đơn hàng khác nhau
- Nhiều sản phẩm được mua
- Phân bố đều trong 7 ngày

## API Endpoints mới

### GET /api/admin/stats
Trả về dữ liệu thống kê bao gồm:

```json
{
  "totalUsers": 2,
  "totalAdmins": 1,
  "totalProducts": 100,
  "totalOrders": 20,
  "totalRevenue": 101760000,
  "revenueByDay": [
    { "date": "2026-04-02", "revenue": 14500000 },
    { "date": "2026-04-03", "revenue": 18200000 },
    ...
  ],
  "ordersByStatus": [
    { "status": "Cho nhan tai store", "count": 5 },
    { "status": "Dang chuan bi giao", "count": 4 },
    ...
  ],
  "topProducts": [
    { "name": "MSI GeForce RTX 4070 Super 12GB", "sold": 8 },
    { "name": "Intel Core i5-13400F", "sold": 6 },
    ...
  ],
  "newUsersByMonth": [
    { "month": "2026-04", "count": 1 },
    { "month": "2026-03", "count": 0 },
    ...
  ]
}
```

## Tính năng nổi bật

✅ Responsive design - Tự động điều chỉnh theo kích thước màn hình
✅ Interactive tooltips - Hiển thị thông tin chi tiết khi hover
✅ Smooth animations - Hiệu ứng mượt mà khi load biểu đồ
✅ Color-coded - Màu sắc phân biệt rõ ràng
✅ Real-time data - Dữ liệu cập nhật từ database thực tế

## Cấu trúc code

### Frontend (frontend/src/App.js)
- Import Chart.js components
- Register Chart.js plugins
- Render charts trong AdminPage component
- Xử lý dữ liệu và format hiển thị

### Backend (backend/src/server.js)
- Mở rộng API `/api/admin/stats`
- Thêm queries cho:
  - Doanh thu theo ngày
  - Trạng thái đơn hàng
  - Top sản phẩm bán chạy
  - Người dùng mới theo tháng

### Script tạo dữ liệu mẫu (backend/scripts/seed-orders.js)
- Tạo 20 đơn hàng mẫu
- Phân bố trong 7 ngày gần đây
- Random sản phẩm, số lượng, trạng thái

## Chạy lại script tạo dữ liệu mẫu

Nếu muốn tạo thêm đơn hàng mẫu:

```bash
cd backend
node scripts/seed-orders.js
```

## Tùy chỉnh biểu đồ

Các biểu đồ có thể tùy chỉnh trong `frontend/src/App.js`:

- **Màu sắc**: Thay đổi `backgroundColor` và `borderColor`
- **Kích thước**: Điều chỉnh `aspectRatio`
- **Hiển thị**: Bật/tắt `legend`, `tooltip`
- **Trục**: Tùy chỉnh `scales` options

## Lưu ý

- Biểu đồ chỉ hiển thị khi có dữ liệu
- Nếu không có dữ liệu, hiển thị "Chưa có dữ liệu"
- Dữ liệu được load khi vào trang admin
- Refresh trang để cập nhật dữ liệu mới

## Screenshots

Xem trang admin tại: http://localhost:3000 (đăng nhập với admin/Admin@123)

---

**Chúc bạn sử dụng vui vẻ! 📊📈**
