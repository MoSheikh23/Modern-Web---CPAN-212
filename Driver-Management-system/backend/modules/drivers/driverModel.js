const { Schema, model } = require('mongoose');

const DriverSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Driver name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [50, 'Name cannot exceed 50 characters']
    },
    licenseNumber: {
      type: String,
      required: [true, 'License number is required'],
      unique: true,
      uppercase: true,
      match: [/^[A-Z0-9-]+$/, 'License number must contain only letters, numbers, and hyphens']
    },
    phone: {
      type: String,
      trim: true,
      match: [/^[0-9+\-\s()]*$/, 'Phone number contains invalid characters']
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'suspended'],
      default: 'active'
    }
  },
  { timestamps: true }
);

DriverSchema.index({ name: 'text', licenseNumber: 'text' });

module.exports = model('Driver', DriverSchema);
