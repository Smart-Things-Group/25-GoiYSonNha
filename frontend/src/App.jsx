import { useEffect, useMemo, useState, useCallback } from "react";
import "./App.css";
import HistoryViewer from "./components/HistoryViewer.jsx";
import LoginPage from "./components/LoginPage.jsx";
import RegisterPage from "./components/RegisterPage.jsx";
import ResultStep from "./components/ResultStep.jsx";
import SelectRequirementsStep from "./components/SelectRequirementsStep.jsx";
import UploadHouseStep from "./components/UploadHouseStep.jsx";
import UploadSampleStep from "./components/UploadSampleStep.jsx";
import ProfilePage from "./components/ProfilePage.jsx";
import ToastList from "./components/ToastList.jsx";
import { getHistories } from "./api/wizard";
import { loginUser, registerUser } from "./api/auth";
import useToasts from "./hooks/useToasts.js";
import useWizardFlow from "./hooks/useWizardFlow.js";
import useHistoryManager from "./hooks/useHistoryManager.js";
import AdminLayout from "./components/AdminLayout.jsx";

// Theme utilities
const THEME_STORAGE_KEY = "exteriorTheme";
const THEMES = { LIGHT: "light", DARK: "dark" };

function getInitialTheme() {
  if (typeof window === "undefined") return THEMES.LIGHT;
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === THEMES.LIGHT || stored === THEMES.DARK) return stored;
  } catch (e) {
    console.warn("Could not read theme from localStorage:", e);
  }
  // Check system preference
  if (window.matchMedia?.("(prefers-color-scheme: dark)")?.matches) {
    return THEMES.DARK;
  }
  return THEMES.LIGHT;
}

const iconBaseProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": "true",
};

