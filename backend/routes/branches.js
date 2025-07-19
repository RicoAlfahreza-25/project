import express from 'express';
import { 
  getBranchStats, 
  getAllBranches, 
  createBranch, 
  updateBranch, 
  refreshBranchStats 
} from '../controllers/branchController.js';
import { authenticateToken, requireAdmin, checkBranchAccess } from '../middleware/auth.js';
import { validateBranch } from '../middleware/validation.js';

const router = express.Router();

// Get branch dashboard stats (branch users get their own, admin can specify)
router.get('/stats/:branchId?', authenticateToken, getBranchStats);

// Refresh branch statistics
router.post('/stats/refresh/:branchId?', authenticateToken, refreshBranchStats);

// Admin only routes
router.get('/', authenticateToken, requireAdmin, getAllBranches);
router.post('/', authenticateToken, requireAdmin, validateBranch, createBranch);
router.put('/:id', authenticateToken, requireAdmin, updateBranch);

export default router;