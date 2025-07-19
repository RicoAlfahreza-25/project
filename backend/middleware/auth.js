import jwt from 'jsonwebtoken';
import { executeQuery } from '../config/database.js';

// Verify JWT token
export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token required'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user details from database
    const user = await executeQuery(
      `SELECT u.*, b.code as branch_code, b.name as branch_name 
       FROM users u 
       LEFT JOIN branches b ON u.branch_id = b.id 
       WHERE u.id = ? AND u.is_active = TRUE`,
      [decoded.userId]
    );

    if (!user || user.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token - user not found'
      });
    }

    req.user = user[0];
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    } else if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Authentication error'
    });
  }
};

// Check if user has admin role
export const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Admin access required'
    });
  }
  next();
};

// Check if user has branch role
export const requireBranch = (req, res, next) => {
  if (req.user.role !== 'branch') {
    return res.status(403).json({
      success: false,
      message: 'Branch access required'
    });
  }
  next();
};

// Check if user can access specific branch data
export const checkBranchAccess = (req, res, next) => {
  const branchId = req.params.branchId || req.body.branch_id;
  
  // Admin can access all branches
  if (req.user.role === 'admin') {
    return next();
  }

  // Branch user can only access their own branch
  if (req.user.role === 'branch' && req.user.branch_id == branchId) {
    return next();
  }

  return res.status(403).json({
    success: false,
    message: 'Access denied - insufficient permissions for this branch'
  });
};