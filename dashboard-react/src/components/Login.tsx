import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

interface Credentials {
  email: string;
  password: string;
}

interface LoginResponse {
  access_token: string;
  token_type?: string;
  expires_in: number;
}

interface ErrorDetail {
  msg: string;
}

interface ErrorData {
  detail?: ErrorDetail[] | string;
}

const Login: React.FC = () => {
  const [credentials, setCredentials] = useState<Credentials>({ email: '', password: '' });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('https://entradas-back-66181581846.europe-west1.run.app/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      });

      if (response.ok) {
        const result: LoginResponse = await response.json();

        // Store the JWT token in localStorage (matching original logic)
        localStorage.setItem('authToken', result.access_token);
        localStorage.setItem('tokenType', result.token_type || 'bearer');
        localStorage.setItem('tokenExpiry', (Date.now() + (result.expires_in * 1000)).toString());

        navigate('/dashboard');
      } else {
        const errorData: ErrorData = await response.json().catch(() => ({}));
        let errorText = 'Invalid credentials. Please check your email and password.';

        if (errorData.detail) {
          if (Array.isArray(errorData.detail)) {
            errorText = errorData.detail.map((err: ErrorDetail) => err.msg).join(', ');
          } else {
            errorText = errorData.detail;
          }
        }

        setError(errorText);
      }
    } catch (error) {
      setError('Network error. Please try again.');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="logo">ET</div>
          <h1>Sign in</h1>
          <p>Access your admin dashboard</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={credentials.email}
              onChange={handleInputChange}
              placeholder="admin@eventtickets.com"
              required
              disabled={loading}
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={credentials.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
              required
              disabled={loading}
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="loading-spinner"></div>
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <span>🔐</span>
                <span>Sign in</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;