import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Product.css';

const API = 'http://localhost:3000/api/admin';

const EMPTY_FORM = { name: '', price: '', image: '', description: '', category: '', details: '' };

const Product = () => {
  const [products, setProducts]   = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch]       = useState('');
  const [loading, setLoading]     = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem]   = useState(null); // null = add, object = edit
  const [form, setForm]           = useState(EMPTY_FORM);
  const [saving, setSaving]       = useState(false);
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      const [pRes, cRes] = await Promise.all([
        axios.get(`${API}/products`),
        axios.get(`${API}/categories`)
      ]);
      setProducts(pRes.data);
      setCategories(cRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const openAdd = () => {
    setEditItem(null);
    setForm(EMPTY_FORM);
    setShowModal(true);
  };

  const openEdit = (p) => {
    setEditItem(p);
    setForm({
      name:        p.name || '',
      price:       p.price || '',
      image:       p.image || '',
      description: p.description || '',
      category:    p.category || '',
      details:     p.details || ''
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.price) return alert('Tên và giá là bắt buộc');
    setSaving(true);
    try {
      if (editItem) {
        await axios.put(`${API}/products/${editItem._id}`, form);
      } else {
        await axios.post(`${API}/products`, { ...form, cdate: new Date() });
      }
      await fetchProducts();
      setShowModal(false);
    } catch (err) {
      console.error(err);
      alert('Lỗi khi lưu sản phẩm');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Xóa sản phẩm này?')) return;
    try {
      await axios.delete(`${API}/products/${id}`);
      setProducts(prev => prev.filter(p => p._id !== id));
    } catch (err) {
      alert('Lỗi khi xoá sản phẩm');
    }
  };

  const filtered = products.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase())
  );

  const getCatName = (id) => categories.find(c => c._id === id)?.name || '—';

  return (
    <div className="product-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Sản phẩm</h1>
          <p className="page-subtitle">{products.length} sản phẩm trong kho</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>+ Thêm sản phẩm</button>
      </div>

      {/* Toolbar */}
      <div className="product-toolbar">
        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input
            placeholder="Tìm kiếm sản phẩm..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="loading-wrap"><div className="loading-spinner" /></div>
      ) : (
        <div className="table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Sản phẩm</th>
                <th>Danh mục</th>
                <th>Giá</th>
                <th>Ngày tạo</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={5} style={{ textAlign: 'center', padding: 40, color: 'var(--gray-mid)' }}>Không tìm thấy sản phẩm</td></tr>
              ) : filtered.map(p => (
                <tr key={p._id}>
                  <td>
                    <div className="product-cell">
                      {p.image && <img src={p.image} alt={p.name} className="product-thumb" onError={e => e.target.style.display='none'} />}
                      <div>
                        <p className="product-name">{p.name}</p>
                        <p className="product-desc">{p.description?.slice(0, 50)}{p.description?.length>50?'...':''}</p>
                      </div>
                    </div>
                  </td>
                  <td>{getCatName(p.category)}</td>
                  <td><span className="price-tag">{Number(p.price).toLocaleString('vi-VN')}₫</span></td>
                  <td className="text-gray text-sm">{p.cdate ? new Date(p.cdate).toLocaleDateString('vi-VN') : '—'}</td>
                  <td>
                    <div className="action-group">
                      <button className="btn btn-ghost btn-sm" onClick={() => navigate(`/products/${p._id}`)}>Xem</button>
                      <button className="btn btn-ghost btn-sm" onClick={() => openEdit(p)}>Sửa</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p._id)}>Xoá</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal add/edit */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{editItem ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              {[
                { key: 'name',        label: 'Tên sản phẩm', placeholder: 'Nike Air Max...' },
                { key: 'price',       label: 'Giá (₫)',       placeholder: '1990000', type: 'number' },
                { key: 'image',       label: 'URL hình ảnh',  placeholder: 'https://...' },
                { key: 'description', label: 'Mô tả',         placeholder: 'Mô tả sản phẩm...', tag: 'textarea' },
                { key: 'details',     label: 'Chi tiết',      placeholder: 'Thông số kỹ thuật...', tag: 'textarea' },
              ].map(f => (
                <div className="form-group" key={f.key}>
                  <label className="form-label">{f.label}</label>
                  {f.tag === 'textarea' ? (
                    <textarea
                      className="form-input"
                      rows={3}
                      placeholder={f.placeholder}
                      value={form[f.key]}
                      onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                      style={{ resize: 'vertical' }}
                    />
                  ) : (
                    <input
                      className="form-input"
                      type={f.type || 'text'}
                      placeholder={f.placeholder}
                      value={form[f.key]}
                      onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                    />
                  )}
                </div>
              ))}
              <div className="form-group">
                <label className="form-label">Danh mục</label>
                <select
                  className="form-input"
                  value={form.category}
                  onChange={e => setForm(prev => ({ ...prev, category: e.target.value }))}
                >
                  <option value="">-- Chọn danh mục --</option>
                  {categories.map(c => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setShowModal(false)}>Huỷ</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                {saving ? '⏳ Đang lưu...' : (editItem ? 'Cập nhật' : 'Thêm mới')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Product;
