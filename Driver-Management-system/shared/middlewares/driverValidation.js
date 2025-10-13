const { body } = require("express-validator");

const validateDriver = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('phone').notEmpty().withMessage('Phone is required'),
  body('licenseNumber').notEmpty().withMessage('License number is required')
];

module.exports = { validateDriver };