import React, { Component } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Login    from './components/Login';
import Menu     from './components/Menu';
import TopBar   from './components/TopBar';
import Home     from './components/Home';
import Product  from './components/Product';
import Category from './components/Category';
import Detail   from './components/Detail';
import Orders   from './components/Orders';

// ─────────────────────────────────────────────
//  Layout bao quanh các trang cần sidebar/topbar
//  (Giữ functional vì chỉ là pure render, không cần state/lifecycle)
// ─────────────────────────────────────────────
const AdminLayout = ({ user, onLogout, title, children }) => (
  <div className="admin-layout">
    <Menu user={user} onLogout={onLogout} />
    <div className="admin-main">
      <TopBar title={title} user={user} />
      <main className="admin-content">
        {children}
      </main>
    </div>
  </div>
);

// ─────────────────────────────────────────────
//  App root — Class Component
// ─────────────────────────────────────────────
class App extends Component {
  constructor(props) {
    super(props);
    const saved = localStorage.getItem('admin_user');
    this.state = {
      user: saved ? JSON.parse(saved) : null
    };
    this.handleLogin  = this.handleLogin.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
  }

  handleLogin(userData) {
    this.setState({ user: userData });
    localStorage.setItem('admin_user', JSON.stringify(userData));
  }

  handleLogout() {
    this.setState({ user: null });
    localStorage.removeItem('admin_user');
  }

  render() {
    const { user } = this.state;

    return (
      <BrowserRouter>
        <Routes>

          {/* Trang đăng nhập */}
          <Route
            path="/login"
            element={user ? <Navigate to="/" replace /> : <Login onLogin={this.handleLogin} />}
          />

          {/* Dashboard */}
          <Route path="/" element={
            !user ? <Navigate to="/login" replace /> :
            <AdminLayout user={user} onLogout={this.handleLogout} title="Dashboard">
              <Home />
            </AdminLayout>
          } />

          {/* Sản phẩm */}
          <Route path="/products" element={
            !user ? <Navigate to="/login" replace /> :
            <AdminLayout user={user} onLogout={this.handleLogout} title="Sản phẩm">
              <Product />
            </AdminLayout>
          } />

          {/* Chi tiết sản phẩm */}
          <Route path="/products/:id" element={
            !user ? <Navigate to="/login" replace /> :
            <AdminLayout user={user} onLogout={this.handleLogout} title="Chi tiết sản phẩm">
              <Detail />
            </AdminLayout>
          } />

          {/* Danh mục */}
          <Route path="/categories" element={
            !user ? <Navigate to="/login" replace /> :
            <AdminLayout user={user} onLogout={this.handleLogout} title="Danh mục">
              <Category />
            </AdminLayout>
          } />

          {/* Đơn hàng */}
          <Route path="/orders" element={
            !user ? <Navigate to="/login" replace /> :
            <AdminLayout user={user} onLogout={this.handleLogout} title="Đơn hàng">
              <Orders />
            </AdminLayout>
          } />

          {/* Fallback */}
          <Route path="*" element={<Navigate to={user ? "/" : "/login"} replace />} />

        </Routes>
      </BrowserRouter>
    );
  }
}

export default App;
