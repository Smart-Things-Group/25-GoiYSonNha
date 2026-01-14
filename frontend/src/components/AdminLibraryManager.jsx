import { useEffect, useState } from "react";
import {
  createLibraryItem,
  fetchAdminLibrary,
  updateLibraryItem,
  deleteLibraryItem,
} from "../api/admin";
import useToasts from "../hooks/useToasts";

const REGION_OPTIONS = ["Bắc", "Trung", "Nam", "Âu"];

function AdminLibraryManager({ token }) {
  const { pushToast } = useToasts();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    regionName: "Bắc",
    styleData: "",
    description: "",
  });
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  // Load danh sách thư viện
  const loadLibrary = async () => {
    setLoading(true);
    try {
      const response = await fetchAdminLibrary(token);
      setItems(response.items || response.data?.items || []);
    } catch (error) {
      pushToast({
        variant: "error",
        title: "Lỗi tải dữ liệu",
        message: error.message || "Không thể tải danh sách thư viện",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLibrary();
  }, [token]);

  // Reset form
  const resetForm = () => {
    // Cleanup preview URL nếu là blob URL
    if (previewUrl && previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }
    setFormData({ regionName: "Bắc", styleData: "", description: "" });
    setFile(null);
    setPreviewUrl(null);
    setEditingId(null);
    setIsFormOpen(false);
  };

  // Xử lý chọn file
  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Cleanup preview URL cũ nếu có
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
      setFile(selectedFile);
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
    }
  };

  // Cleanup preview URL khi unmount hoặc reset
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // Xử lý submit form (thêm mới hoặc cập nhật)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      if (file) {
        data.append("image", file);
      }
      data.append("regionName", formData.regionName);
      data.append("styleData", formData.styleData);
      data.append("description", formData.description);

      if (editingId) {
        // Cập nhật
        await updateLibraryItem(editingId, data, token);
        pushToast({
          variant: "success",
          title: "Thành công",
          message: "Đã cập nhật mẫu nhà thành công",
        });
      } else {
        // Thêm mới
        if (!file) {
          pushToast({
            variant: "error",
            title: "Lỗi",
            message: "Vui lòng chọn ảnh mẫu nhà",
          });
          setLoading(false);
          return;
        }
        await createLibraryItem(data, token);
        pushToast({
          variant: "success",
          title: "Thành công",
          message: "Đã thêm mẫu nhà vào thư viện thành công",
        });
      }

      resetForm();
      loadLibrary();
    } catch (error) {
      pushToast({
        variant: "error",
        title: "Lỗi",
        message: error.message || "Không thể lưu mẫu nhà",
      });
    } finally {
      setLoading(false);
    }
  };

  // Xử lý xóa
  const handleDelete = async (id) => {
    if (!confirm("Bạn có chắc chắn muốn xóa mẫu nhà này?")) {
      return;
    }

    setLoading(true);
    try {
      await deleteLibraryItem(id, token);
      pushToast({
        variant: "success",
        title: "Thành công",
        message: "Đã xóa mẫu nhà khỏi thư viện",
      });
      loadLibrary();
    } catch (error) {
      pushToast({
        variant: "error",
        title: "Lỗi",
        message: error.message || "Không thể xóa mẫu nhà",
      });
    } finally {
      setLoading(false);
    }
  };

  // Xử lý chỉnh sửa
  const handleEdit = (item) => {
    setEditingId(item.Id);
    setFormData({
      regionName: item.RegionName || "Bắc",
      styleData: item.StyleData || "",
      description: item.Description || "",
    });
    setFile(null);
    setPreviewUrl(item.ImageUrl || null);
    setIsFormOpen(true);
  };

  return (
    <div className="admin-surface">
      {/* Header với nút thêm mới */}
      <div className="admin-panel" style={{ marginBottom: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <p className="admin-eyebrow">Quản lý thư viện</p>
            <h2 style={{ margin: 0 }}>Thư viện Mẫu Nhà Vùng Miền</h2>
          </div>
          <button
            type="button"
            className="admin-button"
            onClick={() => {
              resetForm();
              setIsFormOpen(true);
            }}
            disabled={loading}
          >
            {isFormOpen ? "Đóng form" : "+ Thêm mẫu nhà"}
          </button>
        </div>
      </div>

      {/* Form thêm/sửa */}
      {isFormOpen && (
        <div className="admin-card" style={{ marginBottom: "24px" }}>
          <header className="admin-card__header">
            <h3>{editingId ? "Chỉnh sửa mẫu nhà" : "Thêm mẫu nhà mới"}</h3>
          </header>
          <form onSubmit={handleSubmit}>
            <div style={{ display: "grid", gap: "16px" }}>
              {/* Chọn vùng miền */}
              <label>
                <span style={{ display: "block", marginBottom: "8px", fontWeight: 600 }}>
                  Vùng miền
                </span>
                <select
                  value={formData.regionName}
                  onChange={(e) =>
                    setFormData({ ...formData, regionName: e.target.value })
                  }
                  className="admin-input"
                  required
                >
                  {REGION_OPTIONS.map((region) => (
                    <option key={region} value={region}>
                      {region}
                    </option>
                  ))}
                </select>
              </label>

              {/* Upload ảnh */}
              <label>
                <span style={{ display: "block", marginBottom: "8px", fontWeight: 600 }}>
                  Ảnh mẫu nhà {editingId && "(Để trống nếu giữ ảnh cũ)"}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="admin-input"
                  required={!editingId}
                />
                {previewUrl && (
                  <div style={{ marginTop: "12px" }}>
                    <img
                      src={previewUrl}
                      alt="Preview"
                      style={{
                        maxWidth: "300px",
                        maxHeight: "200px",
                        borderRadius: "8px",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                )}
              </label>

              {/* StyleData */}
              <label>
                <span style={{ display: "block", marginBottom: "8px", fontWeight: 600 }}>
                  Mô tả kỹ thuật cho AI (StyleData)
                </span>
                <textarea
                  value={formData.styleData}
                  onChange={(e) =>
                    setFormData({ ...formData, styleData: e.target.value })
                  }
                  className="admin-input"
                  rows={4}
                  placeholder="Mô tả chi tiết về phong cách, vật liệu, màu sắc để AI hiểu..."
                  required
                />
              </label>

              {/* Description */}
              <label>
                <span style={{ display: "block", marginBottom: "8px", fontWeight: 600 }}>
                  Mô tả hiển thị cho người dùng
                </span>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="admin-input"
                  rows={3}
                  placeholder="Mô tả ngắn gọn về mẫu nhà này..."
                />
              </label>

              {/* Buttons */}
              <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
                <button
                  type="button"
                  className="admin-button admin-button--ghost"
                  onClick={resetForm}
                  disabled={loading}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="admin-button"
                  disabled={loading}
                >
                  {loading ? "Đang xử lý..." : editingId ? "Cập nhật" : "Thêm mới"}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Danh sách thư viện */}
      <div className="admin-card">
        <header className="admin-card__header">
          <div>
            <p className="admin-eyebrow">Danh sách mẫu nhà</p>
            <h3>Tổng cộng {items.length} mẫu</h3>
          </div>
        </header>

        {loading && !items.length ? (
          <div className="admin-empty">Đang tải dữ liệu...</div>
        ) : items.length === 0 ? (
          <div className="admin-empty">Chưa có mẫu nhà nào trong thư viện</div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              gap: "20px",
            }}
          >
            {items.map((item) => (
              <div
                key={item.Id}
                className="admin-card"
                style={{ padding: "16px" }}
              >
                <div style={{ marginBottom: "12px" }}>
                  <span className="admin-badge admin-badge--accent">
                    {item.RegionName}
                  </span>
                </div>

                {item.ImageUrl && (
                  <div style={{ marginBottom: "12px" }}>
                    <img
                      src={item.ImageUrl}
                      alt={item.Description || "Mẫu nhà"}
                      style={{
                        width: "100%",
                        height: "200px",
                        objectFit: "cover",
                        borderRadius: "8px",
                      }}
                    />
                  </div>
                )}

                <div style={{ marginBottom: "12px" }}>
                  <p
                    style={{
                      fontSize: "0.9rem",
                      color: "rgba(255,255,255,0.7)",
                      margin: "8px 0",
                    }}
                  >
                    <strong>StyleData:</strong>
                  </p>
                  <p
                    style={{
                      fontSize: "0.85rem",
                      color: "rgba(255,255,255,0.6)",
                      maxHeight: "60px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {item.StyleData || "Chưa có mô tả"}
                  </p>
                </div>

                {item.Description && (
                  <div style={{ marginBottom: "12px" }}>
                    <p
                      style={{
                        fontSize: "0.9rem",
                        color: "rgba(255,255,255,0.7)",
                        margin: "8px 0",
                      }}
                    >
                      <strong>Mô tả:</strong>
                    </p>
                    <p
                      style={{
                        fontSize: "0.85rem",
                        color: "rgba(255,255,255,0.6)",
                      }}
                    >
                      {item.Description}
                    </p>
                  </div>
                )}

                <p
                  style={{
                    fontSize: "0.75rem",
                    color: "rgba(255,255,255,0.5)",
                    marginTop: "12px",
                  }}
                >
                  Tạo lúc: {new Date(item.CreatedAt).toLocaleString("vi-VN")}
                </p>

                <div
                  style={{
                    display: "flex",
                    gap: "8px",
                    marginTop: "16px",
                  }}
                >
                  <button
                    type="button"
                    className="admin-button admin-button--ghost"
                    onClick={() => handleEdit(item)}
                    disabled={loading}
                    style={{ flex: 1 }}
                  >
                    Chỉnh sửa
                  </button>
                  <button
                    type="button"
                    className="admin-button admin-button--danger"
                    onClick={() => handleDelete(item.Id)}
                    disabled={loading}
                    style={{ flex: 1 }}
                  >
                    Xóa
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminLibraryManager;
