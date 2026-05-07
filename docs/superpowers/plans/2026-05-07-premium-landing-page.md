# Premium Landing Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a premium unauthenticated landing page for Paint Studio AI with login/register CTAs, a hero before/after preview, Vietnamese home carousel, comparison table, workflow section, and final CTA.

**Architecture:** Keep authenticated app behavior in `App.jsx` unchanged except for adding a new unauthenticated `landing` auth mode. Create a focused `LandingPage.jsx` component that only receives navigation callbacks and theme props. Put landing-specific styling in `App.css` using namespaced `.landing-*` classes to avoid breaking existing auth, wizard, Mix & Match, profile, and admin UI.

**Tech Stack:** React 19, Vite, existing CSS variables/classes in `frontend/src/App.css`, no new dependencies.

---

## File Structure

- Create: `frontend/src/components/LandingPage.jsx`
  - Responsible for rendering the public marketing page.
  - Props: `onLoginClick`, `onRegisterClick`, `theme`, `onToggleTheme`.
  - No API calls, no auth state mutation, no role logic.

- Modify: `frontend/src/App.jsx`
  - Import `LandingPage`.
  - Change unauthenticated default from direct login to landing.
  - Render landing when `!user && authMode === "landing"`.
  - Keep `login` and `register` modes for existing forms.
  - Preserve authenticated role-based navigation exactly as current behavior: user sees `Mệnh Ngũ Hành`, `Mix & Match`, `Hồ sơ`; admin additionally sees `Quản trị`.

- Modify: `frontend/src/App.css`
  - Add namespaced landing styles: `.landing-shell`, `.landing-nav`, `.landing-hero`, `.landing-ai-tool`, `.landing-carousel`, `.landing-comparison`, `.landing-steps`, `.landing-final-cta`, responsive media queries.

- Verification only: `frontend/package.json`
  - Existing commands: `npm run build` and `npm run lint`.

---

### Task 1: Add the LandingPage component

**Files:**
- Create: `frontend/src/components/LandingPage.jsx`

- [ ] **Step 1: Create the component file with navigation callbacks**

Write `frontend/src/components/LandingPage.jsx`:

```jsx
const iconBaseProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": "true",
};

function Icon({ name, size = 18 }) {
  const props = { ...iconBaseProps, width: size, height: size };

  switch (name) {
    case "spark":
      return (
        <svg {...props}>
          <path d="M12 4.5 13.5 9l4.5 1.5-4.5 1.5L12 16.5 10.5 12 6 10.5 10.5 9z" />
          <path d="M5 5.5 5.5 7 7 7.5 5.5 8 5 9.5 4.5 8 3 7.5 4.5 7z" />
        </svg>
      );
    case "moon":
      return (
        <svg {...props}>
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
        </svg>
      );
    case "sun":
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
        </svg>
      );
    default:
      return null;
  }
}

const homeCards = [
  {
    title: "Nhà phố Sài Gòn",
    description: "Xanh ngọc phối trắng kem cho mặt tiền đô thị sáng và mát mắt.",
    color: "#14b8a6",
  },
  {
    title: "Mái Thái miền Tây",
    description: "Cam đất và nâu gỗ tạo cảm giác gần gũi, ấm áp.",
    color: "#f97316",
  },
  {
    title: "Biệt thự Đà Lạt",
    description: "Xanh dương trầm kết hợp be sáng cho vẻ yên bình.",
    color: "#2563eb",
  },
  {
    title: "Nhà vườn miền Bắc",
    description: "Olive nhẹ và trắng ngà hài hòa với sân vườn.",
    color: "#84cc16",
  },
];

const compareRows = [
  ["Tư vấn Mệnh Ngũ Hành", "Có", "Hiếm", "Không", "Tùy chuyên gia"],
  ["Thử màu trên ảnh nhà thật", "AI preview", "Không", "Có nhưng phức tạp", "Không trực quan"],
  ["Bảng màu sơn thương hiệu", "Có", "Rời rạc", "Không theo hãng VN", "Cần catalogue"],
  ["Phù hợp nhà Việt Nam", "Tập trung", "Có", "Thiên quốc tế", "Có"],
];

function LandingPage({ onLoginClick, onRegisterClick, theme = "light", onToggleTheme }) {
  return (
    <div className="landing-shell">
      <nav className="landing-nav" aria-label="Trang giới thiệu">
        <div className="landing-logo">
          <div className="landing-logo__mark">⌂</div>
          <span>Paint Studio AI</span>
        </div>
        <div className="landing-nav__links">
          <a href="#features">Mệnh Ngũ Hành</a>
          <a href="#homes">Nhà đẹp VN</a>
          <a href="#comparison">So sánh</a>
          <a href="#workflow">Quy trình</a>
        </div>
        <div className="landing-nav__actions">
          {onToggleTheme && (
            <button
              type="button"
              className="landing-icon-button"
              onClick={onToggleTheme}
              aria-label={theme === "light" ? "Chế độ tối" : "Chế độ sáng"}
            >
              <Icon name={theme === "light" ? "moon" : "sun"} size={18} />
            </button>
          )}
          <button type="button" className="landing-button landing-button--secondary" onClick={onLoginClick}>
            Đăng nhập
          </button>
          <button type="button" className="landing-button landing-button--primary" onClick={onRegisterClick}>
            Đăng ký
          </button>
        </div>
      </nav>

      <main>
        <section className="landing-hero">
          <div className="landing-hero__copy">
            <div className="landing-announcement">
              <Icon name="spark" size={16} />
              AI phối màu ngoại thất dành riêng cho nhà Việt
            </div>
            <h1>
              Thiết kế màu sơn
              <span> hợp mệnh, hợp gu</span>
            </h1>
            <p>
              Tải ảnh ngôi nhà, chọn phong cách Việt Nam, thử bảng màu sơn thật và xem trước diện mạo ngoại thất bằng AI trước khi thi công.
            </p>
            <div className="landing-hero__actions">
              <button type="button" className="landing-button landing-button--primary landing-button--large" onClick={onRegisterClick}>
                Bắt đầu miễn phí
              </button>
              <button type="button" className="landing-button landing-button--secondary landing-button--large" onClick={onLoginClick}>
                Tôi đã có tài khoản
              </button>
            </div>
            <div className="landing-trust-row">
              <span>🇻🇳 Phù hợp nhà Việt</span>
              <span>🎨 Bảng màu thương hiệu</span>
              <span>⚡ Tạo phối cảnh nhanh</span>
            </div>
            <div className="landing-stats">
              <div><strong>30s</strong><span>có gợi ý đầu tiên</span></div>
              <div><strong>5+</strong><span>thương hiệu sơn</span></div>
              <div><strong>AI</strong><span>xem trước/sau</span></div>
            </div>
          </div>

          <div className="landing-ai-tool" aria-label="Demo phối màu trước và sau">
            <div className="landing-ai-tool__header">
              <strong><span />Live exterior preview</strong>
              <div><span>Upload</span><span className="is-active">Preview</span><span>Save</span></div>
            </div>
            <div className="landing-before-after">
              <div className="landing-scene landing-scene--after"><div className="landing-house" /></div>
              <div className="landing-scene landing-scene--before"><div className="landing-house landing-house--raw" /></div>
              <span className="landing-image-label landing-image-label--left">Ảnh gốc</span>
              <span className="landing-image-label landing-image-label--right">Thiết kế AI</span>
              <div className="landing-slider-line"><span>↔</span></div>
            </div>
            <div className="landing-tool-panels">
              <div>
                <strong>Bảng màu hợp mệnh Mộc</strong>
                <div className="landing-swatches"><i style={{ background: "#14b8a6" }} /><i style={{ background: "#2563eb" }} /><i style={{ background: "#84cc16" }} /><i style={{ background: "#f97316" }} /></div>
              </div>
              <div>
                <strong>Phong cách nhà Việt</strong>
                <div className="landing-style-pills"><span>Nhà phố</span><span>Mái Thái</span><span>Biệt thự</span></div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="landing-section landing-section--features">
          <div className="landing-section__head">
            <div>
              <span className="landing-kicker">Chức năng chính</span>
              <h2>Không chỉ xem mẫu, khách có thể tự phối màu cho nhà mình</h2>
            </div>
            <p>Landing page dẫn khách chưa đăng nhập đến đăng ký, sau đó mở đúng chức năng theo role.</p>
          </div>
          <div className="landing-feature-grid">
            <article><span>🧭</span><h3>Mệnh Ngũ Hành</h3><p>Tư vấn màu sắc theo mệnh, sở thích và phong cách nhà.</p></article>
            <article><span>🎨</span><h3>Mix & Match</h3><p>Chọn màu tường, mái, cột từ bảng màu sơn thật trong MongoDB.</p></article>
            <article><span>👤</span><h3>Hồ sơ</h3><p>Lưu lại bản phối đã tạo để xem lại và so sánh.</p></article>
          </div>
        </section>

        <section id="homes" className="landing-section">
          <div className="landing-section__head">
            <div>
              <span className="landing-kicker">Cảm hứng Việt Nam</span>
              <h2>Carousel nhà đẹp để khách hàng muốn thử ngay</h2>
            </div>
            <p>Các mẫu nhà quen thuộc giúp khách dễ hình dung màu sơn trên không gian thực tế tại Việt Nam.</p>
          </div>
          <div className="landing-home-carousel">
            {homeCards.map((home) => (
              <article key={home.title} className="landing-home-card" style={{ "--home-color": home.color }}>
                <div className="landing-home-card__image" />
                <div className="landing-home-card__body">
                  <h3>{home.title}</h3>
                  <p>{home.description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="comparison" className="landing-comparison">
          <div className="landing-section landing-section--comparison">
            <div className="landing-section__head">
              <div>
                <span className="landing-kicker">So sánh thị trường</span>
                <h2>Paint Studio AI khác gì các website khác?</h2>
              </div>
              <p>Phần này tạo niềm tin bằng cách chỉ ra lợi thế cá nhân hóa theo mệnh, bảng màu thật và ảnh nhà của khách.</p>
            </div>
            <div className="landing-comparison-table">
              <div className="landing-table-row landing-table-row--head">
                <span>Tiêu chí</span><span>Paint Studio AI</span><span>Web mẫu nhà VN</span><span>App quốc tế</span><span>Tư vấn truyền thống</span>
              </div>
              {compareRows.map(([criterion, ours, local, global, consultant]) => (
                <div className="landing-table-row" key={criterion}>
                  <span>{criterion}</span><span>{ours}</span><span>{local}</span><span>{global}</span><span>{consultant}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="workflow" className="landing-section">
          <div className="landing-section__head">
            <div>
              <span className="landing-kicker">Quy trình</span>
              <h2>Từ ảnh nhà đến phối cảnh chỉ trong vài bước</h2>
            </div>
            <p>User đăng nhập sẽ thấy Mệnh Ngũ Hành, Mix & Match, Hồ sơ. Admin có thêm trang Quản trị.</p>
          </div>
          <div className="landing-steps">
            <article><span>1</span><h3>Tải ảnh nhà</h3><p>Khách đăng ký để tải ảnh mặt tiền thật.</p></article>
            <article><span>2</span><h3>Chọn mệnh & màu</h3><p>AI gợi ý nhóm màu phù hợp Mệnh Ngũ Hành.</p></article>
            <article><span>3</span><h3>Mix & Match</h3><p>Chọn màu cho tường, mái, cột từ bảng màu thật.</p></article>
            <article><span>4</span><h3>Lưu hồ sơ</h3><p>Lưu bản phối và xem lại khi cần.</p></article>
          </div>
        </section>

        <section className="landing-final-cta">
          <h2>Sẵn sàng biến ý tưởng màu sơn thành phối cảnh thật?</h2>
          <p>Đăng ký để bắt đầu phối màu ngoại thất bằng AI, hoặc đăng nhập nếu bạn đã có tài khoản.</p>
          <div>
            <button type="button" className="landing-button landing-button--primary landing-button--large" onClick={onRegisterClick}>Đăng ký ngay</button>
            <button type="button" className="landing-button landing-button--secondary landing-button--large" onClick={onLoginClick}>Đăng nhập</button>
          </div>
        </section>
      </main>
    </div>
  );
}

export default LandingPage;
```

