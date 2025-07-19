import { body, validationResult } from 'express-validator';

// Handle validation errors
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: errors.array()
    });
  }
  next();
};

// Login validation
export const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  handleValidationErrors
];

// Member creation validation
export const validateMember = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 255 })
    .withMessage('Name must be between 2 and 255 characters'),
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required'),
  body('phone')
    .optional()
    .isMobilePhone('id-ID')
    .withMessage('Valid Indonesian phone number is required'),
  body('address')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Address must not exceed 500 characters'),
  body('id_number')
    .trim()
    .isLength({ min: 16, max: 16 })
    .isNumeric()
    .withMessage('ID number must be exactly 16 digits'),
  body('branch_id')
    .isInt({ min: 1 })
    .withMessage('Valid branch ID is required'),
  handleValidationErrors
];

// Savings transaction validation
export const validateSavings = [
  body('member_id')
    .isInt({ min: 1 })
    .withMessage('Valid member ID is required'),
  body('branch_id')
    .isInt({ min: 1 })
    .withMessage('Valid branch ID is required'),
  body('savings_type')
    .isIn(['mandatory', 'voluntary', 'special'])
    .withMessage('Savings type must be mandatory, voluntary, or special'),
  body('amount')
    .isFloat({ min: 1000 })
    .withMessage('Amount must be at least 1000'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must not exceed 500 characters'),
  handleValidationErrors
];

// Loan application validation
export const validateLoan = [
  body('member_id')
    .isInt({ min: 1 })
    .withMessage('Valid member ID is required'),
  body('branch_id')
    .isInt({ min: 1 })
    .withMessage('Valid branch ID is required'),
  body('amount')
    .isFloat({ min: 100000 })
    .withMessage('Loan amount must be at least 100,000'),
  body('interest_rate')
    .isFloat({ min: 0.1, max: 50 })
    .withMessage('Interest rate must be between 0.1% and 50%'),
  body('term_months')
    .isInt({ min: 1, max: 60 })
    .withMessage('Term must be between 1 and 60 months'),
  body('purpose')
    .trim()
    .isLength({ min: 5, max: 500 })
    .withMessage('Purpose must be between 5 and 500 characters'),
  handleValidationErrors
];

// User creation validation
export const validateUser = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('name')
    .trim()
    .isLength({ min: 2, max: 255 })
    .withMessage('Name must be between 2 and 255 characters'),
  body('role')
    .isIn(['admin', 'branch'])
    .withMessage('Role must be admin or branch'),
  body('branch_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Valid branch ID is required for branch users'),
  handleValidationErrors
];

// Branch creation validation
export const validateBranch = [
  body('code')
    .trim()
    .isLength({ min: 3, max: 10 })
    .withMessage('Branch code must be between 3 and 10 characters'),
  body('name')
    .trim()
    .isLength({ min: 5, max: 255 })
    .withMessage('Branch name must be between 5 and 255 characters'),
  body('address')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Address must not exceed 500 characters'),
  body('phone')
    .optional()
    .isMobilePhone('id-ID')
    .withMessage('Valid Indonesian phone number is required'),
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required'),
  body('manager_name')
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage('Manager name must not exceed 255 characters'),
  body('monthly_target')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Monthly target must be a positive number'),
  handleValidationErrors
];