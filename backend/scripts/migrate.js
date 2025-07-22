import { executeQuery, testConnection } from '../config/database.js';

const createTables = async () => {
  try {
    console.log('🚀 Starting database migration...');

    // Test connection first
    const isConnected = await testConnection();
    if (!isConnected) {
      throw new Error('Database connection failed');
    }

    // Create branches table
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS branches (
        id INT PRIMARY KEY AUTO_INCREMENT,
        code VARCHAR(10) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        address TEXT,
        phone VARCHAR(20),
        email VARCHAR(255),
        manager_name VARCHAR(255),
        monthly_target DECIMAL(15,2) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Create users table
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        role ENUM('admin', 'branch') NOT NULL,
        branch_id INT NULL,
        is_active BOOLEAN DEFAULT TRUE,
        last_login TIMESTAMP NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE SET NULL
      )
    `);

    // Create members table
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS members (
        id INT PRIMARY KEY AUTO_INCREMENT,
        member_number VARCHAR(50) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        mother_name VARCHAR(255),
        id_number VARCHAR(20) NOT NULL,
        npwp VARCHAR(50),
        birth_place VARCHAR(100),
        birth_date DATE,
        gender ENUM('LAKI LAKI', 'PEREMPUAN'),
        phone VARCHAR(20) NOT NULL,
        emergency_phone VARCHAR(20),
        emergency_relation VARCHAR(50),
        emergency_name VARCHAR(255),
        marital_status VARCHAR(50),
        religion VARCHAR(50),
        occupation VARCHAR(100),
        house_ownership VARCHAR(50),
        
        -- Kategori Pensiunan
        pensioner_category VARCHAR(50),
        pension_type VARCHAR(100),
        nopen VARCHAR(50),
        book_number VARCHAR(50),
        skep_number VARCHAR(50),
        skep_date DATE,
        skep_name VARCHAR(255),
        skep_status VARCHAR(50),
        payment_bank VARCHAR(100),
        pension_account VARCHAR(50),
        pension_salary DECIMAL(15,2),
        
        -- Alamat KTP
        ktp_address TEXT,
        ktp_province VARCHAR(100),
        ktp_city VARCHAR(100),
        ktp_district VARCHAR(100),
        ktp_subdistrict VARCHAR(100),
        ktp_postal_code VARCHAR(10),
        
        -- Alamat Domisili
        same_as_ktp BOOLEAN DEFAULT FALSE,
        domicile_address TEXT,
        domicile_province VARCHAR(100),
        domicile_city VARCHAR(100),
        domicile_district VARCHAR(100),
        domicile_subdistrict VARCHAR(100),
        domicile_postal_code VARCHAR(10),
        rt_number VARCHAR(10),
        rt_name VARCHAR(255),
        phone1 VARCHAR(20),
        phone2 VARCHAR(20),
        
        -- Marketing & Cabang
        marketing_id INT,
        branch_id INT NOT NULL,
        
        -- File uploads
        ktp_file VARCHAR(255),
        member_form VARCHAR(255),
        
        -- Status
        status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
        
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        
        FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE CASCADE
      )
    `);

    // Create savings table
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS savings (
        id INT PRIMARY KEY AUTO_INCREMENT,
        member_id INT NOT NULL,
        branch_id INT NOT NULL,
        savings_type ENUM('mandatory', 'voluntary', 'special') NOT NULL,
        amount DECIMAL(15,2) NOT NULL,
        transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        description TEXT,
        created_by INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE,
        FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE CASCADE,
        FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
      )
    `);

    // Create loans table
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS loans (
        id INT PRIMARY KEY AUTO_INCREMENT,
        member_id INT NOT NULL,
        branch_id INT NOT NULL,
        loan_number VARCHAR(20) UNIQUE NOT NULL,
        amount DECIMAL(15,2) NOT NULL,
        interest_rate DECIMAL(5,2) NOT NULL,
        term_months INT NOT NULL,
        monthly_payment DECIMAL(15,2) NOT NULL,
        purpose TEXT,
        status ENUM('pending', 'approved', 'active', 'completed', 'overdue', 'cancelled') DEFAULT 'pending',
        application_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        approval_date TIMESTAMP NULL,
        disbursement_date TIMESTAMP NULL,
        due_date DATE NULL,
        approved_by INT NULL,
        created_by INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE,
        FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE CASCADE,
        FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL,
        FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
      )
    `);

    // Create loan payments table
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS loan_payments (
        id INT PRIMARY KEY AUTO_INCREMENT,
        loan_id INT NOT NULL,
        payment_number INT NOT NULL,
        amount DECIMAL(15,2) NOT NULL,
        principal_amount DECIMAL(15,2) NOT NULL,
        interest_amount DECIMAL(15,2) NOT NULL,
        payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        due_date DATE NOT NULL,
        status ENUM('paid', 'overdue', 'pending') DEFAULT 'pending',
        created_by INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (loan_id) REFERENCES loans(id) ON DELETE CASCADE,
        FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
      )
    `);

    // Create transactions table
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS transactions (
        id INT PRIMARY KEY AUTO_INCREMENT,
        member_id INT NOT NULL,
        branch_id INT NOT NULL,
        type ENUM('savings_deposit', 'savings_withdrawal', 'loan_disbursement', 'loan_payment') NOT NULL,
        amount DECIMAL(15,2) NOT NULL,
        reference_id INT NULL,
        description TEXT,
        transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_by INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE,
        FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE CASCADE,
        FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
      )
    `);

    // Create branch_stats table for caching statistics
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS branch_stats (
        id INT PRIMARY KEY AUTO_INCREMENT,
        branch_id INT NOT NULL,
        total_members INT DEFAULT 0,
        total_savings DECIMAL(15,2) DEFAULT 0,
        total_active_loans DECIMAL(15,2) DEFAULT 0,
        total_overdue DECIMAL(15,2) DEFAULT 0,
        monthly_achievement DECIMAL(15,2) DEFAULT 0,
        achievement_rate DECIMAL(5,2) DEFAULT 0,
        last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE CASCADE,
        UNIQUE KEY unique_branch_stats (branch_id)
      )
    `);

    // Create products table
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS products (
        id INT PRIMARY KEY AUTO_INCREMENT,
        code VARCHAR(20) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        category ENUM('pinjaman', 'simpanan', 'investasi') NOT NULL,
        description TEXT,
        status ENUM('active', 'inactive') DEFAULT 'active',
        created_by INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
      )
    `);

    // Create product_settings table
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS product_settings (
        id INT PRIMARY KEY AUTO_INCREMENT,
        product_id INT NOT NULL,
        max_age INT,
        max_limit DECIMAL(15,2),
        max_term_months INT,
        interest_rate DECIMAL(5,2),
        mandatory_saving DECIMAL(15,2),
        principal_saving_percentage DECIMAL(5,2),
        admin_office_percentage DECIMAL(5,2),
        admin_center_percentage DECIMAL(5,2),
        marketing_fee_percentage DECIMAL(5,2),
        crk_insurance JSON,
        flagging_fees JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
        UNIQUE KEY unique_product_settings (product_id)
      )
    `);

    console.log('✅ All tables created successfully');
    console.log('📊 Database migration completed!');

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
};

// Run migration
createTables().then(() => {
  console.log('🎉 Migration process finished');
  process.exit(0);
});