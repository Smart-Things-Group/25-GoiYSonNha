# Mix & Match Page - Redesign Design

**Date**: 2026-02-26
**Status**: Approved

## Overview

Redesign toàn bộ trang Mix & Match của Paint Studio AI. Trang cho phép khách hàng upload ảnh nhà, chọn màu sơn thực tế từ các thương hiệu, và xem kết quả AI render trước/sau.

## Target Users

Khách hàng công ty bán sơn - chủ nhà muốn xem trước màu sơn trên nhà mình. Cần giao diện đơn giản, dễ theo dõi, mobile-friendly.

## Design Decisions

| Quyết định | Lựa chọn | Lý do |
|---|---|---|
| Phong cách | Minimal & Clean | Phù hợp tệp khách hàng mua sơn, không cần giao diện phức tạp |
| Layout | Vertical Flow (single page scroll) | Flow tự nhiên từ trên xuống, dễ theo dõi |
| Thư viện vùng miền | Modal riêng biệt | 4 loại ảnh (Bắc/Trung/Nam/Âu) cần không gian lớn để browse |
| Bảng màu | Inline cải tiến | Ô màu lớn hơn, search, filter brand, hiển thị tất cả |
| Kết quả | Before/After slider | Trực quan, tạo hiệu ứng "wow" thuyết phục khách hàng |

## Layout Structure

### Page Flow (Top → Bottom)

1. **Header**: Title + subtitle mô tả
2. **Upload Row**: 2 cột - Upload ảnh nhà (trái) + Card vùng miền (phải, mở modal)
3. **Component Tabs**: Horizontal pills (Tường / Mái / Cột / Cửa chính / Cửa sổ)
4. **Color Palette**: Brand filter dropdown + Search input + Color grid (full-width)
5. **Summary Bar**: Tóm tắt tất cả 5 bộ phận + màu đã chọn
6. **Generate Button**: Full-width CTA
7. **Result Area**: Before/After slider

### Modal Vùng Miền

- Filter tabs: Tất cả / Bắc Bộ / Trung Bộ / Nam Bộ / Âu
- Grid 3 cột: Ảnh thumbnail lớn + tên vùng + mô tả ngắn
- Nút xác nhận lựa chọn
- Backdrop overlay + close button

## Component Specifications

### Upload Area
- Border dashed khi chưa có ảnh, solid khi đã upload
- Drag & drop support
- Preview thumbnail + nút "Thay đổi ảnh"
- Kích thước: chiếm ~60% width

### Vùng Miền Card
- Hiển thị trạng thái: "Chưa chọn" hoặc thumbnail + tên đã chọn
- Nút "Chọn mẫu" / "Thay đổi" mở modal
- Kích thước: chiếm ~40% width

### Component Tabs
- Horizontal pills row
- Icon + label cho mỗi tab
- Badge chấm tròn nhỏ (12px) góc trên phải hiển thị màu đã chọn
- Active state: filled background, border brand-primary

### Color Palette (Cải tiến)
- **Filter**: Dropdown chọn thương hiệu
- **Search**: Input tìm theo tên màu
- **Grid**: Responsive, ~10-12 cột trên desktop, ô ~40px
- **Hiển thị tất cả** (bỏ giới hạn 40)
- **Hover**: Tooltip với tên màu + hex code + thương hiệu
- **Selected**: Border dày + check icon nhỏ

### Summary Bar
- Horizontal row hiển thị 5 bộ phận
- Mỗi bộ phận: icon + label + ô vuông màu đã chọn (hoặc "—")
- Giúp user thấy tổng quan trước khi generate

### Before/After Slider
- 2 ảnh overlay (ảnh gốc + ảnh AI render)
- Line dọc chia + handle tròn kéo ngang
- Mouse drag + touch drag support
- Default position: 50%

### Loading State
- Overlay trên toàn page
- Spinner + text "Đang tạo thiết kế..."
- Subtitle "AI đang xử lý ảnh. Vui lòng đợi 10-30 giây."

## Styling

- Sử dụng CSS variables hiện có (--color-brand-primary, --color-surface, etc.)
- Chuyển từ inline styles sang CSS classes
- Dark/light mode compatible
- Responsive breakpoints cho mobile

## Technical Notes

- Giữ nguyên tất cả API calls hiện tại (fetchRegionalStyles, fetchPaintBrands, fetchPaintColors, generateMixMatch)
- Giữ nguyên state management logic
- Tách BeforeAfterSlider thành component riêng
- Tách RegionalStyleModal thành component riêng
- Bỏ giới hạn `.slice(0, 40)` cho bảng màu
- Thêm search filter cho bảng màu (filter client-side theo ColorName)
