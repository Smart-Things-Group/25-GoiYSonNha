# SQL Server to MongoDB Migration — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace all SQL Server (mssql) database operations with MongoDB (Mongoose) across the entire NgoaiThat-AI backend, migrate existing data, and update frontend ID references.

**Architecture:** Big Bang migration — all SQL code replaced at once. Each SQL table becomes a Mongoose model in `backend/src/models/`. Routes and services switch from raw SQL queries to Mongoose methods. A one-time migration script transfers data from SQL Server to MongoDB Atlas.

**Tech Stack:** Mongoose 8.x, MongoDB Atlas, Node.js/Express (existing)

---

## File Structure

**Create:**
- `backend/src/models/User.js`
- `backend/src/models/Profile.js`
- `backend/src/models/Generation.js`
- `backend/src/models/RegionalLibrary.js`
- `backend/src/models/ColorPalette.js`
- `backend/src/models/DesignConfig.js`
- `backend/src/models/ImageMask.js`
- `backend/src/models/PaintBrand.js`
- `backend/src/models/PaintColor.js`
- `backend/src/models/MixMatchProject.js`
- `backend/src/models/index.js`
- `backend/scripts/migrate-to-mongo.js`

**Modify:**
- `backend/package.json` — add `mongoose`, keep `mssql` temporarily
- `backend/src/db.js` — full rewrite
- `backend/src/server.js` — add `connectDB()` call
- `backend/src/app.js` — update health check
- `backend/src/middlewares/auth.js` — replace SQL query with Mongoose
- `backend/src/services/colorService.js` — replace SQL with Mongoose
- `backend/src/services/designService.js` — replace SQL with Mongoose
- `backend/src/services/adminSeeder.js` — replace SQL with Mongoose
- `backend/src/routes/users.js` — replace all SQL queries
- `backend/src/routes/histories.js` — replace all SQL queries
- `backend/src/routes/wizard.js` — replace SQL INSERT
- `backend/src/routes/colors.js` — no changes (delegates to colorService)
- `backend/src/routes/designs.js` — no changes (delegates to designService)
- `backend/src/routes/admin.js` — replace all SQL queries (largest file)
- `backend/src/routes/mixmatch.js` — replace all SQL queries
- `frontend/src/components/AdminDashboard.jsx` — `.Id` -> `.id`
- `frontend/src/components/AdminDashboardPage.jsx` — `.Id` -> `.id`
- `frontend/src/components/AdminLibraryManager.jsx` — `.Id` -> `.id`
- `frontend/src/components/MixMatchPage.jsx` — `.Id` -> `.id`
- `frontend/src/components/ProfilePage.jsx` — `.Id` -> `.id`
- `frontend/src/hooks/useAdminUsers.js` — `.Id` -> `.id`

---

### Task 1: Install Mongoose and create db.js

**Files:**
- Modify: `backend/package.json`
- Modify: `backend/src/db.js` (full rewrite)

- [ ] **Step 1: Install mongoose**

Run:
```bash
cd backend && npm install mongoose
```

- [ ] **Step 2: Rewrite `backend/src/db.js`**

Replace the entire file with:

```js
const path = require("path");
const mongoose = require("mongoose");

require("dotenv").config({ path: path.join(__dirname, "../.env") });

async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is not defined in .env");
  }

  try {
    await mongoose.connect(uri);
    console.log(`✅ Kết nối thành công tới MongoDB: ${mongoose.connection.name}`);
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    throw err;
  }

  mongoose.connection.on("error", (err) => {
    console.error("❌ MongoDB connection error:", err);
  });
}

async function testDb() {
  try {
    const state = mongoose.connection.readyState;
    // 0=disconnected, 1=connected, 2=connecting, 3=disconnecting
    const ok = state === 1;
    if (ok) console.log(`✅ MongoDB connected: ${mongoose.connection.name}`);
    return ok;
  } catch (e) {
    console.error("❌ DB Check error:", e.message);
    return false;
  }
}

module.exports = { mongoose, connectDB, testDb };
```

- [ ] **Step 3: Add MONGODB_URI to `.env`**

Add to `backend/.env`:
```
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/exterior_ai
```

Replace `<user>`, `<password>`, `<cluster>` with your MongoDB Atlas credentials.

- [ ] **Step 4: Update `backend/src/server.js`**

Replace the entire file with:

```js
const { connectDB } = require("./db");
const app = require("./app");
const { ensureAdminAccount } = require("./services/adminSeeder");

const PORT = process.env.PORT || 8000;

async function bootstrap() {
  await connectDB();

  try {
    await ensureAdminAccount();
  } catch (error) {
    console.error("[AdminSeeder] Không thể tạo tài khoản admin mặc định:", error);
  }

  const server = app.listen(PORT, () => console.log("Server running on port", PORT));

  server.timeout = 180000;
  server.keepAliveTimeout = 180000;
  server.headersTimeout = 185000;
}

bootstrap();
```

- [ ] **Step 5: Update `backend/src/app.js` health check**

In `backend/src/app.js`, change line 10 from:
```js
const { testDb } = require("./db");
```
to:
```js
const { testDb } = require("./db");
```
(No change needed — `testDb` is already exported from the new `db.js`.)

