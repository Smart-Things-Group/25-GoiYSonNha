# HƯỚNG DẪN LÀM BÁO CÁO ĐỒ ÁN TỐT NGHIỆP THẬT

## Dựa theo file mẫu: `BaoCaoTotNghiep (Tú).pdf`

File này hướng dẫn bạn viết báo cáo đồ án tốt nghiệp cho project **Ngoại Thất AI** theo đúng cấu trúc của file PDF mẫu thật. Khác với file hướng dẫn thử trước đó, file này bám sát form báo cáo gồm:

1. Trang bìa
2. Mục lục
3. Danh mục hình ảnh
4. Danh mục bảng và biểu đồ
5. Nhiệm vụ đề tài
6. Cán bộ hướng dẫn
7. Lời cảm ơn
8. Phần mở đầu
9. Chương 1: Tổng quan lý thuyết
10. Chương 2: Phân tích chức năng và thiết kế hệ thống
11. Chương 3: Lựa chọn công cụ hỗ trợ phát triển ứng dụng
12. Chương 4: Xây dựng ứng dụng
13. Kết luận
14. Tài liệu tham khảo

Mục tiêu là giúp bạn viết được bản báo cáo Word khoảng **50-80 trang** một cách tự nhiên, đúng form, có đủ sơ đồ, bảng, hình ảnh và giải thích code.

---

# 1. THÔNG TIN ĐỀ TÀI NÊN DÙNG

## 1.1. Tên đề tài đề xuất

Nên dùng tên sau:

> **XÂY DỰNG HỆ THỐNG GỢI Ý THIẾT KẾ NGOẠI THẤT CĂN NHÀ BẰNG TRÍ TUỆ NHÂN TẠO**

Tên này phù hợp vì project của bạn có đầy đủ:

- Website React.
- Backend Express.
- MongoDB.
- Cloudinary.
- AI phân tích ảnh.
- AI sinh ảnh ngoại thất.
- Phong thủy Ngũ Hành.
- Thư viện mẫu vùng miền.
- Mix & Match màu sơn.
- Admin quản lý hệ thống.

Nếu muốn tên dài và chi tiết hơn:

> **XÂY DỰNG HỆ THỐNG WEB GỢI Ý PHỐI MÀU VÀ THIẾT KẾ NGOẠI THẤT CĂN NHÀ BẰNG AI DỰA TRÊN ẢNH ĐẦU VÀO, PHONG THỦY NGŨ HÀNH VÀ THƯ VIỆN MẪU KIẾN TRÚC VÙNG MIỀN**

Tuy nhiên tên này hơi dài. Khi đưa vào bìa nên dùng bản ngắn gọn.

---

# 2. TRANG BÌA

PDF mẫu có 2 trang bìa:

- Trang bìa 1: tên trường, khoa, tên báo cáo, tên đề tài, tên sinh viên, địa điểm và thời gian.
- Trang bìa 2: tương tự trang 1 nhưng có thêm sinh viên thực hiện và giảng viên hướng dẫn.

## 2.1. Trang bìa 1 mẫu

```text
TRƯỜNG ĐẠI HỌC [TÊN TRƯỜNG]
KHOA CÔNG NGHỆ THÔNG TIN

----------

BÁO CÁO
ĐỒ ÁN TỐT NGHIỆP

ĐỀ TÀI:

XÂY DỰNG HỆ THỐNG GỢI Ý THIẾT KẾ
NGOẠI THẤT CĂN NHÀ BẰNG TRÍ TUỆ NHÂN TẠO

[HỌ VÀ TÊN SINH VIÊN]

ĐỒNG NAI, THÁNG ...../2026
```

## 2.2. Trang bìa 2 mẫu

```text
TRƯỜNG ĐẠI HỌC [TÊN TRƯỜNG]
KHOA CÔNG NGHỆ THÔNG TIN

----------

BÁO CÁO
ĐỒ ÁN TỐT NGHIỆP

ĐỀ TÀI:

XÂY DỰNG HỆ THỐNG GỢI Ý THIẾT KẾ
NGOẠI THẤT CĂN NHÀ BẰNG TRÍ TUỆ NHÂN TẠO

Sinh viên thực hiện: [HỌ VÀ TÊN SINH VIÊN]
GVHD: [HỌC HÀM/HỌC VỊ + TÊN GIẢNG VIÊN HƯỚNG DẪN]

ĐỒNG NAI, THÁNG ...../2026
```

---

# 3. MỤC LỤC, DANH MỤC HÌNH ẢNH, DANH MỤC BẢNG

## 3.1. Mục lục nên có

Theo PDF mẫu, mục lục nên có cấu trúc sau:

```text
PHẦN MỞ ĐẦU
Lý do chọn đề tài
Các phần mềm trong nước
Các phần mềm ngoài nước
Mục tiêu nghiên cứu
Đối tượng và phạm vi nghiên cứu
Phương pháp nghiên cứu
Những đóng góp mới của đề tài và những vấn đề chưa thực hiện được
Kết cấu của đề tài

Chương 1 Tổng quan lý thuyết
1.1. Tổng quan về ứng dụng Website
1.2. Ứng dụng Website là gì?
1.3. Một số phần mềm, thư viện được sử dụng trong đề tài

Chương 2 Phân Tích Chức Năng Và Thiết Kế Hệ Thống
2.1. Chức năng chính
2.2. Mô tả chức năng và cách thức hoạt động
2.3. Các biểu đồ thiết kế hệ thống
2.4. Đặc tả use case
2.5. Biểu đồ hoạt động
2.6. Thiết kế cơ sở dữ liệu
2.7. Tiểu kết

Chương 3 Lựa Chọn Công Cụ Hỗ Trợ Phát Triển Ứng Dụng
3.1. ReactJS và Vite
3.2. Node.js và Express.js
3.3. MongoDB và Mongoose
3.4. Cloudinary
3.5. Google Gemini và các dịch vụ AI tạo ảnh
3.6. Vercel và Render

Chương 4 Xây dựng ứng dụng
4.1. Thiết kế wireframe cho từng đối tượng người dùng
4.2. Cài đặt dự án và các thư viện cần thiết
4.3. Xây dựng chức năng
4.4. Kết quả làm được

KẾT LUẬN
TÀI LIỆU THAM KHẢO
```

## 3.2. Danh mục hình ảnh nên chuẩn bị

Bạn nên có nhiều hình để báo cáo đủ trang. Nên đặt tên hình theo chương:

```text
Hình 0.1: Website tham khảo về thiết kế ngoại thất trong nước
Hình 0.2: Website tham khảo về AI thiết kế nhà ở nước ngoài
Hình 1.1: Logo ReactJS
Hình 1.2: Logo Node.js
Hình 1.3: Logo MongoDB
Hình 1.4: Logo Cloudinary
Hình 1.5: Logo Google Gemini
Hình 2.1: Use case tổng quát
Hình 2.2: Use case đăng nhập
Hình 2.3: Use case tạo ảnh theo Ngũ Hành
Hình 2.4: Use case Mix & Match
Hình 2.5: Use case quản lý người dùng
Hình 2.6: Use case quản lý thư viện mẫu
Hình 2.7: Sơ đồ cơ sở dữ liệu MongoDB
Hình 2.8: Biểu đồ hoạt động đăng nhập
Hình 2.9: Biểu đồ hoạt động tạo ảnh Ngũ Hành
Hình 2.10: Biểu đồ hoạt động Mix & Match
Hình 3.1: Cấu trúc thư mục frontend
Hình 3.2: Cấu trúc thư mục backend
Hình 4.1: Wireframe đăng nhập và đăng ký
Hình 4.2: Wireframe người dùng
Hình 4.3: Wireframe admin
Hình 4.4: Giao diện landing page
Hình 4.5: Giao diện đăng ký
Hình 4.6: Giao diện đăng nhập
Hình 4.7: Giao diện upload ảnh mẫu
Hình 4.8: Giao diện chọn mệnh Ngũ Hành
Hình 4.9: Giao diện upload ảnh nhà thật
Hình 4.10: Giao diện kết quả trước/sau
Hình 4.11: Giao diện Mix & Match
Hình 4.12: Giao diện chọn mẫu vùng miền
Hình 4.13: Giao diện chọn màu sơn
Hình 4.14: Giao diện admin dashboard
Hình 4.15: Giao diện quản lý người dùng
Hình 4.16: Giao diện quản lý thư viện mẫu
Hình 4.17: Dữ liệu MongoDB
Hình 4.18: Ảnh lưu trên Cloudinary
Hình 4.19: Triển khai frontend trên Vercel
Hình 4.20: Triển khai backend trên Render
```

