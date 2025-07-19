#!/bin/bash

echo "🚀 Git Push Script untuk Koperasi Backend"
echo "========================================="

# Cek status git
echo "📋 Checking Git status..."
git status

# Add semua perubahan
echo ""
echo "➕ Adding all changes..."
git add .

# Tampilkan files yang akan di-commit
echo ""
echo "📝 Files to be committed:"
git diff --cached --name-only

# Commit dengan pesan
echo ""
echo "💾 Committing changes..."
git commit -m "feat: Add complete backend API with Express.js and MySQL

- Add Express.js backend server with JWT authentication
- Create comprehensive MySQL database schema (8 tables)
- Implement branch dashboard API endpoints
- Add role-based access control (Admin/Branch users)
- Create database migration and seeding scripts
- Update frontend authentication with useAuth hook
- Add input validation and error handling
- Configure CORS for frontend integration
- Add complete API documentation and setup guide
- Support for XAMPP MySQL integration

Backend Features:
- Authentication: JWT tokens, password hashing, role-based access
- Database: MySQL with connection pooling, migrations, seeding
- API: RESTful endpoints for auth and branch management
- Security: Rate limiting, input validation, CORS, Helmet
- Documentation: Complete setup guide and API reference

Frontend Updates:
- Enhanced login with user type selection
- Improved branch dashboard with real-time data
- Custom authentication hook for state management
- Better error handling and loading states"

# Push ke repository
echo ""
echo "🚀 Pushing to repository..."
echo "⚠️  Make sure you're on the correct branch!"
echo ""
echo "Choose your push command:"
echo "1. git push origin main"
echo "2. git push origin master"
echo "3. git push origin [your-branch-name]"
echo ""

# Tampilkan remote info
echo "📡 Remote repository info:"
git remote -v

echo ""
echo "✅ Script completed. Now run one of the push commands above."
echo "💡 If you get authentication errors, make sure you're logged in to Git."