- [ ] **Step 6: Commit**

```bash
git add backend/package.json backend/package-lock.json backend/src/db.js backend/src/server.js
git commit -m "chore: replace mssql with mongoose connection layer"
```

---

### Task 2: Create all Mongoose models

**Files:**
- Create: `backend/src/models/User.js`
- Create: `backend/src/models/Profile.js`
- Create: `backend/src/models/Generation.js`
- Create: `backend/src/models/RegionalLibrary.js`
- Create: `backend/src/models/ColorPalette.js`
- Create: `backend/src/models/DesignConfig.js`
- Create: `backend/src/models/ImageMask.js`
- Create: `backend/src/models/PaintBrand.js`
- Create: `backend/src/models/PaintColor.js`
- Create: `backend/src/models/MixMatchProject.js`
- Create: `backend/src/models/index.js`

- [ ] **Step 1: Create `backend/src/models/User.js`**

```js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, maxlength: 191 },
    passwordHash: { type: String, required: true, maxlength: 255 },
    role: { type: String, enum: ["user", "admin"], default: "user" },
  },
  {
    timestamps: { createdAt: "createdAt", updatedAt: false },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

module.exports = mongoose.model("User", userSchema);
```

- [ ] **Step 2: Create `backend/src/models/Profile.js`**

```js
const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    areaSqm: Number,
    houseType: { type: String, maxlength: 100 },
    style: { type: String, maxlength: 200 },
    budget: { type: String, maxlength: 50 },
  },
  {
    timestamps: { createdAt: false, updatedAt: "updatedAt" },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

module.exports = mongoose.model("Profile", profileSchema);
```

- [ ] **Step 3: Create `backend/src/models/Generation.js`**

```js
const mongoose = require("mongoose");

const generationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    inputDesc: String,
    inputImageUrl: { type: String, maxlength: 500 },
    outputImageUrl: { type: String, maxlength: 500 },
    style: { type: String, maxlength: 200 },
    palette: { type: String, maxlength: 200 },
    seed: Number,
    promptUsed: String,
    description: String,
  },
  {
    timestamps: { createdAt: "createdAt", updatedAt: false },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

module.exports = mongoose.model("Generation", generationSchema);
```

- [ ] **Step 4: Create `backend/src/models/RegionalLibrary.js`**

```js
const mongoose = require("mongoose");

const regionalLibrarySchema = new mongoose.Schema(
  {
    regionName: { type: String, maxlength: 50 },
    imageUrl: { type: String, maxlength: 500 },
    styleData: { type: mongoose.Schema.Types.Mixed },
    description: String,
  },
  {
    timestamps: { createdAt: "createdAt", updatedAt: false },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

module.exports = mongoose.model("RegionalLibrary", regionalLibrarySchema);
```

- [ ] **Step 5: Create `backend/src/models/ColorPalette.js`**

```js
const mongoose = require("mongoose");

const colorPaletteSchema = new mongoose.Schema(
  {
    colorName: { type: String, maxlength: 100 },
    hexCode: { type: String, maxlength: 7 },
    brand: { type: String, maxlength: 100 },
    category: { type: String, maxlength: 50 },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

module.exports = mongoose.model("ColorPalette", colorPaletteSchema);
```

- [ ] **Step 6: Create `backend/src/models/DesignConfig.js`**

```js
const mongoose = require("mongoose");

const designConfigSchema = new mongoose.Schema(
  {
    generationId: { type: mongoose.Schema.Types.ObjectId, ref: "Generation", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    configJson: { type: mongoose.Schema.Types.Mixed },
    isFinal: { type: Boolean, default: false },
  },
  {
    timestamps: { createdAt: false, updatedAt: "updatedAt" },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

module.exports = mongoose.model("DesignConfig", designConfigSchema);
```

- [ ] **Step 7: Create `backend/src/models/ImageMask.js`**

```js
const mongoose = require("mongoose");

const imageMaskSchema = new mongoose.Schema(
  {
    generationId: { type: mongoose.Schema.Types.ObjectId, ref: "Generation", required: true },
    label: { type: String, maxlength: 100 },
    polygonData: { type: mongoose.Schema.Types.Mixed },
  },
  {
    timestamps: { createdAt: "createdAt", updatedAt: false },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

module.exports = mongoose.model("ImageMask", imageMaskSchema);
```

- [ ] **Step 8: Create `backend/src/models/PaintBrand.js`**

```js
const mongoose = require("mongoose");

const paintBrandSchema = new mongoose.Schema(
  {
    brandName: { type: String, maxlength: 100 },
    brandLogoUrl: { type: String, maxlength: 500 },
    description: String,
    websiteUrl: { type: String, maxlength: 500 },
    isActive: { type: Boolean, default: true },
    displayOrder: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

module.exports = mongoose.model("PaintBrand", paintBrandSchema);
```

- [ ] **Step 9: Create `backend/src/models/PaintColor.js`**