## 3.3. Danh mục bảng và biểu đồ nên có

```text
Bảng 2.1: Danh sách actor của hệ thống
Bảng 2.2: Đặc tả use case đăng ký
Bảng 2.3: Đặc tả use case đăng nhập
Bảng 2.4: Đặc tả use case tạo ảnh theo Ngũ Hành
Bảng 2.5: Đặc tả use case Mix & Match
Bảng 2.6: Đặc tả use case quản lý người dùng
Bảng 2.7: Đặc tả use case quản lý thư viện mẫu
Bảng 2.8: Đặc tả use case xem lịch sử sinh ảnh
Bảng 2.9: Danh sách collection trong MongoDB
Bảng 3.1: So sánh các công nghệ frontend
Bảng 3.2: So sánh các cơ sở dữ liệu
Bảng 3.3: Danh sách thư viện backend
Bảng 4.1: Danh sách API chính của hệ thống
Bảng 4.2: Test case chức năng đăng nhập
Bảng 4.3: Test case chức năng tạo ảnh AI
Bảng 4.4: Test case chức năng admin
```

---

# 4. NHIỆM VỤ ĐỀ TÀI

Dùng nội dung này cho trang **NHIỆM VỤ ĐỀ TÀI**.

```text
NHIỆM VỤ ĐỀ TÀI

Nội dung và các yêu cầu cần giải quyết trong nhiệm vụ đề tài tốt nghiệp:

- Tìm hiểu nhu cầu hỗ trợ người dùng trong việc hình dung, lựa chọn màu sắc và phong cách thiết kế ngoại thất nhà ở.

- Tìm hiểu cách hoạt động của hệ thống web ứng dụng trí tuệ nhân tạo trong xử lý ảnh và tạo ảnh.

- Tích hợp AI đa phương thức để phân tích ảnh mẫu kiến trúc, nhận diện màu sắc, vật liệu, phong cách và tạo prompt hỗ trợ sinh ảnh.

- Xây dựng hệ thống web hỗ trợ người dùng upload ảnh mặt tiền nhà, lựa chọn phong cách/màu sắc theo Ngũ Hành và tạo ảnh gợi ý thiết kế ngoại thất bằng AI.

- Xây dựng chức năng Mix & Match cho phép người dùng kết hợp ảnh nhà thật với thư viện mẫu vùng miền và bảng màu sơn thực tế.

- Xây dựng chức năng quản lý người dùng, phân quyền user/admin, quản lý thư viện mẫu nhà, lịch sử sinh ảnh và dữ liệu phục vụ thiết kế.

- Tích hợp lưu trữ ảnh trên Cloudinary và lưu trữ dữ liệu hệ thống bằng MongoDB.

- Triển khai hệ thống lên môi trường hosting để người dùng có thể truy cập và sử dụng thử nghiệm.

Các tài liệu, số liệu, thiết bị cần thiết:

- Tài liệu về ReactJS, Vite, Node.js, Express.js và RESTful API.
- Tài liệu về MongoDB, Mongoose, JWT, bcrypt và xác thực người dùng.
- Tài liệu về Google Gemini API, Stability AI và kỹ thuật image-to-image.
- Tài liệu về Cloudinary phục vụ lưu trữ và quản lý ảnh.
- Tài liệu về phối màu ngoại thất, phong thủy Ngũ Hành và kiến trúc nhà ở Việt Nam.
- Các nguồn tham khảo trên Internet:
  + Stack Overflow
  + YouTube
  + GitHub
  + Tài liệu chính thức của các thư viện/framework sử dụng
- Thiết bị:
  + Máy tính chạy hệ điều hành Windows.
  + Trình duyệt web để kiểm thử hệ thống.
  + Công cụ lập trình Visual Studio Code.
  + Tài khoản MongoDB Atlas, Cloudinary, Vercel, Render.
```

---

# 5. CÁN BỘ HƯỚNG DẪN ĐỀ TÀI TỐT NGHIỆP

```text
CÁN BỘ HƯỚNG DẪN ĐỀ TÀI TỐT NGHIỆP

Họ và tên: [Tên giảng viên hướng dẫn]
Học hàm, học vị: [Thạc sĩ / Tiến sĩ]
Cơ quan công tác: [Tên trường]

Nội dung hướng dẫn:

- Xây dựng hệ thống web gợi ý thiết kế ngoại thất nhà ở bằng trí tuệ nhân tạo.
- Tích hợp AI đa phương thức để phân tích ảnh mẫu, xử lý ảnh đầu vào và sinh ảnh gợi ý ngoại thất.
- Xây dựng chức năng phối màu ngoại thất theo phong thủy Ngũ Hành và thư viện mẫu kiến trúc vùng miền.
- Xây dựng hệ thống quản lý người dùng, lịch sử sinh ảnh, thư viện mẫu và dữ liệu màu sơn.
- Quản lý tiến độ dự án, kiểm thử và hoàn thiện báo cáo đồ án tốt nghiệp.

Đề tài tốt nghiệp được giao ngày ..... tháng ..... năm 2026
Yêu cầu phải hoàn thành xong trước ngày ..... tháng ..... năm 2026

Đã nhận nhiệm vụ ĐTTN                         Đã giao nhiệm vụ ĐTTN
Sinh viên                                     Giảng viên hướng dẫn
Ký tên                                        Ký tên

[Họ tên sinh viên]                            [Họ tên giảng viên hướng dẫn]
```

---

# 6. LỜI CẢM ƠN

```text
LỜI CẢM ƠN

Lời đầu tiên, em xin gửi lời cảm ơn chân thành đến quý thầy cô trong Khoa Công nghệ thông tin – [Tên trường] đã tận tình giảng dạy, truyền đạt cho em những kiến thức nền tảng và chuyên môn quý báu trong suốt quá trình học tập tại trường. Những kiến thức và kinh nghiệm mà thầy cô truyền đạt là hành trang quan trọng giúp em có thể thực hiện và hoàn thành đề tài tốt nghiệp này.

Em xin gửi lời cảm ơn sâu sắc đến thầy/cô [Tên giảng viên hướng dẫn], người đã trực tiếp hướng dẫn, định hướng và hỗ trợ em trong suốt quá trình thực hiện đề tài. Nhờ sự quan tâm, góp ý và chỉ bảo tận tình của thầy/cô, em đã có thêm nhiều kiến thức, kinh nghiệm cũng như phương pháp làm việc khoa học để hoàn thiện hệ thống và báo cáo đồ án tốt nghiệp.

Em cũng xin chân thành cảm ơn Ban Giám hiệu nhà trường, quý thầy cô trong khoa và các bộ phận liên quan đã tạo điều kiện thuận lợi cho em trong quá trình học tập, nghiên cứu và hoàn thành đồ án. Đồng thời, em xin cảm ơn gia đình, người thân và bạn bè đã luôn động viên, hỗ trợ và tạo động lực để em cố gắng trong suốt thời gian thực hiện đề tài.

Trong quá trình thực hiện đề tài “Xây dựng hệ thống gợi ý thiết kế ngoại thất căn nhà bằng trí tuệ nhân tạo”, mặc dù em đã cố gắng tìm hiểu, nghiên cứu và hoàn thiện hệ thống, tuy nhiên do kiến thức và kinh nghiệm thực tế còn hạn chế nên đồ án khó tránh khỏi những thiếu sót. Em rất mong nhận được sự góp ý, nhận xét từ quý thầy cô để đề tài được hoàn thiện hơn, đồng thời giúp em tích lũy thêm kinh nghiệm cho công việc sau này.

Em xin chân thành cảm ơn!

Đồng Nai, ngày ..... tháng ..... năm 2026

Sinh viên

[Họ và tên sinh viên]
```

