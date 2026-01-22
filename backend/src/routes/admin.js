const express = require("express");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });
const { uploadBufferToCloudinary } = require("../services/cloud");
const bcrypt = require("bcrypt");
const PDFDocument = require("pdfkit");
const { getPool, sql } = require("../db");
const asyncHandler = require("../middlewares/asyncHandler");

const router = express.Router();

/**
 * 1?? Dashboard th?ng k?
 * GET /api/admin/stats
 */
router.get(
  "/stats",
  asyncHandler(async (req, res) => {
    const pool = await getPool();
    const q = `
      -- T?ng s? user
      SELECT COUNT(*) AS totalUsers FROM Users;

      -- T?ng s? l??t sinh ?nh
      SELECT COUNT(*) AS totalGenerations FROM Generations;

      -- S? l??t sinh ?nh h?m nay
      SELECT COUNT(*) AS todayGenerations
      FROM Generations
      WHERE CAST(CreatedAt AS date) = CAST(SYSDATETIME() AS date);

      -- Top 5 phong c?ch ph? bi?n
      SELECT TOP 5
        ISNULL(NULLIF(LTRIM(RTRIM(Style)), ''), N'Kh?ng r?') AS Style,
        COUNT(*) AS count
      FROM Generations
      GROUP BY ISNULL(NULLIF(LTRIM(RTRIM(Style)), ''), N'Kh?ng r?')
      ORDER BY count DESC;

      -- Top 5 user ho?t ??ng nhi?u
      SELECT TOP 5
        U.Id        AS UserId,
        U.Email     AS Email,
        COUNT(G.Id) AS totalGenerations
      FROM Users U
      LEFT JOIN Generations G ON G.UserId = U.Id
      GROUP BY U.Id, U.Email
      ORDER BY totalGenerations DESC;
    `;

    const result = await pool.request().query(q);
    const [
      totalUsersRS,
      totalGenerationsRS,
      todayGenerationsRS,
      topStylesRS,
      topUsersRS,
    ] = result.recordsets;

    res.ok({
      totalUsers: totalUsersRS?.[0]?.totalUsers || 0,
      totalGenerations: totalGenerationsRS?.[0]?.totalGenerations || 0,
      todayGenerations: todayGenerationsRS?.[0]?.todayGenerations || 0,
      topStyles: topStylesRS || [],
      topActiveUsers: topUsersRS || [],
    });
  })
);

/**
 * 2?? Danh s?ch user (c? ph?n trang, l?c)
 * GET /api/admin/users
 */
router.get(
  "/users",
  asyncHandler(async (req, res) => {
    let { page = 1, pageSize = 20, search = "", role = "" } = req.query;
    page = Math.max(parseInt(page, 10) || 1, 1);
    pageSize = Math.min(Math.max(parseInt(pageSize, 10) || 20, 1), 100);

    const sanitizedSearch = search.trim();
    const normalizedRole = (role || "").trim().toLowerCase();

    const filters = [];
    if (sanitizedSearch) {
      filters.push("U.Email LIKE @Search");
    }
    if (normalizedRole && normalizedRole !== "all") {
      filters.push("LOWER(U.Role) = @Role");
    }

    const whereClause = filters.length ? `WHERE ${filters.join(" AND ")}` : "";
    const offset = (page - 1) * pageSize;

    const applyFilters = (request) => {
      if (sanitizedSearch) {
        request.input("Search", sql.NVarChar(191), `%${sanitizedSearch}%`);
      }
      if (normalizedRole && normalizedRole !== "all") {
        request.input("Role", sql.NVarChar(20), normalizedRole);
      }
      return request;
    };

    const pool = await getPool();

    const countResult = await applyFilters(pool.request()).query(
      `SELECT COUNT(*) AS total FROM Users U ${whereClause};`
    );
    const total = countResult.recordset?.[0]?.total || 0;

    const summaryResult = await applyFilters(pool.request()).query(
      `SELECT U.Role, COUNT(*) AS count FROM Users U ${whereClause} GROUP BY U.Role;`
    );
    const roleSummary = summaryResult.recordset.reduce((acc, row) => {
      const key = (row.Role || "unknown").toLowerCase();
      acc[key] = row.count;
      return acc;
    }, {});

    const listQuery = `
      SELECT U.Id, U.Email, U.Role, U.CreatedAt,
             COUNT(G.Id) AS GenerationCount,
             MAX(G.CreatedAt) AS LastGenerationAt
      FROM Users U
      LEFT JOIN Generations G ON G.UserId = U.Id
      ${whereClause}
      GROUP BY U.Id, U.Email, U.Role, U.CreatedAt
      ORDER BY U.CreatedAt DESC
      OFFSET ${offset} ROWS
      FETCH NEXT ${pageSize} ROWS ONLY;
    `;

    const listResult = await applyFilters(pool.request()).query(listQuery);
    res.ok({
      page,
      pageSize,
      total,
      roleSummary,
      items: listResult.recordset || [],
    });
  })
);

