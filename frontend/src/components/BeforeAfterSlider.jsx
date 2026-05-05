import { useState, useRef, useCallback } from "react";

export default function BeforeAfterSlider({ beforeSrc, afterSrc }) {
  const containerRef = useRef(null);
  const [position, setPosition] = useState(50);
  const dragging = useRef(false);

  const updatePosition = useCallback((clientX) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setPosition((x / rect.width) * 100);
  }, []);

  const onPointerDown = (e) => {
    dragging.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    updatePosition(e.clientX);
  };

  const onPointerMove = (e) => {
    if (dragging.current) updatePosition(e.clientX);
  };

  const onPointerUp = () => {
    dragging.current = false;
  };

  return (
    <div
      ref={containerRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      style={{
        position: "relative",
        width: "100%",
        overflow: "hidden",
        borderRadius: "8px",
        cursor: "ew-resize",
        userSelect: "none",
        touchAction: "none",
        aspectRatio: "4/3",
        background: "var(--color-bg-primary)",
      }}
    >
      {/* After image (full) */}
      <img
        src={afterSrc}
        alt="After"
        draggable={false}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain" }}
      />
      {/* Before image (clipped) */}
      <div style={{ position: "absolute", inset: 0, width: `${position}%`, overflow: "hidden" }}>
        <img
          src={beforeSrc}
          alt="Before"
          draggable={false}
          style={{ position: "absolute", inset: 0, width: `${containerRef.current?.offsetWidth || 9999}px`, height: "100%", objectFit: "contain" }}
        />
      </div>
      {/* Divider line */}
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: `${position}%`,
          transform: "translateX(-50%)",
          width: "3px",
          background: "white",
          boxShadow: "0 0 6px rgba(0,0,0,0.5)",
          zIndex: 2,
        }}
      />
      {/* Handle */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: `${position}%`,
          transform: "translate(-50%, -50%)",
          width: "36px",
          height: "36px",
          borderRadius: "50%",
          background: "white",
          border: "3px solid var(--color-brand-primary)",
          boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 3,
          fontSize: "14px",
          color: "var(--color-brand-primary)",
          fontWeight: 700,
        }}
      >
        &#x2194;
      </div>
      {/* Labels */}
      <div style={{ position: "absolute", top: 8, left: 8, padding: "2px 8px", background: "rgba(0,0,0,0.6)", color: "#fff", borderRadius: 4, fontSize: "0.75rem", zIndex: 4 }}>Gốc</div>
      <div style={{ position: "absolute", top: 8, right: 8, padding: "2px 8px", background: "rgba(0,0,0,0.6)", color: "#fff", borderRadius: 4, fontSize: "0.75rem", zIndex: 4 }}>Thiết kế</div>
    </div>
  );
}
