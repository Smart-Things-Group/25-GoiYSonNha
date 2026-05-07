import { useState, useEffect, useRef } from "react";
import {
  fetchRegionalStyles,
  fetchPaintBrands,
  fetchPaintColors,
  generateMixMatch,
} from "../api/mixmatch";
import BeforeAfterSlider from "./BeforeAfterSlider";

/* ─── Regional Style Modal ─── */
function RegionalStyleModal({ styles, selectedId, onSelect, onClose }) {
  const [filter, setFilter] = useState("all");

  const regions = ["all", ...new Set(styles.map((s) => s.regionName))];

  const filtered = filter === "all" ? styles : styles.filter((s) => s.regionName === filter);

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "var(--color-surface)",
          borderRadius: "16px",
          width: "90%",
          maxWidth: "800px",
          maxHeight: "80vh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
        }}
      >
        {/* Modal header */}
        <div style={{ padding: "20px 24px 12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 700, color: "var(--color-text-primary)" }}>
            Chọn mẫu vùng miền
          </h3>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", fontSize: "1.5rem", cursor: "pointer", color: "var(--color-text-muted)", padding: 4 }}
          >
            &times;
          </button>
        </div>

        {/* Filter tabs */}
        <div style={{ padding: "0 24px 12px", display: "flex", gap: 8, flexWrap: "wrap" }}>
          {regions.map((r) => (
            <button
              key={r}
              onClick={() => setFilter(r)}
              className={`btn ${filter === r ? "btn-primary" : "btn-secondary"}`}
              style={{ fontSize: "0.8rem", padding: "6px 14px" }}
            >
              {r === "all" ? "Tất cả" : r}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div style={{ padding: "0 24px 24px", overflow: "auto", flex: 1 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {filtered.map((style) => (
              <button
                key={style.id}
                onClick={() => {
                  onSelect(style.id);
                  onClose();
                }}
                style={{
                  padding: 0,
                  border: selectedId === style.id ? "3px solid var(--color-brand-primary)" : "1px solid var(--color-border-light)",
                  borderRadius: 12,
                  background: "var(--color-bg-primary)",
                  cursor: "pointer",
                  overflow: "hidden",
                  transition: "all 0.2s",
                  textAlign: "left",
                }}
              >
                {style.imageUrl && (
                  <img
                    src={style.imageUrl}
                    alt={style.regionName}
                    style={{ width: "100%", height: 140, objectFit: "cover" }}
                  />
                )}
                <div style={{ padding: "10px 12px" }}>
                  <div style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--color-text-primary)" }}>{style.regionName}</div>
                  {style.description && (
                    <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", marginTop: 4, lineHeight: 1.4 }}>
                      {style.description.substring(0, 60)}{style.description.length > 60 ? "..." : ""}
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Main MixMatchPage ─── */
export default function MixMatchPage({ user, pushToast }) {
  // State cho ảnh nhà thô
  const [houseFile, setHouseFile] = useState(null);
  const [housePreview, setHousePreview] = useState(null);
  const fileInputRef = useRef(null);

  // State cho regional styles
  const [regionalStyles, setRegionalStyles] = useState([]);
  const [selectedStyleId, setSelectedStyleId] = useState(null);
  const [showStyleModal, setShowStyleModal] = useState(false);

  // State cho paint brands & colors
  const [brands, setBrands] = useState([]);
  const [allColors, setAllColors] = useState([]);
  const [displayColors, setDisplayColors] = useState([]);

  // State cho component tabs
  const [activeTab, setActiveTab] = useState("wall");

  // State cho selected colors
  const [selectedColors, setSelectedColors] = useState({
    wall: null,
    roof: null,
    column: null,
    mainDoor: null,
    window: null,
  });

  // State cho filters
  const [brandFilter, setBrandFilter] = useState("");
  const [colorSearch, setColorSearch] = useState("");

  // State cho loading & result
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  // Component tabs definition
  const componentTabs = [
    { id: "wall", label: "Tường", icon: "🧱" },
    { id: "roof", label: "Mái", icon: "🏠" },
    { id: "column", label: "Cột", icon: "🏛️" },
    { id: "mainDoor", label: "Cửa chính", icon: "🚪" },
    { id: "window", label: "Cửa sổ", icon: "🪟" },
  ];

  // Map frontend tabs to backend componentType
  const tabToComponentType = {
    wall: "wall",
    roof: "roof",
    column: "column",
    mainDoor: "wall",
    window: "wall",
  };

  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, []);

  // Update display colors when tab, filter, or search changes
  useEffect(() => {
    updateDisplayColors();
  }, [activeTab, brandFilter, colorSearch, allColors]);

  const loadInitialData = async () => {
    try {
      const [stylesRes, brandsRes, colorsRes] = await Promise.all([
        fetchRegionalStyles(),
        fetchPaintBrands(),
        fetchPaintColors(),
      ]);

      if (stylesRes.ok) setRegionalStyles(stylesRes.items || []);
      if (brandsRes.ok) setBrands(brandsRes.items || []);
      if (colorsRes.ok) setAllColors(colorsRes.items || []);
    } catch (err) {
      console.error("Load initial data error:", err);
      pushToast?.({
        variant: "error",
        title: "Lỗi tải dữ liệu",
        message: err.message,
      });
    }
  };

  const updateDisplayColors = () => {
    const componentType = tabToComponentType[activeTab];
    let filtered = allColors.filter(
      (c) => c.componentType === componentType || c.componentType === "all"
    );

    if (brandFilter) {
      filtered = filtered.filter((c) => c.brandId == brandFilter);
    }

    if (colorSearch.trim()) {
      const term = colorSearch.toLowerCase().trim();
      filtered = filtered.filter(
        (c) =>
          c.colorName?.toLowerCase().includes(term) ||
          c.hexCode?.toLowerCase().includes(term)
      );
    }

    setDisplayColors(filtered);
  };

  // Handle file upload
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setHouseFile(file);
      setHousePreview(URL.createObjectURL(file));
      setResult(null);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setHouseFile(file);
      setHousePreview(URL.createObjectURL(file));
      setResult(null);
    }
  };

  const preventDefaults = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // Handle color selection
  const handleColorClick = (color) => {
    setSelectedColors((prev) => ({
      ...prev,
      [activeTab]: color.id,
    }));

    pushToast?.({
      variant: "info",
      title: `Đã chọn màu cho ${componentTabs.find((t) => t.id === activeTab)?.label}`,
      message: `${color.brandName} - ${color.colorName} (${color.hexCode})`,
    });
  };

  // Handle generate
  const handleGenerate = async () => {
    if (!houseFile) {
      pushToast?.({
        variant: "error",
        title: "Thiếu ảnh nhà thô",
        message: "Vui lòng tải lên ảnh nhà thô",
      });
      return;
    }

    if (!selectedStyleId) {
      pushToast?.({
        variant: "error",
        title: "Chưa chọn mẫu vùng miền",
        message: "Vui lòng chọn một mẫu từ thư viện vùng miền",
      });
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("house", houseFile);

      if (selectedColors.wall) formData.append("wallColorId", selectedColors.wall);
      if (selectedColors.roof) formData.append("roofColorId", selectedColors.roof);
      if (selectedColors.column) formData.append("columnColorId", selectedColors.column);
      if (selectedStyleId) formData.append("regionalStyleId", selectedStyleId);

      const res = await generateMixMatch(formData, user.token);

      if (res.ok) {
        setResult(res.data);
        pushToast?.({
          variant: "success",
          title: "Tạo thiết kế thành công!",
          message: "Ảnh của bạn đã được xử lý",
        });
      }
    } catch (err) {
      console.error("Generate error:", err);
      pushToast?.({
        variant: "error",
        title: "Lỗi tạo thiết kế",
        message: err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  // Get selected color object for display
  const getSelectedColorForTab = (tabId) => {
    const colorId = selectedColors[tabId];
    if (!colorId) return null;
    return allColors.find((c) => c.id == colorId);
  };

  // Get selected style object
  const selectedStyle = regionalStyles.find((s) => s.id === selectedStyleId);

  return (
    <div
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "20px",
        overflowY: "auto",
        height: "calc(100vh - 80px)",
      }}
    >
      {/* Loading Overlay */}
      {loading && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2000,
          }}
        >
          <div className="loading-card__spinner" style={{ width: 48, height: 48, marginBottom: 16 }} />
          <div style={{ color: "#fff", fontSize: "1.25rem", fontWeight: 700 }}>Đang tạo thiết kế...</div>
          <div style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.9rem", marginTop: 8 }}>
            AI đang xử lý ảnh. Vui lòng đợi 10-30 giây.
          </div>
        </div>
      )}

      {/* Regional Style Modal */}
      {showStyleModal && regionalStyles.length > 0 && (
        <RegionalStyleModal
          styles={regionalStyles}
          selectedId={selectedStyleId}
          onSelect={setSelectedStyleId}
          onClose={() => setShowStyleModal(false)}
        />
      )}

      {/* 1. Header */}
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <h2 style={{ margin: 0, fontSize: "1.5rem", fontWeight: 700, color: "var(--color-brand-primary)" }}>
          Mix & Match - Phối Hợp Màu Sơn
        </h2>
        <p style={{ margin: "6px 0 0", fontSize: "0.9rem", color: "var(--color-text-muted)" }}>
          Chọn màu sơn thực tế từ các thương hiệu và xem ngay kết quả trên nhà của bạn
        </p>
      </div>

      {/* 2. Upload Row: Upload (~60%) + Regional Card (~40%) */}
      <div style={{ display: "grid", gridTemplateColumns: "3fr 2fr", gap: 20, marginBottom: 24 }}>
        {/* Upload Section */}
        <div
          style={{
            border: "1px solid var(--color-border-light)",
            borderRadius: 12,
            padding: 16,
            background: "var(--color-surface)",
          }}
        >
          <h3 style={{ margin: "0 0 12px", fontSize: "1rem", fontWeight: 600, color: "var(--color-text-primary)" }}>
            Tải ảnh nhà thô
          </h3>
          <div
            onDragEnter={preventDefaults}
            onDragOver={preventDefaults}
            onDragLeave={preventDefaults}
            onDrop={handleDrop}
            onClick={() => !housePreview && fileInputRef.current?.click()}
            style={{
              border: housePreview ? "2px solid var(--color-brand-primary)" : "2px dashed var(--color-brand-primary)",
              borderRadius: 8,
              padding: 16,
              textAlign: "center",
              cursor: housePreview ? "default" : "pointer",
              background: housePreview ? "transparent" : "var(--color-bg-primary)",
              minHeight: 160,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {housePreview ? (
              <>
                <img
                  src={housePreview}
                  alt="Preview"
                  style={{ maxWidth: "100%", maxHeight: 180, borderRadius: 6, marginBottom: 10 }}
                />
                <button
                  className="btn btn-secondary"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  style={{ fontSize: "0.85rem", padding: "6px 16px" }}
                >
                  Thay đổi ảnh
                </button>
              </>
            ) : (
              <>
                <div style={{ fontSize: "2.5rem", marginBottom: 8 }}>📤</div>
                <p style={{ margin: 0, fontSize: "0.95rem", fontWeight: 600, color: "var(--color-text-primary)" }}>
                  Click hoặc kéo thả ảnh
                </p>
                <p style={{ margin: "4px 0 0", fontSize: "0.8rem", color: "var(--color-text-muted)" }}>
                  JPG, PNG - Tối đa 15MB
                </p>
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

        {/* Regional Style Card */}
        <div
          style={{
            border: "1px solid var(--color-border-light)",
            borderRadius: 12,
            padding: 16,
            background: "var(--color-surface)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <h3 style={{ margin: "0 0 12px", fontSize: "1rem", fontWeight: 600, color: "var(--color-text-primary)" }}>
            Mẫu vùng miền
          </h3>
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
            }}
          >
            {selectedStyle ? (
              <>
                {selectedStyle.imageUrl && (
                  <img
                    src={selectedStyle.imageUrl}
                    alt={selectedStyle.regionName}
                    style={{ width: "100%", maxHeight: 120, objectFit: "cover", borderRadius: 8 }}
                  />
                )}
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontWeight: 600, color: "var(--color-text-primary)" }}>{selectedStyle.regionName}</div>
                </div>
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowStyleModal(true)}
                  style={{ fontSize: "0.85rem", padding: "6px 16px" }}
                >
                  Thay đổi
                </button>
              </>
            ) : (
              <>
                <div style={{ fontSize: "2.5rem" }}>🏠</div>
                <p style={{ margin: 0, fontSize: "0.9rem", color: "var(--color-text-muted)", textAlign: "center" }}>
                  Chưa chọn mẫu
                </p>
                <button
                  className="btn btn-primary"
                  onClick={() => setShowStyleModal(true)}
                  style={{ fontSize: "0.85rem", padding: "8px 20px" }}
                >
                  Chọn mẫu
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 3. Component Tabs - Horizontal pills */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {componentTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const selectedColor = getSelectedColorForTab(tab.id);
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                disabled={loading}
                style={{
                  padding: "8px 16px",
                  border: isActive ? "2px solid var(--color-brand-primary)" : "1px solid var(--color-border-light)",
                  borderRadius: 20,
                  background: isActive ? "var(--color-brand-primary)" : "var(--color-surface)",
                  cursor: "pointer",
                  fontSize: "0.85rem",
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? "#fff" : "var(--color-text-secondary)",
                  transition: "all 0.2s",
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
                {selectedColor && (
                  <span
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      backgroundColor: selectedColor.hexCode,
                      border: "2px solid " + (isActive ? "rgba(255,255,255,0.8)" : "rgba(0,0,0,0.2)"),
                      display: "inline-block",
                      marginLeft: 2,
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Color Palette - Full width */}
      <div
        style={{
          border: "1px solid var(--color-border-light)",
          borderRadius: 12,
          padding: 16,
          background: "var(--color-surface)",
          marginBottom: 24,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 600, color: "var(--color-text-primary)" }}>
            Bảng màu - {componentTabs.find((t) => t.id === activeTab)?.label} ({displayColors.length})
          </h3>
        </div>

        {/* Filter row: Brand dropdown + Search */}
        <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
          <select
            value={brandFilter}
            onChange={(e) => setBrandFilter(e.target.value)}
            style={{
              padding: "8px 12px",
              borderRadius: 8,
              border: "1px solid var(--color-border-light)",
              fontSize: "0.85rem",
              background: "var(--color-surface)",
              color: "var(--color-text-primary)",
              minWidth: 180,
            }}
          >
            <option value="">Tất cả thương hiệu</option>
            {brands.map((brand) => (
              <option key={brand.id} value={brand.id}>
                {brand.brandName}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Tìm theo tên màu hoặc mã HEX..."
            value={colorSearch}
            onChange={(e) => setColorSearch(e.target.value)}
            style={{
              flex: 1,
              padding: "8px 12px",
              borderRadius: 8,
              border: "1px solid var(--color-border-light)",
              fontSize: "0.85rem",
              background: "var(--color-surface)",
              color: "var(--color-text-primary)",
            }}
          />
        </div>

        {/* Color Grid - No limit */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(40px, 1fr))",
            gap: 6,
            maxHeight: 280,
            overflow: "auto",
          }}
        >
          {displayColors.map((color) => {
            const isSelected = selectedColors[activeTab] === color.id;
            return (
              <button
                key={color.id}
                onClick={() => handleColorClick(color)}
                disabled={loading}
                title={`${color.brandName} - ${color.colorName}\n${color.hexCode}`}
                style={{
                  width: "100%",
                  aspectRatio: "1/1",
                  padding: 0,
                  border: isSelected ? "3px solid var(--color-brand-primary)" : "1px solid rgba(0,0,0,0.12)",
                  borderRadius: 6,
                  backgroundColor: color.hexCode,
                  cursor: "pointer",
                  transition: "all 0.15s",
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {isSelected && (
                  <span style={{ color: "#fff", fontSize: "0.75rem", textShadow: "0 0 4px rgba(0,0,0,0.6)" }}>✓</span>
                )}
              </button>
            );
          })}
          {displayColors.length === 0 && (
            <div style={{ gridColumn: "1/-1", textAlign: "center", padding: 20, color: "var(--color-text-muted)" }}>
              Không tìm thấy màu phù hợp
            </div>
          )}
        </div>

        {/* Currently selected info */}
        {getSelectedColorForTab(activeTab) && (
          <div
            className="alert alert--info"
            style={{ margin: "12px 0 0", padding: "8px 12px", fontSize: "0.85rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}
          >
            <span>
              <strong>Đã chọn:</strong> {getSelectedColorForTab(activeTab)?.brandName} -{" "}
              {getSelectedColorForTab(activeTab)?.colorName} (
              <span style={{ color: getSelectedColorForTab(activeTab)?.hexCode, fontWeight: "bold" }}>
                {getSelectedColorForTab(activeTab)?.hexCode}
              </span>
              )
            </span>
            <button
              onClick={() => {
                setSelectedColors((prev) => ({ ...prev, [activeTab]: null }));
                pushToast?.({
                  variant: "info",
                  title: `Đã huỷ màu cho ${componentTabs.find((t) => t.id === activeTab)?.label}`,
                });
              }}
              style={{
                background: "none",
                border: "1px solid var(--color-text-muted)",
                borderRadius: 6,
                padding: "4px 10px",
                fontSize: "0.8rem",
                cursor: "pointer",
                color: "var(--color-text-secondary)",
                whiteSpace: "nowrap",
                marginLeft: 12,
              }}
            >
              Huỷ chọn
            </button>
          </div>
        )}
      </div>

      {/* 5. Summary Bar */}
      <div
        style={{
          border: "1px solid var(--color-border-light)",
          borderRadius: 12,
          padding: "12px 16px",
          background: "var(--color-surface)",
          marginBottom: 16,
          display: "flex",
          gap: 12,
          flexWrap: "wrap",
          justifyContent: "space-between",
        }}
      >
        {componentTabs.map((tab) => {
          const color = getSelectedColorForTab(tab.id);
          return (
            <div
              key={tab.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontSize: "0.85rem",
              }}
            >
              <span style={{ fontSize: "1rem" }}>{tab.icon}</span>
              <span style={{ color: "var(--color-text-secondary)", fontWeight: 500 }}>{tab.label}:</span>
              {color ? (
                <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <span
                    style={{
                      width: 16,
                      height: 16,
                      borderRadius: 4,
                      backgroundColor: color.hexCode,
                      border: "1px solid rgba(0,0,0,0.15)",
                      display: "inline-block",
                    }}
                  />
                  <span style={{ fontWeight: 600, color: "var(--color-text-primary)", fontSize: "0.8rem" }}>
                    {color.colorName}
                  </span>
                </span>
              ) : (
                <span style={{ color: "var(--color-text-muted)" }}>—</span>
              )}
            </div>
          );
        })}
      </div>

      {/* 6. Generate Button */}
      {(() => {
        const isDisabled = loading || !houseFile || !selectedStyleId;
        return (
          <button
            className="btn btn-primary"
            onClick={handleGenerate}
            disabled={isDisabled}
            style={{
              fontSize: "1.05rem",
              padding: "14px 24px",
              width: "100%",
              marginBottom: 24,
              ...(isDisabled ? { opacity: 0.5, cursor: "not-allowed", pointerEvents: "none" } : {}),
            }}
          >
            {loading ? "Đang xử lý..." : "Tạo Thiết Kế Ngay"}
          </button>
        );
      })()}

      {/* 7. Result Area - Before/After Slider */}
      {result && (
        <div
          style={{
            border: "1px solid var(--color-border-light)",
            borderRadius: 12,
            padding: 20,
            background: "var(--color-surface)",
            marginBottom: 24,
          }}
        >
          <h3 style={{ margin: "0 0 16px", fontSize: "1.1rem", fontWeight: 700, color: "var(--color-success)" }}>
            Kết Quả
          </h3>
          {result.outputImageUrl ? (
            <BeforeAfterSlider
              beforeSrc={result.inputImageUrl}
              afterSrc={result.outputImageUrl}
            />
          ) : (
            <div
              style={{
                textAlign: "center",
                padding: 40,
                background: "var(--color-bg-primary)",
                borderRadius: 8,
              }}
            >
              <p style={{ color: "var(--color-text-muted)", margin: 0 }}>
                AI generation thất bại. Vui lòng thử lại.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