---

# 7. PHẦN MỞ ĐẦU

Phần mở đầu trong PDF mẫu gồm các mục:

1. Lý do chọn đề tài
2. Các phần mềm trong nước
3. Các phần mềm ngoài nước
4. Mục tiêu nghiên cứu
5. Đối tượng và phạm vi nghiên cứu
6. Phương pháp nghiên cứu
7. Những đóng góp mới và những vấn đề chưa thực hiện được
8. Kết cấu đề tài

Phần này nên dài khoảng **6-8 trang**.

---

## 7.1. Lý do chọn đề tài

Nên viết khoảng 1.5-2 trang.

Ý chính cần có:

- Nhu cầu cải tạo, sơn sửa và thiết kế ngoại thất nhà ở ngày càng tăng.
- Người dùng phổ thông khó hình dung căn nhà sau khi thay màu sơn, vật liệu hoặc phong cách.
- Thiết kế truyền thống cần kiến trúc sư, tốn chi phí và thời gian.
- Các công cụ thiết kế chuyên nghiệp khó dùng với người không chuyên.
- AI tạo ảnh, đặc biệt image-to-image, giúp tạo nhanh phương án minh họa từ ảnh nhà thật.
- Ở Việt Nam, phong thủy Ngũ Hành và kiến trúc vùng miền là yếu tố người dùng quan tâm.
- Vì vậy đề tài Ngoại Thất AI có tính thực tiễn.

Đoạn mẫu:

```text
Hiện nay, nhu cầu cải tạo, sơn sửa và thiết kế ngoại thất nhà ở ngày càng được nhiều người quan tâm. Khi chuẩn bị sơn lại nhà hoặc thay đổi phong cách mặt tiền, người dùng thường gặp khó khăn trong việc hình dung căn nhà sau khi hoàn thiện sẽ trông như thế nào. Việc thuê kiến trúc sư hoặc sử dụng các phần mềm thiết kế chuyên nghiệp có thể đem lại kết quả tốt nhưng thường tốn chi phí, thời gian và yêu cầu kiến thức chuyên môn nhất định.

Sự phát triển của trí tuệ nhân tạo, đặc biệt là các mô hình AI đa phương thức có khả năng xử lý hình ảnh và văn bản, đã mở ra hướng tiếp cận mới trong lĩnh vực hỗ trợ thiết kế. Thay vì phải dựng mô hình 3D hoặc chỉnh sửa thủ công, người dùng có thể upload ảnh mặt tiền căn nhà, nhập yêu cầu màu sắc hoặc phong cách, sau đó hệ thống sử dụng AI để tạo ra ảnh gợi ý ngoại thất mới.

Bên cạnh yếu tố thẩm mỹ, tại Việt Nam người dùng còn quan tâm đến phong thủy, đặc biệt là lựa chọn màu sắc theo Ngũ Hành như Kim, Mộc, Thủy, Hỏa, Thổ. Ngoài ra, đặc trưng kiến trúc theo vùng miền như Bắc, Trung, Nam cũng là yếu tố quan trọng khi lựa chọn phong cách nhà ở. Xuất phát từ nhu cầu đó, đề tài “Xây dựng hệ thống gợi ý thiết kế ngoại thất căn nhà bằng trí tuệ nhân tạo” được thực hiện nhằm hỗ trợ người dùng tạo nhanh các phương án thiết kế ngoại thất trực quan, dễ sử dụng và phù hợp với bối cảnh Việt Nam.
```

---

## 7.2. Các phần mềm trong nước

Trong PDF mẫu, phần này nêu các hệ thống tương tự trong nước. Với đề tài của bạn, nên chọn các ví dụ liên quan đến:

- Công ty thiết kế nhà.
- Website phối màu sơn.
- Website tư vấn màu sơn.
- Website/ứng dụng thiết kế nhà.

Ví dụ có thể viết theo hướng chung, không cần khẳng định quá sâu:

### 7.2.1. Các website tư vấn màu sơn tại Việt Nam

Nội dung nên viết:

- Một số hãng sơn có website giới thiệu bảng màu.
- Người dùng có thể xem màu theo mã màu, dòng sơn, không gian.
- Hạn chế: thường chỉ xem màu mẫu, chưa áp trực tiếp lên ảnh nhà thật của người dùng.

### 7.2.2. Các đơn vị thiết kế kiến trúc trong nước

Nội dung nên viết:

- Nhiều website kiến trúc cung cấp mẫu nhà, phối cảnh 3D, tư vấn thiết kế.
- Ưu điểm: kết quả chuyên nghiệp, sát thực tế.
- Hạn chế: cần liên hệ tư vấn, chi phí cao, không tạo phương án ngay lập tức.

Gợi ý hình:

- Hình 0.1: Website hãng sơn hoặc bảng màu sơn trong nước.
- Hình 0.2: Website tư vấn thiết kế nhà trong nước.

---

## 7.3. Các phần mềm ngoài nước

Có thể nêu:

- AI Home Design.
- RoomGPT.
- Remodel AI.
- Planner 5D.
- Homestyler.

Nên viết theo ý:

- Nhiều công cụ nước ngoài đã ứng dụng AI vào thiết kế nội/ngoại thất.
- Một số công cụ cho phép upload ảnh và tạo lại phong cách.
- Hạn chế với người Việt: tiếng Anh, phong cách không phù hợp nhà Việt, không có Ngũ Hành, không có màu sơn Việt Nam, có thể tính phí.

Đoạn mẫu:

```text
Ở nước ngoài, nhiều hệ thống đã ứng dụng AI vào thiết kế nhà ở, cho phép người dùng upload ảnh không gian và tạo ra các phương án thiết kế mới. Các công cụ này có ưu điểm là giao diện hiện đại, tốc độ xử lý nhanh và có nhiều phong cách thiết kế. Tuy nhiên, phần lớn các hệ thống tập trung vào phong cách kiến trúc quốc tế, chưa chú trọng tới đặc trưng nhà ở Việt Nam, yếu tố phong thủy Ngũ Hành hoặc thư viện mẫu kiến trúc vùng miền.
```

---

## 7.4. Mục tiêu nghiên cứu

Nên viết thành danh sách:

```text
Đề tài được xây dựng với mục tiêu nghiên cứu và phát triển hệ thống web gợi ý thiết kế ngoại thất căn nhà bằng trí tuệ nhân tạo. Nội dung bao gồm:

- Xây dựng hệ thống đăng ký, đăng nhập và phân quyền người dùng.
- Xây dựng giao diện web cho phép người dùng upload ảnh nhà và ảnh mẫu.
- Tích hợp AI để phân tích ảnh mẫu kiến trúc và sinh ảnh ngoại thất mới từ ảnh nhà thật.
- Xây dựng chức năng chọn màu sắc theo phong thủy Ngũ Hành.
- Xây dựng chức năng Mix & Match kết hợp ảnh nhà thật, mẫu vùng miền và màu sơn.
- Xây dựng chức năng quản trị người dùng, thư viện mẫu và lịch sử sinh ảnh.
- Lưu trữ ảnh trên Cloudinary và dữ liệu trên MongoDB.
- Triển khai thử nghiệm hệ thống trên môi trường hosting.
```

---

## 7.5. Đối tượng và phạm vi nghiên cứu

### Đối tượng nghiên cứu

```text
- Ngôn ngữ và thư viện lập trình: JavaScript, ReactJS, Node.js, Express.js.
- Cơ sở dữ liệu: MongoDB và thư viện Mongoose.
- Công cụ trí tuệ nhân tạo: Google Gemini, Stability AI và kỹ thuật image-to-image.
- Dịch vụ lưu trữ ảnh: Cloudinary.
- Các quy tắc phối màu ngoại thất, phong thủy Ngũ Hành và thư viện mẫu kiến trúc vùng miền.
```

