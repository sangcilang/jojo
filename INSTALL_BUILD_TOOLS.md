# Hướng dẫn Cài đặt Visual Studio Build Tools cho Windows

## Tại sao cần cài đặt?

Package `better-sqlite3` là một native addon của Node.js, cần được compile từ C++ source code. Trên Windows, việc này yêu cầu Visual Studio Build Tools.

## Các bước cài đặt

### Bước 1: Download Visual Studio Build Tools

1. Truy cập: https://visualstudio.microsoft.com/downloads/
2. Scroll xuống phần "Tools for Visual Studio"
3. Download "Build Tools for Visual Studio 2022"

### Bước 2: Chạy Installer

1. Chạy file vừa download (vs_BuildTools.exe)
2. Trong Visual Studio Installer, chọn tab "Workloads"
3. Tích chọn "Desktop development with C++"

### Bước 3: Chọn Components

Đảm bảo các components sau được chọn (thường đã được chọn mặc định):

- ✅ MSVC v143 - VS 2022 C++ x64/x86 build tools (Latest)
- ✅ Windows 10 SDK (10.0.19041.0 hoặc mới hơn)
- ✅ C++ CMake tools for Windows
- ✅ Testing tools core features - Build Tools
- ✅ C++ AddressSanitizer (optional)

### Bước 4: Cài đặt

1. Click "Install" (dung lượng khoảng 6-8 GB)
2. Đợi quá trình cài đặt hoàn tất (có thể mất 15-30 phút)
3. Khởi động lại máy tính

### Bước 5: Cài đặt Python (nếu chưa có)

Node-gyp cần Python để build native modules:

1. Download Python 3.x từ: https://www.python.org/downloads/
2. Khi cài đặt, tích chọn "Add Python to PATH"
3. Cài đặt và khởi động lại terminal

### Bước 6: Cấu hình npm

```bash
# Cấu hình npm sử dụng Visual Studio 2022
npm config set msvs_version 2022

# Cấu hình Python path (thay đổi đường dẫn nếu cần)
npm config set python C:\Python3\python.exe
```

### Bước 7: Cài đặt lại better-sqlite3

```bash
cd backend
npm install
```

## Giải pháp thay thế (Không cần Build Tools)

### Sử dụng Node.js 18 LTS hoặc 20 LTS

Đây là cách KHUYẾN NGHỊ và đơn giản nhất:

1. Gỡ cài đặt Node.js hiện tại
2. Download Node.js 18 LTS hoặc 20 LTS từ: https://nodejs.org/
3. Cài đặt Node.js
4. Chạy lại: `cd backend && npm install`

Better-sqlite3 có sẵn prebuilt binaries cho Node.js 18 và 20, không cần build từ source.

## Kiểm tra cài đặt

Sau khi cài đặt xong, kiểm tra:

```bash
# Kiểm tra Node.js
node --version

# Kiểm tra npm
npm --version

# Kiểm tra Python
python --version

# Kiểm tra Visual Studio Build Tools
where msbuild
```

Nếu tất cả đều hiển thị version, bạn đã cài đặt thành công!

## Lỗi thường gặp

### "MSBuild.exe failed with exit code: 1"

- Đảm bảo đã cài đầy đủ "Desktop development with C++" workload
- Khởi động lại máy sau khi cài
- Thử xóa `node_modules` và cài lại: `rm -rf node_modules && npm install`

### "Python not found"

```bash
# Cài Python và cấu hình
npm config set python C:\Python3\python.exe
```

### "Cannot find module 'node-gyp'"

```bash
# Cài node-gyp globally
npm install -g node-gyp
```

## Tài liệu tham khảo

- Node-gyp on Windows: https://github.com/nodejs/node-gyp#on-windows
- Better-sqlite3 Installation: https://github.com/WiseLibs/better-sqlite3/blob/master/docs/troubleshooting.md
- Visual Studio Build Tools: https://visualstudio.microsoft.com/downloads/