```js
const mongoose = require("mongoose");

const paintColorSchema = new mongoose.Schema(
  {
    colorName: { type: String, maxlength: 200 },
    colorCode: { type: String, maxlength: 50 },
    hexCode: { type: String, maxlength: 7 },
    componentType: { type: String, enum: ["wall", "roof", "column", "all"], maxlength: 50 },
    imageUrl: String,
    description: String,
    brandId: { type: mongoose.Schema.Types.ObjectId, ref: "PaintBrand", required: true },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

module.exports = mongoose.model("PaintColor", paintColorSchema);
```

- [ ] **Step 10: Create `backend/src/models/MixMatchProject.js`**

```js
const mongoose = require("mongoose");

const mixMatchProjectSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    inputImageUrl: String,
    outputImageUrl: String,
    regionalStyleId: { type: mongoose.Schema.Types.ObjectId, ref: "RegionalLibrary" },
    wallColorId: { type: mongoose.Schema.Types.ObjectId, ref: "PaintColor" },
    roofColorId: { type: mongoose.Schema.Types.ObjectId, ref: "PaintColor" },
    columnColorId: { type: mongoose.Schema.Types.ObjectId, ref: "PaintColor" },
    customNotes: String,
    promptUsed: String,
    status: { type: String, default: "pending", maxlength: 50 },
    completedAt: Date,
  },
  {
    timestamps: { createdAt: "createdAt", updatedAt: false },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

module.exports = mongoose.model("MixMatchProject", mixMatchProjectSchema);
```

- [ ] **Step 11: Create `backend/src/models/index.js`**

```js
module.exports = {
  User: require("./User"),
  Profile: require("./Profile"),
  Generation: require("./Generation"),
  RegionalLibrary: require("./RegionalLibrary"),
  ColorPalette: require("./ColorPalette"),
  DesignConfig: require("./DesignConfig"),
  ImageMask: require("./ImageMask"),
  PaintBrand: require("./PaintBrand"),
  PaintColor: require("./PaintColor"),
  MixMatchProject: require("./MixMatchProject"),
};
```

- [ ] **Step 12: Commit**

```bash
git add backend/src/models/
git commit -m "feat: add all Mongoose models for MongoDB migration"
```

---

### Task 3: Update auth middleware

**Files:**
- Modify: `backend/src/middlewares/auth.js`

- [ ] **Step 1: Rewrite `backend/src/middlewares/auth.js`**

Replace the entire file with:

```js
const jwt = require("jsonwebtoken");
const User = require("../models/User");

async function auth(req, res, next) {
  try {
    const authHeader = req.headers.authorization || "";

    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ ok: false, message: "Thiếu token (Bearer ...)" });
    }

    const token = authHeader.split(" ")[1];

    if (!process.env.JWT_SECRET) {
      console.error("[Auth] ERROR: JWT_SECRET is not configured!");
      return res.status(500).json({ ok: false, message: "Server configuration error: JWT_SECRET not set" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded?.userId) {
      return res.status(401).json({ ok: false, message: "Token không hợp lệ" });
    }

    const user = await User.findById(decoded.userId).select("_id email role");
    if (!user) {
      return res.status(401).json({ ok: false, message: "Tài khoản không còn tồn tại" });
    }

    req.user = {
      ...decoded,
      id: user._id,
      userId: user._id,
      email: user.email,
      role: user.role || decoded.role || "user",
    };

    next();
  } catch (err) {
    console.error("[Auth] Token verification failed:", err.message);
    res.status(401).json({ ok: false, message: "Token không hợp lệ" });
  }
}

module.exports = auth;
```

- [ ] **Step 2: Commit**

```bash
git add backend/src/middlewares/auth.js
git commit -m "refactor: update auth middleware to use Mongoose"
```

---

### Task 4: Update services

**Files:**
- Modify: `backend/src/services/colorService.js`
- Modify: `backend/src/services/designService.js`
- Modify: `backend/src/services/adminSeeder.js`

- [ ] **Step 1: Rewrite `backend/src/services/colorService.js`**

Replace the entire file with:

```js
const ColorPalette = require("../models/ColorPalette");

async function getAllColors() {
  return ColorPalette.find().sort({ brand: 1, colorName: 1 });
}

module.exports = { getAllColors };
```

- [ ] **Step 2: Rewrite `backend/src/services/designService.js`**

Replace the entire file with:

```js
const DesignConfig = require("../models/DesignConfig");

async function saveDesign(generationId, userId, configJson) {
  return DesignConfig.findOneAndUpdate(
    { generationId },
    { generationId, userId, configJson, updatedAt: new Date() },
    { upsert: true, new: true }
  );
}

async function getDesign(generationId) {
  return DesignConfig.findOne({ generationId });
}

module.exports = { saveDesign, getDesign };
```

- [ ] **Step 3: Rewrite `backend/src/services/adminSeeder.js`**

Replace the entire file with:

