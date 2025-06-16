import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import MainPage from './MainPage';
import FoodPage from './FoodPage';
import ChatbotPage from './ChatbotPage';
import RestaurantFoodsPage from './RestaurantFoodsPage'; // Import the new page

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/foods" element={<FoodPage />} />
        <Route path="/chatbot" element={<ChatbotPage />} />
        <Route path="/restaurant/:id" element={<RestaurantFoodsPage />} /> {/* New route */}
      </Routes>
    </Router>
  );
}

export default App;
