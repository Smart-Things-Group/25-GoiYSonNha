import { useEffect, useState, useRef } from "react";

function ResultStep({
  data,
  onHouseSelected,
  onGenerate,
  onSaveHistory,
  onBack,
  onRestart,
  onRegenerate,
  apiMessage = "",
  loading = false,
}) {
  const [notes, setNotes] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);
  const fileInputRef = useRef(null);

  const { requirements, houseImage, result } = data || {};

  const houseImageSrc = houseImage?.preview || houseImage?.dataUrl || houseImage?.url || "";
  
  const outputImages = result?.data?.outputImages || {};
  const resultImageSrc = outputImages.single || 
                        result?.data?.outputImage || 
                        outputImages.stability || 
                        outputImages.replicate || 
                        outputImages.huggingface || 
                        "";

  // Determine current state
  const hasHouseImage = !!houseImageSrc;
  const hasResult = !!resultImageSrc;

  useEffect(() => {
    if (hasResult) {
      setNotes("");
      setIsSaved(false);
    }
  }, [resultImageSrc]);

  const handleSave = () => {
    if (isSaved) return;
    onSaveHistory(notes.trim());
    setIsSaved(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] ?? null;
    if (file && onHouseSelected) onHouseSelected(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0] ?? null;
    if (file && onHouseSelected) onHouseSelected(file);
  };

  const preventDefaults = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // Slider handlers
  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);
  
  const handleMove = (clientX) => {
    if (!isDragging || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const handleMouseMove = (e) => handleMove(e.clientX);
  const handleTouchMove = (e) => handleMove(e.touches[0].clientX);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mouseup", handleMouseUp);
      document.addEventListener("touchend", handleMouseUp);
    }
    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("touchend", handleMouseUp);
    };
  }, [isDragging]);

  // Get element info
  const elementName = requirements?.style || "Tự động";
  const elementIcon = {
    "Kim": "🪙", "Mộc": "🌿", "Thủy": "💧", "Hỏa": "🔥", "Thổ": "🏔️", "Không": "✨"
  }[elementName] || "✨";

  // STATE 1: No house image yet - show upload
  if (!hasHouseImage) {
    return (
      <div className="wizard-card animate-slide-up">
        <div className="wizard-card__header">
          <span className="wizard-card__step-badge">Bước 3 / 3</span>
          <h2 className="wizard-card__title">Tải ảnh căn nhà của bạn</h2>
          <p className="wizard-card__subtitle">
            Tải ảnh mặt tiền căn nhà để AI áp dụng màu sơn mệnh {elementName}
          </p>
        </div>

        {/* Upload Zone */}
        <div className="wizard-card__section">
          <div
            className="upload-zone"
            onDragEnter={preventDefaults}
            onDragOver={preventDefaults}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="upload-zone__icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4.5 10.5 12 5l7.5 5.5" />
                <path d="M6.5 10v8.5h11V10" />
                <path d="M10.5 18.5v-3.5h3v3.5" />
              </svg>
            </div>
            <h3 className="upload-zone__title">Kéo thả ảnh vào đây</h3>
            <p className="upload-zone__text">hoặc click để chọn từ máy tính</p>
            <p className="upload-zone__hint">Chụp chính diện, đủ sáng để có kết quả tốt nhất</p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
          </div>
        </div>

        {/* Element Summary */}
        <div className="wizard-card__section">
          <div className="element-info">
            <div className="element-info__header">
              <span className="element-info__icon">{elementIcon}</span>
              <div>
                <h4 className="element-info__title">Mệnh {elementName}</h4>
                <p className="element-info__subtitle">{requirements?.colorPalette || "Màu sắc phong thủy"}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="wizard-nav">
          <button type="button" className="btn btn-secondary" onClick={onBack}>
            ← Quay lại
          </button>
        </div>
      </div>
    );
  }

  // STATE 2: Has house image but no result yet - show preview + generate button
  if (!hasResult) {
    return (
      <div className="wizard-card animate-slide-up">
        {loading && (
          <div className="loading-card">
            <div className="loading-card__spinner" />
            <div className="loading-card__text">
              <div className="loading-card__title">AI đang tạo thiết kế...</div>
              <div className="loading-card__subtitle">Quá trình có thể mất 30-60 giây</div>
            </div>
          </div>
        )}

        <div className="wizard-card__header">
          <span className="wizard-card__step-badge">Bước 3 / 3</span>
          <h2 className="wizard-card__title">Xác nhận và tạo thiết kế</h2>
          <p className="wizard-card__subtitle">
            Kiểm tra ảnh nhà và bấm tạo để AI sơn màu mệnh {elementName}
          </p>
        </div>

        {/* House Image Preview */}
        <div className="wizard-card__section">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-4)" }}>
            <div>
              <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-muted)", marginBottom: "var(--space-2)" }}>Ảnh căn nhà</p>
              <div style={{ borderRadius: "var(--radius-xl)", overflow: "hidden", border: "1px solid var(--color-border-light)" }}>
                <img src={houseImageSrc} alt="Căn nhà" style={{ width: "100%", display: "block" }} />
              </div>
              <button 
                type="button" 
                className="btn btn-ghost" 
                onClick={() => fileInputRef.current?.click()}
                style={{ width: "100%", marginTop: "var(--space-2)" }}
                disabled={loading}
              >
                Đổi ảnh khác
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
            </div>
            <div className="element-info">
              <div className="element-info__header">
                <span className="element-info__icon">{elementIcon}</span>
                <div>
                  <h4 className="element-info__title">Mệnh {elementName}</h4>
                  <p className="element-info__subtitle">Màu sắc sẽ được áp dụng</p>
                </div>
              </div>
              <p className="element-info__desc" style={{ marginTop: "var(--space-3)" }}>
                {requirements?.colorPalette || "Màu sắc phong thủy phù hợp"}
              </p>
            </div>
          </div>
        </div>

        {apiMessage && (
          <div className="alert alert--info">{apiMessage}</div>
        )}

        <div className="wizard-nav">
          <button type="button" className="btn btn-secondary" onClick={onBack} disabled={loading}>
            ← Quay lại
          </button>
          <button 
            type="button" 
            className="btn btn-primary" 
            onClick={onGenerate}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="btn__spinner" />
                Đang tạo...
              </>
            ) : (
              "🎨 Tạo thiết kế"
            )}
          </button>
        </div>
      </div>
    );
  }

  // STATE 3: Has result - show comparison slider
  return (
    <div className="result-page animate-slide-up">
      {loading && (
        <div className="loading-card">
          <div className="loading-card__spinner" />
          <div className="loading-card__text">
            <div className="loading-card__title">AI đang tạo thiết kế mới...</div>
            <div className="loading-card__subtitle">Vui lòng chờ trong giây lát</div>
          </div>
        </div>
      )}

      {/* Compact Header */}
      <div className="result-header">
        <div className="result-header__info">
          <span className="result-header__icon">{elementIcon}</span>
          <div>
            <h2 className="result-header__title">Kết quả - Mệnh {elementName}</h2>
            <p className="result-header__subtitle">{requirements?.colorPalette || "Màu sắc phong thủy"}</p>
          </div>
        </div>
        <div className="result-header__actions">
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={onRegenerate}
            disabled={loading}
          >
            🔄 Tạo lại
          </button>
        </div>
      </div>

      {/* Image Comparison Slider */}
      <div className="comparison-container">
        <div 
          ref={containerRef}
          className="comparison-slider"
          onMouseMove={handleMouseMove}
          onTouchMove={handleTouchMove}
        >
          {/* Before Image (House) */}
          <div className="comparison-slider__before">
            <img src={houseImageSrc} alt="Ảnh gốc" />
            <span className="comparison-slider__label comparison-slider__label--before">
              Trước
            </span>
          </div>
          
          {/* After Image (Result) - Clipped */}
          <div 
            className="comparison-slider__after"
            style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
          >
            <img src={resultImageSrc} alt="Sau khi sơn" />
            <span className="comparison-slider__label comparison-slider__label--after">
              Sau
            </span>
          </div>
          
          {/* Slider Handle */}
          <div 
            className="comparison-slider__handle"
            style={{ left: `${sliderPosition}%` }}
            onMouseDown={handleMouseDown}
            onTouchStart={handleMouseDown}
          >
            <div className="comparison-slider__handle-line" />
            <div className="comparison-slider__handle-circle">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8L22 12L18 16" />
                <path d="M6 8L2 12L6 16" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Slider Hint */}
      <p className="comparison-hint">
        👆 Kéo thanh trượt sang trái/phải để so sánh
      </p>

      {apiMessage && (
        <div className="alert alert--info" style={{ marginTop: "var(--space-4)" }}>{apiMessage}</div>
      )}

      {/* Action Bar */}
      <div className="result-actions">
        <button 
          type="button" 
          className="btn btn-ghost"
          onClick={onRestart}
        >
          ← Làm mới từ đầu
        </button>
        
        <div className="result-actions__right">
          <input
            type="text"
            className="result-actions__note"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Ghi chú nhanh..."
          />
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaved}
            className="btn btn-primary"
          >
            {isSaved ? "✓ Đã lưu" : "💾 Lưu kết quả"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ResultStep;