```js
const bcrypt = require("bcrypt");
const User = require("../models/User");

const DEFAULT_ADMIN_EMAIL = process.env.DEFAULT_ADMIN_EMAIL || "admin@ngoai-that.ai";
const DEFAULT_ADMIN_PASSWORD = process.env.DEFAULT_ADMIN_PASSWORD || "Admin@123456";

async function ensureAdminAccount() {
  if (!DEFAULT_ADMIN_EMAIL || !DEFAULT_ADMIN_PASSWORD) {
    console.warn("[AdminSeeder] Thiếu DEFAULT_ADMIN_EMAIL hoặc DEFAULT_ADMIN_PASSWORD, bỏ qua seed admin.");
    return;
  }

  const existing = await User.findOne({ email: DEFAULT_ADMIN_EMAIL });

  if (existing) {
    if (existing.role !== "admin") {
      existing.role = "admin";
      await existing.save();
      console.log(`[AdminSeeder] Đã cập nhật role 'admin' cho ${DEFAULT_ADMIN_EMAIL}.`);
    }
    return;
  }

  const hash = await bcrypt.hash(DEFAULT_ADMIN_PASSWORD, 10);
  await User.create({
    email: DEFAULT_ADMIN_EMAIL,
    passwordHash: hash,
    role: "admin",
  });

  console.log(`[AdminSeeder] Đã tạo tài khoản admin cố định ${DEFAULT_ADMIN_EMAIL}.`);
}

module.exports = { ensureAdminAccount };
```

- [ ] **Step 4: Commit**

```bash
git add backend/src/services/colorService.js backend/src/services/designService.js backend/src/services/adminSeeder.js
git commit -m "refactor: update services to use Mongoose"
```

---

### Task 5: Update routes/users.js

**Files:**
- Modify: `backend/src/routes/users.js`

- [ ] **Step 1: Rewrite `backend/src/routes/users.js`**

Replace the entire file with:

```js
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Generation = require("../models/Generation");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    let { page = 1, pageSize = 20, search = "", role = "" } = req.query;
    page = Math.max(parseInt(page, 10) || 1, 1);
    pageSize = Math.min(Math.max(parseInt(pageSize, 10) || 20, 1), 100);

    const sanitizedSearch = search.trim();
    const normalizedRole = (role || "").trim().toLowerCase();

    const filter = {};
    if (sanitizedSearch) {
      filter.email = { $regex: sanitizedSearch, $options: "i" };
    }
    if (normalizedRole && normalizedRole !== "all") {
      filter.role = normalizedRole;
    }

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

    const users = await User.aggregate([
      { $match: filter },
      {
        $lookup: {
          from: "generations",
          localField: "_id",
          foreignField: "userId",
          as: "generations",
        },
      },
      {
        $addFields: {
          id: "$_id",
          GenerationCount: { $size: "$generations" },
          LastGenerationAt: { $max: "$generations.createdAt" },
        },
      },
      { $project: { generations: 0, passwordHash: 0, __v: 0 } },
      { $sort: { createdAt: -1 } },
      { $skip: offset },
      { $limit: pageSize },
    ]);

    res.json({
      ok: true,
      data: { page, pageSize, total, roleSummary, items: users },
    });
  } catch (err) {
    res.status(500).json({ ok: false, message: err.message });
  }
});

router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    const hash = await bcrypt.hash(password, 10);

    await User.create({ email, passwordHash: hash, role: "user" });

    res.json({ ok: true, message: "Đăng ký thành công!" });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ ok: false, message: "Email đã tồn tại" });
    }
    res.status(500).json({ ok: false, message: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ ok: false, message: "Email không tồn tại" });

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return res.status(400).json({ ok: false, message: "Sai mật khẩu" });

    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      ok: true,
      token,
      user: { id: user._id, email: user.email, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ ok: false, message: err.message });
  }
});

module.exports = router;
```

- [ ] **Step 2: Commit**

```bash
git add backend/src/routes/users.js
git commit -m "refactor: update users route to use Mongoose"
```

---

### Task 6: Update routes/histories.js

**Files:**
- Modify: `backend/src/routes/histories.js`

- [ ] **Step 1: Rewrite `backend/src/routes/histories.js`**

Replace the entire file with:

```js
const express = require("express");
const router = express.Router();
const Generation = require("../models/Generation");
const asyncHandler = require("../middlewares/asyncHandler");
const auth = require("../middlewares/auth");

router.get("/histories", auth, asyncHandler(async (req, res) => {
  let { page = 1, pageSize = 12 } = req.query;
  page = Math.max(parseInt(page, 10) || 1, 1);
  pageSize = Math.min(Math.max(parseInt(pageSize, 10) || 12, 1), 50);

  const userId = req.user.id;
  const offset = (page - 1) * pageSize;

  const total = await Generation.countDocuments({ userId });

  const items = await Generation.find({ userId })
    .select("userId inputDesc inputImageUrl outputImageUrl style palette promptUsed createdAt")
    .sort({ createdAt: -1 })
    .skip(offset)
    .limit(pageSize)
    .lean();

  res.ok({ page, pageSize, total, items });
}));

module.exports = router;
```

- [ ] **Step 2: Commit**

```bash
git add backend/src/routes/histories.js
git commit -m "refactor: update histories route to use Mongoose"
```

---

### Task 7: Update routes/wizard.js

**Files:**
- Modify: `backend/src/routes/wizard.js`

- [ ] **Step 1: Update wizard.js**

Only the DB-related parts need changing. Replace the import at line 12 and the INSERT query at lines 363-373.

