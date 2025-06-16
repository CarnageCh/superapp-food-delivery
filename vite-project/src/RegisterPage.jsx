import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AuthForm.css';

function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (res.ok) {
        alert('Registration successful!');
        navigate('/');
      } else {
        alert(data.error || 'Registration failed');
      }
    } catch (err) {
      alert('Error connecting to backend');
    }
  };

  return (
    <div className="auth-bg">
      <div className="auth-card">
        <h2>REGISTER</h2>
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
        <button className="auth-btn" onClick={handleRegister}>REGISTER</button>
        <div className="auth-footer">
          Already have an account? <a href="/">Login here</a>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;