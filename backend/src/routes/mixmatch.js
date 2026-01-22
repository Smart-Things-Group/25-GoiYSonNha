const express = require("express");
const multer = require("multer");
const crypto = require("crypto");
require("dotenv").config();
const { uploadBufferToCloudinary } = require("../services/cloud");
const { generateImageExternal } = require("../services/external-ai");
const { getPool, sql } = require("../db");
const auth = require("../middlewares/auth");

// Khởi tạo Express Router
const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

/**
 * 1️⃣ GET /api/mixmatch/regional-styles
 * Lấy danh sách phong cách vùng miền từ RegionalLibrary
 * PUBLIC - Không cần auth
 */
router.get("/regional-styles", async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool.request().query(`
      SELECT Id, RegionName, ImageUrl, Description, CreatedAt
      FROM RegionalLibrary
      ORDER BY CreatedAt DESC
    `);

    res.json({
      ok: true,
      items: result.recordset || [],
    });
  } catch (err) {
    console.error("[MixMatch] Get regional styles error:", err);
    res.status(500).json({
      ok: false,
      message: "Lỗi lấy danh sách phong cách vùng miền",
      detail: err.message,
    });
  }
});

/**
 * 2️⃣ GET /api/mixmatch/paint-colors?componentType=wall&brandId=1
 * Lấy danh sách màu sơn theo component type và brand (optional)
 * PUBLIC - Không cần auth
 */
router.get("/paint-colors", async (req, res) => {
  try {
    const { componentType, brandId } = req.query;
    const pool = await getPool();

    let query = `
      SELECT
        c.Id, c.ColorName, c.ColorCode, c.HexCode, c.ComponentType,
        c.ImageUrl, c.Description,
        b.Id AS BrandId, b.BrandName, b.BrandLogoUrl
      FROM PaintColors c
      INNER JOIN PaintBrands b ON c.BrandId = b.Id
      WHERE c.IsActive = 1 AND b.IsActive = 1
    `;

    const request = pool.request();

    // Filter by component type (wall/roof/column)
    // Note: componentType='wall' sẽ lấy cả màu 'wall' và 'all'
    if (componentType && componentType !== "all") {
      query += " AND (c.ComponentType = @ComponentType OR c.ComponentType = 'all')";
      request.input("ComponentType", sql.NVarChar(50), componentType);
    }

    // Filter by brand (optional)
    if (brandId) {
      query += " AND c.BrandId = @BrandId";
      request.input("BrandId", sql.Int, parseInt(brandId));
    }

    query += " ORDER BY b.DisplayOrder, b.BrandName, c.ColorName";

    const result = await request.query(query);

    res.json({
      ok: true,
      items: result.recordset || [],
    });
  } catch (err) {
    console.error("[MixMatch] Get paint colors error:", err);
    res.status(500).json({
      ok: false,
      message: "Lỗi lấy danh sách màu sơn",
      detail: err.message,
    });
  }
});

/**
 * 3️⃣ GET /api/mixmatch/paint-brands
 * Lấy danh sách thương hiệu sơn (để filter)
 * PUBLIC - Không cần auth
 */
router.get("/paint-brands", async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool.request().query(`
      SELECT Id, BrandName, BrandLogoUrl, Description
      FROM PaintBrands
      WHERE IsActive = 1
      ORDER BY DisplayOrder, BrandName
    `);

    res.json({
      ok: true,
      items: result.recordset || [],
    });
  } catch (err) {
    console.error("[MixMatch] Get paint brands error:", err);
    res.status(500).json({
      ok: false,
      message: "Lỗi lấy danh sách thương hiệu sơn",
      detail: err.message,
    });
  }
});

/**
 * 4️⃣ POST /api/mixmatch/generate
 * Tạo ảnh với màu sơn tùy chỉnh
 * AUTHENTICATED - Cần token
 *
 * Body (FormData):
 * - house: File (ảnh nhà thô, required)
 * - regionalStyleId: number (optional)
 * - wallColorId: number (optional)
 * - roofColorId: number (optional)
 * - columnColorId: number (optional)
 * - customNotes: string (optional)
 */
