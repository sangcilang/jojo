# Hướng dẫn Khởi động Nhanh

## Bước 1: Kiểm tra Node.js

```bash
node --version
```

Nếu bạn đang dùng Node.js 24.x, khuyến nghị cài lại Node.js 18 LTS hoặc 20 LTS từ https://nodejs.org/

## Bước 2: Cài đặt Dependencies

### Backend
```bash
cd backend
npm install
```

Nếu gặp lỗi build better-sqlite3, xem phần Troubleshooting trong README.md

### Frontend
```bash
cd frontend
npm install
```

## Bước 3: Chạy ứng dụng

### Terminal 1 - Chạy Backend
```bash
cd backend
npm start
```

Backend sẽ chạy tại: http://localhost:4000

### Terminal 2 - Chạy Frontend
```bash
cd frontend
npm start
```

Frontend sẽ tự động mở trình duyệt tại: http://localhost:3000

## Tài khoản demo

### Admin
- Username: `admin`
- Password: `Admin@123`

### User
- Username: `minhdev`
- Password: `User@123`

## Lỗi thường gặp

### Lỗi "Could not locate the bindings file" (better-sqlite3)

Nguyên nhân: Node.js 24 quá mới, chưa có prebuilt binary

Giải pháp:
1. Cài Node.js 18 LTS hoặc 20 LTS
2. Hoặc cài Visual Studio Build Tools (xem README.md)

### Port 4000 hoặc 3000 đã được sử dụng

```bash
# Windows - Tìm process đang dùng port
netstat -ano | findstr :4000
netstat -ano | findstr :3000

# Kill process (thay PID bằng số từ lệnh trên)
taskkill /PID <PID> /F
```

### Frontend không kết nối được Backend

1. Kiểm tra Backend đang chạy: http://localhost:4000/api/health
2. Kiểm tra file `frontend/.env` có đúng URL: `REACT_APP_API_URL=http://localhost:4000/api`
3. Restart frontend: Ctrl+C rồi `npm start` lại
