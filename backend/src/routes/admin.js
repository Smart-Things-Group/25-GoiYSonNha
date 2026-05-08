const express = require("express");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });
const { uploadBufferToCloudinary } = require("../services/cloud");
const bcrypt = require("bcrypt");
const PDFDocument = require("pdfkit");
const User = require("../models/User");
const Generation = require("../models/Generation");
const RegionalLibrary = require("../models/RegionalLibrary");
const PaintBrand = require("../models/PaintBrand");
const PaintColor = require("../models/PaintColor");
const asyncHandler = require("../middlewares/asyncHandler");

const router = express.Router();

// 1. Dashboard stats
router.get("/stats", asyncHandler(async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [totalUsers, totalGenerations, todayGenerations, topStyles, topActiveUsers] = await Promise.all([
    User.countDocuments(),
    Generation.countDocuments(),
    Generation.countDocuments({ createdAt: { $gte: today } }),
    Generation.aggregate([
      {
        $group: {
          _id: { $ifNull: [{ $trim: { input: "$style" } }, "Không rõ"] },
          count: { $sum: 1 },
        },
      },
      { $match: { _id: { $ne: "" } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      { $project: { style: { $ifNull: ["$_id", "Không rõ"] }, count: 1, _id: 0 } },
    ]),
    User.aggregate([
      {
        $lookup: {
          from: "generations",
          localField: "_id",
          foreignField: "userId",
          as: "gens",
        },
      },
      {
        $project: {
          userId: "$_id",
          email: "$email",
          totalGenerations: { $size: "$gens" },
        },
      },
      { $sort: { totalGenerations: -1 } },
      { $limit: 5 },
    ]),
  ]);

  res.ok({ totalUsers, totalGenerations, todayGenerations, topStyles, topActiveUsers });
}));

// 2. List users
router.get("/users", asyncHandler(async (req, res) => {
  let { page = 1, pageSize = 20, search = "", role = "" } = req.query;
  page = Math.max(parseInt(page, 10) || 1, 1);
  pageSize = Math.min(Math.max(parseInt(pageSize, 10) || 20, 1), 100);

  const sanitizedSearch = search.trim();
  const normalizedRole = (role || "").trim().toLowerCase();

  const filter = {};
  if (sanitizedSearch) filter.email = { $regex: sanitizedSearch, $options: "i" };
  if (normalizedRole && normalizedRole !== "all") filter.role = normalizedRole;

  const offset = (page - 1) * pageSize;

  const total = await User.countDocuments(filter);

  const roleSummaryAgg = await User.aggregate([
    { $match: filter },
    { $group: { _id: "$role", count: { $sum: 1 } } },
  ]);
  const roleSummary = roleSummaryAgg.reduce((acc, row) => {
    acc[(row._id || "unknown").toLowerCase()] = row.count;
    return acc;
  }, {});

  const items = await User.aggregate([
    { $match: filter },
    {
      $lookup: {
        from: "generations",
        localField: "_id",
        foreignField: "userId",
        as: "gens",
      },
    },
    {
      $addFields: {
        id: "$_id",
        GenerationCount: { $size: "$gens" },
        LastGenerationAt: { $max: "$gens.createdAt" },
      },
    },
    { $project: { gens: 0, passwordHash: 0, __v: 0 } },
    { $sort: { createdAt: -1 } },
    { $skip: offset },
    { $limit: pageSize },
  ]);

  res.ok({ page, pageSize, total, roleSummary, items });
}));

// 3. Update user role
router.patch("/users/:id/role", asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { role } = req.body || {};

  if (!role || !["admin", "user"].includes(role)) {
    return res.status(400).json({ ok: false, message: "Role không hợp lệ (admin | user)" });
  }

  const user = await User.findByIdAndUpdate(id, { role }, { new: true }).select("-passwordHash");
  if (!user) {
    return res.status(404).json({ ok: false, message: "Không tìm thấy user" });
  }

  res.ok({ user });
}));

// 3b. Create user
router.post("/users", asyncHandler(async (req, res) => {
  const { email, password, role = "user" } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ ok: false, message: "Email và mật khẩu không được để trống" });
  }
  if (!["admin", "user"].includes(role)) {
    return res.status(400).json({ ok: false, message: "Role không hợp lệ (admin | user)" });
  }

  const exists = await User.findOne({ email });
  if (exists) {
    return res.status(409).json({ ok: false, message: "Email đã tồn tại" });
  }

  const hash = await bcrypt.hash(password, 10);
  const user = await User.create({ email, passwordHash: hash, role });

  res.ok({ user: { id: user._id, email: user.email, role: user.role, createdAt: user.createdAt } });
}));

