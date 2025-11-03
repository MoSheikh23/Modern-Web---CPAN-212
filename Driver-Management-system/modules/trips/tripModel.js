const { Schema, model, Types } = require('mongoose');

const TripSchema = new Schema(
  {
    driver: {
      type: Types.ObjectId,
      ref: 'Driver',
      required: [true, 'Driver reference is required']
    },
    vehicle: {
      type: Types.ObjectId,
      ref: 'Vehicle',
      required: [true, 'Vehicle reference is required']
    },
    origin: {
      type: String,
      required: [true, 'Origin is required'],
      trim: true
    },
    destination: {
      type: String,
      required: [true, 'Destination is required'],
      trim: true
    },
    startTime: {
      type: Date,
      required: [true, 'Trip start time is required']
    },
    endTime: {
      type: Date,
      validate: {
        validator: function (value) {
          return !value || value >= this.startTime;
        },
        message: 'End time must be after start time'
      }
    },
    status: {
      type: String,
      enum: ['scheduled', 'in_progress', 'completed', 'canceled'],
      default: 'scheduled'
    },
    fare: {
      type: Number,
      min: [0, 'Fare cannot be negative'],
      default: 0
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [200, 'Notes cannot exceed 200 characters']
    }
  },
  { timestamps: true }
);

TripSchema.index({ origin: 'text', destination: 'text' });

module.exports = model('Trip', TripSchema);
