# Hướng Dẫn Làm Báo Cáo Đồ Án Tốt Nghiệp - Ngoại Thất AI

## 1. Mục tiêu của file hướng dẫn

File này hướng dẫn cách viết báo cáo đồ án tốt nghiệp cho project **Ngoại Thất AI** theo hướng dễ đạt khoảng **40-80 trang Word**. Nội dung được xây dựng dựa trên codebase thực tế của project, gồm frontend React, backend Express, MongoDB, Cloudinary và các dịch vụ AI tạo ảnh.

Cách viết được khuyến nghị là:

> **Kết hợp cấu trúc báo cáo tốt nghiệp truyền thống với mapping trực tiếp vào codebase.**

Nghĩa là mỗi chương không chỉ viết lý thuyết chung, mà còn chỉ rõ:

- Nên viết nội dung gì.
- Nên chụp màn hình nào.
- Nên vẽ sơ đồ gì.
- Nên trích dẫn file code nào.
- Nên giải thích luồng xử lý nào khi bảo vệ.
- Phần nào có thể mở rộng để đủ số trang.

---

## 2. Tên đề tài gợi ý

Bạn có thể chọn một trong các tên sau:

### Tên đề tài ngắn gọn

> **Xây dựng website gợi ý thiết kế ngoại thất căn nhà bằng trí tuệ nhân tạo**

### Tên đề tài đầy đủ hơn

> **Xây dựng hệ thống gợi ý phối màu và thiết kế ngoại thất căn nhà bằng AI dựa trên ảnh đầu vào, phong thủy Ngũ Hành và thư viện mẫu kiến trúc vùng miền**

### Tên đề tài thiên về kỹ thuật

> **Nghiên cứu và xây dựng hệ thống web ứng dụng AI đa phương thức trong gợi ý thiết kế ngoại thất nhà ở**

Khuyến nghị dùng tên thứ 2 vì bao quát được đầy đủ các điểm mạnh của project:

- Có AI tạo ảnh.
- Có upload ảnh nhà thật.
- Có phong thủy Ngũ Hành.
- Có thư viện mẫu vùng miền.
- Có Mix & Match màu sơn.
- Có quản trị hệ thống.

---

## 3. Cấu trúc báo cáo đề xuất để đạt 40-80 trang

| Phần | Nội dung | Số trang gợi ý |
|---|---|---:|
| Mở đầu | Lý do chọn đề tài, mục tiêu, phạm vi | 3-5 |
| Chương 1 | Tổng quan đề tài | 5-8 |
| Chương 2 | Cơ sở lý thuyết và công nghệ sử dụng | 8-12 |
| Chương 3 | Phân tích yêu cầu hệ thống | 8-12 |
| Chương 4 | Thiết kế hệ thống | 10-18 |
| Chương 5 | Cài đặt hệ thống | 10-18 |
| Chương 6 | Kiểm thử, đánh giá và triển khai | 6-10 |
| Kết luận | Kết quả đạt được, hạn chế, hướng phát triển | 3-5 |
| Phụ lục | API, prompt AI, biến môi trường, hình ảnh minh họa | 5-10 |
| **Tổng** |  | **58-98** |

Nếu trường yêu cầu 40-80 trang, bạn nên viết khoảng **55-65 trang** là đẹp. Không nên kéo quá dài bằng code thô. Thay vào đó dùng:

- Bảng chức năng.
- Sơ đồ use case.
- Sơ đồ sequence.
- Sơ đồ kiến trúc.
- Bảng collection MongoDB.
- Bảng API.
- Ảnh giao diện.
- Ảnh kết quả AI trước/sau.
- Bảng test case.

---

# PHẦN MỞ ĐẦU

## 4. Cách viết phần mở đầu

Phần mở đầu nên dài khoảng **3-5 trang**.

### 4.1. Lý do chọn đề tài

Bạn có thể viết theo ý sau:

Trong những năm gần đây, nhu cầu cải tạo và thiết kế ngoại thất nhà ở tại Việt Nam ngày càng tăng. Tuy nhiên, việc hình dung trước màu sắc, vật liệu và phong cách ngoại thất sau khi thi công vẫn còn khó khăn với nhiều người dùng phổ thông. Thông thường, người dùng cần thuê kiến trúc sư hoặc sử dụng phần mềm thiết kế chuyên dụng, điều này tốn chi phí và yêu cầu kiến thức kỹ thuật.

Sự phát triển của trí tuệ nhân tạo, đặc biệt là các mô hình AI đa phương thức có khả năng xử lý cả văn bản và hình ảnh, mở ra hướng tiếp cận mới trong việc hỗ trợ người dùng tạo nhanh các phương án thiết kế ngoại thất. Từ một ảnh mặt tiền nhà thô, hệ thống có thể phân tích cấu trúc, áp dụng màu sắc, vật liệu và phong cách mong muốn để sinh ra ảnh gợi ý trực quan.

Đề tài **Ngoại Thất AI** được xây dựng nhằm hỗ trợ người dùng tạo phương án thiết kế ngoại thất dựa trên ảnh đầu vào, lựa chọn màu sắc theo phong thủy Ngũ Hành, thư viện mẫu kiến trúc vùng miền và danh mục màu sơn thực tế.

### 4.2. Mục tiêu đề tài

Nên chia thành mục tiêu tổng quát và mục tiêu cụ thể.

#### Mục tiêu tổng quát

Xây dựng một hệ thống web hỗ trợ người dùng tạo ảnh gợi ý thiết kế ngoại thất căn nhà bằng AI, có khả năng lưu trữ lịch sử, quản lý thư viện mẫu và hỗ trợ quản trị viên theo dõi dữ liệu hệ thống.

#### Mục tiêu cụ thể

- Xây dựng giao diện web thân thiện cho người dùng upload ảnh nhà.
- Cho phép người dùng chọn màu sắc/phong cách theo Ngũ Hành.
- Tích hợp AI để phân tích ảnh mẫu và sinh ảnh ngoại thất mới.
- Xây dựng chức năng Mix & Match cho phép kết hợp nhà thô với mẫu vùng miền và mã màu sơn.
- Lưu ảnh đầu vào, ảnh kết quả lên Cloudinary.
- Lưu thông tin người dùng, lịch sử sinh ảnh và thư viện mẫu trong MongoDB.
- Xây dựng hệ thống đăng nhập, phân quyền user/admin.
- Xây dựng trang quản trị để quản lý người dùng, thư viện mẫu và lịch sử.
- Triển khai hệ thống lên hosting để sử dụng thực tế.

### 4.3. Đối tượng sử dụng

Có 2 nhóm chính:

| Đối tượng | Mô tả |
|---|---|
| Người dùng | Đăng ký, đăng nhập, upload ảnh nhà, chọn phong cách/màu sắc, tạo ảnh AI, xem kết quả |
| Quản trị viên | Quản lý user, quản lý thư viện mẫu, xem thống kê, quản lý dữ liệu sinh ảnh |

### 4.4. Phạm vi đề tài

Nên viết rõ những gì hệ thống làm và không làm.

#### Trong phạm vi

- Website hỗ trợ tạo ảnh gợi ý ngoại thất từ ảnh nhà thật.
- Tích hợp AI image-to-image.
- Hỗ trợ chọn màu theo Ngũ Hành.
- Hỗ trợ thư viện mẫu vùng miền và Mix & Match màu sơn.
- Có đăng nhập, phân quyền, quản trị.
- Lưu ảnh trên Cloudinary, dữ liệu trên MongoDB.

#### Ngoài phạm vi

- Không thay thế hoàn toàn kiến trúc sư chuyên nghiệp.
- Không bóc tách bản vẽ kỹ thuật xây dựng.
- Không đảm bảo ảnh AI có thể thi công 100% ngoài thực tế.
- Không xử lý đầy đủ bản vẽ 2D/3D chuyên nghiệp.

---

# CHƯƠNG 1: TỔNG QUAN ĐỀ TÀI

## 5. Nội dung nên viết trong chương 1

Chương này nên dài khoảng **5-8 trang**.

### 5.1. Bối cảnh thực tế

Nên trình bày các ý:

- Người dùng khó hình dung nhà sau khi sơn/sửa ngoại thất.
- Tư vấn thiết kế truyền thống tốn chi phí và thời gian.
- Các công cụ thiết kế chuyên nghiệp khó dùng với người không chuyên.
- AI tạo ảnh giúp rút ngắn quá trình thử nghiệm ý tưởng.
- Ở Việt Nam, yếu tố phong thủy và vùng miền có ảnh hưởng tới lựa chọn màu sắc/kiến trúc.

### 5.2. Bài toán đặt ra

Bài toán của hệ thống:

> Cho một ảnh mặt tiền nhà và yêu cầu về màu sắc/phong cách, hệ thống cần sinh ra ảnh gợi ý ngoại thất mới sao cho vẫn giữ được cấu trúc nhà gốc nhưng thay đổi màu sắc, vật liệu và cảm giác thẩm mỹ phù hợp.

Các yêu cầu quan trọng:

- Giữ nguyên bố cục nhà gốc.
- Không làm thay đổi số tầng, vị trí cửa, tỷ lệ kiến trúc.
- Tạo ảnh có màu sắc phù hợp với mệnh Ngũ Hành hoặc mẫu vùng miền.
- Kết quả phải dễ so sánh trước/sau.
- Người dùng phổ thông có thể thao tác dễ dàng.

### 5.3. Giải pháp đề xuất

Hệ thống gồm các thành phần:

- Frontend React để người dùng thao tác.
- Backend Express xử lý API.
- MongoDB lưu user, lịch sử, thư viện mẫu, màu sơn.
- Cloudinary lưu ảnh đầu vào và ảnh kết quả.
- AI provider để phân tích và tạo ảnh.
- Admin dashboard để quản trị dữ liệu.

Có thể viết đoạn mô tả:

> Hệ thống được thiết kế theo mô hình client-server. Frontend gửi yêu cầu upload ảnh và lựa chọn cấu hình thiết kế tới backend. Backend lưu ảnh lên Cloudinary, xây dựng prompt dựa trên yêu cầu của người dùng, sau đó gọi các dịch vụ AI tạo ảnh. Ảnh kết quả được lưu lại và trả về frontend để hiển thị dưới dạng so sánh trước/sau.