Change the import (line 12):
```js
// OLD: const { getPool, sql } = require("../db");
// NEW:
const Generation = require("../models/Generation");
```

Replace the SQL INSERT block (lines 362-373) with:
```js
    await Generation.create({
      userId: trxUserId,
      inputImageUrl: upHouse.secure_url,
      outputImageUrl,
      style: ctx.requirements?.style || "",
      promptUsed: prompt,
    });
```

Everything else in wizard.js (AI services, session map, Ngu Hanh colors) stays unchanged.

- [ ] **Step 2: Commit**

```bash
git add backend/src/routes/wizard.js
git commit -m "refactor: update wizard route to use Mongoose"
```

---

### Task 8: Update routes/mixmatch.js

**Files:**
- Modify: `backend/src/routes/mixmatch.js`

- [ ] **Step 1: Rewrite `backend/src/routes/mixmatch.js`**

Replace the entire file with:

```js
const express = require("express");
const multer = require("multer");
require("dotenv").config();
const { uploadBufferToCloudinary } = require("../services/cloud");
const { generateImageExternal } = require("../services/external-ai");
const RegionalLibrary = require("../models/RegionalLibrary");
const PaintBrand = require("../models/PaintBrand");
const PaintColor = require("../models/PaintColor");
const MixMatchProject = require("../models/MixMatchProject");
const auth = require("../middlewares/auth");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get("/regional-styles", async (req, res) => {
  try {
    const items = await RegionalLibrary.find()
      .select("regionName imageUrl description createdAt")
      .sort({ createdAt: -1 })
      .lean();

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

    // Filter out items whose brand was inactive (populate returns null)
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
        BrandId: c.brandId._id,
        BrandName: c.brandId.brandName,
        BrandLogoUrl: c.brandId.brandLogoUrl,
      }))
      .sort((a, b) => a.BrandName.localeCompare(b.BrandName) || a.colorName.localeCompare(b.colorName));

    res.json({ ok: true, items: filtered });
  } catch (err) {
    console.error("[MixMatch] Get paint colors error:", err);
    res.status(500).json({ ok: false, message: "Lỗi lấy danh sách màu sơn", detail: err.message });
  }
});

router.get("/paint-brands", async (req, res) => {
  try {
    const items = await PaintBrand.find({ isActive: true })
      .select("brandName brandLogoUrl description")
      .sort({ displayOrder: 1, brandName: 1 })
      .lean();

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

    const { regionalStyleId, wallColorId, roofColorId, columnColorId, customNotes } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ ok: false, message: "Thiếu ảnh nhà thô. Vui lòng upload ảnh." });
    }
    if (!wallColorId && !roofColorId && !columnColorId) {
      return res.status(400).json({ ok: false, message: "Vui lòng chọn ít nhất 1 màu sơn cho tường, mái hoặc cột." });
    }

    console.log("[MixMatch] Generate request:", { userId, regionalStyleId, wallColorId, roofColorId, columnColorId, fileSize: file.size });

    const houseUpload = await uploadBufferToCloudinary(file.buffer, "exterior_ai/mixmatch/inputs");
    console.log("[MixMatch] House image uploaded:", houseUpload.secure_url);

    // Fetch selected colors — safe query, no injection
    const colorIds = [wallColorId, roofColorId, columnColorId].filter(Boolean);
    let wallColor = null, roofColor = null, columnColor = null;

    if (colorIds.length > 0) {
      const colors = await PaintColor.find({ _id: { $in: colorIds } })
        .populate("brandId", "brandName")
        .lean();

      wallColor = colors.find((c) => String(c._id) === String(wallColorId));
      roofColor = colors.find((c) => String(c._id) === String(roofColorId));
      columnColor = colors.find((c) => String(c._id) === String(columnColorId));

      // Map brand name onto color objects for prompt builder
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
      const imageBuffer = await generateImageExternal(prompt, { width: 1024, height: 1024 });
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

    // Populate brand names for each color (second-level populate workaround)
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
```

- [ ] **Step 2: Commit**

```bash
git add backend/src/routes/mixmatch.js
git commit -m "refactor: update mixmatch route to use Mongoose (fixes SQL injection)"
```

---

### Task 9: Update routes/admin.js

**Files:**
- Modify: `backend/src/routes/admin.js`

This is the largest file with 20 endpoints. Full replacement below.

- [ ] **Step 1: Rewrite `backend/src/routes/admin.js`**

Replace the entire file with:

```js
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
      { $project: { Style: { $ifNull: ["$_id", "Không rõ"] }, count: 1, _id: 0 } },
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
          UserId: "$_id",
          Email: "$email",
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
        UserId: "$_id",
        Email: "$email",
        Role: "$role",
        GenerationCount: { $size: "$gens" },
        LastGenerationAt: { $max: "$gens.createdAt" },
      },
    },
    { $sort: { LastGenerationAt: -1, UserId: -1 } },
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
    Email: g.userId?.email,
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
    styleData: styleData ? tryParseJSON(styleData) : styleData,
    description,
  });

  res.ok({ message: "Đã thêm mẫu nhà vào thư viện thành công", imageUrl: cloudRes.secure_url });
}));

// 10. List library
router.get("/library", asyncHandler(async (req, res) => {
  const items = await RegionalLibrary.find().sort({ createdAt: -1 }).lean();
  res.ok({ items });
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
      styleData: styleData !== undefined ? tryParseJSON(styleData) : existing.styleData,
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
  res.ok({ items });
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
    .sort({ "brandId.brandName": 1, colorName: 1 })
    .lean();

  const mapped = items.map((c) => ({
    ...c,
    id: c._id,
    BrandName: c.brandId?.brandName || null,
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
    return res.status(400).json({ ok: false, message: `ComponentType phải là một trong: wall, roof, column, all` });
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
    return res.status(400).json({ ok: false, message: `ComponentType phải là một trong: wall, roof, column, all` });
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

  const inUse = await require("../models/MixMatchProject").findOne({
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
```

