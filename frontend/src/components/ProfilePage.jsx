import { useEffect, useMemo, useState } from "react";
import { fetchMixMatchHistory } from "../api/mixmatch";
import BeforeAfterSlider from "./BeforeAfterSlider";

function ProfilePage({ user, historyEntries = [], onDeleteHistory }) {
  const [expandedId, setExpandedId] = useState(null);
  const [mixmatchHistory, setMixmatchHistory] = useState([]);

  useEffect(() => {
    if (user?.token) {
      fetchMixMatchHistory(user.token)
        .then((res) => {
          if (res.ok) setMixmatchHistory(res.items || []);
        })
        .catch((err) => console.error("Load mixmatch history:", err));
    }
  }, [user?.token]);

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
          <span className="profile-stat__label">Ngũ Hành</span>
        </div>
        <div className="profile-stat">
          <span className="profile-stat__value">{mixmatchHistory.length}</span>
          <span className="profile-stat__label">Mix & Match</span>
        </div>
        <div className="profile-stat">
          <span className="profile-stat__value">{sortedHistory.length + mixmatchHistory.length}</span>
          <span className="profile-stat__label">Tổng dự án</span>
        </div>
      </div>

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

                  {(() => {
                    const houseSrc = entry.houseImageUrl || entry.houseImageDataUrl;
                    const resultSrc = entry.outputImageUrl;
                    if (houseSrc && resultSrc) {
                      return (
                        <div style={{ marginTop: "var(--space-3)" }}>
                          <BeforeAfterSlider beforeSrc={houseSrc} afterSrc={resultSrc} />
                        </div>
                      );
                    }
                    if (resultSrc) {
                      return (
                        <div className="history-card__images">
                          <img src={resultSrc} alt="Kết quả" />
                        </div>
                      );
                    }
                    return null;
                  })()}

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

      {/* MixMatch History */}
      <div className="profile-section">
        <div className="profile-section__header">
          <h2 className="profile-section__title">Lịch sử Mix & Match</h2>
          <span className="tag">{mixmatchHistory.length} dự án</span>
        </div>

        {mixmatchHistory.length > 0 ? (
          <div className="history-grid">
            {mixmatchHistory.map((item) => (
              <div key={item.Id} className="history-card">
                <div className="history-card__header">
                  <span className="history-card__id">#{item.Id}</span>
                  <span className="history-card__date">
                    {new Date(item.CreatedAt).toLocaleString("vi-VN")}
                  </span>
                </div>

                {/* Before/After Slider */}
                {item.InputImageUrl && item.OutputImageUrl ? (
                  <div style={{ marginTop: "var(--space-3)" }}>
                    <BeforeAfterSlider beforeSrc={item.InputImageUrl} afterSrc={item.OutputImageUrl} />
                  </div>
                ) : item.InputImageUrl ? (
                  <div className="history-card__images" style={{ marginTop: "var(--space-3)" }}>
                    <img src={item.InputImageUrl} alt="Ảnh gốc" />
                  </div>
                ) : null}

                {/* Details */}
                <div className="history-card__details" style={{ marginTop: "var(--space-3)" }}>
                  {item.RegionalStyleName && (
                    <div>Vùng miền: <strong>{item.RegionalStyleName}</strong></div>
                  )}
                  <div style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap", marginTop: "var(--space-2)" }}>
                    {item.WallColorName && (
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: "var(--text-sm)" }}>
                        <span style={{ width: 12, height: 12, borderRadius: 3, backgroundColor: item.WallHexCode, border: "1px solid rgba(0,0,0,0.15)", display: "inline-block" }} />
                        Tường: {item.WallColorName}
                      </span>
                    )}
                    {item.RoofColorName && (
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: "var(--text-sm)" }}>
                        <span style={{ width: 12, height: 12, borderRadius: 3, backgroundColor: item.RoofHexCode, border: "1px solid rgba(0,0,0,0.15)", display: "inline-block" }} />
                        Mái: {item.RoofColorName}
                      </span>
                    )}
                    {item.ColumnColorName && (
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: "var(--text-sm)" }}>
                        <span style={{ width: 12, height: 12, borderRadius: 3, backgroundColor: item.ColumnHexCode, border: "1px solid rgba(0,0,0,0.15)", display: "inline-block" }} />
                        Cột: {item.ColumnColorName}
                      </span>
                    )}
                  </div>
                </div>

                {item.Status === "failed" && (
                  <div style={{ marginTop: "var(--space-2)", color: "var(--color-error)", fontSize: "var(--text-sm)" }}>
                    AI generation thất bại
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="alert alert--info">
            Bạn chưa có dự án Mix & Match nào.
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfilePage;
