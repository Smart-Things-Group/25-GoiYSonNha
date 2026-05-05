const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

/**
 * Lấy danh sách phong cách vùng miền
 */
export async function fetchRegionalStyles() {
  const response = await fetch(`${API_URL}/api/mixmatch/regional-styles`);
  return await response.json();
}

/**
 * Lấy danh sách thương hiệu sơn
 */
export async function fetchPaintBrands() {
  const response = await fetch(`${API_URL}/api/mixmatch/paint-brands`);
  return await response.json();
}

/**
 * Lấy danh sách màu sơn (filter theo component type và brand)
 * @param {Object} params - { componentType: 'wall'|'roof'|'column', brandId: number }
 */
export async function fetchPaintColors(params = {}) {
  const query = new URLSearchParams(params).toString();
  const response = await fetch(`${API_URL}/api/mixmatch/paint-colors?${query}`);
  return await response.json();
}

/**
 * Tạo thiết kế Mix & Match
 * @param {FormData} formData - Chứa: house (file), wallColorId, roofColorId, columnColorId, regionalStyleId
 * @param {string} token - JWT token
 */
export async function generateMixMatch(formData, token) {
  const response = await fetch(`${API_URL}/api/mixmatch/generate`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const data = await response.json();

  if (!response.ok || !data.ok) {
    throw new Error(data.message || "Lỗi tạo thiết kế");
  }

  return data;
}

/**
 * Lấy lịch sử dự án Mix & Match
 * @param {string} token - JWT token
 */
export async function fetchMixMatchHistory(token) {
  const response = await fetch(`${API_URL}/api/mixmatch/history`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return await response.json();
}
