# Hướng Dẫn Tạo File Draw.io Từ Các Sơ Đồ Mermaid

## 📋 Tổng quan

Hiện tại có 8 sơ đồ Mermaid cần chuyển đổi sang Draw.io:

1. **Sơ đồ phân cấp chức năng** - Cây phân cấp (Tree diagram)
2. **Use Case tổng quát** - Use Case diagram
3. **Tuần tự đặt hàng** - Sequence diagram
4. **Tuần tự Staff xử lý** - Sequence diagram
5. **Hoạt động đặt hàng** - Activity/Flowchart diagram
6. **Hoạt động Staff** - Activity/Flowchart diagram
7. **Hoạt động Admin** - Activity/Flowchart diagram
8. **Hoạt động Build PC** - Activity/Flowchart diagram

## 🎯 Phương án 1: Sử dụng Mermaid Live Editor (Khuyến nghị)

### Bước 1: Xuất từng sơ đồ ra PNG/SVG

1. Truy cập: https://mermaid.live/
2. Mở file sơ đồ (ví dụ: `1-phan-cap-chuc-nang.md`)
3. Copy nội dung trong code block ```mermaid ... ```
4. Paste vào Mermaid Live Editor
5. Click nút **"Download PNG"** hoặc **"Download SVG"**
6. Lưu file với tên rõ ràng (ví dụ: `01-phan-cap-chuc-nang.png`)
7. Lặp lại cho 8 sơ đồ

### Bước 2: Tạo file Draw.io và import hình ảnh

1. Truy cập: https://app.diagrams.net/
2. Chọn **"Create New Diagram"**
3. Đặt tên: `TDatPC-Store-Tat-Ca-So-Do.drawio`
4. Chọn **"Blank Diagram"**

### Bước 3: Tạo nhiều trang (Pages)

1. Click chuột phải vào tab trang ở dưới cùng
2. Chọn **"Insert Page"**
3. Đặt tên trang: `01 - Phân Cấp Chức Năng`
4. Lặp lại để tạo 8 trang:
   - `01 - Phân Cấp Chức Năng`
   - `02 - Use Case Tổng Quát`
   - `03 - Tuần Tự Đặt Hàng`
   - `04 - Tuần Tự Staff Xử Lý`
   - `05 - Hoạt Động Đặt Hàng`
   - `06 - Hoạt Động Staff`
   - `07 - Hoạt Động Admin`
   - `08 - Hoạt Động Build PC`

### Bước 4: Import hình ảnh vào từng trang

1. Chọn trang đầu tiên
2. Menu **File → Import from → Device**
3. Chọn file PNG/SVG tương ứng
4. Điều chỉnh kích thước cho phù hợp
5. Lặp lại cho 8 trang

### Bước 5: Lưu file

1. Menu **File → Save As**
2. Chọn vị trí lưu
3. Đặt tên: `TDatPC-Store-Tat-Ca-So-Do.drawio`

---

## 🎯 Phương án 2: Vẽ lại thủ công trong Draw.io (Chi tiết hơn)

### Chuẩn bị

1. Truy cập: https://app.diagrams.net/
2. Tạo file mới: `TDatPC-Store-Tat-Ca-So-Do.drawio`
3. Tạo 8 trang như hướng dẫn ở Phương án 1

### Trang 1: Sơ Đồ Phân Cấp Chức Năng

**Loại sơ đồ**: Tree/Hierarchy

**Các bước vẽ**:

1. **Thêm hình chữ nhật gốc**:
   - Kéo shape "Rectangle" từ thanh bên trái
   - Text: "Hệ Thống Bán Hàng Linh Kiện\nTDatPC.Store"
   - Màu nền: `#e1f5ff`

2. **Thêm 3 nhánh chính**:
   - User (màu `#c8e6c9`)
   - Staff (màu `#fff9c4`)
   - Admin (màu `#ffccbc`)

3. **Thêm các nhánh con**:
   - Dưới User: 7 nhóm chức năng (U1-U7)
   - Dưới Staff: 1 nhóm chức năng (S1)
   - Dưới Admin: 5 nhóm chức năng (A1-A5)

4. **Thêm các nhánh chi tiết**:
   - Mỗi nhóm chức năng có các chức năng con
   - Ví dụ: U1 (Quản Lý Tài Khoản) có 4 chức năng: Đăng ký, Đăng nhập, Đổi mật khẩu, Quên mật khẩu

5. **Kết nối các node**:
   - Sử dụng connector (mũi tên)
   - Style: Straight hoặc Orthogonal

**Tham khảo**: File `1-phan-cap-chuc-nang.md`

---

### Trang 2: Use Case Tổng Quát

**Loại sơ đồ**: Use Case Diagram

**Các bước vẽ**:

1. **Thêm Actors** (bên trái):
   - User (stick figure)
   - Staff (stick figure)
   - Admin (stick figure)

2. **Vẽ System Boundary**:
   - Rectangle lớn với label "Hệ Thống TDatPC.Store"
   - Màu nền: `#e3f2fd`

3. **Thêm Use Cases** (bên trong boundary):
   - 10 use cases cho User (UC1-UC10)
   - 3 use cases cho Staff (UC11-UC13)
   - 5 use cases cho Admin (UC14-UC18)
   - Shape: Ellipse (oval)

4. **Thêm External Systems** (bên phải):
   - VNPay Gateway (màu `#f3e5f5`)
   - Email Service (màu `#f3e5f5`)

5. **Kết nối**:
   - Actor → Use Case: Solid line
   - Use Case → External System: Dashed line (<<include>>)
   - Use Case → Use Case: Dashed line với mũi tên (<<extend>>)

**Tham khảo**: File `2-usecase-tong-quat.md`

