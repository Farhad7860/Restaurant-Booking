import mongoose from 'mongoose';

const bookingSchema = mongoose.Schema(
    {
        // Example fields for a restaurant booking
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User', // Reference to the User model
        },
        table: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Table', // Reference to the Table model
        },
        date: {
            type: Date,
            required: true,
        },
        time: {
            type: String, // Storing time as a string (e.g., "19:00")
            required: true,
        },
        guests: {
            type: Number,
            required: true,
            min: 1,
        },
        status: {
            type: String,
            required: true,
            default: 'Pending',
            enum: ['Pending', 'Confirmed', 'Cancelled', 'Completed'],
        },
    },
    {
        timestamps: true,
    }
);

// Create the model
const Booking = mongoose.model('Booking', bookingSchema);

// Export the model using default export for cleaner imports
export default Booking;