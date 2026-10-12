import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/dashboard.css';

export const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  
const apiUrl = 'http://localhost:5000/api';
  
  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Reach here')
        if (!token) {
          console.log('No token available');
          setError('Please login first');
          setLoading(false);
          return;
        }

        setLoading(true);
        setError('');
        
        console.log('API URL:', apiUrl);
        console.log('Fetching from:', `${apiUrl}/tables/stats`);

        const [statsRes, tablesRes] = await Promise.all([
          axios.get(`${apiUrl}/tables/stats`, { headers }),
          axios.get(`${apiUrl}/tables`, { headers })
        ]);

        console.log('Hiiiii')
        console.log('Stats received:', statsRes.data);
        console.log('Tables received:', tablesRes.data);

        setStats(statsRes.data);
        setTables(Array.isArray(tablesRes.data) ? tablesRes.data : []);
        
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.response?.data?.message || err.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, apiUrl]);

  const getStatusClass = (status) => {
    return `stat-card ${status}`;
  };

  const getTableStatusColor = (status) => {
    switch(status) {
      case 'available':
        return 'status-available';
      case 'occupied':
        return 'status-occupied';
      case 'reserved':
        return 'status-reserved';
      default:
        return 'status-available';
    }
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>🍽️ Restaurant Dashboard</h1>
        <p>Real-time table management and booking system</p>
      </div>

      {error && (
        <div className="error-message">
          <span>⚠️</span> {error}
        </div>
      )}

      {/* Restaurant Info Cards */}
      <div className="restaurant-info">
        <div className="info-card">
          <h3>🏪 Restaurant</h3>
          <p>Fine Dining Restaurant</p>
        </div>
        <div className="info-card">
          <h3>📍 Location</h3>
          <p>123 Main Street, Downtown</p>
        </div>
        <div className="info-card">
          <h3>⏰ Hours</h3>
          <p>11:00 AM - 10:00 PM</p>
        </div>
        <div className="info-card">
          <h3>📞 Contact</h3>
          <p>+1 (555) 123-4567</p>
        </div>
      </div>

      {/* Statistics Grid */}
      {stats && (
        <div className="stats-grid">
          <div className={getStatusClass('total')}>
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <div className="stat-number">{stats.total}</div>
              <div className="stat-label">Total Tables</div>
            </div>
          </div>

          <div className={getStatusClass('available')}>
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <div className="stat-number">{stats.available}</div>
              <div className="stat-label">Available</div>
            </div>
          </div>

          <div className={getStatusClass('occupied')}>
            <div className="stat-icon">👥</div>
            <div className="stat-content">
              <div className="stat-number">{stats.occupied}</div>
              <div className="stat-label">Occupied</div>
            </div>
          </div>

          <div className={getStatusClass('reserved')}>
            <div className="stat-icon">📅</div>
            <div className="stat-content">
              <div className="stat-number">{stats.reserved}</div>
              <div className="stat-label">Reserved</div>
            </div>
          </div>
        </div>
      )}

      {/* Tables Section */}
      <div className="dashboard-content">
        <div className="tables-section">
          <div className="section-header">
            <h2>📋 All Tables Status</h2>
            <button 
              onClick={() => navigate('/booking')} 
              className="action-btn"
            >
              📅 Book a Table
            </button>
          </div>

          {tables.length > 0 ? (
            <div className="tables-grid1">
              {tables.map((table) => (
                <div 
                  key={table._id} 
                  className={`table-card ${getTableStatusColor(table.status)}`}
                >
                  <div className="table-header">
                    <div className="table-number">Table {table.tableNumber}</div>
                    <span className={`status-badge ${table.status}`}>
                      {table.status.charAt(0).toUpperCase() + table.status.slice(1)}
                    </span>
                  </div>
                  
                  <div className="table-details">
                    <div className="detail">
                      <span className="detail-icon">👥</span>
                      <span>{table.capacity} seats</span>
                    </div>
                    <div className="detail">
                      <span className="detail-icon">📍</span>
                      <span>{table.location.charAt(0).toUpperCase() + table.location.slice(1)}</span>
                    </div>
                  </div>

                  {table.status === 'available' && (
                    <button 
                      onClick={() => navigate('/booking')}
                      className="book-btn"
                    >
                      Book This Table
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="no-tables">
              <p>No tables available</p>
            </div>
          )}
        </div>
      </div>

      {/* Welcome Section */}
      <div className="welcome-section">
        <h2>Welcome to Our Restaurant! 👋</h2>
        <div className="welcome-content">
          <div className="welcome-card">
            <div className="welcome-icon">📅</div>
            <h3>Easy Booking</h3>
            <p>Reserve your table in just a few clicks</p>
          </div>
          <div className="welcome-card">
            <div className="welcome-icon">🍲</div>
            <h3>Amazing Food</h3>
            <p>Experience culinary excellence with our menu</p>
          </div>
          <div className="welcome-card">
            <div className="welcome-icon">⭐</div>
            <h3>Premium Service</h3>
            <p>Top-notch service and hospitality guaranteed</p>
          </div>
        </div>
      </div>
    </div>
  );
};