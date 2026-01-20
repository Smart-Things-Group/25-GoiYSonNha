import { useMemo, useState } from "react";

function ProfilePage({ user, historyEntries = [], draft, onDeleteHistory }) {
  const { requirements = {}, sampleImage = null, houseImage = null } = draft || {};
  const [expandedId, setExpandedId] = useState(null);

  const hasDraftDetails = Boolean(sampleImage || houseImage) ||
    Boolean(requirements.colorPalette || requirements.decorItems || requirements.aiSuggestions || requirements.style);

  const sortedHistory = useMemo(() => {
    return [...historyEntries].sort((a, b) => {
      const dateA = a?.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b?.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });
  }, [historyEntries]);

  const displayInitials = useMemo(() => {
    const name = user?.name || user?.email || "";
    if (!name) return "U";
    const parts = name.split(/\s+/);
    return parts.map((p) => p.charAt(0)).join("").slice(0, 2).toUpperCase() || "U";
  }, [user?.name, user?.email]);

  return (
    <div className="animate-slide-up" style={{ maxWidth: "900px", margin: "0 auto" }}>
      {/* Profile Header */}
      <div className="profile-header">
        <div className="profile-avatar">{displayInitials}</div>
        <div className="profile-info">
          <h1 className="profile-info__name">{user?.name || "Người dùng"}</h1>
          <p className="profile-info__email">{user?.email}</p>
          <span className="profile-info__role">
            {user?.role === "admin" ? "Quản trị viên" : "Khách hàng"}
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="profile-stats">
        <div className="profile-stat">
          <span className="profile-stat__value">{sortedHistory.length}</span>
          <span className="profile-stat__label">Dự án đã lưu</span>
        </div>
        <div className="profile-stat">
          <span className="profile-stat__value">{hasDraftDetails ? "1" : "0"}</span>
          <span className="profile-stat__label">Bản nháp</span>
        </div>
      </div>

      {/* Current Draft */}
      {hasDraftDetails && (
        <div className="profile-section">
          <div className="profile-section__header">
            <h2 className="profile-section__title">Dự án đang thực hiện</h2>
            <span className="tag tag--primary">Đang tiến hành</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "var(--space-4)" }}>
            <div>
              <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", marginBottom: "var(--space-1)" }}>Phong cách</div>
              <div style={{ fontWeight: 500 }}>{requirements.style || "Chưa chọn"}</div>
            </div>
            <div>
              <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", marginBottom: "var(--space-1)" }}>Bảng màu</div>
              <div>{requirements.colorPalette || "Chưa nhập"}</div>
            </div>
            <div>
              <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", marginBottom: "var(--space-1)" }}>Chi tiết</div>
              <div>{requirements.decorItems || "Chưa nhập"}</div>
            </div>
          </div>
          {(sampleImage || houseImage) && (
            <div style={{ display: "flex", gap: "var(--space-4)", marginTop: "var(--space-4)", paddingTop: "var(--space-4)", borderTop: "1px solid var(--color-border-light)" }}>
              {sampleImage && (
                <div>
                  <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", marginBottom: "var(--space-2)" }}>Ảnh mẫu</div>
                  <img src={sampleImage.preview || sampleImage.dataUrl} alt="Ảnh mẫu" style={{ width: "120px", borderRadius: "var(--radius-lg)" }} />
                </div>
              )}
              {houseImage && (
                <div>
                  <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", marginBottom: "var(--space-2)" }}>Ảnh hiện trạng</div>
                  <img src={houseImage.preview || houseImage.dataUrl} alt="Ảnh hiện trạng" style={{ width: "120px", borderRadius: "var(--radius-lg)" }} />
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* History */}
      <div className="profile-section">
        <div className="profile-section__header">
          <h2 className="profile-section__title">Lịch sử dự án</h2>
          <span className="tag">{sortedHistory.length} dự án</span>
        </div>

        {sortedHistory.length > 0 ? (
          <div className="history-grid">
            {sortedHistory.map((entry) => {
              const formattedDate = entry?.createdAt
                ? new Date(entry.createdAt).toLocaleString("vi-VN")
                : "—";
              const isExpanded = expandedId === entry.id;

              return (
                <div key={entry.id} className="history-card">
                  <div className="history-card__header">
                    <span className="history-card__id">#{(entry.id || "").slice(0, 8)}</span>
                    <span className="history-card__date">{formattedDate}</span>
                  </div>
                  <div className="history-card__style">{entry.style || "Chưa rõ"}</div>
                  <div className="history-card__details">
                    <div>Màu: {entry.colorPalette || "—"}</div>
                    <div>Chi tiết: {entry.decorItems || "—"}</div>
                  </div>

                  {entry.outputImageUrl && (
                    <div className="history-card__images">
                      <img src={entry.outputImageUrl} alt="Kết quả" />
                    </div>
                  )}

                  <div style={{ display: "flex", gap: "var(--space-2)", marginTop: "var(--space-3)" }}>
                    <button
                      type="button"
                      onClick={() => setExpandedId(isExpanded ? null : entry.id)}
                      className="btn btn-ghost"
                      style={{ flex: 1, fontSize: "var(--text-sm)" }}
                    >
                      {isExpanded ? "Thu gọn" : "Chi tiết"}
                    </button>
                    {typeof onDeleteHistory === "function" && (
                      <button
                        type="button"
                        onClick={() => onDeleteHistory(entry.id)}
                        className="btn btn-ghost"
                        style={{ fontSize: "var(--text-sm)" }}
                      >
                        Xóa
                      </button>
                    )}
                  </div>

                  {isExpanded && (
                    <div style={{ marginTop: "var(--space-4)", paddingTop: "var(--space-4)", borderTop: "1px solid var(--color-border-light)", fontSize: "var(--text-sm)", color: "var(--color-text-muted)" }}>
                      <div style={{ marginBottom: "var(--space-2)" }}>
                        <strong>Ghi chú AI:</strong> {entry.aiSuggestions || "Không có"}
                      </div>
                      {entry.notes && (
                        <div><strong>Ghi chú:</strong> {entry.notes}</div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="alert alert--info">
            Bạn chưa lưu dự án nào. Hoàn tất quy trình thiết kế để lưu lại.
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfilePage;
