import { useRef } from "react";
import WizardNavigation from "./WizardNavigation.jsx";

function UploadSampleStep({
  sampleImage,
  onSampleSelected,
  onNext,
  disableNext,
  loading = false,
  apiMessage = "",
}) {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] ?? null;
    if (file) onSampleSelected(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0] ?? null;
    if (file) onSampleSelected(file);
  };

  const preventDefaults = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const fileName = sampleImage?.file?.name ?? sampleImage?.name ?? "Chưa chọn";

  return (
    <div className="wizard-card animate-slide-up">
      {loading && (
        <div className="loading-card">
          <div className="loading-card__spinner" />
          <div className="loading-card__text">
            <div className="loading-card__title">Đang tải ảnh mẫu lên máy chủ...</div>
            <div className="loading-card__subtitle">Bước 1/4 – Vui lòng giữ trình duyệt mở.</div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="wizard-card__header">
        <span className="wizard-card__step-badge">Bước 1 / 4</span>
        <h2 className="wizard-card__title">Tải ảnh mẫu truyền cảm hứng</h2>
        <p className="wizard-card__subtitle">
          Chọn một bức ảnh ngoại thất bạn yêu thích để AI phân tích phong cách, vật liệu và màu sắc.
        </p>
      </div>

      {/* Upload Zone */}
      <div className="wizard-card__section">
        <div
          className={`upload-zone${sampleImage?.preview ? " upload-zone--has-preview" : ""}`}
          onDragEnter={preventDefaults}
          onDragOver={preventDefaults}
          onDragLeave={preventDefaults}
          onDrop={handleDrop}
          onClick={() => !sampleImage?.preview && fileInputRef.current?.click()}
        >
          {sampleImage?.preview ? (
            <>
              <div className="upload-preview">
                <img src={sampleImage.preview} alt="Ảnh mẫu" />
              </div>
              <div className="upload-preview__info">
                <span className="tag tag--success">✓ Đã chọn</span>
                <span style={{ fontSize: "var(--text-sm)", color: "var(--color-text-muted)" }}>{fileName}</span>
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
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <path d="m21 15-5-5L5 21" />
                </svg>
              </div>
              <h3 className="upload-zone__title">Kéo thả ảnh vào đây</h3>
              <p className="upload-zone__text">hoặc click để chọn từ máy tính</p>
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
                    Đang tải...
                  </>
                ) : (
                  "Chọn ảnh mẫu"
                )}
              </button>
              <p className="upload-zone__hint">Hỗ trợ JPG, PNG - Tối đa 15MB</p>
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
      </div>

      {/* Tips */}
      <div className="wizard-card__section">
        <div style={{ display: "grid", gap: "var(--space-3)" }}>
          <div className="info-card">
            <div className="info-card__icon">📐</div>
            <div className="info-card__content">
              <div className="info-card__title">Bố cục rõ ràng</div>
              <p className="info-card__text">Chọn ảnh có góc chụp chính diện hoặc 3/4</p>
            </div>
          </div>
          <div className="info-card">
            <div className="info-card__icon">💡</div>
            <div className="info-card__content">
              <div className="info-card__title">Ánh sáng tốt</div>
              <p className="info-card__text">Ảnh ban ngày giúp nhận diện màu sắc chính xác</p>
            </div>
          </div>
          <div className="info-card">
            <div className="info-card__icon">🎨</div>
            <div className="info-card__content">
              <div className="info-card__title">Phong cách yêu thích</div>
              <p className="info-card__text">Chọn ảnh có màu sơn và kiến trúc bạn muốn áp dụng</p>
            </div>
          </div>
        </div>
      </div>

      {apiMessage && (
        <div className="alert alert--info">{apiMessage}</div>
      )}

      <WizardNavigation
        onBack={() => {}}
        disableBack
        disableNext={disableNext}
        onNext={onNext}
        nextLoading={loading}
      />
    </div>
  );
}

export default UploadSampleStep;
