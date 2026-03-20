import React from 'react';
import '../styles/TopBar.css';

const TopBar = ({ title, user }) => {
  return (
    <header className="topbar">
      <div className="topbar-left">
        <h2 className="topbar-title">{title || 'Dashboard'}</h2>
      </div>
      <div className="topbar-right">
        <div className="topbar-time">
          {new Date().toLocaleDateString('vi-VN', { weekday: 'short', day: '2-digit', month: '2-digit', year: 'numeric' })}
        </div>
        <div className="topbar-divider" />
        <div className="topbar-user">
          <span className="topbar-name">{user?.name || 'Admin'}</span>
          <div className="topbar-avatar">{user?.name?.[0] || 'A'}</div>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
