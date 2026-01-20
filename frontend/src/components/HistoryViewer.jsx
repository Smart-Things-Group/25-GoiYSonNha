function HistoryViewer({ entries, title, emptyMessage, onDeleteHistory }) {
  return (
    <div className="animate-slide-up">
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "var(--space-8)" }}>
        <div style={{ 
          width: "64px", 
          height: "64px", 
          margin: "0 auto var(--space-4)", 
          borderRadius: "var(--radius-xl)", 
          background: "var(--color-brand-primary-light)", 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center",
          color: "var(--color-brand-primary)"
        }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12,6 12,12 16,14" />
          </svg>
        </div>
        <h1 style={{ fontSize: "var(--text-3xl)", fontWeight: 800, marginBottom: "var(--space-2)" }}>{title}</h1>
        <p style={{ color: "var(--color-text-muted)", maxWidth: "500px", margin: "0 auto" }}>
          Xem lại các phương án thiết kế đã tạo, so sánh và trao đổi với khách hàng.
        </p>
      </div>

      {entries.length > 0 ? (
        <div className="history-grid">
          {entries.map((entry) => {
            const formattedDate = new Date(entry.createdAt).toLocaleString("vi-VN");
            const sampleSrc = entry.sampleImageUrl || entry.sampleImageDataUrl || "";
            const houseSrc = entry.houseImageUrl || entry.houseImageDataUrl || "";
            const resultSrc = entry.outputImageUrl || "";

            return (
              <div key={entry.id} className="history-card">
                <div className="history-card__header">
                  <span className="history-card__id">#{entry.id.slice(0, 8)}</span>
                  <span className="history-card__date">{formattedDate}</span>
                </div>

                <div className="history-card__style">{entry.style || "Chưa xác định"}</div>

                <div className="history-card__details">
                  <div><strong>Màu sơn:</strong> {entry.colorPalette || "—"}</div>
                  <div><strong>Chi tiết:</strong> {entry.decorItems || "—"}</div>
                  {entry.notes && <div style={{ marginTop: "var(--space-2)", fontStyle: "italic" }}>{entry.notes}</div>}
                </div>

                {/* Images */}
                {(resultSrc || sampleSrc || houseSrc) && (
                  <div className="history-card__images">
                    {resultSrc && <img src={resultSrc} alt="Kết quả" style={{ gridColumn: "1 / -1" }} />}
                    {houseSrc && <img src={houseSrc} alt="Hiện trạng" />}
                    {sampleSrc && <img src={sampleSrc} alt="Tham chiếu" />}
                  </div>
                )}

                {typeof onDeleteHistory === "function" && (
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={() => onDeleteHistory(entry.id)}
                    style={{ width: "100%", marginTop: "var(--space-3)", fontSize: "var(--text-sm)" }}
                  >
                    Xóa khỏi lịch sử
                  </button>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="alert alert--info" style={{ maxWidth: "500px", margin: "0 auto", textAlign: "center" }}>
          {emptyMessage}
        </div>
      )}
    </div>
  );
}

export default HistoryViewer;
