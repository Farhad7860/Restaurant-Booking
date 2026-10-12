import mongoose from 'mongoose';

const tableSchema = new mongoose.Schema({
  tableNumber: {
    type: Number,
    required: [true, 'Please provide a table number'],
    unique: true,
    min: [1, 'Table number must be at least 1'],
    max: [100, 'Table number cannot exceed 100']
  },
  capacity: {
    type: Number,
    required: [true, 'Please provide table capacity'],
    min: [1, 'Capacity must be at least 1'],
    max: [20, 'Capacity cannot exceed 20']
  },
  status: {
    type: String,
    enum: {
      values: ['available', 'occupied', 'reserved'],
      message: 'Status must be available, occupied, or reserved'
    },
    default: 'available'
  },
  location: {
    type: String,
    enum: {
      values: ['window', 'corner', 'center'],
      message: 'Location must be window, corner, or center'
    },
    default: 'center'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Table', tableSchema);