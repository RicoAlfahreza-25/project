import { executeQuery } from '../config/database.js';

// Get branch dashboard statistics
export const getBranchStats = async (req, res) => {
  try {
    const branchId = req.user.role === 'admin' ? req.params.branchId : req.user.branch_id;

    if (!branchId) {
      return res.status(400).json({
        success: false,
        message: 'Branch ID is required'
      });
    }

    // Get branch info
    const branches = await executeQuery(
      'SELECT * FROM branches WHERE id = ?',
      [branchId]
    );

    if (branches.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Branch not found'
      });
    }

    const branch = branches[0];

    // Get or calculate statistics
    let stats = await executeQuery(
      'SELECT * FROM branch_stats WHERE branch_id = ?',
      [branchId]
    );

    if (stats.length === 0) {
      // Calculate statistics if not cached
      await calculateBranchStats(branchId);
      stats = await executeQuery(
        'SELECT * FROM branch_stats WHERE branch_id = ?',
        [branchId]
      );
    }

    const branchStats = stats[0] || {
      total_members: 0,
      total_savings: 0,
      total_active_loans: 0,
      total_overdue: 0,
      monthly_achievement: 0,
      achievement_rate: 0
    };

    // Get recent transactions
    const recentTransactions = await executeQuery(
      `SELECT t.*, m.name as member_name, m.member_number 
       FROM transactions t 
       JOIN members m ON t.member_id = m.id 
       WHERE t.branch_id = ? 
       ORDER BY t.transaction_date DESC 
       LIMIT 10`,
      [branchId]
    );

    // Get pending loan applications
    const pendingLoans = await executeQuery(
      `SELECT l.*, m.name as member_name, m.member_number 
       FROM loans l 
       JOIN members m ON l.member_id = m.id 
       WHERE l.branch_id = ? AND l.status = 'pending' 
       ORDER BY l.application_date DESC 
       LIMIT 5`,
      [branchId]
    );

    res.json({
      success: true,
      data: {
        branch: {
          id: branch.id,
          code: branch.code,
          name: branch.name,
          monthlyTarget: branch.monthly_target
        },
        statistics: {
          totalMembers: branchStats.total_members,
          totalSavings: branchStats.total_savings,
          totalActiveLoans: branchStats.total_active_loans,
          totalOverdue: branchStats.total_overdue,
          monthlyAchievement: branchStats.monthly_achievement,
          achievementRate: branchStats.achievement_rate,
          lastUpdated: branchStats.last_updated
        },
        recentTransactions: recentTransactions.map(t => ({
          id: t.id,
          type: t.type,
          member: t.member_name,
          memberNumber: t.member_number,
          amount: t.amount,
          description: t.description,
          date: t.transaction_date
        })),
        pendingLoans: pendingLoans.map(l => ({
          id: l.id,
          loanNumber: l.loan_number,
          member: l.member_name,
          memberNumber: l.member_number,
          amount: l.amount,
          purpose: l.purpose,
          applicationDate: l.application_date
        }))
      }
    });

  } catch (error) {
    console.error('Get branch stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Calculate and update branch statistics
const calculateBranchStats = async (branchId) => {
  try {
    // Count total members
    const memberCount = await executeQuery(
      'SELECT COUNT(*) as count FROM members WHERE branch_id = ? AND status = "active"',
      [branchId]
    );

    // Sum total savings
    const totalSavings = await executeQuery(
      'SELECT COALESCE(SUM(amount), 0) as total FROM savings WHERE branch_id = ?',
      [branchId]
    );

    // Sum active loans
    const activeLoans = await executeQuery(
      'SELECT COALESCE(SUM(amount), 0) as total FROM loans WHERE branch_id = ? AND status IN ("active", "approved")',
      [branchId]
    );

    // Sum overdue loans (simplified - you might want more complex logic)
    const overdueLoans = await executeQuery(
      'SELECT COALESCE(SUM(amount * 0.05), 0) as total FROM loans WHERE branch_id = ? AND status = "overdue"',
      [branchId]
    );

    // Calculate monthly achievement (sum of this month's transactions)
    const monthlyAchievement = await executeQuery(
      `SELECT COALESCE(SUM(amount), 0) as total 
       FROM transactions 
       WHERE branch_id = ? 
       AND MONTH(transaction_date) = MONTH(CURRENT_DATE()) 
       AND YEAR(transaction_date) = YEAR(CURRENT_DATE())`,
      [branchId]
    );

    // Get branch target
    const branchTarget = await executeQuery(
      'SELECT monthly_target FROM branches WHERE id = ?',
      [branchId]
    );

    const target = branchTarget[0]?.monthly_target || 1;
    const achievement = monthlyAchievement[0]?.total || 0;
    const achievementRate = (achievement / target) * 100;

    // Insert or update branch stats
    await executeQuery(
      `INSERT INTO branch_stats 
       (branch_id, total_members, total_savings, total_active_loans, total_overdue, monthly_achievement, achievement_rate) 
       VALUES (?, ?, ?, ?, ?, ?, ?) 
       ON DUPLICATE KEY UPDATE 
       total_members = VALUES(total_members),
       total_savings = VALUES(total_savings),
       total_active_loans = VALUES(total_active_loans),
       total_overdue = VALUES(total_overdue),
       monthly_achievement = VALUES(monthly_achievement),
       achievement_rate = VALUES(achievement_rate),
       last_updated = CURRENT_TIMESTAMP`,
      [
        branchId,
        memberCount[0].count,
        totalSavings[0].total,
        activeLoans[0].total,
        overdueLoans[0].total,
        achievement,
        achievementRate
      ]
    );

  } catch (error) {
    console.error('Calculate branch stats error:', error);
    throw error;
  }
};

// Get all branches (admin only)
export const getAllBranches = async (req, res) => {
  try {
    const branches = await executeQuery(
      `SELECT b.*, bs.total_members, bs.total_savings, bs.achievement_rate 
       FROM branches b 
       LEFT JOIN branch_stats bs ON b.id = bs.branch_id 
       ORDER BY b.name`
    );

    res.json({
      success: true,
      data: branches.map(branch => ({
        id: branch.id,
        code: branch.code,
        name: branch.name,
        address: branch.address,
        phone: branch.phone,
        email: branch.email,
        managerName: branch.manager_name,
        monthlyTarget: branch.monthly_target,
        totalMembers: branch.total_members || 0,
        totalSavings: branch.total_savings || 0,
        achievementRate: branch.achievement_rate || 0,
        createdAt: branch.created_at
      }))
    });

  } catch (error) {
    console.error('Get all branches error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Create new branch (admin only)
export const createBranch = async (req, res) => {
  try {
    const { code, name, address, phone, email, manager_name, monthly_target } = req.body;

    // Check if branch code already exists
    const existingBranch = await executeQuery(
      'SELECT id FROM branches WHERE code = ?',
      [code]
    );

    if (existingBranch.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Branch code already exists'
      });
    }

    // Create branch
    const result = await executeQuery(
      'INSERT INTO branches (code, name, address, phone, email, manager_name, monthly_target) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [code, name, address, phone, email, manager_name, monthly_target || 0]
    );

    res.status(201).json({
      success: true,
      message: 'Branch created successfully',
      data: {
        id: result.insertId,
        code,
        name,
        address,
        phone,
        email,
        manager_name,
        monthly_target: monthly_target || 0
      }
    });

  } catch (error) {
    console.error('Create branch error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Update branch (admin only)
export const updateBranch = async (req, res) => {
  try {
    const branchId = req.params.id;
    const { name, address, phone, email, manager_name, monthly_target } = req.body;

    // Check if branch exists
    const existingBranch = await executeQuery(
      'SELECT id FROM branches WHERE id = ?',
      [branchId]
    );

    if (existingBranch.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Branch not found'
      });
    }

    // Update branch
    await executeQuery(
      `UPDATE branches 
       SET name = ?, address = ?, phone = ?, email = ?, manager_name = ?, monthly_target = ?, updated_at = CURRENT_TIMESTAMP 
       WHERE id = ?`,
      [name, address, phone, email, manager_name, monthly_target || 0, branchId]
    );

    res.json({
      success: true,
      message: 'Branch updated successfully'
    });

  } catch (error) {
    console.error('Update branch error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Refresh branch statistics
export const refreshBranchStats = async (req, res) => {
  try {
    const branchId = req.user.role === 'admin' ? req.params.branchId : req.user.branch_id;

    if (!branchId) {
      return res.status(400).json({
        success: false,
        message: 'Branch ID is required'
      });
    }

    await calculateBranchStats(branchId);

    res.json({
      success: true,
      message: 'Branch statistics refreshed successfully'
    });

  } catch (error) {
    console.error('Refresh branch stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};