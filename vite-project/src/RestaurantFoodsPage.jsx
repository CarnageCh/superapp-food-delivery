import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import './FoodPage.css'; // Reuse styles

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

function RestaurantFoodsPage() {
  const { id } = useParams();
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          alert('You must be logged in to view foods.');
          setLoading(false);
          return;
        }

        const res = await fetch(`http://localhost:3000/api/restaurants/${id}/foods`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          const data = await res.json();
          alert(data.error || 'Failed to load foods');
          setLoading(false);
          return;
        }

        const data = await res.json();
        setFoods(data);
      } catch (err) {
        console.error(err);
        alert('Error fetching foods');
      } finally {
        setLoading(false);
      }
    };

    fetchFoods();
  }, [id]);

  return (
    <div className="food-bg">
      <div className="food-container">
        <Link to="/foods" style={{ color: '#fff', marginBottom: 20, display: 'inline-block' }}>
          &larr; Back to Restaurants
        </Link>
        <h2 className="food-title">Foods Available</h2>

        {loading ? (
          <p style={{ color: '#fff', textAlign: 'center' }}>Loading foods...</p>
        ) : foods.length === 0 ? (
          <p style={{ color: '#fff', textAlign: 'center' }}>No foods available.</p>
        ) : (
          <div className="food-list">
            {foods.map((food, idx) => (
              <div className="food-card" key={idx}>
                <img
                  className="food-img"
                  src={food.image || `https://source.unsplash.com/56x56/?food,meal,${idx}`}
                  alt={food.name}
                />
                <div className="food-info">
                  <div className="food-name">{food.name}</div>
                  <div className="food-desc">{food.description}</div>
                  {food.rating && <StarRating rating={food.rating} />}
                </div>
                {food.promo && <div className="food-badge">{food.promo}</div>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default RestaurantFoodsPage;
