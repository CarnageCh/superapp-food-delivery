import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import './FoodPage.css';



function StarRating({ rating }) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) {
      stars.push(<FaStar key={i} color="#fbb03b" />);
    } else if (rating >= i - 0.5) {
      stars.push(<FaStarHalfAlt key={i} color="#fbb03b" />);
    } else {
      stars.push(<FaRegStar key={i} color="#fbb03b" />);
    }
  }
  return <div className="food-rating">{stars}</div>;
}

function FoodPage() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Demo data for visual; replace with fetch for real API
    setTimeout(() => {
      setRestaurants([
        {
          id: 'burger-joint',
          name: 'Burger Joint',
          description: 'Best burgers in town with fresh ingredients and secret sauce.',
          rating: 4.7,
          promo: '10% OFF',
          image: 'https://source.unsplash.com/56x56/?burger-restaurant',
        },
        {
          id: 'pizza-palace',
          name: 'Pizza Palace',
          description: 'Authentic Italian pizza with a variety of toppings.',
          rating: 4.5,
          promo: 'Free Delivery',
          image: 'https://source.unsplash.com/56x56/?pizza-restaurant',
        },
        {
          id: 'sushi-world',
          name: 'Sushi World',
          description: 'Fresh and delicious sushi prepared by expert chefs.',
          rating: 4.9,
          promo: null,
          image: 'https://source.unsplash.com/56x56/?sushi-restaurant',
        },
      ]);
      setLoading(false);
    }, 500);
    // Uncomment below for real API:
    /*
    const fetchRestaurants = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          alert('You must be logged in to view restaurants.');
          setLoading(false);
          return;
        }
        const res = await fetch('http://localhost:3000/api/restaurants', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          const data = await res.json();
          alert(data.error || 'Failed to load restaurants');
          setLoading(false);
          return;
        }
        const data = await res.json();
        setRestaurants(data);
      } catch (err) {
        console.error(err);
        alert('Error fetching restaurants');
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurants();
    */
  }, []);

  const handleCardClick = (id) => {
    navigate(`/restaurant/${id}`);
  };

  return (
    <div className="food-bg">
      <div className="food-container">
        <h2 className="food-title">Restaurants Near You</h2>
        {loading ? (
          <p style={{ color: '#fff', textAlign: 'center' }}>Loading restaurants...</p>
        ) : restaurants.length === 0 ? (
          <p style={{ color: '#fff', textAlign: 'center' }}>No restaurants available.</p>
        ) : (
          <div className="food-list">
            {restaurants.map((restaurant, idx) => (
              <div
                className="food-card clickable"
                key={restaurant.id}
                onClick={() => handleCardClick(restaurant.id)}
                tabIndex={0}
                role="button"
                onKeyDown={e => { if (e.key === 'Enter') handleCardClick(restaurant.id); }}
              >
                <img
                  className="food-img"
                  src={restaurant.image}
                  alt={restaurant.name}
                />
                <div className="food-info">
                  <div className="food-name">{restaurant.name}</div>
                  <div className="food-desc">{restaurant.description}</div>
                  <StarRating rating={restaurant.rating} />
                </div>
                {restaurant.promo && (
                  <div className="food-badge">{restaurant.promo}</div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default FoodPage;