- [ ] **Step 2: Verify the file compiles by importing no undefined external symbols**

Run from `frontend/` after Task 2 is complete because this component is not imported yet:

```powershell
npm run build
```

Expected after Task 2 and Task 3: build completes without JSX or CSS syntax errors.

---

### Task 2: Wire LandingPage into unauthenticated auth flow

**Files:**
- Modify: `frontend/src/App.jsx`

- [ ] **Step 1: Import LandingPage**

Add this import near the existing component imports:

```jsx
import LandingPage from "./components/LandingPage.jsx";
```

- [ ] **Step 2: Change the unauthenticated default mode**

Replace:

```jsx
const [authMode, setAuthMode] = useState("login");
```

With:

```jsx
const [authMode, setAuthMode] = useState("landing");
```

- [ ] **Step 3: Return to landing after logout**

In `handleLogout`, replace:

```jsx
setAuthMode("login");
```

With:

```jsx
setAuthMode("landing");
```

- [ ] **Step 4: Add landing rendering before login/register forms**

Replace the whole `if (!user) { ... }` block with:

```jsx
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

  if (authMode === "login") {
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
    <LandingPage
      theme={theme}
      onToggleTheme={toggleTheme}
      onLoginClick={() => handleSwitchAuthMode("login")}
      onRegisterClick={() => handleSwitchAuthMode("register")}
    />
  );
}
```

