import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import '../styles/dashboard.css';

export const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [tables, setTables] = useState([]);
  const { token } = useContext(AuthContext);
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsRes = await axios.get(`${import.meta.env.VITE_API_URL}/tables/stats`, { headers });
        const tablesRes = await axios.get(`${import.meta.env.VITE_API_URL}/tables`, { headers });
        setStats(statsRes.data);
        setTables(tablesRes.data);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };
    fetchData();
  }, [token]);

  if (!stats) return <div className="loading">Loading...</div>;

  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>
      <div className="stats-grid">
        <div className="stat-card total">
          <div className="stat-number">{stats.total}</div>
          <div className="stat-label">Total Tables</div>
        </div>
        <div className="stat-card available">
          <div className="stat-number">{stats.available}</div>
          <div className="stat-label">Available</div>
        </div>
        <div className="stat-card occupied">
          <div className="stat-number">{stats.occupied}</div>
          <div className="stat-label">Occupied</div>
        </div>
        <div className="stat-card reserved">
          <div className="stat-number">{stats.reserved}</div>
          <div className="stat-label">Reserved</div>
        </div>
      </div>

      <div className="tables-section">
        <h2>Available Tables</h2>
        <div className="tables-grid">
          {tables.map(table => (
            <div key={table._id} className={`table-card status-${table.status}`}>
              <div className="table-number">Table {table.tableNumber}</div>
              <div className="table-capacity">👥 {table.capacity} seats</div>
              <div className="table-status">{table.status}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};