import React, { Component } from 'react';
import axios from 'axios';
import { API_BASE } from '../api';
import '../styles/Category.css';

const API = API_BASE;

const EMPTY_FORM = { name: '', slug: '', description: '', image: '', gender: 'unisex' };

class Category extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      search:     '',
      loading:    true,
      showModal:  false,
      editItem:   null,
      form:       { ...EMPTY_FORM },
      saving:     false
    };
    this.fetchCategories = this.fetchCategories.bind(this);
    this.handleSave      = this.handleSave.bind(this);
    this.handleDelete    = this.handleDelete.bind(this);
    this.openAdd         = this.openAdd.bind(this);
    this.openEdit        = this.openEdit.bind(this);
  }

  componentDidMount() {
    this.fetchCategories();
  }

  async fetchCategories() {
    try {
      const res = await axios.get(`${API}/categories`);
      this.setState({ categories: res.data });
    } catch (err) {
      console.error(err);
    } finally {
      this.setState({ loading: false });
    }
  }

  openAdd() {
    this.setState({ editItem: null, form: { ...EMPTY_FORM }, showModal: true });
  }

  openEdit(c) {
    this.setState({
      editItem: c,
      form: {
        name:        c.name        || '',
        slug:        c.slug        || '',
        description: c.description || '',
        image:       c.image       || '',
        gender:      c.gender      || 'unisex'
      },
      showModal: true
    });
  }

  async handleSave() {
    const { form, editItem } = this.state;
    if (!form.name) return alert('Tên danh mục là bắt buộc');
    this.setState({ saving: true });
    try {
      if (editItem) {
        await axios.put(`${API}/categories/${editItem._id}`, form);
      } else {
        await axios.post(`${API}/categories`, { ...form, cdate: Date.now() });
      }
      await this.fetchCategories();
      this.setState({ showModal: false });
    } catch (err) {
      const msg = err.response?.data?.error || err.message || 'Lỗi khi lưu danh mục';
      alert(msg);
      console.error(err);
    } finally {
      this.setState({ saving: false });
    }
  }

  async handleDelete(id) {
    if (!window.confirm('Xóa danh mục này?')) return;
    try {
      await axios.delete(`${API}/categories/${id}`);
      this.setState(prev => ({ categories: prev.categories.filter(c => c._id !== id) }));
    } catch {
      alert('Lỗi khi xoá danh mục');
    }
  }

  setFormField(key, value) {
    this.setState(prev => ({ form: { ...prev.form, [key]: value } }));
  }

  render() {
    const { categories, search, loading, showModal, editItem, form, saving } = this.state;

    const filtered = categories.filter(c =>
      c.name?.toLowerCase().includes(search.toLowerCase())
    );

    const fields = [
      { key: 'name',        label: 'Tên danh mục', placeholder: 'Giày chạy bộ' },
      { key: 'slug',        label: 'Slug URL',      placeholder: 'giay-chay-bo' },
      { key: 'image',       label: 'URL hình ảnh',  placeholder: 'https://...' },
    ];

    return (
      <div className="category-page">
        <div className="page-header">
          <div>
            <h1 className="page-title">Danh mục</h1>
            <p className="page-subtitle">{categories.length} danh mục</p>
          </div>
          <button className="btn btn-primary" onClick={this.openAdd}>+ Thêm danh mục</button>
        </div>

        <div className="search-bar" style={{ width: 260 }}>
          <span className="search-icon">🔍</span>
          <input
            placeholder="Tìm danh mục..."
            value={search}
            onChange={e => this.setState({ search: e.target.value })}
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
                  <button className="btn btn-ghost btn-sm" onClick={() => this.openEdit(c)}>Sửa</button>
                  <button className="btn btn-danger btn-sm" onClick={() => this.handleDelete(c._id)}>Xoá</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="modal-overlay" onClick={() => this.setState({ showModal: false })}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h3 className="modal-title">{editItem ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}</h3>
                <button className="modal-close" onClick={() => this.setState({ showModal: false })}>✕</button>
              </div>
              <div className="modal-body">
                {fields.map(f => (
                  <div className="form-group" key={f.key}>
                    <label className="form-label">{f.label}</label>
                    <input
                      className="form-input"
                      placeholder={f.placeholder}
                      value={form[f.key]}
                      onChange={e => this.setFormField(f.key, e.target.value)}
                    />
                  </div>
                ))}

              </div>
              <div className="modal-footer">
                <button className="btn btn-ghost" onClick={() => this.setState({ showModal: false })}>Huỷ</button>
                <button className="btn btn-primary" onClick={this.handleSave} disabled={saving}>
                  {saving ? '⏳ Đang lưu...' : (editItem ? 'Cập nhật' : 'Thêm mới')}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default Category;
