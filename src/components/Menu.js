import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import '../styles/Menu.css';

// SVG Icons cho từng mục nav
const Icons = {
  dashboard: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
      <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
    </svg>
  ),
  product: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
      <line x1="3" y1="6" x2="21" y2="6"/>
      <path d="M16 10a4 4 0 0 1-8 0"/>
    </svg>
  ),
  category: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 6h16M4 12h16M4 18h16"/>
      <circle cx="1.5" cy="6" r="1.5" fill="currentColor" stroke="none"/>
      <circle cx="1.5" cy="12" r="1.5" fill="currentColor" stroke="none"/>
      <circle cx="1.5" cy="18" r="1.5" fill="currentColor" stroke="none"/>
    </svg>
  ),
  order: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="8" y1="13" x2="16" y2="13"/>
      <line x1="8" y1="17" x2="16" y2="17"/>
    </svg>
  ),
  settings: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>
  ),
  logout: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
      <polyline points="16 17 21 12 16 7"/>
      <line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  ),
};

const navItems = [
  {
    section: 'Tổng quan',
    items: [
      { path: '/',           icon: Icons.dashboard, label: 'Dashboard' },
    ]
  },
  {
    section: 'Quản lý',
    items: [
      { path: '/products',   icon: Icons.product,   label: 'Sản phẩm' },
      { path: '/categories', icon: Icons.category,  label: 'Danh mục' },
      { path: '/orders',     icon: Icons.order,     label: 'Đơn hàng' },
    ]
  },
  {
    section: 'Hệ thống',
    items: [
      { path: '/settings',   icon: Icons.settings,  label: 'Cài đặt' },
    ]
  }
];

const Menu = ({ user, onLogout }) => {
  const navigate = useNavigate();

  return (
    <aside className="sidebar">
      {/* Brand */}
      <div className="sidebar-brand">
        <div className="brand-mark">
          <svg viewBox="0 0 100 35" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M99.9 6.3L25.1 35 .1 8.5C-.4 7.8.3 6.6 1.2 6.9l23.3 8.1L89.3.1c4.5-1.4 8.5 3.5 5.8 7.1L25 35"
              fill="white"/>
          </svg>
        </div>
        <div className="brand-text">
          <span className="brand-name">Nike Store</span>
          <span className="brand-sub">Admin Panel</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {navItems.map(group => (
          <div className="nav-group" key={group.section}>
            <p className="nav-section-label">{group.section}</p>
            {group.items.map(item => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
                <span className="nav-indicator" />
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <div className="user-block">
          <div className="user-avatar-ring">
            <div className="user-avatar">{(user?.name?.[0] || 'A').toUpperCase()}</div>
          </div>
          <div className="user-details">
            <p className="user-name">{user?.name || 'Admin'}</p>
            <p className="user-role">Administrator</p>
          </div>
        </div>
        <button
          className="logout-btn"
          onClick={() => { onLogout?.(); navigate('/login'); }}
          title="Đăng xuất"
        >
          {Icons.logout}
        </button>
      </div>
    </aside>
  );
};

export default Menu;
