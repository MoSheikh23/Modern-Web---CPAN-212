const { body } = require("express-validator");

const validateTrip = [
  body('driverId').isInt({ min: 1 }).withMessage('Valid driver ID is required'),
  body('vehicleId').isInt({ min: 1 }).withMessage('Valid vehicle ID is required'),
  body('startLocation').notEmpty().withMessage('Start location is required'),
  body('endLocation').notEmpty().withMessage('End location is required')
];

module.exports = { validateTrip };