// 3c. Update user
router.put("/users/:id", asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { email, password, role } = req.body || {};
  const updates = {};

  if (email) updates.email = email;
  if (role) {
    if (!["admin", "user"].includes(role)) {
      return res.status(400).json({ ok: false, message: "Role không hợp lệ (admin | user)" });
    }
    updates.role = role;
  }
  if (password) {
    updates.passwordHash = await bcrypt.hash(password, 10);
  }

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ ok: false, message: "Không có trường nào để cập nhật" });
  }

  const user = await User.findByIdAndUpdate(id, updates, { new: true }).select("-passwordHash");
  if (!user) {
    return res.status(404).json({ ok: false, message: "Không tìm thấy user" });
  }

  res.ok({ user });
}));

// 4. Delete user
router.delete("/users/:id", asyncHandler(async (req, res) => {
  const result = await User.findByIdAndDelete(req.params.id);
  res.ok({ deleted: result ? 1 : 0 });
}));

// 4b. Generations by user
router.get("/generations/by-user", asyncHandler(async (req, res) => {
  let { page = 1, pageSize = 5, search = "" } = req.query;
  page = Math.max(parseInt(page, 10) || 1, 1);
  pageSize = Math.min(Math.max(parseInt(pageSize, 10) || 5, 1), 100);
  const offset = (page - 1) * pageSize;
  const sanitizedSearch = search.trim();

  const matchFilter = sanitizedSearch
    ? { email: { $regex: sanitizedSearch, $options: "i" } }
    : {};

  const pipeline = [
    { $match: matchFilter },
    {
      $lookup: {
        from: "generations",
        localField: "_id",
        foreignField: "userId",
        as: "gens",
      },
    },
    {
      $project: {
        userId: "$_id",
        email: "$email",
        role: "$role",
        generationCount: { $size: "$gens" },
        lastGenerationAt: { $max: "$gens.createdAt" },
      },
    },
    { $sort: { lastGenerationAt: -1, userId: -1 } },
  ];

  const totalResult = await User.aggregate([...pipeline, { $count: "total" }]);
  const total = totalResult[0]?.total || 0;

  const items = await User.aggregate([...pipeline, { $skip: offset }, { $limit: pageSize }]);

  res.ok({ page, pageSize, total, items });
}));

// 5. List generations
router.get("/generations", asyncHandler(async (req, res) => {
  let { page = 1, pageSize = 20, userId, style, from, to } = req.query;
  page = Math.max(parseInt(page, 10) || 1, 1);
  pageSize = Math.min(Math.max(parseInt(pageSize, 10) || 20, 1), 100);
  const offset = (page - 1) * pageSize;

  const filter = {};
  if (userId) filter.userId = userId;
  if (style) filter.style = style;

  const parseDate = (value) => { const d = new Date(value); return isNaN(d.getTime()) ? null : d; };
  const fromDate = from ? parseDate(from) : null;
  const toDate = to ? parseDate(to) : null;
  if (fromDate || toDate) {
    filter.createdAt = {};
    if (fromDate) filter.createdAt.$gte = fromDate;
    if (toDate) filter.createdAt.$lte = toDate;
  }

  const total = await Generation.countDocuments(filter);

  const items = await Generation.find(filter)
    .populate("userId", "email")
    .select("-__v")
    .sort({ createdAt: -1 })
    .skip(offset)
    .limit(pageSize)
    .lean();

  const mapped = items.map((g) => ({
    id: g._id,
    userId: g.userId?._id,
    email: g.userId?.email,
    inputDesc: g.inputDesc,
    inputImageUrl: g.inputImageUrl,
    outputImageUrl: g.outputImageUrl,
    style: g.style,
    palette: g.palette,
    promptUsed: g.promptUsed,
    createdAt: g.createdAt,
  }));

  res.ok({ page, pageSize, total, items: mapped });
}));

