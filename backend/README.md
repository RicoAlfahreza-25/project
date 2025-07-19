# Koperasi Simpan Pinjam - Backend API

Backend API for the Koperasi Simpan Pinjam (Cooperative Savings and Loans) management system built with Express.js and MySQL.

## 🚀 Features

- **Authentication & Authorization** with JWT
- **Role-based Access Control** (Admin & Branch)
- **Branch Management** with statistics
- **Real-time Dashboard Data**
- **Secure API** with rate limiting and validation
- **MySQL Database** with connection pooling
- **Comprehensive Error Handling**

## 📋 Prerequisites

Before running this backend, make sure you have:

1. **Node.js** (v16 or higher)
2. **XAMPP** with MySQL running
3. **npm** or **yarn** package manager

## 🛠️ Installation & Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Start XAMPP MySQL

- Start XAMPP Control Panel
- Start **Apache** and **MySQL** services
- Make sure MySQL is running on port **3306**

### 3. Create Database

Open phpMyAdmin (http://localhost/phpmyadmin) and create a new database:

```sql
CREATE DATABASE koperasi_db;
```

### 4. Environment Configuration

The `.env` file is already configured for XAMPP default settings:

```env
# Database Configuration (XAMPP MySQL)
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=koperasi_db

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=koperasi_jwt_secret_key_2024_development
JWT_EXPIRES_IN=7d

# CORS Configuration
FRONTEND_URL=http://localhost:5173
```

### 5. Database Migration & Seeding

Run these commands to set up the database:

```bash
# Create all tables
npm run migrate

# Insert sample data
npm run seed
```

### 6. Start the Server

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:5000`

## 📊 Database Schema

### Tables Created:

1. **branches** - Branch information
2. **users** - System users (admin/branch)
3. **members** - Cooperative members
4. **savings** - Savings transactions
5. **loans** - Loan applications and management
6. **loan_payments** - Loan payment records
7. **transactions** - All financial transactions
8. **branch_stats** - Cached branch statistics

## 🔐 API Endpoints

### Authentication

```http
POST /api/auth/login
GET  /api/auth/profile
POST /api/auth/change-password
POST /api/auth/users (admin only)
```

### Branch Management

```http
GET  /api/branches/stats/:branchId?
POST /api/branches/stats/refresh/:branchId?
GET  /api/branches (admin only)
POST /api/branches (admin only)
PUT  /api/branches/:id (admin only)
```

## 👥 Default User Accounts

After running the seed script, you can login with these accounts:

### Admin Account
- **Email:** `admin@koperasi.com`
- **Password:** `admin123`

### Branch Accounts
- **Jakarta:** `jakarta@koperasi.com` / `jakarta123`
- **Surabaya:** `surabaya@koperasi.com` / `surabaya123`
- **Bandung:** `bandung@koperasi.com` / `bandung123`

## 📝 API Usage Examples

### Login Request

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jakarta@koperasi.com",
    "password": "jakarta123"
  }'
```

### Get Branch Statistics

```bash
curl -X GET http://localhost:5000/api/branches/stats \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Response Format

All API responses follow this format:

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data here
  }
}
```

Error responses:

```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    // Validation errors if any
  ]
}
```

## 🔧 Development

### Available Scripts

```bash
npm run dev      # Start development server with nodemon
npm start        # Start production server
npm run migrate  # Run database migrations
npm run seed     # Seed database with sample data
```

### Project Structure

```
backend/
├── config/
│   └── database.js       # Database configuration
├── controllers/
│   ├── authController.js # Authentication logic
│   └── branchController.js # Branch management
├── middleware/
│   ├── auth.js          # Authentication middleware
│   └── validation.js    # Request validation
├── routes/
│   ├── auth.js          # Auth routes
│   └── branches.js      # Branch routes
├── scripts/
│   ├── migrate.js       # Database migration
│   └── seed.js          # Database seeding
├── .env                 # Environment variables
├── server.js            # Main server file
└── package.json         # Dependencies
```

## 🔒 Security Features

- **JWT Authentication** with token expiration
- **Password Hashing** with bcrypt
- **Rate Limiting** to prevent abuse
- **Input Validation** with express-validator
- **CORS Configuration** for frontend access
- **Helmet.js** for security headers
- **Role-based Authorization**

## 🚨 Troubleshooting

### Common Issues:

1. **Database Connection Failed**
   - Make sure XAMPP MySQL is running
   - Check if port 3306 is available
   - Verify database name `koperasi_db` exists

2. **Migration Errors**
   - Ensure database is created first
   - Check MySQL user permissions
   - Verify .env configuration

3. **CORS Errors**
   - Check FRONTEND_URL in .env
   - Ensure frontend is running on port 5173

### Debug Mode

Set `NODE_ENV=development` for detailed error messages and stack traces.

## 🤝 Integration with Frontend

The backend is designed to work with the React frontend. Make sure:

1. Frontend runs on `http://localhost:5173`
2. Backend runs on `http://localhost:5000`
3. CORS is properly configured
4. JWT tokens are included in Authorization headers

## 📈 Performance

- **Connection Pooling** for database efficiency
- **Cached Statistics** for faster dashboard loading
- **Rate Limiting** for API protection
- **Optimized Queries** with proper indexing

## 🔄 API Versioning

Current API version: `v1` (implicit in `/api/` prefix)

For future versions, use `/api/v2/` prefix while maintaining backward compatibility.

---

**Happy Coding!** 🎉

For issues or questions, please check the API documentation or contact the development team.