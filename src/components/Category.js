import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/Category.css';

const API = 'http://localhost:3000/api/admin';

const EMPTY_FORM = { name: '', slug: '', description: '', image: '', gender: 'unisex' };

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [search, setSearch]         = useState('');
  const [loading, setLoading]       = useState(true);
  const [showModal, setShowModal]   = useState(false);
  const [editItem, setEditItem]     = useState(null);
  const [form, setForm]             = useState(EMPTY_FORM);
  const [saving, setSaving]         = useState(false);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API}/categories`);
      setCategories(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchCategories(); }, []);

  const openAdd = () => { setEditItem(null); setForm(EMPTY_FORM); setShowModal(true); };
  const openEdit = (c) => {
    setEditItem(c);
    setForm({ name: c.name||'', slug: c.slug||'', description: c.description||'', image: c.image||'', gender: c.gender||'unisex' });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name) return alert('Tên danh mục là bắt buộc');
    setSaving(true);
    try {
      if (editItem) {
        await axios.put(`${API}/categories/${editItem._id}`, form);
      } else {
        await axios.post(`${API}/categories`, { ...form, cdate: new Date() });
      }
      await fetchCategories();
      setShowModal(false);
    } catch (err) { alert('Lỗi khi lưu danh mục'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Xóa danh mục này?')) return;
    try {
      await axios.delete(`${API}/categories/${id}`);
      setCategories(prev => prev.filter(c => c._id !== id));
    } catch { alert('Lỗi khi xoá danh mục'); }
  };

  const filtered = categories.filter(c =>
    c.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="category-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Danh mục</h1>
          <p className="page-subtitle">{categories.length} danh mục</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>+ Thêm danh mục</button>
      </div>

      <div className="search-bar" style={{ width: 260 }}>
        <span className="search-icon">🔍</span>
        <input
          placeholder="Tìm danh mục..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="loading-wrap"><div className="loading-spinner" /></div>
      ) : (
        <div className="cat-grid">
          {filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🏷</div>
              <p>Không tìm thấy danh mục</p>
            </div>
          ) : filtered.map(c => (
            <div className="cat-card" key={c._id}>
              <div className="cat-img-wrap">
                {c.image
                  ? <img src={c.image} alt={c.name} className="cat-img" onError={e => e.target.style.display='none'} />
                  : <div className="cat-img-placeholder">🏷</div>
                }
              </div>
              <div className="cat-info">
                <h4 className="cat-name">{c.name}</h4>
                <p className="cat-slug">/{c.slug || '—'}</p>
                <p className="cat-desc">{c.description?.slice(0, 60)}{c.description?.length > 60 ? '...' : ''}</p>
                <div className="cat-meta">
                  <span className="badge badge-gray">{c.gender || 'unisex'}</span>
                </div>
              </div>
              <div className="cat-actions">
                <button className="btn btn-ghost btn-sm" onClick={() => openEdit(c)}>Sửa</button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(c._id)}>Xoá</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{editItem ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              {[
                { key: 'name',        label: 'Tên danh mục', placeholder: 'Giày chạy bộ' },
                { key: 'slug',        label: 'Slug URL',     placeholder: 'giay-chay-bo' },
                { key: 'description', label: 'Mô tả',        placeholder: 'Mô tả danh mục...' },
                { key: 'image',       label: 'URL hình ảnh', placeholder: 'https://...' },
              ].map(f => (
                <div className="form-group" key={f.key}>
                  <label className="form-label">{f.label}</label>
                  <input className="form-input" placeholder={f.placeholder} value={form[f.key]}
                    onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} />
                </div>
              ))}
              <div className="form-group">
                <label className="form-label">Giới tính</label>
                <select className="form-input" value={form.gender}
                  onChange={e => setForm(p => ({ ...p, gender: e.target.value }))}>
                  <option value="unisex">Unisex</option>
                  <option value="men">Nam</option>
                  <option value="women">Nữ</option>
                  <option value="kids">Trẻ em</option>
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

export default Category;
