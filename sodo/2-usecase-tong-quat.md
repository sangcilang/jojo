# Sơ Đồ Use Case Tổng Quát

```mermaid
graph LR
    User((👤 User<br/>Khách Hàng))
    Staff((👨‍💼 Staff<br/>Nhân Viên))
    Admin((👨‍💻 Admin<br/>Quản Trị))
    
    subgraph System[Hệ Thống TDatPC.Store]
        UC1[Đăng ký/Đăng nhập]
        UC2[Xem sản phẩm]
        UC3[Tìm kiếm sản phẩm]
        UC4[Quản lý giỏ hàng]
        UC5[Đặt hàng]
        UC6[Thanh toán]
        UC7[Xem đơn hàng]
        UC8[Xác nhận nhận hàng]
        UC9[Build PC thông minh]
        UC10[Quản lý yêu thích]
        
        UC11[Quản lý đơn hàng Staff]
        UC12[Cập nhật trạng thái đơn]
        UC13[In hóa đơn]
        
        UC14[Quản lý sản phẩm]
        UC15[Quản lý danh mục]
        UC16[Quản lý người dùng]
        UC17[Xem thống kê]
        UC18[Quản lý đơn hàng Admin]
    end
    
    VNPay[VNPay Gateway]
    Email[Email Service]
    
    User --> UC1
    User --> UC2
    User --> UC3
    User --> UC4
    User --> UC5
    User --> UC6
    User --> UC7
    User --> UC8
    User --> UC9
    User --> UC10
    
    Staff --> UC1
    Staff --> UC11
    Staff --> UC12
    Staff --> UC13
    
    Admin --> UC1
    Admin --> UC14
    Admin --> UC15
    Admin --> UC16
    Admin --> UC17
    Admin --> UC18
    
    UC6 -.-> VNPay
    UC5 -.-> Email
    UC12 -.-> Email
    
    UC2 --> UC3
    UC4 --> UC5
    UC5 --> UC6
    UC5 --> UC7
    UC7 --> UC8
    
    style System fill:#e3f2fd
    style User fill:#c8e6c9
    style Staff fill:#fff9c4
    style Admin fill:#ffccbc
    style VNPay fill:#f3e5f5
    style Email fill:#f3e5f5
```

## Mô tả Use Case

### Use Case User

| ID | Tên Use Case | Mô tả | Actor |
|----|--------------|-------|-------|
| UC1 | Đăng ký/Đăng nhập | User tạo tài khoản mới hoặc đăng nhập vào hệ thống | User, Staff, Admin |
| UC2 | Xem sản phẩm | Xem danh sách sản phẩm với phân trang | User |
| UC3 | Tìm kiếm sản phẩm | Tìm kiếm theo tên, lọc theo danh mục | User |
| UC4 | Quản lý giỏ hàng | Thêm, sửa, xóa sản phẩm trong giỏ | User |
| UC5 | Đặt hàng | Tạo đơn hàng mới với thông tin giao hàng | User |
| UC6 | Thanh toán | Chọn phương thức thanh toán COD/VNPay | User |
| UC7 | Xem đơn hàng | Xem lịch sử và trạng thái đơn hàng | User |
| UC8 | Xác nhận nhận hàng | Xác nhận đã nhận hàng thành công | User |
| UC9 | Build PC thông minh | Gợi ý cấu hình PC theo ngân sách | User |
| UC10 | Quản lý yêu thích | Lưu sản phẩm yêu thích | User |

### Use Case Staff

| ID | Tên Use Case | Mô tả | Actor |
|----|--------------|-------|-------|
| UC11 | Quản lý đơn hàng Staff | Xem, tìm kiếm, lọc đơn hàng | Staff |
| UC12 | Cập nhật trạng thái đơn | Cập nhật workflow đơn hàng | Staff |
| UC13 | In hóa đơn | In hóa đơn cho khách hàng | Staff |

### Use Case Admin

| ID | Tên Use Case | Mô tả | Actor |
|----|--------------|-------|-------|
| UC14 | Quản lý sản phẩm | CRUD sản phẩm | Admin |
| UC15 | Quản lý danh mục | CRUD danh mục sản phẩm | Admin |
| UC16 | Quản lý người dùng | Khóa/mở khóa tài khoản user | Admin |
| UC17 | Xem thống kê | Dashboard với biểu đồ doanh thu | Admin |
| UC18 | Quản lý đơn hàng Admin | Xem tất cả đơn hàng trong hệ thống | Admin |
