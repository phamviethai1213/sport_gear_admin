// ─── Cấu hình API tập trung ───────────────────────────────────
export const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3000/api/admin';

/**
 * Tạo axios config header với token (nếu cần trong tương lai)
 * @param {string} token
 */
export const authHeader = (token) => ({
  headers: { 'x-access-token': token }
});
