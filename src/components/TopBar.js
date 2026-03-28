import React, { Component } from 'react';
import '../styles/TopBar.css';

class TopBar extends Component {
  render() {
    const { title, user } = this.props;

    return (
      <header className="topbar">
        <div className="topbar-left">
          <button className="mobile-menu-toggle" onClick={this.props.toggleSidebar}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
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
  }
}

export default TopBar;
