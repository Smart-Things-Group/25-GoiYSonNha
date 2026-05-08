const express = require("express");
const multer = require("multer");
require("dotenv").config();
const { uploadBufferToCloudinary } = require("../services/cloud");
const { generateImageFromImages } = require("../services/external-ai");
const RegionalLibrary = require("../models/RegionalLibrary");
const PaintBrand = require("../models/PaintBrand");
const PaintColor = require("../models/PaintColor");
const MixMatchProject = require("../models/MixMatchProject");
const auth = require("../middlewares/auth");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get("/regional-styles", async (req, res) => {
  try {
    const raw = await RegionalLibrary.find()
      .select("regionName imageUrl description createdAt")
      .sort({ createdAt: -1 })
      .lean();

    const items = raw.map(item => ({ ...item, id: item._id }));

    res.json({ ok: true, items });
  } catch (err) {
    console.error("[MixMatch] Get regional styles error:", err);
    res.status(500).json({ ok: false, message: "Lỗi lấy danh sách phong cách vùng miền", detail: err.message });
  }
});

router.get("/paint-colors", async (req, res) => {
  try {
    const { componentType, brandId } = req.query;

    const filter = { isActive: true };

    if (componentType && componentType !== "all") {
      filter.$or = [{ componentType }, { componentType: "all" }];
    }
    if (brandId) {
      filter.brandId = brandId;
    }

    const items = await PaintColor.find(filter)
      .populate({
        path: "brandId",
        match: { isActive: true },
        select: "brandName brandLogoUrl displayOrder",
      })
      .lean();

    const filtered = items
      .filter((c) => c.brandId != null)
      .map((c) => ({
        id: c._id,
        colorName: c.colorName,
        colorCode: c.colorCode,
        hexCode: c.hexCode,
        componentType: c.componentType,
        imageUrl: c.imageUrl,
        description: c.description,
        brandId: c.brandId._id,
        brandName: c.brandId.brandName,
        brandLogoUrl: c.brandId.brandLogoUrl,
      }))
      .sort((a, b) => a.brandName.localeCompare(b.brandName) || a.colorName.localeCompare(b.colorName));

    res.json({ ok: true, items: filtered });
  } catch (err) {
    console.error("[MixMatch] Get paint colors error:", err);
    res.status(500).json({ ok: false, message: "Lỗi lấy danh sách màu sơn", detail: err.message });
  }
});

router.get("/paint-brands", async (req, res) => {
  try {
    const raw = await PaintBrand.find({ isActive: true })
      .select("brandName brandLogoUrl description")
      .sort({ displayOrder: 1, brandName: 1 })
      .lean();

    const items = raw.map(item => ({ ...item, id: item._id }));

    res.json({ ok: true, items });
  } catch (err) {
    console.error("[MixMatch] Get paint brands error:", err);
    res.status(500).json({ ok: false, message: "Lỗi lấy danh sách thương hiệu sơn", detail: err.message });
  }
});

