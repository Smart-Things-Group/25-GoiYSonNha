import { useState } from "react";

const iconProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

function Icon({ name, size = 20 }) {
  const props = { ...iconProps, width: size, height: size };
  switch (name) {
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
    case "palette":
      return (
        <svg {...props}>
          <circle cx="13.5" cy="6.5" r="0.5" fill="currentColor" />
          <circle cx="17.5" cy="10.5" r="0.5" fill="currentColor" />
          <circle cx="8.5" cy="7.5" r="0.5" fill="currentColor" />
          <circle cx="6.5" cy="12.5" r="0.5" fill="currentColor" />
          <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c0.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.563-2.512 5.563-5.563C22 6.5 17.5 2 12 2Z" />
        </svg>
      );
    default:
      return null;
  }
}

function LoginPage({ onLogin, onSwitchMode, prefillEmail = "", notice = "", theme = "light", onToggleTheme }) {
  const [credentials, setCredentials] = useState({
    email: prefillEmail,
    password: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field) => (e) => {
    setCredentials((prev) => ({ ...prev, [field]: e.target.value }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    setError("");

    try {
      const result = await onLogin({
        email: credentials.email.trim(),
        password: credentials.password,
      });
      if (!result?.ok) {
        setError(result?.message || "Đăng nhập thất bại.");
      }
    } catch (err) {
      setError(err?.message || "Đăng nhập thất bại.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-shell">
      {/* Brand Section */}
      <div className="auth-shell__brand">
        <div className="auth-brand">
          <div className="auth-brand__logo">
            <div className="auth-brand__logo-icon">
              <Icon name="palette" size={28} />
            </div>
            <span className="auth-brand__logo-text">Paint Studio AI</span>
          </div>
          
          <h1 className="auth-brand__title">
            Thiết kế ngoại thất<br />thông minh với AI
          </h1>
          <p className="auth-brand__subtitle">
            Giải pháp tư vấn màu sơn và phong cách kiến trúc tiên tiến dành cho ngôi nhà của bạn.
          </p>
          
          <div className="auth-features">
            <div className="auth-feature">
              <span className="auth-feature__icon">🎨</span>
              <span className="auth-feature__text">Gợi ý màu sơn phù hợp phong cách</span>
            </div>
            <div className="auth-feature">
              <span className="auth-feature__icon">🏠</span>
              <span className="auth-feature__text">Xem trước thiết kế trên ảnh thật</span>
            </div>
            <div className="auth-feature">
              <span className="auth-feature__icon">⚡</span>
              <span className="auth-feature__text">Kết quả trong vài giây</span>
            </div>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="auth-shell__form">
        <div className="auth-form-container">
          {onToggleTheme && (
            <button
              type="button"
              onClick={onToggleTheme}
              className="auth-theme-toggle"
              aria-label={theme === "light" ? "Chế độ tối" : "Chế độ sáng"}
            >
              <Icon name={theme === "light" ? "moon" : "sun"} size={20} />
            </button>
          )}

          <div className="auth-form-header">
            <h2 className="auth-form-title">Đăng nhập</h2>
            <p className="auth-form-subtitle">
              Chào mừng trở lại! Vui lòng đăng nhập để tiếp tục.
            </p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-form__field">
              <label className="auth-form__label" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={credentials.email}
                onChange={handleChange("email")}
                className="auth-form__input"
                placeholder="you@example.com"
                autoComplete="email"
              />
            </div>

            <div className="auth-form__field">
              <label className="auth-form__label" htmlFor="password">
                Mật khẩu
              </label>
              <input
                id="password"
                type="password"
                required
                value={credentials.password}
                onChange={handleChange("password")}
                className="auth-form__input"
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>

            {notice && (
              <div className="auth-form__notice auth-form__notice--info">{notice}</div>
            )}
            {error && (
              <div className="auth-form__notice auth-form__notice--error">{error}</div>
            )}

            <button
              type="submit"
              className="auth-form__submit"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <span className="auth-form__spinner" />
                  Đang đăng nhập...
                </>
              ) : (
                "Đăng nhập"
              )}
            </button>
          </form>

          <div className="auth-form-footer">
            <p>
              Chưa có tài khoản?{" "}
              <button
                type="button"
                onClick={() => onSwitchMode("register")}
                className="auth-form__link"
              >
                Đăng ký miễn phí
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
