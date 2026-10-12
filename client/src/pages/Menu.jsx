import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import '../styles/global.css';

export const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { token } = useContext(AuthContext);
  const headers = { Authorization: `Bearer ${token}` };

  const categories = [
    { id: 'all', label: 'All Items', icon: '🍽️' },
    { id: 'appetizers', label: 'Appetizers', icon: '🥗' },
    { id: 'mains', label: 'Main Courses', icon: '🍖' },
    { id: 'desserts', label: 'Desserts', icon: '🍰' },
    { id: 'beverages', label: 'Beverages', icon: '🥂' }
  ];

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/menu`, { headers });
        setMenuItems(res.data);
      } catch (err) {
        setError('Failed to load menu');
        console.error('Error fetching menu:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, [token]);

  const filteredItems = selectedCategory === 'all'
    ? menuItems
    : menuItems.filter(item => item.category === selectedCategory);

  const getItemIcon = (category) => {
    const icons = {
      appetizers: '🥗',
      mains: '🍖',
      desserts: '🍰',
      beverages: '🥂'
    };
    return icons[category] || '🍽️';
  };

  if (loading) {
    return <div className="menu-container"><div className="loading">Loading Menu...</div></div>;
  }

  if (error) {
    return <div className="menu-container"><div className="error-message">{error}</div></div>;
  }

  return (
    <div className="menu-container">
      <div className="menu-header">
        <h1>Our Menu</h1>
        <p>Discover our delicious culinary offerings</p>
      </div>

      <div className="category-filter">
        {categories.map(cat => (
          <button
            key={cat.id}
            className={`category-btn ${selectedCategory === cat.id ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat.id)}
          >
            <span className="cat-icon">{cat.icon}</span>
            <span className="cat-label">{cat.label}</span>
          </button>
        ))}
      </div>

      <div className="menu-items">
        {filteredItems.length > 0 ? (
          <div className="items-grid">
            {filteredItems.map(item => (
              <div key={item._id} className="menu-item">
                <div className="item-header">
                  <span className="item-icon">{getItemIcon(item.category)}</span>
                  <h3>{item.name}</h3>
                </div>

                <p className="item-description">{item.description}</p>

                <div className="item-footer">
                  <div className="item-price">${item.price.toFixed(2)}</div>
                  <div className="item-tags">
                    {!item.available && <span className="tag unavailable">Unavailable</span>}
                    {item.vegetarian && <span className="tag vegetarian">🌱 Vegetarian</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-items">
            <p>No items available in this category</p>
          </div>
        )}
      </div>

      <div className="menu-stats">
        <div className="stat">
          <span className="stat-number">{menuItems.length}</span>
          <span className="stat-label">Total Items</span>
        </div>
        <div className="stat">
          <span className="stat-number">{menuItems.filter(i => i.vegetarian).length}</span>
          <span className="stat-label">Vegetarian Options</span>
        </div>
        <div className="stat">
          <span className="stat-number">${(menuItems.reduce((sum, item) => sum + item.price, 0) / menuItems.length).toFixed(2)}</span>
          <span className="stat-label">Average Price</span>
        </div>
      </div>
    </div>
  );
};