# TDatPC Store - Hệ thống Quản lý Cửa hàng Linh kiện Máy tính

Ứng dụng web fullstack quản lý cửa hàng linh kiện máy tính với React frontend và Node.js backend sử dụng SQLite database.

## 📚 Tài liệu

- **[RUNNING.md](RUNNING.md)** - ✅ DỰ ÁN ĐÃ CHẠY THÀNH CÔNG - Xem hướng dẫn tại đây!
- **[START.md](START.md)** - Hướng dẫn khởi động nhanh
- **[INSTALL_BUILD_TOOLS.md](INSTALL_BUILD_TOOLS.md)** - Hướng dẫn cài Visual Studio Build Tools (Windows)
- **[PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)** - Cấu trúc dự án chi tiết

## ⚡ Khởi động nhanh

```bash
# Backend (Terminal 1)
cd backend
npm install
npm start

# Frontend (Terminal 2)
cd frontend
npm install
npm start
```

Truy cập: http://localhost:3000

**Tài khoản demo:**
- Admin: `admin` / `123456`
- Nhân viên: `nhanvien` / `123456`
- User: `minhdev` / `123456`

## Yêu cầu hệ thống

- **Node.js**: phiên bản 18.x, 20.x, hoặc 24.x (đã test với Node 24.14.1)
- **npm**: phiên bản 6.x trở lên (đi kèm với Node.js)
- **Git**: để clone repository

**Lưu ý**: Dự án sử dụng better-sqlite3 v12.8.0 có prebuilt binary cho Node.js 24, không cần cài Visual Studio Build Tools.

## Cài đặt

### 1. Clone repository

```bash
git clone <repository-url>
cd zanee-store
```

### 2. Cài đặt dependencies cho Backend

```bash
cd backend
npm install
```

Dependencies backend bao gồm:
- `express` - Web framework
- `better-sqlite3` v12.8.0 - SQLite database driver (có prebuilt binary cho Node 24)
- `bcryptjs` - Mã hóa mật khẩu
- `jsonwebtoken` - Xác thực JWT
- `cors` - Cross-Origin Resource Sharing
- `dotenv` - Quản lý biến môi trường

### 3. Cấu hình Backend

Tạo file `.env` trong thư mục `backend`:

```bash
cp .env.example .env
```

Chỉnh sửa file `.env` (các giá trị mặc định đã hoạt động với SQLite):

```env
PORT=4000
JWT_SECRET=zanee-store-secret
```

**Lưu ý**: Các biến DB_SERVER, DB_INSTANCE, DB_NAME không cần thiết khi sử dụng SQLite.

### 4. Cài đặt dependencies cho Frontend

```bash
cd ../frontend
npm install
```

Dependencies frontend bao gồm:
- `react` & `react-dom` - React framework
- `react-scripts` - Create React App tooling
- `@testing-library/*` - Testing utilities

### 5. Cấu hình Frontend

Tạo file `.env` trong thư mục `frontend`:

```bash
cp .env.example .env
```

Chỉnh sửa file `.env`:

```env
REACT_APP_API_URL=http://localhost:4000/api
```

## Chạy ứng dụng

### Chạy Backend

Từ thư mục `backend`:

```bash
npm start
```

Backend sẽ chạy tại: `http://localhost:4000`

Database SQLite sẽ được tự động khởi tạo tại `backend/data/zanee.db` với dữ liệu mẫu.

### Chạy Frontend

Mở terminal mới, từ thư mục `frontend`:

```bash
npm start
```

Frontend sẽ chạy tại: `http://localhost:3000` và tự động mở trình duyệt.

## Tài khoản demo

Sau khi khởi động, hệ thống tạo sẵn các tài khoản:

### Tài khoản Admin
- **Username**: `admin`
- **Password**: `123456`
- Quyền: Quản lý sản phẩm, danh mục, người dùng, đơn hàng, thống kê

### Tài khoản Nhân viên
- **Username**: `nhanvien`
- **Password**: `123456`
- Quyền: Xem và quản lý đơn hàng, cập nhật trạng thái, hủy đơn, in hóa đơn

### Tài khoản User
- **Username**: `minhdev`
- **Password**: `123456`
- Quyền: Mua sắm, quản lý giỏ hàng, đặt hàng

### Tài khoản bị khóa (để test)
- **Username**: `blockeduser`
- **Password**: `123456`
- Trạng thái: Bị khóa, không thể đăng nhập

## Cấu trúc dự án

```
zanee-store/
├── backend/
│   ├── data/              # SQLite database files
│   │   └── zanee.db       # Database chính (tự động tạo)
│   ├── src/
│   │   ├── server.js      # Express server & API routes
│   │   ├── db.js          # SQLite connection & queries
│   │   ├── seedData.js    # Dữ liệu mẫu
│   │   └── schema.sql     # Database schema (tham khảo)
│   ├── .env               # Cấu hình backend
│   └── package.json
├── frontend/
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── App.js         # Main React component
│   │   ├── index.js       # Entry point
│   │   └── ...
│   ├── .env               # Cấu hình frontend
│   └── package.json
└── README.md
```

## API Endpoints

