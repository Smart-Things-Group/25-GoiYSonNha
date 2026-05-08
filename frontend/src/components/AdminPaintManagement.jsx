import { useCallback, useEffect, useMemo, useState } from "react";
import {
  createPaintBrand,
  createPaintColor,
  deletePaintBrand,
  deletePaintColor,
  fetchPaintBrands,
  fetchPaintColors,
  updatePaintBrand,
  updatePaintColor,
} from "../api/admin";
import ToastList from "./ToastList";
import useToasts from "../hooks/useToasts";

const COMPONENT_TYPES = [
  { value: "all", label: "Tất cả" },
  { value: "wall", label: "Tường" },
  { value: "roof", label: "Mái" },
  { value: "column", label: "Cột" },
];

const EMPTY_BRAND_FORM = {
  brandName: "",
  description: "",
  websiteUrl: "",
  displayOrder: "0",
  isActive: true,
};

const EMPTY_COLOR_FORM = {
  brandId: "",
  colorName: "",
  colorCode: "",
  hexCode: "#FFFFFF",
  componentType: "wall",
  description: "",
  isActive: true,
};

const PAGE_SIZE = 6;
const TABLE_MIN_HEIGHT = 430;

function getItemId(item) {
  return item?.id || item?._id || "";
}

function getBrandId(value) {
  if (!value) return "";
  if (typeof value === "object") return value.id || value._id || "";
  return value;
}

function formatDate(value) {
  if (!value) return "Chưa cập nhật";
  try {
    return new Date(value).toLocaleString("vi-VN", { hour12: false });
  } catch {
    return value;
  }
}

function normalizeHex(value) {
  const raw = value.trim();
  if (!raw) return "#FFFFFF";
  const withPrefix = raw.startsWith("#") ? raw : `#${raw}`;
  return withPrefix.slice(0, 7).toUpperCase();
}

function getPageData(items, page) {
  const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  const safePage = Math.min(Math.max(page, 1), totalPages);
  const startIndex = (safePage - 1) * PAGE_SIZE;
  const pageItems = items.slice(startIndex, startIndex + PAGE_SIZE);

  return {
    items: pageItems,
    page: safePage,
    totalPages,
    from: items.length ? startIndex + 1 : 0,
    to: Math.min(startIndex + PAGE_SIZE, items.length),
  };
}

function PaginationControls({ page, total, totalPages, from, to, onPageChange }) {
  if (!total) return null;

  return (
    <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "12px", padding: "16px 20px" }}>
      <span className="admin-table__muted">{from}-{to} / {total} mục</span>
      <button
        type="button"
        className="admin-button admin-button--ghost"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
      >
        Trước
      </button>
      <span className="admin-badge admin-badge--accent">{page}</span>
      <button
        type="button"
        className="admin-button admin-button--ghost"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
      >
        Sau
      </button>
    </div>
  );
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
        aria-labelledby="paint-modal-title"
        className="admin-card"
        onMouseDown={(event) => event.stopPropagation()}
        style={{
          width: "min(720px, 100%)",
          maxHeight: "calc(100vh - 48px)",
          overflowY: "auto",
          boxShadow: "var(--shadow-xl)",
        }}
      >
        <header className="admin-card__header" style={{ alignItems: "center" }}>
          <h3 id="paint-modal-title">{title}</h3>
          <button type="button" className="admin-button admin-button--ghost" onClick={onClose}>
            Đóng
          </button>
        </header>
        {children}
      </div>
    </div>
  );
}