### 5.4. Chức năng chính của hệ thống

Nên đưa bảng sau vào báo cáo:

| Nhóm chức năng | Mô tả |
|---|---|
| Đăng ký/đăng nhập | Người dùng tạo tài khoản và đăng nhập bằng email/mật khẩu |
| Phân quyền | Hệ thống phân biệt user và admin |
| Tạo ảnh theo Ngũ Hành | Upload ảnh mẫu, chọn mệnh, upload ảnh nhà và sinh ảnh AI |
| Mix & Match | Chọn mẫu vùng miền, chọn màu tường/mái/cột và sinh ảnh phối màu |
| Lưu lịch sử | Lưu ảnh đầu vào, ảnh kết quả, prompt và thông tin người dùng |
| Quản trị người dùng | Admin xem, thêm, sửa, xóa user và phân quyền |
| Quản lý thư viện mẫu | Admin thêm/sửa/xóa ảnh mẫu vùng miền và styleData |
| Quản lý màu sơn | Backend hỗ trợ quản lý hãng sơn và màu sơn |
| So sánh trước/sau | Frontend hiển thị slider so sánh ảnh gốc và ảnh AI |

### 5.5. File code nên trích dẫn trong chương 1

- `frontend/src/App.jsx`: điều hướng chính, trạng thái đăng nhập, phân quyền.
- `frontend/src/components/LandingPage.jsx`: giao diện giới thiệu hệ thống.
- `backend/src/app.js`: cấu hình server và route.
- `backend/src/routes/wizard.js`: luồng tạo ảnh theo Ngũ Hành.
- `backend/src/routes/mixmatch.js`: luồng Mix & Match.

### 5.6. Hình ảnh nên chụp cho chương 1

- Trang landing page.
- Trang đăng nhập/đăng ký.
- Màn hình chọn chức năng chính.
- Màn hình kết quả trước/sau.
- Trang admin dashboard.

---

# CHƯƠNG 2: CƠ SỞ LÝ THUYẾT VÀ CÔNG NGHỆ SỬ DỤNG

## 6. Mục tiêu chương 2

Chương này giúp hội đồng hiểu các nền tảng công nghệ bạn dùng. Nên dài khoảng **8-12 trang**.

Không nên chỉ liệt kê công nghệ. Mỗi công nghệ nên viết theo cấu trúc:

1. Công nghệ là gì.
2. Vì sao phù hợp với đề tài.
3. Được dùng ở đâu trong project.
4. File code liên quan.

---

## 7. React và Vite

### 7.1. React

React là thư viện JavaScript dùng để xây dựng giao diện người dùng theo mô hình component. Trong project, React được dùng để chia giao diện thành nhiều component nhỏ như đăng nhập, đăng ký, wizard tạo ảnh, kết quả, Mix & Match và admin dashboard.

Nên viết các ý:

- React giúp tái sử dụng component.
- State quản lý bằng `useState`, `useEffect` và custom hooks.
- Giao diện thay đổi linh hoạt theo trạng thái đăng nhập, loading, kết quả AI.

File liên quan:

- `frontend/src/App.jsx`
- `frontend/src/main.jsx`
- `frontend/src/hooks/useWizardFlow.js`
- `frontend/src/components/ResultStep.jsx`
- `frontend/src/components/MixMatchPage.jsx`

### 7.2. Vite

Vite là công cụ build frontend hiện đại, hỗ trợ chạy dev server nhanh và build production tối ưu.

Trong project:

- Frontend chạy bằng `npm run dev`.
- Build production bằng `npm run build`.
- Biến môi trường frontend dùng tiền tố `VITE_`, ví dụ `VITE_API_URL`.

File liên quan:

- `frontend/package.json`
- `frontend/vite.config.js`
- `frontend/.env.example`

---

## 8. Node.js và Express.js

Node.js là môi trường chạy JavaScript phía server. Express.js là framework giúp xây dựng REST API.

Trong project, Express đảm nhiệm:

- Nhận request từ frontend.
- Xử lý upload ảnh.
- Xác thực JWT.
- Gọi AI provider.
- Lưu dữ liệu vào MongoDB.
- Trả kết quả JSON về frontend.

File liên quan:

- `backend/src/app.js`
- `backend/src/server.js`
- `backend/src/routes/users.js`
- `backend/src/routes/wizard.js`
- `backend/src/routes/mixmatch.js`
- `backend/src/routes/admin.js`

Nên vẽ sơ đồ:

```text
Frontend React
     |
     | HTTP request / JSON / FormData
     v
Backend Express API
     |
     | Mongoose / Cloudinary / AI Provider
     v
MongoDB + Cloudinary + AI Services
```

---

## 9. MongoDB và Mongoose

### 9.1. MongoDB

MongoDB là cơ sở dữ liệu NoSQL lưu dữ liệu dưới dạng document JSON/BSON. Project hiện tại dùng MongoDB để lưu:

- Người dùng.
- Lịch sử sinh ảnh.
- Thư viện mẫu vùng miền.
- Hãng sơn.
- Mã màu sơn.
- Dự án Mix & Match.
- Cấu hình phối màu.

Lưu ý khi viết báo cáo:

> Một số tài liệu cũ trong project còn nhắc SQL Server, nhưng phiên bản code hiện tại đã chuyển sang MongoDB/Mongoose. Khi viết báo cáo chính thức, nên trình bày theo MongoDB để đúng với code hiện tại.

### 9.2. Mongoose

Mongoose giúp định nghĩa schema và thao tác với MongoDB bằng model.

File model quan trọng:

| Model | File | Vai trò |
|---|---|---|
| User | `backend/src/models/User.js` | Lưu tài khoản, mật khẩu hash, role |
| Generation | `backend/src/models/Generation.js` | Lưu lịch sử tạo ảnh Ngũ Hành |
| RegionalLibrary | `backend/src/models/RegionalLibrary.js` | Lưu thư viện mẫu vùng miền |
| PaintBrand | `backend/src/models/PaintBrand.js` | Lưu hãng sơn |
| PaintColor | `backend/src/models/PaintColor.js` | Lưu màu sơn |
| MixMatchProject | `backend/src/models/MixMatchProject.js` | Lưu lịch sử Mix & Match |
| DesignConfig | `backend/src/models/DesignConfig.js` | Lưu cấu hình phối màu |
| ColorPalette | `backend/src/models/ColorPalette.js` | Lưu bảng màu tổng quát |
| ImageMask | `backend/src/models/ImageMask.js` | Dự kiến lưu dữ liệu phân vùng ảnh |

---

## 10. JWT và bcrypt

### 10.1. JWT

JWT được dùng để xác thực người dùng sau khi đăng nhập. Khi login thành công, backend tạo token và frontend lưu token để gửi kèm các request cần đăng nhập.

File liên quan:

- `backend/src/routes/users.js`
- `backend/src/middlewares/auth.js`
- `frontend/src/api/auth.js`
- `frontend/src/App.jsx`

Luồng xác thực:

```text
User nhập email/password
        |
        v
POST /api/users/login
        |
        v
Backend kiểm tra mật khẩu
        |
        v
Tạo JWT token
        |
        v
Frontend lưu token
        |
        v
Request sau gửi Authorization: Bearer <token>
```

### 10.2. bcrypt

bcrypt được dùng để hash mật khẩu trước khi lưu database. Điều này giúp tránh lưu mật khẩu dạng plaintext.

Nên nhấn mạnh trong báo cáo:

- Mật khẩu không được lưu trực tiếp.
- Khi đăng nhập, hệ thống dùng bcrypt để so sánh mật khẩu người dùng nhập với passwordHash.

---

## 11. Cloudinary

Cloudinary được dùng để lưu trữ ảnh vì ảnh AI và ảnh upload có dung lượng lớn, không nên lưu trực tiếp trong database.

Trong project, Cloudinary lưu:

- Ảnh mẫu người dùng upload.
- Ảnh nhà thô.
- Ảnh kết quả AI.
- Ảnh thư viện mẫu.
- Ảnh logo hãng sơn.
- Ảnh swatch màu sơn.

File liên quan:

- `backend/src/services/cloud.js`
- `backend/src/routes/wizard.js`
- `backend/src/routes/mixmatch.js`
- `backend/src/routes/admin.js`

Nên vẽ sơ đồ:

```text
Ảnh upload từ frontend
        |
        v
Backend nhận buffer ảnh
        |
        v
Upload lên Cloudinary
        |
        v
Nhận secure_url
        |
        v
Lưu URL vào MongoDB
```

---

## 12. AI tạo ảnh và image-to-image

### 12.1. AI đa phương thức

AI đa phương thức là AI có thể xử lý nhiều loại dữ liệu như văn bản và hình ảnh. Trong project, AI nhận:

- Ảnh nhà gốc.
- Ảnh mẫu tham khảo nếu có.
- Prompt mô tả phong cách/màu sắc.

Sau đó AI trả về ảnh ngoại thất mới.

### 12.2. Image-to-image

Hệ thống không chỉ dùng text-to-image, mà chủ yếu dùng **image-to-image**.

Điểm khác nhau:

| Kỹ thuật | Mô tả | Phù hợp với project? |
|---|---|---|
| Text-to-image | Chỉ nhập prompt, AI tự tạo ảnh mới | Không phù hợp nếu cần giữ nhà gốc |
| Image-to-image | Nhập ảnh gốc + prompt, AI chỉnh sửa ảnh dựa trên ảnh gốc | Phù hợp vì cần giữ cấu trúc nhà |

Trong báo cáo nên nhấn mạnh:

> Hệ thống sử dụng image-to-image để giữ lại hình khối, số tầng, cửa sổ, cửa chính và góc chụp của căn nhà gốc, chỉ thay đổi bề mặt ngoại thất như màu sơn, vật liệu và chi tiết trang trí.

### 12.3. AI provider trong project

File quan trọng:

- `backend/src/services/external-ai.js`

Các provider được hỗ trợ:

| Provider | Vai trò |
|---|---|
| HQ Image API | Provider ưu tiên khi cấu hình sẵn, gọi qua API gateway |
| Google Gemini | Phân tích ảnh và tạo ảnh |
| Stability AI | Fallback image-to-image |
| SD 3.5 Server | Provider Stable Diffusion custom |
| Replicate | Fallback |
| Hugging Face | Fallback |

Cách viết khi bảo vệ:

> Hệ thống thiết kế theo hướng multi-provider. Nếu provider chính không khả dụng, backend có thể chuyển sang provider khác để tăng tính ổn định. Đây là cách giúp hệ thống linh hoạt hơn khi triển khai thực tế.

---

## 13. Ngũ Hành trong phối màu ngoại thất

Project có chức năng chọn mệnh:

- Kim
- Mộc
- Thủy
- Hỏa
- Thổ
- Không/Tự động

Trong `backend/src/routes/wizard.js`, mỗi mệnh được ánh xạ sang màu sắc phù hợp.

Ví dụ:

| Mệnh | Màu gợi ý |
|---|---|
| Kim | Trắng, bạc, xám, vàng kim |
| Mộc | Xanh lá, xanh rừng, olive |
| Thủy | Xanh navy, xanh biển, đen |
| Hỏa | Đỏ, cam, hồng, burgundy |
| Thổ | Vàng đất, nâu, be, terracotta |

Nên viết:

> Việc tích hợp Ngũ Hành giúp hệ thống phù hợp hơn với thói quen lựa chọn màu sắc nhà ở tại Việt Nam, nơi yếu tố phong thủy thường được người dùng quan tâm khi sơn sửa nhà.

---

# CHƯƠNG 3: PHÂN TÍCH YÊU CẦU HỆ THỐNG

## 14. Mục tiêu chương 3

Chương này nên dài **8-12 trang**. Đây là chương dễ kéo trang bằng bảng use case, mô tả actor, sơ đồ nghiệp vụ.

---

## 15. Actor của hệ thống

| Actor | Vai trò |
|---|---|
| Khách chưa đăng nhập | Xem giao diện giới thiệu, đăng ký, đăng nhập |
| User | Tạo ảnh ngoại thất, dùng Mix & Match, xem kết quả, lưu lịch sử |
| Admin | Quản lý người dùng, thư viện mẫu, lịch sử, dữ liệu hệ thống |
| AI Provider | Dịch vụ bên ngoài nhận prompt/ảnh và trả ảnh kết quả |
| Cloudinary | Dịch vụ lưu trữ ảnh |
| MongoDB | Cơ sở dữ liệu lưu document hệ thống |

---

## 16. Yêu cầu chức năng

### 16.1. Nhóm chức năng tài khoản

| Mã | Chức năng | Mô tả |
|---|---|---|
| F01 | Đăng ký | Người dùng tạo tài khoản bằng email và mật khẩu |
| F02 | Đăng nhập | Người dùng đăng nhập để nhận JWT token |
| F03 | Phân quyền | Hệ thống phân biệt user/admin |
| F04 | Đăng xuất | Xóa session phía frontend |

File liên quan:

- `backend/src/routes/users.js`
- `backend/src/middlewares/auth.js`
- `backend/src/middlewares/isAdmin.js`
- `frontend/src/components/LoginPage.jsx`
- `frontend/src/components/RegisterPage.jsx`

### 16.2. Nhóm chức năng tạo ảnh theo Ngũ Hành

| Mã | Chức năng | Mô tả |
|---|---|---|
| F05 | Upload ảnh mẫu | Người dùng upload ảnh tham khảo |
| F06 | Phân tích ảnh mẫu | AI phân tích vật liệu, màu sắc, phong cách |
| F07 | Chọn mệnh | Người dùng chọn Kim/Mộc/Thủy/Hỏa/Thổ |
| F08 | Upload ảnh nhà thật | Người dùng upload ảnh mặt tiền nhà |
| F09 | Sinh ảnh AI | Backend gọi AI tạo ảnh ngoại thất mới |
| F10 | So sánh kết quả | Hiển thị ảnh trước/sau bằng slider |
| F11 | Lưu lịch sử | Lưu thông tin sinh ảnh vào database |

File liên quan:

- `backend/src/routes/wizard.js`
- `backend/src/services/external-ai.js`
- `frontend/src/hooks/useWizardFlow.js`
- `frontend/src/components/UploadSampleStep.jsx`
- `frontend/src/components/SelectRequirementsStep.jsx`
- `frontend/src/components/ResultStep.jsx`

### 16.3. Nhóm chức năng Mix & Match

| Mã | Chức năng | Mô tả |
|---|---|---|
| F12 | Upload ảnh nhà | Người dùng upload ảnh nhà cần phối |
| F13 | Chọn mẫu vùng miền | Chọn mẫu Bắc/Trung/Nam/Âu từ thư viện |
| F14 | Chọn màu sơn | Chọn màu tường, mái, cột |
| F15 | Chọn AI engine | Tự động/HQ/Stability/SD 3.5 |
| F16 | Sinh ảnh phối màu | Tạo ảnh mới dựa trên mẫu và màu sơn |
| F17 | Lưu project | Lưu MixMatchProject vào MongoDB |

File liên quan:

- `backend/src/routes/mixmatch.js`
- `frontend/src/components/MixMatchPage.jsx`
- `frontend/src/components/BeforeAfterSlider.jsx`
- `frontend/src/api/mixmatch.js`

### 16.4. Nhóm chức năng admin

| Mã | Chức năng | Mô tả |
|---|---|---|
| F18 | Xem dashboard | Xem số liệu tổng quan |
| F19 | Quản lý user | Thêm/sửa/xóa user, đổi role |
| F20 | Quản lý thư viện mẫu | Thêm/sửa/xóa mẫu nhà vùng miền |
| F21 | Quản lý lịch sử | Xem/xóa lịch sử sinh ảnh |
| F22 | Export PDF | Xuất báo cáo lịch sử sinh ảnh |
| F23 | Quản lý hãng sơn | Backend hỗ trợ CRUD paint brand |
| F24 | Quản lý màu sơn | Backend hỗ trợ CRUD paint color |

File liên quan:

- `backend/src/routes/admin.js`
- `frontend/src/components/AdminLayout.jsx`
- `frontend/src/components/AdminDashboardPage.jsx`
- `frontend/src/components/AdminUserManagement.jsx`
- `frontend/src/components/AdminLibraryManager.jsx`

---

## 17. Yêu cầu phi chức năng

| Nhóm | Yêu cầu |
|---|---|
| Hiệu năng | API phản hồi hợp lý, tạo ảnh có thể mất 30-180 giây tùy AI provider |
| Bảo mật | Mật khẩu hash bcrypt, API protected bằng JWT, admin route cần role admin |
| Khả dụng | Có fallback AI provider khi service chính lỗi |
| Dễ dùng | Giao diện có wizard từng bước, thông báo loading, toast |
| Mở rộng | Có thể thêm provider AI, thêm mẫu vùng miền, thêm màu sơn |
| Lưu trữ | Ảnh lưu Cloudinary, database chỉ lưu URL |
| Triển khai | Frontend deploy Vercel, backend deploy Render |

---

## 18. Use case nên vẽ

Bạn nên vẽ ít nhất 2 sơ đồ use case:

### 18.1. Use case User

Các use case:

- Đăng ký
- Đăng nhập
- Tạo ảnh theo Ngũ Hành
- Dùng Mix & Match
- Xem kết quả
- Lưu lịch sử
- Đăng xuất

### 18.2. Use case Admin

Các use case:

- Đăng nhập admin
- Xem dashboard
- Quản lý user
- Quản lý thư viện mẫu
- Quản lý lịch sử sinh ảnh
- Xuất PDF
- Quản lý màu sơn/hãng sơn

---

## 19. Luồng nghiệp vụ nên mô tả

### 19.1. Luồng tạo ảnh theo Ngũ Hành

```text
User đăng nhập
    |
Upload ảnh mẫu
    |
Backend upload Cloudinary
    |
Gemini phân tích ảnh mẫu
    |
User chọn mệnh Ngũ Hành
    |
Backend lưu requirements theo tempId
    |
User upload ảnh nhà thật
    |
Backend xây dựng prompt
    |
Gọi AI image-to-image
    |
Upload ảnh kết quả lên Cloudinary
    |
Lưu Generation vào MongoDB
    |
Frontend hiển thị slider trước/sau
```

### 19.2. Luồng Mix & Match

```text
User upload ảnh nhà
    |
Chọn mẫu vùng miền
    |
Chọn màu tường/mái/cột
    |
Chọn provider AI
    |
Backend lấy styleData + mã màu
    |
Tạo prompt chi tiết
    |
Gọi AI image-to-image
    |
Upload input/output lên Cloudinary
    |
Lưu MixMatchProject
    |
Hiển thị kết quả trước/sau
```

---

# CHƯƠNG 4: THIẾT KẾ HỆ THỐNG

## 20. Mục tiêu chương 4

Chương này nên dài **10-18 trang**. Đây là chương quan trọng nhất để thể hiện bạn hiểu hệ thống.

---

## 21. Kiến trúc tổng thể

Nên mô tả hệ thống theo 5 lớp:

| Lớp | Thành phần | Vai trò |
|---|---|---|
| Presentation | React + Vite | Giao diện người dùng |
| API | Express.js | Xử lý request/response |
| Business Logic | Routes + Services | Xây prompt, gọi AI, xử lý upload |
| Data | MongoDB + Mongoose | Lưu dữ liệu hệ thống |
| External Services | Cloudinary + AI APIs | Lưu ảnh và tạo ảnh |

Sơ đồ nên vẽ:

```text
+--------------------+
|  Frontend React    |
|  Vercel            |
+---------+----------+
          |
          | REST API / FormData / JWT
          v
+--------------------+
|  Backend Express   |
|  Render            |
+----+----------+----+
     |          |
     |          +-------------------+
     |                              |
     v                              v
+----------+                 +-------------+
| MongoDB  |                 | Cloudinary  |
+----------+                 +-------------+
     |
     v
+-------------------------------+
| External AI Providers          |
| Gemini / HQ API / Stability... |
+-------------------------------+
```

---

## 22. Thiết kế database MongoDB

Nên trình bày mỗi collection theo bảng.

