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

function RegisterPage({ onRegister, onSwitchMode, theme = "light", onToggleTheme }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    if (!form.name.trim()) {
      setError("Vui lòng nhập họ tên.");
      return;
    }
    if (form.password !== form.confirm) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }
    if (form.password.length < 6) {
      setError("Mật khẩu cần tối thiểu 6 ký tự.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const result = await onRegister({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
      });
      if (!result?.ok) {
        setError(result?.message || "Đăng ký thất bại.");
      }
    } catch (err) {
      setError(err?.message || "Đăng ký thất bại.");
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
            Bắt đầu hành trình<br />thiết kế ngôi nhà
          </h1>
          <p className="auth-brand__subtitle">
            Tạo tài khoản miễn phí và khám phá công cụ thiết kế ngoại thất thông minh với AI.
          </p>
          
          <div className="auth-features">
            <div className="auth-feature">
              <span className="auth-feature__icon">✓</span>
              <span className="auth-feature__text">Miễn phí đăng ký và trải nghiệm</span>
            </div>
            <div className="auth-feature">
              <span className="auth-feature__icon">✓</span>
              <span className="auth-feature__text">Lưu trữ dự án không giới hạn</span>
            </div>
            <div className="auth-feature">
              <span className="auth-feature__icon">✓</span>
              <span className="auth-feature__text">Hỗ trợ tư vấn chuyên nghiệp</span>
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
            <h2 className="auth-form-title">Tạo tài khoản</h2>
            <p className="auth-form-subtitle">
              Điền thông tin bên dưới để bắt đầu.
            </p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-form__field">
              <label className="auth-form__label" htmlFor="name">
                Họ và tên
              </label>
              <input
                id="name"
                type="text"
                required
                value={form.name}
                onChange={handleChange("name")}
                className="auth-form__input"
                placeholder="Nguyễn Văn A"
                autoComplete="name"
              />
            </div>

            <div className="auth-form__field">
              <label className="auth-form__label" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={form.email}
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
                value={form.password}
                onChange={handleChange("password")}
                className="auth-form__input"
                placeholder="Tối thiểu 6 ký tự"
                autoComplete="new-password"
              />
            </div>

            <div className="auth-form__field">
              <label className="auth-form__label" htmlFor="confirm">
                Xác nhận mật khẩu
              </label>
              <input
                id="confirm"
                type="password"
                required
                value={form.confirm}
                onChange={handleChange("confirm")}
                className="auth-form__input"
                placeholder="Nhập lại mật khẩu"
                autoComplete="new-password"
              />
            </div>

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
                  Đang tạo tài khoản...
                </>
              ) : (
                "Tạo tài khoản"
              )}
            </button>
          </form>

          <div className="auth-form-footer">
            <p>
              Đã có tài khoản?{" "}
              <button
                type="button"
                onClick={() => onSwitchMode("login")}
                className="auth-form__link"
              >
                Đăng nhập
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