/**
 * 3?? C?p nh?t role user
 * PATCH /api/admin/users/:id/role
 * body: { role: "admin" | "user" }
 */
router.patch(
  "/users/:id/role",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { role } = req.body || {};

    if (!role || !["admin", "user"].includes(role)) {
      return res.status(400).json({
        ok: false,
        message: "Role kh?ng h?p l? (admin | user)",
      });
    }

    const pool = await getPool();

    const updateResult = await pool
      .request()
      .input("Id", sql.BigInt, Number(id))
      .input("Role", sql.NVarChar(20), role)
      .query(`
        UPDATE Users
        SET Role = @Role
        WHERE Id = @Id;
      `);

    if (updateResult.rowsAffected[0] === 0) {
      return res.status(404).json({
        ok: false,
        message: "Kh?ng t?m th?y user",
      });
    }

    const selectResult = await pool
      .request()
      .input("Id", sql.BigInt, Number(id))
      .query(`
        SELECT Id, Email, Role, CreatedAt
        FROM Users
        WHERE Id = @Id;
      `);

    const user = selectResult.recordset[0];

    res.ok({ user });
  })
);

/**
 * 3b) Th?m m?i user (admin t?o)
 * POST /api/admin/users
 */
router.post(
  "/users",
  asyncHandler(async (req, res) => {
    const { email, password, role = "user" } = req.body || {};

    if (!email || !password) {
      return res
        .status(400)
        .json({ ok: false, message: "Email v? m?t kh?u kh?ng ???c ?? tr?ng" });
    }
    if (!["admin", "user"].includes(role)) {
      return res.status(400).json({
        ok: false,
        message: "Role kh?ng h?p l? (admin | user)",
      });
    }

    const pool = await getPool();

    const existsResult = await pool
      .request()
      .input("Email", sql.NVarChar(191), email)
      .query("SELECT Id FROM Users WHERE Email = @Email;");
    if (existsResult.recordset?.length) {
      return res
        .status(409)
        .json({ ok: false, message: "Email ?? t?n t?i" });
    }

    const hash = await bcrypt.hash(password, 10);

    const insertResult = await pool
      .request()
      .input("Email", sql.NVarChar(191), email)
      .input("PasswordHash", sql.NVarChar(255), hash)
      .input("Role", sql.NVarChar(20), role)
      .query(`
        INSERT INTO Users (Email, PasswordHash, Role, CreatedAt)
        OUTPUT INSERTED.Id, INSERTED.Email, INSERTED.Role, INSERTED.CreatedAt
        VALUES (@Email, @PasswordHash, @Role, SYSDATETIME());
      `);

    const user = insertResult.recordset?.[0];
    res.ok({ user });
  })
);

/**
 * 3c) C?p nh?t email / role / m?t kh?u user
 * PUT /api/admin/users/:id
 */
router.put(
  "/users/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { email, password, role } = req.body || {};
    const updates = [];

    if (email) {
      updates.push("Email = @Email");
    }
    if (role) {
      if (!["admin", "user"].includes(role)) {
        return res.status(400).json({
          ok: false,
          message: "Role kh?ng h?p l? (admin | user)",
        });
      }
      updates.push("Role = @Role");
    }
    if (password) {
      updates.push("PasswordHash = @PasswordHash");
    }

    if (!updates.length) {
      return res
        .status(400)
        .json({ ok: false, message: "Kh?ng c? tr??ng n?o ?? c?p nh?t" });
    }

    const pool = await getPool();
    const request = pool.request().input("Id", sql.BigInt, Number(id));

    if (email) {
      request.input("Email", sql.NVarChar(191), email);
    }
    if (role) {
      request.input("Role", sql.NVarChar(20), role);
    }
    if (password) {
      const hash = await bcrypt.hash(password, 10);
      request.input("PasswordHash", sql.NVarChar(255), hash);
    }

    const updateResult = await request.query(`
      UPDATE Users
      SET ${updates.join(", " )}
      WHERE Id = @Id;
    `);

    if (updateResult.rowsAffected[0] === 0) {
      return res.status(404).json({
        ok: false,
        message: "Kh?ng t?m th?y user",
      });
    }

    const selectResult = await pool
      .request()
      .input("Id", sql.BigInt, Number(id))
      .query(`
        SELECT Id, Email, Role, CreatedAt
        FROM Users
        WHERE Id = @Id;
      `);

    const user = selectResult.recordset?.[0] || null;
    res.ok({ user });
  })
);

/**
 * 4?? Xo? user (optional)
 * DELETE /api/admin/users/:id
 */
router.delete(
  "/users/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const pool = await getPool();
    const result = await pool
      .request()
      .input("Id", sql.BigInt, Number(id))
      .query("DELETE FROM Users WHERE Id = @Id;");

    res.ok({
      deleted: result.rowsAffected?.[0] || 0,
    });
  })
);

