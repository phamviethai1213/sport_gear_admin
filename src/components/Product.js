import React, { Component } from 'react';
import axios from 'axios';
import { API_BASE } from '../api';
import withRouter from './withRouter';
import '../styles/Product.css';

const API = API_BASE;

const EMPTY_FORM = { name: '', price: '', image: '', description: '', category: '', details: '' };

class Product extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products:   [],
      categories: [],
      search:     '',
      loading:    true,
      showModal:  false,
      editItem:   null,   // null = thêm mới, object = chỉnh sửa
      form:       { ...EMPTY_FORM },
      saving:     false
    };
    this.fetchProducts = this.fetchProducts.bind(this);
    this.handleSave    = this.handleSave.bind(this);
    this.handleDelete  = this.handleDelete.bind(this);
    this.openAdd       = this.openAdd.bind(this);
    this.openEdit      = this.openEdit.bind(this);
  }

  componentDidMount() {
    this.fetchProducts();
  }

  async fetchProducts() {
    try {
      const [pRes, cRes] = await Promise.all([
        axios.get(`${API}/products`),
        axios.get(`${API}/categories`)
      ]);
      this.setState({ products: pRes.data, categories: cRes.data });
    } catch (err) {
      console.error(err);
    } finally {
      this.setState({ loading: false });
    }
  }

  openAdd() {
    this.setState({ editItem: null, form: { ...EMPTY_FORM }, showModal: true });
  }

  openEdit(p) {
    // category có thể là ObjectId string hoặc object {id, name} từ data cũ
    const catVal = p.category?._id || p.category?.id || p.category || '';
    this.setState({
      editItem: p,
      form: {
        name:        p.name        || '',
        price:       p.price       || '',
        image:       p.image       || '',
        description: p.description || '',
        category:    typeof catVal === 'object' ? '' : catVal,
        details:     p.details && typeof p.details === 'string' ? p.details : ''
      },
      showModal: true
    });
  }

  async handleSave() {
    const { form, editItem } = this.state;
    if (!form.name || !form.price) return alert('Tên và giá là bắt buộc');
    this.setState({ saving: true });

    // Xây payload sạch: bỏ category nếu rỗng (tránh lỗi ObjectId validation)
    const payload = {
      name:        form.name,
      price:       Number(form.price),
      image:       form.image       || '',
      description: form.description || '',
      details:     form.details     || '',
      cdate:       editItem ? (editItem.cdate || Date.now()) : Date.now()
    };
    if (form.category) payload.category = form.category;

    try {
      if (editItem) {
        await axios.put(`${API}/products/${editItem._id}`, payload);
      } else {
        await axios.post(`${API}/products`, payload);
      }
      await this.fetchProducts();
      this.setState({ showModal: false });
    } catch (err) {
      const msg = err.response?.data?.error || err.message || 'Lỗi khi lưu sản phẩm';
      alert(msg);
      console.error(err);
    } finally {
      this.setState({ saving: false });
    }
  }

  async handleDelete(id) {
    if (!window.confirm('Xóa sản phẩm này?')) return;
    try {
      await axios.delete(`${API}/products/${id}`);
      this.setState(prev => ({ products: prev.products.filter(p => p._id !== id) }));
    } catch {
      alert('Lỗi khi xoá sản phẩm');
    }
  }

  setFormField(key, value) {
    this.setState(prev => ({ form: { ...prev.form, [key]: value } }));
  }


  getCatName(category) {
    // category có thể là ObjectId string hoặc object {id, name} từ data cũ
    if (!category) return '—';
    if (typeof category === 'object') return category.name || category.id || '—';
    return this.state.categories.find(c => c._id === category)?.name || '—';
  }

  render() {
    const { products, categories, search, loading, showModal, editItem, form, saving } = this.state;
    const { navigate } = this.props;

    const filtered = products.filter(p =>
      p.name?.toLowerCase().includes(search.toLowerCase())
    );

    const fields = [
      { key: 'name',        label: 'Tên sản phẩm', placeholder: 'Nike Air Max...' },
      { key: 'price',       label: 'Giá (₫)',       placeholder: '1990000', type: 'number' },
      { key: 'image',       label: 'URL hình ảnh',  placeholder: 'https://...' },
      { key: 'description', label: 'Mô tả',         placeholder: 'Mô tả sản phẩm...', tag: 'textarea' },
      { key: 'details',     label: 'Chi tiết',      placeholder: 'Thông số kỹ thuật...', tag: 'textarea' },
    ];

    return (
      <div className="product-page">
        <div className="page-header">
          <div>
            <h1 className="page-title">Sản phẩm</h1>
            <p className="page-subtitle">{products.length} sản phẩm trong kho</p>
          </div>
          <button className="btn btn-primary" onClick={this.openAdd}>+ Thêm sản phẩm</button>
        </div>

        {/* Toolbar */}
        <div className="product-toolbar">
          <div className="search-bar">
            <span className="search-icon">🔍</span>
            <input
              placeholder="Tìm kiếm sản phẩm..."
              value={search}
              onChange={e => this.setState({ search: e.target.value })}
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
                          <p className="product-desc">{p.description?.slice(0, 50)}{p.description?.length > 50 ? '...' : ''}</p>
                        </div>
                      </div>
                    </td>
                    <td>{this.getCatName(p.category)}</td>
                    <td><span className="price-tag">{Number(p.price).toLocaleString('vi-VN')}₫</span></td>
                    <td className="text-gray text-sm">{p.cdate ? new Date(p.cdate).toLocaleDateString('vi-VN') : '—'}</td>
                    <td>
                      <div className="action-group">
                        <button className="btn btn-ghost btn-sm" onClick={() => navigate(`/products/${p._id}`)}>Xem</button>
                        <button className="btn btn-ghost btn-sm" onClick={() => this.openEdit(p)}>Sửa</button>
                        <button className="btn btn-danger btn-sm" onClick={() => this.handleDelete(p._id)}>Xoá</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal thêm/sửa */}
        {showModal && (
          <div className="modal-overlay" onClick={() => this.setState({ showModal: false })}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h3 className="modal-title">{editItem ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}</h3>
                <button className="modal-close" onClick={() => this.setState({ showModal: false })}>✕</button>
              </div>
              <div className="modal-body">
                {fields.map(f => (
                  <div className="form-group" key={f.key}>
                    <label className="form-label">{f.label}</label>
                    {f.tag === 'textarea' ? (
                      <textarea
                        className="form-input"
                        rows={3}
                        placeholder={f.placeholder}
                        value={form[f.key]}
                        onChange={e => this.setFormField(f.key, e.target.value)}
                        style={{ resize: 'vertical' }}
                      />
                    ) : (
                      <input
                        className="form-input"
                        type={f.type || 'text'}
                        placeholder={f.placeholder}
                        value={form[f.key]}
                        onChange={e => this.setFormField(f.key, e.target.value)}
                      />
                    )}
                  </div>
                ))}

                <div className="form-group">
                  <label className="form-label">Danh mục</label>
                  <select
                    className="form-input"
                    value={form.category}
                    onChange={e => this.setFormField('category', e.target.value)}
                  >
                    <option value="">-- Chọn danh mục --</option>
                    {categories.map(c => (
                      <option key={c._id} value={c._id}>{c.name}</option>
                    ))}
                  </select>
                </div>
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

export default withRouter(Product);
