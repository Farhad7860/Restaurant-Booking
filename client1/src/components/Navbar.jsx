import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/navbar.css';

export const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">🍽️ RestaurantBook</Link>
        <div className="navbar-menu">
          {user ? (
            <>
              <span className="user-greeting">Welcome, {user.name}</span>
              <Link to="/dashboard" className="nav-link">Dashboard</Link>
              <Link to="/bookings" className="nav-link">My Bookings</Link>
              <Link to="/menu" className="nav-link">Menu</Link>
              <button onClick={handleLogout} className="logout-btn">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/signup" className="nav-link">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};