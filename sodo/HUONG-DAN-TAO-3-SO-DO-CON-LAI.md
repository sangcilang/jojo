# Hướng Dẫn Tạo 3 Sơ Đồ Draw.io Còn Lại

## ✅ Đã hoàn thành

Đã tạo thành công 5 file Draw.io:
1. ✅ **01-phan-cap-chuc-nang.drawio** - Sơ đồ phân cấp chức năng
2. ✅ **02-usecase-tong-quat.drawio** - Use Case diagram
3. ✅ **03-so-do-tuan-tu-dat-hang.drawio** - Sequence diagram đặt hàng
4. ✅ **04-so-do-tuan-tu-staff-xu-ly-don.drawio** - Sequence diagram staff
5. ✅ **05-so-do-hoat-dong-dat-hang.drawio** - Activity diagram đặt hàng

## ⏳ Còn cần tạo

3 sơ đồ hoạt động (Activity diagrams) còn lại:
- **06-so-do-hoat-dong-staff-xu-ly.drawio**
- **07-so-do-hoat-dong-admin.drawio**
- **08-so-do-hoat-dong-build-pc.drawio**

---

## 🎨 Cách tạo nhanh nhất (Khuyến nghị)

### Phương án 1: Sử dụng Mermaid Live Editor (5-10 phút/sơ đồ)

**Bước 1: Xuất hình ảnh từ Mermaid**

1. Mở https://mermaid.live/
2. Copy code Mermaid từ các file:
   - `6-so-do-hoat-dong-staff-xu-ly.md`
   - `7-so-do-hoat-dong-admin.md`
   - `8-so-do-hoat-dong-build-pc.md`
3. Paste vào Mermaid Live Editor
4. Click **"Download PNG"** hoặc **"Download SVG"** (SVG tốt hơn vì có thể scale)

**Bước 2: Tạo file Draw.io và import**

1. Mở https://app.diagrams.net/
2. Tạo file mới: **File → New**
3. Import hình ảnh: **File → Import → Image**
4. Chọn file PNG/SVG vừa xuất
5. Lưu file: **File → Save As** với tên tương ứng

**Ưu điểm:**
- Nhanh nhất (5-10 phút/sơ đồ)
- Chính xác 100% với code Mermaid
- Không cần vẽ thủ công

---

### Phương án 2: Vẽ thủ công trong Draw.io (30-60 phút/sơ đồ)

Nếu bạn muốn file Draw.io có thể chỉnh sửa từng element:

#### Sơ đồ 06: Staff Xử Lý Đơn Hàng

