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
        member_number VARCHAR(20) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255),
        phone VARCHAR(20),
        address TEXT,
        id_number VARCHAR(20),
        branch_id INT NOT NULL,
        join_date DATE NOT NULL,
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