### Phạm vi nghiên cứu

```text
- Ứng dụng hoạt động trên nền tảng trình duyệt web.
- Tập trung vào bài toán gợi ý hình ảnh ngoại thất từ ảnh mặt tiền nhà.
- Hỗ trợ người dùng tạo ảnh minh họa, không thay thế hoàn toàn bản vẽ kỹ thuật kiến trúc.
- Dữ liệu ảnh được lưu trữ trên Cloudinary, dữ liệu hệ thống lưu bằng MongoDB.
- Hệ thống được triển khai ở mức thử nghiệm/demo, chưa tối ưu đầy đủ cho quy mô thương mại lớn.
```

---

## 7.6. Phương pháp nghiên cứu

Theo mẫu PDF, phần này nên viết dạng gạch đầu dòng:

```text
- Nghiên cứu tài liệu chính thức của ReactJS, Node.js, Express.js, MongoDB và Cloudinary.
- Tìm hiểu cách hoạt động của các API AI tạo ảnh như Google Gemini, Stability AI và kỹ thuật image-to-image.
- Phân tích các website, phần mềm hỗ trợ thiết kế nhà và phối màu sơn để xác định ưu điểm, hạn chế.
- Thiết kế hệ thống web theo mô hình client-server, giao tiếp qua RESTful API.
- Xây dựng cơ sở dữ liệu MongoDB để lưu người dùng, lịch sử sinh ảnh, thư viện mẫu và màu sơn.
- Xây dựng frontend bằng ReactJS và backend bằng Express.js.
- Kiểm thử hệ thống bằng các luồng thực tế: đăng nhập, upload ảnh, tạo ảnh AI, quản trị dữ liệu.
- Triển khai thử nghiệm frontend lên Vercel và backend lên Render.
```

---

## 7.7. Những đóng góp mới và vấn đề chưa thực hiện được

### Những đóng góp mới

```text
- Xây dựng hệ thống web cho phép tạo ảnh gợi ý ngoại thất từ ảnh nhà thật.
- Tích hợp AI đa phương thức để phân tích ảnh mẫu và sinh ảnh ngoại thất bằng kỹ thuật image-to-image.
- Kết hợp yếu tố phong thủy Ngũ Hành vào việc lựa chọn màu sắc ngoại thất.
- Xây dựng chức năng Mix & Match giúp người dùng kết hợp mẫu kiến trúc vùng miền với màu sơn thực tế.
- Xây dựng trang quản trị giúp quản lý người dùng, thư viện mẫu và lịch sử sinh ảnh.
- Tích hợp Cloudinary để lưu trữ ảnh và MongoDB để quản lý dữ liệu hệ thống.
```

### Những vấn đề chưa thực hiện được

```text
- Kết quả AI đôi khi còn phụ thuộc vào chất lượng ảnh đầu vào và provider tạo ảnh.
- Hệ thống chưa có chức năng phân vùng ảnh chính xác theo từng khu vực như tường, mái, cột bằng segmentation chuyên sâu.
- Thời gian tạo ảnh có thể lâu do phụ thuộc vào dịch vụ AI bên ngoài.
- Chưa có hệ thống thanh toán hoặc giới hạn lượt dùng theo gói dịch vụ.
- Chưa có kiểm thử tự động đầy đủ cho toàn bộ frontend và backend.
```

---

## 7.8. Kết cấu đề tài

Viết theo đúng form PDF:

```text
Cấu trúc báo cáo được chia làm ba phần: phần mở đầu, phần nội dung chính và phần kết luận.

Phần mở đầu nêu lý do chọn đề tài, tổng quan tình hình phát triển, mục tiêu nghiên cứu, đối tượng, phạm vi, phương pháp nghiên cứu, những đóng góp mới và những vấn đề chưa thực hiện được.

Phần nội dung chính gồm 4 chương:

- Chương 1: Tổng quan lý thuyết. Chương này trình bày các kiến thức nền tảng về ứng dụng website, trí tuệ nhân tạo trong xử lý ảnh và các công nghệ được sử dụng trong đề tài.

- Chương 2: Phân tích chức năng và thiết kế hệ thống. Chương này phân tích các chức năng của người dùng và quản trị viên, xây dựng use case, biểu đồ hoạt động và thiết kế cơ sở dữ liệu.

- Chương 3: Lựa chọn công cụ hỗ trợ phát triển ứng dụng. Chương này trình bày các công nghệ, thư viện và dịch vụ được sử dụng như ReactJS, Node.js, Express.js, MongoDB, Cloudinary, Google Gemini và các AI provider.

- Chương 4: Xây dựng ứng dụng. Chương này trình bày quá trình cài đặt hệ thống, xây dựng các chức năng chính và kết quả giao diện thực tế.

Phần kết luận trình bày kết quả đạt được, hạn chế của đề tài và hướng phát triển trong tương lai.
```

---

# 8. CHƯƠNG 1: TỔNG QUAN LÝ THUYẾT

Chương này trong PDF mẫu khá ngắn, khoảng 3-5 trang. Với đề tài của bạn nên viết khoảng **6-8 trang** để đủ nội dung.

---

## 8.1. Ứng dụng Website là gì?

Nên viết:

- Website application là phần mềm chạy trên trình duyệt.
- Người dùng không cần cài app, chỉ cần truy cập URL.
- Frontend hiển thị giao diện, backend xử lý logic, database lưu dữ liệu.

Đoạn mẫu:

```text
Ứng dụng website là phần mềm hoạt động trên nền tảng trình duyệt web, cho phép người dùng truy cập thông qua Internet mà không cần cài đặt trực tiếp trên máy tính. Một ứng dụng website thường gồm giao diện người dùng phía client, máy chủ xử lý nghiệp vụ phía server và cơ sở dữ liệu để lưu trữ thông tin.

Trong đề tài này, hệ thống Ngoại Thất AI được xây dựng dưới dạng ứng dụng website nhằm giúp người dùng dễ dàng upload ảnh nhà, lựa chọn phong cách thiết kế và nhận kết quả ảnh do AI tạo ra ngay trên trình duyệt.
```

---

## 8.2. Ưu điểm và nhược điểm của ứng dụng website

### Ưu điểm

- Dễ truy cập qua trình duyệt.
- Không cần cài đặt ứng dụng.
- Dễ cập nhật, bảo trì.
- Có thể dùng trên nhiều thiết bị.
- Phù hợp triển khai online với Vercel/Render.

### Nhược điểm

- Phụ thuộc Internet.
- Hiệu năng có thể phụ thuộc server và trình duyệt.
- Cần chú ý bảo mật API, CORS, token.
- Tác vụ AI có thể mất thời gian do gọi dịch vụ bên ngoài.

---

## 8.3. Một số phần mềm, thư viện được sử dụng trong đề tài

Theo PDF mẫu, mục này liệt kê công cụ. Với project của bạn nên viết các mục:

### 8.3.1. Draw.io

Dùng để vẽ:

- Use case.
- Biểu đồ hoạt động.
- Sơ đồ kiến trúc.
- Sơ đồ database.

### 8.3.2. Visual Studio Code

Dùng để lập trình frontend/backend.

### 8.3.3. ReactJS

Dùng để xây dựng giao diện người dùng.

File liên quan:

- `frontend/src/App.jsx`
- `frontend/src/components/ResultStep.jsx`
- `frontend/src/components/MixMatchPage.jsx`

### 8.3.4. Vite

Dùng để build và chạy frontend React.

File liên quan:

- `frontend/package.json`
- `frontend/vite.config.js`

### 8.3.5. Node.js và Express.js

Dùng để xây dựng RESTful API.

File liên quan:

- `backend/src/app.js`
- `backend/src/server.js`

### 8.3.6. MongoDB và Mongoose

Dùng để lưu dữ liệu người dùng, lịch sử tạo ảnh, thư viện mẫu, màu sơn.

File liên quan:

