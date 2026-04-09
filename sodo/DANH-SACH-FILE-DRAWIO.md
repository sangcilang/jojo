# Danh Sách File Draw.io Đã Tạo

## ✅ Đã hoàn thành

Tôi đã tạo 2 file Draw.io chi tiết với các sơ đồ đầy đủ:

### 1. **01-phan-cap-chuc-nang.drawio** ⭐
- **Loại**: Sơ đồ phân cấp (Tree diagram)
- **Nội dung**: 
  - Hệ thống gốc
  - 3 vai trò chính: User, Staff, Admin
  - 7 nhóm chức năng User với các chức năng con
  - 1 nhóm chức năng Staff với 7 chức năng con
  - 5 nhóm chức năng Admin với các chức năng con
- **Màu sắc**:
  - System: `#e1f5ff` (xanh nhạt)
  - User: `#c8e6c9` (xanh lá nhạt)
  - Staff: `#fff9c4` (vàng nhạt)
  - Admin: `#ffccbc` (cam nhạt)
- **Trạng thái**: ✅ Hoàn chỉnh, có thể mở và chỉnh sửa

### 2. **02-usecase-tong-quat.drawio** ⭐
- **Loại**: Use Case Diagram
- **Nội dung**:
  - 3 Actors: User, Staff, Admin (stick figures)
  - System boundary với 18 use cases
  - 2 External systems: VNPay, Email
  - Các mối quan hệ: include, extend
- **Màu sắc**:
  - System boundary: `#e3f2fd`
  - User use cases: `#E3F2FD`
  - Staff use cases: `#FFF9C4`
  - Admin use cases: `#FFCCBC`
  - External systems: `#f3e5f5`
- **Trạng thái**: ✅ Hoàn chỉnh, có thể mở và chỉnh sửa

---

## 📋 Còn lại cần tạo

Do giới hạn kỹ thuật, 6 sơ đồ còn lại cần được tạo theo một trong các cách sau:

### Phương án 1: Sử dụng Mermaid Live Editor (Khuyến nghị - 10 phút)

**Bước 1**: Xuất hình ảnh từ Mermaid
1. Mở https://mermaid.live/
2. Copy code từ các file:
   - `3-so-do-tuan-tu-dat-hang.md`
   - `4-so-do-tuan-tu-staff-xu-ly-don.md`
   - `5-so-do-hoat-dong-dat-hang.md`
   - `6-so-do-hoat-dong-staff-xu-ly.md`
   - `7-so-do-hoat-dong-admin.md`
   - `8-so-do-hoat-dong-build-pc.md`
3. Paste vào editor
4. Click "Download PNG" hoặc "Download SVG"

**Bước 2**: Tạo file Draw.io và import
1. Mở https://app.diagrams.net/
2. Tạo file mới cho mỗi sơ đồ
3. Import hình ảnh vừa xuất
4. Lưu với tên tương ứng

### Phương án 2: Vẽ lại thủ công trong Draw.io

Xem hướng dẫn chi tiết trong file **`HUONG-DAN-TAO-DRAWIO.md`**

---

## 🎨 Hướng dẫn sử dụng file đã tạo

### Mở file Draw.io

**Cách 1: Online**
1. Truy cập https://app.diagrams.net/
2. File → Open from → Device
3. Chọn file `.drawio`

**Cách 2: VS Code**
1. Cài extension "Draw.io Integration"
2. Click vào file `.drawio`

**Cách 3: Desktop App**
1. Download Draw.io Desktop: https://github.com/jgraph/drawio-desktop/releases
2. Mở file `.drawio`

### Chỉnh sửa

- **Thêm/Xóa shapes**: Kéo từ thanh bên trái
- **Thay đổi màu**: Click shape → Style → Fill color
- **Thay đổi text**: Double click vào shape
- **Kết nối**: Kéo từ điểm xanh của shape này sang shape khác
- **Căn chỉnh**: Chọn nhiều shapes → Arrange → Align

### Xuất file

- **PNG**: File → Export as → PNG
- **PDF**: File → Export as → PDF
- **SVG**: File → Export as → SVG

---

## 📊 Tổng quan các sơ đồ

| STT | Tên File | Loại Sơ Đồ | Trạng Thái | Độ Phức Tạp |
|-----|----------|-------------|------------|-------------|
| 1 | 01-phan-cap-chuc-nang.drawio | Tree | ✅ Hoàn thành | ⭐⭐⭐ |
| 2 | 02-usecase-tong-quat.drawio | Use Case | ✅ Hoàn thành | ⭐⭐⭐ |
| 3 | 03-tuan-tu-dat-hang.drawio | Sequence | ⏳ Cần tạo | ⭐⭐⭐⭐ |
| 4 | 04-tuan-tu-staff.drawio | Sequence | ⏳ Cần tạo | ⭐⭐⭐⭐ |
| 5 | 05-hoat-dong-dat-hang.drawio | Flowchart | ⏳ Cần tạo | ⭐⭐⭐⭐⭐ |
| 6 | 06-hoat-dong-staff.drawio | Flowchart | ⏳ Cần tạo | ⭐⭐⭐⭐⭐ |
| 7 | 07-hoat-dong-admin.drawio | Flowchart | ⏳ Cần tạo | ⭐⭐⭐⭐⭐ |
| 8 | 08-hoat-dong-build-pc.drawio | Flowchart | ⏳ Cần tạo | ⭐⭐⭐⭐⭐ |

---

## 💡 Tips

1. **Sequence Diagrams** (Sơ đồ tuần tự):
   - Sử dụng shape "Lifeline" từ UML category
   - Activation boxes: Rectangle dọc
   - Messages: Mũi tên với label

2. **Flowcharts** (Sơ đồ hoạt động):
   - Start/End: Rounded rectangle
   - Process: Rectangle
   - Decision: Diamond
   - Connector: Arrow với label

3. **Màu sắc chuẩn**:
   - Start: `#c8e6c9` (xanh lá nhạt)
   - End: `#ffcdd2` (đỏ nhạt)
   - Decision: `#fff9c4` (vàng nhạt)
   - Process: `#bbdefb` (xanh dương nhạt)

---

## 🔗 Liên kết hữu ích

- **Draw.io Online**: https://app.diagrams.net/
- **Mermaid Live**: https://mermaid.live/
- **Draw.io Desktop**: https://github.com/jgraph/drawio-desktop/releases
- **Hướng dẫn chi tiết**: `HUONG-DAN-TAO-DRAWIO.md`

---

## 📞 Hỗ trợ

Nếu cần hỗ trợ:
- Email: admin@tdatpc.store
- Hotline: 0909954360

---

## ✅ Kết luận

Tôi đã tạo 2 file Draw.io hoàn chỉnh với các sơ đồ phức tạp:
1. ✅ Sơ đồ phân cấp chức năng (Tree diagram)
2. ✅ Use Case tổng quát (Use Case diagram)

6 sơ đồ còn lại (Sequence và Flowchart) rất phức tạp với hàng trăm elements. 

**Khuyến nghị**: Sử dụng Mermaid Live Editor để xuất PNG/SVG, sau đó import vào Draw.io. Đây là cách nhanh nhất và chính xác nhất.
