import { useRef } from "react";
import WizardNavigation from "./WizardNavigation.jsx";

function UploadHouseStep({
  houseImage,
  sampleImage,
  requirements,
  onHouseSelected,
  onBack,
  onNext,
  loading = false,
  apiMessage = "",
}) {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] ?? null;
    onHouseSelected(file);
  };

  const preventDefaults = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0] ?? null;
    onHouseSelected(file);
  };

  return (
    <div className="wizard-card animate-slide-up">
      {loading && (
        <div className="loading-card">
          <div className="loading-card__spinner" />
          <div className="loading-card__text">
            <div className="loading-card__title">Đang tạo thiết kế với AI...</div>
            <div className="loading-card__subtitle">Bước 3/4 – Quá trình có thể mất 30-60 giây.</div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="wizard-card__header">
        <span className="wizard-card__step-badge">Bước 3 / 4</span>
        <h2 className="wizard-card__title">Tải ảnh căn nhà hiện tại</h2>
        <p className="wizard-card__subtitle">
          Tải ảnh mặt tiền căn nhà của bạn để AI áp dụng phong cách và màu sơn đã chọn.
        </p>
      </div>

      {/* Main Content - Two Column */}
      <div className="wizard-card__section" style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "var(--space-6)", alignItems: "start" }}>
        {/* Upload Zone */}
        <div
          className={`upload-zone${houseImage?.preview ? " upload-zone--has-preview" : ""}`}
          onDragEnter={preventDefaults}
          onDragOver={preventDefaults}
          onDrop={handleDrop}
          onClick={() => !houseImage?.preview && fileInputRef.current?.click()}
          style={{ maxWidth: "none" }}
        >
          {houseImage?.preview ? (
            <>
              <div className="upload-preview">
                <img src={houseImage.preview} alt="Ảnh hiện trạng" />
              </div>
              <div className="upload-preview__info">
                <span className="tag tag--success">✓ Đã chọn</span>
              </div>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                disabled={loading}
              >
                Thay đổi ảnh
              </button>
            </>
          ) : (
            <>
              <div className="upload-zone__icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4.5 10.5 12 5l7.5 5.5" />
                  <path d="M6.5 10v8.5h11V10" />
                  <path d="M10.5 18.5v-3.5h3v3.5" />
                </svg>
              </div>
              <h3 className="upload-zone__title">Tải ảnh mặt tiền căn nhà</h3>
              <p className="upload-zone__text">Kéo thả hoặc click để chọn</p>
              <button
                type="button"
                className={`btn btn-primary${loading ? " btn--loading" : ""}`}
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                disabled={loading}
                style={{ marginTop: "var(--space-4)" }}
              >
                {loading ? (
                  <>
                    <span className="btn__spinner" />
                    Đang gửi...
                  </>
                ) : (
                  "Chọn ảnh"
                )}
              </button>
              <p className="upload-zone__hint">Chụp chính diện, đủ sáng để có kết quả tốt nhất</p>
            </>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
        </div>

        {/* Summary */}
        <div style={{ background: "var(--color-surface-muted)", borderRadius: "var(--radius-xl)", padding: "var(--space-5)", border: "1px solid var(--color-border-light)" }}>
          <h4 style={{ fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--color-brand-primary)", marginBottom: "var(--space-4)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Tóm tắt yêu cầu
          </h4>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
            <div>
              <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", marginBottom: "var(--space-1)" }}>Phong cách</div>
              <div style={{ fontSize: "var(--text-sm)", color: "var(--color-text-primary)", fontWeight: 500 }}>{requirements.style || "Chưa chọn"}</div>
            </div>
            <div>
              <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", marginBottom: "var(--space-1)" }}>Bảng màu</div>
              <div style={{ fontSize: "var(--text-sm)", color: "var(--color-text-primary)" }}>{requirements.colorPalette || "Chưa cung cấp"}</div>
            </div>
            <div>
              <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", marginBottom: "var(--space-1)" }}>Chi tiết trang trí</div>
              <div style={{ fontSize: "var(--text-sm)", color: "var(--color-text-primary)" }}>{requirements.decorItems || "Chưa cung cấp"}</div>
            </div>
            
            {sampleImage?.preview && (
              <div style={{ marginTop: "var(--space-2)", paddingTop: "var(--space-4)", borderTop: "1px solid var(--color-border-light)" }}>
                <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", marginBottom: "var(--space-2)" }}>Ảnh mẫu tham chiếu</div>
                <img 
                  src={sampleImage.preview} 
                  alt="Ảnh mẫu" 
                  style={{ width: "100%", borderRadius: "var(--radius-lg)", maxHeight: "120px", objectFit: "cover" }} 
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {apiMessage && (
        <div className="alert alert--info">{apiMessage}</div>
      )}

      <WizardNavigation
        onBack={onBack}
        onNext={onNext}
        disableNext={!houseImage || loading}
        nextLabel="Tạo thiết kế với AI"
        nextLoading={loading}
      />
    </div>
  );
}

export default UploadHouseStep;
