// frontend/src/api/admin.js
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const buildQueryString = (params = {}) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    query.set(key, value);
  });
  const qs = query.toString();
  return qs ? `?${qs}` : "";
};

const parseJsonSafely = async (response) => {
  try {
    return await response.json();
  } catch {
    return null;
  }
};

const buildHeaders = (token = "") => {
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
};

// Helper để xử lý lỗi 401 - Token hết hạn hoặc không hợp lệ
const handleUnauthorized = (response, data) => {
  if (response.status === 401) {
    const message = data?.message || "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.";
    const error = new Error(message);
    error.status = 401;
    error.isUnauthorized = true;
    throw error;
  }
};


// 1) API admin users
export async function fetchAdminUsers(params = {}, token = "") {
  const queryString = buildQueryString(params);

  const response = await fetch(`${API_URL}/api/admin/users${queryString}`, {
    method: "GET",
    headers: buildHeaders(token),
  });

  const data = await parseJsonSafely(response);

  if (!response.ok || data?.ok === false) {
    const message =
      data?.message || "Không thể tải danh sách người dùng";
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }

  return data; // { ok, data }
}

// 2) API admin stats
export async function fetchAdminStats(token = "") {
  const response = await fetch(`${API_URL}/api/admin/stats`, {
    method: "GET",
    headers: buildHeaders(token),
  });

  const data = await parseJsonSafely(response);

  if (!response.ok || data?.ok === false) {
    const message = data?.message || "Không thể tải thống kê admin";
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }

  return data; // { ok, totalUsers, ... }
}

// 3) API admin generations (cho dashboard)
export async function fetchAdminGenerations(params = {}, token = "") {
  const queryString = buildQueryString(params);

  const response = await fetch(
    `${API_URL}/api/admin/generations${queryString}`,
    {
      method: "GET",
      headers: buildHeaders(token),
    }
  );

  const data = await parseJsonSafely(response);

  if (!response.ok || data?.ok === false) {
    const message =
      data?.message || "Không thể tải danh sách lượt sinh ảnh (generations)";
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }

  return data; // { ok, page, pageSize, total, items }
}

// 4) Tổng hợp lượt sinh ảnh theo user
export async function fetchGenerationsByUser(params = {}, token = "") {
  const queryString = buildQueryString(params);
  const response = await fetch(
    `${API_URL}/api/admin/generations/by-user${queryString}`,
    {
      method: "GET",
      headers: buildHeaders(token),
    }
  );
  const data = await parseJsonSafely(response);

  if (!response.ok || data?.ok === false) {
    const message =
      data?.message || "Không thể tải thống kê lượt sinh theo tài khoản";
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }

  return data;
}

// 5) Xóa 1 generation (admin)
export async function deleteAdminGeneration(id, token = "") {
  const response = await fetch(`${API_URL}/api/admin/generations/${id}`, {
    method: "DELETE",
    headers: buildHeaders(token),
  });

  const data = await parseJsonSafely(response);
  if (!response.ok || data?.ok === false) {
    const message = data?.message || "Không thể xóa bản ghi generate";
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }
  return data;
}

// 6) Tạo user mới (admin)
export async function createAdminUser(payload = {}, token = "") {
  const response = await fetch(`${API_URL}/api/admin/users`, {
    method: "POST",
    headers: buildHeaders(token),
    body: JSON.stringify(payload),
  });

  const data = await parseJsonSafely(response);
  if (!response.ok || data?.ok === false) {
    const message = data?.message || "Không thể tạo tài khoản mới";
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }
  return data;
}

// 7) Cập nhật user (email / role / password)
export async function updateAdminUser(id, payload = {}, token = "") {
  const response = await fetch(`${API_URL}/api/admin/users/${id}`, {
    method: "PUT",
    headers: buildHeaders(token),
    body: JSON.stringify(payload),
  });

  const data = await parseJsonSafely(response);
  if (!response.ok || data?.ok === false) {
    const message = data?.message || "Không thể cập nhật tài khoản";
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }
  return data;
}

// 8) Xóa user
export async function deleteAdminUser(id, token = "") {
  const response = await fetch(`${API_URL}/api/admin/users/${id}`, {
    method: "DELETE",
    headers: buildHeaders(token),
  });

  const data = await parseJsonSafely(response);
  if (!response.ok || data?.ok === false) {
    const message = data?.message || "Không thể xóa tài khoản";
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }
  return data;
}
// 9) Thêm mẫu nhà vào thư viện (Sử dụng FormData cho Upload ảnh)
export async function createLibraryItem(formData, token = "") {
  const response = await fetch(`${API_URL}/api/admin/library`, {
    method: "POST",
    headers: {
      // Lưu ý: KHÔNG set Content-Type để trình duyệt tự nhận diện boundary cho FormData
      "Authorization": `Bearer ${token}`,
    },
    body: formData,
  });

  const data = await parseJsonSafely(response);
  // Xử lý lỗi 401 - Token hết hạn
  handleUnauthorized(response, data);
  if (!response.ok || data?.ok === false) {
    throw new Error(data?.message || "Không thể tải lên thư viện");
  }
  return data;
}

// 10) Lấy danh sách thư viện vùng miền
export async function fetchAdminLibrary(token = "") {
  const response = await fetch(`${API_URL}/api/admin/library`, {
    method: "GET",
    headers: buildHeaders(token),
  });
  const data = await parseJsonSafely(response);
  // Xử lý lỗi 401 - Token hết hạn
  handleUnauthorized(response, data);
  if (!response.ok || data?.ok === false) {
    const message = data?.message || "Không thể tải danh sách thư viện";
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }
  return data;
}

// 11) Cập nhật mẫu nhà trong thư viện
export async function updateLibraryItem(id, formData, token = "") {
  const response = await fetch(`${API_URL}/api/admin/library/${id}`, {
    method: "PUT",
    headers: {
      // KHÔNG set Content-Type để trình duyệt tự nhận diện boundary cho FormData
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const data = await parseJsonSafely(response);
  // Xử lý lỗi 401 - Token hết hạn
  handleUnauthorized(response, data);
  if (!response.ok || data?.ok === false) {
    throw new Error(data?.message || "Không thể cập nhật mẫu nhà");
  }
  return data;
}

// 12) Xóa mẫu nhà khỏi thư viện
export async function deleteLibraryItem(id, token = "") {
  const response = await fetch(`${API_URL}/api/admin/library/${id}`, {
    method: "DELETE",
    headers: buildHeaders(token),
  });  const data = await parseJsonSafely(response);
  // Xử lý lỗi 401 - Token hết hạn
  handleUnauthorized(response, data);
  if (!response.ok || data?.ok === false) {
    const message = data?.message || "Không thể xóa mẫu nhà";
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }
  return data;
}