function Icon({ name, size = 18, className }) {
  const props = { ...iconBaseProps, width: size, height: size, className };

  switch (name) {
    case "palette":
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="8.5" />
          <circle cx="8.5" cy="10" r="1.3" fill="currentColor" stroke="none" />
          <circle cx="12" cy="8.5" r="1.3" fill="currentColor" stroke="none" />
          <circle cx="15.5" cy="10.5" r="1.2" fill="currentColor" stroke="none" />
          <path d="M12 20c2.5 0 3.5-1.4 3-3.2-.4-1.4.4-2.3 1.6-2.6" />
        </svg>
      );
    case "spark":
      return (
        <svg {...props}>
          <path d="M12 4.5 13.4 9 18 10.6 13.4 12.2 12 16.7 10.6 12.2 6 10.6 10.6 9z" />
          <path d="M5.5 5 6 7 7.8 7.5 6 8 5.5 9.8 5 8 3.2 7.5 5 7z" />
          <path d="M17.5 14 18 15.8 19.8 16.3 18 16.8 17.5 18.6 17 16.8 15.2 16.3 17 15.8z" />
        </svg>
      );
    case "camera":
      return (
        <svg {...props}>
          <rect x="4.5" y="7" width="15" height="11" rx="3" />
          <path d="M9 6.5h6" />
          <circle cx="12" cy="12.5" r="3.4" />
        </svg>
      );
    case "check":
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="8.5" />
          <path d="m8.7 12 2.2 2.2 4.4-4.7" />
        </svg>
      );
    case "compass":
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="8.5" />
          <path d="m9.5 14.5 1.1-3.9 3.9-1.1-1.1 3.9z" />
        </svg>
      );
    case "clock":
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="8.5" />
          <path d="M12 8v4l2.5 2.5" />
        </svg>
      );
    case "user":
      return (
        <svg {...props}>
          <circle cx="12" cy="9" r="3.2" />
          <path d="M6.5 18.5a6 6 0 0 1 11 0" />
        </svg>
      );
    case "shield":
      return (
        <svg {...props}>
          <path d="M12 4 6 6v5.5c0 3.9 2.5 7.5 6 8.5 3.5-1 6-4.6 6-8.5V6z" />
          <path d="m9.5 13 1.8 1.8 3.2-3.6" />
        </svg>
      );
    case "home":
      return (
        <svg {...props}>
          <path d="M4.5 10.5 12 5l7.5 5.5" />
          <path d="M6.5 10v8.5h11V10" />
          <path d="M10.5 18.5v-3.5h3v3.5" />
        </svg>
      );
    case "logo":
      return (
        <svg {...props}>
          <path d="M4.5 11.5 12 5l7.5 6.5" />
          <path d="M7 10.5v7.5h10V10.5" />
          <path d="M9.5 14.5h5" />
        </svg>
      );
    case "logout":
      return (
        <svg {...props}>
          <path d="M9 6v-2.5h8.5v17H9V18" />
          <path d="M14 12H4.5" />
          <path d="m7 9-3 3 3 3" />
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
    case "sun":
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2" />
          <path d="M12 20v2" />
          <path d="m4.93 4.93 1.41 1.41" />
          <path d="m17.66 17.66 1.41 1.41" />
          <path d="M2 12h2" />
          <path d="M20 12h2" />
          <path d="m6.34 17.66-1.41 1.41" />
          <path d="m19.07 4.93-1.41 1.41" />
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

const steps = [
  { id: "sample", label: "Ảnh mẫu", icon: "palette" },
  { id: "requirements", label: "Ngũ Hành", icon: "spark" },
  { id: "result", label: "Kết quả", icon: "check" },
];

function normaliseEmail(value = "") {
  return value.trim().toLowerCase();
}

function deriveNameFromEmail(email = "") {
  if (!email) return "Người dùng";
  const localPart = email.includes("@") ? email.split("@")[0] : email;
  const cleaned = localPart
    .replace(/[_-]+/g, " ")
    .replace(/\.+/g, " ")
    .trim();
  if (!cleaned) return "Người dùng";
  return cleaned
    .split(/\s+/)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
}

function App() {
  // Theme state
  const [theme, setTheme] = useState(getInitialTheme);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === THEMES.LIGHT ? THEMES.DARK : THEMES.LIGHT));
  }, []);

  // Apply theme to document and persist to localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    document.documentElement.setAttribute("data-theme", theme);
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch (e) {
      console.warn("Could not save theme to localStorage:", e);
    }
  }, [theme]);

  // Listen for system preference changes
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e) => {
      // Only auto-switch if user hasn't manually set a preference
      const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
      if (!stored) {
        setTheme(e.matches ? THEMES.DARK : THEMES.LIGHT);
      }
    };
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const [user, setUser] = useState(() => {
    if (typeof window === "undefined") return null;
    try {
      const stored = window.localStorage.getItem("exteriorUser");
      if (!stored) return null;
      const parsed = JSON.parse(stored);
      return parsed && typeof parsed === "object" && parsed.token ? parsed : null;
    } catch (error) {
      console.warn("Không thể đọc người dùng từ localStorage:", error);
      return null;
    }
  });

  const [authMode, setAuthMode] = useState("login");
  const [authNotice, setAuthNotice] = useState("");
  const [authPrefillEmail, setAuthPrefillEmail] = useState("");
  const [activeView, setActiveView] = useState("wizard");
  const [isAdminArea, setIsAdminArea] = useState(false);

  const { toasts, pushToast, dismissToast } = useToasts();
  const {
    wizardData,
    loadingState,
    apiMessages,
    stepIndex,
    currentStepId,
    progressPercent,
    disableNextSample,
    disableNextHouse,
    goNext,
    goBack,
    resetWizard,
    handleSampleSelected,
    handleRequirementsChange,
    handleGenerateStyle,
    handleHouseSelected,
    handleGenerateFinal,
  } = useWizardFlow({ steps, pushToast, user  });

  const {
    history,
    visibleHistory,
    personalHistory,
    saveHistory,
    updateHistoryStatus,
    deleteHistoryEntry,
    forceClearHistory,
  } = useHistoryManager(user);

  const [isHeaderCollapsed, setIsHeaderCollapsed] = useState(false);
  const [isQuickMenuOpen, setIsQuickMenuOpen] = useState(false);

useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      if (user) {
        window.localStorage.setItem("exteriorUser", JSON.stringify(user));
      } else {
        window.localStorage.removeItem("exteriorUser");
      }
    } catch (error) {
      console.warn("Không thể lưu người dùng vào localStorage:", error);
    }
  }, [user]);

  useEffect(() => {
    if (user?.role !== "admin") {
      setIsAdminArea(false);
    }
  }, [user?.role]);

  useEffect(() => {
    if (!user || activeView !== "history") return;
    let cancelled = false;
    const fetchHistories = async () => {
      try {
        const targetId = user.role === "admin" ? "" : String(user.id ?? "");
        const res = await getHistories(targetId);
        if (!cancelled && res && res.ok && Array.isArray(res.data?.items)) {
          console.log("Remote histories preview:", res.data.items.slice(0, 3));
        }
      } catch (error) {
        if (!cancelled) {
          console.warn("Không thể lấy lịch sử từ API:", error);
        }
      }
    };
    fetchHistories();
    return () => {
      cancelled = true;
    };
  }, [activeView, user]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    let rafId = null;
    const handleScroll = () => {
      const y = window.scrollY;
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        setIsHeaderCollapsed((prev) => {
          if (!prev && y > 160) return true;
          if (prev && y < 80) return false;
          return prev;
        });
      });
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (!isHeaderCollapsed) setIsQuickMenuOpen(false);
  }, [isHeaderCollapsed]);

  const navigationItems = useMemo(() => {
    const items = [
      { id: "wizard", label: "Quy trình", icon: "compass" },
      { id: "profile", label: "Hồ sơ", icon: "user" },
    ];
    if (user?.role === "admin") {
      items.push({ id: "admin-area", label: "Quản trị", icon: "shield" });
    }
    return items;
  }, [user?.role]);

  const roleLabel =
    user?.role === "admin" ? "Quản trị viên" : "Người dùng";
  const displayName =
    (user?.name && user.name.trim()) ||
    (user?.email ? deriveNameFromEmail(user.email) : "Người dùng");

  const displayInitials = useMemo(() => {
    const source = displayName.trim();
    if (!source) return "ND";
    const parts = source.split(/\s+/);
    const letters = parts
      .map((part) => part.charAt(0))
      .join("")
      .slice(0, 2)
      .toUpperCase();
    return letters || "ND";
  }, [displayName]);

  const handleSwitchAuthMode = (mode, options = {}) => {
    setAuthMode(mode);
    setAuthNotice(options.notice ?? "");
    setAuthPrefillEmail(options.prefillEmail ?? "");
  };

  const handleLogin = async ({ email, password }) => {
    const normalizedEmail = normaliseEmail(email);
    try {
      const response = await loginUser({ email: normalizedEmail, password });
      
      // Debug: Log response để kiểm tra token
      console.log("[Login] API Response:", response);
      console.log("[Login] Token received:", response?.token ? "Yes (length: " + response.token.length + ")" : "No");
      
      const backendUser =
        response && typeof response === "object" && response.user ? response.user : {};
      const resolvedEmail = backendUser.email || normalizedEmail;
      const signedInUser = {
        id: backendUser.id ?? null,
        email: resolvedEmail,
        role: backendUser.role || "user",
        name:
          (backendUser.name && backendUser.name.trim()) ||
          deriveNameFromEmail(resolvedEmail),
        token: (response && response.token) || "",
      };
      
      // Debug: Kiểm tra token trước khi lưu
      if (!signedInUser.token) {
        console.error("[Login] WARNING: Token is empty! Check backend JWT_SECRET configuration.");
      }
      
      setUser(signedInUser);
      setActiveView("wizard");
      setAuthMode("login");
      setAuthNotice("");
      setAuthPrefillEmail("");
      resetWizard();
      pushToast({
        variant: "success",
        title: "Đăng nhập thành công",
        message: "Chào mừng bạn trở lại.",
      });
      return { ok: true };
    } catch (error) {
      const message =
        (error && error.message) || "Đăng nhập thất bại. Vui lòng thử lại.";
      return { ok: false, message };
    }
  };

  const handleRegister = async ({ name, email, password }) => {
    const normalizedEmail = normaliseEmail(email);
    try {
      const response = await registerUser({
        name: name.trim(),
        email: normalizedEmail,
        password,
      });
      setAuthMode("login");
      setAuthNotice(
        (response && response.message) ||
          "Đăng ký thành công. Vui lòng đăng nhập."
      );
      setAuthPrefillEmail(normalizedEmail);
      pushToast({
        variant: "success",
        title: "Đăng ký thành công",
        message: "Bạn có thể đăng nhập bằng email vừa đăng ký.",
      });
      return { ok: true };
    } catch (error) {
      const message =
        (error && error.message) ||
        "Đăng ký thất bại, vui lòng thử lại.";
      return { ok: false, message };
    }
  };

  const handleLogout = () => {
    resetWizard();
    setUser(null);
    setActiveView("wizard");
    setAuthMode("login");
    setAuthNotice("");
    setAuthPrefillEmail("");
  };

  let stepContent = null;
  if (currentStepId === "sample") {
    stepContent = (
      <UploadSampleStep
        sampleImage={wizardData.sampleImage}
        onSampleSelected={handleSampleSelected}
        onNext={goNext}
        disableNext={disableNextSample}
        loading={loadingState.sample}
        apiMessage={apiMessages.sample}
      />
    );
  } else if (currentStepId === "requirements") {
    stepContent = (
      <SelectRequirementsStep
        requirements={wizardData.requirements}
        onChange={handleRequirementsChange}
        onBack={goBack}
        onNext={handleGenerateStyle}
        loading={loadingState.requirements}
        stylePlan={wizardData.stylePlan}
        apiMessage={apiMessages.requirements}
      />
    );
  } else {
    // Result step - handles house upload + generate + result display
    stepContent = (
      <ResultStep
        data={wizardData}
        onHouseSelected={handleHouseSelected}
        onGenerate={handleGenerateFinal}
        onSaveHistory={(notes) => saveHistory(wizardData, notes)}
        onBack={goBack}
        onRestart={resetWizard}
        onRegenerate={handleGenerateFinal}
        loading={loadingState.house}
        apiMessage={apiMessages.house || apiMessages.result}
      />
    );
  }

  const headerTitle = useMemo(() => {
    switch (activeView) {
      case "profile":
        return "Hồ sơ cá nhân";
      case "history":
        return "Lịch sử dự án";
      default:
        return "Trợ lý thiết kế ngoại thất thông minh";
    }
  }, [activeView]);

  if (user?.role === "admin" && isAdminArea) {
    return <AdminLayout user={user} onExit={() => setIsAdminArea(false)} />;
  }

  if (!user) {
    if (authMode === "register") {
      return (
        <RegisterPage
          onRegister={handleRegister}
          onSwitchMode={handleSwitchAuthMode}
          theme={theme}
          onToggleTheme={toggleTheme}
        />
      );
    }
    return (
      <LoginPage
        onLogin={handleLogin}
        onSwitchMode={handleSwitchAuthMode}
        prefillEmail={authPrefillEmail}
        notice={authNotice}
        theme={theme}
        onToggleTheme={toggleTheme}
      />
    );
  }

  return (
    <div className="app-shell">
      <ToastList toasts={toasts} onDismiss={dismissToast} />
      <header className={`app-header ${isHeaderCollapsed ? "app-header--hidden" : ""}`}>
        <div className="app-header__inner">
          {/* Logo */}
          <div className="app-logo">
            <div className="app-logo__icon">
              <Icon name="logo" size={22} />
            </div>
            <span className="app-logo__text">Paint <span>Studio</span></span>
          </div>

          {/* Navigation */}
          <nav className="app-nav" aria-label="Điều hướng">
            {navigationItems.map(({ id, label, icon }) => {
              const isActive =
                id === "admin-area"
                  ? isAdminArea
                  : !isAdminArea && activeView === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => {
                    if (id === "admin-area") {
                      if (user?.role === "admin") {
                        setIsAdminArea(true);
                      }
                    } else {
                      setIsAdminArea(false);
                      setActiveView(id);
                    }
                  }}
                  className={`nav-item${isActive ? " nav-item--active" : ""}`}
                  aria-current={isActive ? "page" : undefined}
                >
                  <Icon name={icon} size={18} />
                  {label}
                </button>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="app-header__actions">
            <div className="user-profile">
              <div className="user-profile__avatar">{displayInitials}</div>
              <div className="user-profile__info">
                <span className="user-profile__name">{displayName}</span>
                <span className="user-profile__role">{roleLabel}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={toggleTheme}
              className="theme-toggle"
              aria-label={theme === THEMES.LIGHT ? "Chế độ tối" : "Chế độ sáng"}
            >
              <Icon name={theme === THEMES.LIGHT ? "moon" : "sun"} size={20} />
            </button>

            <button type="button" onClick={handleLogout} className="btn-logout">
              <Icon name="logout" size={18} />
              Đăng xuất
            </button>
          </div>
        </div>
      </header>

      {isHeaderCollapsed ? (
        <>
          <button
            type="button"
            className={`quick-menu-toggle${isQuickMenuOpen ? " is-open" : ""}`}
            onClick={() => setIsQuickMenuOpen((prev) => !prev)}
            aria-label="Mở menu nhanh"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <rect x="4" y="7" width="16" height="2" rx="1" />
              <rect x="4" y="11" width="16" height="2" rx="1" />
              <rect x="4" y="15" width="16" height="2" rx="1" />
            </svg>
          </button>
          <div
            className={`quick-menu${isQuickMenuOpen ? " quick-menu--open" : ""}`}
            onClick={() => setIsQuickMenuOpen(false)}
          >
            <div
              className="quick-menu__panel"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="quick-menu__header">
                <div className="header-avatar">
                  <div className="header-avatar__circle">
                    <span>{displayInitials}</span>
                    <span className="header-avatar__badge">
                      <Icon name="home" size={15} />
                    </span>
                  </div>
                  <div className="header-avatar__info">
                    <p className="header-avatar__name">{displayName}</p>
                    <p className="header-avatar__role">{roleLabel}</p>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
                  <button
                    type="button"
                    onClick={toggleTheme}
                    className="theme-toggle"
                    aria-label={theme === THEMES.LIGHT ? "Chuyển sang chế độ tối" : "Chuyển sang chế độ sáng"}
                  >
                    <Icon name={theme === THEMES.LIGHT ? "moon" : "sun"} size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsQuickMenuOpen(false);
                      handleLogout();
                    }}
                    className="nav-chip nav-chip--ghost quick-menu__logout"
                  >
                    <Icon name="logout" size={15} className="nav-chip__icon" />
                    Đăng xuất
                  </button>
                </div>
              </div>

              <nav className="quick-menu__nav" aria-label="Menu điều hướng">
                {navigationItems.map(({ id, label, icon }) => {
                  const isActive =
                    id === "admin-area"
                      ? isAdminArea
                      : !isAdminArea && activeView === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => {
                        if (id === "admin-area") {
                          if (user?.role === "admin") {
                            setIsAdminArea(true);
                          }
                        } else {
                          setIsAdminArea(false);
                          setActiveView(id);
                        }
                        setIsQuickMenuOpen(false);
                      }}
                      className={`quick-menu__item${isActive ? " is-active" : ""}`}
                    >
                      <Icon name={icon} size={16} />
                      <span>{label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>
        </>
      ) : null}

      <main className="app-main">
        {activeView === "wizard" && (
          <div className="step-progress" role="list" aria-label="Tiến trình thiết kế">
            {steps.map((step, index) => {
              const isActive = index === stepIndex;
              const isComplete = index < stepIndex;
              return (
                <div key={step.id} style={{ display: "flex", alignItems: "center" }}>
                  {index > 0 && (
                    <div className={`step-progress__connector${isComplete ? " is-complete" : ""}`} />
                  )}
                  <div
                    className={`step-progress__item${isActive ? " is-active" : ""}${isComplete ? " is-complete" : ""}`}
                    role="listitem"
                  >
                    <div className="step-progress__number">{index + 1}</div>
                    <span className="step-progress__label">{step.label}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="app-stage">
          {activeView === "wizard" ? (
            stepContent
          ) : activeView === "history" ? (
            <HistoryViewer
              entries={visibleHistory}
              onDeleteHistory={deleteHistoryEntry}
              title={
                user.role === "admin"
                  ? "Lịch sử dự án"
                  : "Lịch sử dự án của tôi"
              }
              emptyMessage={
                user.role === "admin"
                  ? "Chưa có dự án nào được lưu."
                  : "Bạn chưa lưu dự án nào. Hãy tạo đề xuất trong wizard để bắt đầu."
              }
            />
          ) : activeView === "profile" ? (
            <ProfilePage
              user={user}
              historyEntries={personalHistory}
              onDeleteHistory={deleteHistoryEntry}
              draft={wizardData}
            />
          ) : activeView === "admin-users" ? (
            <AdminUserManagement token={user.token} />
          ) : activeView === "admin-dashboard" ? (
            // ✅ Truyền token cho AdminDashboardPage
            <AdminDashboardPage token={user.token} />
          ) : null}
        </div>


      </main>

      <footer className="app-footer">
        <div className="app-footer__inner">
          <div>
            <p className="app-footer__brand">Paint Studio AI</p>
            <p className="app-footer__tagline">Giải pháp tư vấn màu sơn & thiết kế ngoại thất</p>
          </div>
          <div className="app-footer__links">
            <span className="app-footer__copyright">
              © {new Date().getFullYear()} Paint Studio
            </span>
            <a href="#" className="app-footer__link">Điều khoản</a>
            <a href="#" className="app-footer__link">Hỗ trợ</a>
            <a href="#" className="app-footer__link">Liên hệ</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
