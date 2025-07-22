import express from 'express';
import { 
  getAllProducts, 
  getProductById, 
  createProduct, 
  updateProduct, 
  deleteProduct,
  getProductSettings,
  updateProductSettings
} from '../controllers/productController.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

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

export default router; 