**Cấu trúc:**
- Start node (ellipse, màu #c8e6c9): "Staff đăng nhập"
- Process nodes (rectangle, màu #bbdefb): "Tải danh sách", "Hiển thị danh sách", v.v.
- Decision nodes (diamond, màu #fff9c4): "Chọn hành động", "Loại đơn hàng?", v.v.
- End node (ellipse, màu #ffcdd2): "Kết thúc"

**Các bước chính:**
1. Staff đăng nhập → Tải danh sách đơn hàng
2. Hiển thị danh sách → Chọn hành động (Decision)
   - Tìm kiếm → Nhập mã đơn → Lọc kết quả
   - Lọc trạng thái → Chọn trạng thái → Lọc kết quả
   - Xem chi tiết → Hiển thị chi tiết
3. Chi tiết đơn → Chọn hành động (Decision)
   - In hóa đơn → Tạo HTML → Mở cửa sổ in
   - Cập nhật trạng thái → Kiểm tra loại đơn (Pickup/Delivery)
     - Pickup: Đang chuẩn bị → Sẵn sàng → Hoàn thành
     - Delivery: Đang chuẩn bị → Đang giao → Đã giao → Chờ user xác nhận → Hoàn thành
   - Hủy đơn → Xác nhận hủy → Cập nhật Đã hủy
4. Gọi API → Kiểm tra thành công → Refresh → Hiển thị thông báo
5. Đăng xuất → Kết thúc

**Màu sắc:**
- Start: `#c8e6c9` (xanh lá nhạt)
- Process: `#bbdefb` (xanh dương nhạt)
- Decision: `#fff9c4` (vàng nhạt)
- Update actions: `#bbdefb` (xanh dương)
- Complete: `#c8e6c9` (xanh lá)
- Cancel: `#ffcdd2` (đỏ nhạt)
- End: `#ffcdd2` (đỏ nhạt)

---

#### Sơ đồ 07: Admin Quản Lý Hệ Thống

**Cấu trúc:**
- Start: "Admin đăng nhập"
- Main menu: "Chọn chức năng" (Decision với 5 nhánh)

**Các nhánh chính:**

1. **Thống kê:**
   - Xem Dashboard → Chọn khoảng thời gian → Tải dữ liệu biểu đồ → Hiển thị biểu đồ

2. **Quản lý sản phẩm:**
   - Xem danh sách / Thêm mới / Sửa / Xóa
   - Validate dữ liệu → Gọi API → Refresh danh sách

3. **Quản lý danh mục:**
   - Xem / Thêm / Sửa / Xóa
   - Khi xóa: Chuyển sản phẩm sang danh mục "Khác"

4. **Quản lý người dùng:**
   - Xem danh sách / Khóa/Mở khóa
   - Kiểm tra role (không thể khóa admin)

5. **Quản lý đơn hàng:**
   - Xem tất cả / Tìm kiếm / Lọc / Xem chi tiết

**Màu sắc:** Giống sơ đồ 06

---

#### Sơ đồ 08: Build PC Thông Minh

**Cấu trúc:**
- Start: "User vào Build PC"
- Hiển thị form → Nhập ngân sách → Chọn mục đích

**Các mục đích (Decision với 5 nhánh):**
1. Văn phòng: CPU, Mainboard, RAM, SSD, Case, PSU, Monitor
2. Gaming cơ bản: + GPU, Cooling
3. Gaming nặng: + GPU cao cấp, Cooling
4. IT/Dev: + HDD, Cooling
5. Content Creator: + GPU, Cooling, Accessory

**Thuật toán:**
1. Xây dựng cấu hình
2. Tính toán: maxPerCategory = budget / số danh mục
3. Loop qua từng danh mục:
   - Lọc sản phẩm (thuộc danh mục, giá <= maxPerCategory * 2)
   - Sắp xếp theo giá giảm dần
   - Chọn sản phẩm phù hợp
   - Thêm vào danh sách
4. Kiểm tra: Còn danh mục? → Có: quay lại loop
5. Tính tổng tiền
6. Kiểm tra: Tổng > ngân sách?
   - Có: Tối ưu cấu hình (loại bỏ item đắt nhất, giữ tối thiểu 6 item)
   - Không: Hiển thị kết quả
7. User quyết định:
   - Thêm vào giỏ: Xóa giỏ hiện tại → Thêm tất cả → Gọi API → Chuyển đến giỏ hàng
   - Điều chỉnh: Quay lại nhập ngân sách hoặc chọn mục đích
   - Hủy: Quay lại trang chủ

**Màu sắc đặc biệt:**
- Các mục đích (5 nhánh): `#e1f5ff` (xanh nhạt)
- Các màu khác: Giống sơ đồ 06

---

## 📐 Kích thước và Layout khuyến nghị

### Cho Activity Diagrams (Flowcharts)

**Kích thước shapes:**
- Start/End (Ellipse): 120x60
- Process (Rectangle): 120x60
- Decision (Diamond): 160x80
- Note: 150x60

**Khoảng cách:**
- Vertical spacing: 40-60px giữa các nodes
- Horizontal spacing: 80-100px cho các nhánh song song

**Page size:**
- Width: 1169px (A4 landscape)
- Height: 1654px (hoặc tùy độ dài sơ đồ)

---

## 🎨 Bảng màu chuẩn

```
Start:           #c8e6c9  (xanh lá nhạt)
End:             #ffcdd2  (đỏ nhạt)
Process:         #bbdefb  (xanh dương nhạt)
Decision:        #fff9c4  (vàng nhạt)
Success:         #c8e6c9  (xanh lá nhạt)
Error/Cancel:    #ffcdd2  (đỏ nhạt)
External:        #f3e5f5  (tím nhạt)
Special:         #e1f5ff  (xanh nhạt)
```

---

## 🔧 Tips vẽ trong Draw.io

1. **Sử dụng Grid:** View → Grid (giúp căn chỉnh đều)
2. **Snap to Grid:** Arrange → Snap to Grid
3. **Copy style:** Chọn shape → Edit → Copy Style → Paste Style
4. **Align multiple shapes:** Chọn nhiều shapes → Arrange → Align
5. **Distribute evenly:** Arrange → Distribute → Vertically/Horizontally
6. **Connector routing:** Waypoints → Orthogonal (cho mũi tên vuông góc)

---

## ✅ Checklist hoàn thành

Khi tạo xong mỗi sơ đồ, kiểm tra:

- [ ] Có Start node (ellipse, màu xanh lá)
- [ ] Có End node (ellipse, màu đỏ)
- [ ] Tất cả Process nodes (rectangle, màu xanh dương)
- [ ] Tất cả Decision nodes (diamond, màu vàng)
- [ ] Tất cả arrows có label rõ ràng
- [ ] Màu sắc đúng chuẩn
- [ ] Layout gọn gàng, dễ đọc
- [ ] Không có node bị treo (không kết nối)
- [ ] Logic flow đúng với mô tả trong file .md

---

## 📞 Hỗ trợ

Nếu gặp khó khăn:
- Xem lại file Mermaid tương ứng trong thư mục `sodo/`
- Tham khảo 5 file Draw.io đã tạo: `01-05.drawio`
- Sử dụng Mermaid Live Editor để xuất hình ảnh (khuyến nghị)

---

## 🎯 Kết luận

**Khuyến nghị:** Sử dụng Phương án 1 (Mermaid Live Editor) để tạo nhanh và chính xác nhất.

Thời gian ước tính:
- Phương án 1: 15-30 phút cho cả 3 sơ đồ
- Phương án 2: 1.5-3 giờ cho cả 3 sơ đồ

Chúc bạn thành công! 🚀