### Public Endpoints
- `GET /api/health` - Kiểm tra trạng thái server
- `GET /api/bootstrap` - Lấy dữ liệu khởi tạo (categories, products)
- `GET /api/products` - Danh sách sản phẩm (có filter)
- `GET /api/products/:id` - Chi tiết sản phẩm
- `POST /api/auth/register` - Đăng ký tài khoản
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/reset-password` - Đặt lại mật khẩu

### User Endpoints (yêu cầu authentication)
- `GET /api/me` - Thông tin user, favorites, cart, orders
- `POST /api/favorites/:productId` - Thêm/xóa yêu thích
- `POST /api/cart` - Thêm sản phẩm vào giỏ
- `PATCH /api/cart/:productId` - Cập nhật số lượng
- `DELETE /api/cart/:productId` - Xóa khỏi giỏ
- `POST /api/pc-builder` - Gợi ý build PC
- `POST /api/orders` - Tạo đơn hàng
- `GET /api/orders/:id/stream` - Theo dõi đơn hàng (SSE)
- `PATCH /api/account/password` - Đổi mật khẩu

### Admin Endpoints (yêu cầu role admin)
- `GET /api/admin/stats` - Thống kê tổng quan
- `GET /api/admin/users` - Danh sách người dùng
- `PATCH /api/admin/users/:id/toggle-lock` - Khóa/mở khóa user
- `GET /api/admin/orders` - Tất cả đơn hàng
- `GET /api/admin/categories` - Danh sách danh mục
- `POST /api/admin/categories` - Tạo danh mục mới
- `PUT /api/admin/categories/:name` - Sửa danh mục
- `DELETE /api/admin/categories/:name` - Xóa danh mục
- `POST /api/admin/products` - Tạo sản phẩm mới
- `PUT /api/admin/products/:id` - Cập nhật sản phẩm
- `DELETE /api/admin/products/:id` - Xóa sản phẩm

### Staff Endpoints (yêu cầu role staff)
- `GET /api/staff/orders` - Xem tất cả đơn hàng
- `PATCH /api/staff/orders/:id/status` - Cập nhật trạng thái đơn hàng

## Tính năng chính

### Cho User
- Xem danh sách sản phẩm với filter theo tên và danh mục
- Xem chi tiết sản phẩm
- Thêm sản phẩm vào danh sách yêu thích
- Quản lý giỏ hàng
- Tính năng PC Builder (gợi ý cấu hình theo ngân sách)
- Đặt hàng với 2 phương thức: Nhận tại cửa hàng / Giao hàng
- Thanh toán: COD hoặc VNPay (sandbox)
- Theo dõi trạng thái đơn hàng real-time
- Đổi mật khẩu

### Cho Admin
- Dashboard thống kê với biểu đồ
- Quản lý người dùng (khóa/mở khóa tài khoản)
- Quản lý danh mục sản phẩm
- Quản lý sản phẩm (CRUD)
- Xem tất cả đơn hàng với chi tiết

### Cho Nhân viên
- Xem danh sách tất cả đơn hàng
- Tìm kiếm đơn hàng theo mã
- Lọc đơn hàng theo trạng thái
- Xem chi tiết đơn hàng với workflow animation
- Cập nhật trạng thái đơn hàng (xác nhận, giao hàng, hoàn thành)
- Hủy đơn hàng
- In hóa đơn

## Database

Dự án sử dụng **SQLite** với `better-sqlite3` driver:

- Database file: `backend/data/zanee.db`
- Tự động khởi tạo schema và seed data khi chạy lần đầu
- WAL mode được bật để tăng hiệu suất
- Foreign keys được bật để đảm bảo tính toàn vẹn dữ liệu

### Tables
- `Users` - Người dùng
- `Categories` - Danh mục sản phẩm
- `Products` - Sản phẩm
- `Favorites` - Danh sách yêu thích
- `CartItems` - Giỏ hàng
- `Orders` - Đơn hàng
- `OrderItems` - Chi tiết đơn hàng

## Troubleshooting

### Lỗi build better-sqlite3 trên Windows

Nếu gặp lỗi "The build tools for ClangCL cannot be found" khi cài đặt:

**Xem hướng dẫn chi tiết tại: [INSTALL_BUILD_TOOLS.md](INSTALL_BUILD_TOOLS.md)**

**Giải pháp nhanh nhất: Sử dụng Node.js 18 LTS hoặc 20 LTS**
- Download từ: https://nodejs.org/
- Better-sqlite3 có sẵn prebuilt binaries cho Node 18 và 20
- Không cần cài Visual Studio Build Tools

### Backend không khởi động được

1. Kiểm tra Node.js version: `node --version` (cần >= 14.x)
2. Xóa `node_modules` và cài lại: `rm -rf node_modules && npm install`
3. Kiểm tra port 4000 có bị chiếm: `netstat -ano | findstr :4000` (Windows)
4. Kiểm tra thư mục `backend/data` có quyền ghi

### Frontend không kết nối được Backend

1. Kiểm tra Backend đang chạy tại `http://localhost:4000`
2. Kiểm tra file `frontend/.env` có đúng `REACT_APP_API_URL=http://localhost:4000/api`
3. Xóa cache và restart: `npm start`

### Lỗi SQLite

1. Xóa file database và để tự động tạo lại: `rm backend/data/zanee.db*`
2. Cài lại `better-sqlite3`: `cd backend && npm rebuild better-sqlite3`

## Development

### Chạy tests

Frontend:
```bash
cd frontend
npm test
```

### Build production

Frontend:
```bash
cd frontend
npm run build
```

Build output sẽ ở thư mục `frontend/build/`

## License

ISC

## Tác giả

TDatPCStore