router.post("/generate", auth, upload.single("house"), async (req, res) => {
  try {
    // Lấy UserId từ token
    const userId = req.user?.id || req.user?.userId;
    if (!userId) {
      return res.status(401).json({
        ok: false,
        message: "Không thể xác định người dùng. Vui lòng đăng nhập lại.",
      });
    }

    const { regionalStyleId, wallColorId, roofColorId, columnColorId, customNotes } = req.body;
    const file = req.file;

    // Validate: Phải có ảnh nhà thô
    if (!file) {
      return res.status(400).json({
        ok: false,
        message: "Thiếu ảnh nhà thô. Vui lòng upload ảnh.",
      });
    }

    // Validate: Phải chọn ít nhất 1 màu
    if (!wallColorId && !roofColorId && !columnColorId) {
      return res.status(400).json({
        ok: false,
        message: "Vui lòng chọn ít nhất 1 màu sơn cho tường, mái hoặc cột.",
      });
    }

    console.log("[MixMatch] Generate request:", {
      userId,
      regionalStyleId,
      wallColorId,
      roofColorId,
      columnColorId,
      fileSize: file.size,
    });

    const pool = await getPool();

    // Upload ảnh nhà thô lên Cloudinary
    const houseUpload = await uploadBufferToCloudinary(
      file.buffer,
      "exterior_ai/mixmatch/inputs"
    );

    console.log("[MixMatch] House image uploaded:", houseUpload.secure_url);

    // Lấy thông tin các màu đã chọn
    const colorIds = [wallColorId, roofColorId, columnColorId]
      .filter((id) => id)
      .map((id) => parseInt(id));

    let wallColor = null;
    let roofColor = null;
    let columnColor = null;

    if (colorIds.length > 0) {
      const colorQuery = `
        SELECT Id, ColorName, HexCode, ComponentType, ColorCode,
               (SELECT BrandName FROM PaintBrands WHERE Id = BrandId) AS BrandName
        FROM PaintColors
        WHERE Id IN (${colorIds.join(",")})
      `;

      const colorResult = await pool.request().query(colorQuery);
      const colors = colorResult.recordset;

      wallColor = colors.find((c) => c.Id == wallColorId);
      roofColor = colors.find((c) => c.Id == roofColorId);
      columnColor = colors.find((c) => c.Id == columnColorId);

      console.log("[MixMatch] Selected colors:", {
        wall: wallColor?.ColorName,
        roof: roofColor?.ColorName,
        column: columnColor?.ColorName,
      });
    }

    // Lấy thông tin phong cách vùng miền (nếu có)
    let regionalStyle = null;
    if (regionalStyleId) {
      const styleResult = await pool.request()
        .input("StyleId", sql.Int, parseInt(regionalStyleId))
        .query("SELECT * FROM RegionalLibrary WHERE Id = @StyleId");

      regionalStyle = styleResult.recordset[0];
      console.log("[MixMatch] Regional style:", regionalStyle?.RegionName);
    }

    // Build AI prompt với HEX codes thực tế
    const prompt = buildMixMatchPrompt({
      wallColor,
      roofColor,
      columnColor,
      regionalStyle,
      customNotes,
    });

    console.log("[MixMatch] AI Prompt length:", prompt.length);

    // Gọi AI service để tạo ảnh
    let outputImageUrl = null;
    try {
      const imageBuffer = await generateImageExternal(prompt, {
        width: 1024,
        height: 1024,
      });

      // Upload kết quả lên Cloudinary
      const outputUpload = await uploadBufferToCloudinary(
        imageBuffer,
        "exterior_ai/mixmatch/outputs"
      );
      outputImageUrl = outputUpload.secure_url;

      console.log("[MixMatch] Output image uploaded:", outputImageUrl);
    } catch (aiError) {
      console.error("[MixMatch] AI generation error:", aiError);
      // Tiếp tục lưu vào DB với status 'failed'
    }

    // Lưu project vào database
    const insertResult = await pool.request()
      .input("UserId", sql.BigInt, userId)
      .input("InputImageUrl", sql.NVarChar(500), houseUpload.secure_url)
      .input("OutputImageUrl", sql.NVarChar(500), outputImageUrl)
      .input("RegionalStyleId", sql.Int, regionalStyleId ? parseInt(regionalStyleId) : null)
      .input("WallColorId", sql.Int, wallColorId ? parseInt(wallColorId) : null)
      .input("RoofColorId", sql.Int, roofColorId ? parseInt(roofColorId) : null)
      .input("ColumnColorId", sql.Int, columnColorId ? parseInt(columnColorId) : null)
      .input("CustomNotes", sql.NVarChar(sql.MAX), customNotes || null)
      .input("PromptUsed", sql.NVarChar(sql.MAX), prompt)
      .input("Status", sql.NVarChar(50), outputImageUrl ? "completed" : "failed")
      .query(`
        INSERT INTO MixMatchProjects
        (UserId, InputImageUrl, OutputImageUrl, RegionalStyleId, WallColorId, RoofColorId, ColumnColorId, CustomNotes, PromptUsed, Status, CompletedAt)
        OUTPUT INSERTED.Id
        VALUES
        (@UserId, @InputImageUrl, @OutputImageUrl, @RegionalStyleId, @WallColorId, @RoofColorId, @ColumnColorId, @CustomNotes, @PromptUsed, @Status, ${outputImageUrl ? "SYSDATETIME()" : "NULL"})
      `);

    const projectId = insertResult.recordset[0].Id;

    console.log("[MixMatch] Project saved with ID:", projectId);

    // Trả về kết quả
    res.json({
      ok: true,
      data: {
        projectId,
        inputImageUrl: houseUpload.secure_url,
        outputImageUrl: outputImageUrl,
        status: outputImageUrl ? "completed" : "failed",
        colors: {
          wall: wallColor
            ? {
                id: wallColor.Id,
                name: wallColor.ColorName,
                hexCode: wallColor.HexCode,
                brand: wallColor.BrandName,
              }
            : null,
          roof: roofColor
            ? {
                id: roofColor.Id,
                name: roofColor.ColorName,
                hexCode: roofColor.HexCode,
                brand: roofColor.BrandName,
              }
            : null,
          column: columnColor
            ? {
                id: columnColor.Id,
                name: columnColor.ColorName,
                hexCode: columnColor.HexCode,
                brand: columnColor.BrandName,
              }
            : null,
        },
        regionalStyle: regionalStyle
          ? {
              id: regionalStyle.Id,
              name: regionalStyle.RegionName,
            }
          : null,
      },
      message: outputImageUrl
        ? "Tạo thiết kế thành công!"
        : "Upload ảnh thành công nhưng AI generation thất bại. Vui lòng thử lại.",
    });
  } catch (err) {
    console.error("[MixMatch] Generate error:", err);
    res.status(500).json({
      ok: false,
      message: "Lỗi tạo thiết kế Mix & Match",
      detail: err.message,
    });
  }
});

