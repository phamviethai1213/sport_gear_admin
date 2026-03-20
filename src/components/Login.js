import React, { useState } from 'react';
import '../styles/Login.css';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Vui lòng nhập đầy đủ thông tin.');
      return;
    }
    setLoading(true);
    // Giả lập login — thay bằng API call thực tế
    setTimeout(() => {
      if (email === 'admin@nike.com' && password === 'admin123') {
        onLogin && onLogin({ email, name: 'Admin' });
      } else {
        setError('Email hoặc mật khẩu không đúng.');
      }
      setLoading(false);
    }, 900);
  };

  return (
    <div className="login-page">
      {/* Background decoration */}
      <div className="login-bg">
        <div className="login-bg-circle c1" />
        <div className="login-bg-circle c2" />
      </div>

      <div className="login-box">
        {/* Logo */}
        <div className="login-logo">
          <svg viewBox="0 0 100 35" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M99.9 6.3L25.1 35 .1 8.5C-.4 7.8.3 6.6 1.2 6.9l23.3 8.1L89.3.1c4.5-1.4 8.5 3.5 5.8 7.1L25 35"
              fill="white" />
          </svg>
        </div>

        <h1 className="login-title">Admin Panel</h1>
        <p className="login-subtitle">Đăng nhập để quản lý cửa hàng</p>

        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="login-error">{error}</div>}

          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              className="form-input"
              type="email"
              placeholder="admin@nike.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Mật khẩu</label>
            <div className="input-pass-wrap">
              <input
                className="form-input"
                type={showPass ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="current-password"
              />
              <button type="button" className="pass-toggle" onClick={() => setShowPass(s => !s)}>
                {showPass
                  ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                }
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn-primary login-btn" disabled={loading}>
            {loading
              ? <span className="loading-dots">Đang đăng nhập</span>
              : 'Đăng nhập'
            }
          </button>
        </form>

        <p className="login-hint">Demo: admin@nike.com / admin123</p>
      </div>
    </div>
  );
};

export default Login;
