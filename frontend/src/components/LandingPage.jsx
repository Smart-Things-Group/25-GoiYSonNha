import { useCallback, useState } from "react";

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
    title: "Nhà phố hiện đại",
    description: "Mặt tiền kem - nâu sang trọng, nhiều mảng xanh và rất hợp nhà phố Việt.",
    image: "/landing/Carousel/1778151131623_download.jpg",
  },
  {
    title: "Nhà nhiệt đới hợp mệnh Mộc",
    description: "Tông xanh sage phối kem, sân vườn dày và cảm giác gần gũi thiên nhiên.",
    image: "/landing/Carousel/1778151213355_download.jpg",
  },
  {
    title: "Phối cảnh trước khi sơn",
    description: "Ảnh gốc giúp khách thấy rõ sự khác biệt trước và sau khi thử màu.",
    image: "/landing/Carousel/1778152480133_download.jpg",
  },
  {
    title: "Thiết kế AI sau phối màu",
    description: "Không gian được làm mới bằng bảng màu ngoại thất phù hợp gu và mệnh.",
    image: "/landing/after.jpg",
  },
];

const compareRows = [
  ["Tư vấn Mệnh Ngũ Hành", "Có", "Hiếm", "Không", "Tùy chuyên gia"],
  ["Thử màu trên ảnh nhà thật", "AI preview", "Không", "Có nhưng phức tạp", "Không trực quan"],
  ["Bảng màu sơn thương hiệu", "Có", "Rời rạc", "Không theo hãng VN", "Cần catalogue"],
  ["Phù hợp nhà Việt Nam", "Tập trung", "Có", "Thiên quốc tế", "Có"],
];

const previewImages = {
  before: "/landing/before.jpg",
  after: "/landing/after.jpg",
};

const SLIDER_MIN = 0;
const SLIDER_MAX = 100;

const clampSliderPosition = (value) => Math.min(SLIDER_MAX, Math.max(SLIDER_MIN, value));

const getCarouselOffset = (index, activeIndex) => {
  const halfLength = homeCards.length / 2;
  let offset = index - activeIndex;

  if (offset > halfLength) offset -= homeCards.length;
  if (offset < -halfLength) offset += homeCards.length;

  return offset;
};

function LandingPage({ onLoginClick, onRegisterClick, theme = "light", onToggleTheme }) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [activeHomeIndex, setActiveHomeIndex] = useState(0);

  const updateSliderFromPointer = useCallback((event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const nextPosition = ((event.clientX - rect.left) / rect.width) * 100;
    setSliderPosition(clampSliderPosition(nextPosition));
  }, []);

  const handlePreviewPointerDown = useCallback((event) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    updateSliderFromPointer(event);
  }, [updateSliderFromPointer]);

  const handlePreviewPointerMove = useCallback((event) => {
    if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;
    updateSliderFromPointer(event);
  }, [updateSliderFromPointer]);

  const handlePreviewPointerEnd = useCallback((event) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }, []);

  const handlePreviewKeyDown = useCallback((event) => {
    const step = event.shiftKey ? 10 : 4;

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      setSliderPosition((current) => clampSliderPosition(current - step));
      return;
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      setSliderPosition((current) => clampSliderPosition(current + step));
      return;
    }

    if (event.key === "Home") {
      event.preventDefault();
      setSliderPosition(SLIDER_MIN);
      return;
    }

    if (event.key === "End") {
      event.preventDefault();
      setSliderPosition(SLIDER_MAX);
    }
  }, []);

  const showPreviousHome = useCallback(() => {
    setActiveHomeIndex((current) => (current === 0 ? homeCards.length - 1 : current - 1));
  }, []);

  const showNextHome = useCallback(() => {
    setActiveHomeIndex((current) => (current + 1) % homeCards.length);
  }, []);

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
              <span>Phù hợp nhà Việt</span>
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
            <div
              className="landing-before-after"
              style={{ "--landing-slider-position": `${sliderPosition}%` }}
              role="slider"
              tabIndex={0}
              aria-label="So sánh ảnh gốc và thiết kế AI"
              aria-valuemin={SLIDER_MIN}
              aria-valuemax={SLIDER_MAX}
              aria-valuenow={Math.round(sliderPosition)}
              onPointerDown={handlePreviewPointerDown}
              onPointerMove={handlePreviewPointerMove}
              onPointerUp={handlePreviewPointerEnd}
              onPointerCancel={handlePreviewPointerEnd}
              onKeyDown={handlePreviewKeyDown}
            >
              <div
                className="landing-scene landing-scene--after"
                style={{ backgroundImage: `url(${previewImages.after})` }}
              />
              <div
                className="landing-scene landing-scene--before"
                style={{ backgroundImage: `url(${previewImages.before})` }}
              />
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
          <div className="landing-home-carousel" aria-label="Carousel nhà đẹp Việt Nam">
            <button
              type="button"
              className="landing-carousel-control landing-carousel-control--prev"
              onClick={showPreviousHome}
              aria-label="Xem nhà trước"
            >
              ‹
            </button>
            <div className="landing-carousel-stage">
              {homeCards.map((home, index) => {
                const offset = getCarouselOffset(index, activeHomeIndex);
                const isActive = offset === 0;
                const isVisible = Math.abs(offset) <= 1;

                return (
                  <article
                    key={home.title}
                    className={`landing-home-slide${isActive ? " is-active" : ""}`}
                    style={{
                      backgroundImage: `url(${home.image})`,
                      opacity: isVisible ? 1 : 0,
                      zIndex: isActive ? 3 : 2,
                      transform: `translateX(calc(-50% + ${offset * 76}%)) scale(${isActive ? 1 : 0.82})`,
                    }}
                    aria-hidden={!isActive}
                  >
                    <div className="landing-home-slide__caption">
                      <span>{String(index + 1).padStart(2, "0")}</span>
                      <h3>{home.title}</h3>
                      <p>{home.description}</p>
                    </div>
                  </article>
                );
              })}
            </div>
            <button
              type="button"
              className="landing-carousel-control landing-carousel-control--next"
              onClick={showNextHome}
              aria-label="Xem nhà tiếp theo"
            >
              ›
            </button>
            <div className="landing-carousel-dots" aria-label="Chọn ảnh nhà">
              {homeCards.map((home, index) => (
                <button
                  key={home.title}
                  type="button"
                  className={index === activeHomeIndex ? "is-active" : ""}
                  onClick={() => setActiveHomeIndex(index)}
                  aria-label={`Xem ${home.title}`}
                  aria-current={index === activeHomeIndex ? "true" : undefined}
                />
              ))}
            </div>
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
