import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/booking.css';

export const TableBooking = () => {
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [formData, setFormData] = useState({
    guestCount: 2,
    bookingDate: '',
    specialRequests: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    const fetchTables = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/tables`, { headers });
        setTables(res.data.filter(t => t.status === 'available'));
      } catch (err) {
        setError('Failed to load available tables');
        console.error('Error fetching tables:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTables();
  }, [token]);

  const handleTableSelect = (table) => {
    setSelectedTable(table);
    setError('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'guestCount' ? parseInt(value) : value
    }));
    setError('');
  };

  const validateForm = () => {
    if (!selectedTable) {
      setError('Please select a table');
      return false;
    }
    if (formData.guestCount > selectedTable.capacity) {
      setError(`Selected table can only accommodate ${selectedTable.capacity} guests`);
      return false;
    }
    if (!formData.bookingDate) {
      setError('Please select a booking date and time');
      return false;
    }
    const selectedDate = new Date(formData.bookingDate);
    if (selectedDate < new Date()) {
      setError('Booking date must be in the future');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setSubmitting(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/bookings`,
        {
          tableId: selectedTable._id,
          ...formData
        },
        { headers }
      );
      setSuccess('✅ Booking created successfully!');
      setTimeout(() => navigate('/bookings'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="booking-container"><div className="loading">Loading available tables...</div></div>;
  }

  return (
    <div className="booking-container">
      <div className="booking-header">
        <h1>Book a Table</h1>
        <p>Reserve your table at our restaurant</p>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <div className="booking-content">
        <div className="tables-section">
          <h2>Available Tables</h2>
          {tables.length > 0 ? (
            <div className="tables-grid">
              {tables.map(table => (
                <div
                  key={table._id}
                  className={`table-option ${selectedTable?._id === table._id ? 'selected' : ''}`}
                  onClick={() => handleTableSelect(table)}
                >
                  <div className="table-number">Table {table.tableNumber}</div>
                  <div className="table-info">
                    <div>👥 {table.capacity} seats</div>
                    <div>📍 {table.location}</div>
                  </div>
                  {selectedTable?._id === table._id && <div className="checkmark">✓</div>}
                </div>
              ))}
            </div>
          ) : (
            <div className="no-tables">No tables available at the moment</div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="booking-form">
          <h2>Booking Details</h2>

          {selectedTable && (
            <div className="selected-table-info">
              <p>📅 Selected: <strong>Table {selectedTable.tableNumber}</strong></p>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="guestCount">Number of Guests</label>
            <input
              type="number"
              id="guestCount"
              name="guestCount"
              min="1"
              max="10"
              value={formData.guestCount}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="bookingDate">Booking Date & Time</label>
            <input
              type="datetime-local"
              id="bookingDate"
              name="bookingDate"
              value={formData.bookingDate}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="specialRequests">Special Requests (Optional)</label>
            <textarea
              id="specialRequests"
              name="specialRequests"
              placeholder="Any special requirements or preferences?"
              rows="4"
              value={formData.specialRequests}
              onChange={handleInputChange}
            />
          </div>

          <button type="submit" className="submit-btn" disabled={submitting || !selectedTable}>
            {submitting ? 'Booking...' : 'Confirm Booking'}
          </button>
        </form>
      </div>
    </div>
  );
};