router.post("/generate", auth, upload.single("house"), async (req, res) => {
  try {
    const userId = req.user?.id || req.user?.userId;
    if (!userId) {
      return res.status(401).json({ ok: false, message: "Không thể xác định người dùng. Vui lòng đăng nhập lại." });
    }

    const { regionalStyleId, wallColorId, roofColorId, columnColorId, customNotes, provider } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ ok: false, message: "Thiếu ảnh nhà thô. Vui lòng upload ảnh." });
    }
    console.log("[MixMatch] Generate request:", { userId, regionalStyleId, wallColorId, roofColorId, columnColorId, fileSize: file.size });

    const houseUpload = await uploadBufferToCloudinary(file.buffer, "exterior_ai/mixmatch/inputs");
    console.log("[MixMatch] House image uploaded:", houseUpload.secure_url);

    const colorIds = [wallColorId, roofColorId, columnColorId].filter(Boolean);
    let wallColor = null, roofColor = null, columnColor = null;

    if (colorIds.length > 0) {
      const colors = await PaintColor.find({ _id: { $in: colorIds } })
        .populate("brandId", "brandName")
        .lean();

      wallColor = colors.find((c) => String(c._id) === String(wallColorId));
      roofColor = colors.find((c) => String(c._id) === String(roofColorId));
      columnColor = colors.find((c) => String(c._id) === String(columnColorId));

      [wallColor, roofColor, columnColor].forEach((c) => {
        if (c && c.brandId) {
          c.BrandName = c.brandId.brandName;
          c.ColorName = c.colorName;
          c.HexCode = c.hexCode;
          c.ColorCode = c.colorCode;
        }
      });

      console.log("[MixMatch] Selected colors:", {
        wall: wallColor?.colorName,
        roof: roofColor?.colorName,
        column: columnColor?.colorName,
      });
    }

    let regionalStyle = null;
    if (regionalStyleId) {
      regionalStyle = await RegionalLibrary.findById(regionalStyleId).lean();
      console.log("[MixMatch] Regional style:", regionalStyle?.regionName);
    }

    const prompt = buildMixMatchPrompt({
      wallColor,
      roofColor,
      columnColor,
      regionalStyle,
      customNotes,
    });

    console.log("[MixMatch] AI Prompt length:", prompt.length);

    let outputImageUrl = null;
    try {
      const imageBuffer = await generateImageFromImages(
        file.buffer,
        file.mimetype,
        null,
        null,
        prompt,
        { provider }
      );
      const outputUpload = await uploadBufferToCloudinary(imageBuffer, "exterior_ai/mixmatch/outputs");
      outputImageUrl = outputUpload.secure_url;
      console.log("[MixMatch] Output image uploaded:", outputImageUrl);
    } catch (aiError) {
      console.error("[MixMatch] AI generation error:", aiError);
    }

    const project = await MixMatchProject.create({
      userId,
      inputImageUrl: houseUpload.secure_url,
      outputImageUrl,
      regionalStyleId: regionalStyleId || null,
      wallColorId: wallColorId || null,
      roofColorId: roofColorId || null,
      columnColorId: columnColorId || null,
      customNotes: customNotes || null,
      promptUsed: prompt,
      status: outputImageUrl ? "completed" : "failed",
      completedAt: outputImageUrl ? new Date() : null,
    });

    console.log("[MixMatch] Project saved with ID:", project._id);

    res.json({
      ok: true,
      data: {
        projectId: project._id,
        inputImageUrl: houseUpload.secure_url,
        outputImageUrl,
        provider: provider || "auto",
        status: outputImageUrl ? "completed" : "failed",
        colors: {
          wall: wallColor ? { id: wallColor._id, name: wallColor.colorName, hexCode: wallColor.hexCode, brand: wallColor.BrandName } : null,
          roof: roofColor ? { id: roofColor._id, name: roofColor.colorName, hexCode: roofColor.hexCode, brand: roofColor.BrandName } : null,
          column: columnColor ? { id: columnColor._id, name: columnColor.colorName, hexCode: columnColor.hexCode, brand: columnColor.BrandName } : null,
        },
        regionalStyle: regionalStyle ? { id: regionalStyle._id, name: regionalStyle.regionName } : null,
      },
      message: outputImageUrl
        ? "Tạo thiết kế thành công!"
        : "Upload ảnh thành công nhưng AI generation thất bại. Vui lòng thử lại.",
    });
  } catch (err) {
    console.error("[MixMatch] Generate error:", err);
    res.status(500).json({ ok: false, message: "Lỗi tạo thiết kế Mix & Match", detail: err.message });
  }
});