### 22.1. Collection Users

| Trường | Kiểu | Mô tả |
|---|---|---|
| email | String | Email đăng nhập |
| passwordHash | String | Mật khẩu đã hash |
| role | String | user/admin |
| createdAt | Date | Ngày tạo |

File: `backend/src/models/User.js`

### 22.2. Collection Generations

| Trường | Kiểu | Mô tả |
|---|---|---|
| userId | ObjectId | Người tạo |
| inputImageUrl | String | Ảnh nhà gốc |
| outputImageUrl | String | Ảnh AI kết quả |
| style | String | Phong cách/mệnh |
| palette | String | Bảng màu |
| promptUsed | String | Prompt đã dùng |
| description | String | Ghi chú |
| createdAt | Date | Ngày tạo |

File: `backend/src/models/Generation.js`

### 22.3. Collection RegionalLibrary

| Trường | Kiểu | Mô tả |
|---|---|---|
| regionName | String | Bắc/Trung/Nam/Âu |
| imageUrl | String | URL ảnh mẫu |
| styleData | String | Mô tả kỹ thuật cho AI |
| description | String | Mô tả hiển thị |
| createdAt | Date | Ngày tạo |

File: `backend/src/models/RegionalLibrary.js`

Lưu ý khi viết:

> `styleData` nên được lưu dạng string để backend có thể nối trực tiếp vào prompt AI. Nếu lưu object, khi đưa vào prompt có thể bị chuyển thành `[object Object]`, làm giảm chất lượng xử lý AI.

### 22.4. Collection PaintBrand

| Trường | Kiểu | Mô tả |
|---|---|---|
| brandName | String | Tên hãng sơn |
| brandLogoUrl | String | Logo hãng |
| description | String | Mô tả |
| websiteUrl | String | Website |
| isActive | Boolean | Trạng thái |
| displayOrder | Number | Thứ tự hiển thị |

File: `backend/src/models/PaintBrand.js`

### 22.5. Collection PaintColor

| Trường | Kiểu | Mô tả |
|---|---|---|
| colorName | String | Tên màu |
| colorCode | String | Mã màu hãng |
| hexCode | String | Mã HEX |
| componentType | String | wall/roof/column/all |
| imageUrl | String | Ảnh mẫu màu |
| brandId | ObjectId | Liên kết hãng sơn |
| isActive | Boolean | Trạng thái |

File: `backend/src/models/PaintColor.js`

### 22.6. Collection MixMatchProject

| Trường | Kiểu | Mô tả |
|---|---|---|
| userId | ObjectId | Người tạo |
| inputImageUrl | String | Ảnh nhà gốc |
| outputImageUrl | String | Ảnh kết quả |
| regionalStyleId | ObjectId | Mẫu vùng miền |
| wallColorId | ObjectId | Màu tường |
| roofColorId | ObjectId | Màu mái |
| columnColorId | ObjectId | Màu cột |
| customNotes | String | Ghi chú người dùng |
| promptUsed | String | Prompt đã dùng |
| status | String | Trạng thái |
| createdAt | Date | Ngày tạo |

File: `backend/src/models/MixMatchProject.js`

---

## 23. Thiết kế API

Nên đưa bảng API chính, không cần đưa tất cả chi tiết body nếu báo cáo đã dài.

### 23.1. API Auth/User

| Method | Endpoint | Mô tả |
|---|---|---|
| POST | `/api/users/register` | Đăng ký tài khoản |
| POST | `/api/users/login` | Đăng nhập |
| GET | `/api/users` | Danh sách user |

File: `backend/src/routes/users.js`

### 23.2. API Wizard Ngũ Hành

| Method | Endpoint | Mô tả |
|---|---|---|
| POST | `/api/upload-sample` | Upload và phân tích ảnh mẫu |
| POST | `/api/generate-style` | Lưu yêu cầu mệnh/phong cách |
| POST | `/api/generate-final` | Sinh ảnh ngoại thất cuối |

File: `backend/src/routes/wizard.js`

### 23.3. API Mix & Match

| Method | Endpoint | Mô tả |
|---|---|---|
| GET | `/api/mixmatch/regional-styles` | Lấy thư viện mẫu vùng miền |
| GET | `/api/mixmatch/paint-brands` | Lấy danh sách hãng sơn |
| GET | `/api/mixmatch/paint-colors` | Lấy danh sách màu sơn |
| POST | `/api/mixmatch/generate` | Sinh ảnh Mix & Match |
| GET | `/api/mixmatch/history` | Lấy lịch sử Mix & Match |

File: `backend/src/routes/mixmatch.js`

### 23.4. API Admin

| Method | Endpoint | Mô tả |
|---|---|---|
| GET | `/api/admin/stats` | Thống kê dashboard |
| GET | `/api/admin/users` | Danh sách user |
| POST | `/api/admin/users` | Thêm user |
| PUT | `/api/admin/users/:id` | Cập nhật user |
| DELETE | `/api/admin/users/:id` | Xóa user |
| GET | `/api/admin/generations` | Danh sách lịch sử sinh ảnh |
| DELETE | `/api/admin/generations/:id` | Xóa lịch sử |
| GET | `/api/admin/generations/:id/export-pdf` | Xuất PDF |
| POST | `/api/admin/library` | Thêm mẫu thư viện |
| GET | `/api/admin/library` | Danh sách thư viện |
| PUT | `/api/admin/library/:id` | Cập nhật mẫu thư viện |
| DELETE | `/api/admin/library/:id` | Xóa mẫu thư viện |

File: `backend/src/routes/admin.js`

---

## 24. Thiết kế bảo mật

Nên trình bày các lớp bảo mật:

| Biện pháp | Mô tả | File liên quan |
|---|---|---|
| bcrypt | Hash mật khẩu | `backend/src/routes/users.js` |
| JWT | Xác thực request | `backend/src/middlewares/auth.js` |
| Role admin | Kiểm tra quyền admin | `backend/src/middlewares/isAdmin.js` |
| CORS | Chỉ cho phép frontend gọi API | `backend/src/app.js` |
| Helmet | Thêm security headers | `backend/src/app.js` |
| Rate limit | Chống spam API | `backend/src/app.js` |
| Env vars | Không hard-code secret trong code | `backend/.env.example` |

Nên viết phần hạn chế trung thực:

- JWT đang lưu localStorage, dễ triển khai nhưng cần cẩn thận XSS.
- Context wizard đang lưu Map trong RAM, nếu server restart sẽ mất session.
- Khi production cần đổi admin password mặc định và tất cả API key.
- Proxy AI phù hợp demo/prototype, nếu hệ thống lớn nên cân nhắc gọi API chính thức để kiểm soát bảo mật và chi phí.

---

# CHƯƠNG 5: CÀI ĐẶT HỆ THỐNG

## 25. Mục tiêu chương 5

Chương này nên dài **10-18 trang**. Đây là nơi bạn giải thích code thật nhưng không nên dán quá nhiều code.

Cách viết tốt:

- Mỗi module nêu mục đích.
- Chỉ trích 10-30 dòng code quan trọng.
- Giải thích luồng xử lý.
- Chèn ảnh giao diện tương ứng.

---

## 26. Cài đặt backend

### 26.1. Cấu hình Express app

File: `backend/src/app.js`

Nên viết:

- Khởi tạo Express.
- Cấu hình CORS.
- Cấu hình Helmet.
- Cấu hình rate limit.
- Cấu hình parser JSON.
- Mount route `/api`, `/api/mixmatch`, `/api/admin`, `/api/users`, `/api/colors`.
- Health check `/health`.

Đoạn giải thích mẫu:

> File `app.js` đóng vai trò trung tâm trong backend, chịu trách nhiệm cấu hình middleware, đăng ký route và chuẩn hóa phản hồi. Các route admin được bảo vệ bằng middleware `auth` và `requireAdmin`, đảm bảo chỉ tài khoản admin mới có quyền truy cập.

### 26.2. Kết nối MongoDB

File:

- `backend/src/db.js`
- `backend/src/server.js`

Nên viết:

- Backend đọc `MONGODB_URI` từ biến môi trường.
- Dùng Mongoose để kết nối MongoDB.
- Server chỉ listen sau khi cấu hình xong.
- Có health check để kiểm tra database.

### 26.3. Đăng ký, đăng nhập, phân quyền

File:

- `backend/src/routes/users.js`
- `backend/src/middlewares/auth.js`
- `backend/src/middlewares/isAdmin.js`
- `backend/src/services/adminSeeder.js`

Nên mô tả:

1. Người dùng gửi email/password.
2. Backend kiểm tra email.
3. Mật khẩu được hash bằng bcrypt khi đăng ký.
4. Khi đăng nhập, backend so sánh password với hash.
5. Nếu đúng, backend tạo JWT.
6. Frontend dùng JWT để gọi API cần đăng nhập.
7. Admin route kiểm tra thêm role admin.

### 26.4. Cài đặt Cloudinary upload

File:

- `backend/src/services/cloud.js`

Nên viết:

- Ảnh không lưu trực tiếp trong MongoDB.
- Backend upload buffer lên Cloudinary.
- Cloudinary trả về `secure_url`.
- MongoDB lưu URL để frontend hiển thị.

### 26.5. Cài đặt AI service

File:

- `backend/src/services/external-ai.js`

Nên chia thành 2 phần:

#### Phân tích ảnh

- Hàm `analyzeImage` dùng Gemini để phân tích ảnh mẫu.
- Prompt yêu cầu AI trả về JSON gồm thành phần kiến trúc, vật liệu, màu sắc, style prompt.
- Kết quả dùng làm dữ liệu tham khảo khi tạo ảnh.

#### Tạo ảnh

- Hàm `generateImageFromImages` nhận ảnh nhà gốc, ảnh tham khảo, prompt và provider.
- Nếu provider là `auto`, hệ thống ưu tiên HQ API, sau đó fallback sang Gemini, Stability AI, Replicate, Hugging Face.
- Nếu người dùng chọn provider cụ thể, backend gọi provider đó.

Nên giải thích HQ API đơn giản:

> HQ API trong project là một API gateway/proxy tương thích chuẩn OpenAI, giúp backend gửi request dạng `/v1/chat/completions` tới model tạo ảnh. Cách này giúp việc tích hợp nhanh và dễ thay đổi provider, tuy nhiên khi triển khai production lớn cần cân nhắc bảo mật, chi phí và độ ổn định của proxy.

---

## 27. Cài đặt luồng Ngũ Hành

File chính:

- `backend/src/routes/wizard.js`
- `frontend/src/hooks/useWizardFlow.js`
- `frontend/src/components/ResultStep.jsx`

Nên chia thành các bước:

### Bước 1: Upload ảnh mẫu

Frontend gửi ảnh mẫu lên `/api/upload-sample`.

Backend:

- Nhận file qua multer.
- Upload ảnh lên Cloudinary.
- Tạo prompt phân tích ảnh.
- Gọi `analyzeImage`.
- Lưu context tạm bằng `tempId`.

### Bước 2: Chọn mệnh Ngũ Hành

Backend có object `NGU_HANH_COLORS`, ánh xạ mỗi mệnh thành:

- Tên mệnh.
- Danh sách màu.
- Mô tả màu tiếng Anh.
- Mô tả màu tiếng Việt.
- Gợi ý phong cách.

### Bước 3: Upload ảnh nhà thật và sinh ảnh

Backend:

- Kiểm tra user qua JWT.
- Upload ảnh nhà lên Cloudinary.
- Xây prompt cuối.
- Gọi `generateImageFromImages`.
- Upload output lên Cloudinary.
- Lưu `Generation`.

### Bước 4: Hiển thị kết quả

Frontend:

- Nhận URL ảnh kết quả.
- Hiển thị slider so sánh trước/sau.
- Cho phép tạo lại/lưu kết quả.

Ảnh nên chụp:

- Upload ảnh mẫu.
- Chọn mệnh.
- Upload ảnh nhà.
- Loading tạo ảnh.
- Kết quả slider trước/sau.

---

## 28. Cài đặt Mix & Match

File chính:

- `backend/src/routes/mixmatch.js`
- `frontend/src/components/MixMatchPage.jsx`
- `frontend/src/components/BeforeAfterSlider.jsx`

Nên mô tả:

Mix & Match cho phép người dùng kết hợp:

- Ảnh nhà thật.
- Mẫu kiến trúc vùng miền.
- Màu tường.
- Màu mái.
- Màu cột.
- Ghi chú tùy chỉnh.

Backend lấy dữ liệu từ:

- `RegionalLibrary`
- `PaintBrand`
- `PaintColor`

Sau đó tạo prompt có thông tin:

- Style Guide từ thư viện mẫu.
- Tên màu và mã HEX.
- Thành phần cần áp màu: wall, roof, column.
- Yêu cầu giữ nguyên cấu trúc nhà.

Nên nhấn mạnh:

> Mix & Match giúp hệ thống thực tế hơn vì người dùng không chỉ chọn màu chung chung, mà có thể chọn màu theo mã HEX và hãng sơn cụ thể.

---

## 29. Cài đặt frontend

### 29.1. App shell và điều hướng

File: `frontend/src/App.jsx`

Nên viết:

- App quản lý trạng thái user.
- Dựa vào role để hiển thị admin/user view.
- Điều hướng giữa landing, wizard, mixmatch, history, admin.
- Lưu user vào localStorage.

### 29.2. Wizard flow

File:

- `frontend/src/hooks/useWizardFlow.js`
- `frontend/src/api/wizard.js`

Nên viết:

- Custom hook giúp tách logic xử lý wizard khỏi component.
- Hook quản lý step, dữ liệu ảnh, loading, message.
- API wrapper giúp frontend gọi backend gọn hơn.

### 29.3. ResultStep và slider so sánh

File:

- `frontend/src/components/ResultStep.jsx`

Nên viết:

- Component có 3 trạng thái:
  1. Chưa có ảnh nhà.
  2. Có ảnh nhà nhưng chưa có kết quả.
  3. Có kết quả và hiển thị comparison slider.
- Slider giúp người dùng so sánh ảnh nhà thô và ảnh đã AI tạo.

### 29.4. Admin UI

File:

- `frontend/src/components/AdminLayout.jsx`
- `frontend/src/components/AdminDashboardPage.jsx`
- `frontend/src/components/AdminUserManagement.jsx`
- `frontend/src/components/AdminLibraryManager.jsx`

Nên viết:

- AdminLayout làm khung điều hướng admin.
- Dashboard hiển thị thống kê.
- User management quản lý tài khoản.
- Library manager quản lý ảnh mẫu và styleData.

---

## 30. Cài đặt deploy

Nên trình bày:

### Frontend Vercel

- Build command: `npm run build`
- Output: Vite build.
- Env cần có:

```text
VITE_API_URL=https://your-backend.onrender.com
```

### Backend Render

- Start command: `npm start`
- Env cần có:

```text
PORT=8000
MONGODB_URI=...
JWT_SECRET=...
CLOUDINARY_URL=...
ALLOWED_ORIGINS=https://your-frontend.vercel.app
GOOGLE_API_KEY=...
GOOGLE_API_KEY1=...
HQ_IMAGE_API_BASE_URL=...
HQ_IMAGE_API_KEY=...
STABILITY_AI_API_KEY=...
```

Không đưa key thật vào báo cáo. Chỉ đưa tên biến.

---

# CHƯƠNG 6: KIỂM THỬ, ĐÁNH GIÁ VÀ TRIỂN KHAI

## 31. Mục tiêu chương 6

Chương này nên dài **6-10 trang**. Nên có test case, ảnh kết quả và đánh giá ưu/nhược điểm.

---

## 32. Bảng test case đề xuất

### 32.1. Test đăng ký/đăng nhập

| Mã test | Chức năng | Dữ liệu | Kết quả mong đợi |
|---|---|---|---|
| TC01 | Đăng ký hợp lệ | Email mới, password >= 6 ký tự | Tạo tài khoản thành công |
| TC02 | Đăng ký email trùng | Email đã tồn tại | Báo lỗi email đã tồn tại |
| TC03 | Đăng nhập đúng | Email/password đúng | Trả JWT và vào hệ thống |
| TC04 | Đăng nhập sai | Password sai | Báo lỗi đăng nhập |
| TC05 | Truy cập admin bằng user | User thường | Bị từ chối quyền |

### 32.2. Test tạo ảnh Ngũ Hành

| Mã test | Chức năng | Kết quả mong đợi |
|---|---|---|
| TC06 | Upload ảnh mẫu | Cloudinary lưu ảnh, backend trả tempId |
| TC07 | Chọn mệnh Kim | Backend lưu palette Kim |
| TC08 | Upload ảnh nhà và tạo ảnh | Trả ảnh kết quả |
| TC09 | Tạo ảnh khi chưa đăng nhập | API từ chối |
| TC10 | Provider lỗi | Hệ thống fallback hoặc trả thông báo lỗi rõ ràng |

### 32.3. Test Mix & Match

| Mã test | Chức năng | Kết quả mong đợi |
|---|---|---|
| TC11 | Lấy thư viện mẫu | Trả danh sách mẫu |
| TC12 | Lấy màu sơn | Trả danh sách màu |
| TC13 | Chọn style + màu + tạo ảnh | Trả ảnh kết quả |
| TC14 | Thiếu ảnh nhà | Báo lỗi |
| TC15 | Lưu MixMatchProject | MongoDB có record mới |

### 32.4. Test admin

| Mã test | Chức năng | Kết quả mong đợi |
|---|---|---|
| TC16 | Admin xem dashboard | Hiển thị thống kê |
| TC17 | Admin thêm user | User mới được tạo |
| TC18 | Admin đổi role | Role cập nhật |
| TC19 | Admin thêm mẫu thư viện | Mẫu mới hiển thị |
| TC20 | Admin xóa mẫu | Mẫu bị xóa khỏi danh sách |

---

## 33. Hình ảnh nên đưa vào chương kiểm thử

Nên chụp tối thiểu:

1. Giao diện landing page.
2. Form đăng ký.
3. Form đăng nhập.
4. Trang chọn chức năng.
5. Upload ảnh mẫu.
6. Chọn mệnh Ngũ Hành.
7. Upload ảnh nhà.
8. Loading AI.
9. Kết quả trước/sau.
10. Trang Mix & Match.
11. Modal chọn mẫu vùng miền.
12. Chọn màu tường/mái/cột.
13. Kết quả Mix & Match.
14. Admin dashboard.
15. Quản lý user.
16. Quản lý thư viện mẫu.
17. Network/API trả kết quả thành công.
18. MongoDB lưu record.
19. Cloudinary lưu ảnh.
20. Trang web đã deploy trên Vercel.

Chèn hình là cách hợp lý để báo cáo đạt 40-80 trang mà không bị loãng.

---

## 34. Đánh giá kết quả đạt được

Nên viết theo ý:

Hệ thống đã đạt được các kết quả:

- Xây dựng được website hoàn chỉnh với frontend và backend tách biệt.
- Người dùng có thể đăng ký, đăng nhập và sử dụng chức năng tạo ảnh.
- Hệ thống tích hợp AI để phân tích ảnh mẫu và sinh ảnh ngoại thất.
- Chức năng Ngũ Hành giúp cá nhân hóa màu sắc theo phong thủy.
- Chức năng Mix & Match giúp kết hợp mẫu vùng miền và mã màu sơn.
- Ảnh được lưu trữ trên Cloudinary, giúp giảm tải database.
- MongoDB lưu được user, lịch sử, thư viện mẫu và project.
- Admin có thể quản lý dữ liệu hệ thống.
- Hệ thống có thể deploy lên Render/Vercel.

---

## 35. Hạn chế của hệ thống

Nên viết trung thực, nhưng theo hướng có phương án cải thiện:

| Hạn chế | Mô tả | Hướng khắc phục |
|---|---|---|
| Phụ thuộc AI provider | Nếu provider lỗi hoặc hết quota, tạo ảnh thất bại | Tăng fallback, giám sát quota |
| Tốc độ tạo ảnh lâu | AI image-to-image có thể mất 30-180 giây | Queue job, thông báo tiến trình |
| Kết quả AI chưa luôn chính xác | AI có thể thay đổi chi tiết kiến trúc | Prompt chặt hơn, dùng masking/segmentation |
| Session wizard lưu RAM | Server restart mất tempId | Lưu session vào MongoDB/Redis |
| JWT localStorage | Dễ triển khai nhưng cần chống XSS | Chuyển sang httpOnly cookie nếu production lớn |
| Proxy AI | Tiện demo nhưng phụ thuộc bên thứ ba | Gọi API chính thức hoặc tự host provider |
| Chưa có kiểm thử tự động đầy đủ | Chủ yếu test thủ công | Bổ sung unit/integration/e2e test |

---

## 36. Hướng phát triển

Nên liệt kê:

- Thêm phân vùng ảnh tự động để tô màu chính xác từng vùng tường/mái/cột.
- Thêm tính năng chỉnh sửa thủ công trên ảnh sau khi AI tạo.
- Tích hợp báo giá sơn theo diện tích.
- Thêm nhiều thư viện mẫu kiến trúc Việt Nam.
- Thêm so sánh nhiều phương án thiết kế cùng lúc.
- Tối ưu prompt và provider để giảm thời gian tạo ảnh.
- Thêm queue background job cho tác vụ AI lâu.
- Thêm notification khi ảnh tạo xong.
- Thêm thanh toán nếu triển khai thương mại.
- Chuyển lưu session tạm từ RAM sang Redis/MongoDB.
- Bổ sung test tự động và CI/CD.

---

# KẾT LUẬN

## 37. Cách viết kết luận

Phần kết luận nên dài **3-5 trang**.

Cấu trúc:

1. Nhắc lại mục tiêu đề tài.
2. Tổng kết hệ thống đã xây dựng.
3. Nêu kết quả đạt được.
4. Nêu hạn chế.
5. Nêu hướng phát triển.

Đoạn mẫu:

> Sau quá trình nghiên cứu và xây dựng, đề tài đã hoàn thành hệ thống web hỗ trợ gợi ý thiết kế ngoại thất căn nhà bằng AI. Hệ thống cho phép người dùng upload ảnh nhà, lựa chọn phong cách hoặc màu sắc theo Ngũ Hành, sau đó tạo ảnh kết quả trực quan bằng công nghệ image-to-image. Ngoài ra, hệ thống còn hỗ trợ Mix & Match với thư viện mẫu vùng miền và bảng màu sơn, giúp người dùng có thêm lựa chọn thực tế trong quá trình tham khảo thiết kế.

> Về mặt kỹ thuật, hệ thống được xây dựng theo mô hình client-server với frontend React, backend Express, MongoDB, Cloudinary và các dịch vụ AI bên ngoài. Hệ thống có đăng nhập, phân quyền, quản lý dữ liệu và dashboard admin. Kết quả cho thấy mô hình này phù hợp với bài toán hỗ trợ hình dung ngoại thất trước khi thi công.

---

# PHỤ LỤC NÊN CÓ

## 38. Phụ lục A - Danh sách file code quan trọng

### Backend

| File | Vai trò |
|---|---|
| `backend/src/app.js` | Cấu hình Express, middleware, route |
| `backend/src/server.js` | Khởi động server, connect DB |
| `backend/src/db.js` | Kết nối MongoDB |
| `backend/src/routes/users.js` | Đăng ký, đăng nhập |
| `backend/src/routes/wizard.js` | Luồng tạo ảnh Ngũ Hành |
| `backend/src/routes/mixmatch.js` | Luồng Mix & Match |
| `backend/src/routes/admin.js` | API quản trị |
| `backend/src/services/external-ai.js` | Tích hợp AI provider |
| `backend/src/services/cloud.js` | Upload Cloudinary |
| `backend/src/middlewares/auth.js` | Xác thực JWT |
| `backend/src/middlewares/isAdmin.js` | Kiểm tra quyền admin |

### Frontend

| File | Vai trò |
|---|---|
| `frontend/src/App.jsx` | App chính, điều hướng, auth state |
| `frontend/src/api/auth.js` | API đăng nhập/đăng ký |
| `frontend/src/api/wizard.js` | API wizard |
| `frontend/src/api/mixmatch.js` | API Mix & Match |
| `frontend/src/api/admin.js` | API admin |
| `frontend/src/hooks/useWizardFlow.js` | Logic wizard |
| `frontend/src/components/UploadSampleStep.jsx` | Upload ảnh mẫu |
| `frontend/src/components/SelectRequirementsStep.jsx` | Chọn yêu cầu/mệnh |
| `frontend/src/components/ResultStep.jsx` | Hiển thị kết quả |
| `frontend/src/components/MixMatchPage.jsx` | Trang Mix & Match |
| `frontend/src/components/AdminLayout.jsx` | Layout admin |
| `frontend/src/components/AdminUserManagement.jsx` | Quản lý user |
| `frontend/src/components/AdminLibraryManager.jsx` | Quản lý thư viện mẫu |

---

## 39. Phụ lục B - Prompt AI mẫu

### Prompt phân tích ảnh mẫu

Dùng trong `backend/src/routes/wizard.js`:

```text
Bạn là chuyên gia kiến trúc và kỹ sư prompt. Hãy phân tích ảnh mẫu này và trả về JSON.
Nhiệm vụ:
- Phân tích chi tiết: Tường, Mái, Cột, Cửa, Vật liệu, Màu sắc.
- Tạo Visual Style Prompt bằng tiếng Anh.
- Đoạn prompt dùng để áp lên một ngôi nhà khác mà không làm thay đổi cấu trúc nhà đó.
```

### Prompt tạo ảnh cuối

Nội dung chính:

```text
Use the uploaded house image as the required source.
Preserve the same architecture, camera angle, floor count, windows, doors, roof shape, and proportions.
Only repaint/refinish exterior surfaces and remove construction clutter if present.
Apply Feng Shui paint colors based on selected element.
Return exactly one final generated image.
```

Ý nghĩa:

- Bắt AI giữ nguyên kiến trúc.
- Chỉ thay đổi màu/vật liệu.
- Áp dụng màu theo Ngũ Hành.
- Tránh AI tạo nhà hoàn toàn mới.

---

## 40. Phụ lục C - Biến môi trường

Không đưa giá trị thật vào báo cáo. Chỉ đưa tên biến và vai trò.

### Backend

| Biến | Vai trò |
|---|---|
| `PORT` | Port backend |
| `MONGODB_URI` | Kết nối MongoDB |
| `JWT_SECRET` | Khóa ký JWT |
| `CLOUDINARY_URL` | Kết nối Cloudinary |
| `ALLOWED_ORIGINS` | Danh sách frontend được phép gọi API |
| `GOOGLE_API_KEY` | Gemini image analysis |
| `GOOGLE_API_KEY1` | Gemini image generation |
| `HQ_IMAGE_API_BASE_URL` | URL proxy/HQ API |
| `HQ_IMAGE_API_MODEL` | Model tạo ảnh |
| `HQ_IMAGE_API_KEY` | Key HQ API |
| `STABILITY_AI_API_KEY` | Key Stability AI |
| `REPLICATE_API_TOKEN` | Key Replicate |
| `HUGGINGFACE_API_KEY` | Key Hugging Face |

### Frontend

| Biến | Vai trò |
|---|---|
| `VITE_API_URL` | URL backend trên Render |

---

## 41. Phụ lục D - Danh sách hình nên chụp

Để báo cáo đủ trang và dễ hiểu, nên chụp các hình sau:

| STT | Hình | Đưa vào chương |
|---:|---|---|
| 1 | Landing page | Chương 1 |
| 2 | Đăng ký | Chương 5/6 |
| 3 | Đăng nhập | Chương 5/6 |
| 4 | Trang chọn chức năng | Chương 1/5 |
| 5 | Upload ảnh mẫu | Chương 5 |
| 6 | Kết quả phân tích ảnh mẫu nếu có | Chương 5 |
| 7 | Chọn mệnh Ngũ Hành | Chương 5 |
| 8 | Upload ảnh nhà thật | Chương 5 |
| 9 | Loading AI | Chương 5 |
| 10 | Kết quả trước/sau | Chương 5/6 |
| 11 | Mix & Match page | Chương 5 |
| 12 | Chọn mẫu vùng miền | Chương 5 |
| 13 | Chọn màu sơn | Chương 5 |
| 14 | Kết quả Mix & Match | Chương 6 |
| 15 | Admin dashboard | Chương 5 |
| 16 | Quản lý user | Chương 5 |
| 17 | Quản lý thư viện mẫu | Chương 5 |
| 18 | MongoDB collection | Chương 4/6 |
| 19 | Cloudinary folder | Chương 4/6 |
| 20 | Vercel deployment | Chương 6 |
| 21 | Render deployment | Chương 6 |

---

## 42. Phụ lục E - Sơ đồ nên vẽ

Nên có ít nhất các sơ đồ sau:

1. Sơ đồ use case User.
2. Sơ đồ use case Admin.
3. Sơ đồ kiến trúc tổng thể.
4. Sơ đồ sequence đăng nhập.
5. Sơ đồ sequence tạo ảnh Ngũ Hành.
6. Sơ đồ sequence Mix & Match.
7. Sơ đồ database/document relationship.
8. Sơ đồ flow AI provider fallback.

### Sơ đồ fallback AI provider

```text
Request tạo ảnh
    |
    v
Provider = auto?
    |
    v
Thử HQ API
    |
    | lỗi
    v
Thử Gemini
    |
    | lỗi
    v
Thử Stability AI
    |
    | lỗi
    v
Thử Replicate/Hugging Face
    |
    v
Trả ảnh hoặc báo lỗi
```

---

## 43. Những điểm nên nhấn mạnh khi bảo vệ

### 43.1. Điểm mạnh kỹ thuật

- Project có frontend/backend tách biệt.
- Có đăng nhập và phân quyền.
- Có AI image-to-image thực tế.
- Có Cloudinary lưu ảnh.
- Có MongoDB lưu lịch sử và thư viện.
- Có admin dashboard.
- Có Mix & Match với thư viện mẫu và mã màu sơn.
- Có multi-provider AI fallback.
- Có bảo mật cơ bản: JWT, bcrypt, helmet, CORS, rate limit.

