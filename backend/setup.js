import { testConnection } from './config/database.js';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

const setupDatabase = async () => {
  try {
    console.log('🚀 Starting Koperasi Database Setup...\n');

    // Test database connection
    console.log('1️⃣  Testing database connection...');
    const isConnected = await testConnection();
    
    if (!isConnected) {
      console.error('\n❌ Database connection failed!');
      console.log('\n🔧 Please check:');
      console.log('   • XAMPP MySQL is running');
      console.log('   • MySQL is accessible on port 3306');
      console.log('   • Database "koperasi_db" exists');
      console.log('\n💡 To create database, open phpMyAdmin and run:');
      console.log('   CREATE DATABASE koperasi_db;');
      process.exit(1);
    }

    // Run migration
    console.log('\n2️⃣  Running database migration...');
    await execAsync('node scripts/migrate.js');
    console.log('✅ Migration completed successfully');

    // Run seeding
    console.log('\n3️⃣  Seeding database with sample data...');
    await execAsync('node scripts/seed.js');
    console.log('✅ Seeding completed successfully');

    console.log('\n🎉 Database setup completed successfully!');
    console.log('\n👥 Default login credentials:');
    console.log('   Admin: admin@koperasi.com / admin123');
    console.log('   Jakarta: jakarta@koperasi.com / jakarta123');
    console.log('   Surabaya: surabaya@koperasi.com / surabaya123');
    console.log('   Bandung: bandung@koperasi.com / bandung123');
    
    console.log('\n🚀 Ready to start the server with:');
    console.log('   npm run dev');

  } catch (error) {
    console.error('\n❌ Setup failed:', error.message);
    console.log('\n🔧 Please check the error above and try again.');
    process.exit(1);
  }
};

setupDatabase();