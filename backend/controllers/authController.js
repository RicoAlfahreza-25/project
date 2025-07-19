import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { executeQuery } from '../config/database.js';

// Login user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user with branch information
    const users = await executeQuery(
      `SELECT u.*, b.code as branch_code, b.name as branch_name 
       FROM users u 
       LEFT JOIN branches b ON u.branch_id = b.id 
       WHERE u.email = ? AND u.is_active = TRUE`,
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const user = users[0];

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Update last login
    await executeQuery(
      'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?',
      [user.id]
    );

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    // Prepare user data (exclude password)
    const userData = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      branchId: user.branch_id,
      branchCode: user.branch_code,
      branchName: user.branch_name
    };

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: userData,
        token
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get current user profile
export const getProfile = async (req, res) => {
  try {
    const user = req.user;

    // Prepare user data (exclude password)
    const userData = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      branchId: user.branch_id,
      branchCode: user.branch_code,
      branchName: user.branch_name,
      lastLogin: user.last_login,
      createdAt: user.created_at
    };

    res.json({
      success: true,
      data: userData
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Change password
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    // Get current user
    const users = await executeQuery(
      'SELECT password FROM users WHERE id = ?',
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, users[0].password);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Hash new password
    const saltRounds = 10;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    await executeQuery(
      'UPDATE users SET password = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [hashedNewPassword, userId]
    );

    res.json({
      success: true,
      message: 'Password changed successfully'
    });

  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Create new user (admin only)
export const createUser = async (req, res) => {
  try {
    const { email, password, name, role, branch_id } = req.body;

    // Check if email already exists
    const existingUsers = await executeQuery(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Email already exists'
      });
    }

    // Validate branch_id for branch users
    if (role === 'branch') {
      if (!branch_id) {
        return res.status(400).json({
          success: false,
          message: 'Branch ID is required for branch users'
        });
      }

      // Check if branch exists
      const branches = await executeQuery(
        'SELECT id FROM branches WHERE id = ?',
        [branch_id]
      );

      if (branches.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Branch not found'
        });
      }
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const result = await executeQuery(
      'INSERT INTO users (email, password, name, role, branch_id) VALUES (?, ?, ?, ?, ?)',
      [email, hashedPassword, name, role, role === 'branch' ? branch_id : null]
    );

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: {
        id: result.insertId,
        email,
        name,
        role,
        branch_id: role === 'branch' ? branch_id : null
      }
    });

  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};