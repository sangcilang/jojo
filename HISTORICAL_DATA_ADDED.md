# ✅ ĐÃ THÊM DỮ LIỆU LỊCH SỬ VÀ BỘ LỌC THỜI GIAN

## Dữ liệu đã tạo

### 📊 Thống kê tổng quan
- **Tổng đơn hàng**: 203 đơn
- **Tổng doanh thu**: 4,161,470,000đ (~4.16 tỷ)
- **Thời gian**: Từ 1/1/2026 đến 9/4/2026
- **Phân bố**: Rải rác đều trong 98 ngày

### 📅 Thống kê theo tháng
- **Tháng 1/2026**: 56 đơn - 1,178,500,000đ
- **Tháng 2/2026**: 41 đơn - 803,400,000đ
- **Tháng 3/2026**: 71 đơn - 1,682,160,000đ
- **Tháng 4/2026**: 35 đơn - 497,410,000đ

## Tính năng mới: Bộ lọc thời gian

### 4 chế độ xem
1. **Tuần (7 ngày)** - Xem doanh thu 7 ngày gần nhất
2. **Tháng (30 ngày)** - Xem doanh thu 30 ngày gần nhất
3. **Năm (12 tháng)** - Xem doanh thu 12 tháng gần nhất
4. **Tất cả** - Xem toàn bộ dữ liệu từ đầu

### Cách sử dụng
1. Đăng nhập admin: http://localhost:3000
2. Vào tab "stats"
3. Click vào các nút: "Tuần (7 ngày)", "Tháng (30 ngày)", "Năm (12 tháng)", "Tất cả"
4. Biểu đồ sẽ tự động cập nhật

## Thay đổi kỹ thuật

### Backend API
**Endpoint**: `GET /api/admin/stats?range={timeRange}`

**Query Parameters**:
- `range=7days` - 7 ngày gần đây (mặc định)
- `range=30days` - 30 ngày gần đây
- `range=12months` - 12 tháng gần đây
- `range=all` - Tất cả thời gian

**Response**:
```json
{
  "totalUsers": 2,
  "totalAdmins": 1,
  "totalProducts": 100,
  "totalOrders": 203,
  "totalRevenue": 4161470000,
  "revenueByTime": [
    { "date": "2026-01", "revenue": 1178500000 },
    { "date": "2026-02", "revenue": 803400000 },
    ...
  ],
  "ordersByStatus": [...],
  "topProducts": [...],
  "newUsersByMonth": [...],
  "timeRange": "12months"
}
```

### Frontend
- Thêm state `timeRange` trong AdminPage
- Thêm function `handleChangeTimeRange` để reload data
- Thêm 4 nút filter ở đầu trang stats
- Cập nhật tiêu đề biểu đồ theo time range
- Format label trục X theo loại dữ liệu (ngày hoặc tháng)

### Database Queries
**7 days / 30 days**:
```sql
SELECT 
  DATE(CreatedAt) as date,
  SUM(Total) as revenue
FROM Orders
WHERE CreatedAt >= DATE('now', '-7 days')
GROUP BY DATE(CreatedAt)
ORDER BY date
```

**12 months / all**:
```sql
SELECT 
  strftime('%Y-%m', CreatedAt) as date,
  SUM(Total) as revenue
FROM Orders
WHERE CreatedAt >= DATE('now', '-12 months')
GROUP BY strftime('%Y-%m', CreatedAt)
ORDER BY date
```

## Script tạo dữ liệu

### File: `backend/scripts/seed-historical-orders.js`

**Tính năng**:
- Tạo 150-200 đơn hàng ngẫu nhiên
- Phân bố đều từ 1/1/2026 đến hiện tại
- Random giờ phút giây cho mỗi đơn
- Đơn cũ hơn 7 ngày: 80% đã giao, 15% đã hủy
- Đơn mới: Random tất cả trạng thái
- 1-4 sản phẩm mỗi đơn
- Random số lượng 1-3
- 60% pickup, 40% delivery

**Chạy script**:
```bash
cd backend
node scripts/seed-historical-orders.js
```

**Output**:
```
🚀 Bắt đầu tạo dữ liệu lịch sử...

Tạo đơn hàng từ 1/1/2026 đến 4/9/2026
Tổng số ngày: 98
Sẽ tạo 183 đơn hàng

✓ Đã tạo 20/183 đơn hàng...
✓ Đã tạo 40/183 đơn hàng...
...
✅ Hoàn tất! Đã tạo 183/183 đơn hàng

📊 Thống kê tổng quan:
   Tổng đơn hàng: 203
   Tổng doanh thu: 4,161,470,000đ
   ...
```

## Biểu đồ cập nhật

### 📈 Biểu đồ Doanh Thu
- **7 ngày**: Hiển thị theo ngày (dd/mm)
- **30 ngày**: Hiển thị theo ngày (dd/mm)
- **12 tháng**: Hiển thị theo tháng (yyyy-mm)
- **Tất cả**: Hiển thị theo tháng (yyyy-mm)

### Ví dụ dữ liệu
**Tuần (7 ngày)**:
- 3/4, 4/4, 5/4, 6/4, 7/4, 8/4, 9/4

**Tháng (30 ngày)**:
- 10/3, 11/3, ..., 8/4, 9/4

**Năm (12 tháng)**:
- 2026-01, 2026-02, 2026-03, 2026-04

**Tất cả**:
- 2026-01, 2026-02, 2026-03, 2026-04

## Lợi ích

✅ Xem xu hướng doanh thu theo nhiều khoảng thời gian
✅ So sánh hiệu suất kinh doanh theo tuần/tháng/năm
✅ Phân tích mùa vụ và chu kỳ kinh doanh
✅ Dữ liệu phong phú để demo và test
✅ Dễ dàng mở rộng thêm time range khác

## Tùy chỉnh

### Thêm time range mới
1. Thêm option vào mảng trong AdminPage:
```javascript
{ value: '90days', label: 'Quý (90 ngày)' }
```

2. Thêm case trong backend API:
```javascript
else if (timeRange === '90days') {
  revenueQuery = `...`;
}
```

### Thay đổi số lượng đơn hàng
Sửa trong `seed-historical-orders.js`:
```javascript
const totalOrders = 300 + Math.floor(Math.random() * 50);
```

## Kiểm tra

### Test API
```bash
# 7 days
curl "http://localhost:4000/api/admin/stats?range=7days" -H "Authorization: Bearer YOUR_TOKEN"

# 30 days
curl "http://localhost:4000/api/admin/stats?range=30days" -H "Authorization: Bearer YOUR_TOKEN"

# 12 months
curl "http://localhost:4000/api/admin/stats?range=12months" -H "Authorization: Bearer YOUR_TOKEN"

# All
curl "http://localhost:4000/api/admin/stats?range=all" -H "Authorization: Bearer YOUR_TOKEN"
```

### Test Frontend
1. Mở http://localhost:3000
2. Đăng nhập admin
3. Click từng nút filter
4. Xem biểu đồ thay đổi

## Lưu ý

- Dữ liệu được tạo ngẫu nhiên, mỗi lần chạy script sẽ khác nhau
- Đơn hàng cũ hơn 7 ngày có tỷ lệ "Đã giao" cao hơn (80%)
- Biểu đồ tự động điều chỉnh scale theo dữ liệu
- Filter không ảnh hưởng đến các biểu đồ khác (Top Products, Order Status, New Users)

---

**Chúc bạn phân tích dữ liệu vui vẻ! 📊📈**
