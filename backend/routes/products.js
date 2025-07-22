import express from 'express';
import { 
  getAllProducts, 
  getProductById, 
  createProduct, 
  updateProduct, 
  deleteProduct,
  getProductSettings,
  updateProductSettings,
  getActiveLoanProducts,
  getLoanProductSettings
} from '../controllers/productController.js';
import { authenticateToken, requireAdmin, requireAnyUser } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Get all active loan products (branch & admin)
router.get('/loans', authenticateToken, requireAnyUser, getActiveLoanProducts);

// Get all products (admin only)
router.get('/', requireAdmin, getAllProducts);

// Get product by ID (admin only)
router.get('/:id', requireAdmin, getProductById);

// Create new product (admin only)
router.post('/', requireAdmin, createProduct);

// Update product (admin only)
router.put('/:id', requireAdmin, updateProduct);

// Delete product (admin only)
router.delete('/:id', requireAdmin, deleteProduct);

// Get product settings (admin only)
router.get('/:productId/settings', requireAdmin, getProductSettings);

// Update product settings (admin only)
router.put('/:productId/settings', requireAdmin, updateProductSettings);

// Get product settings for loans (branch & admin)
router.get('/:productId/settings/loans', authenticateToken, requireAnyUser, getLoanProductSettings);

export default router; 