- [ ] **Step 5: Confirm authenticated navigation stays unchanged**

Do not change this existing `navigationItems` logic:

```jsx
const navigationItems = useMemo(() => {
  const items = [
    { id: "wizard", label: "Mệnh Ngũ Hành", icon: "compass" },
    { id: "mixmatch", label: "Mix & Match", icon: "palette" },
    { id: "profile", label: "Hồ sơ", icon: "user" },
  ];
  if (user?.role === "admin") {
    items.push({ id: "admin-area", label: "Quản trị", icon: "shield" });
  }
  return items;
}, [user?.role]);
```

---

### Task 3: Add premium landing styles

**Files:**
- Modify: `frontend/src/App.css`

- [ ] **Step 1: Append landing styles at the end of App.css**

Append the following CSS:

```css
/* ========================================================================== 
   LANDING PAGE - Premium public marketing page
   ========================================================================== */

.landing-shell {
  min-height: 100vh;
  overflow: hidden;
  color: #101828;
  background:
    radial-gradient(circle at 50% 0%, rgba(59, 130, 246, 0.12), transparent 32%),
    linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
}

.landing-nav {
  position: sticky;
  top: 18px;
  z-index: 20;
  width: min(1180px, calc(100% - 32px));
  margin: 18px auto 0;
  padding: 10px 12px 10px 16px;
  border: 1px solid rgba(226, 232, 240, 0.9);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.82);
  backdrop-filter: blur(22px);
  box-shadow: 0 20px 70px rgba(15, 23, 42, 0.08);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
}

.landing-logo,
.landing-nav__links,
.landing-nav__actions,
.landing-hero__actions,
.landing-trust-row,
.landing-style-pills,
.landing-final-cta div {
  display: flex;
  align-items: center;
}

.landing-logo {
  gap: 10px;
  font-weight: 900;
  letter-spacing: -0.02em;
  color: #0f172a;
}

.landing-logo__mark {
  width: 38px;
  height: 38px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  color: white;
  background: conic-gradient(from 180deg, #2563eb, #14b8a6, #f97316, #2563eb);
  box-shadow: 0 14px 30px rgba(37, 99, 235, 0.28);
}

.landing-nav__links {
  gap: 24px;
}

.landing-nav__links a {
  color: #475467;
  font-size: 14px;
  font-weight: 700;
  text-decoration: none;
}

.landing-nav__actions {
  gap: 10px;
}

.landing-button,
.landing-icon-button {
  border: 0;
  cursor: pointer;
  font-family: inherit;
}

.landing-button {
  border-radius: 999px;
  padding: 12px 18px;
  font-size: 14px;
  font-weight: 900;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  transition: transform 160ms ease, box-shadow 160ms ease;
}

.landing-button:hover,
.landing-icon-button:hover {
  transform: translateY(-1px);
}

.landing-button--primary {
  color: white;
  background: linear-gradient(135deg, #f97316, #fb7185);
  box-shadow: 0 18px 34px rgba(249, 115, 22, 0.28);
}

.landing-button--secondary {
  color: #1d4ed8;
  background: #eff6ff;
  border: 1px solid #dbeafe;
}

.landing-button--large {
  padding: 15px 22px;
  font-size: 15px;
}

.landing-icon-button {
  width: 42px;
  height: 42px;
  display: grid;
  place-items: center;
  border-radius: 999px;
  color: #475467;
  background: #ffffff;
  border: 1px solid #e4e7ec;
}

.landing-hero {
  width: min(1220px, calc(100% - 32px));
  margin: 0 auto;
  padding: 80px 0 88px;
  display: grid;
  grid-template-columns: 0.92fr 1.08fr;
  align-items: center;
  gap: 44px;
  position: relative;
}

.landing-hero::before {
  content: "";
  position: absolute;
  width: 620px;
  height: 620px;
  right: -280px;
  top: -110px;
  border-radius: 999px;
  background: radial-gradient(circle, rgba(249, 115, 22, 0.16), transparent 62%);
  pointer-events: none;
}

.landing-hero__copy,
.landing-ai-tool {
  position: relative;
  z-index: 1;
}

.landing-announcement {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 999px;
  color: #075985;
  background: #f0f9ff;
  border: 1px solid #bae6fd;
  font-size: 13px;
  font-weight: 900;
  margin-bottom: 20px;
}

.landing-hero h1 {
  margin: 0;
  font-size: clamp(54px, 6vw, 82px);
  line-height: 0.9;
  letter-spacing: -0.075em;
  color: #0f172a;
}

.landing-hero h1 span {
  display: block;
  background: linear-gradient(135deg, #2563eb, #14b8a6 42%, #f97316 82%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.landing-hero__copy > p {
  max-width: 560px;
  margin: 24px 0 30px;
  color: #667085;
  font-size: 19px;
  line-height: 1.72;
}

.landing-hero__actions,
.landing-final-cta div {
  gap: 12px;
  flex-wrap: wrap;
}

.landing-trust-row {
  gap: 18px;
  flex-wrap: wrap;
  color: #344054;
  font-size: 14px;
  font-weight: 800;
  margin-top: 26px;
}

.landing-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  max-width: 520px;
  margin-top: 28px;
}

.landing-stats div {
  padding: 16px;
  border: 1px solid #e4e7ec;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.78);
  box-shadow: 0 16px 38px rgba(15, 23, 42, 0.06);
}

.landing-stats strong {
  display: block;
  color: #0f172a;
  font-size: 24px;
  letter-spacing: -0.04em;
}

.landing-stats span {
  color: #667085;
  font-size: 12px;
  font-weight: 700;
}

.landing-ai-tool {
  border-radius: 36px;
  padding: 16px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.92), rgba(255, 255, 255, 0.76));
  border: 1px solid rgba(226, 232, 240, 0.9);
  box-shadow: 0 34px 100px rgba(15, 23, 42, 0.16);
  backdrop-filter: blur(20px);
}

.landing-ai-tool__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 8px 10px 16px;
}

.landing-ai-tool__header strong {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #0f172a;
}

.landing-ai-tool__header strong span {
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: #22c55e;
  box-shadow: 0 0 0 6px rgba(34, 197, 94, 0.12);
}

.landing-ai-tool__header div {
  display: flex;
  gap: 8px;
}

.landing-ai-tool__header div span {
  padding: 7px 10px;
  border-radius: 999px;
  background: #f2f4f7;
  color: #667085;
  font-size: 12px;
  font-weight: 850;
}

.landing-ai-tool__header .is-active {
  background: #101828;
  color: #ffffff;
}

.landing-before-after {
  height: 420px;
  border-radius: 28px;
  overflow: hidden;
  position: relative;
  background: #e0f2fe;
  border: 1px solid #e4e7ec;
}

.landing-scene {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, #93c5fd 0%, #dbeafe 42%, #f8fafc 43%, #f8fafc 100%);
}

.landing-scene--before {
  width: 48%;
  overflow: hidden;
  z-index: 2;
  border-right: 4px solid #ffffff;
}

.landing-house {
  position: absolute;
  left: 68px;
  bottom: 72px;
  width: 430px;
  height: 238px;
  background: #f2e7d5;
  clip-path: polygon(0 26%, 44% 5%, 100% 22%, 100% 100%, 0 100%);
  filter: drop-shadow(0 24px 38px rgba(15, 23, 42, 0.14));
}

.landing-house::before {
  content: "";
  position: absolute;
  left: 26px;
  right: 26px;
  bottom: 14px;
  height: 160px;
  border-radius: 16px;
  background:
    linear-gradient(90deg, rgba(255, 255, 255, 0.9) 0 22%, transparent 22% 29%, rgba(255, 255, 255, 0.92) 29% 53%, transparent 53% 60%, rgba(255, 255, 255, 0.9) 60% 82%, transparent 82%),
    linear-gradient(180deg, #e5c08b, #fff7ed);
}

.landing-house::after {
  content: "";
  position: absolute;
  left: -6px;
  top: 14px;
  width: 455px;
  height: 42px;
  border-radius: 10px;
  background: #805436;
  transform: skewX(-16deg);
}

.landing-house--raw {
  background: repeating-linear-gradient(90deg, #92400e 0 18px, #b45309 18px 22px);
  opacity: 0.86;
}

.landing-image-label {
  position: absolute;
  top: 18px;
  z-index: 5;
  padding: 8px 12px;
  border-radius: 999px;
  color: #ffffff;
  font-size: 12px;
  font-weight: 950;
  background: rgba(16, 24, 40, 0.82);
  backdrop-filter: blur(10px);
}

.landing-image-label--left {
  left: 18px;
}

.landing-image-label--right {
  right: 18px;
  background: rgba(249, 115, 22, 0.9);
}

.landing-slider-line {
  position: absolute;
  z-index: 7;
  top: 0;
  bottom: 0;
  left: 48%;
  width: 4px;
  background: #ffffff;
}

.landing-slider-line span {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 56px;
  height: 56px;
  border-radius: 999px;
  background: #2563eb;
  color: #ffffff;
  display: grid;
  place-items: center;
  border: 6px solid #ffffff;
  box-shadow: 0 20px 42px rgba(37, 99, 235, 0.38);
  font-weight: 950;
}

.landing-tool-panels {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  padding-top: 14px;
}

.landing-tool-panels > div {
  padding: 14px;
  border-radius: 22px;
  background: #f8fafc;
  border: 1px solid #e4e7ec;
}

.landing-tool-panels strong {
  display: block;
  color: #0f172a;
  font-size: 13px;
  margin-bottom: 10px;
}

.landing-swatches,
.landing-style-pills {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.landing-swatches i {
  width: 30px;
  height: 30px;
  border-radius: 11px;
  border: 3px solid #ffffff;
  box-shadow: 0 8px 18px rgba(15, 23, 42, 0.12);
}

.landing-style-pills span {
  padding: 7px 10px;
  border-radius: 999px;
  background: #ffffff;
  border: 1px solid #e4e7ec;
  color: #475467;
  font-size: 12px;
  font-weight: 850;
}

.landing-section {
  width: min(1220px, calc(100% - 32px));
  margin: 0 auto;
  padding: 78px 0;
}

.landing-section__head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 28px;
  margin-bottom: 30px;
}

.landing-kicker {
  color: #f97316;
  font-size: 13px;
  text-transform: uppercase;
  font-weight: 950;
  letter-spacing: 0.13em;
}

.landing-section h2,
.landing-final-cta h2 {
  margin: 8px 0 0;
  color: #0f172a;
  font-size: 44px;
  line-height: 1;
  letter-spacing: -0.055em;
}

.landing-section__head p {
  max-width: 540px;
  color: #667085;
  font-size: 16px;
  line-height: 1.68;
  margin: 0;
}

.landing-feature-grid,
.landing-steps {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
}

.landing-feature-grid article,
.landing-steps article {
  padding: 24px;
  border-radius: 28px;
  background: #ffffff;
  border: 1px solid #e4e7ec;
  box-shadow: 0 20px 54px rgba(15, 23, 42, 0.07);
}

.landing-feature-grid article > span,
.landing-steps article > span {
  width: 44px;
  height: 44px;
  border-radius: 16px;
  display: grid;
  place-items: center;
  margin-bottom: 18px;
  background: #eff6ff;
  color: #1d4ed8;
  font-size: 22px;
  font-weight: 950;
}

.landing-feature-grid h3,
.landing-steps h3,
.landing-home-card h3 {
  margin: 0 0 8px;
  color: #0f172a;
  font-size: 19px;
  letter-spacing: -0.03em;
}

.landing-feature-grid p,
.landing-steps p,
.landing-home-card p {
  margin: 0;
  color: #667085;
  font-size: 14px;
  line-height: 1.6;
}

.landing-home-carousel {
  display: grid;
  grid-template-columns: repeat(4, minmax(230px, 1fr));
  gap: 18px;
}

.landing-home-card {
  border-radius: 30px;
  overflow: hidden;
  background: #ffffff;
  border: 1px solid #e4e7ec;
  box-shadow: 0 24px 60px rgba(15, 23, 42, 0.1);
}

.landing-home-card__image {
  height: 245px;
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #e0f2fe, #fff7ed);
}

.landing-home-card__image::before {
  content: "";
  position: absolute;
  left: 28px;
  right: 28px;
  bottom: 42px;
  height: 138px;
  background: var(--home-color);
  clip-path: polygon(50% 0, 100% 38%, 90% 38%, 90% 100%, 10% 100%, 10% 38%, 0 38%);
  filter: drop-shadow(0 22px 26px rgba(15, 23, 42, 0.13));
}

.landing-home-card__image::after {
  content: "";
  position: absolute;
  left: 74px;
  right: 74px;
  bottom: 42px;
  height: 66px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.86);
}

.landing-home-card__body {
  padding: 18px;
}

.landing-comparison {
  color: #ffffff;
  background: #0f172a;
}

.landing-section--comparison h2,
.landing-section--comparison .landing-section__head p {
  color: #ffffff;
}

.landing-section--comparison .landing-section__head p {
  color: #cbd5e1;
}

.landing-comparison-table {
  border-radius: 32px;
  overflow: hidden;
  background: #111827;
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: 0 34px 100px rgba(0, 0, 0, 0.24);
}

.landing-table-row {
  display: grid;
  grid-template-columns: 1.25fr repeat(4, 1fr);
}

.landing-table-row span {
  min-height: 64px;
  padding: 18px 16px;
  display: flex;
  align-items: center;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  color: #cbd5e1;
  font-size: 14px;
  line-height: 1.4;
}

.landing-table-row span:first-child,
.landing-table-row--head span {
  color: #ffffff;
  font-weight: 950;
}

.landing-table-row span:nth-child(2) {
  color: #ffffff;
  font-weight: 950;
  background: linear-gradient(135deg, rgba(249, 115, 22, 0.25), rgba(20, 184, 166, 0.16));
}

.landing-steps {
  grid-template-columns: repeat(4, 1fr);
}

.landing-steps article > span {
  color: #ffffff;
  background: #101828;
}

.landing-final-cta {
  width: min(1180px, calc(100% - 32px));
  margin: 20px auto 90px;
  padding: 54px;
  border-radius: 40px;
  color: #ffffff;
  text-align: center;
  background:
    radial-gradient(circle at 20% 20%, rgba(20, 184, 166, 0.38), transparent 28%),
    radial-gradient(circle at 80% 20%, rgba(249, 115, 22, 0.42), transparent 30%),
    linear-gradient(135deg, #0f172a, #1e3a8a);
  box-shadow: 0 34px 100px rgba(15, 23, 42, 0.2);
}

.landing-final-cta h2 {
  color: #ffffff;
  font-size: 48px;
}

.landing-final-cta p {
  max-width: 680px;
  margin: 18px auto 26px;
  color: #dbeafe;
  font-size: 17px;
  line-height: 1.7;
}

.landing-final-cta div {
  justify-content: center;
}

@media (max-width: 1100px) {
  .landing-hero {
    grid-template-columns: 1fr;
  }

  .landing-home-carousel,
  .landing-steps {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 820px) {
  .landing-nav__links {
    display: none;
  }

  .landing-section__head {
    align-items: flex-start;
    flex-direction: column;
  }

  .landing-feature-grid,
  .landing-home-carousel,
  .landing-steps {
    grid-template-columns: 1fr;
  }

  .landing-table-row {
    grid-template-columns: 1.1fr 1fr 1fr;
  }

  .landing-table-row span:nth-child(4),
  .landing-table-row span:nth-child(5) {
    display: none;
  }
}

@media (max-width: 640px) {
  .landing-nav {
    border-radius: 24px;
    align-items: flex-start;
    flex-direction: column;
  }

  .landing-nav__actions {
    width: 100%;
    flex-wrap: wrap;
  }

  .landing-nav__actions .landing-button {
    flex: 1;
  }

  .landing-hero h1 {
    font-size: 48px;
  }

  .landing-before-after {
    height: 320px;
  }

  .landing-tool-panels,
  .landing-stats {
    grid-template-columns: 1fr;
  }

  .landing-section h2,
  .landing-final-cta h2 {
    font-size: 36px;
  }

  .landing-final-cta {
    padding: 34px 22px;
  }
}
```