/**
 * 4b) T?ng h?p l??t sinh ?nh theo user (ph?n trang)
 * GET /api/admin/generations/by-user
 */
router.get(
  "/generations/by-user",
  asyncHandler(async (req, res) => {
    let { page = 1, pageSize = 5, search = "" } = req.query;
    page = Math.max(parseInt(page, 10) || 1, 1);
    pageSize = Math.min(Math.max(parseInt(pageSize, 10) || 5, 1), 100);
    const offset = (page - 1) * pageSize;
    const sanitizedSearch = search.trim();

    const whereClause = sanitizedSearch ? "WHERE U.Email LIKE @Search" : "";
    const applyFilters = (request) => {
      if (sanitizedSearch) {
        request.input("Search", sql.NVarChar(191), `%${sanitizedSearch}%`);
      }
      return request;
    };

    const pool = await getPool();

    const countResult = await applyFilters(pool.request()).query(`
      SELECT COUNT(*) AS total FROM (
        SELECT U.Id
        FROM Users U
        LEFT JOIN Generations G ON G.UserId = U.Id
        ${whereClause}
        GROUP BY U.Id
      ) AS Summary;
    `);
    const total = countResult.recordset?.[0]?.total || 0;

    const listResult = await applyFilters(pool.request())
      .input("Offset", sql.Int, offset)
      .input("PageSize", sql.Int, pageSize)
      .query(`
        SELECT *
        FROM (
          SELECT
            U.Id AS UserId,
            U.Email,
            U.Role,
            COUNT(G.Id) AS GenerationCount,
            MAX(G.CreatedAt) AS LastGenerationAt
          FROM Users U
          LEFT JOIN Generations G ON G.UserId = U.Id
          ${whereClause}
          GROUP BY U.Id, U.Email, U.Role
        ) AS Summary
        ORDER BY LastGenerationAt DESC, UserId DESC
        OFFSET @Offset ROWS
        FETCH NEXT @PageSize ROWS ONLY;
      `);

    res.ok({
      page,
      pageSize,
      total,
      items: listResult.recordset || [],
    });
  })
);

/**
 * 5?? Danh s?ch log sinh ?nh (Generations)
 * GET /api/admin/generations?userId=&style=&from=&to=&page=1&pageSize=20
 */
router.get(
  "/generations",
  asyncHandler(async (req, res) => {
    let { page = 1, pageSize = 20, userId, style, from, to } = req.query;
    page = Math.max(parseInt(page, 10) || 1, 1);
    pageSize = Math.min(Math.max(parseInt(pageSize, 10) || 20, 1), 100);
    const offset = (page - 1) * pageSize;

    const pool = await getPool();

    const filters = [];
    const params = [];

    const addParam = (name, type, value) => {
      params.push({ name, type, value });
      return name;
    };

    if (userId) {
      const numericUserId = Number(userId);
      if (!Number.isNaN(numericUserId)) {
        filters.push("G.UserId = @UserId");
        addParam("UserId", sql.BigInt, numericUserId);
      }
    }

    if (style) {
      filters.push("G.Style = @Style");
      addParam("Style", sql.NVarChar(200), style);
    }

    const parseDate = (value) => {
      const d = new Date(value);
      return Number.isNaN(d.getTime()) ? null : d;
    };

    const fromDate = from ? parseDate(from) : null;
    if (fromDate) {
      filters.push("G.CreatedAt >= @FromDate");
      addParam("FromDate", sql.DateTime2, fromDate);
    }

    const toDate = to ? parseDate(to) : null;
    if (toDate) {
      filters.push("G.CreatedAt <= @ToDate");
      addParam("ToDate", sql.DateTime2, toDate);
    }

    const where = filters.length ? `WHERE ${filters.join(" AND ")}` : "";

    const applyParams = (request) => {
      params.forEach((p) => request.input(p.name, p.type, p.value));
      return request;
    };

    const countQ = `
      SELECT COUNT(*) AS total
      FROM Generations G
      ${where};
    `;

    const countResult = await applyParams(pool.request()).query(countQ);
    const total = countResult.recordset?.[0]?.total || 0;

    const listQ = `
      SELECT
        G.Id,
        G.UserId,
        U.Email,
        G.InputDesc,
        G.InputImageUrl,
        G.OutputImageUrl,
        G.Style,
        G.Palette,
        G.PromptUsed,
        G.CreatedAt
      FROM Generations G
      INNER JOIN Users U ON U.Id = G.UserId
      ${where}
      ORDER BY G.CreatedAt DESC
      OFFSET @Offset ROWS
      FETCH NEXT @PageSize ROWS ONLY;
    `;

    const listResult = await applyParams(pool.request())
      .input("Offset", sql.Int, offset)
      .input("PageSize", sql.Int, pageSize)
      .query(listQ);

    res.ok({
      page,
      pageSize,
      total,
      items: listResult.recordset || [],
    });
  })
);