- [ ] **Step 2: Commit**

```bash
git add backend/src/routes/admin.js
git commit -m "refactor: update admin route to use Mongoose (20 endpoints)"
```

---

### Task 10: Update routes/designs.js for Mongoose configJson handling

**Files:**
- Modify: `backend/src/routes/designs.js`

- [ ] **Step 1: Update `backend/src/routes/designs.js`**

The design service now stores `configJson` as a native Object (not a JSON string). Update the GET route to stop calling `JSON.parse()`:

Change line 36 from:
```js
  res.ok({ 
    config: JSON.parse(design.ConfigJson) 
  });
```
to:
```js
  res.ok({ 
    config: design.configJson 
  });
```

Also note: `design.ConfigJson` (uppercase) becomes `design.configJson` (lowercase) because Mongoose uses the schema field name, not the SQL column name.

- [ ] **Step 2: Commit**

```bash
git add backend/src/routes/designs.js
git commit -m "refactor: update designs route for Mongoose configJson handling"
```

---

### Task 11: Update frontend `.Id` references to `.id`

**Files:**
- Modify: `frontend/src/components/AdminDashboard.jsx`
- Modify: `frontend/src/components/AdminDashboardPage.jsx`
- Modify: `frontend/src/components/AdminLibraryManager.jsx`
- Modify: `frontend/src/components/MixMatchPage.jsx`
- Modify: `frontend/src/components/ProfilePage.jsx`
- Modify: `frontend/src/hooks/useAdminUsers.js`

Mongoose's `toJSON: { virtuals: true }` adds an `id` virtual (string version of `_id`). All frontend references to `.Id` (capital I) must be changed to `.id` (lowercase).

- [ ] **Step 1: Replace `.Id` with `.id` in `frontend/src/components/AdminDashboard.jsx`**

Replace all occurrences of `item.Id` with `item.id`:
- Line 256: `key={item.Id}` → `key={item.id}`
- Line 265: `#{String(item.Id).slice(0, 8)}` → `#{String(item.id).slice(0, 8)}`
- Line 283: `onDeleteGeneration(item.Id)` → `onDeleteGeneration(item.id)`

- [ ] **Step 2: Replace `.Id` with `.id` in `frontend/src/components/AdminDashboardPage.jsx`**

- Line 22: `id: item.Id` → `id: item.id`
- Line 27: `buildFakeStatus(item.Id, index)` → `buildFakeStatus(item.id, index)`
- Line 33: `item.UserId || item.Id` → `item.UserId || item.id`

- [ ] **Step 3: Replace `.Id` with `.id` in `frontend/src/components/AdminLibraryManager.jsx`**

- Line 176: `setEditingId(item.Id)` → `setEditingId(item.id)`
- Line 346: `key={item.Id}` → `key={item.id}`
- Line 445: `handleDelete(item.Id)` → `handleDelete(item.id)`

- [ ] **Step 4: Replace `.Id` with `.id` in `frontend/src/components/MixMatchPage.jsx`**

- Line 77: `key={style.Id}` → `key={style.id}`
- Line 79: `onSelect(style.Id)` → `onSelect(style.id)`
- Line 84: `selectedId === style.Id` → `selectedId === style.id`
- Line 254: `color.Id` → `color.id`
- Line 321: `c.Id == colorId` → `c.id == colorId`
- Line 325: `s.Id === selectedStyleId` → `s.id === selectedStyleId`
- Line 596: `key={brand.Id} value={brand.Id}` → `key={brand.id} value={brand.id}`
- Line 630: `selectedColors[activeTab] === color.Id` → `selectedColors[activeTab] === color.id`
- Line 633: `key={color.Id}` → `key={color.id}`

- [ ] **Step 5: Replace `.Id` with `.id` in `frontend/src/components/ProfilePage.jsx`**

- Line 163: `key={item.Id}` → `key={item.id}`
- Line 165: `#{item.Id}` → `#{item.id}`

- [ ] **Step 6: Replace `.Id` with `.id` in `frontend/src/hooks/useAdminUsers.js`**

- Line 18: `id: item.Id` → `id: item.id`

- [ ] **Step 7: Commit**

```bash
git add frontend/src/components/AdminDashboard.jsx frontend/src/components/AdminDashboardPage.jsx frontend/src/components/AdminLibraryManager.jsx frontend/src/components/MixMatchPage.jsx frontend/src/components/ProfilePage.jsx frontend/src/hooks/useAdminUsers.js
git commit -m "refactor: update frontend to use lowercase .id for MongoDB compatibility"
```