---

### Task 4: Verify build, lint, and browser behavior

**Files:**
- Verify: `frontend/package.json`
- Inspect in browser: `http://localhost:5173`

- [ ] **Step 1: Install dependencies if needed**

Run from `frontend/` only if `node_modules` is missing:

```powershell
npm install
```

Expected: dependencies install without dependency resolution errors.

- [ ] **Step 2: Build the frontend**

Run from `frontend/`:

```powershell
npm run build
```

Expected: Vite production build completes with exit code `0`.

- [ ] **Step 3: Run lint**

Run from `frontend/`:

```powershell
npm run lint
```

Expected: either exit code `0`, or pre-existing lint findings are reported separately without claiming lint success.

- [ ] **Step 4: Run the dev server**

Run from `frontend/`:

```powershell
npm run dev
```

Expected: Vite serves the app at `http://localhost:5173`.

- [ ] **Step 5: Manual browser verification before completion**

Open `http://localhost:5173` while logged out and verify:

1. Landing page appears first, not login form.
2. Header buttons navigate correctly:
   - `Đăng nhập` opens existing login page.
   - `Đăng ký` opens existing register page.
3. Hero before/after preview renders without layout overflow.
4. Feature cards, Vietnamese home carousel, comparison table, workflow, and final CTA render.
5. Theme toggle still changes light/dark mode without breaking layout.
6. Login as normal user: menu shows `Mệnh Ngũ Hành`, `Mix & Match`, `Hồ sơ` only.
7. Login as admin: menu shows `Mệnh Ngũ Hành`, `Mix & Match`, `Hồ sơ`, `Quản trị`.
8. Logout returns to landing page.

---

## Self-Review

- Spec coverage: landing page, login/register CTAs, authenticated role menus, premium hero, before/after preview, Vietnamese home carousel, comparison table, workflow, final CTA, responsive layout, and verification are covered.
- Placeholder scan: no TBD/TODO/implement-later placeholders remain.
- Type consistency: `LandingPage` props match the `App.jsx` usage; `authMode` values are `landing`, `login`, and `register`; callback names are consistent.
- Git safety: commit steps are intentionally omitted because this session must not create commits unless the user explicitly requests one.