/**
 * 5️⃣ GET /api/mixmatch/history
 * Lấy lịch sử dự án Mix & Match của user
 * AUTHENTICATED - Cần token
 */
router.get("/history", auth, async (req, res) => {
  try {
    const userId = req.user?.id || req.user?.userId;
    if (!userId) {
      return res.status(401).json({
        ok: false,
        message: "Không thể xác định người dùng.",
      });
    }

    const pool = await getPool();
    const result = await pool.request()
      .input("UserId", sql.BigInt, userId)
      .query(`
        SELECT
          m.Id, m.InputImageUrl, m.OutputImageUrl, m.Status,
          m.CreatedAt, m.CompletedAt, m.CustomNotes,
          r.RegionName AS RegionalStyleName,
          wc.ColorName AS WallColorName, wc.HexCode AS WallHexCode, wc.ColorCode AS WallColorCode,
          (SELECT BrandName FROM PaintBrands WHERE Id = wc.BrandId) AS WallBrandName,
          rc.ColorName AS RoofColorName, rc.HexCode AS RoofHexCode, rc.ColorCode AS RoofColorCode,
          (SELECT BrandName FROM PaintBrands WHERE Id = rc.BrandId) AS RoofBrandName,
          cc.ColorName AS ColumnColorName, cc.HexCode AS ColumnHexCode, cc.ColorCode AS ColumnColorCode,
          (SELECT BrandName FROM PaintBrands WHERE Id = cc.BrandId) AS ColumnBrandName
        FROM MixMatchProjects m
        LEFT JOIN RegionalLibrary r ON m.RegionalStyleId = r.Id
        LEFT JOIN PaintColors wc ON m.WallColorId = wc.Id
        LEFT JOIN PaintColors rc ON m.RoofColorId = rc.Id
        LEFT JOIN PaintColors cc ON m.ColumnColorId = cc.Id
        WHERE m.UserId = @UserId
        ORDER BY m.CreatedAt DESC
      `);

    res.json({
      ok: true,
      items: result.recordset || [],
    });
  } catch (err) {
    console.error("[MixMatch] Get history error:", err);
    res.status(500).json({
      ok: false,
      message: "Lỗi lấy lịch sử dự án",
      detail: err.message,
    });
  }
});

