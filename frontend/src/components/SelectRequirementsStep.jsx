import WizardNavigation from "./WizardNavigation.jsx";

// Ngũ Hành - Five Elements với màu sắc phong thủy Việt Nam
const NGU_HANH_OPTIONS = [
  {
    value: "Không",
    element: "auto",
    desc: "Để AI tự chọn màu phù hợp",
    colors: ["#888888"],
    colorDesc: "Tự động",
    icon: "✨",
  },
  {
    value: "Kim",
    element: "metal",
    desc: "Trắng, bạc, xám, vàng kim",
    colors: ["#FFFFFF", "#C0C0C0", "#FFD700", "#E8E8E8"],
    colorDesc: "Trắng tinh khôi, bạc ánh kim, xám thanh lịch",
    icon: "🪙",
  },
  {
    value: "Mộc",
    element: "wood",
    desc: "Xanh lá, xanh lục, ngọc bích",
    colors: ["#228B22", "#32CD32", "#90EE90", "#006400"],
    colorDesc: "Xanh lá tươi mát, xanh ngọc hài hòa",
    icon: "🌿",
  },
  {
    value: "Thủy",
    element: "water",
    desc: "Đen, xanh dương, xanh navy",
    colors: ["#000080", "#4169E1", "#87CEEB", "#1E3A5F"],
    colorDesc: "Xanh nước biển sâu, đen huyền bí",
    icon: "💧",
  },
  {
    value: "Hỏa",
    element: "fire",
    desc: "Đỏ, cam, hồng, tím",
    colors: ["#DC143C", "#FF6347", "#FF69B4", "#8B008B"],
    colorDesc: "Đỏ rực rỡ, cam ấm áp, hồng tươi tắn",
    icon: "🔥",
  },
  {
    value: "Thổ",
    element: "earth",
    desc: "Vàng, nâu, be, đất nung",
    colors: ["#DAA520", "#8B4513", "#D2B48C", "#CD853F"],
    colorDesc: "Vàng đất, nâu gỗ ấm, be tự nhiên",
    icon: "🏔️",
  },
];

function SelectRequirementsStep({
  requirements,
  onChange,
  onBack,
  onNext,
  loading = false,
  apiMessage = "",
}) {
  const handleElementSelect = (option) => {
    onChange({
      ...requirements,
      style: option.value,
      element: option.element,
      colorPalette: option.colorDesc,
      colors: option.colors,
    });
  };

  const selectedOption = NGU_HANH_OPTIONS.find(
    (opt) => opt.value === requirements.style
  );

  return (
    <div className="wizard-card animate-slide-up">
      {loading && (
        <div className="loading-card">
          <div className="loading-card__spinner" />
          <div className="loading-card__text">
            <div className="loading-card__title">Đang xử lý...</div>
            <div className="loading-card__subtitle">Bước 2/3 – Chuẩn bị tạo thiết kế</div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="wizard-card__header">
        <span className="wizard-card__step-badge">Bước 2 / 3</span>
        <h2 className="wizard-card__title">Chọn mệnh Ngũ Hành</h2>
        <p className="wizard-card__subtitle">
          Chọn mệnh phong thủy để AI gợi ý màu sơn phù hợp cho ngôi nhà của bạn
        </p>
      </div>

      {/* Element Selector */}
      <div className="wizard-card__section">
        <div className="element-grid">
          {NGU_HANH_OPTIONS.map((option) => {
            const isActive = option.value === requirements.style;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => handleElementSelect(option)}
                className={`element-card${isActive ? " element-card--active" : ""}`}
                disabled={loading}
              >
                <div className="element-card__icon">{option.icon}</div>
                <div className="element-card__name">{option.value}</div>
                <div className="element-card__colors">
                  {option.colors.map((color, i) => (
                    <span
                      key={i}
                      className="element-card__color"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <div className="element-card__desc">{option.desc}</div>
                {isActive && (
                  <div className="element-card__check">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20,6 9,17 4,12" />
                    </svg>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Info */}
      {selectedOption && selectedOption.value !== "Không" && (
        <div className="wizard-card__section">
          <div className="element-info">
            <div className="element-info__header">
              <span className="element-info__icon">{selectedOption.icon}</span>
              <div>
                <h4 className="element-info__title">Mệnh {selectedOption.value}</h4>
                <p className="element-info__subtitle">Màu sắc hợp phong thủy</p>
              </div>
            </div>
            <div className="element-info__palette">
              {selectedOption.colors.map((color, i) => (
                <div key={i} className="element-info__swatch">
                  <span style={{ backgroundColor: color }} />
                </div>
              ))}
            </div>
            <p className="element-info__desc">{selectedOption.colorDesc}</p>
          </div>
        </div>
      )}

      {apiMessage && (
        <div className="alert alert--info">{apiMessage}</div>
      )}

      <WizardNavigation
        onBack={onBack}
        onNext={onNext}
        disableNext={!requirements.style || loading}
        nextLabel="Tải ảnh nhà & Tạo thiết kế"
        nextLoading={loading}
      />
    </div>
  );
}

export default SelectRequirementsStep;
