const express = require("express");
const multer = require("multer");
const crypto = require("crypto");
require("dotenv").config();
const { uploadBufferToCloudinary } = require("../services/cloud");
const { 
  analyzeImage, // Phân tích ảnh
  generateImageExternal, // Tạo ảnh
  generateImageFromThreeServices, // Tạo 3 ảnh từ 3 services
  generateImageFromImages, // Image-to-image
} = require("../services/external-ai");
const { getPool, sql } = require("../db");
const auth = require("../middlewares/auth");

// Khởi tạo Express Router
const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });
const SESS = new Map();

/**
 * 1️⃣ Upload ảnh mẫu → Phân tích bằng External AI Services
 */
router.post("/upload-sample", upload.single("sample"), async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ ok: false, message: "Thiếu file sample" });

    // Upload ảnh mẫu lên Cloudinary
    const up = await uploadBufferToCloudinary(req.file.buffer, "exterior_ai/samples");

    const prompt = `
Bạn là chuyên gia kiến trúc và kỹ sư prompt. Hãy phân tích ảnh mẫu này và trả về JSON.
Nhiệm vụ:
- Phân tích chi tiết: Tường, Mái, Cột, Cửa, Vật liệu, Màu sắc.
- Tạo "Visual Style Prompt" (Tiếng Anh): Viết một đoạn mô tả khoảng 60-80 từ tập trung vào vật liệu, màu sắc, ánh sáng và phong cách của ngôi nhà này. Đoạn này sẽ được dùng để áp lên một ngôi nhà khác mà không làm thay đổi cấu trúc nhà đó.

Trả về duy nhất JSON theo cấu trúc:
{
  "architectural_components": [
    { "element": "Tường/Mái/Cột...", "material": "", "color": "", "description_vi": "" }
  ],
  "visual_style_transfer": {
    "style_name": "ví dụ: Modern, Neoclassical",
    "master_prompt_en": "A high-quality architectural render, [Mô tả chi tiết vật liệu, màu sắc bằng tiếng Anh ở đây], cinematic lighting, 8k resolution",
    "color_palette": ["mã màu hoặc tên màu"]
  },
  "summary_vi": "Tóm tắt ngắn gọn phong cách ngôi nhà."}
`;


    // Gọi External AI service để phân tích ảnh
    const analysis = await analyzeImage(
      req.file.buffer,
      req.file.mimetype,
      prompt
    );

    const extractedLayout = {
      aiSummary: analysis,
      sampleImageUrl: up.secure_url,
      sampleImageBuffer: req.file.buffer, // Lưu buffer để dùng sau
      sampleMimeType: req.file.mimetype,  // Lưu mime type
    };

    const tempId = crypto.randomUUID();
    SESS.set(tempId, extractedLayout);

    res.json({ ok: true, data: { tempId, ...extractedLayout } });
  } catch (err) {
    console.error("External AI upload-sample error:", err);
    res.status(500).json({
      ok: false,
      message: "Lỗi phân tích ảnh mẫu",
      detail: err.message,
    });
  }
});

/**
 * Ngũ Hành - Five Elements Color System for Vietnamese Feng Shui
 */
