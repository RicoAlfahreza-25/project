import { executeQuery } from '../config/database.js';

// Get all products
export const getAllProducts = async (req, res) => {
  try {
    const products = await executeQuery(
      `SELECT p.*, u.name as created_by_name 
       FROM products p 
       LEFT JOIN users u ON p.created_by = u.id 
       ORDER BY p.created_at DESC`
    );

    res.json({
      success: true,
      data: products
    });

  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get product by ID
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const products = await executeQuery(
      `SELECT p.*, u.name as created_by_name 
       FROM products p 
       LEFT JOIN users u ON p.created_by = u.id 
       WHERE p.id = ?`,
      [id]
    );

    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Get product settings
    const settings = await executeQuery(
      'SELECT * FROM product_settings WHERE product_id = ?',
      [id]
    );

    const product = products[0];
    product.settings = settings[0] || null;

    res.json({
      success: true,
      data: product
    });

  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Create new product
export const createProduct = async (req, res) => {
  try {
    const { code, name, category, description, status } = req.body;
    const createdBy = req.user.id;

    // Check if product code already exists
    const existingProducts = await executeQuery(
      'SELECT id FROM products WHERE code = ?',
      [code]
    );

    if (existingProducts.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Product code already exists'
      });
    }

    // Create product
    const result = await executeQuery(
      'INSERT INTO products (code, name, category, description, status, created_by) VALUES (?, ?, ?, ?, ?, ?)',
      [code, name, category, description, status, createdBy]
    );

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: {
        id: result.insertId,
        code,
        name,
        category,
        description,
        status
      }
    });

  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Update product
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { code, name, category, description, status } = req.body;

    // Check if product exists
    const existingProducts = await executeQuery(
      'SELECT id FROM products WHERE id = ?',
      [id]
    );

    if (existingProducts.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if code already exists (excluding current product)
    if (code) {
      const duplicateCode = await executeQuery(
        'SELECT id FROM products WHERE code = ? AND id != ?',
        [code, id]
      );

      if (duplicateCode.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Product code already exists'
        });
      }
    }

    // Update product
    await executeQuery(
      'UPDATE products SET code = ?, name = ?, category = ?, description = ?, status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [code, name, category, description, status, id]
    );

    res.json({
      success: true,
      message: 'Product updated successfully'
    });

  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Delete product
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if product exists
    const existingProducts = await executeQuery(
      'SELECT id FROM products WHERE id = ?',
      [id]
    );

    if (existingProducts.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Delete product (will cascade to product_settings)
    await executeQuery('DELETE FROM products WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });

  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get product settings
export const getProductSettings = async (req, res) => {
  try {
    const { productId } = req.params;

    const settings = await executeQuery(
      'SELECT * FROM product_settings WHERE product_id = ?',
      [productId]
    );

    if (settings.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product settings not found'
      });
    }

    res.json({
      success: true,
      data: settings[0]
    });

  } catch (error) {
    console.error('Get product settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Update product settings
export const updateProductSettings = async (req, res) => {
  try {
    const { productId } = req.params;
    const {
      max_age,
      max_limit,
      max_term_months,
      interest_rate,
      mandatory_saving,
      principal_saving_percentage,
      admin_office_percentage,
      admin_center_percentage,
      marketing_fee_percentage,
      crk_insurance,
      flagging_fees
    } = req.body;

    // Check if product exists
    const existingProducts = await executeQuery(
      'SELECT id FROM products WHERE id = ?',
      [productId]
    );

    if (existingProducts.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if settings exist
    const existingSettings = await executeQuery(
      'SELECT id FROM product_settings WHERE product_id = ?',
      [productId]
    );

    if (existingSettings.length > 0) {
      // Update existing settings
      await executeQuery(
        `UPDATE product_settings SET 
         max_age = ?, max_limit = ?, max_term_months = ?, interest_rate = ?,
         mandatory_saving = ?, principal_saving_percentage = ?, admin_office_percentage = ?,
         admin_center_percentage = ?, marketing_fee_percentage = ?, crk_insurance = ?,
         flagging_fees = ?, updated_at = CURRENT_TIMESTAMP 
         WHERE product_id = ?`,
        [
          max_age, max_limit, max_term_months, interest_rate,
          mandatory_saving, principal_saving_percentage, admin_office_percentage,
          admin_center_percentage, marketing_fee_percentage,
          JSON.stringify(crk_insurance), JSON.stringify(flagging_fees), productId
        ]
      );
    } else {
      // Create new settings
      await executeQuery(
        `INSERT INTO product_settings 
         (product_id, max_age, max_limit, max_term_months, interest_rate,
          mandatory_saving, principal_saving_percentage, admin_office_percentage,
          admin_center_percentage, marketing_fee_percentage, crk_insurance, flagging_fees)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          productId, max_age, max_limit, max_term_months, interest_rate,
          mandatory_saving, principal_saving_percentage, admin_office_percentage,
          admin_center_percentage, marketing_fee_percentage,
          JSON.stringify(crk_insurance), JSON.stringify(flagging_fees)
        ]
      );
    }

    res.json({
      success: true,
      message: 'Product settings updated successfully'
    });

  } catch (error) {
    console.error('Update product settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}; 