// 6. Single generation
router.get("/generations/:id", asyncHandler(async (req, res) => {
  const item = await Generation.findById(req.params.id)
    .populate("userId", "email")
    .lean();

  if (!item) {
    return res.status(404).json({ ok: false, message: "Không tìm thấy bản ghi" });
  }

  res.ok({
    item: {
      id: item._id,
      userId: item.userId?._id,
      Email: item.userId?.email,
      inputDesc: item.inputDesc,
      inputImageUrl: item.inputImageUrl,
      outputImageUrl: item.outputImageUrl,
      style: item.style,
      palette: item.palette,
      seed: item.seed,
      promptUsed: item.promptUsed,
      createdAt: item.createdAt,
      description: item.description,
    },
  });
}));

// 7. Delete generation
router.delete("/generations/:id", asyncHandler(async (req, res) => {
  const result = await Generation.findByIdAndDelete(req.params.id);
  res.ok({ deleted: result ? 1 : 0 });
}));

// 8. Export PDF
router.get("/generations/:id/export-pdf", asyncHandler(async (req, res) => {
  const item = await Generation.findById(req.params.id)
    .populate("userId", "email")
    .lean();

  if (!item) {
    return res.status(404).json({ ok: false, message: "Không tìm thấy bản ghi" });
  }

  const createdAt = item.createdAt instanceof Date ? item.createdAt : new Date(item.createdAt || Date.now());

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename="generation-${item._id}.pdf"`);

  const doc = new PDFDocument({ margin: 40 });
  doc.pipe(res);

  doc.fontSize(18).text("BAO CAO PHUONG AN NGOAI THAT", { align: "center" });
  doc.moveDown();
  doc.fontSize(11);
  doc.text(`Ma ban ghi: ${item._id}`);
  doc.text(`Nguoi dung: ${item.userId?.email || "N/A"}`);
  doc.text(`Ngay tao: ${createdAt.toISOString()}`);
  doc.moveDown();
  doc.text("Mo ta dau vao:", { underline: true });
  doc.text(item.inputDesc || "Khong co");
  doc.moveDown();
  doc.text("Phong cach:", { underline: true });
  doc.text(item.style || "Khong ro");
  doc.moveDown();
  doc.text("Bang mau:", { underline: true });
  doc.text(item.palette || "Khong ro");
  doc.moveDown();
  doc.text("Prompt AI:", { underline: true });
  doc.text(item.promptUsed || "Khong luu");
  doc.moveDown();

  if (item.inputImageUrl) {
    doc.addPage();
    doc.fontSize(14).text("Anh hien trang", { align: "center" });
    doc.moveDown();
    try { doc.image(item.inputImageUrl, { fit: [500, 400], align: "center", valign: "center" }); }
    catch { doc.fontSize(11).text("Khong tai duoc anh hien trang"); }
  }

  if (item.outputImageUrl) {
    doc.addPage();
    doc.fontSize(14).text("Anh goi y ngoai that", { align: "center" });
    doc.moveDown();
    try { doc.image(item.outputImageUrl, { fit: [500, 400], align: "center", valign: "center" }); }
    catch { doc.fontSize(11).text("Khong tai duoc anh goi y"); }
  }

  doc.end();
}));

// 9. Create library item
router.post("/library", upload.single("image"), asyncHandler(async (req, res) => {
  const { regionName, styleData, description } = req.body;

  if (!req.file) {
    return res.status(400).json({ ok: false, message: "Vui lòng chọn ảnh mẫu nhà" });
  }

  const cloudRes = await uploadBufferToCloudinary(req.file.buffer, "exterior_ai/samples");

  await RegionalLibrary.create({
    regionName,
    imageUrl: cloudRes.secure_url,
    styleData: styleData || "",
    description,
  });

  res.ok({ message: "Đã thêm mẫu nhà vào thư viện thành công", imageUrl: cloudRes.secure_url });
}));

// 10. List library
router.get("/library", asyncHandler(async (req, res) => {
  const items = await RegionalLibrary.find().sort({ createdAt: -1 }).lean();
  res.ok({ items: items.map(item => ({ ...item, id: item._id })) });
}));

// 11. Update library item
router.put("/library/:id", upload.single("image"), asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { regionName, styleData, description } = req.body;

  const existing = await RegionalLibrary.findById(id);
  if (!existing) {
    return res.status(404).json({ ok: false, message: "Không tìm thấy mẫu nhà" });
  }

  let imageUrl = existing.imageUrl;
  if (req.file) {
    const cloudRes = await uploadBufferToCloudinary(req.file.buffer, "exterior_ai/samples");
    imageUrl = cloudRes.secure_url;
  }

  const item = await RegionalLibrary.findByIdAndUpdate(
    id,
    {
      regionName: regionName || existing.regionName,
      imageUrl,
      styleData: styleData !== undefined ? styleData : existing.styleData,
      description: description !== undefined ? description : existing.description,
    },
    { new: true }
  );

  res.ok({ message: "Đã cập nhật mẫu nhà thành công", item });
}));

// 12. Delete library item
router.delete("/library/:id", asyncHandler(async (req, res) => {
  const result = await RegionalLibrary.findByIdAndDelete(req.params.id);
  res.ok({ deleted: result ? 1 : 0 });
}));

// === PAINT BRANDS ===

// 13. List paint brands
router.get("/paint-brands", asyncHandler(async (req, res) => {
  const items = await PaintBrand.find().sort({ displayOrder: 1, brandName: 1 }).lean();
  res.ok({ items: items.map(item => ({ ...item, id: item._id })) });
}));

// 14. Create paint brand
router.post("/paint-brands", upload.single("logo"), asyncHandler(async (req, res) => {
  const { brandName, description, websiteUrl, displayOrder = 0 } = req.body;

  if (!brandName || !brandName.trim()) {
    return res.status(400).json({ ok: false, message: "Tên thương hiệu không được để trống" });
  }

  const exists = await PaintBrand.findOne({ brandName: brandName.trim() });
  if (exists) {
    return res.status(400).json({ ok: false, message: "Thương hiệu này đã tồn tại" });
  }

  let logoUrl = null;
  if (req.file) {
    const cloudRes = await uploadBufferToCloudinary(req.file.buffer, "exterior_ai/brands");
    logoUrl = cloudRes.secure_url;
  }

  const item = await PaintBrand.create({
    brandName: brandName.trim(),
    brandLogoUrl: logoUrl,
    description: description || null,
    websiteUrl: websiteUrl || null,
    displayOrder: parseInt(displayOrder) || 0,
  });

  res.ok({ message: "Đã thêm thương hiệu sơn thành công", item });
}));

// 15. Update paint brand
router.put("/paint-brands/:id", upload.single("logo"), asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { brandName, description, websiteUrl, displayOrder, isActive } = req.body;

  const existing = await PaintBrand.findById(id);
  if (!existing) {
    return res.status(404).json({ ok: false, message: "Không tìm thấy thương hiệu" });
  }

  if (brandName && brandName.trim() !== existing.brandName) {
    const dup = await PaintBrand.findOne({ brandName: brandName.trim(), _id: { $ne: id } });
    if (dup) {
      return res.status(400).json({ ok: false, message: "Tên thương hiệu đã tồn tại" });
    }
  }

  let logoUrl = existing.brandLogoUrl;
  if (req.file) {
    const cloudRes = await uploadBufferToCloudinary(req.file.buffer, "exterior_ai/brands");
    logoUrl = cloudRes.secure_url;
  }

  const item = await PaintBrand.findByIdAndUpdate(
    id,
    {
      brandName: brandName?.trim() || existing.brandName,
      brandLogoUrl: logoUrl,
      description: description !== undefined ? description : existing.description,
      websiteUrl: websiteUrl !== undefined ? websiteUrl : existing.websiteUrl,
      displayOrder: displayOrder !== undefined ? parseInt(displayOrder) : existing.displayOrder,
      isActive: isActive !== undefined ? (isActive === "true" || isActive === true) : existing.isActive,
    },
    { new: true }
  );

  res.ok({ message: "Đã cập nhật thương hiệu thành công", item });
}));

// 16. Delete paint brand
router.delete("/paint-brands/:id", asyncHandler(async (req, res) => {
  const { id } = req.params;

  const colorCount = await PaintColor.countDocuments({ brandId: id });
  if (colorCount > 0) {
    await PaintColor.deleteMany({ brandId: id });
  }

  const result = await PaintBrand.findByIdAndDelete(id);
  res.ok({
    deleted: result ? 1 : 0,
    message: colorCount > 0
      ? `Đã xóa thương hiệu và ${colorCount} màu sơn liên quan`
      : "Đã xóa thương hiệu",
  });
}));

// === PAINT COLORS ===

// 17. List paint colors
router.get("/paint-colors", asyncHandler(async (req, res) => {
  const { brandId, componentType } = req.query;
  const filter = {};
  if (brandId) filter.brandId = brandId;
  if (componentType) filter.componentType = componentType;

  const items = await PaintColor.find(filter)
    .populate("brandId", "brandName")
    .sort({ colorName: 1 })
    .lean();

  const mapped = items.map((c) => ({
    ...c,
    id: c._id,
    brandName: c.brandId?.brandName || null,
  }));

  res.ok({ items: mapped });
}));

// 18. Create paint color
router.post("/paint-colors", upload.single("swatch"), asyncHandler(async (req, res) => {
  const { brandId, colorName, colorCode, hexCode, componentType, description } = req.body;

  if (!brandId || !colorName || !colorCode || !hexCode || !componentType) {
    return res.status(400).json({ ok: false, message: "Thiếu thông tin bắt buộc (brandId, colorName, colorCode, hexCode, componentType)" });
  }
  if (!/^#[0-9A-Fa-f]{6}$/.test(hexCode)) {
    return res.status(400).json({ ok: false, message: "Mã HEX không hợp lệ (phải có dạng #RRGGBB)" });
  }
  if (!["wall", "roof", "column", "all"].includes(componentType)) {
    return res.status(400).json({ ok: false, message: "ComponentType phải là một trong: wall, roof, column, all" });
  }

  const brandExists = await PaintBrand.findById(brandId);
  if (!brandExists) {
    return res.status(400).json({ ok: false, message: "Thương hiệu không tồn tại" });
  }

  let imageUrl = null;
  if (req.file) {
    const cloudRes = await uploadBufferToCloudinary(req.file.buffer, "exterior_ai/colors");
    imageUrl = cloudRes.secure_url;
  }

  const item = await PaintColor.create({
    brandId,
    colorName: colorName.trim(),
    colorCode: colorCode.trim(),
    hexCode: hexCode.toUpperCase(),
    componentType,
    imageUrl,
    description: description || null,
  });

  res.ok({ message: "Đã thêm màu sơn thành công", item });
}));

// 19. Update paint color
router.put("/paint-colors/:id", upload.single("swatch"), asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { brandId, colorName, colorCode, hexCode, componentType, description, isActive } = req.body;

  const existing = await PaintColor.findById(id);
  if (!existing) {
    return res.status(404).json({ ok: false, message: "Không tìm thấy màu sơn" });
  }

  if (hexCode && !/^#[0-9A-Fa-f]{6}$/.test(hexCode)) {
    return res.status(400).json({ ok: false, message: "Mã HEX không hợp lệ" });
  }
  if (componentType && !["wall", "roof", "column", "all"].includes(componentType)) {
    return res.status(400).json({ ok: false, message: "ComponentType phải là một trong: wall, roof, column, all" });
  }
  if (brandId && String(brandId) !== String(existing.brandId)) {
    const brandExists = await PaintBrand.findById(brandId);
    if (!brandExists) {
      return res.status(400).json({ ok: false, message: "Thương hiệu không tồn tại" });
    }
  }

  let imageUrl = existing.imageUrl;
  if (req.file) {
    const cloudRes = await uploadBufferToCloudinary(req.file.buffer, "exterior_ai/colors");
    imageUrl = cloudRes.secure_url;
  }

  const item = await PaintColor.findByIdAndUpdate(
    id,
    {
      brandId: brandId || existing.brandId,
      colorName: colorName?.trim() || existing.colorName,
      colorCode: colorCode?.trim() || existing.colorCode,
      hexCode: hexCode ? hexCode.toUpperCase() : existing.hexCode,
      componentType: componentType || existing.componentType,
      imageUrl,
      description: description !== undefined ? description : existing.description,
      isActive: isActive !== undefined ? (isActive === "true" || isActive === true) : existing.isActive,
    },
    { new: true }
  );

  res.ok({ message: "Đã cập nhật màu sơn thành công", item });
}));

// 20. Delete paint color
router.delete("/paint-colors/:id", asyncHandler(async (req, res) => {
  const { id } = req.params;

  const MixMatchProject = require("../models/MixMatchProject");
  const inUse = await MixMatchProject.findOne({
    $or: [{ wallColorId: id }, { roofColorId: id }, { columnColorId: id }],
  });

  if (inUse) {
    return res.status(400).json({
      ok: false,
      message: "Không thể xóa màu sơn này vì đang được sử dụng trong các dự án Mix & Match",
    });
  }

  const result = await PaintColor.findByIdAndDelete(id);
  res.ok({ deleted: result ? 1 : 0, message: "Đã xóa màu sơn thành công" });
}));

function tryParseJSON(str) {
  if (typeof str !== "string") return str;
  try { return JSON.parse(str); } catch { return str; }
}

module.exports = router;
