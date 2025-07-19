import bcrypt from 'bcryptjs';
import { executeQuery, testConnection } from '../config/database.js';

// Helper function to convert undefined values to null
const sanitizeParams = (params) => {
  return params.map(param => param === undefined ? null : param);
};

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Test connection first
    const isConnected = await testConnection();
    if (!isConnected) {
      throw new Error('Database connection failed');
    }

    // Clear existing data (in development only)
    console.log('🧹 Clearing existing data...');
    await executeQuery('DELETE FROM branch_stats');
    await executeQuery('DELETE FROM transactions');
    await executeQuery('DELETE FROM loan_payments');
    await executeQuery('DELETE FROM loans');
    await executeQuery('DELETE FROM savings');
    await executeQuery('DELETE FROM members');
    await executeQuery('DELETE FROM users');
    await executeQuery('DELETE FROM branches');

    // Reset auto increment
    await executeQuery('ALTER TABLE branches AUTO_INCREMENT = 1');
    await executeQuery('ALTER TABLE users AUTO_INCREMENT = 1');
    await executeQuery('ALTER TABLE members AUTO_INCREMENT = 1');

    // Seed branches
    console.log('🏢 Seeding branches...');
    const branches = [
      {
        code: 'JKT-01',
        name: 'Cabang Jakarta Pusat',
        address: 'Jl. Sudirman No. 123, Jakarta Pusat',
        phone: '021-1234567',
        email: 'jakarta@koperasi.com',
        manager_name: 'Budi Santoso',
        monthly_target: 2000000.00
      },
      {
        code: 'SBY-01',
        name: 'Cabang Surabaya',
        address: 'Jl. Pemuda No. 456, Surabaya',
        phone: '031-7654321',
        email: 'surabaya@koperasi.com',
        manager_name: 'Siti Nurhaliza',
        monthly_target: 1500000.00
      },
      {
        code: 'BDG-01',
        name: 'Cabang Bandung',
        address: 'Jl. Asia Afrika No. 789, Bandung',
        phone: '022-9876543',
        email: 'bandung@koperasi.com',
        manager_name: 'Ahmad Wijaya',
        monthly_target: 1000000.00
      }
    ];

    for (const branch of branches) {
      await executeQuery(
        `INSERT INTO branches (code, name, address, phone, email, manager_name, monthly_target) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        sanitizeParams([branch.code, branch.name, branch.address, branch.phone, branch.email, branch.manager_name, branch.monthly_target])
      );
    }

    // Seed users
    console.log('👥 Seeding users...');
    const saltRounds = 10;
    const users = [
      {
        email: 'admin@koperasi.com',
        password: await bcrypt.hash('admin123', saltRounds),
        name: 'Administrator',
        role: 'admin',
        branch_id: null
      },
      {
        email: 'jakarta@koperasi.com',
        password: await bcrypt.hash('jakarta123', saltRounds),
        name: 'Cabang Jakarta Pusat',
        role: 'branch',
        branch_id: 1
      },
      {
        email: 'surabaya@koperasi.com',
        password: await bcrypt.hash('surabaya123', saltRounds),
        name: 'Cabang Surabaya',
        role: 'branch',
        branch_id: 2
      },
      {
        email: 'bandung@koperasi.com',
        password: await bcrypt.hash('bandung123', saltRounds),
        name: 'Cabang Bandung',
        role: 'branch',
        branch_id: 3
      }
    ];

    for (const user of users) {
      await executeQuery(
        `INSERT INTO users (email, password, name, role, branch_id) 
         VALUES (?, ?, ?, ?, ?)`,
        sanitizeParams([user.email, user.password, user.name, user.role, user.branch_id])
      );
    }

    // Seed members
    console.log('👤 Seeding members...');
    const members = [
      // Jakarta branch members
      { member_number: 'JKT001', name: 'Andi Wijaya', email: 'andi.wijaya@email.com', phone: '081234567890', address: 'Jakarta Selatan', id_number: '3171001234567890', branch_id: 1, join_date: '2023-01-15' },
      { member_number: 'JKT002', name: 'Siti Nurhaliza', email: 'siti.nurhaliza@email.com', phone: '081234567891', address: 'Jakarta Timur', id_number: '3171001234567891', branch_id: 1, join_date: '2023-02-20' },
      { member_number: 'JKT003', name: 'Budi Santoso', email: 'budi.santoso@email.com', phone: '081234567892', address: 'Jakarta Barat', id_number: '3171001234567892', branch_id: 1, join_date: '2023-03-10' },
      { member_number: 'JKT004', name: 'Dewi Lestari', email: 'dewi.lestari@email.com', phone: '081234567893', address: 'Jakarta Utara', id_number: '3171001234567893', branch_id: 1, join_date: '2023-04-05' },
      { member_number: 'JKT005', name: 'Ahmad Fauzi', email: 'ahmad.fauzi@email.com', phone: '081234567894', address: 'Jakarta Pusat', id_number: '3171001234567894', branch_id: 1, join_date: '2023-05-12' },
      
      // Surabaya branch members
      { member_number: 'SBY001', name: 'Rita Sari', email: 'rita.sari@email.com', phone: '082345678901', address: 'Surabaya Timur', id_number: '3578001234567890', branch_id: 2, join_date: '2023-01-20' },
      { member_number: 'SBY002', name: 'Joko Susilo', email: 'joko.susilo@email.com', phone: '082345678902', address: 'Surabaya Barat', id_number: '3578001234567891', branch_id: 2, join_date: '2023-02-15' },
      { member_number: 'SBY003', name: 'Maya Indah', email: 'maya.indah@email.com', phone: '082345678903', address: 'Surabaya Selatan', id_number: '3578001234567892', branch_id: 2, join_date: '2023-03-08' },
      
      // Bandung branch members
      { member_number: 'BDG001', name: 'Rudi Hartono', email: 'rudi.hartono@email.com', phone: '083456789012', address: 'Bandung Utara', id_number: '3273001234567890', branch_id: 3, join_date: '2023-01-25' },
      { member_number: 'BDG002', name: 'Linda Sari', email: 'linda.sari@email.com', phone: '083456789013', address: 'Bandung Selatan', id_number: '3273001234567891', branch_id: 3, join_date: '2023-02-18' }
    ];

    for (const member of members) {
      await executeQuery(
        `INSERT INTO members (member_number, name, email, phone, address, id_number, branch_id, join_date) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        sanitizeParams([member.member_number, member.name, member.email, member.phone, member.address, member.id_number, member.branch_id, member.join_date])
      );
    }

    // Seed savings
    console.log('💰 Seeding savings...');
    const savings = [
      { member_id: 1, branch_id: 1, savings_type: 'mandatory', amount: 500000.00, description: 'Simpanan wajib bulanan', created_by: 2 },
      { member_id: 1, branch_id: 1, savings_type: 'voluntary', amount: 200000.00, description: 'Simpanan sukarela', created_by: 2 },
      { member_id: 2, branch_id: 1, savings_type: 'mandatory', amount: 500000.00, description: 'Simpanan wajib bulanan', created_by: 2 },
      { member_id: 3, branch_id: 1, savings_type: 'mandatory', amount: 500000.00, description: 'Simpanan wajib bulanan', created_by: 2 },
      { member_id: 6, branch_id: 2, savings_type: 'mandatory', amount: 400000.00, description: 'Simpanan wajib bulanan', created_by: 3 },
      { member_id: 7, branch_id: 2, savings_type: 'voluntary', amount: 300000.00, description: 'Simpanan sukarela', created_by: 3 },
      { member_id: 9, branch_id: 3, savings_type: 'mandatory', amount: 350000.00, description: 'Simpanan wajib bulanan', created_by: 4 }
    ];

    for (const saving of savings) {
      await executeQuery(
        `INSERT INTO savings (member_id, branch_id, savings_type, amount, description, created_by) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        sanitizeParams([saving.member_id, saving.branch_id, saving.savings_type, saving.amount, saving.description, saving.created_by])
      );
    }

    // Seed loans
    console.log('🏦 Seeding loans...');
    const loans = [
      { member_id: 1, branch_id: 1, loan_number: 'LN-JKT-001', amount: 2000000.00, interest_rate: 12.00, term_months: 12, monthly_payment: 177698.52, purpose: 'Modal usaha', status: 'approved', created_by: 2, approved_by: 2 },
      { member_id: 2, branch_id: 1, loan_number: 'LN-JKT-002', amount: 1500000.00, interest_rate: 12.00, term_months: 6, monthly_payment: 258154.39, purpose: 'Renovasi rumah', status: 'active', created_by: 2, approved_by: 2 },
      { member_id: 5, branch_id: 1, loan_number: 'LN-JKT-003', amount: 5000000.00, interest_rate: 12.00, term_months: 24, monthly_payment: 235372.86, purpose: 'Modal usaha', status: 'pending', created_by: 2, approved_by: null },
      { member_id: 6, branch_id: 2, loan_number: 'LN-SBY-001', amount: 2500000.00, interest_rate: 12.00, term_months: 18, monthly_payment: 154321.65, purpose: 'Renovasi rumah', status: 'pending', created_by: 3, approved_by: null },
      { member_id: 7, branch_id: 2, loan_number: 'LN-SBY-002', amount: 1000000.00, interest_rate: 12.00, term_months: 12, monthly_payment: 88849.26, purpose: 'Pendidikan', status: 'approved', created_by: 3, approved_by: 3 }
    ];

    for (const loan of loans) {
      await executeQuery(
        `INSERT INTO loans (member_id, branch_id, loan_number, amount, interest_rate, term_months, monthly_payment, purpose, status, created_by, approved_by) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        sanitizeParams([loan.member_id, loan.branch_id, loan.loan_number, loan.amount, loan.interest_rate, loan.term_months, loan.monthly_payment, loan.purpose, loan.status, loan.created_by, loan.approved_by])
      );
    }

    // Seed transactions
    console.log('📊 Seeding transactions...');
    const transactions = [
      { member_id: 1, branch_id: 1, type: 'loan_disbursement', amount: 2000000.00, reference_id: 1, description: 'Pencairan pinjaman LN-JKT-001', created_by: 2 },
      { member_id: 2, branch_id: 1, type: 'savings_deposit', amount: 500000.00, reference_id: 1, description: 'Setoran simpanan wajib', created_by: 2 },
      { member_id: 3, branch_id: 1, type: 'loan_payment', amount: 177698.52, reference_id: 1, description: 'Pembayaran angsuran ke-1', created_by: 2 },
      { member_id: 6, branch_id: 2, type: 'savings_deposit', amount: 400000.00, reference_id: 4, description: 'Setoran simpanan wajib', created_by: 3 }
    ];

    for (const transaction of transactions) {
      await executeQuery(
        `INSERT INTO transactions (member_id, branch_id, type, amount, reference_id, description, created_by) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        sanitizeParams([transaction.member_id, transaction.branch_id, transaction.type, transaction.amount, transaction.reference_id, transaction.description, transaction.created_by])
      );
    }

    // Seed branch stats
    console.log('📈 Seeding branch statistics...');
    const branchStats = [
      { branch_id: 1, total_members: 5, total_savings: 1200000.00, total_active_loans: 850000.00, total_overdue: 45000.00, monthly_achievement: 1800000.00, achievement_rate: 90.00 },
      { branch_id: 2, total_members: 3, total_savings: 980000.00, total_active_loans: 720000.00, total_overdue: 32000.00, monthly_achievement: 1300000.00, achievement_rate: 87.00 },
      { branch_id: 3, total_members: 2, total_savings: 650000.00, total_active_loans: 480000.00, total_overdue: 28000.00, monthly_achievement: 920000.00, achievement_rate: 92.00 }
    ];

    for (const stat of branchStats) {
      await executeQuery(
        `INSERT INTO branch_stats (branch_id, total_members, total_savings, total_active_loans, total_overdue, monthly_achievement, achievement_rate) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        sanitizeParams([stat.branch_id, stat.total_members, stat.total_savings, stat.total_active_loans, stat.total_overdue, stat.monthly_achievement, stat.achievement_rate])
      );
    }

    console.log('✅ Database seeding completed successfully!');
    console.log('🎉 Sample data has been inserted into all tables');

  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
};

// Run seeding
seedDatabase().then(() => {
  console.log('🌟 Seeding process finished');
  process.exit(0);
});