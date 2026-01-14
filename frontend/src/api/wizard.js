const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export async function uploadSample(file) {
  const form = new FormData();
  form.append("sample", file);
  const res = await fetch(`${API_URL}/api/upload-sample`, {
    method: "POST",
    body: form,
  });
  return res.json();
}

export async function generateStyle(tempId, requirementsArray) {
  const res = await fetch(`${API_URL}/api/generate-style`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tempId, requirements: requirementsArray }),
  });
  return res.json();
}

export async function generateFinal(tempId, file, requirementsObj, token) {
  const form = new FormData();
  form.append("tempId", tempId);
  form.append("house", file);

  if (requirementsObj) {
    const requirements = Array.isArray(requirementsObj)
      ? requirementsObj
      : Object.values(requirementsObj || {});
    form.append("requirements", JSON.stringify(requirements));
  }

  // ✅ Nhận token từ tham số và gắn vào headers
  const headers = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}/api/generate-final`, {
    method: "POST",
    headers,   // ✅ truyền headers vào fetch
    body: form, // KHÔNG set Content-Type, để FormData tự lo
  });

  const data = await res.json();

  // ✅ Xử lý lỗi 401 - Token hết hạn hoặc không hợp lệ
  if (res.status === 401) {
    const message = data?.message || "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.";
    const error = new Error(message);
    error.status = 401;
    error.isUnauthorized = true;
    throw error;
  }

  // Nếu response không ok, throw error
  if (!res.ok || data?.ok === false) {
    const error = new Error(data?.message || "Không thể tạo ảnh. Vui lòng thử lại.");
    error.status = res.status;
    throw error;
  }

  return data;
}


export async function getHistories(userId = "") {
  const res = await fetch(`${API_URL}/api/histories?userId=${encodeURIComponent(userId)}`);
  return res.json();
}