- `backend/src/models/User.js`
- `backend/src/models/Generation.js`
- `backend/src/models/RegionalLibrary.js`
- `backend/src/models/MixMatchProject.js`

### 8.3.7. Cloudinary

Dùng để lưu ảnh upload và ảnh AI kết quả.

File liên quan:

- `backend/src/services/cloud.js`

### 8.3.8. Google Gemini và AI image-to-image

Dùng để phân tích ảnh mẫu và hỗ trợ tạo ảnh ngoại thất.

File liên quan:

- `backend/src/services/external-ai.js`
- `backend/src/routes/wizard.js`

---

# 9. CHƯƠNG 2: PHÂN TÍCH CHỨC NĂNG VÀ THIẾT KẾ HỆ THỐNG

Chương này trong PDF mẫu là chương có nhiều bảng use case và biểu đồ. Với đề tài của bạn nên viết khoảng **15-25 trang**.

---

## 9.1. Chức năng chính

### Đối với người dùng

```text
- Đăng ký tài khoản.
- Đăng nhập vào hệ thống.
- Upload ảnh mẫu kiến trúc.
- Chọn phong cách/màu sắc theo Ngũ Hành.
- Upload ảnh mặt tiền nhà thật.
- Tạo ảnh gợi ý ngoại thất bằng AI.
- So sánh ảnh trước và sau khi AI xử lý.
- Sử dụng chức năng Mix & Match để chọn mẫu vùng miền và màu sơn.
- Xem hoặc lưu lịch sử kết quả đã tạo.
```

### Đối với quản trị viên

```text
- Đăng nhập với quyền admin.
- Xem thống kê hệ thống.
- Quản lý tài khoản người dùng.
- Phân quyền user/admin.
- Quản lý thư viện mẫu nhà vùng miền.
- Quản lý lịch sử sinh ảnh.
- Quản lý dữ liệu màu sơn và hãng sơn ở backend.
```

---

## 9.2. Mô tả chức năng và cách thức hoạt động

Viết theo luồng:

```text
Người dùng truy cập vào website, đăng ký hoặc đăng nhập tài khoản. Sau khi đăng nhập thành công, hệ thống kiểm tra quyền người dùng để hiển thị giao diện phù hợp. Người dùng thông thường có thể sử dụng các chức năng tạo ảnh ngoại thất theo Ngũ Hành hoặc Mix & Match. Quản trị viên có thêm quyền truy cập vào dashboard để quản lý người dùng, thư viện mẫu và lịch sử sinh ảnh.

Đối với chức năng tạo ảnh theo Ngũ Hành, người dùng upload ảnh mẫu để hệ thống phân tích phong cách, sau đó chọn mệnh phù hợp và upload ảnh mặt tiền nhà thật. Backend xây dựng prompt dựa trên ảnh mẫu, mệnh đã chọn và ảnh nhà thật, sau đó gọi AI provider để sinh ảnh ngoại thất mới.

Đối với chức năng Mix & Match, người dùng chọn mẫu kiến trúc vùng miền, màu tường, màu mái và màu cột. Hệ thống kết hợp các thông tin này thành prompt chi tiết để AI tạo ảnh phối màu ngoại thất.
```

---

## 9.3. Các biểu đồ thiết kế hệ thống cần vẽ

Bạn nên vẽ các hình sau bằng Draw.io:

1. Use case tổng quát.
2. Use case đăng ký/đăng nhập.
3. Use case tạo ảnh theo Ngũ Hành.
4. Use case Mix & Match.
5. Use case quản lý người dùng.
6. Use case quản lý thư viện mẫu.
7. Sơ đồ cơ sở dữ liệu MongoDB.
8. Biểu đồ hoạt động đăng nhập.
9. Biểu đồ hoạt động tạo ảnh Ngũ Hành.
10. Biểu đồ hoạt động Mix & Match.
11. Biểu đồ hoạt động quản lý thư viện mẫu.

---

## 9.4. Actor của hệ thống

| Actor | Mô tả |
|---|---|
| Khách chưa đăng nhập | Truy cập landing page, đăng ký, đăng nhập |
| User | Tạo ảnh AI, Mix & Match, xem kết quả |
| Admin | Quản lý người dùng, thư viện mẫu, lịch sử |
| AI Provider | Nhận ảnh/prompt và trả ảnh kết quả |
| Cloudinary | Lưu ảnh đầu vào và đầu ra |
| MongoDB | Lưu dữ liệu hệ thống |

---

## 9.5. Đặc tả use case mẫu

### Bảng đặc tả use case đăng nhập

| Thành phần | Nội dung |
|---|---|
| Tên use case | Đăng nhập |
| Actor | User, Admin |
| Mục tiêu | Xác thực tài khoản để sử dụng hệ thống |
| Tiền điều kiện | Người dùng đã có tài khoản |
| Luồng chính | Nhập email/mật khẩu → gửi request → backend kiểm tra → trả JWT → frontend lưu session |
| Luồng thay thế | Sai email/mật khẩu → báo lỗi đăng nhập |
| Kết quả | Người dùng vào được hệ thống theo đúng role |

### Bảng đặc tả use case tạo ảnh theo Ngũ Hành

| Thành phần | Nội dung |
|---|---|
| Tên use case | Tạo ảnh ngoại thất theo Ngũ Hành |
| Actor | User |
| Mục tiêu | Tạo ảnh gợi ý ngoại thất từ ảnh nhà thật và mệnh đã chọn |
| Tiền điều kiện | User đã đăng nhập |
| Luồng chính | Upload ảnh mẫu → AI phân tích → chọn mệnh → upload ảnh nhà → backend tạo prompt → gọi AI → trả ảnh kết quả |
| Luồng thay thế | AI lỗi hoặc thiếu ảnh → hệ thống báo lỗi |
| Kết quả | Người dùng xem được ảnh trước/sau |

### Bảng đặc tả use case Mix & Match

| Thành phần | Nội dung |
|---|---|
| Tên use case | Mix & Match ngoại thất |
| Actor | User |
| Mục tiêu | Phối ảnh nhà thật với mẫu vùng miền và màu sơn |
| Tiền điều kiện | User đã đăng nhập, có dữ liệu thư viện mẫu và màu sơn |
| Luồng chính | Upload ảnh nhà → chọn mẫu vùng miền → chọn màu tường/mái/cột → chọn provider → tạo ảnh |
| Luồng thay thế | Thiếu ảnh hoặc thiếu màu → báo lỗi |
| Kết quả | Hệ thống trả ảnh phối màu mới |

### Bảng đặc tả use case quản lý thư viện mẫu

| Thành phần | Nội dung |
|---|---|
| Tên use case | Quản lý thư viện mẫu |
| Actor | Admin |
| Mục tiêu | Thêm, sửa, xóa mẫu kiến trúc vùng miền |
| Tiền điều kiện | Admin đã đăng nhập |
| Luồng chính | Admin vào thư viện mẫu → thêm ảnh/styleData/description → backend lưu MongoDB và Cloudinary |
| Luồng thay thế | Thiếu ảnh hoặc dữ liệu không hợp lệ → báo lỗi |
| Kết quả | Mẫu mới hiển thị cho người dùng trong Mix & Match |

---

## 9.6. Thiết kế cơ sở dữ liệu MongoDB

Nên vẽ sơ đồ database và đưa bảng collection.

| Collection | Mục đích | File model |
|---|---|---|
| Users | Lưu tài khoản, passwordHash, role | `backend/src/models/User.js` |
| Generations | Lưu lịch sử tạo ảnh Ngũ Hành | `backend/src/models/Generation.js` |
| RegionalLibrary | Lưu thư viện mẫu vùng miền | `backend/src/models/RegionalLibrary.js` |
| PaintBrand | Lưu hãng sơn | `backend/src/models/PaintBrand.js` |
| PaintColor | Lưu màu sơn | `backend/src/models/PaintColor.js` |
| MixMatchProject | Lưu lịch sử Mix & Match | `backend/src/models/MixMatchProject.js` |
| DesignConfig | Lưu cấu hình phối màu | `backend/src/models/DesignConfig.js` |
| ColorPalette | Lưu bảng màu chung | `backend/src/models/ColorPalette.js` |

