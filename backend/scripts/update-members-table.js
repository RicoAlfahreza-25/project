import { executeQuery, testConnection } from '../config/database.js';

const updateMembersTable = async () => {
  try {
    console.log('🚀 Starting members table update...');

    // Test connection first
    const isConnected = await testConnection();
    if (!isConnected) {
      throw new Error('Database connection failed');
    }

    // Check if members table exists
    const tableExists = await executeQuery(`
      SELECT COUNT(*) as count 
      FROM information_schema.tables 
      WHERE table_schema = DATABASE() 
      AND table_name = 'members'
    `);

    if (tableExists[0].count === 0) {
      console.log('❌ Members table does not exist. Please run migration first.');
      return;
    }

    console.log('📋 Updating members table structure...');

    // Add new columns for pensioner category
    await executeQuery(`ALTER TABLE members ADD COLUMN IF NOT EXISTS pensioner_category VARCHAR(50)`);
    await executeQuery(`ALTER TABLE members ADD COLUMN IF NOT EXISTS pension_type VARCHAR(100)`);
    await executeQuery(`ALTER TABLE members ADD COLUMN IF NOT EXISTS nopen VARCHAR(50)`);
    await executeQuery(`ALTER TABLE members ADD COLUMN IF NOT EXISTS book_number VARCHAR(50)`);
    await executeQuery(`ALTER TABLE members ADD COLUMN IF NOT EXISTS skep_number VARCHAR(50)`);
    await executeQuery(`ALTER TABLE members ADD COLUMN IF NOT EXISTS skep_date DATE`);
    await executeQuery(`ALTER TABLE members ADD COLUMN IF NOT EXISTS skep_name VARCHAR(255)`);
    await executeQuery(`ALTER TABLE members ADD COLUMN IF NOT EXISTS skep_status VARCHAR(50)`);
    await executeQuery(`ALTER TABLE members ADD COLUMN IF NOT EXISTS payment_bank VARCHAR(100)`);
    await executeQuery(`ALTER TABLE members ADD COLUMN IF NOT EXISTS pension_account VARCHAR(50)`);
    await executeQuery(`ALTER TABLE members ADD COLUMN IF NOT EXISTS pension_salary DECIMAL(15,2)`);

    // Add new columns for personal data
    await executeQuery(`ALTER TABLE members ADD COLUMN IF NOT EXISTS mother_name VARCHAR(255)`);
    await executeQuery(`ALTER TABLE members ADD COLUMN IF NOT EXISTS npwp VARCHAR(50)`);
    await executeQuery(`ALTER TABLE members ADD COLUMN IF NOT EXISTS birth_place VARCHAR(100)`);
    await executeQuery(`ALTER TABLE members ADD COLUMN IF NOT EXISTS birth_date DATE`);
    await executeQuery(`ALTER TABLE members ADD COLUMN IF NOT EXISTS gender ENUM('LAKI LAKI', 'PEREMPUAN')`);
    await executeQuery(`ALTER TABLE members ADD COLUMN IF NOT EXISTS emergency_phone VARCHAR(20)`);
    await executeQuery(`ALTER TABLE members ADD COLUMN IF NOT EXISTS emergency_relation VARCHAR(50)`);
    await executeQuery(`ALTER TABLE members ADD COLUMN IF NOT EXISTS emergency_name VARCHAR(255)`);
    await executeQuery(`ALTER TABLE members ADD COLUMN IF NOT EXISTS marital_status VARCHAR(50)`);
    await executeQuery(`ALTER TABLE members ADD COLUMN IF NOT EXISTS religion VARCHAR(50)`);
    await executeQuery(`ALTER TABLE members ADD COLUMN IF NOT EXISTS occupation VARCHAR(100)`);
    await executeQuery(`ALTER TABLE members ADD COLUMN IF NOT EXISTS house_ownership VARCHAR(50)`);

    // Add new columns for KTP address
    await executeQuery(`ALTER TABLE members ADD COLUMN IF NOT EXISTS ktp_address TEXT`);
    await executeQuery(`ALTER TABLE members ADD COLUMN IF NOT EXISTS ktp_province VARCHAR(100)`);
    await executeQuery(`ALTER TABLE members ADD COLUMN IF NOT EXISTS ktp_city VARCHAR(100)`);
    await executeQuery(`ALTER TABLE members ADD COLUMN IF NOT EXISTS ktp_district VARCHAR(100)`);
    await executeQuery(`ALTER TABLE members ADD COLUMN IF NOT EXISTS ktp_subdistrict VARCHAR(100)`);
    await executeQuery(`ALTER TABLE members ADD COLUMN IF NOT EXISTS ktp_postal_code VARCHAR(10)`);

    // Add new columns for domicile address
    await executeQuery(`ALTER TABLE members ADD COLUMN IF NOT EXISTS same_as_ktp BOOLEAN DEFAULT FALSE`);
    await executeQuery(`ALTER TABLE members ADD COLUMN IF NOT EXISTS domicile_address TEXT`);
    await executeQuery(`ALTER TABLE members ADD COLUMN IF NOT EXISTS domicile_province VARCHAR(100)`);
    await executeQuery(`ALTER TABLE members ADD COLUMN IF NOT EXISTS domicile_city VARCHAR(100)`);
    await executeQuery(`ALTER TABLE members ADD COLUMN IF NOT EXISTS domicile_district VARCHAR(100)`);
    await executeQuery(`ALTER TABLE members ADD COLUMN IF NOT EXISTS domicile_subdistrict VARCHAR(100)`);
    await executeQuery(`ALTER TABLE members ADD COLUMN IF NOT EXISTS domicile_postal_code VARCHAR(10)`);
    await executeQuery(`ALTER TABLE members ADD COLUMN IF NOT EXISTS rt_number VARCHAR(10)`);
    await executeQuery(`ALTER TABLE members ADD COLUMN IF NOT EXISTS rt_name VARCHAR(255)`);
    await executeQuery(`ALTER TABLE members ADD COLUMN IF NOT EXISTS phone1 VARCHAR(20)`);
    await executeQuery(`ALTER TABLE members ADD COLUMN IF NOT EXISTS phone2 VARCHAR(20)`);

    // Add new columns for marketing and files
    await executeQuery(`ALTER TABLE members ADD COLUMN IF NOT EXISTS marketing_id INT`);
    await executeQuery(`ALTER TABLE members ADD COLUMN IF NOT EXISTS ktp_file VARCHAR(255)`);
    await executeQuery(`ALTER TABLE members ADD COLUMN IF NOT EXISTS member_form VARCHAR(255)`);

    // Modify existing columns if needed
    await executeQuery(`ALTER TABLE members MODIFY COLUMN member_number VARCHAR(50) UNIQUE NOT NULL`);
    await executeQuery(`ALTER TABLE members MODIFY COLUMN id_number VARCHAR(20) NOT NULL`);
    await executeQuery(`ALTER TABLE members MODIFY COLUMN phone VARCHAR(20) NOT NULL`);

    // Remove old columns if they exist
    try {
      await executeQuery(`ALTER TABLE members DROP COLUMN email`);
    } catch (error) {
      console.log('Column email does not exist or already removed');
    }

    try {
      await executeQuery(`ALTER TABLE members DROP COLUMN address`);
    } catch (error) {
      console.log('Column address does not exist or already removed');
    }

    try {
      await executeQuery(`ALTER TABLE members DROP COLUMN join_date`);
    } catch (error) {
      console.log('Column join_date does not exist or already removed');
    }

    console.log('✅ Members table structure updated successfully');
    console.log('📊 Table update completed!');

  } catch (error) {
    console.error('❌ Update failed:', error.message);
    process.exit(1);
  }
};

// Run update
updateMembersTable().then(() => {
  console.log('🎉 Members table update process finished');
  process.exit(0);
}); 