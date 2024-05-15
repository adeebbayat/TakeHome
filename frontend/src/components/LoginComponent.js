import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginComponent.css'; // For custom styles

const LoginComponent = () => {
  const [username, setUsername] = useState('');
  // const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    navigate(`/skills/${username}`);
  };

  return (
    <form onSubmit={handleLogin} className="login-form">
      <div className="form-group">
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>
      <button type="submit">Login</button>
    </form>
  );
};

export default LoginComponent;