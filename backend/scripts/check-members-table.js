import { executeQuery, testConnection } from '../config/database.js';

const checkMembersTable = async () => {
  try {
    console.log('🔍 Checking members table structure...');

    // Test connection first
    const isConnected = await testConnection();
    if (!isConnected) {
      throw new Error('Database connection failed');
    }

    // Get table structure
    const columns = await executeQuery(`
      SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_DEFAULT, COLUMN_KEY
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE() 
      AND TABLE_NAME = 'members'
      ORDER BY ORDINAL_POSITION
    `);

    console.log('\n📋 Members table structure:');
    console.log('='.repeat(80));
    console.log('Column Name'.padEnd(25) + 'Data Type'.padEnd(15) + 'Nullable'.padEnd(10) + 'Default'.padEnd(15) + 'Key');
    console.log('='.repeat(80));

    columns.forEach(column => {
      console.log(
        column.COLUMN_NAME.padEnd(25) + 
        column.DATA_TYPE.padEnd(15) + 
        column.IS_NULLABLE.padEnd(10) + 
        (column.COLUMN_DEFAULT || 'NULL').padEnd(15) + 
        (column.COLUMN_KEY || '')
      );
    });

    console.log('='.repeat(80));
    console.log(`Total columns: ${columns.length}`);

    // Check if specific new columns exist
    const newColumns = [
      'pensioner_category', 'pension_type', 'nopen', 'book_number', 'skep_number',
      'skep_date', 'skep_name', 'skep_status', 'payment_bank', 'pension_account',
      'pension_salary', 'mother_name', 'npwp', 'birth_place', 'birth_date',
      'gender', 'emergency_phone', 'emergency_relation', 'emergency_name',
      'marital_status', 'religion', 'occupation', 'house_ownership',
      'ktp_address', 'ktp_province', 'ktp_city', 'ktp_district', 'ktp_subdistrict',
      'ktp_postal_code', 'same_as_ktp', 'domicile_address', 'domicile_province',
      'domicile_city', 'domicile_district', 'domicile_subdistrict', 'domicile_postal_code',
      'rt_number', 'rt_name', 'phone1', 'phone2', 'marketing_id', 'ktp_file', 'member_form'
    ];

    console.log('\n✅ Checking new columns:');
    newColumns.forEach(columnName => {
      const exists = columns.find(col => col.COLUMN_NAME === columnName);
      console.log(`${exists ? '✅' : '❌'} ${columnName}`);
    });

  } catch (error) {
    console.error('❌ Check failed:', error.message);
    process.exit(1);
  }
};

// Run check
checkMembersTable().then(() => {
  console.log('\n🎉 Members table check completed');
  process.exit(0);
}); 