---

### Task 12: Create data migration script

**Files:**
- Create: `backend/scripts/migrate-to-mongo.js`

- [ ] **Step 1: Create `backend/scripts/migrate-to-mongo.js`**

```js
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const mssql = require("mssql");
const mongoose = require("mongoose");

const User = require("../src/models/User");
const Profile = require("../src/models/Profile");
const Generation = require("../src/models/Generation");
const RegionalLibrary = require("../src/models/RegionalLibrary");
const ColorPalette = require("../src/models/ColorPalette");
const DesignConfig = require("../src/models/DesignConfig");
const ImageMask = require("../src/models/ImageMask");
const PaintBrand = require("../src/models/PaintBrand");
const PaintColor = require("../src/models/PaintColor");
const MixMatchProject = require("../src/models/MixMatchProject");

const sqlConfig = {
  server: process.env.DB_SERVER || "localhost",
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : undefined,
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

function tryParse(val) {
  if (!val || typeof val !== "string") return val;
  try { return JSON.parse(val); } catch { return val; }
}

async function migrateTable(sqlPool, tableName, Model, transform, idMap) {
  const result = await sqlPool.request().query(`SELECT * FROM ${tableName}`);
  const rows = result.recordset || [];
  console.log(`[${tableName}] Found ${rows.length} records`);

  const tableMap = new Map();
  let successCount = 0;

  for (const row of rows) {
    try {
      const data = transform(row, idMap);
      const doc = await Model.create(data);
      tableMap.set(row.Id, doc._id);
      successCount++;
    } catch (err) {
      console.error(`[${tableName}] Error migrating row Id=${row.Id}:`, err.message);
    }
  }

  console.log(`[${tableName}] Migrated ${successCount}/${rows.length} records`);
  return tableMap;
}

async function main() {
  console.log("=== Starting SQL Server -> MongoDB Migration ===\n");

  // Connect to both databases
  console.log("Connecting to SQL Server...");
  const sqlPool = await mssql.connect(sqlConfig);
  console.log("✅ SQL Server connected\n");

  console.log("Connecting to MongoDB...");
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("✅ MongoDB connected\n");

  const idMap = {};

  // === BATCH 1: No foreign keys ===
  console.log("--- Batch 1: Tables without foreign keys ---");

  idMap.users = await migrateTable(sqlPool, "Users", User, (row) => ({
    email: row.Email,
    passwordHash: row.PasswordHash,
    role: (row.Role || "user").toLowerCase(),
    createdAt: row.CreatedAt,
  }));

  idMap.colorPalette = await migrateTable(sqlPool, "ColorPalette", ColorPalette, (row) => ({
    colorName: row.ColorName,
    hexCode: row.HexCode,
    brand: row.Brand,
    category: row.Category,
  }));

  idMap.paintBrands = await migrateTable(sqlPool, "PaintBrands", PaintBrand, (row) => ({
    brandName: row.BrandName,
    brandLogoUrl: row.BrandLogoUrl,
    description: row.Description,
    websiteUrl: row.WebsiteUrl,
    isActive: Boolean(row.IsActive),
    displayOrder: row.DisplayOrder || 0,
  }));

  idMap.regionalLibrary = await migrateTable(sqlPool, "RegionalLibrary", RegionalLibrary, (row) => ({
    regionName: row.RegionName,
    imageUrl: row.ImageUrl,
    styleData: tryParse(row.StyleData),
    description: row.Description,
    createdAt: row.CreatedAt,
  }));

  // === BATCH 2: Single foreign key ===
  console.log("\n--- Batch 2: Tables with single foreign key ---");

  idMap.profiles = await migrateTable(sqlPool, "Profiles", Profile, (row, maps) => ({
    userId: maps.users.get(row.UserId),
    areaSqm: row.AreaSqm,
    houseType: row.HouseType,
    style: row.Style,
    budget: row.Budget,
    updatedAt: row.UpdatedAt,
  }), idMap);

  idMap.generations = await migrateTable(sqlPool, "Generations", Generation, (row, maps) => ({
    userId: maps.users.get(row.UserId),
    inputDesc: row.InputDesc,
    inputImageUrl: row.InputImageUrl,
    outputImageUrl: row.OutputImageUrl,
    style: row.Style,
    palette: row.Palette,
    seed: row.Seed ? Number(row.Seed) : undefined,
    promptUsed: row.PromptUsed,
    description: row.Description,
    createdAt: row.CreatedAt,
  }), idMap);

  idMap.paintColors = await migrateTable(sqlPool, "PaintColors", PaintColor, (row, maps) => ({
    colorName: row.ColorName,
    colorCode: row.ColorCode,
    hexCode: row.HexCode,
    componentType: (row.ComponentType || "all").toLowerCase(),
    imageUrl: row.ImageUrl,
    description: row.Description,
    brandId: maps.paintBrands.get(row.BrandId),
    isActive: Boolean(row.IsActive),
  }), idMap);

  // === BATCH 3: Multiple foreign keys ===
  console.log("\n--- Batch 3: Tables with multiple foreign keys ---");

  idMap.designConfigs = await migrateTable(sqlPool, "DesignConfigs", DesignConfig, (row, maps) => ({
    generationId: maps.generations.get(row.GenerationId),
    userId: maps.users.get(row.UserId),
    configJson: tryParse(row.ConfigJson),
    isFinal: Boolean(row.IsFinal),
    updatedAt: row.UpdatedAt,
  }), idMap);

  idMap.imageMasks = await migrateTable(sqlPool, "ImageMasks", ImageMask, (row, maps) => ({
    generationId: maps.generations.get(row.GenerationId),
    label: row.Label,
    polygonData: tryParse(row.PolygonData),
    createdAt: row.CreatedAt,
  }), idMap);

  idMap.mixMatchProjects = await migrateTable(sqlPool, "MixMatchProjects", MixMatchProject, (row, maps) => ({
    userId: maps.users.get(row.UserId),
    inputImageUrl: row.InputImageUrl,
    outputImageUrl: row.OutputImageUrl,
    regionalStyleId: row.RegionalStyleId ? maps.regionalLibrary.get(row.RegionalStyleId) : null,
    wallColorId: row.WallColorId ? maps.paintColors.get(row.WallColorId) : null,
    roofColorId: row.RoofColorId ? maps.paintColors.get(row.RoofColorId) : null,
    columnColorId: row.ColumnColorId ? maps.paintColors.get(row.ColumnColorId) : null,
    customNotes: row.CustomNotes,
    promptUsed: row.PromptUsed,
    status: row.Status || "pending",
    createdAt: row.CreatedAt,
    completedAt: row.CompletedAt,
  }), idMap);

  // === Summary ===
  console.log("\n=== Migration Complete ===");
  console.log("ID Maps summary:");
  for (const [table, map] of Object.entries(idMap)) {
    console.log(`  ${table}: ${map.size} records`);
  }

  await sqlPool.close();
  await mongoose.disconnect();
  console.log("\nConnections closed. Migration finished successfully.");
  process.exit(0);
}

main().catch((err) => {
  console.error("\n❌ Migration failed:", err);
  process.exit(1);
});
```