Lưu ý khi viết:

- Báo cáo thật nên ghi **MongoDB**, không ghi SQL Server.
- Vì code hiện tại đã dùng Mongoose.
- Nếu mẫu cũ có SQL thì bạn thay toàn bộ bằng MongoDB.

---

## 9.7. Biểu đồ hoạt động nên mô tả

### Hoạt động đăng nhập

```text
Bắt đầu → Nhập email/mật khẩu → Gửi API login → Backend kiểm tra → Đúng thì trả JWT → Sai thì báo lỗi → Kết thúc
```

### Hoạt động tạo ảnh Ngũ Hành

```text
Bắt đầu → Upload ảnh mẫu → Phân tích ảnh bằng AI → Chọn mệnh → Upload ảnh nhà → Backend tạo prompt → Gọi AI image-to-image → Upload output Cloudinary → Lưu MongoDB → Hiển thị kết quả
```

### Hoạt động Mix & Match

```text
Bắt đầu → Upload ảnh nhà → Chọn mẫu vùng miền → Chọn màu sơn → Gửi request → Backend lấy styleData/màu → Gọi AI → Lưu kết quả → Hiển thị trước/sau
```

---

# 10. CHƯƠNG 3: LỰA CHỌN CÔNG CỤ HỖ TRỢ PHÁT TRIỂN ỨNG DỤNG

Chương này trong PDF mẫu trình bày các công cụ như Firebase, Google Map. Với project của bạn, thay bằng công nghệ thật đang dùng. Nên viết khoảng **8-12 trang**.

---

## 10.1. ReactJS và Vite

Nội dung nên có:

- ReactJS là gì.
- Ưu điểm của ReactJS.
- Vì sao dùng ReactJS cho project.
- Vite là gì.
- Vì sao dùng Vite.

Lý do chọn:

```text
ReactJS phù hợp với hệ thống vì giao diện gồm nhiều component độc lập như trang đăng nhập, trang upload ảnh, trang kết quả, Mix & Match và admin dashboard. Vite giúp quá trình phát triển nhanh, build nhẹ và dễ triển khai lên Vercel.
```

File liên quan:

- `frontend/package.json`
- `frontend/src/App.jsx`
- `frontend/vite.config.js`

---

## 10.2. Node.js và Express.js

Nội dung nên có:

- Node.js là gì.
- Express.js là gì.
- RESTful API là gì.
- Vì sao backend cần Express.

Lý do chọn:

```text
Express.js giúp xây dựng API nhanh, dễ chia route theo từng module như users, wizard, mixmatch và admin. Ngoài ra Node.js dùng JavaScript nên frontend và backend có thể dùng cùng một ngôn ngữ, thuận tiện cho quá trình phát triển.
```

File liên quan:

- `backend/src/app.js`
- `backend/src/routes/users.js`
- `backend/src/routes/wizard.js`
- `backend/src/routes/mixmatch.js`
- `backend/src/routes/admin.js`

---

## 10.3. MongoDB và Mongoose

Nội dung nên có:

- MongoDB là gì.
- Document database là gì.
- Mongoose là gì.
- Vì sao phù hợp.

Lý do chọn:

```text
Dữ liệu của hệ thống có nhiều dạng linh hoạt như thông tin người dùng, prompt AI, lịch sử sinh ảnh, thư viện mẫu, màu sơn và project Mix & Match. MongoDB phù hợp vì có thể lưu document JSON linh hoạt và dễ mở rộng trong quá trình phát triển.
```

---

## 10.4. Cloudinary

Nội dung nên có:

- Cloudinary là gì.
- Vì sao không lưu ảnh trực tiếp trong database.
- Cách hệ thống upload ảnh lên Cloudinary.

Lý do chọn:

```text
Ảnh đầu vào và ảnh AI kết quả có dung lượng lớn, nếu lưu trực tiếp trong MongoDB sẽ làm database nặng. Cloudinary giúp lưu trữ ảnh, tối ưu truy cập và trả về URL để hệ thống lưu vào database.
```

File liên quan:

- `backend/src/services/cloud.js`

---

## 10.5. Google Gemini và AI image-to-image

Nội dung nên có:

- AI đa phương thức là gì.
- Gemini dùng để phân tích ảnh mẫu.
- Image-to-image dùng để tạo ảnh từ ảnh nhà thật.
- Multi-provider fallback.

Giải thích đơn giản:

```text
Hệ thống sử dụng AI để nhận ảnh đầu vào và prompt mô tả yêu cầu thiết kế. Thay vì tạo ảnh hoàn toàn mới từ văn bản, kỹ thuật image-to-image cho phép AI dựa trên ảnh nhà gốc, giữ lại cấu trúc chính và thay đổi màu sắc, vật liệu, phong cách ngoại thất theo yêu cầu.
```

File liên quan:

- `backend/src/services/external-ai.js`

---

## 10.6. Vercel và Render

Nội dung nên có:

- Vercel dùng deploy frontend React.
- Render dùng deploy backend Express.
- Frontend cần `VITE_API_URL`.
- Backend cần `ALLOWED_ORIGINS`.

Không đưa API key thật vào báo cáo.

---

# 11. CHƯƠNG 4: XÂY DỰNG ỨNG DỤNG

Đây là chương dài nhất trong PDF mẫu. Với project của bạn nên viết khoảng **20-30 trang**. Chương này cần nhiều ảnh giao diện, ảnh code ngắn và kết quả thực tế.

---

## 11.1. Thiết kế wireframe cho từng đối tượng người dùng

Theo PDF mẫu, mục 4.1 có wireframe cho từng đối tượng. Với project của bạn nên có:

### 4.1.1. Wireframe đăng nhập và đăng ký

Nên vẽ:

- Form email.
- Form password.
- Button đăng nhập/đăng ký.
- Link chuyển đổi đăng nhập/đăng ký.

### 4.1.2. Wireframe cho User

Nên vẽ:

- Navbar.
- Trang chọn chức năng.
- Wizard tạo ảnh.
- Trang Mix & Match.
- Trang kết quả trước/sau.

### 4.1.3. Wireframe cho Admin

Nên vẽ:

- Sidebar admin.
- Dashboard.
- Quản lý user.
- Quản lý thư viện mẫu.

---

## 11.2. Cài đặt dự án và thư viện cần thiết

### Backend

Nên ghi:

```text
Backend được xây dựng bằng Node.js và Express.js. Các thư viện chính gồm express, mongoose, jsonwebtoken, bcrypt, multer, cloudinary, axios, helmet, cors và express-rate-limit.
```

File liên quan:

- `backend/package.json`

Các lệnh:

```text
cd backend
npm install
npm run dev
npm start
```

### Frontend

Nên ghi:

```text
Frontend được xây dựng bằng ReactJS và Vite. Các component được chia theo từng chức năng như đăng nhập, đăng ký, wizard tạo ảnh, Mix & Match và admin dashboard.
```

File liên quan:

- `frontend/package.json`

Các lệnh:

```text
cd frontend
npm install
npm run dev
npm run build
```

---

## 11.3. Xây dựng chức năng chung

### 11.3.1. Chức năng đăng ký

File liên quan:

- `frontend/src/components/RegisterPage.jsx`
- `frontend/src/api/auth.js`
- `backend/src/routes/users.js`

Nên viết luồng:

```text
Người dùng nhập email, tên và mật khẩu. Frontend gửi dữ liệu đến API đăng ký. Backend kiểm tra email đã tồn tại chưa, hash mật khẩu bằng bcrypt và lưu user mới vào MongoDB.
```

Hình nên chụp:

- Giao diện đăng ký.
- Code API register ngắn.
- MongoDB có user mới.

### 11.3.2. Chức năng đăng nhập và duy trì đăng nhập

File liên quan:

- `frontend/src/components/LoginPage.jsx`
- `frontend/src/App.jsx`
- `backend/src/middlewares/auth.js`

Nên viết luồng:

```text
Sau khi đăng nhập thành công, backend trả về JWT. Frontend lưu thông tin user vào localStorage và gửi token trong header Authorization khi gọi các API cần xác thực.
```

Hình nên chụp:

- Giao diện đăng nhập.
- LocalStorage có user/token.
- Response login trong Network.

---

## 11.4. Xây dựng chức năng tạo ảnh theo Ngũ Hành

Đây là chức năng trọng tâm, nên viết kỹ khoảng 5-7 trang.

File liên quan:

- `backend/src/routes/wizard.js`
- `backend/src/services/external-ai.js`
- `frontend/src/hooks/useWizardFlow.js`
- `frontend/src/components/UploadSampleStep.jsx`
- `frontend/src/components/SelectRequirementsStep.jsx`
- `frontend/src/components/ResultStep.jsx`

### 11.4.1. Upload và phân tích ảnh mẫu

Nên viết:

```text
Người dùng upload ảnh mẫu kiến trúc. Backend nhận file, upload lên Cloudinary và gọi AI để phân tích các thành phần như tường, mái, cột, cửa, vật liệu, màu sắc. Kết quả phân tích được dùng để tạo style prompt cho bước sinh ảnh.
```

### 11.4.2. Chọn mệnh Ngũ Hành

Nên viết:

```text
Hệ thống hỗ trợ các mệnh Kim, Mộc, Thủy, Hỏa, Thổ. Mỗi mệnh được ánh xạ với một nhóm màu sắc phù hợp. Khi người dùng chọn mệnh, backend lưu thông tin màu sắc để đưa vào prompt tạo ảnh.
```

Bảng nên đưa vào:

| Mệnh | Màu sắc gợi ý |
|---|---|
| Kim | Trắng, bạc, xám, vàng kim |
| Mộc | Xanh lá, xanh rừng, olive |
| Thủy | Xanh navy, xanh biển, đen |
| Hỏa | Đỏ, cam, hồng, burgundy |
| Thổ | Vàng đất, nâu, be, terracotta |

### 11.4.3. Upload ảnh nhà thật và sinh ảnh

Nên viết:

```text
Người dùng upload ảnh mặt tiền nhà thật. Backend xây dựng prompt yêu cầu AI giữ nguyên cấu trúc căn nhà, số tầng, vị trí cửa, góc chụp và chỉ thay đổi màu sắc, vật liệu hoặc chi tiết trang trí ngoại thất. Sau khi AI trả kết quả, backend upload ảnh kết quả lên Cloudinary và lưu lịch sử vào MongoDB.
```

### 11.4.4. Hiển thị kết quả trước/sau

Nên viết:

```text
Frontend hiển thị ảnh gốc và ảnh kết quả bằng comparison slider, giúp người dùng kéo thanh trượt để so sánh trực quan giữa ảnh nhà thô và ảnh đã được AI xử lý.
```

Hình nên chụp:

- Upload ảnh mẫu.
- Chọn mệnh.
- Upload ảnh nhà.
- Loading AI.
- Kết quả trước/sau.

---

## 11.5. Xây dựng chức năng Mix & Match

File liên quan:

- `frontend/src/components/MixMatchPage.jsx`
- `frontend/src/components/BeforeAfterSlider.jsx`
- `backend/src/routes/mixmatch.js`
- `backend/src/models/RegionalLibrary.js`
- `backend/src/models/PaintColor.js`
- `backend/src/models/PaintBrand.js`

Nên viết:

```text
Chức năng Mix & Match cho phép người dùng chọn ảnh nhà thật, chọn mẫu kiến trúc vùng miền từ thư viện, sau đó chọn màu sơn cho từng bộ phận như tường, mái và cột. Backend kết hợp styleData của mẫu vùng miền với mã màu sơn để tạo prompt chi tiết gửi đến AI.
```

Các bước:

1. Upload ảnh nhà.
2. Chọn mẫu vùng miền.
3. Chọn màu tường.
4. Chọn màu mái.
5. Chọn màu cột.
6. Chọn provider AI.
7. Tạo ảnh.
8. Lưu kết quả.

Hình nên chụp:

- Trang Mix & Match.
- Modal chọn mẫu vùng miền.
- Danh sách màu sơn.
- Kết quả Mix & Match.

---

## 11.6. Xây dựng chức năng admin

File liên quan:

- `frontend/src/components/AdminLayout.jsx`
- `frontend/src/components/AdminDashboardPage.jsx`
- `frontend/src/components/AdminUserManagement.jsx`
- `frontend/src/components/AdminLibraryManager.jsx`
- `backend/src/routes/admin.js`

### 11.6.1. Admin dashboard

Nên viết:

- Hiển thị thống kê tổng quan.
- Số user.
- Số lượt sinh ảnh.
- Dữ liệu quản trị.

### 11.6.2. Quản lý người dùng

Nên viết:

- Admin xem danh sách user.
- Thêm user.
- Sửa user.
- Đổi role.
- Xóa user.

### 11.6.3. Quản lý thư viện mẫu

Nên viết:

- Admin upload ảnh mẫu.
- Nhập regionName.
- Nhập styleData.
- Nhập description.
- Backend upload ảnh lên Cloudinary và lưu MongoDB.

Lưu ý quan trọng:

```text
styleData nên được lưu dạng string vì backend dùng dữ liệu này để nối trực tiếp vào prompt AI. Nếu lưu dạng object, khi tạo prompt có thể bị chuyển thành [object Object], làm giảm chất lượng kết quả AI.
```

---

## 11.7. Kết quả làm được

Theo PDF mẫu, mục 4.4 có nhiều ảnh giao diện kết quả. Với bạn nên chia:

### 11.7.1. Giao diện người dùng

Chèn các hình:

- Landing page.
- Đăng ký.
- Đăng nhập.
- Upload ảnh mẫu.
- Chọn mệnh.
- Upload ảnh nhà.
- Kết quả trước/sau.
- Mix & Match.

### 11.7.2. Giao diện quản trị

Chèn các hình:

- Admin dashboard.
- Quản lý user.
- Quản lý thư viện mẫu.
- Dữ liệu MongoDB.
- Ảnh Cloudinary.

### 11.7.3. Kết quả triển khai

Chèn:

- Vercel frontend.
- Render backend.
- Health check backend.
- Network API thành công.

---

# 12. KẾT LUẬN

Kết luận nên dài 1-2 trang.

## 12.1. Nội dung nên viết

- Nhắc lại mục tiêu đề tài.
- Tổng kết chức năng đã làm.
- Nêu công nghệ sử dụng.
- Nêu kết quả đạt được.
- Nêu hạn chế.
- Nêu hướng phát triển.

Đoạn mẫu:

```text
Sau quá trình nghiên cứu và thực hiện, đề tài “Xây dựng hệ thống gợi ý thiết kế ngoại thất căn nhà bằng trí tuệ nhân tạo” đã hoàn thành các chức năng cơ bản theo mục tiêu đề ra. Hệ thống cho phép người dùng đăng ký, đăng nhập, upload ảnh nhà, lựa chọn phong cách hoặc màu sắc theo Ngũ Hành và tạo ảnh gợi ý ngoại thất bằng AI. Ngoài ra, hệ thống còn hỗ trợ chức năng Mix & Match, giúp người dùng kết hợp ảnh nhà thật với thư viện mẫu vùng miền và bảng màu sơn.

Về mặt kỹ thuật, hệ thống được xây dựng theo mô hình client-server với frontend ReactJS, backend Node.js/Express.js, cơ sở dữ liệu MongoDB và dịch vụ lưu trữ ảnh Cloudinary. Hệ thống cũng tích hợp các dịch vụ AI tạo ảnh như Google Gemini, HQ API và Stability AI để xử lý tác vụ image-to-image.

Bên cạnh những kết quả đạt được, hệ thống vẫn còn một số hạn chế như thời gian tạo ảnh phụ thuộc vào AI provider, kết quả AI chưa phải lúc nào cũng chính xác tuyệt đối và chưa có chức năng phân vùng ảnh chuyên sâu. Trong tương lai, hệ thống có thể được phát triển thêm các chức năng như segmentation tường/mái/cột, chỉnh sửa thủ công trên ảnh, quản lý gói sử dụng và tối ưu tốc độ xử lý AI.
```