router.get("/history", auth, async (req, res) => {
  try {
    const userId = req.user?.id || req.user?.userId;
    if (!userId) {
      return res.status(401).json({ ok: false, message: "Không thể xác định người dùng." });
    }

    const items = await MixMatchProject.find({ userId })
      .populate("regionalStyleId", "regionName")
      .populate("wallColorId", "colorName hexCode colorCode brandId")
      .populate("roofColorId", "colorName hexCode colorCode brandId")
      .populate("columnColorId", "colorName hexCode colorCode brandId")
      .sort({ createdAt: -1 })
      .lean();

    const PaintBrandModel = require("../models/PaintBrand");
    const brandIds = new Set();
    items.forEach((item) => {
      [item.wallColorId, item.roofColorId, item.columnColorId].forEach((c) => {
        if (c?.brandId) brandIds.add(String(c.brandId));
      });
    });

    const brands = await PaintBrandModel.find({ _id: { $in: [...brandIds] } }).select("brandName").lean();
    const brandMap = {};
    brands.forEach((b) => { brandMap[String(b._id)] = b.brandName; });

    const mapped = items.map((m) => ({
      id: m._id,
      inputImageUrl: m.inputImageUrl,
      outputImageUrl: m.outputImageUrl,
      status: m.status,
      createdAt: m.createdAt,
      completedAt: m.completedAt,
      customNotes: m.customNotes,
      RegionalStyleName: m.regionalStyleId?.regionName || null,
      WallColorName: m.wallColorId?.colorName || null,
      WallHexCode: m.wallColorId?.hexCode || null,
      WallColorCode: m.wallColorId?.colorCode || null,
      WallBrandName: m.wallColorId?.brandId ? brandMap[String(m.wallColorId.brandId)] : null,
      RoofColorName: m.roofColorId?.colorName || null,
      RoofHexCode: m.roofColorId?.hexCode || null,
      RoofColorCode: m.roofColorId?.colorCode || null,
      RoofBrandName: m.roofColorId?.brandId ? brandMap[String(m.roofColorId.brandId)] : null,
      ColumnColorName: m.columnColorId?.colorName || null,
      ColumnHexCode: m.columnColorId?.hexCode || null,
      ColumnColorCode: m.columnColorId?.colorCode || null,
      ColumnBrandName: m.columnColorId?.brandId ? brandMap[String(m.columnColorId.brandId)] : null,
    }));

    res.json({ ok: true, items: mapped });
  } catch (err) {
    console.error("[MixMatch] Get history error:", err);
    res.status(500).json({ ok: false, message: "Lỗi lấy lịch sử dự án", detail: err.message });
  }
});

function buildMixMatchPrompt({ wallColor, roofColor, columnColor, regionalStyle, customNotes }) {
  let colorInstructions = "";

  if (wallColor) {
    colorInstructions += `WALLS: ${wallColor.ColorName || wallColor.colorName} (${wallColor.HexCode || wallColor.hexCode}) - ${wallColor.BrandName || ""} ${wallColor.ColorCode || wallColor.colorCode || ""}\n`;
  } else {
    colorInstructions += `WALLS: Keep original color\n`;
  }

  if (roofColor) {
    colorInstructions += `ROOF: ${roofColor.ColorName || roofColor.colorName} (${roofColor.HexCode || roofColor.hexCode}) - ${roofColor.BrandName || ""} ${roofColor.ColorCode || roofColor.colorCode || ""}\n`;
  } else {
    colorInstructions += `ROOF: Keep original color\n`;
  }

  if (columnColor) {
    colorInstructions += `COLUMNS: ${columnColor.ColorName || columnColor.colorName} (${columnColor.HexCode || columnColor.hexCode}) - ${columnColor.BrandName || ""} ${columnColor.ColorCode || columnColor.colorCode || ""}\n`;
  } else {
    colorInstructions += `COLUMNS: Keep original color\n`;
  }

  const styleHint = regionalStyle
    ? `\n\nREGIONAL STYLE: ${regionalStyle.regionName || regionalStyle.RegionName}\nStyle Guide: ${regionalStyle.styleData || regionalStyle.StyleData || regionalStyle.description || regionalStyle.Description || ""}`
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
