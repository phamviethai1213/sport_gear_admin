import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/Orders.css';

const API = 'http://localhost:3000/api/admin';

const Orders = () => {
  const [orders, setOrders]       = useState([]);
  const [search, setSearch]       = useState('');
  const [loading, setLoading]     = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem]   = useState(null);
  const [form, setForm]           = useState({ status: 'pending', paymentMethod: '' });
  const [saving, setSaving]       = useState(false);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${API}/orders`);
      setOrders(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchOrders(); }, []);

  const openEdit = (o) => {
    setEditItem(o);
    setForm({ status: o.status || 'pending', paymentMethod: o.paymentMethod || '' });
    setShowModal(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await axios.put(`${API}/orders/${editItem._id}`, { ...editItem, ...form });
      await fetchOrders();
      setShowModal(false);
    } catch { alert('Lỗi khi cập nhật đơn hàng'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Xóa đơn hàng này?')) return;
    try {
      await axios.delete(`${API}/orders/${id}`);
      setOrders(prev => prev.filter(o => o._id !== id));
    } catch { alert('Lỗi khi xoá đơn hàng'); }
  };

  const filtered = orders.filter(o =>
    (o.orderNumber || o._id)?.toString().toLowerCase().includes(search.toLowerCase())
  );

  const statusBadge = (status) => {
    const map = {
      pending:    ['badge-warning', 'Chờ xử lý'],
      processing: ['badge-gray',    'Đang xử lý'],
      completed:  ['badge-success', 'Hoàn thành'],
      cancelled:  ['badge-danger',  'Đã huỷ']
    };
    const [cls, label] = map[status] || ['badge-gray', status];
    return <span className={`badge ${cls}`}>{label}</span>;
  };

  return (
    <div className="orders-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Đơn hàng</h1>
          <p className="page-subtitle">{orders.length} đơn hàng</p>
        </div>
      </div>

      <div className="search-bar" style={{ width: 300 }}>
        <span className="search-icon">🔍</span>
        <input placeholder="Tìm theo mã đơn hàng..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {loading ? (
        <div className="loading-wrap"><div className="loading-spinner" /></div>
      ) : (
        <div className="table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Mã đơn</th>
                <th>Khách hàng</th>
                <th>Tổng tiền</th>
                <th>Thanh toán</th>
                <th>Trạng thái</th>
                <th>Ngày đặt</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} style={{ textAlign: 'center', padding: 40, color: 'var(--gray-mid)' }}>Không có đơn hàng</td></tr>
              ) : filtered.map(o => (
                <tr key={o._id}>
                  <td><span className="order-code">#{o.orderNumber || o._id?.slice(-8)}</span></td>
                  <td><span className="text-sm text-gray">{o.userId?.slice(-8) || '—'}</span></td>
                  <td><span style={{ fontWeight: 700 }}>{o.totalAmount?.toLocaleString('vi-VN')}₫</span></td>
                  <td><span className="text-sm">{o.paymentMethod || '—'}</span></td>
                  <td>{statusBadge(o.status)}</td>
                  <td className="text-gray text-sm">{o.cdate ? new Date(o.cdate).toLocaleDateString('vi-VN') : '—'}</td>
                  <td>
                    <div className="action-group">
                      <button className="btn btn-ghost btn-sm" onClick={() => openEdit(o)}>Sửa</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(o._id)}>Xoá</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal cập nhật trạng thái */}
      {showModal && editItem && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Cập nhật đơn hàng #{editItem.orderNumber || editItem._id?.slice(-6)}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Trạng thái</label>
                <select className="form-input" value={form.status}
                  onChange={e => setForm(p => ({ ...p, status: e.target.value }))}>
                  <option value="pending">Chờ xử lý</option>
                  <option value="processing">Đang xử lý</option>
                  <option value="completed">Hoàn thành</option>
                  <option value="cancelled">Đã huỷ</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Phương thức thanh toán</label>
                <select className="form-input" value={form.paymentMethod}
                  onChange={e => setForm(p => ({ ...p, paymentMethod: e.target.value }))}>
                  <option value="">-- Chọn --</option>
                  <option value="cash">Tiền mặt</option>
                  <option value="banking">Chuyển khoản</option>
                  <option value="card">Thẻ tín dụng</option>
                  <option value="momo">MoMo</option>
                </select>
              </div>
              {/* Hiển thị items */}
              {editItem.items && editItem.items.length > 0 && (
                <div>
                  <p className="form-label" style={{ marginBottom: 8 }}>Sản phẩm trong đơn</p>
                  <div className="order-items">
                    {editItem.items.map((item, i) => (
                      <div key={i} className="order-item">
                        <span>{item.name || item.productId || `Sản phẩm ${i+1}`}</span>
                        <span>x{item.quantity || 1} — {item.price?.toLocaleString('vi-VN')}₫</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setShowModal(false)}>Huỷ</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                {saving ? '⏳ Đang lưu...' : 'Cập nhật'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
