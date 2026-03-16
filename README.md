# Hệ Thống Quản Lý Chứng Chỉ Bằng Blockchain (Nhóm 10)

Dự án mô phỏng cơ chế hoạt động lõi của mạng lưới Blockchain (bao gồm Proof of Work, Hashing, và kiến trúc chuỗi khối) được áp dụng vào bài toán thực tế: **Lưu trữ và xác thực văn bằng, chứng chỉ**. 

Hệ thống được xây dựng theo kiến trúc phân tách độc lập giữa API (Backend) và Giao diện (Frontend).

## Công nghệ sử dụng
* **Backend:** Python, Flask, Flask-CORS
* **Frontend:** React, Next.js, Tailwind CSS

---

## Hướng dẫn Cài đặt & Khởi chạy

Để chạy dự án này trên máy tính của bạn, vui lòng đảm bảo máy đã cài đặt sẵn [Python (3.x)](https://www.python.org/) và [Node.js](https://nodejs.org/).

### 1. Khởi chạy Máy chủ Backend (Sổ cái Blockchain)
Mở terminal, di chuyển vào thư mục `backend` và thiết lập môi trường ảo:
```bash
cd backend

# Tạo môi trường ảo (Virtual Environment)
python -m venv venv

# Kích hoạt môi trường
# (Với Windows)
.\venv\Scripts\activate
# (Với macOS/Linux dùng lệnh: source venv/bin/activate)

# Cài đặt các thư viện cần thiết
pip install -r requirements.txt

# Khởi chạy server ở cổng 5000
python app.py
```

Sau khi khởi chạy thành công, backend sẽ chạy tại:

```
http://localhost:5000
```
### 2. Khởi chạy Frontend(tạo 1 terminal mới)
```bash
cd frontend

npm install

npm run dev
```

Ứng dụng frontend sẽ chạy tại:

```
http://localhost:3000
```