---

### Trang 3: Sơ Đồ Tuần Tự - Đặt Hàng

**Loại sơ đồ**: Sequence Diagram

**Các bước vẽ**:

1. **Thêm Lifelines** (từ trái sang phải):
   - User (Actor)
   - Frontend (React)
   - Backend (Express API)
   - Database (SQLite)
   - VNPay Gateway

2. **Vẽ Activation Boxes**:
   - Rectangle dọc trên mỗi lifeline khi active

3. **Thêm Messages**:
   - Mũi tên từ trái sang phải: Request
   - Mũi tên từ phải sang trái: Response (dashed)
   - Đánh số thứ tự: 1, 2, 3...

4. **Thêm Alt Frame** (cho VNPay/COD):
   - Rectangle bao quanh với label "alt"
   - Chia thành 2 phần: [Thanh toán VNPay] và [Thanh toán COD]

5. **Thêm Note**:
   - Ghi chú về phương thức thanh toán

**Tham khảo**: File `3-so-do-tuan-tu-dat-hang.md`

---

### Trang 4: Sơ Đồ Tuần Tự - Staff Xử Lý

**Loại sơ đồ**: Sequence Diagram

**Tương tự Trang 3**, nhưng với các bước:
1. Đăng nhập
2. Xem danh sách đơn hàng
3. Tìm kiếm/Lọc
4. Xem chi tiết
5. Cập nhật trạng thái
6. In hóa đơn
7. Hủy đơn

**Tham khảo**: File `4-so-do-tuan-tu-staff-xu-ly-don.md`

---

### Trang 5-8: Sơ Đồ Hoạt Động (Activity/Flowchart)

**Loại sơ đồ**: Flowchart

**Các shapes cần dùng**:
- **Start/End**: Rounded rectangle (màu `#c8e6c9` cho Start, `#ffcdd2` cho End)
- **Process**: Rectangle (màu trắng hoặc `#bbdefb`)
- **Decision**: Diamond (màu `#fff9c4`)
- **Connector**: Arrow

**Các bước vẽ chung**:

1. **Bắt đầu**: Rounded rectangle với text "Bắt đầu"
2. **Các bước xử lý**: Rectangle với mô tả
3. **Điểm quyết định**: Diamond với câu hỏi
4. **Kết thúc**: Rounded rectangle với text "Kết thúc"
5. **Kết nối**: Mũi tên với label (Có/Không, Rồi/Chưa, v.v.)

**Trang 5**: Quy trình đặt hàng (File `5-so-do-hoat-dong-dat-hang.md`)
**Trang 6**: Staff xử lý đơn (File `6-so-do-hoat-dong-staff-xu-ly.md`)
**Trang 7**: Admin quản lý (File `7-so-do-hoat-dong-admin.md`)
**Trang 8**: Build PC (File `8-so-do-hoat-dong-build-pc.md`)

---

## 🎨 Bảng màu chuẩn

Sử dụng các màu sau để đồng nhất:

| Màu | Hex Code | Sử dụng cho |
|-----|----------|-------------|
| Xanh lá nhạt | `#c8e6c9` | Start, User, Success |
| Đỏ nhạt | `#ffcdd2` | End, Cancel, Error |
| Vàng nhạt | `#fff9c4` | Decision, Staff, Warning |
| Xanh dương nhạt | `#bbdefb` | Process, Action |
| Xanh nhạt | `#e1f5ff` | System, Container |
| Cam nhạt | `#ffccbc` | Admin |
| Tím nhạt | `#f3e5f5` | External System |

---

## 📐 Kích thước khuyến nghị

- **Canvas size**: A3 hoặc A4 landscape
- **Font size**: 
  - Title: 14-16pt
  - Normal text: 10-12pt
  - Small text: 8-9pt
- **Shape size**:
  - Rectangle: 120x60 px
  - Diamond: 100x80 px
  - Ellipse: 140x70 px

---

## 💾 Xuất file

Sau khi hoàn thành:

1. **Lưu file Draw.io**:
   - File → Save As
   - Format: `.drawio`

2. **Xuất PDF** (tùy chọn):
   - File → Export as → PDF
   - Chọn "All pages"
   - Quality: High

3. **Xuất PNG** (tùy chọn):
   - File → Export as → PNG
   - Chọn từng page hoặc all pages
   - Resolution: 300 DPI

---

## 🔗 Liên kết hữu ích

- **Draw.io**: https://app.diagrams.net/
- **Mermaid Live**: https://mermaid.live/
- **Draw.io Documentation**: https://www.drawio.com/doc/
- **UML Tutorial**: https://www.visual-paradigm.com/guide/uml-unified-modeling-language/

---

## 📞 Hỗ trợ

Nếu cần hỗ trợ:
- Email: admin@tdatpc.store
- Hotline: 0909954360

---

## ✅ Checklist hoàn thành

- [ ] Tạo file Draw.io mới
- [ ] Tạo 8 trang với tên rõ ràng
- [ ] Vẽ Trang 1: Phân cấp chức năng
- [ ] Vẽ Trang 2: Use Case
- [ ] Vẽ Trang 3: Tuần tự đặt hàng
- [ ] Vẽ Trang 4: Tuần tự Staff
- [ ] Vẽ Trang 5: Hoạt động đặt hàng
- [ ] Vẽ Trang 6: Hoạt động Staff
- [ ] Vẽ Trang 7: Hoạt động Admin
- [ ] Vẽ Trang 8: Hoạt động Build PC
- [ ] Kiểm tra màu sắc đồng nhất
- [ ] Kiểm tra font chữ rõ ràng
- [ ] Lưu file `.drawio`
- [ ] Xuất PDF (tùy chọn)
