import React from 'react';
import { FaUtensils, FaMapMarkerAlt, FaClock } from 'react-icons/fa'; // Import icons
import '../styles/dashboard.css'; // We will add styles here shortly

const RestaurantCard = ({ restaurant }) => {
  return (
    <div className="restaurant-card">
      <div className="image-container">
        <img src={restaurant.image} alt={restaurant.name} />
      </div>
      
      <div className="card-content">
        <h3 className="restaurant-name">{restaurant.name}</h3>
        
        <div className="info-row">
          <span className="info-item">
            <FaUtensils className="icon" /> {restaurant.cuisine}
          </span>
          <span className="info-item">
            <FaMapMarkerAlt className="icon" /> {restaurant.location}
          </span>
        </div>

        <div className="info-row">
          <span className="info-item">
            <FaClock className="icon" /> {restaurant.hours}
          </span>
        </div>

        <p className="address">{restaurant.address}</p>
        
        {/* Booking Button */}
        <button className="book-btn">Book Table</button>
      </div>
    </div>
  );
};

export default RestaurantCard;