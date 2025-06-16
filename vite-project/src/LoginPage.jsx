import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AuthForm.css';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        navigate('/main');
      } else {
        alert(data.error || 'Login failed');
      }
    } catch (err) {
      alert('Error connecting to backend');
    }
  };

  return (
    <div className="auth-bg">
      <div className="auth-card">
        <h2>LOGIN</h2>
        <input
          className="auth-input"
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        <input
          className="auth-input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <label className="auth-checkbox-label">
          <input type="checkbox" /> Remember me
        </label>
        <button className="auth-btn" onClick={handleLogin}>LOGIN</button>
        <div className="auth-divider">Or login with</div>
        <div className="auth-social">
          <button className="auth-social-btn">
            <span>📘</span> Facebook
          </button>
          <button className="auth-social-btn">
            <span>🟦</span> Google
          </button>
        </div>
        <div className="auth-footer">
          Not a member? <a href="/register">Sign up now</a>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;