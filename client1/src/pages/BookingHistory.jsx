import React, { useState, useEffect } from 'react';
import { Calendar, Users, MapPin, Clock, ChevronDown, Trash2 } from 'lucide-react';

export default function BookingHistory() {
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState('all'); // all, completed, cancelled
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    // Replace this with your actual API call
    fetchBookingHistory();
  }, []);

  const fetchBookingHistory = async () => {
    try {
      // const response = await fetch('/api/bookings/history');
      // const data = await response.json();
      // setBookings(data);
      
      // Sample data - remove this when connecting to real API
      setBookings([
        {
          id: 1,
          restaurantName: 'The Italian Corner',
          date: '2024-12-20',
          time: '19:30',
          guests: 4,
          status: 'completed',
          bookingRef: 'BK-001',
          cuisine: 'Italian',
        },
        {
          id: 2,
          restaurantName: 'Sakura Sushi',
          date: '2024-12-15',
          time: '18:00',
          guests: 2,
          status: 'completed',
          bookingRef: 'BK-002',
          cuisine: 'Japanese',
        },
        {
          id: 3,
          restaurantName: 'Le Petit Bistro',
          date: '2024-12-10',
          time: '20:00',
          guests: 6,
          status: 'cancelled',
          bookingRef: 'BK-003',
          cuisine: 'French',
        },
      ]);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setLoading(false);
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    if (filter === 'all') return true;
    return booking.status === filter;
  });

  const handleCancelBooking = (id) => {
    // Implement cancel booking logic
    setBookings(bookings.map((b) =>
      b.id === id ? { ...b, status: 'cancelled' } : b
    ));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (loading) {
    return <div className="p-6 text-center">Loading booking history...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Booking History</h1>

        {/* Filter Buttons */}
        <div className="flex gap-4 mb-6">
          {['all', 'completed', 'cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:border-gray-400'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {/* Bookings List */}
        <div className="space-y-4">
          {filteredBookings.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg">No {filter !== 'all' ? filter : ''} bookings found</p>
            </div>
          ) : (
            filteredBookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Header */}
                <div className="p-4">
                  <div className="flex items-start justify-between cursor-pointer"
                    onClick={() => setExpandedId(expandedId === booking.id ? null : booking.id)}>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {booking.restaurantName}
                      </h3>
                      <p className="text-sm text-gray-500">{booking.cuisine}</p>
                    </div>
                    <div className="text-right">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                          booking.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                      <ChevronDown
                        size={20}
                        className={`inline ml-3 transition-transform ${
                          expandedId === booking.id ? 'rotate-180' : ''
                        }`}
                      />
                    </div>
                  </div>

                  {/* Quick Info */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    <div className="flex items-center gap-2 text-gray-700">
                      <Calendar size={16} className="text-blue-600" />
                      <span className="text-sm">{formatDate(booking.date)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <Clock size={16} className="text-blue-600" />
                      <span className="text-sm">{booking.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <Users size={16} className="text-blue-600" />
                      <span className="text-sm">{booking.guests} guests</span>
                    </div>
                    <div className="text-sm text-gray-500">Ref: {booking.bookingRef}</div>
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedId === booking.id && (
                  <div className="border-t border-gray-200 bg-gray-50 p-4">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Booking Details</h4>
                        <p className="text-sm text-gray-600">
                          <strong>Booking Reference:</strong> {booking.bookingRef}
                        </p>
                        <p className="text-sm text-gray-600">
                          <strong>Date:</strong> {formatDate(booking.date)} at {booking.time}
                        </p>
                        <p className="text-sm text-gray-600">
                          <strong>Party Size:</strong> {booking.guests} guests
                        </p>
                      </div>
                      <div className="flex gap-3">
                        {booking.status === 'completed' && (
                          <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                            Rebook
                          </button>
                        )}
                        <button
                          onClick={() => handleCancelBooking(booking.id)}
                          disabled={booking.status === 'cancelled'}
                          className="flex-1 px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          <Trash2 size={16} />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}