const NGU_HANH_COLORS = {
  "Kim": {
    element: "metal",
    nameVi: "Mệnh Kim",
    colors: ["white", "silver", "gray", "gold", "metallic"],
    colorDescEn: "pristine white walls, elegant silver-gray accents, warm gold trim details, sophisticated metallic finishes",
    colorDescVi: "Trắng tinh khôi, bạc ánh kim, xám thanh lịch, vàng kim ấm áp",
    styleHint: "Clean, refined, with metallic accents and neutral elegance"
  },
  "Mộc": {
    element: "wood",
    nameVi: "Mệnh Mộc",
    colors: ["green", "emerald", "forest green", "olive", "sage"],
    colorDescEn: "natural green tones, fresh emerald accents, forest green details, harmonious sage and olive shades",
    colorDescVi: "Xanh lá tươi mát, xanh ngọc bích, xanh rừng hài hòa",
    styleHint: "Natural, organic, with lush green tones and wooden textures"
  },
  "Thủy": {
    element: "water",
    nameVi: "Mệnh Thủy",
    colors: ["navy blue", "dark blue", "ocean blue", "black", "deep teal"],
    colorDescEn: "deep navy blue walls, mysterious dark accents, ocean-inspired blue tones, sophisticated black details",
    colorDescVi: "Xanh navy sâu thẳm, đen huyền bí, xanh nước biển",
    styleHint: "Flowing, deep, with ocean blues and sophisticated dark tones"
  },
  "Hỏa": {
    element: "fire",
    nameVi: "Mệnh Hỏa",
    colors: ["red", "orange", "coral", "pink", "magenta", "burgundy"],
    colorDescEn: "vibrant red accents, warm orange tones, elegant coral highlights, passionate pink and burgundy details",
    colorDescVi: "Đỏ rực rỡ, cam ấm áp, hồng tươi tắn, tím đậm sang trọng",
    styleHint: "Warm, passionate, with vibrant reds and energetic warm tones"
  },
  "Thổ": {
    element: "earth",
    nameVi: "Mệnh Thổ",
    colors: ["yellow", "brown", "beige", "terracotta", "ochre", "sand"],
    colorDescEn: "warm earthy yellow walls, rich brown accents, natural beige tones, authentic terracotta and ochre details",
    colorDescVi: "Vàng đất ấm áp, nâu gỗ trầm, be tự nhiên, đất nung",
    styleHint: "Grounded, stable, with warm earth tones and natural materials"
  },
  "Không": {
    element: "auto",
    nameVi: "Tự động",
    colors: ["neutral", "balanced"],
    colorDescEn: "harmonious neutral tones, balanced color palette suitable for the architectural style",
    colorDescVi: "Màu sắc hài hòa, cân bằng",
    styleHint: "AI will choose the most suitable colors based on the architectural style"
  }
};

/**
 * 2️⃣ Gửi yêu cầu phong cách theo Ngũ Hành
 */
router.post("/generate-style", async (req, res) => {
  try {
    const { tempId, requirements } = req.body;
    if (!tempId || !requirements) {
      return res.status(400).json({ ok: false, message: "Thiếu dữ liệu" });
    }

    const ctx = SESS.get(tempId) || {};
    
    // Enrich requirements with Ngũ Hành color data
    const nguHanh = NGU_HANH_COLORS[requirements.style] || NGU_HANH_COLORS["Không"];
    ctx.requirements = {
      ...requirements,
      nguHanhData: nguHanh,
      colorPalette: requirements.colorPalette || nguHanh.colorDescVi,
    };
    
    SESS.set(tempId, ctx);

    res.json({
      ok: true,
      message: `Đã lưu yêu cầu: ${nguHanh.nameVi}`,
      data: {
        element: nguHanh.element,
        colorPalette: nguHanh.colorDescVi,
      }
    });
  } catch (err) {
    console.error("Generate-style error:", err);
    res.status(500).json({ ok: false, message: err.message });
  }
});

/**
 * 3️⃣ Upload ảnh nhà thật → Gọi External AI Services để phối cảnh
 */
