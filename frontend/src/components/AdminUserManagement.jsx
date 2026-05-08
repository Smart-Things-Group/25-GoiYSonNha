import { useCallback, useEffect, useMemo, useState } from "react";
import useAdminUsers from "../hooks/useAdminUsers";

const ROLE_FILTERS = [
  { value: "all", label: "Tất cả" },
  { value: "admin", label: "Admin" },
  { value: "user", label: "Người dùng" },
];

function formatDate(value) {
  if (!value) return "Chưa cập nhật";
  try {
    return new Date(value).toLocaleString("vi-VN", { hour12: false });
  } catch {
    return value;
  }
}

function deriveNameFromEmail(email = "") {
  if (!email) return "Người dùng";
  const localPart = email.split("@")[0] || email;
  return localPart
    .replace(/[._-]+/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1))
    .join(" ");
}

function AdminModal({ title, children, onClose }) {
  return (
    <div
      role="presentation"
      onMouseDown={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: "var(--z-modal)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        background: "var(--color-bg-overlay)",
        backdropFilter: "blur(8px)",
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="user-modal-title"
        className="admin-card"
        onMouseDown={(event) => event.stopPropagation()}
        style={{
          width: "min(560px, 100%)",
          maxHeight: "calc(100vh - 48px)",
          overflowY: "auto",
          boxShadow: "var(--shadow-xl)",
        }}
      >
        <header className="admin-card__header" style={{ alignItems: "center" }}>
          <h3 id="user-modal-title">{title}</h3>
          <button type="button" className="admin-button admin-button--ghost" onClick={onClose}>
            Đóng
          </button>
        </header>
        {children}
      </div>
    </div>
  );
}

function AdminUserManagement({ token }) {
  const {
    users,
    loading,
    error,
    meta,
    refresh,
    createUser,
    updateUser,
    removeUser,
    updateRole,
  } = useAdminUsers(token);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [actionMessage, setActionMessage] = useState("");
  const [modalMode, setModalMode] = useState(null);
  const [userForm, setUserForm] = useState({ id: "", email: "", password: "", role: "user" });

  useEffect(() => {
    const handler = setTimeout(() => {
      refresh({ page: 1, search, role: roleFilter });
    }, 350);
    return () => clearTimeout(handler);
  }, [search, roleFilter, refresh]);

  const closeModal = useCallback(() => {
    setModalMode(null);
    setUserForm({ id: "", email: "", password: "", role: "user" });
  }, []);

  useEffect(() => {
    if (!modalMode) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape" && !loading) {
        closeModal();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [closeModal, loading, modalMode]);

  const stats = useMemo(() => {
    const totalUsers = meta.total || 0;
    const adminCount = meta.roleSummary?.admin || 0;
    const userCount = meta.roleSummary?.user || 0;
    const totalGenerations = users.reduce(
      (sum, entry) => sum + (entry.generationCount || 0),
      0
    );
    return [
      { label: "Tổng tài khoản", value: totalUsers, description: "Toàn bộ người dùng" },
      { label: "Admin", value: adminCount, description: "Quyền quản trị" },
      { label: "Người dùng", value: userCount, description: "Tài khoản tiêu chuẩn" },
      { label: "Lượt sinh", value: totalGenerations, description: "Tổng lượt trang hiện tại" },
    ];
  }, [meta, users]);

  const currentRoleQuery = roleFilter === "all" ? "" : roleFilter;
  const totalPages = Math.max(1, Math.ceil((meta.total || 0) / (meta.pageSize || 20)));
  const from = meta.total ? (meta.page - 1) * meta.pageSize + 1 : 0;
  const to = Math.min(meta.page * meta.pageSize, meta.total || 0);

  const openCreateModal = () => {
    setActionMessage("");
    setUserForm({ id: "", email: "", password: "", role: "user" });
    setModalMode("create");
  };

  const openEditModal = (user) => {
    setActionMessage("");
    setUserForm({ id: user.id, email: user.email, password: "", role: user.role });
    setModalMode("edit");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setActionMessage("");

    if (!userForm.email || (modalMode === "create" && !userForm.password)) {
      setActionMessage("Cần nhập đủ email và mật khẩu");
      return;
    }

    const payload = {
      email: userForm.email,
      role: userForm.role,
    };
    if (userForm.password) payload.password = userForm.password;

    const result = modalMode === "create"
      ? await createUser(payload)
      : await updateUser(userForm.id, payload);

    if (result?.ok) {
      setActionMessage(modalMode === "create" ? "Đã thêm tài khoản mới" : "Đã cập nhật tài khoản");
      closeModal();
      return;
    }

    setActionMessage(result?.message || "Không thể lưu tài khoản");
  };

  const handleDelete = async (user) => {
    if (!confirm(`Xóa tài khoản ${user.email}?`)) return;
    const result = await removeUser(user.id);
    setActionMessage(result?.ok ? "Đã xóa tài khoản" : result?.message || "Không xóa được tài khoản");
  };

  const handlePromote = async (user) => {
    const result = await updateRole(user.id, "admin");
    setActionMessage(result?.ok ? "Đã cấp quyền admin" : result?.message || "Không thể cấp quyền");
  };

  const goToPage = (page) => {
    refresh({ page, search, role: currentRoleQuery });
  };

  return (
    <section className="admin-surface" aria-label="Quản lý tài khoản">
      <div className="admin-panel" style={{ marginBottom: "12px", padding: "18px 22px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
          <div>
            <p className="admin-eyebrow">Người dùng</p>
            <h2 style={{ margin: 0 }}>Tài khoản người dùng</h2>
          </div>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
            {actionMessage ? <span className="admin-card__meta">{actionMessage}</span> : null}
            <button
              type="button"
              className="admin-button admin-button--ghost"
              onClick={() => refresh({ search, role: currentRoleQuery })}
              disabled={loading}
            >
              Làm mới
            </button>
            <button type="button" className="admin-button" onClick={openCreateModal} disabled={loading}>
              + Thêm tài khoản
            </button>
          </div>
        </div>
      </div>

      <div className="admin-grid admin-grid--stats" style={{ marginBottom: "12px" }}>
        {stats.map((item) => (
          <UserStat key={item.label} {...item} />
        ))}
      </div>

      <div className="admin-card" style={{ marginBottom: "12px", padding: "14px 20px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "minmax(260px, 1.5fr) minmax(220px, 1fr)", gap: "14px", alignItems: "end" }}>
          <label>
            <span className="admin-input__label">Tìm kiếm</span>
            <div className="admin-input">
              <input
                type="search"
                placeholder="Nhập email hoặc tên người dùng"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
          </label>
          <label>
            <span className="admin-input__label">Phân quyền</span>
            <select
              className="admin-input"
              value={roleFilter}
              onChange={(event) => setRoleFilter(event.target.value)}
            >
              {ROLE_FILTERS.map((filter) => (
                <option key={filter.value} value={filter.value}>{filter.label}</option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <article className="admin-card admin-card--table">
        <header className="admin-card__header admin-card__header--table">
          <div>
            <p className="admin-eyebrow">Danh sách người dùng</p>
            <h3>Hiển thị {users.length}/{meta.total || 0} tài khoản</h3>
          </div>
          <span className="admin-pill admin-pill--ghost">Trang {meta.page}/{totalPages}</span>
        </header>

        {error ? <div className="admin-empty">{error}</div> : null}

        {users.length ? (
          <>
            <div className="admin-table" role="table" style={{ minHeight: 560 }}>
              <div
                className="admin-table__head"
                role="rowgroup"
                style={{ gridTemplateColumns: "1.7fr 0.8fr 0.9fr 1fr 1.3fr" }}
              >
                <span role="columnheader">Tài khoản</span>
                <span role="columnheader">Quyền</span>
                <span role="columnheader">Lượt sinh</span>
                <span role="columnheader">Tạo lúc</span>
                <span role="columnheader">Actions</span>
              </div>
              <div className="admin-table__body" role="rowgroup">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="admin-table__row"
                    role="row"
                    style={{ gridTemplateColumns: "1.7fr 0.8fr 0.9fr 1fr 1.3fr" }}
                  >
                    <div className="admin-table__cell" role="cell" data-label="Tài khoản">
                      <p className="admin-table__title">{deriveNameFromEmail(user.email)}</p>
                      <p className="admin-table__muted">{user.email}</p>
                    </div>
                    <div className="admin-table__cell" role="cell" data-label="Quyền">
                      <span className={`admin-badge admin-badge--${user.role === "admin" ? "accent" : "muted"}`}>
                        {user.role === "admin" ? "Admin" : "User"}
                      </span>
                    </div>
                    <div className="admin-table__cell" role="cell" data-label="Lượt sinh">
                      <p className="admin-table__value">{user.generationCount || 0}</p>
                      <p className="admin-table__muted">Gần nhất: {formatDate(user.lastGenerationAt)}</p>
                    </div>
                    <div className="admin-table__cell" role="cell" data-label="Tạo lúc">
                      <p className="admin-table__muted">{formatDate(user.createdAt)}</p>
                    </div>
                    <div className="admin-table__cell admin-table__cell--action" role="cell" data-label="Actions">
                      <button type="button" className="admin-button admin-button--ghost" onClick={() => openEditModal(user)} disabled={loading}>Sửa</button>
                      {user.role !== "admin" ? (
                        <button type="button" className="admin-button admin-button--ghost" onClick={() => handlePromote(user)} disabled={loading}>Cấp admin</button>
                      ) : null}
                      <button type="button" className="admin-button admin-button--danger" onClick={() => handleDelete(user)} disabled={loading}>Xóa</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "12px", padding: "16px 20px" }}>
              <span className="admin-table__muted">{from}-{to} / {meta.total || 0} mục</span>
              <button type="button" className="admin-button admin-button--ghost" onClick={() => goToPage(meta.page - 1)} disabled={loading || meta.page <= 1}>Trước</button>
              <span className="admin-badge admin-badge--accent">{meta.page}</span>
              <button type="button" className="admin-button admin-button--ghost" onClick={() => goToPage(meta.page + 1)} disabled={loading || meta.page >= totalPages}>Sau</button>
            </div>
          </>
        ) : (
          <div className="admin-empty">
            {loading ? "Đang tải dữ liệu người dùng..." : "Không có người dùng nào phù hợp bộ lọc."}
          </div>
        )}
      </article>

      {modalMode && (
        <AdminModal
          title={modalMode === "create" ? "Thêm tài khoản" : "Chỉnh sửa tài khoản"}
          onClose={closeModal}
        >
          <form className="admin-form" onSubmit={handleSubmit}>
            <label className="admin-input__label" htmlFor="user-email">Email</label>
            <div className="admin-input">
              <input
                id="user-email"
                type="email"
                value={userForm.email}
                onChange={(event) => setUserForm({ ...userForm, email: event.target.value })}
                required
              />
            </div>

            <label className="admin-input__label" htmlFor="user-password">
              {modalMode === "create" ? "Mật khẩu" : "Mật khẩu mới (tùy chọn)"}
            </label>
            <div className="admin-input">
              <input
                id="user-password"
                type="password"
                value={userForm.password}
                onChange={(event) => setUserForm({ ...userForm, password: event.target.value })}
                required={modalMode === "create"}
              />
            </div>

            <label className="admin-input__label" htmlFor="user-role">Quyền</label>
            <div className="admin-input">
              <select
                id="user-role"
                value={userForm.role}
                onChange={(event) => setUserForm({ ...userForm, role: event.target.value })}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div className="admin-action-row">
              <button type="button" className="admin-button admin-button--ghost" onClick={closeModal} disabled={loading}>Hủy</button>
              <button type="submit" className="admin-button" disabled={loading}>
                {loading ? "Đang xử lý..." : modalMode === "create" ? "Thêm tài khoản" : "Cập nhật"}
              </button>
            </div>
          </form>
        </AdminModal>
      )}
    </section>
  );
}

function UserStat({ label, value, description }) {
  return (
    <article className="admin-stat admin-stat--light">
      <h4>{value}</h4>
      <p>{label}</p>
      <span>{description}</span>
    </article>
  );
}

export default AdminUserManagement;
