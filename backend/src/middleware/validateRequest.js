const { body, validationResult } = require('express-validator');

exports.validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

exports.registerValidation = [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

exports.loginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required')
];

exports.productValidation = [
  body('title').trim().isLength({ min: 3 }).withMessage('Title must be at least 3 characters'),
  body('description').isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('category').notEmpty().withMessage('Category is required'),
  body('stock').isInt({ min: 0 }).withMessage('Stock must be a positive number')
];

exports.orderValidation = [
  body('shippingInfo.fullName').notEmpty().withMessage('Full name is required'),
  body('shippingInfo.phone').notEmpty().withMessage('Phone is required'),
  body('shippingInfo.line1').notEmpty().withMessage('Address is required'),
  body('shippingInfo.city').notEmpty().withMessage('City is required'),
  body('shippingInfo.postalCode').notEmpty().withMessage('Postal code is required'),
  body('shippingInfo.country').notEmpty().withMessage('Country is required')
];
