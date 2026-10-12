import express from 'express';
import { 
  createBooking, 
  getUserBookings, 
  cancelBooking,
  getAllBookings,
  updateBookingStatus
} from '../controllers/bookingController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Create a new booking (requires authentication)
router.post('/', authenticate, createBooking);

// Get all user bookings (requires authentication)
router.get('/', authenticate, getUserBookings);

// Get all bookings (admin only - requires authentication)
router.get('/admin/all', authenticate, getAllBookings);

// Cancel a booking (requires authentication)
router.delete('/:id', authenticate, cancelBooking);

// Update booking status (requires authentication)
router.put('/:id', authenticate, updateBookingStatus);

export default router;