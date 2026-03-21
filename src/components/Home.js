import React, { Component } from 'react';
import axios from 'axios';
import { API_BASE } from '../api';
import '../styles/Home.css';

const API = API_BASE;

// SVG Icons tĩnh
const StatIcon = ({ type }) => {
  const icons = {
    product:  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>,
    category: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 6h16M4 12h16M4 18h16"/></svg>,
    order:    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="16" y2="17"/></svg>,
    revenue:  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  };
  return icons[type] || null;
};

const StatCard = ({ iconType, label, value, sub, trend }) => (
  <div className="stat-card">
    <div className="stat-icon"><StatIcon type={iconType} /></div>
    <div className="stat-body">
      <p className="stat-label">{label}</p>
      <h3 className="stat-value">{value}</h3>
      {sub && <p className="stat-sub">{sub}</p>}
    </div>
    {trend !== undefined && (
      <div className={`stat-trend ${trend >= 0 ? 'up' : 'down'}`}>
        {trend >= 0 ? '+' : ''}{Math.abs(trend)}%
      </div>
    )}
  </div>
);

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stats:        { products: 0, categories: 0, orders: 0 },
      recentOrders: [],
      loading:      true
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  async fetchData() {
    try {
      const [pRes, cRes, oRes] = await Promise.all([
        axios.get(`${API}/products`),
        axios.get(`${API}/categories`),
        axios.get(`${API}/orders`)
      ]);
      this.setState({
        stats: {
          products:   pRes.data.length,
          categories: cRes.data.length,
          orders:     oRes.data.length
        },
        recentOrders: oRes.data.slice(0, 5)
      });
    } catch (err) {
      console.error('Dashboard fetch error:', err);
    } finally {
      this.setState({ loading: false });
    }
  }

  statusBadge(status) {
    const map = {
      pending:    'badge-warning',
      processing: 'badge-gray',
      completed:  'badge-success',
      cancelled:  'badge-danger'
    };
    return <span className={`badge ${map[status] || 'badge-gray'}`}>{status}</span>;
  }

  render() {
    const { stats, recentOrders, loading } = this.state;

    if (loading) return (
      <div className="loading-wrap">
        <div className="loading-spinner" />
      </div>
    );

    return (
      <div className="home-page">
        {/* Welcome */}
        <div className="home-welcome">
          <div>
            <h1 className="page-title">Dashboard</h1>
            <p className="page-subtitle">Tổng quan hệ thống cửa hàng</p>
          </div>
          <div className="home-date">
            {new Date().toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}
          </div>
        </div>

        {/* Stat Cards */}
        <div className="stats-grid">
          <StatCard iconType="product"  label="Sản phẩm"  value={stats.products}   trend={12} />
          <StatCard iconType="category" label="Danh mục"  value={stats.categories} trend={0}  />
          <StatCard iconType="order"    label="Đơn hàng"  value={stats.orders}     trend={8}  />
          <StatCard iconType="revenue"  label="Doanh thu" value="—"               sub="Chưa tích hợp" />
        </div>

        {/* Recent Orders */}
        <div className="card home-table-card">
          <div className="page-header" style={{ marginBottom: 16 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700 }}>Đơn hàng gần đây</h3>
          </div>
          {recentOrders.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              </div>
              <p>Chưa có đơn hàng nào</p>
            </div>
          ) : (
            <div className="table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Mã đơn</th>
                    <th>Khách hàng</th>
                    <th>Tổng tiền</th>
                    <th>Phương thức</th>
                    <th>Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map(o => (
                    <tr key={o._id}>
                      <td><span className="order-id">#{o.orderNumber || o._id?.slice(-6)}</span></td>
                      <td>{o.userId || '—'}</td>
                      <td>{o.totalAmount?.toLocaleString('vi-VN')}₫</td>
                      <td>{o.paymentMethod || '—'}</td>
                      <td>{this.statusBadge(o.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default Home;