/**
 * Helper function: Build AI prompt cho Mix & Match
 */
function buildMixMatchPrompt({ wallColor, roofColor, columnColor, regionalStyle, customNotes }) {
  let colorInstructions = "";

  if (wallColor) {
    colorInstructions += `WALLS: ${wallColor.ColorName} (${wallColor.HexCode}) - ${wallColor.BrandName} ${wallColor.ColorCode}\n`;
  } else {
    colorInstructions += `WALLS: Keep original color\n`;
  }

  if (roofColor) {
    colorInstructions += `ROOF: ${roofColor.ColorName} (${roofColor.HexCode}) - ${roofColor.BrandName} ${roofColor.ColorCode}\n`;
  } else {
    colorInstructions += `ROOF: Keep original color\n`;
  }

  if (columnColor) {
    colorInstructions += `COLUMNS: ${columnColor.ColorName} (${columnColor.HexCode}) - ${columnColor.BrandName} ${columnColor.ColorCode}\n`;
  } else {
    colorInstructions += `COLUMNS: Keep original color\n`;
  }

  const styleHint = regionalStyle
    ? `\n\nREGIONAL STYLE: ${regionalStyle.RegionName}\nStyle Guide: ${regionalStyle.StyleData || regionalStyle.Description || ""}`
    : "";

  const notes = customNotes ? `\n\nCUSTOM NOTES: ${customNotes}` : "";

  const prompt = `
SYSTEM INSTRUCTIONS: Exterior House Paint Application - Mix & Match

You are an AI architecture specialist. Apply these EXACT paint colors to the house image:

${colorInstructions}${styleHint}${notes}

CRITICAL REQUIREMENTS:
1. Preserve the exact building structure, proportions, and camera angle
2. Apply colors PRECISELY using the HEX codes provided above
3. For components marked "Keep original color", do not change them
4. Remove scaffolding and construction materials if present
5. Maintain realistic lighting and shadows appropriate for the time of day
6. Add subtle architectural details appropriate for the regional style (if specified)
7. Output a photorealistic architectural render at 1024x1024 resolution

DO NOT CHANGE:
- Window positions, sizes, or quantities
- Door locations or designs
- Roof shape or structure
- Building height or number of floors
- Architectural layout or proportions
- Overall building footprint

PAINTING TECHNIQUE:
- Apply paint colors uniformly to the specified components
- Ensure smooth transitions between different colored components
- Maintain material texture (concrete, brick, wood) under the paint
- Use proper color saturation matching the HEX codes
- Apply weathering effects subtly if appropriate for realism

OUTPUT FORMAT:
- High-quality photorealistic render
- Clean, professional architectural visualization
- No text, watermarks, or overlays
- Focus on accurate color representation
`;

  return prompt.trim();
}

module.exports = router;
