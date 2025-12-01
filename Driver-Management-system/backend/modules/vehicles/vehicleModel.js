const { Schema, model } = require('mongoose');

const VehicleSchema = new Schema(
  {
    plate: {
      type: String,
      required: [true, 'Vehicle plate is required'],
      unique: true,
      uppercase: true,
      trim: true,
      match: [/^[A-Z0-9-]+$/, 'Plate must contain only letters, numbers, and hyphens']
    },
    make: {
      type: String,
      required: [true, 'Vehicle make is required'],
      trim: true
    },
    model: {
      type: String,
      required: [true, 'Vehicle model is required'],
      trim: true
    },
    year: {
      type: Number,
      min: [1950, 'Year must be after 1950'],
      max: [new Date().getFullYear() + 1, 'Year is too far in the future']
    },
    capacity: {
      type: Number,
      default: 4,
      min: [1, 'Vehicle must have at least 1 seat'],
      max: [100, 'Vehicle capacity seems unrealistic']
    },
    status: {
      type: String,
      enum: ['available', 'maintenance', 'retired'],
      default: 'available'
    }
  },
  { timestamps: true }
);

VehicleSchema.index({ plate: 'text', make: 'text', model: 'text' });

module.exports = model('Vehicle', VehicleSchema);
