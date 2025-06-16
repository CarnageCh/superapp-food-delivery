import { useNavigate } from 'react-router-dom';
import './MainPage.css'; // We'll create this CSS file

function MainPage() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="main-bg">
      <div className="main-container">
        <h2 className="main-title">Welcome to DineDash</h2>
        <div className="button-group">
          <button className="main-button" onClick={() => navigate('/foods')}>
            🍔 View Foods
          </button>
          <button className="main-button" onClick={() => navigate('/chatbot')}>
            🤖 Chat with AI
          </button>
          <button className="main-button logout" onClick={logout}>
            🚪 Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default MainPage;