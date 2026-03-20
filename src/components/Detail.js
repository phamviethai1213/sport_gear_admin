import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Detail.css';

const API = 'http://localhost:3000/api/admin';

const Detail = () => {
  const { id }   = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [category, setCategory] = useState(null);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get(`${API}/products/${id}`);
        setProduct(res.data);
        if (res.data.category) {
          const cRes = await axios.get(`${API}/categories/${res.data.category}`);
          setCategory(cRes.data);
        }
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetch();
  }, [id]);

  if (loading) return <div className="loading-wrap"><div className="loading-spinner" /></div>;
  if (!product) return (
    <div className="empty-state" style={{ marginTop: 60 }}>
      <div className="empty-state-icon">😕</div>
      <p>Không tìm thấy sản phẩm</p>
      <button className="btn btn-ghost" style={{ marginTop: 16 }} onClick={() => navigate('/products')}>← Quay lại</button>
    </div>
  );

  return (
    <div className="detail-page">
      {/* Back */}
      <button className="back-btn" onClick={() => navigate('/products')}>← Quay lại danh sách</button>

      <div className="detail-grid">
        {/* Image */}
        <div className="detail-img-wrap">
          {product.image
            ? <img src={product.image} alt={product.name} className="detail-img" />
            : <div className="detail-img-placeholder">👟</div>
          }
        </div>

        {/* Info */}
        <div className="detail-info">
          {category && (
            <span className="badge badge-gray detail-cat">{category.name}</span>
          )}
          <h1 className="detail-name">{product.name}</h1>
          <p className="detail-price">{Number(product.price).toLocaleString('vi-VN')}₫</p>

          <div className="detail-divider" />

          <div className="detail-section">
            <h4 className="detail-section-title">Mô tả</h4>
            <p className="detail-text">{product.description || 'Chưa có mô tả.'}</p>
          </div>

          {product.details && (
            <div className="detail-section">
              <h4 className="detail-section-title">Chi tiết sản phẩm</h4>
              <p className="detail-text">{product.details}</p>
            </div>
          )}

          <div className="detail-section">
            <h4 className="detail-section-title">Thông tin thêm</h4>
            <div className="detail-meta-grid">
              <div className="detail-meta-item">
                <span className="meta-label">ID sản phẩm</span>
                <span className="meta-value mono">{product._id}</span>
              </div>
              <div className="detail-meta-item">
                <span className="meta-label">Danh mục ID</span>
                <span className="meta-value mono">{product.category || '—'}</span>
              </div>
              <div className="detail-meta-item">
                <span className="meta-label">Ngày tạo</span>
                <span className="meta-value">{product.cdate ? new Date(product.cdate).toLocaleDateString('vi-VN') : '—'}</span>
              </div>
            </div>
          </div>

          <div className="detail-actions">
            <button className="btn btn-primary" onClick={() => navigate('/products')}>← Danh sách sản phẩm</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Detail;