router.post("/generate-final", auth, upload.single("house"), async (req, res) => {
  try {
    // Lấy UserId từ token thông qua middleware auth
    const trxUserId = req.user?.id || req.user?.userId;
    if (!trxUserId) {
      return res.status(401).json({ 
        ok: false, 
        message: "Không thể xác định người dùng. Vui lòng đăng nhập lại." 
      });
    }
    const { tempId } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ ok: false, message: "Thiếu ảnh nhà thô" });
    }
    if (!tempId || !SESS.has(tempId)) {
      return res.status(400).json({ ok: false, message: "Session không hợp lệ" });
    }

    const ctx = SESS.get(tempId);

    // Upload ảnh nhà thật lên Cloudinary
    const upHouse = await uploadBufferToCloudinary(file.buffer, "exterior_ai/houses");

    const sampleAnalysis = ctx.aiSummary
      ? ctx.aiSummary
      : 'Không có bản phân tích chi tiết cho ảnh mẫu; hãy chỉ dựa trên ảnh nhà thô và yêu cầu phong cách.';

    // Build color instructions based on Ngũ Hành
    const nguHanhData = ctx.requirements?.nguHanhData || {};
    const colorInstructions = nguHanhData.colorDescEn || "harmonious neutral tones";
    const styleHint = nguHanhData.styleHint || "balanced and elegant";
    const elementName = ctx.requirements?.style || "Auto";

    const finalInstructions = `
SYSTEM INSTRUCTIONS

You are an AI architecture and exterior paint specialist. Your task is to apply Feng Shui colors to a house.

FENG SHUI ELEMENT: ${elementName} (${nguHanhData.nameVi || "Tự chọn"})
COLOR PALETTE: ${colorInstructions}
STYLE: ${styleHint}

Reference analysis (if available): 
${sampleAnalysis}

1. Analyze the house image:
   - Identify walls, columns, roof, windows, doors, balconies, decorative elements.
   - Note any scaffolding or construction items to be removed.

2. Preserve the original structure:
   - Keep the exact same building shape, proportions, and camera angle.
   - Remove scaffolding and construction materials, restore hidden surfaces.

3. Apply Feng Shui paint colors:
   - Main walls: Use PRIMARY colors from the specified Feng Shui palette
   - Trim and borders: Use ACCENT colors
   - Doors/windows: Coordinate with overall color scheme
   - Color palette: ${ctx.requirements?.colorPalette || "cream white with wooden accents"}
   - Materials & decorations cần nhấn mạnh: ${ctx.requirements?.decorItems || "wooden slats, wall lamps"}
   - Gợi ý bổ sung: ${ctx.requirements?.aiSuggestions || "prioritize natural lighting, elegant bright tones"}
   - Giữ nguyên chất liệu gốc nếu nhìn thấy rõ; nếu chưa rõ, ghi “chưa xác định” và hoàn thiện bằng vật liệu cùng loại.

5. Aesthetic refinement:
   - Bổ sung các chi tiết trang trí nhẹ (đèn tường, phào, lam gỗ, lan can, rèm cửa) phù hợp phong cách đã chọn.
   - Duy trì ánh sáng tự nhiên, tạo chiều sâu bằng bóng đổ thực tế, thêm bầu trời và cây xanh nhẹ nhàng nếu cần.

6. Output requirements:
   - Trả về một ảnh ngoại thất đã hoàn thiện, sạch sẽ, không còn vật thể thi công.
   - Mặt tiền phải thể hiện rõ các hạng mục đã mô tả, màu sắc chuẩn xác, vật liệu trung thực.
   - Chỉ điều chỉnh hoàn thiện bề mặt; tuyệt đối KHÔNG thay đổi hình khối, vị trí cửa sổ, số tầng hay tỷ lệ kiến trúc của ảnh nhà thô.
   - Đồng thời tường thuật (nội bộ) các bước phân tích, segmentation, phục dựng, tô màu, và trang trí để đảm bảo model hiểu ngữ cảnh.
`;

    const prompt = `
${finalInstructions}

Hãy sử dụng ảnh nhà thô làm nền bắt buộc, bám sát cấu trúc thật, chỉ thay đổi vật liệu/màu sắc/hoàn thiện theo phong cách trên. Nếu có ảnh mẫu, dùng phân tích ở trên để suy ra chất liệu và bố cục trang trí tương ứng nhưng tuyệt đối không thay đổi kiến trúc gốc của nhà thật.
`;


    // Gọi External AI Services để tạo ảnh - trả về 3 kết quả từ 3 services
    let imageResults;
    
    if (ctx.sampleImageBuffer) {
      // Có cả ảnh mẫu và ảnh nhà thô - sử dụng image-to-image generation
      // Tạm thời dùng generateImageExternal, có thể cải thiện sau
      const imageBuffer = await generateImageFromImages(
        file.buffer,           // ảnh nhà thô (source)
        file.mimetype,
        ctx.sampleImageBuffer, // ảnh mẫu (reference)
        ctx.sampleMimeType || "image/jpeg",
        prompt
      );
      // Nếu có ảnh mẫu, chỉ trả về 1 kết quả
      const upOutput = await uploadBufferToCloudinary(imageBuffer, "exterior_ai/outputs");
      imageResults = {
        stability: null,
        replicate: null,
        huggingface: null,
        single: upOutput.secure_url,
      };
    } else {
      // Chỉ có ảnh nhà thô, tạo ảnh từ nhiều services (Gemini ưu tiên vào single)
      const results = await generateImageFromThreeServices(prompt, {
        width: 1024,
        height: 1024,
      });

      // Upload từng ảnh lên Cloudinary
      const uploadPromises = [];
      
      // Gemini (ưu tiên vào single)
      if (results.single) {
        uploadPromises.push(
          uploadBufferToCloudinary(results.single, "exterior_ai/outputs")
            .then(up => ({ service: 'single', url: up.secure_url }))
            .catch(err => {
              console.error('[Upload] Gemini image error:', err);
              return { service: 'single', url: null };
            })
        );
      } else {
        uploadPromises.push(Promise.resolve({ service: 'single', url: null }));
      }

      if (results.stability) {
        uploadPromises.push(
          uploadBufferToCloudinary(results.stability, "exterior_ai/outputs")
            .then(up => ({ service: 'stability', url: up.secure_url }))
            .catch(err => {
              console.error('[Upload] Stability AI image error:', err);
              return { service: 'stability', url: null };
            })
        );
      } else {
        uploadPromises.push(Promise.resolve({ service: 'stability', url: null }));
      }

      if (results.replicate) {
        uploadPromises.push(
          uploadBufferToCloudinary(results.replicate, "exterior_ai/outputs")
            .then(up => ({ service: 'replicate', url: up.secure_url }))
            .catch(err => {
              console.error('[Upload] Replicate image error:', err);
              return { service: 'replicate', url: null };
            })
        );
      } else {
        uploadPromises.push(Promise.resolve({ service: 'replicate', url: null }));
      }

      if (results.huggingface) {
        uploadPromises.push(
          uploadBufferToCloudinary(results.huggingface, "exterior_ai/outputs")
            .then(up => ({ service: 'huggingface', url: up.secure_url }))
            .catch(err => {
              console.error('[Upload] Hugging Face image error:', err);
              return { service: 'huggingface', url: null };
            })
        );
      } else {
        uploadPromises.push(Promise.resolve({ service: 'huggingface', url: null }));
      }

      const uploadedResults = await Promise.all(uploadPromises);
      imageResults = {
        single: uploadedResults.find(r => r.service === 'single')?.url || null,
        stability: uploadedResults.find(r => r.service === 'stability')?.url || null,
        replicate: uploadedResults.find(r => r.service === 'replicate')?.url || null,
        huggingface: uploadedResults.find(r => r.service === 'huggingface')?.url || null,
      };
    }

    // Lưu ảnh đầu tiên có sẵn vào DB (hoặc ảnh single nếu có)
    const outputImageUrl = imageResults.single || 
                          imageResults.stability || 
                          imageResults.replicate || 
                          imageResults.huggingface;

    // Kiểm tra xem có ít nhất một ảnh được tạo ra không
    if (!outputImageUrl) {
      return res.status(500).json({
        ok: false,
        message: "Không thể tạo ảnh. Vui lòng thử lại sau.",
        detail: "Tất cả các dịch vụ AI đều không trả về kết quả.",
      });
    }

    // Lưu lịch sử vào DB (lưu ảnh đầu tiên có sẵn)
    const pool = await getPool();
    await pool.request()
      .input("UserId", sql.BigInt, trxUserId)
      .input("InputImageUrl", sql.NVarChar(500), upHouse.secure_url)
      .input("OutputImageUrl", sql.NVarChar(500), outputImageUrl)
      .input("Style", sql.NVarChar(200), ctx.requirements?.style || "")
      .input("PromptUsed", sql.NVarChar(sql.MAX), prompt)
      .query(`
        INSERT INTO Generations (UserId, InputImageUrl, OutputImageUrl, Style, PromptUsed, CreatedAt)
        VALUES (@UserId, @InputImageUrl, @OutputImageUrl, @Style, @PromptUsed, SYSDATETIME());
      `);

    res.json({
      ok: true,
      data: {
        inputHouse: upHouse.secure_url,
        outputImages: imageResults, // Trả về 3 kết quả
        outputImage: outputImageUrl, // Giữ lại cho backward compatibility
      },
    });
  } catch (err) {
    console.error("External AI render error:", err);
    res.status(500).json({
      ok: false,
      message: "Lỗi sinh ảnh bằng External AI Services",
      detail: err.message,
    });
  }
});

module.exports = router;