---

# 13. TÀI LIỆU THAM KHẢO

Nên đưa khoảng 10-15 tài liệu. Ví dụ:

```text
[1] ReactJS Documentation, https://react.dev/
[2] Vite Documentation, https://vite.dev/
[3] Node.js Documentation, https://nodejs.org/
[4] Express.js Documentation, https://expressjs.com/
[5] MongoDB Documentation, https://www.mongodb.com/docs/
[6] Mongoose Documentation, https://mongoosejs.com/
[7] Cloudinary Documentation, https://cloudinary.com/documentation
[8] Google Gemini API Documentation, https://ai.google.dev/
[9] Stability AI Documentation, https://platform.stability.ai/docs
[10] JWT Introduction, https://jwt.io/introduction
[11] bcrypt package documentation, https://www.npmjs.com/package/bcrypt
[12] Vercel Documentation, https://vercel.com/docs
[13] Render Documentation, https://render.com/docs
[14] Tài liệu tham khảo về phối màu ngoại thất và phong thủy Ngũ Hành.
[15] Các bài viết kỹ thuật và thảo luận trên Stack Overflow, GitHub, YouTube.
```

Lưu ý: nếu trường yêu cầu format IEEE/APA thì cần chỉnh lại định dạng.

---

# 14. PHÂN BỔ TRANG THEO FORM PDF MẪU

Nếu muốn báo cáo khoảng 70 trang:

| Phần | Số trang gợi ý |
|---|---:|
| Trang bìa, mục lục, danh mục hình/bảng | 8-12 |
| Nhiệm vụ đề tài, GVHD, lời cảm ơn | 3 |
| Phần mở đầu | 6-8 |
| Chương 1 | 6-8 |
| Chương 2 | 15-22 |
| Chương 3 | 8-12 |
| Chương 4 | 20-28 |
| Kết luận | 1-2 |
| Tài liệu tham khảo | 1-2 |
| **Tổng** | **68-97** |

Nếu trường chỉ cần 50-70 trang, hãy giảm số hình code trong chương 4.

---

# 15. CHECKLIST LÀM BÁO CÁO THẬT

| Việc cần làm | Trạng thái |
|---|---|
| Làm trang bìa 1 | Chưa làm |
| Làm trang bìa 2 | Chưa làm |
| Viết nhiệm vụ đề tài | Chưa làm |
| Viết cán bộ hướng dẫn | Chưa làm |
| Viết lời cảm ơn | Chưa làm |
| Viết phần mở đầu | Chưa làm |
| Tìm/chụp hình phần mềm trong nước | Chưa làm |
| Tìm/chụp hình phần mềm ngoài nước | Chưa làm |
| Viết chương 1 tổng quan lý thuyết | Chưa làm |
| Vẽ use case tổng quát | Chưa làm |
| Vẽ use case các chức năng chính | Chưa làm |
| Viết đặc tả use case | Chưa làm |
| Vẽ biểu đồ hoạt động | Chưa làm |
| Vẽ sơ đồ MongoDB | Chưa làm |
| Viết chương 2 phân tích thiết kế | Chưa làm |
| Viết chương 3 lựa chọn công cụ | Chưa làm |
| Vẽ wireframe | Chưa làm |
| Chụp ảnh giao diện frontend | Chưa làm |
| Chụp ảnh admin dashboard | Chưa làm |
| Chụp ảnh MongoDB/Cloudinary | Chưa làm |
| Viết chương 4 xây dựng ứng dụng | Chưa làm |
| Viết kết luận | Chưa làm |
| Thêm tài liệu tham khảo | Chưa làm |
| Tạo mục lục tự động Word | Chưa làm |
| Tạo danh mục hình ảnh tự động | Chưa làm |
| Tạo danh mục bảng tự động | Chưa làm |
| Kiểm tra không lộ API key/password | Chưa làm |
| Xuất PDF cuối cùng | Chưa làm |

---

# 16. THỨ TỰ LÀM KHUYẾN NGHỊ

Không nên viết từ đầu tới cuối ngay. Nên làm theo thứ tự này:

1. Chụp toàn bộ giao diện hệ thống.
2. Vẽ use case và biểu đồ hoạt động.
3. Vẽ sơ đồ database MongoDB.
4. Viết chương 2 trước vì chương này cần sơ đồ và bảng.
5. Viết chương 4 tiếp theo vì có nhiều ảnh giao diện/code.
6. Viết chương 3 về công cụ.
7. Viết chương 1 lý thuyết.
8. Viết phần mở đầu.
9. Viết kết luận.
10. Tạo mục lục, danh mục hình, danh mục bảng tự động.

Lý do: chương 2 và chương 4 là phần chính, dễ chiếm nhiều trang và bám sát code thật nhất.

---

# 17. LƯU Ý KHI BẢO VỆ

## 17.1. Nếu hội đồng hỏi hệ thống dùng AI gì

Trả lời:

```text
Hệ thống sử dụng Google Gemini để phân tích ảnh mẫu và hỗ trợ tạo ảnh. Ngoài ra backend được thiết kế theo hướng multi-provider, có thể gọi HQ API, Stability AI, Replicate hoặc Hugging Face. Tác vụ tạo ảnh dùng kỹ thuật image-to-image để giữ cấu trúc nhà gốc và chỉ thay đổi màu sắc, vật liệu ngoại thất.
```

## 17.2. Nếu hỏi vì sao dùng image-to-image

Trả lời:

```text
Vì bài toán yêu cầu giữ lại căn nhà gốc của người dùng. Nếu dùng text-to-image, AI có thể tạo ra một căn nhà hoàn toàn mới. Image-to-image giúp AI dựa trên ảnh thật, giữ bố cục và thay đổi phần ngoại thất theo prompt.
```

## 17.3. Nếu hỏi vì sao dùng Cloudinary

Trả lời:

```text
Ảnh đầu vào và ảnh kết quả có dung lượng lớn, không phù hợp lưu trực tiếp trong database. Cloudinary giúp lưu trữ ảnh và trả về URL, còn MongoDB chỉ lưu đường dẫn ảnh để hệ thống nhẹ hơn.
```

## 17.4. Nếu hỏi vì sao dùng MongoDB

Trả lời:

```text
Dữ liệu của hệ thống có cấu trúc linh hoạt như prompt, styleData, lịch sử sinh ảnh, màu sơn và thư viện mẫu. MongoDB phù hợp vì lưu document JSON linh hoạt và dễ tích hợp với Node.js qua Mongoose.
```

## 17.5. Nếu hỏi hạn chế của hệ thống

Trả lời:

```text
Hệ thống còn phụ thuộc vào AI provider nên tốc độ và chất lượng ảnh có thể thay đổi. Ngoài ra, hệ thống chưa có segmentation chuyên sâu để tách chính xác từng vùng tường, mái, cột. Trong tương lai có thể bổ sung phân vùng ảnh, queue xử lý AI và tối ưu prompt để kết quả ổn định hơn.
```

---

# 18. KẾT LUẬN CỦA FILE HƯỚNG DẪN

Báo cáo thật của bạn nên bám sát cấu trúc PDF mẫu với 4 chương chính:

- **Chương 1:** Tổng quan lý thuyết.
- **Chương 2:** Phân tích chức năng và thiết kế hệ thống.
- **Chương 3:** Lựa chọn công cụ hỗ trợ phát triển ứng dụng.
- **Chương 4:** Xây dựng ứng dụng.

Trong đó, chương 2 và chương 4 là hai chương quan trọng nhất để thể hiện công sức làm project. Nếu chèn đầy đủ use case, biểu đồ hoạt động, sơ đồ MongoDB, ảnh giao diện, ảnh code và kết quả AI, báo cáo sẽ dễ đạt khoảng **60-80 trang** theo đúng phong cách của file PDF mẫu.
