import { useMemo, useState, useEffect, useCallback } from "react";
import AdminDashboardPage from "./AdminDashboardPage";
import AdminUserManagement from "./AdminUserManagement";
import AdminLibraryManager from "./AdminLibraryManager";

const THEME_STORAGE_KEY = "exteriorTheme";
const THEMES = { LIGHT: "light", DARK: "dark" };

const iconBaseProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

function Icon({ name, size = 18 }) {
  const props = { ...iconBaseProps, width: size, height: size };
  switch (name) {
    case "dashboard":
      return (
        <svg {...props}>
          <rect x="3" y="3" width="7" height="9" rx="1" />
          <rect x="14" y="3" width="7" height="5" rx="1" />
          <rect x="14" y="12" width="7" height="9" rx="1" />
          <rect x="3" y="16" width="7" height="5" rx="1" />
        </svg>
      );
    case "users":
      return (
        <svg {...props}>
          <circle cx="9" cy="10" r="2.8" />
          <path d="M4.5 18.5a4.8 4.8 0 0 1 9 0" />
          <circle cx="16" cy="9" r="2.2" />
          <path d="M13 18.5c.3-2.1 1.9-3.4 3.8-3.4 1 0 2 .3 2.7.9" />
        </svg>
      );
    case "library":
      return (
        <svg {...props}>
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <path d="m21 15-5-5L5 21" />
        </svg>
      );
    case "exit":
      return (
        <svg {...props}>
          <path d="M9 6v-2.5h8.5v17H9V18" />
          <path d="M14 12H4.5" />
          <path d="m7 9-3 3 3 3" />
        </svg>
      );
    case "sun":
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
        </svg>
      );
    case "moon":
      return (
        <svg {...props}>
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
        </svg>
      );
    default:
      return null;
  }
}

function AdminLayout({ user, onExit }) {
  const [adminView, setAdminView] = useState("dashboard");
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") return THEMES.LIGHT;
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === THEMES.LIGHT || stored === THEMES.DARK) return stored;
    return document.documentElement.getAttribute("data-theme") || THEMES.LIGHT;
  });

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === THEMES.LIGHT ? THEMES.DARK : THEMES.LIGHT));
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch (e) {
      console.warn("Could not save theme:", e);
    }
  }, [theme]);

  const displayName = useMemo(() => {
    const raw = (user?.name && user.name.trim()) || user?.email || "Admin";
    return raw;
  }, [user]);

  const initials = useMemo(() => {
    const source = displayName.trim();
    if (!source) return "AD";
    const parts = source.split(/\s+/);
    const letters = parts
      .map((p) => p.charAt(0))
      .join("")
      .slice(0, 2)
      .toUpperCase();
    return letters || "AD";
  }, [displayName]);

  const navItems = [
    { id: "dashboard", label: "Bảng điều khiển", icon: "dashboard", section: "Tổng quan" },
    { id: "users", label: "Tài khoản người dùng", icon: "users", section: "Quản lý" },
    { id: "library", label: "Thư viện Mẫu", icon: "library", section: "Quản lý" },
  ];

  const currentSectionLabel =
    adminView === "dashboard"
      ? "Bảng điều khiển"
      : adminView === "users"
      ? "Người dùng"
      : "Thư viện mẫu nhà";

  return (
    <div className="admin-shell">
      <aside className="admin-shell__sidebar" aria-label="Điều hướng quản trị">
        <div className="admin-shell__sidebar-brand">
          <div className="admin-shell__sidebar-logo">AI</div>
          <span className="admin-shell__sidebar-title">Ngoại Thất AI</span>
        </div>

        <nav className="admin-shell__sidebar-nav">
          {navItems.map((item, index) => {
            const prevItem = navItems[index - 1];
            const showSection = !prevItem || prevItem.section !== item.section;
            
            return (
              <div key={item.id}>
                {showSection && (
                  <p className="admin-shell__sidebar-section">{item.section}</p>
                )}
                <button
                  type="button"
                  className={`admin-shell__sidebar-item${adminView === item.id ? " is-active" : ""}`}
                  onClick={() => setAdminView(item.id)}
                >
                  <Icon name={item.icon} size={18} />
                  <span>{item.label}</span>
                </button>
              </div>
            );
          })}
        </nav>

        <div className="admin-shell__sidebar-footer">
          <button
            type="button"
            className="admin-shell__sidebar-exit"
            onClick={onExit}
          >
            <Icon name="exit" size={18} />
            <span>Trang người dùng</span>
          </button>
        </div>
      </aside>

      <div className="admin-shell__content">
        <header className="admin-shell__topbar">
          <div className="admin-shell__topbar-path">
            <span className="admin-shell__crumb">Trang quản trị</span>
            <span className="admin-shell__crumb-sep">/</span>
            <span className="admin-shell__crumb-current">{currentSectionLabel}</span>
          </div>

          <div className="admin-shell__topbar-meta">
            <button
              type="button"
              onClick={toggleTheme}
              className="theme-toggle"
              aria-label={theme === THEMES.LIGHT ? "Chuyển sang chế độ tối" : "Chuyển sang chế độ sáng"}
            >
              <Icon name={theme === THEMES.LIGHT ? "moon" : "sun"} size={20} />
            </button>
            
            <div className="admin-shell__avatar">
              <span className="admin-shell__avatar-circle">{initials}</span>
              <div>
                <p className="admin-shell__avatar-name">{displayName}</p>
                <p className="admin-shell__avatar-role">Quản trị viên</p>
              </div>
            </div>
          </div>
        </header>

        <main className="admin-shell__main">
          {adminView === "dashboard" ? (
            <AdminDashboardPage token={user.token} />
          ) : adminView === "users" ? (
            <AdminUserManagement token={user.token} />
          ) : adminView === "library" ? (
            <AdminLibraryManager token={user.token} />
          ) : null}
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