function AdminPaintManagement({ token }) {
  const { toasts, pushToast, dismissToast } = useToasts();
  const [activeTab, setActiveTab] = useState("brands");
  const [brands, setBrands] = useState([]);
  const [colors, setColors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [brandFormOpen, setBrandFormOpen] = useState(false);
  const [colorFormOpen, setColorFormOpen] = useState(false);
  const [editingBrandId, setEditingBrandId] = useState(null);
  const [editingColorId, setEditingColorId] = useState(null);
  const [brandForm, setBrandForm] = useState(EMPTY_BRAND_FORM);
  const [colorForm, setColorForm] = useState(EMPTY_COLOR_FORM);
  const [brandFile, setBrandFile] = useState(null);
  const [colorFile, setColorFile] = useState(null);
  const [brandPreviewUrl, setBrandPreviewUrl] = useState(null);
  const [colorPreviewUrl, setColorPreviewUrl] = useState(null);
  const [brandFilter, setBrandFilter] = useState("");
  const [componentFilter, setComponentFilter] = useState("");
  const [brandPage, setBrandPage] = useState(1);
  const [colorPage, setColorPage] = useState(1);

  const activeBrands = useMemo(
    () => brands.filter((brand) => brand.isActive !== false),
    [brands]
  );

  const visibleColors = useMemo(() => {
    return colors.filter((color) => {
      if (brandFilter && getBrandId(color.brandId) !== brandFilter) return false;
      if (componentFilter && color.componentType !== componentFilter) return false;
      return true;
    });
  }, [brandFilter, colors, componentFilter]);

  const brandPageData = useMemo(() => getPageData(brands, brandPage), [brands, brandPage]);
  const colorPageData = useMemo(() => getPageData(visibleColors, colorPage), [visibleColors, colorPage]);

  const loadBrands = useCallback(async () => {
    const response = await fetchPaintBrands(token);
    setBrands(response.items || response.data?.items || []);
  }, [token]);

  const loadColors = useCallback(async () => {
    const response = await fetchPaintColors({}, token);
    setColors(response.items || response.data?.items || []);
  }, [token]);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      await Promise.all([loadBrands(), loadColors()]);
    } catch (error) {
      pushToast({
        variant: "error",
        title: "Lỗi tải dữ liệu",
        message: error.message || "Không thể tải dữ liệu sơn",
      });
    } finally {
      setLoading(false);
    }
  }, [loadBrands, loadColors, pushToast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    setBrandPage((prev) => Math.min(prev, Math.max(1, Math.ceil(brands.length / PAGE_SIZE))));
  }, [brands.length]);

  useEffect(() => {
    setColorPage(1);
  }, [brandFilter, componentFilter]);

  useEffect(() => {
    setColorPage((prev) => Math.min(prev, Math.max(1, Math.ceil(visibleColors.length / PAGE_SIZE))));
  }, [visibleColors.length]);

  useEffect(() => {
    if (!colorForm.brandId && activeBrands.length > 0) {
      setColorForm((prev) => ({ ...prev, brandId: getItemId(activeBrands[0]) }));
    }
  }, [activeBrands, colorForm.brandId]);

  useEffect(() => {
    return () => {
      if (brandPreviewUrl?.startsWith("blob:")) URL.revokeObjectURL(brandPreviewUrl);
      if (colorPreviewUrl?.startsWith("blob:")) URL.revokeObjectURL(colorPreviewUrl);
    };
  }, [brandPreviewUrl, colorPreviewUrl]);

  const resetBrandForm = () => {
    if (brandPreviewUrl?.startsWith("blob:")) URL.revokeObjectURL(brandPreviewUrl);
    setBrandForm(EMPTY_BRAND_FORM);
    setBrandFile(null);
    setBrandPreviewUrl(null);
    setEditingBrandId(null);
    setBrandFormOpen(false);
  };

  const resetColorForm = () => {
    if (colorPreviewUrl?.startsWith("blob:")) URL.revokeObjectURL(colorPreviewUrl);
    setColorForm({
      ...EMPTY_COLOR_FORM,
      brandId: activeBrands[0] ? getItemId(activeBrands[0]) : "",
    });
    setColorFile(null);
    setColorPreviewUrl(null);
    setEditingColorId(null);
    setColorFormOpen(false);
  };

  const closePaintModal = () => {
    if (brandFormOpen) resetBrandForm();
    if (colorFormOpen) resetColorForm();
  };

  const handleBrandFileChange = (event) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;
    if (brandPreviewUrl?.startsWith("blob:")) URL.revokeObjectURL(brandPreviewUrl);
    setBrandFile(selectedFile);
    setBrandPreviewUrl(URL.createObjectURL(selectedFile));
  };

  const handleColorFileChange = (event) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;
    if (colorPreviewUrl?.startsWith("blob:")) URL.revokeObjectURL(colorPreviewUrl);
    setColorFile(selectedFile);
    setColorPreviewUrl(URL.createObjectURL(selectedFile));
  };

  const openCreateBrandForm = () => {
    resetBrandForm();
    setBrandFormOpen(true);
  };

  const openCreateColorForm = () => {
    resetColorForm();
    setColorFormOpen(true);
  };

  const handleEditBrand = (brand) => {
    if (brandPreviewUrl?.startsWith("blob:")) URL.revokeObjectURL(brandPreviewUrl);
    setEditingBrandId(getItemId(brand));
    setBrandForm({
      brandName: brand.brandName || "",
      description: brand.description || "",
      websiteUrl: brand.websiteUrl || "",
      displayOrder: String(brand.displayOrder ?? 0),
      isActive: brand.isActive !== false,
    });
    setBrandFile(null);
    setBrandPreviewUrl(brand.brandLogoUrl || null);
    setBrandFormOpen(true);
    setActiveTab("brands");
  };

  const handleEditColor = (color) => {
    if (colorPreviewUrl?.startsWith("blob:")) URL.revokeObjectURL(colorPreviewUrl);
    setEditingColorId(getItemId(color));
    setColorForm({
      brandId: getBrandId(color.brandId),
      colorName: color.colorName || "",
      colorCode: color.colorCode || "",
      hexCode: color.hexCode || "#FFFFFF",
      componentType: color.componentType || "wall",
      description: color.description || "",
      isActive: color.isActive !== false,
    });
    setColorFile(null);
    setColorPreviewUrl(color.imageUrl || null);
    setColorFormOpen(true);
    setActiveTab("colors");
  };

  const buildBrandPayload = () => {
    const data = new FormData();
    data.append("brandName", brandForm.brandName.trim());
    data.append("description", brandForm.description.trim());
    data.append("websiteUrl", brandForm.websiteUrl.trim());
    data.append("displayOrder", brandForm.displayOrder || "0");
    data.append("isActive", String(brandForm.isActive));
    if (brandFile) data.append("logo", brandFile);
    return data;
  };

  const buildColorPayload = () => {
    const data = new FormData();
    data.append("brandId", colorForm.brandId);
    data.append("colorName", colorForm.colorName.trim());
    data.append("colorCode", colorForm.colorCode.trim());
    data.append("hexCode", normalizeHex(colorForm.hexCode));
    data.append("componentType", colorForm.componentType);
    data.append("description", colorForm.description.trim());
    data.append("isActive", String(colorForm.isActive));
    if (colorFile) data.append("swatch", colorFile);
    return data;
  };

  const handleBrandSubmit = async (event) => {
    event.preventDefault();
    if (!brandForm.brandName.trim()) {
      pushToast({ variant: "error", title: "Thiếu dữ liệu", message: "Vui lòng nhập tên thương hiệu" });
      return;
    }

    setLoading(true);
    try {
      if (editingBrandId) {
        await updatePaintBrand(editingBrandId, buildBrandPayload(), token);
        pushToast({ variant: "success", title: "Thành công", message: "Đã cập nhật thương hiệu sơn" });
      } else {
        await createPaintBrand(buildBrandPayload(), token);
        pushToast({ variant: "success", title: "Thành công", message: "Đã thêm thương hiệu sơn" });
      }
      resetBrandForm();
      await loadBrands();
    } catch (error) {
      pushToast({ variant: "error", title: "Lỗi", message: error.message || "Không thể lưu thương hiệu" });
    } finally {
      setLoading(false);
    }
  };

  const handleColorSubmit = async (event) => {
    event.preventDefault();
    const normalizedHex = normalizeHex(colorForm.hexCode);
    if (!/^#[0-9A-F]{6}$/.test(normalizedHex)) {
      pushToast({ variant: "error", title: "Mã HEX không hợp lệ", message: "Mã HEX phải có dạng #RRGGBB" });
      return;
    }
    if (!colorForm.brandId || !colorForm.colorName.trim() || !colorForm.colorCode.trim()) {
      pushToast({ variant: "error", title: "Thiếu dữ liệu", message: "Vui lòng nhập đủ thương hiệu, tên màu và mã màu" });
      return;
    }

    setLoading(true);
    try {
      if (editingColorId) {
        await updatePaintColor(editingColorId, buildColorPayload(), token);
        pushToast({ variant: "success", title: "Thành công", message: "Đã cập nhật màu sơn" });
      } else {
        await createPaintColor(buildColorPayload(), token);
        pushToast({ variant: "success", title: "Thành công", message: "Đã thêm màu sơn" });
      }
      resetColorForm();
      await loadColors();
    } catch (error) {
      pushToast({ variant: "error", title: "Lỗi", message: error.message || "Không thể lưu màu sơn" });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBrand = async (brand) => {
    const brandName = brand.brandName || "thương hiệu này";
    if (!confirm(`Xóa ${brandName}? Các màu sơn thuộc thương hiệu này cũng sẽ bị xóa.`)) return;

    setLoading(true);
    try {
      const response = await deletePaintBrand(getItemId(brand), token);
      pushToast({ variant: "success", title: "Đã xóa", message: response.message || "Đã xóa thương hiệu sơn" });
      await Promise.all([loadBrands(), loadColors()]);
    } catch (error) {
      pushToast({ variant: "error", title: "Lỗi", message: error.message || "Không thể xóa thương hiệu" });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteColor = async (color) => {
    if (!confirm(`Xóa màu ${color.colorName || "này"}?`)) return;

    setLoading(true);
    try {
      const response = await deletePaintColor(getItemId(color), token);
      pushToast({ variant: "success", title: "Đã xóa", message: response.message || "Đã xóa màu sơn" });
      await loadColors();
    } catch (error) {
      pushToast({ variant: "error", title: "Lỗi", message: error.message || "Không thể xóa màu sơn" });
    } finally {
      setLoading(false);
    }
  };

  const componentLabel = (value) => {
    return COMPONENT_TYPES.find((item) => item.value === value)?.label || value;
  };

  return (
    <section className="admin-surface" aria-label="Quản trị sơn và màu sơn">
      <div className="admin-panel" style={{ marginBottom: "10px", padding: "18px 22px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
          <div>
            <p className="admin-eyebrow">Quản lý dữ liệu sơn</p>
            <h2 style={{ margin: 0 }}>Thương hiệu sơn & màu sơn</h2>
          </div>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <button type="button" className="admin-button admin-button--ghost" onClick={loadData} disabled={loading}>
              Làm mới
            </button>
            <button
              type="button"
              className="admin-button"
              onClick={activeTab === "brands" ? openCreateBrandForm : openCreateColorForm}
              disabled={loading || (activeTab === "colors" && brands.length === 0)}
            >
              {activeTab === "brands" ? "+ Thêm thương hiệu" : "+ Thêm màu sơn"}
            </button>
          </div>
        </div>
      </div>

      <div className="admin-card" style={{ marginBottom: "10px", padding: "12px 20px" }}>
        <div className="admin-chip-group admin-chip-group--wrap">
          <button
            type="button"
            className={`admin-chip ${activeTab === "brands" ? "is-active" : ""}`}
            onClick={() => setActiveTab("brands")}
          >
            Thương hiệu sơn ({brands.length})
          </button>
          <button
            type="button"
            className={`admin-chip ${activeTab === "colors" ? "is-active" : ""}`}
            onClick={() => setActiveTab("colors")}
          >
            Màu sơn ({colors.length})
          </button>
        </div>
      </div>

      {activeTab === "brands" ? (
        <>
          <div className="admin-card admin-card--table">
            <header className="admin-card__header admin-card__header--table">
              <div>
                <p className="admin-eyebrow">Danh sách thương hiệu</p>
                <h3>Tổng cộng {brands.length} thương hiệu</h3>
              </div>
            </header>

            {loading && brands.length === 0 ? (
              <div className="admin-empty">Đang tải dữ liệu...</div>
            ) : brands.length === 0 ? (
              <div className="admin-empty">Chưa có thương hiệu sơn nào</div>
            ) : (
              <>
                <div className="admin-table" role="table" style={{ minHeight: TABLE_MIN_HEIGHT }}>
                  <div
                    className="admin-table__head"
                    role="rowgroup"
                    style={{ gridTemplateColumns: "1.6fr 1.1fr 0.8fr 0.9fr 1fr" }}
                  >
                    <span role="columnheader">Tên thương hiệu</span>
                    <span role="columnheader">Website</span>
                    <span role="columnheader">Trạng thái</span>
                    <span role="columnheader">Thứ tự</span>
                    <span role="columnheader">Actions</span>
                  </div>
                  <div className="admin-table__body" role="rowgroup">
                    {brandPageData.items.map((brand) => (
                    <div
                      key={getItemId(brand)}
                      className="admin-table__row"
                      role="row"
                      style={{ gridTemplateColumns: "1.6fr 1.1fr 0.8fr 0.9fr 1fr" }}
                    >
                      <div className="admin-table__cell" role="cell" data-label="Tên thương hiệu">
                        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                          {brand.brandLogoUrl ? (
                            <img
                              src={brand.brandLogoUrl}
                              alt={brand.brandName}
                              style={{ width: "40px", height: "40px", objectFit: "contain", borderRadius: "10px", background: "rgba(255,255,255,0.08)", padding: "6px" }}
                            />
                          ) : (
                            <span style={{ width: "40px", height: "40px", borderRadius: "10px", background: "rgba(255,255,255,0.08)", display: "grid", placeItems: "center", fontWeight: 700 }}>
                              {brand.brandName?.charAt(0)?.toUpperCase() || "S"}
                            </span>
                          )}
                          <div>
                            <p className="admin-table__title">{brand.brandName}</p>
                            <p className="admin-table__muted">{brand.description || "Chưa có mô tả"}</p>
                          </div>
                        </div>
                      </div>
                      <div className="admin-table__cell" role="cell" data-label="Website">
                        <p className="admin-table__muted" style={{ wordBreak: "break-all" }}>
                          {brand.websiteUrl || "Chưa có"}
                        </p>
                      </div>
                      <div className="admin-table__cell" role="cell" data-label="Trạng thái">
                        <span className={`admin-badge ${brand.isActive === false ? "" : "admin-badge--accent"}`}>
                          {brand.isActive === false ? "Tạm ẩn" : "Hoạt động"}
                        </span>
                      </div>
                      <div className="admin-table__cell" role="cell" data-label="Thứ tự">
                        <p className="admin-table__value">{brand.displayOrder ?? 0}</p>
                        <p className="admin-table__muted">{formatDate(brand.updatedAt || brand.createdAt)}</p>
                      </div>
                      <div className="admin-table__cell admin-table__cell--action" role="cell" data-label="Actions">
                        <button type="button" className="admin-button admin-button--ghost" onClick={() => handleEditBrand(brand)} disabled={loading}>Sửa</button>
                        <button type="button" className="admin-button admin-button--danger" onClick={() => handleDeleteBrand(brand)} disabled={loading}>Xóa</button>
                      </div>
                    </div>
                    ))}
                  </div>
                </div>
                <PaginationControls
                  page={brandPageData.page}
                  total={brands.length}
                  totalPages={brandPageData.totalPages}
                  from={brandPageData.from}
                  to={brandPageData.to}
                  onPageChange={setBrandPage}
                />
              </>
            )}
          </div>
        </>
      ) : (
        <>
          <div className="admin-card" style={{ marginBottom: "10px", padding: "12px 20px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "12px" }}>
              <label>
                <span className="admin-input__label">Lọc thương hiệu</span>
                <select className="admin-input" value={brandFilter} onChange={(event) => setBrandFilter(event.target.value)}>
                  <option value="">Tất cả thương hiệu</option>
                  {brands.map((brand) => <option key={getItemId(brand)} value={getItemId(brand)}>{brand.brandName}</option>)}
                </select>
              </label>
              <label>
                <span className="admin-input__label">Lọc loại áp dụng</span>
                <select className="admin-input" value={componentFilter} onChange={(event) => setComponentFilter(event.target.value)}>
                  <option value="">Tất cả loại</option>
                  {COMPONENT_TYPES.map((type) => <option key={type.value} value={type.value}>{type.label}</option>)}
                </select>
              </label>
            </div>
          </div>

          <div className="admin-card admin-card--table">
            <header className="admin-card__header admin-card__header--table">
              <div>
                <p className="admin-eyebrow">Danh sách màu sơn</p>
                <h3>Hiển thị {visibleColors.length}/{colors.length} màu</h3>
              </div>
            </header>

            {loading && colors.length === 0 ? (
              <div className="admin-empty">Đang tải dữ liệu...</div>
            ) : colors.length === 0 ? (
              <div className="admin-empty">Chưa có màu sơn nào</div>
            ) : visibleColors.length === 0 ? (
              <div className="admin-empty">Không có màu sơn phù hợp bộ lọc</div>
            ) : (
              <>
                <div className="admin-table" role="table" style={{ minHeight: TABLE_MIN_HEIGHT }}>
                  <div
                    className="admin-table__head"
                    role="rowgroup"
                    style={{ gridTemplateColumns: "1.4fr 1fr 0.8fr 0.9fr 0.8fr 1fr" }}
                  >
                    <span role="columnheader">Tên màu</span>
                    <span role="columnheader">Thương hiệu</span>
                    <span role="columnheader">Loại</span>
                    <span role="columnheader">Mã HEX</span>
                    <span role="columnheader">Trạng thái</span>
                    <span role="columnheader">Actions</span>
                  </div>
                  <div className="admin-table__body" role="rowgroup">
                    {colorPageData.items.map((color) => (
                    <div
                      key={getItemId(color)}
                      className="admin-table__row"
                      role="row"
                      style={{ gridTemplateColumns: "1.4fr 1fr 0.8fr 0.9fr 0.8fr 1fr" }}
                    >
                      <div className="admin-table__cell" role="cell" data-label="Tên màu">
                        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                          {color.imageUrl ? (
                            <img src={color.imageUrl} alt={color.colorName} style={{ width: "40px", height: "40px", objectFit: "cover", borderRadius: "10px" }} />
                          ) : (
                            <span style={{ width: "40px", height: "40px", borderRadius: "10px", background: color.hexCode || "#FFFFFF", border: "1px solid rgba(255,255,255,0.24)" }} />
                          )}
                          <div>
                            <p className="admin-table__title">{color.colorName}</p>
                            <p className="admin-table__muted">{color.colorCode}</p>
                          </div>
                        </div>
                      </div>
                      <div className="admin-table__cell" role="cell" data-label="Thương hiệu">
                        <p className="admin-table__value">{color.brandName || "Không rõ"}</p>
                      </div>
                      <div className="admin-table__cell" role="cell" data-label="Loại">
                        <p className="admin-table__value">{componentLabel(color.componentType)}</p>
                      </div>
                      <div className="admin-table__cell" role="cell" data-label="Mã HEX">
                        <span className="admin-badge admin-badge--accent">{color.hexCode}</span>
                        <p className="admin-table__muted">{color.description || "Chưa có mô tả"}</p>
                      </div>
                      <div className="admin-table__cell" role="cell" data-label="Trạng thái">
                        <span className={`admin-badge ${color.isActive === false ? "" : "admin-badge--accent"}`}>
                          {color.isActive === false ? "Tạm ẩn" : "Hoạt động"}
                        </span>
                      </div>
                      <div className="admin-table__cell admin-table__cell--action" role="cell" data-label="Actions">
                        <button type="button" className="admin-button admin-button--ghost" onClick={() => handleEditColor(color)} disabled={loading}>Sửa</button>
                        <button type="button" className="admin-button admin-button--danger" onClick={() => handleDeleteColor(color)} disabled={loading}>Xóa</button>
                      </div>
                    </div>
                    ))}
                  </div>
                </div>
                <PaginationControls
                  page={colorPageData.page}
                  total={visibleColors.length}
                  totalPages={colorPageData.totalPages}
                  from={colorPageData.from}
                  to={colorPageData.to}
                  onPageChange={setColorPage}
                />
              </>
            )}
          </div>
        </>
      )}

      {brandFormOpen && (
        <AdminModal
          title={editingBrandId ? "Chỉnh sửa thương hiệu" : "Thêm thương hiệu sơn"}
          onClose={closePaintModal}
        >
          <form onSubmit={handleBrandSubmit}>
            <div style={{ display: "grid", gap: "16px" }}>
              <label>
                <span className="admin-input__label">Tên thương hiệu</span>
                <input
                  className="admin-input"
                  value={brandForm.brandName}
                  onChange={(event) => setBrandForm({ ...brandForm, brandName: event.target.value })}
                  placeholder="Ví dụ: Dulux, Jotun, Nippon Paint"
                  required
                />
              </label>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
                <label>
                  <span className="admin-input__label">Website</span>
                  <input
                    className="admin-input"
                    value={brandForm.websiteUrl}
                    onChange={(event) => setBrandForm({ ...brandForm, websiteUrl: event.target.value })}
                    placeholder="https://example.com"
                  />
                </label>
                <label>
                  <span className="admin-input__label">Thứ tự hiển thị</span>
                  <input
                    className="admin-input"
                    type="number"
                    value={brandForm.displayOrder}
                    onChange={(event) => setBrandForm({ ...brandForm, displayOrder: event.target.value })}
                  />
                </label>
              </div>

              <label>
                <span className="admin-input__label">Logo thương hiệu {editingBrandId && "(để trống nếu giữ logo cũ)"}</span>
                <input className="admin-input" type="file" accept="image/*" onChange={handleBrandFileChange} />
              </label>
              {brandPreviewUrl && (
                <img src={brandPreviewUrl} alt="Logo thương hiệu" style={{ width: "120px", height: "120px", borderRadius: "16px", objectFit: "contain", background: "rgba(255,255,255,0.08)", padding: "12px" }} />
              )}

              <label>
                <span className="admin-input__label">Mô tả</span>
                <textarea
                  className="admin-input"
                  rows={3}
                  value={brandForm.description}
                  onChange={(event) => setBrandForm({ ...brandForm, description: event.target.value })}
                  placeholder="Mô tả ngắn về thương hiệu sơn"
                />
              </label>

              {editingBrandId && (
                <label style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <input
                    type="checkbox"
                    checked={brandForm.isActive}
                    onChange={(event) => setBrandForm({ ...brandForm, isActive: event.target.checked })}
                  />
                  <span>Đang hoạt động</span>
                </label>
              )}

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
                <button type="button" className="admin-button admin-button--ghost" onClick={closePaintModal} disabled={loading}>Hủy</button>
                <button type="submit" className="admin-button" disabled={loading}>{loading ? "Đang xử lý..." : editingBrandId ? "Cập nhật" : "Thêm mới"}</button>
              </div>
            </div>
          </form>
        </AdminModal>
      )}

      {colorFormOpen && (
        <AdminModal
          title={editingColorId ? "Chỉnh sửa màu sơn" : "Thêm màu sơn"}
          onClose={closePaintModal}
        >
          <form onSubmit={handleColorSubmit}>
            <div style={{ display: "grid", gap: "16px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
                <label>
                  <span className="admin-input__label">Thương hiệu</span>
                  <select
                    className="admin-input"
                    value={colorForm.brandId}
                    onChange={(event) => setColorForm({ ...colorForm, brandId: event.target.value })}
                    required
                  >
                    {activeBrands.map((brand) => (
                      <option key={getItemId(brand)} value={getItemId(brand)}>{brand.brandName}</option>
                    ))}
                  </select>
                </label>
                <label>
                  <span className="admin-input__label">Loại áp dụng</span>
                  <select
                    className="admin-input"
                    value={colorForm.componentType}
                    onChange={(event) => setColorForm({ ...colorForm, componentType: event.target.value })}
                  >
                    {COMPONENT_TYPES.map((type) => <option key={type.value} value={type.value}>{type.label}</option>)}
                  </select>
                </label>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "16px" }}>
                <label>
                  <span className="admin-input__label">Tên màu</span>
                  <input
                    className="admin-input"
                    value={colorForm.colorName}
                    onChange={(event) => setColorForm({ ...colorForm, colorName: event.target.value })}
                    placeholder="Ví dụ: Trắng sứ"
                    required
                  />
                </label>
                <label>
                  <span className="admin-input__label">Mã màu</span>
                  <input
                    className="admin-input"
                    value={colorForm.colorCode}
                    onChange={(event) => setColorForm({ ...colorForm, colorCode: event.target.value })}
                    placeholder="Ví dụ: DLX-001"
                    required
                  />
                </label>
                <label>
                  <span className="admin-input__label">Mã HEX</span>
                  <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                    <input
                      type="color"
                      value={/^#[0-9A-Fa-f]{6}$/.test(colorForm.hexCode) ? colorForm.hexCode : "#FFFFFF"}
                      onChange={(event) => setColorForm({ ...colorForm, hexCode: event.target.value.toUpperCase() })}
                      style={{ width: "52px", height: "44px", border: 0, background: "transparent" }}
                    />
                    <input
                      className="admin-input"
                      value={colorForm.hexCode}
                      onChange={(event) => setColorForm({ ...colorForm, hexCode: normalizeHex(event.target.value) })}
                      required
                    />
                  </div>
                </label>
              </div>

              <label>
                <span className="admin-input__label">Ảnh mẫu màu {editingColorId && "(để trống nếu giữ ảnh cũ)"}</span>
                <input className="admin-input" type="file" accept="image/*" onChange={handleColorFileChange} />
              </label>
              <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
                <span style={{ width: "72px", height: "72px", borderRadius: "16px", background: colorForm.hexCode, border: "1px solid rgba(255,255,255,0.24)" }} />
                {colorPreviewUrl && <img src={colorPreviewUrl} alt="Mẫu màu sơn" style={{ width: "72px", height: "72px", borderRadius: "16px", objectFit: "cover" }} />}
              </div>

              <label>
                <span className="admin-input__label">Mô tả</span>
                <textarea
                  className="admin-input"
                  rows={3}
                  value={colorForm.description}
                  onChange={(event) => setColorForm({ ...colorForm, description: event.target.value })}
                  placeholder="Gợi ý sử dụng màu sơn này"
                />
              </label>

              {editingColorId && (
                <label style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <input
                    type="checkbox"
                    checked={colorForm.isActive}
                    onChange={(event) => setColorForm({ ...colorForm, isActive: event.target.checked })}
                  />
                  <span>Đang hoạt động</span>
                </label>
              )}

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
                <button type="button" className="admin-button admin-button--ghost" onClick={closePaintModal} disabled={loading}>Hủy</button>
                <button type="submit" className="admin-button" disabled={loading}>{loading ? "Đang xử lý..." : editingColorId ? "Cập nhật" : "Thêm mới"}</button>
              </div>
            </div>
          </form>
        </AdminModal>
      )}

      <ToastList toasts={toasts} onDismiss={dismissToast} />
    </section>
  );
}

export default AdminPaintManagement;