/**
 * 6?? Chi ti?t 1 Generation
 * GET /api/admin/generations/:id
 */
router.get(
  "/generations/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const pool = await getPool();
    const q = `
      SELECT
        G.Id,
        G.UserId,
        U.Email,
        G.InputDesc,
        G.InputImageUrl,
        G.OutputImageUrl,
        G.Style,
        G.Palette,
        G.Seed,
        G.PromptUsed,
        G.CreatedAt,
        G.Description
      FROM Generations G
      INNER JOIN Users U ON U.Id = G.UserId
      WHERE G.Id = @Id;
    `;

    const result = await pool
      .request()
      .input("Id", sql.BigInt, Number(id))
      .query(q);

    const row = result.recordset?.[0];
    if (!row) {
      return res
        .status(404)
        .json({ ok: false, message: "Kh?ng t?m th?y b?n ghi" });
    }

    res.ok({ item: row });
  })
);

/**
 * 7?? Xo? 1 Generation
 * DELETE /api/admin/generations/:id
 */
router.delete(
  "/generations/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const pool = await getPool();
    const result = await pool
      .request()
      .input("Id", sql.BigInt, Number(id))
      .query("DELETE FROM Generations WHERE Id = @Id;");

    res.ok({
      deleted: result.rowsAffected?.[0] || 0,
    });
  })
);

/**
 * 8?? Xu?t PDF cho 1 Generation
 * GET /api/admin/generations/:id/export-pdf
 */
