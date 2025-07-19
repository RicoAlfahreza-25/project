# 🏢 Koperasi Simpan Pinjam - Setup Guide

Panduan lengkap untuk menjalankan aplikasi Koperasi Simpan Pinjam dengan backend Express.js dan MySQL.

## 📋 Prerequisites

Pastikan Anda sudah menginstall:

1. **Node.js** (v16 atau lebih baru) - [Download](https://nodejs.org/)
2. **XAMPP** - [Download](https://www.apachefriends.org/download.html)
3. **Git** - [Download](https://git-scm.com/)

## 🚀 Quick Start

### 1. Clone Repository
```bash
git clone [your-repo-url]
cd koperasi-app
```

### 2. Setup Backend

#### a. Install Dependencies
```bash
cd backend
npm install
```

#### b. Start XAMPP
- Buka XAMPP Control Panel
- Start **Apache** dan **MySQL**
- Pastikan MySQL berjalan di port 3306

#### c. Create Database
Buka phpMyAdmin (http://localhost/phpmyadmin) dan jalankan:
```sql
CREATE DATABASE koperasi_db;
```

#### d. Setup Database & Start Server
```bash
# Setup database (migration + seeding)
npm run setup

# Start backend server
npm run dev
```

Server backend akan berjalan di: `http://localhost:5000`

### 3. Setup Frontend

#### a. Install Dependencies
```bash
cd ../  # kembali ke root project
npm install
```

#### b. Start Frontend
```bash
npm run dev
```

Frontend akan berjalan di: `http://localhost:5173`

## 👥 Login Credentials

Setelah setup database selesai, gunakan kredensial berikut:

### Admin Account
- **Email:** `admin@koperasi.com`
- **Password:** `admin123`
- **Access:** Dashboard admin dengan akses ke semua cabang

### Branch Accounts
- **Jakarta:** `jakarta@koperasi.com` / `jakarta123`
- **Surabaya:** `surabaya@koperasi.com` / `surabaya123`
- **Bandung:** `bandung@koperasi.com` / `bandung123`
- **Access:** Dashboard cabang dengan data spesifik cabang

## 🔧 Development

### Backend Commands
```bash
cd backend

npm run dev      # Start development server
npm run start    # Start production server
npm run setup    # Setup database (migrate + seed)
npm run migrate  # Create database tables only
npm run seed     # Insert sample data only
```

### Frontend Commands
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `POST /api/auth/change-password` - Change password

### Branch Management
- `GET /api/branches/stats` - Get branch statistics
- `GET /api/branches` - Get all branches (admin only)
- `POST /api/branches` - Create branch (admin only)

### Example API Usage
```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "jakarta@koperasi.com", "password": "jakarta123"}'

# Get branch stats (with token)
curl -X GET http://localhost:5000/api/branches/stats \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 📊 Database Schema

### Tables:
1. **branches** - Informasi cabang
2. **users** - User sistem (admin/cabang)
3. **members** - Anggota koperasi
4. **savings** - Transaksi simpanan
5. **loans** - Pinjaman
6. **loan_payments** - Pembayaran pinjaman
7. **transactions** - Semua transaksi keuangan
8. **branch_stats** - Statistik cabang (cached)

## 🔒 Security Features

- **JWT Authentication** dengan expiry 7 hari
- **Password Hashing** dengan bcrypt
- **Rate Limiting** (100 requests/15 menit)
- **Input Validation** dengan express-validator
- **CORS Configuration** untuk frontend
- **Role-based Access Control**

## 🚨 Troubleshooting

### Database Connection Error
```
❌ Database connection failed
```
**Solusi:**
- Pastikan XAMPP MySQL berjalan
- Cek database `koperasi_db` sudah dibuat
- Verifikasi port 3306 tidak digunakan aplikasi lain

### Frontend Login Error
```
❌ Network Error / CORS Error
```
**Solusi:**
- Pastikan backend berjalan di port 5000
- Cek CORS configuration di backend/.env
- Restart kedua server (frontend & backend)

### Migration Error
```
❌ Migration failed
```
**Solusi:**
- Pastikan database `koperasi_db` exists
- Cek user MySQL punya permission
- Hapus tables lama jika ada konflik

## 📱 Features

### Dashboard Cabang
- **Real-time Statistics:** Total anggota, simpanan, pinjaman
- **Achievement Tracking:** Progress bulanan dengan visual
- **Recent Transactions:** 10 transaksi terbaru
- **Loan Applications:** Pengajuan yang perlu approval
- **Quick Actions:** Shortcut untuk tugas umum

### Authentication System
- **Multi-role Login:** Admin dan Cabang
- **Auto-redirect:** Berdasarkan role user
- **Session Management:** JWT dengan refresh
- **Security:** Rate limiting dan validation

## 🔄 Git Workflow

### Push Changes
```bash
# Add all changes
git add .

# Commit with message
git commit -m "feat: your feature description"

# Push to repository
git push origin main
```

### Create Feature Branch
```bash
# Create new branch
git checkout -b feature/new-feature

# Push new branch
git push origin feature/new-feature
```

## 📈 Performance

- **Database Connection Pooling** untuk efisiensi
- **Cached Statistics** untuk dashboard cepat
- **Optimized Queries** dengan proper indexing
- **Rate Limiting** untuk proteksi API

## 🔮 Next Steps

1. **Extend API:** Tambah endpoints untuk members, savings, loans
2. **Add Reports:** Laporan keuangan dan statistik
3. **Real-time Updates:** WebSocket untuk live data
4. **Mobile App:** React Native untuk mobile access
5. **Advanced Security:** 2FA, audit logs

---

## 📞 Support

Jika mengalami masalah:
1. Cek troubleshooting guide di atas
2. Pastikan semua prerequisites terinstall
3. Verifikasi semua services berjalan (XAMPP, Node.js)
4. Cek log errors di console

**Happy Coding!** 🎉