### 43.2. Câu trả lời khi hỏi AI dùng gì

Có thể trả lời:

> Hệ thống sử dụng Google Gemini để phân tích ảnh mẫu và hỗ trợ tạo ảnh. Ngoài ra backend thiết kế theo hướng multi-provider, có thể gọi HQ API, Stability AI, Replicate hoặc Hugging Face. Tác vụ tạo ảnh dùng kỹ thuật image-to-image để giữ cấu trúc nhà gốc và chỉ thay đổi màu sắc/vật liệu ngoại thất.

### 43.3. Câu trả lời khi hỏi HQ API/proxy là gì

Có thể trả lời:

> HQ API là một API gateway/proxy tương thích chuẩn OpenAI. Backend gửi request tới proxy theo endpoint `/v1/chat/completions`, proxy chuyển tiếp tới model tạo ảnh phía sau. Cách này giúp tích hợp nhanh và dễ thay đổi provider, nhưng nếu triển khai hệ thống lớn thì nên cân nhắc gọi API chính thức hoặc tự quản lý provider để kiểm soát bảo mật, chi phí và độ ổn định.

### 43.4. Câu trả lời khi hỏi vì sao dùng Cloudinary

Có thể trả lời:

> Ảnh upload và ảnh AI có dung lượng lớn, nếu lưu trực tiếp vào database sẽ làm database nặng và khó mở rộng. Vì vậy hệ thống upload ảnh lên Cloudinary, sau đó chỉ lưu URL ảnh vào MongoDB.

### 43.5. Câu trả lời khi hỏi vì sao dùng MongoDB

Có thể trả lời:

> Dữ liệu của hệ thống có nhiều dạng linh hoạt như thông tin user, lịch sử tạo ảnh, prompt, cấu hình màu và thư viện mẫu. MongoDB phù hợp vì lưu document JSON linh hoạt, dễ mở rộng và tích hợp tốt với Node.js qua Mongoose.

---

## 44. Lưu ý quan trọng khi viết báo cáo chính thức

### 44.1. Không đưa thông tin nhạy cảm

Không đưa vào báo cáo:

- API key thật.
- JWT secret thật.
- MongoDB URI thật.
- Cloudinary secret thật.
- Password admin thật.

Chỉ đưa tên biến môi trường.

### 44.2. Không dán quá nhiều code

Mỗi phần chỉ nên trích code ngắn, khoảng 10-30 dòng. Phần còn lại giải thích bằng lời và sơ đồ.

### 44.3. Cập nhật lại tài liệu cũ

Nếu có tài liệu cũ ghi SQL Server, khi làm báo cáo chính thức nên sửa thành MongoDB vì code hiện tại đang dùng Mongoose/MongoDB.

### 44.4. Trung thực về hạn chế

Hội đồng thường đánh giá cao nếu bạn biết hạn chế và hướng khắc phục. Không nên nói hệ thống hoàn hảo.

### 44.5. Chuẩn bị demo

Trước khi bảo vệ cần chuẩn bị:

- Tài khoản user.
- Tài khoản admin.
- Ảnh nhà thô mẫu.
- Ảnh mẫu phong cách.
- Ít nhất 2 kết quả AI đã tạo sẵn.
- Trang Vercel frontend hoạt động.
- Backend Render hoạt động.
- Env `VITE_API_URL` và `ALLOWED_ORIGINS` cấu hình đúng.

---

## 45. Checklist hoàn thành báo cáo

| Việc cần làm | Trạng thái |
|---|---|
| Viết mở đầu | Chưa làm |
| Viết chương 1 tổng quan | Chưa làm |
| Viết chương 2 cơ sở lý thuyết | Chưa làm |
| Viết chương 3 phân tích yêu cầu | Chưa làm |
| Vẽ use case user/admin | Chưa làm |
| Viết chương 4 thiết kế hệ thống | Chưa làm |
| Vẽ kiến trúc tổng thể | Chưa làm |
| Vẽ database/schema | Chưa làm |
| Viết chương 5 cài đặt | Chưa làm |
| Chụp ảnh giao diện | Chưa làm |
| Viết chương 6 kiểm thử | Chưa làm |
| Tạo bảng test case | Chưa làm |
| Viết kết luận | Chưa làm |
| Thêm phụ lục API/prompt/env | Chưa làm |
| Kiểm tra không lộ secret | Chưa làm |
| Xuất Word/PDF | Chưa làm |

---

## 46. Gợi ý phân bổ trang chi tiết

Nếu muốn báo cáo khoảng **60 trang**, có thể chia như sau:

| Phần | Số trang |
|---|---:|
| Mở đầu | 4 |
| Chương 1 | 6 |
| Chương 2 | 10 |
| Chương 3 | 10 |
| Chương 4 | 14 |
| Chương 5 | 12 |
| Chương 6 | 7 |
| Kết luận | 3 |
| Phụ lục | 5 |
| **Tổng** | **71** |

Nếu muốn gọn hơn khoảng **50 trang**:

| Phần | Số trang |
|---|---:|
| Mở đầu | 3 |
| Chương 1 | 5 |
| Chương 2 | 8 |
| Chương 3 | 8 |
| Chương 4 | 10 |
| Chương 5 | 9 |
| Chương 6 | 5 |
| Kết luận | 2 |
| Phụ lục | 3 |
| **Tổng** | **53** |

---

## 47. Thứ tự làm báo cáo khuyến nghị

Không nên viết từ đầu đến cuối ngay. Nên làm theo thứ tự:

1. Chụp toàn bộ ảnh giao diện trước.
2. Vẽ sơ đồ kiến trúc tổng thể.
3. Vẽ use case user/admin.
4. Vẽ luồng tạo ảnh Ngũ Hành.
5. Vẽ luồng Mix & Match.
6. Viết chương 4 thiết kế hệ thống.
7. Viết chương 5 cài đặt hệ thống.
8. Viết chương 3 phân tích yêu cầu.
9. Viết chương 2 lý thuyết.
10. Viết chương 1 tổng quan.
11. Viết mở đầu và kết luận cuối cùng.
12. Kiểm tra format, mục lục, danh mục hình, danh mục bảng.

Lý do: chương 4 và 5 bám sát code nhất, viết trước sẽ giúp các chương khác chính xác hơn.

---

## 48. Kết luận của file hướng dẫn

Báo cáo nên tập trung vào thông điệp chính:

> Đây là một hệ thống web ứng dụng AI đa phương thức để hỗ trợ người dùng tạo phương án thiết kế ngoại thất từ ảnh nhà thật, kết hợp yếu tố phong thủy Ngũ Hành, thư viện kiến trúc vùng miền và màu sơn thực tế. Hệ thống có đầy đủ frontend, backend, database, cloud storage, AI integration và admin management, đủ điều kiện trình bày như một đồ án tốt nghiệp hoàn chỉnh.

Nếu làm theo cấu trúc trong file này, bạn có thể triển khai báo cáo Word khoảng **50-70 trang** một cách tự nhiên, không cần nhồi code quá nhiều và vẫn bám sát project thực tế.

---

# MẪU CÁC TRANG ĐẦU BÁO CÁO

Phần này dùng để bổ sung các trang thường xuất hiện ở đầu báo cáo đồ án tốt nghiệp như **Nhiệm vụ đề tài**, **Cán bộ hướng dẫn** và **Lời cảm ơn**. Khi đưa sang Word, bạn nên chỉnh lại căn lề, font chữ, khoảng cách dòng và phần ký tên theo mẫu của trường.

---

## 49. Mẫu trang Nhiệm vụ đề tài

Bạn có thể dùng nội dung dưới đây để thay cho trang **NHIỆM VỤ ĐỀ TÀI** trong mẫu báo cáo.

```text
NHIỆM VỤ ĐỀ TÀI

Nội dung và các yêu cầu cần giải quyết trong nhiệm vụ đề tài tốt nghiệp:

- Tìm hiểu nhu cầu hỗ trợ người dùng trong việc hình dung, lựa chọn màu sắc và phong cách thiết kế ngoại thất nhà ở.

- Tìm hiểu cách hoạt động của các hệ thống web ứng dụng trí tuệ nhân tạo trong xử lý ảnh và tạo ảnh.

- Tích hợp AI đa phương thức để phân tích ảnh mẫu kiến trúc, nhận diện màu sắc, vật liệu, phong cách và tạo prompt hỗ trợ sinh ảnh.

- Xây dựng hệ thống web hỗ trợ người dùng upload ảnh mặt tiền nhà, lựa chọn phong cách/màu sắc theo Ngũ Hành và tạo ảnh gợi ý thiết kế ngoại thất bằng AI.

- Xây dựng chức năng Mix & Match cho phép người dùng kết hợp ảnh nhà thật với thư viện mẫu vùng miền và bảng màu sơn thực tế.

- Xây dựng chức năng quản lý người dùng, phân quyền user/admin, quản lý thư viện mẫu nhà, lịch sử sinh ảnh và dữ liệu phục vụ thiết kế.

- Tích hợp lưu trữ ảnh trên Cloudinary và lưu trữ dữ liệu hệ thống bằng MongoDB.

- Triển khai hệ thống lên môi trường hosting để người dùng có thể truy cập và sử dụng thử nghiệm.

Các tài liệu, số liệu, thiết bị cần thiết:

- Tài liệu về ReactJS, Vite, Node.js, Express.js và RESTful API.

- Tài liệu về MongoDB, Mongoose, JWT, bcrypt và xác thực người dùng.

- Tài liệu về Google Gemini API, Stability AI, các mô hình tạo ảnh và kỹ thuật image-to-image.

- Tài liệu về Cloudinary phục vụ lưu trữ và quản lý ảnh.

- Tài liệu về phối màu ngoại thất, phong thủy Ngũ Hành và kiến trúc nhà ở Việt Nam.

- Các nguồn tham khảo trên Internet:
  + Stack Overflow
  + GitHub
  + YouTube
  + Tài liệu chính thức của các thư viện/framework sử dụng
  + Các bài viết, tài liệu tham khảo về trí tuệ nhân tạo và thiết kế ngoại thất

- Thiết bị:
  + Máy tính chạy hệ điều hành Windows.
  + Trình duyệt web để kiểm thử hệ thống.
  + Công cụ lập trình Visual Studio Code.
  + Tài khoản MongoDB Atlas.
  + Tài khoản Cloudinary.
  + Tài khoản hosting như Vercel và Render.
  + API key của các dịch vụ AI dùng trong quá trình phát triển.
```

