# Cấu trúc Dự án Zanee Store

## Tổng quan

Zanee Store là ứng dụng web fullstack quản lý cửa hàng linh kiện máy tính với:
- **Frontend**: React.js
- **Backend**: Node.js + Express
- **Database**: SQLite (better-sqlite3)

## Cấu trúc thư mục

```
zanee-store/
│
├── backend/                    # Backend API Server
│   ├── data/                   # SQLite database files
│   │   └── zanee.db           # Database chính (tự động tạo)
│   │
│   ├── src/                    # Source code
│   │   ├── server.js          # Express server & API routes
│   │   ├── db.js              # SQLite connection & queries
│   │   ├── seedData.js        # Dữ liệu mẫu (categories, products, users)
│   │   └── schema.sql         # Database schema (tham khảo)
│   │
│   ├── scripts/               # Utility scripts
│   │   └── update-product-content.js
│   │
│   ├── .env                   # Cấu hình backend (PORT, JWT_SECRET)
│   ├── .env.example           # Template cấu hình
│   ├── package.json           # Dependencies & scripts
│   └── package-lock.json
│
├── frontend/                   # React Frontend
│   ├── public/                # Static assets
│   │   ├── index.html         # HTML template
│   │   ├── banner.png         # Banner image
│   │   ├── favicon.ico        # Favicon
│   │   └── ...
│   │
│   ├── src/                   # React source code
│   │   ├── App.js             # Main React component
│   │   ├── App.css            # Main styles
│   │   ├── index.js           # Entry point
│   │   ├── index.css          # Global styles
│   │   └── ...
│   │
│   ├── .env                   # Cấu hình frontend (API URL)
│   ├── .env.example           # Template cấu hình
│   ├── package.json           # Dependencies & scripts
│   └── README.md              # Create React App docs
│
├── README.md                  # Hướng dẫn chính
├── START.md                   # Hướng dẫn khởi động nhanh
├── INSTALL_BUILD_TOOLS.md     # Hướng dẫn cài Visual Studio Build Tools
├── PROJECT_STRUCTURE.md       # File này - Cấu trúc dự án
├── package.json               # Root package (không sử dụng)
└── vercel.json                # Cấu hình deploy Vercel

```

## Backend (Node.js + Express + SQLite)

### Công nghệ sử dụng

- **Express 5.2.1**: Web framework
- **better-sqlite3**: SQLite database driver (synchronous)
- **bcryptjs**: Mã hóa mật khẩu
- **jsonwebtoken**: JWT authentication
- **cors**: Cross-Origin Resource Sharing
- **dotenv**: Quản lý biến môi trường

### Database Schema

#### Users
- Lưu thông tin người dùng (admin, user)
- Mật khẩu được hash bằng bcrypt
- Hỗ trợ khóa tài khoản (isLocked)

#### Categories
- Danh mục sản phẩm (CPU, GPU, RAM, SSD, ...)

#### Products
- Thông tin sản phẩm (tên, giá, specs, stock, ...)
- Liên kết với Categories

#### Favorites
- Danh sách yêu thích của user
- Many-to-many relationship (Users ↔ Products)

#### CartItems
- Giỏ hàng của user
- Lưu số lượng sản phẩm

#### Orders
- Đơn hàng (subtotal, shipping, payment, status)
- Hỗ trợ 2 phương thức: Nhận tại store / Giao hàng

#### OrderItems
- Chi tiết đơn hàng (sản phẩm, số lượng, giá)

### API Endpoints

#### Public
- `GET /api/health` - Health check
- `GET /api/bootstrap` - Dữ liệu khởi tạo
- `GET /api/products` - Danh sách sản phẩm
- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/login` - Đăng nhập

#### User (yêu cầu JWT token)
- `GET /api/me` - Thông tin user
- `POST /api/favorites/:productId` - Toggle favorite
- `POST /api/cart` - Thêm vào giỏ
- `POST /api/orders` - Tạo đơn hàng
- `POST /api/pc-builder` - Gợi ý build PC

#### Admin (yêu cầu role admin)
- `GET /api/admin/stats` - Thống kê
- `GET /api/admin/users` - Quản lý users
- `POST /api/admin/products` - CRUD products
- `POST /api/admin/categories` - CRUD categories

## Frontend (React)

### Công nghệ sử dụng

- **React 19.2.4**: UI framework
- **react-scripts 5.0.1**: Create React App tooling
- **@testing-library**: Testing utilities

### Components chính (dự đoán từ API)

- **ProductList**: Hiển thị danh sách sản phẩm
- **ProductDetail**: Chi tiết sản phẩm
- **Cart**: Giỏ hàng
- **Checkout**: Thanh toán
- **PCBuilder**: Gợi ý build PC
- **AdminDashboard**: Quản trị
- **Login/Register**: Xác thực

### State Management

Có thể sử dụng:
- React Context API
- Local state với useState/useReducer
- Fetch API hoặc axios cho HTTP requests

## Luồng dữ liệu

```
User → Frontend (React) → API Request → Backend (Express) → SQLite Database
                                                                    ↓
User ← Frontend (React) ← API Response ← Backend (Express) ← Query Result
```

## Authentication Flow

1. User đăng nhập → Backend verify credentials
2. Backend tạo JWT token (expires 7 days)
3. Frontend lưu token (localStorage/sessionStorage)
4. Mọi request sau đó gửi token trong header: `Authorization: Bearer <token>`
5. Backend verify token và authorize request

## Tính năng đặc biệt

### PC Builder
- User nhập ngân sách và mục đích sử dụng
- Backend gợi ý cấu hình phù hợp
- Tự động thêm vào giỏ hàng

### Order Tracking (SSE)
- Server-Sent Events để theo dõi đơn hàng real-time
- Endpoint: `GET /api/orders/:id/stream`
- Push updates mỗi 5 giây

### Payment Methods
- COD (Cash on Delivery)
- VNPay (sandbox mode)

## Development Workflow

### Chạy Development

```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend
cd frontend
npm start
```

### Testing

```bash
# Frontend tests
cd frontend
npm test
```

### Build Production

```bash
# Frontend build
cd frontend
npm run build
# Output: frontend/build/
```

## Deployment

### Backend
- Deploy lên Render, Railway, hoặc VPS
- Cần cấu hình environment variables
- Database file sẽ persist trên server

### Frontend
- Deploy lên Vercel, Netlify, hoặc static hosting
- Cần cấu hình `REACT_APP_API_URL` trỏ đến backend URL
- Build output: `frontend/build/`

## Bảo mật

- Mật khẩu được hash bằng bcrypt (10 rounds)
- JWT token expires sau 7 ngày
- CORS được cấu hình cho cross-origin requests
- SQL injection được prevent bằng parameterized queries
- Admin endpoints được protect bằng role-based authorization

## Performance

- SQLite WAL mode được bật (Write-Ahead Logging)
- Foreign keys được enforce
- Indexes tự động trên primary keys và foreign keys
- Connection pooling (single connection, synchronous)

## Mở rộng trong tương lai

- [ ] Thêm Redis cache cho products
- [ ] Implement WebSocket cho real-time notifications
- [ ] Thêm image upload cho products
- [ ] Implement pagination cho products list
- [ ] Thêm search với full-text search
- [ ] Implement rate limiting
- [ ] Thêm email notifications
- [ ] Migrate sang PostgreSQL cho production