router.get(
  "/generations/:id/export-pdf",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const pool = await getPool();
    const q = `
      SELECT
        G.Id,
        G.UserId,
        U.Email,
        G.InputDesc,
        G.InputImageUrl,
        G.OutputImageUrl,
        G.Style,
        G.Palette,
        G.PromptUsed,
        G.CreatedAt,
        G.Description
      FROM Generations G
      INNER JOIN Users U ON U.Id = G.UserId
      WHERE G.Id = @Id;
    `;

    const result = await pool
      .request()
      .input("Id", sql.BigInt, Number(id))
      .query(q);

    const row = result.recordset?.[0];
    if (!row) {
      return res
        .status(404)
        .json({ ok: false, message: "Kh?ng t?m th?y b?n ghi" });
    }

    const createdAt =
      row.CreatedAt instanceof Date
        ? row.CreatedAt
        : new Date(row.CreatedAt || Date.now());

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="generation-${row.Id}.pdf"`
    );

    const doc = new PDFDocument({ margin: 40 });
    doc.pipe(res);

    doc.fontSize(18).text("B?O C?O PH??NG ?N NGO?I TH?T", {
      align: "center",
    });
    doc.moveDown();

    doc.fontSize(11);
    doc.text(`M? b?n ghi: ${row.Id}`);
    doc.text(`Ng??i d?ng: ${row.Email}`);
    doc.text(`Ng?y t?o: ${createdAt.toISOString()}`);
    doc.moveDown();

    doc.text("M? t? ??u v?o:", { underline: true });
    doc.text(row.InputDesc || "Kh?ng c?");
    doc.moveDown();

    doc.text("Phong c?ch:", { underline: true });
    doc.text(row.Style || "Kh?ng r?");
    doc.moveDown();

    doc.text("B?ng m?u:", { underline: true });
    doc.text(row.Palette || "Kh?ng r?");
    doc.moveDown();

    doc.text("Prompt AI:", { underline: true });
    doc.text(row.PromptUsed || "Kh?ng l?u");
    doc.moveDown();

    if (row.InputImageUrl) {
      doc.addPage();
      doc.fontSize(14).text("?nh hi?n tr?ng", { align: "center" });
      doc.moveDown();
      try {
        doc.image(row.InputImageUrl, {
          fit: [500, 400],
          align: "center",
          valign: "center",
        });
      } catch (err) {
        doc.fontSize(11).text("Kh?ng t?i ???c ?nh hi?n tr?ng (URL kh?ng h?p l?)");
      }
    }

    if (row.OutputImageUrl) {
      doc.addPage();
      doc.fontSize(14).text("?nh g?i ? ngo?i th?t", { align: "center" });
      doc.moveDown();
      try {
        doc.image(row.OutputImageUrl, {
          fit: [500, 400],
          align: "center",
          valign: "center",
        });
      } catch (err) {
        doc.fontSize(11).text("Kh?ng t?i ???c ?nh g?i ? (URL kh?ng h?p l?)");
      }
    }

    doc.end();
  })
);

/**
 * 9) Quản lý Thư viện Vùng miền
 * POST 
 * 
 */
router.post(
  "/library",
  upload.single("image"), // Nhận 1 file từ field 'image'
  asyncHandler(async (req, res) => {
    const { regionName, styleData, description } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ ok: false, message: "Vui lòng chọn ảnh mẫu nhà" });
    }

    // 1. Upload ảnh lên Cloudinary vào thư mục samples
    const cloudRes = await uploadBufferToCloudinary(req.file.buffer, 'exterior_ai/samples');
    const imageUrl = cloudRes.secure_url;

    // 2. Lưu thông tin vào Database
    const pool = await getPool();
    await pool.request()
      .input("RegionName", sql.NVarChar(50), regionName)
      .input("ImageUrl", sql.NVarChar(500), imageUrl)
      .input("StyleData", sql.NVarChar(sql.MAX), styleData)
      .input("Description", sql.NVarChar(sql.MAX), description)
      .query(`
        INSERT INTO RegionalLibrary (RegionName, ImageUrl, StyleData, Description, CreatedAt)
        VALUES (@RegionName, @ImageUrl, @StyleData, @Description, SYSDATETIME());
      `);

    res.ok({ message: "Đã thêm mẫu nhà vào thư viện thành công", imageUrl });
  })
);

/**
 * 10) Lấy danh sách mẫu nhà (Dành cho Admin quản lý)
 * GET /api/admin/library
 */
router.get(
  "/library",
  asyncHandler(async (req, res) => {
    const pool = await getPool();
    const result = await pool.request().query("SELECT * FROM RegionalLibrary ORDER BY CreatedAt DESC");
    res.ok({ items: result.recordset });
  })
);

/**
 * 11) Cập nhật mẫu nhà trong thư viện
 * PUT /api/admin/library/:id
 */
router.put(
  "/library/:id",
  upload.single("image"), // Optional: có thể upload ảnh mới hoặc giữ ảnh cũ
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { regionName, styleData, description } = req.body;
    
    const pool = await getPool();
    
    // Kiểm tra xem mẫu nhà có tồn tại không
    const checkResult = await pool.request()
      .input("Id", sql.Int, id)
      .query("SELECT * FROM RegionalLibrary WHERE Id = @Id");
    
    if (!checkResult.recordset || checkResult.recordset.length === 0) {
      return res.status(404).json({ ok: false, message: "Không tìm thấy mẫu nhà" });
    }
    
    const existingItem = checkResult.recordset[0];
    let imageUrl = existingItem.ImageUrl; // Giữ ảnh cũ nếu không upload ảnh mới
    
    // Nếu có upload ảnh mới, upload lên Cloudinary
    if (req.file) {
      const cloudRes = await uploadBufferToCloudinary(req.file.buffer, 'exterior_ai/samples');
      imageUrl = cloudRes.secure_url;
    }
    
    // Cập nhật thông tin
    await pool.request()
      .input("Id", sql.Int, id)
      .input("RegionName", sql.NVarChar(50), regionName || existingItem.RegionName)
      .input("ImageUrl", sql.NVarChar(500), imageUrl)
      .input("StyleData", sql.NVarChar(sql.MAX), styleData !== undefined ? styleData : existingItem.StyleData)
      .input("Description", sql.NVarChar(sql.MAX), description !== undefined ? description : existingItem.Description)
      .query(`
        UPDATE RegionalLibrary
        SET RegionName = @RegionName,
            ImageUrl = @ImageUrl,
            StyleData = @StyleData,
            Description = @Description
        WHERE Id = @Id;
      `);
    
    // Lấy lại thông tin đã cập nhật
    const updatedResult = await pool.request()
      .input("Id", sql.Int, id)
      .query("SELECT * FROM RegionalLibrary WHERE Id = @Id");
    
    res.ok({ 
      message: "Đã cập nhật mẫu nhà thành công",
      item: updatedResult.recordset[0]
    });
  })
);

/**
 * 12) Xóa mẫu nhà khỏi thư viện
 * DELETE /api/admin/library/:id
 */
router.delete(
  "/library/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const pool = await getPool();
    const result = await pool.request()
      .input("Id", sql.Int, id)
      .query("DELETE FROM RegionalLibrary WHERE Id = @Id");

    res.ok({ deleted: result.rowsAffected[0] });
  })
);

// ============================================
// PAINT BRANDS MANAGEMENT (Mix & Match Feature)
// ============================================

/**
 * 13) Lấy danh sách thương hiệu sơn
 * GET /api/admin/paint-brands
 */
router.get(
  "/paint-brands",
  asyncHandler(async (req, res) => {
    const pool = await getPool();
    const result = await pool.request().query(`
      SELECT * FROM PaintBrands
      ORDER BY DisplayOrder, BrandName
    `);

    res.ok({ items: result.recordset || [] });
  })
);

/**
 * 14) Thêm thương hiệu sơn mới
 * POST /api/admin/paint-brands
 * Body (FormData): brandName, description, websiteUrl, displayOrder, logo (file)
 */
router.post(
  "/paint-brands",
  upload.single("logo"),
  asyncHandler(async (req, res) => {
    const { brandName, description, websiteUrl, displayOrder = 0 } = req.body;

    if (!brandName || !brandName.trim()) {
      return res.status(400).json({
        ok: false,
        message: "Tên thương hiệu không được để trống"
      });
    }

    const pool = await getPool();

    // Kiểm tra trùng tên
    const checkExist = await pool.request()
      .input("BrandName", sql.NVarChar(100), brandName.trim())
      .query("SELECT Id FROM PaintBrands WHERE BrandName = @BrandName");

    if (checkExist.recordset.length > 0) {
      return res.status(400).json({
        ok: false,
        message: "Thương hiệu này đã tồn tại"
      });
    }

    // Upload logo (nếu có)
    let logoUrl = null;
    if (req.file) {
      const cloudRes = await uploadBufferToCloudinary(req.file.buffer, 'exterior_ai/brands');
      logoUrl = cloudRes.secure_url;
    }

    // Thêm vào database
    const result = await pool.request()
      .input("BrandName", sql.NVarChar(100), brandName.trim())
      .input("BrandLogoUrl", sql.NVarChar(500), logoUrl)
      .input("Description", sql.NVarChar(sql.MAX), description || null)
      .input("WebsiteUrl", sql.NVarChar(500), websiteUrl || null)
      .input("DisplayOrder", sql.Int, parseInt(displayOrder) || 0)
      .query(`
        INSERT INTO PaintBrands (BrandName, BrandLogoUrl, Description, WebsiteUrl, DisplayOrder)
        OUTPUT INSERTED.*
        VALUES (@BrandName, @BrandLogoUrl, @Description, @WebsiteUrl, @DisplayOrder)
      `);

    res.ok({
      message: "Đã thêm thương hiệu sơn thành công",
      item: result.recordset[0]
    });
  })
);

/**
 * 15) Cập nhật thương hiệu sơn
 * PUT /api/admin/paint-brands/:id
 */
router.put(
  "/paint-brands/:id",
  upload.single("logo"),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { brandName, description, websiteUrl, displayOrder, isActive } = req.body;

    const pool = await getPool();

    // Kiểm tra tồn tại
    const checkResult = await pool.request()
      .input("Id", sql.Int, id)
      .query("SELECT * FROM PaintBrands WHERE Id = @Id");

    if (!checkResult.recordset || checkResult.recordset.length === 0) {
      return res.status(404).json({ ok: false, message: "Không tìm thấy thương hiệu" });
    }

    const existing = checkResult.recordset[0];

    // Kiểm tra trùng tên (nếu đổi tên)
    if (brandName && brandName.trim() !== existing.BrandName) {
      const checkDuplicate = await pool.request()
        .input("BrandName", sql.NVarChar(100), brandName.trim())
        .input("Id", sql.Int, id)
        .query("SELECT Id FROM PaintBrands WHERE BrandName = @BrandName AND Id != @Id");

      if (checkDuplicate.recordset.length > 0) {
        return res.status(400).json({
          ok: false,
          message: "Tên thương hiệu đã tồn tại"
        });
      }
    }

    // Upload logo mới (nếu có)
    let logoUrl = existing.BrandLogoUrl;
    if (req.file) {
      const cloudRes = await uploadBufferToCloudinary(req.file.buffer, 'exterior_ai/brands');
      logoUrl = cloudRes.secure_url;
    }

    // Cập nhật
    await pool.request()
      .input("Id", sql.Int, id)
      .input("BrandName", sql.NVarChar(100), brandName?.trim() || existing.BrandName)
      .input("BrandLogoUrl", sql.NVarChar(500), logoUrl)
      .input("Description", sql.NVarChar(sql.MAX), description !== undefined ? description : existing.Description)
      .input("WebsiteUrl", sql.NVarChar(500), websiteUrl !== undefined ? websiteUrl : existing.WebsiteUrl)
      .input("DisplayOrder", sql.Int, displayOrder !== undefined ? parseInt(displayOrder) : existing.DisplayOrder)
      .input("IsActive", sql.Bit, isActive !== undefined ? (isActive === 'true' || isActive === true ? 1 : 0) : existing.IsActive)
      .query(`
        UPDATE PaintBrands
        SET BrandName = @BrandName,
            BrandLogoUrl = @BrandLogoUrl,
            Description = @Description,
            WebsiteUrl = @WebsiteUrl,
            DisplayOrder = @DisplayOrder,
            IsActive = @IsActive,
            UpdatedAt = SYSDATETIME()
        WHERE Id = @Id
      `);

    // Lấy lại thông tin đã cập nhật
    const updatedResult = await pool.request()
      .input("Id", sql.Int, id)
      .query("SELECT * FROM PaintBrands WHERE Id = @Id");

    res.ok({
      message: "Đã cập nhật thương hiệu thành công",
      item: updatedResult.recordset[0]
    });
  })
);

/**
 * 16) Xóa thương hiệu sơn
 * DELETE /api/admin/paint-brands/:id
 * Note: Sẽ xóa CASCADE tất cả màu sơn của thương hiệu này
 */
router.delete(
  "/paint-brands/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const pool = await getPool();

    // Kiểm tra số lượng màu sơn của brand này
    const colorCount = await pool.request()
      .input("BrandId", sql.Int, id)
      .query("SELECT COUNT(*) AS count FROM PaintColors WHERE BrandId = @BrandId");

    const count = colorCount.recordset[0]?.count || 0;

    // Xóa brand (sẽ CASCADE xóa tất cả colors)
    const result = await pool.request()
      .input("Id", sql.Int, id)
      .query("DELETE FROM PaintBrands WHERE Id = @Id");

    res.ok({
      deleted: result.rowsAffected[0],
      message: count > 0
        ? `Đã xóa thương hiệu và ${count} màu sơn liên quan`
        : "Đã xóa thương hiệu"
    });
  })
);

// ============================================
// PAINT COLORS MANAGEMENT (Mix & Match Feature)
// ============================================

/**
 * 17) Lấy danh sách màu sơn (có filter)
 * GET /api/admin/paint-colors?brandId=&componentType=
 */
router.get(
  "/paint-colors",
  asyncHandler(async (req, res) => {
    const { brandId, componentType } = req.query;
    const pool = await getPool();

    let query = `
      SELECT c.*, b.BrandName
      FROM PaintColors c
      INNER JOIN PaintBrands b ON c.BrandId = b.Id
      WHERE 1=1
    `;

    const request = pool.request();

    if (brandId) {
      query += " AND c.BrandId = @BrandId";
      request.input("BrandId", sql.Int, parseInt(brandId));
    }

    if (componentType) {
      query += " AND c.ComponentType = @ComponentType";
      request.input("ComponentType", sql.NVarChar(50), componentType);
    }

    query += " ORDER BY b.BrandName, c.ColorName";

    const result = await request.query(query);

    res.ok({ items: result.recordset || [] });
  })
);

/**
 * 18) Thêm màu sơn mới
 * POST /api/admin/paint-colors
 * Body (FormData): brandId, colorName, colorCode, hexCode, componentType, description, swatch (file)
 */
router.post(
  "/paint-colors",
  upload.single("swatch"),
  asyncHandler(async (req, res) => {
    const { brandId, colorName, colorCode, hexCode, componentType, description } = req.body;

    // Validation
    if (!brandId || !colorName || !colorCode || !hexCode || !componentType) {
      return res.status(400).json({
        ok: false,
        message: "Thiếu thông tin bắt buộc (brandId, colorName, colorCode, hexCode, componentType)"
      });
    }

    // Validate HEX code format
    if (!/^#[0-9A-Fa-f]{6}$/.test(hexCode)) {
      return res.status(400).json({
        ok: false,
        message: "Mã HEX không hợp lệ (phải có dạng #RRGGBB, VD: #FFFFFF)"
      });
    }

    // Validate component type
    const validTypes = ['wall', 'roof', 'column', 'all'];
    if (!validTypes.includes(componentType)) {
      return res.status(400).json({
        ok: false,
        message: `ComponentType phải là một trong: ${validTypes.join(', ')}`
      });
    }

    const pool = await getPool();

    // Kiểm tra brand có tồn tại không
    const brandCheck = await pool.request()
      .input("BrandId", sql.Int, parseInt(brandId))
      .query("SELECT Id FROM PaintBrands WHERE Id = @BrandId");

    if (brandCheck.recordset.length === 0) {
      return res.status(400).json({
        ok: false,
        message: "Thương hiệu không tồn tại"
      });
    }

    // Upload swatch image (nếu có)
    let imageUrl = null;
    if (req.file) {
      const cloudRes = await uploadBufferToCloudinary(req.file.buffer, 'exterior_ai/colors');
      imageUrl = cloudRes.secure_url;
    }

    // Thêm vào database
    const result = await pool.request()
      .input("BrandId", sql.Int, parseInt(brandId))
      .input("ColorName", sql.NVarChar(200), colorName.trim())
      .input("ColorCode", sql.NVarChar(50), colorCode.trim())
      .input("HexCode", sql.NVarChar(7), hexCode.toUpperCase())
      .input("ComponentType", sql.NVarChar(50), componentType)
      .input("ImageUrl", sql.NVarChar(500), imageUrl)
      .input("Description", sql.NVarChar(sql.MAX), description || null)
      .query(`
        INSERT INTO PaintColors (BrandId, ColorName, ColorCode, HexCode, ComponentType, ImageUrl, Description)
        OUTPUT INSERTED.*
        VALUES (@BrandId, @ColorName, @ColorCode, @HexCode, @ComponentType, @ImageUrl, @Description)
      `);

    res.ok({
      message: "Đã thêm màu sơn thành công",
      item: result.recordset[0]
    });
  })
);

/**
 * 19) Cập nhật màu sơn
 * PUT /api/admin/paint-colors/:id
 */
router.put(
  "/paint-colors/:id",
  upload.single("swatch"),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { brandId, colorName, colorCode, hexCode, componentType, description, isActive } = req.body;

    const pool = await getPool();

    // Kiểm tra tồn tại
    const checkResult = await pool.request()
      .input("Id", sql.Int, id)
      .query("SELECT * FROM PaintColors WHERE Id = @Id");

    if (!checkResult.recordset || checkResult.recordset.length === 0) {
      return res.status(404).json({ ok: false, message: "Không tìm thấy màu sơn" });
    }

    const existing = checkResult.recordset[0];

    // Validate HEX code (nếu có thay đổi)
    if (hexCode && !/^#[0-9A-Fa-f]{6}$/.test(hexCode)) {
      return res.status(400).json({
        ok: false,
        message: "Mã HEX không hợp lệ"
      });
    }

    // Validate component type (nếu có thay đổi)
    const validTypes = ['wall', 'roof', 'column', 'all'];
    if (componentType && !validTypes.includes(componentType)) {
      return res.status(400).json({
        ok: false,
        message: `ComponentType phải là một trong: ${validTypes.join(', ')}`
      });
    }

    // Kiểm tra brand (nếu đổi brand)
    if (brandId && parseInt(brandId) !== existing.BrandId) {
      const brandCheck = await pool.request()
        .input("BrandId", sql.Int, parseInt(brandId))
        .query("SELECT Id FROM PaintBrands WHERE Id = @BrandId");

      if (brandCheck.recordset.length === 0) {
        return res.status(400).json({
          ok: false,
          message: "Thương hiệu không tồn tại"
        });
      }
    }

    // Upload swatch mới (nếu có)
    let imageUrl = existing.ImageUrl;
    if (req.file) {
      const cloudRes = await uploadBufferToCloudinary(req.file.buffer, 'exterior_ai/colors');
      imageUrl = cloudRes.secure_url;
    }

    // Cập nhật
    await pool.request()
      .input("Id", sql.Int, id)
      .input("BrandId", sql.Int, brandId ? parseInt(brandId) : existing.BrandId)
      .input("ColorName", sql.NVarChar(200), colorName?.trim() || existing.ColorName)
      .input("ColorCode", sql.NVarChar(50), colorCode?.trim() || existing.ColorCode)
      .input("HexCode", sql.NVarChar(7), hexCode ? hexCode.toUpperCase() : existing.HexCode)
      .input("ComponentType", sql.NVarChar(50), componentType || existing.ComponentType)
      .input("ImageUrl", sql.NVarChar(500), imageUrl)
      .input("Description", sql.NVarChar(sql.MAX), description !== undefined ? description : existing.Description)
      .input("IsActive", sql.Bit, isActive !== undefined ? (isActive === 'true' || isActive === true ? 1 : 0) : existing.IsActive)
      .query(`
        UPDATE PaintColors
        SET BrandId = @BrandId,
            ColorName = @ColorName,
            ColorCode = @ColorCode,
            HexCode = @HexCode,
            ComponentType = @ComponentType,
            ImageUrl = @ImageUrl,
            Description = @Description,
            IsActive = @IsActive,
            UpdatedAt = SYSDATETIME()
        WHERE Id = @Id
      `);

    // Lấy lại thông tin đã cập nhật
    const updatedResult = await pool.request()
      .input("Id", sql.Int, id)
      .query("SELECT * FROM PaintColors WHERE Id = @Id");

    res.ok({
      message: "Đã cập nhật màu sơn thành công",
      item: updatedResult.recordset[0]
    });
  })
);

/**
 * 20) Xóa màu sơn
 * DELETE /api/admin/paint-colors/:id
 * Note: Không thể xóa nếu màu đang được dùng trong MixMatchProjects (ON DELETE NO ACTION)
 */
router.delete(
  "/paint-colors/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const pool = await getPool();

    try {
      const result = await pool.request()
        .input("Id", sql.Int, id)
        .query("DELETE FROM PaintColors WHERE Id = @Id");

      res.ok({
        deleted: result.rowsAffected[0],
        message: "Đã xóa màu sơn thành công"
      });
    } catch (err) {
      // Nếu lỗi foreign key constraint (màu đang được dùng)
      if (err.message.includes('REFERENCE') || err.message.includes('FK_MixMatch')) {
        return res.status(400).json({
          ok: false,
          message: "Không thể xóa màu sơn này vì đang được sử dụng trong các dự án Mix & Match"
        });
      }
      throw err;
    }
  })
);

module.exports = router;