Nếu muốn bản ngắn gọn hơn, có thể dùng bản sau:

```text
NHIỆM VỤ ĐỀ TÀI

Nội dung và các yêu cầu cần giải quyết trong nhiệm vụ đề tài tốt nghiệp:

- Tìm hiểu nhu cầu hỗ trợ thiết kế, phối màu và hình dung ngoại thất nhà ở.
- Tìm hiểu cách hoạt động của hệ thống web ứng dụng trí tuệ nhân tạo trong xử lý và tạo ảnh.
- Tích hợp AI đa phương thức để phân tích ảnh mẫu và sinh ảnh gợi ý ngoại thất từ ảnh nhà thật.
- Xây dựng hệ thống web hỗ trợ người dùng upload ảnh nhà, chọn phong cách/màu sắc theo Ngũ Hành và tạo ảnh thiết kế ngoại thất.
- Xây dựng chức năng Mix & Match kết hợp ảnh nhà thật, thư viện mẫu vùng miền và bảng màu sơn.
- Xây dựng chức năng quản lý người dùng, phân quyền, quản lý thư viện mẫu và lịch sử sinh ảnh.
- Lưu trữ ảnh trên Cloudinary, lưu dữ liệu bằng MongoDB và triển khai hệ thống lên hosting.

Các tài liệu, số liệu, thiết bị cần thiết:

- Tài liệu về ReactJS, Vite, Node.js, Express.js và RESTful API.
- Tài liệu về MongoDB, Mongoose, JWT, bcrypt.
- Tài liệu về Google Gemini API, Stability AI và kỹ thuật image-to-image.
- Tài liệu về Cloudinary.
- Các nguồn tham khảo trên Internet:
  + Stack Overflow
  + GitHub
  + YouTube
  + Tài liệu chính thức của các thư viện/framework sử dụng
- Thiết bị:
  + Máy tính chạy hệ điều hành Windows.
  + Trình duyệt web để kiểm thử hệ thống.
  + Công cụ lập trình Visual Studio Code.
  + Tài khoản MongoDB Atlas, Cloudinary, Vercel, Render.
```

---

## 50. Mẫu trang Cán bộ hướng dẫn đề tài tốt nghiệp

Trang này nên thay thông tin trong ngoặc vuông bằng thông tin thật của trường và giảng viên hướng dẫn.

```text
CÁN BỘ HƯỚNG DẪN ĐỀ TÀI TỐT NGHIỆP

Họ và tên: [Tên giảng viên hướng dẫn]
Học hàm, học vị: [Ví dụ: Thạc sĩ / Tiến sĩ]
Cơ quan công tác: [Tên trường của bạn]

Nội dung hướng dẫn:

- Xây dựng hệ thống web gợi ý thiết kế ngoại thất nhà ở bằng trí tuệ nhân tạo.

- Tích hợp AI đa phương thức để phân tích ảnh mẫu, xử lý ảnh đầu vào và sinh ảnh gợi ý ngoại thất.

- Xây dựng chức năng phối màu ngoại thất theo phong thủy Ngũ Hành và thư viện mẫu kiến trúc vùng miền.

- Xây dựng hệ thống quản lý người dùng, lịch sử sinh ảnh, thư viện mẫu và dữ liệu màu sơn.

- Triển khai, kiểm thử và đánh giá hệ thống trên môi trường thực tế.

Đề tài tốt nghiệp được giao ngày: [ngày/tháng/năm]
Yêu cầu phải hoàn thành xong trước ngày: [ngày/tháng/năm]

Đã nhận nhiệm vụ ĐTTN                         Đã giao nhiệm vụ ĐTTN
Sinh viên                                     Giảng viên hướng dẫn
Ký tên                                        Ký tên

[Họ tên sinh viên]                            [Họ tên giảng viên hướng dẫn]
```

Gợi ý nếu cần viết phần **Nội dung hướng dẫn** ngắn hơn:

```text
Nội dung hướng dẫn:

- Xây dựng hệ thống gợi ý thiết kế ngoại thất nhà ở bằng AI.
- Tích hợp AI tạo ảnh từ ảnh đầu vào và prompt mô tả phong cách.
- Quản lý tiến độ dự án, hoàn thiện chức năng frontend, backend và database.
- Kiểm thử, triển khai và hoàn thiện báo cáo đồ án tốt nghiệp.
```

---

## 51. Mẫu lời cảm ơn

Bạn có thể dùng mẫu dưới đây cho trang **LỜI CẢM ƠN**. Khi đưa vào Word, nên căn đều hai bên, tiêu đề căn giữa, phần ngày tháng và ký tên căn phải giống mẫu của trường.

```text
LỜI CẢM ƠN

Lời đầu tiên, em xin gửi lời cảm ơn chân thành đến quý thầy cô trong Khoa Công nghệ thông tin – [Tên trường của bạn] đã tận tình giảng dạy, truyền đạt cho em những kiến thức nền tảng và chuyên môn quý báu trong suốt quá trình học tập tại trường. Những kiến thức và kinh nghiệm mà thầy cô truyền đạt là hành trang quan trọng giúp em có thể thực hiện và hoàn thành đề tài tốt nghiệp này.

Em xin gửi lời cảm ơn sâu sắc đến thầy/cô [Tên giảng viên hướng dẫn], người đã trực tiếp hướng dẫn, định hướng và hỗ trợ em trong suốt quá trình thực hiện đề tài. Nhờ sự quan tâm, góp ý và chỉ bảo tận tình của thầy/cô, em đã có thêm nhiều kiến thức, kinh nghiệm cũng như phương pháp làm việc khoa học để hoàn thiện hệ thống và báo cáo đồ án tốt nghiệp.

Em cũng xin chân thành cảm ơn Ban Giám hiệu nhà trường, quý thầy cô trong khoa và các bộ phận liên quan đã tạo điều kiện thuận lợi cho em trong quá trình học tập, nghiên cứu và hoàn thành đồ án. Đồng thời, em xin cảm ơn gia đình, người thân và bạn bè đã luôn động viên, hỗ trợ và tạo động lực để em cố gắng trong suốt thời gian thực hiện đề tài.

Trong quá trình thực hiện đề tài “Xây dựng hệ thống gợi ý thiết kế ngoại thất căn nhà bằng trí tuệ nhân tạo”, mặc dù em đã cố gắng tìm hiểu, nghiên cứu và hoàn thiện hệ thống, tuy nhiên do kiến thức và kinh nghiệm thực tế còn hạn chế nên đồ án khó tránh khỏi những thiếu sót. Em rất mong nhận được sự góp ý, nhận xét từ quý thầy cô để đề tài được hoàn thiện hơn, đồng thời giúp em tích lũy thêm kinh nghiệm cho công việc sau này.

Em xin chân thành cảm ơn!

Đồng Nai, ngày ..... tháng ..... năm 2026

Sinh viên thực hiện

[Họ và tên sinh viên]
```

Nếu muốn lời cảm ơn giống văn phong trang mẫu hơn, có thể dùng bản dài hơn sau:

```text
LỜI CẢM ƠN

Lời đầu tiên, em xin gửi cảm ơn các thầy cô giáo trong Khoa Công nghệ thông tin – [Tên trường của bạn] lời chào trân trọng, lời chúc sức khỏe và lời cảm ơn sâu sắc nhất. Với sự quan tâm, chỉ bảo tận tình của quý thầy cô trong suốt thời gian học tập, em đã có được cho mình một hành trang kiến thức quan trọng trong quá trình học tập và thực hiện đề tài tốt nghiệp.

Em xin chân thành gửi lời cảm ơn sâu sắc đến gia đình, người thân và bạn bè đã luôn động viên, giúp đỡ, cổ vũ và tạo cho em thêm động lực để em có thể hoàn thành đồ án.

Em xin cảm ơn Ban Giám hiệu nhà trường, các thầy cô thuộc các khoa, ban, ngành của trường đã tạo mọi điều kiện thuận lợi để em có thể thực hiện và hoàn thành đề tài tốt nghiệp.

Đặc biệt, em xin chân thành cảm ơn thầy/cô [Tên giảng viên hướng dẫn] đã dành thời gian hướng dẫn, góp ý và hỗ trợ em trong quá trình thực hiện đề tài. Những nhận xét của thầy/cô đã giúp em định hướng tốt hơn khi xây dựng hệ thống và hoàn thiện báo cáo.

Em xin cảm ơn các bạn, các anh chị đồng nghiệp đã giúp đỡ em có thêm những kiến thức nền tảng về lập trình, giúp em có thể hoàn thành tốt đề tài của mình.

Mặc dù em đã cố gắng hoàn thành đề tài, nhưng do kiến thức và kinh nghiệm còn hạn chế nên bài báo cáo khó tránh khỏi thiếu sót. Em rất mong nhận được những nhận xét và góp ý từ quý thầy cô để đề tài được hoàn thiện hơn, đồng thời giúp em có thêm kinh nghiệm cho công việc sau này.

Đồng Nai, ngày ..... tháng ..... năm 2026

Sinh viên

[Họ và tên sinh viên]
```

---

## 52. Ghi chú khi đưa các trang này vào Word

- Các trang đầu như **Nhiệm vụ đề tài**, **Cán bộ hướng dẫn**, **Lời cảm ơn** thường không đánh số chương.
- Tiêu đề nên viết hoa, in đậm và căn giữa.
- Nội dung nên dùng font Times New Roman, cỡ chữ 13 hoặc 14 tùy mẫu trường.
- Dòng giãn cách thường là 1.3 hoặc 1.5.
- Phần ký tên nên căn phải hoặc chia 2 cột theo đúng mẫu của trường.
- Các chỗ `[Tên trường của bạn]`, `[Tên giảng viên hướng dẫn]`, `[Họ và tên sinh viên]` cần thay bằng thông tin thật trước khi nộp.
