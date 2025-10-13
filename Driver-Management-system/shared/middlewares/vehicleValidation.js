const { body } = require("express-validator");

const validateVehicle = [
  body('make').notEmpty().withMessage('Make is required'),
  body('model').notEmpty().withMessage('Model is required'),
  body('year').isInt({ min: 1900 }).withMessage('Valid year is required'),
  body('licensePlate').notEmpty().withMessage('License plate is required')
];

module.exports = { validateVehicle };