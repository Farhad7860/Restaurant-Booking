import Booking from '../models/Booking.js';
import Table from '../models/Table.js';

export const createBooking = async (req, res) => {
  try {
    const { tableId, bookingDate, guestCount, specialRequests } = req.body;
    
    // Validation
    if (!tableId || !bookingDate || !guestCount) {
      return res.status(400).json({ 
        message: 'Please provide tableId, bookingDate, and guestCount' 
      });
    }
    
    // Check if table exists
    const table = await Table.findById(tableId);
    if (!table) {
      return res.status(404).json({ message: 'Table not found' });
    }
    
    // Check table capacity
    if (table.capacity < guestCount) {
      return res.status(400).json({ 
        message: `Table capacity is ${table.capacity}, but ${guestCount} guests requested` 
      });
    }
    
    // Check if booking date is in future
    const bookingDateTime = new Date(bookingDate);
    if (bookingDateTime < new Date()) {
      return res.status(400).json({ 
        message: 'Booking date must be in the future' 
      });
    }

    const time = bookingDateTime.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
    
    // Create booking
    const booking = new Booking({
      user: req.user.id,
      table: tableId,
      date: bookingDate,
      time: time,
      guests: guestCount,
      specialRequests: specialRequests || ''
    });
    
    await booking.save();
    console.log(booking)
    await booking.populate('user table');

    // Update table status to reserved
    await Table.findByIdAndUpdate(tableId, { status: 'reserved' });

    res.status(201).json({
      message: '✅ Booking created successfully',
      booking
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate('table')
      .sort({ createdAt: -1 });

    if (bookings.length === 0) {
      return res.status(200).json([]);
    }

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('user')
      .populate('table')
      .sort({ bookingDate: -1 });

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user is owner of booking
    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized to cancel this booking' });
    }

    // Check if booking is already cancelled
    if (booking.status === 'cancelled') {
      return res.status(400).json({ message: 'Booking is already cancelled' });
    }

    // Update booking status
    booking.status = 'cancelled';
    await booking.save();

    // Update table status back to available
    await Table.findByIdAndUpdate(booking.table, { status: 'available' });

    res.status(200).json({
      message: '✅ Booking cancelled successfully',
      booking
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    const validStatuses = ['confirmed', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        message: `Invalid status. Valid statuses are: ${validStatuses.join(', ')}` 
      });
    }

    const booking = await Booking.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    ).populate('table');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.status(200).json({
      message: 'Booking status updated',
      booking
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};