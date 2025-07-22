import express from 'express';
import { 
  getBranchStats, 
  getAllBranches, 
  createBranch, 
  updateBranch, 
  refreshBranchStats,
  getBranchMembers,
  createBranchMember,
  updateBranchMember,
  deleteBranchMember
} from '../controllers/branchController.js';
import { authenticateToken, requireAdmin, checkBranchAccess } from '../middleware/auth.js';
import { validateBranch } from '../middleware/validation.js';
import { uploadMemberFiles } from '../middleware/upload.js';

const router = express.Router();

// Get branch dashboard stats (branch users get their own, admin can specify)
router.get('/stats/:branchId?', authenticateToken, getBranchStats);

// Refresh branch statistics
router.post('/stats/refresh/:branchId?', authenticateToken, refreshBranchStats);

// Admin only routes
router.get('/', authenticateToken, requireAdmin, getAllBranches);
router.post('/', authenticateToken, requireAdmin, validateBranch, createBranch);
router.put('/:id', authenticateToken, requireAdmin, updateBranch);

// Branch members routes (branch users can access their own branch)
router.get('/:branchId/members', authenticateToken, getBranchMembers);
router.post('/:branchId/members', (req, res, next) => {
  console.log('DEBUG: POST /:branchId/members route hit', req.params.branchId);
  next();
}, authenticateToken, uploadMemberFiles, createBranchMember);
router.put('/:branchId/members/:memberId', authenticateToken, uploadMemberFiles, updateBranchMember);
router.delete('/:branchId/members/:memberId', authenticateToken, deleteBranchMember);

export default router;