- [ ] **Step 2: Add migration script to package.json**

Add to `backend/package.json` scripts:
```json
"migrate:mongo": "node scripts/migrate-to-mongo.js"
```

- [ ] **Step 3: Run migration**

Make sure both SQL Server and MongoDB Atlas are accessible, then:
```bash
cd backend && npm run migrate:mongo
```

Expected output: each table showing `[TableName] Migrated X/Y records` with a final summary.

- [ ] **Step 4: Verify in MongoDB Compass**

Open MongoDB Compass, connect to your Atlas cluster, and verify:
- All 10 collections exist
- Record counts match SQL Server
- Foreign key references are valid ObjectIds

- [ ] **Step 5: Commit**

```bash
git add backend/scripts/migrate-to-mongo.js backend/package.json
git commit -m "feat: add SQL Server to MongoDB data migration script"
```

---

### Task 13: Clean up — remove mssql dependency

**Files:**
- Modify: `backend/package.json`

Only do this AFTER migration is verified and the app works with MongoDB.

- [ ] **Step 1: Uninstall mssql**

```bash
cd backend && npm uninstall mssql
```

- [ ] **Step 2: Verify no remaining mssql imports**

Search for any remaining `require("mssql")` or `require("../db")` that reference the old SQL pool:

```bash
grep -r "getPool\|require.*mssql\|sql\.NVarChar\|sql\.BigInt" backend/src/
```

Expected: no results (except possibly the migration script which is in `scripts/`, not `src/`).

- [ ] **Step 3: Commit**

```bash
git add backend/package.json backend/package-lock.json
git commit -m "chore: remove mssql dependency after successful MongoDB migration"
```

---

### Task 14: Manual testing

- [ ] **Step 1: Start the server**

```bash
cd backend && npm run dev
```

Expected: `✅ Kết nối thành công tới MongoDB: exterior_ai` and `Server running on port 8000`

- [ ] **Step 2: Test auth flow**

- POST `/api/users/register` with `{ "email": "test@test.com", "password": "123456" }`
- POST `/api/users/login` with same credentials → should return JWT token
- GET `/api/secure/histories` with Bearer token → should return empty history

- [ ] **Step 3: Test admin panel**

- GET `/api/admin/stats` → should return dashboard stats
- GET `/api/admin/users` → should list all users
- GET `/api/admin/library` → should list regional library items

- [ ] **Step 4: Test Mix & Match**

- GET `/api/mixmatch/paint-brands` → should list paint brands
- GET `/api/mixmatch/paint-colors?componentType=wall` → should list wall colors
- GET `/api/mixmatch/regional-styles` → should list regional styles

- [ ] **Step 5: Test frontend**

Start the frontend dev server and verify:
- Login/register works
- Profile page shows history
- Admin dashboard loads stats and user list
- Library manager shows items with correct IDs
- Mix & Match page loads brands, colors, and styles correctly

- [ ] **Step 6: Compare record counts**

In MongoDB Compass, verify each collection has the same number of records as the original SQL Server tables.
