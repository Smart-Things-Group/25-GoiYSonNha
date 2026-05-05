# Design: Chuyển đổi SQL Server sang MongoDB

**Ngày:** 2026-03-02
**Mục tiêu:** Thay thế Microsoft SQL Server bằng MongoDB Atlas + Mongoose ODM để dễ deploy hơn (free tier, không cần license).
**Phạm vi:** Chỉ backend. Frontend không thay đổi.

## Quyết định

- **Database:** MongoDB Atlas (free tier 512MB)
- **ODM:** Mongoose
- **Dữ liệu:** Bắt đầu mới, không migrate dữ liệu cũ

## Mongoose Models

| SQL Table | Mongoose Model | Ghi chú |
|---|---|---|
| Users + Profiles | `User` | Profiles embed (1:1) |
| Generations | `Generation` | ref → User |
| RegionalLibrary | `RegionalLibrary` | Giữ nguyên |
| ColorPalette | `ColorPalette` | Giữ nguyên |
| DesignConfigs | `DesignConfig` | ref → Generation, User |
| ImageMasks | `ImageMask` | ref → Generation |
| PaintBrands | `PaintBrand` | isActive, displayOrder |
| PaintColors | `PaintColor` | ref → PaintBrand |
| MixMatchProjects | `MixMatchProject` | ref → User, RegionalLibrary, PaintColor x3 |

### Schema chi tiết

#### User
```js
{
  email:        { type: String, required: true, unique: true, maxlength: 191 },
  passwordHash: { type: String, required: true },
  role:         { type: String, enum: ['user', 'admin'], default: 'user' },
  profile: {
    areaSqm:   Number,
    houseType: String,
    style:     String,
    budget:    String,
  }
}
// timestamps: true → createdAt, updatedAt
```

#### Generation
```js
{
  userId:         { type: ObjectId, ref: 'User', required: true },
  inputDesc:      String,
  inputImageUrl:  String,
  outputImageUrl: String,
  style:          String,
  palette:        String,
  seed:           Number,
  promptUsed:     String,
  description:    String,
}
// timestamps: true
```

#### RegionalLibrary
```js
{
  regionName:  { type: String, required: true },
  imageUrl:    String,
  styleData:   String, // JSON string
  description: String,
}
// timestamps: true
```

#### ColorPalette
```js
{
  colorName: String,
  hexCode:   String,
  brand:     String,
  category:  String,
}
```

#### DesignConfig
```js
{
  generationId: { type: ObjectId, ref: 'Generation', required: true },
  userId:       { type: ObjectId, ref: 'User', required: true },
  configJson:   String,
  isFinal:      { type: Boolean, default: false },
}
// timestamps: true (updatedAt thay cho UpdatedAt cũ)
```

#### ImageMask
```js
{
  generationId: { type: ObjectId, ref: 'Generation', required: true },
  label:        String,
  polygonData:  String, // JSON string
}
// timestamps: true
```

#### PaintBrand
```js
{
  brandName:    { type: String, required: true },
  brandLogoUrl: String,
  description:  String,
  isActive:     { type: Boolean, default: true },
  displayOrder: { type: Number, default: 0 },
}
```

#### PaintColor
```js
{
  colorName:     String,
  colorCode:     String,
  hexCode:       String,
  componentType: String, // 'wall' | 'roof' | 'column' | 'all'
  imageUrl:      String,
  description:   String,
  brandId:       { type: ObjectId, ref: 'PaintBrand', required: true },
  isActive:      { type: Boolean, default: true },
}
```

#### MixMatchProject
```js
{
  userId:          { type: ObjectId, ref: 'User', required: true },
  inputImageUrl:   String,
  outputImageUrl:  String,
  regionalStyleId: { type: ObjectId, ref: 'RegionalLibrary' },
  wallColorId:     { type: ObjectId, ref: 'PaintColor' },
  roofColorId:     { type: ObjectId, ref: 'PaintColor' },
  columnColorId:   { type: ObjectId, ref: 'PaintColor' },
  customNotes:     String,
  promptUsed:      String,
  status:          { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
  completedAt:     Date,
}
// timestamps: true
```

## Database Connection

### Trước (db.js - MSSQL)
- Singleton ConnectionPool với config NTLM/SQL auth
- `getPool()` → pool.request().input().query()
- 7 env variables: DB_SERVER, DB_NAME, DB_USER, DB_PASS, DB_PORT, DB_AUTH, DB_DOMAIN

### Sau (db.js - Mongoose)
- `mongoose.connect(MONGODB_URI)`
- Models import trực tiếp
- 1 env variable: `MONGODB_URI`

## Files cần thay đổi

### Files mới (9 files)
```
backend/src/models/
  User.js
  Generation.js
  RegionalLibrary.js
  ColorPalette.js
  DesignConfig.js
  ImageMask.js
  PaintBrand.js
  PaintColor.js
  MixMatchProject.js
```

### Files sửa (14 files)
```
backend/package.json          — mssql → mongoose
backend/src/db.js             — viết lại hoàn toàn
backend/src/routes/users.js   — raw SQL → Mongoose queries
backend/src/routes/histories.js
backend/src/routes/wizard.js
backend/src/routes/admin.js
backend/src/routes/designs.js
backend/src/routes/colors.js
backend/src/routes/mixmatch.js
backend/src/routes/library.js
backend/src/services/designService.js
backend/src/services/colorService.js
backend/src/services/adminSeeder.js
backend/src/middlewares/auth.js
```

### Frontend: Không thay đổi
API response format giữ nguyên, frontend không cần sửa.

## Query Migration Patterns

| Pattern | MSSQL | Mongoose |
|---|---|---|
| Pagination | `OFFSET...FETCH NEXT` | `.skip(offset).limit(pageSize)` |
| Count | `SELECT COUNT(*)` | `.countDocuments(filter)` |
| Batch queries | `multipleStatements` | `Promise.all([...])` |
| Upsert | `IF EXISTS...UPDATE ELSE INSERT` | `.findOneAndUpdate({}, {}, { upsert: true })` |
| JOIN | `INNER JOIN` / `LEFT JOIN` | `.populate('field', 'select')` |
| TOP N | `SELECT TOP 5` | `.limit(5)` |
| LIKE search | `Email LIKE @Search` | `{ email: { $regex: search, $options: 'i' } }` |
| Date filter | `CAST(CreatedAt AS date)` | `{ createdAt: { $gte: startOfDay } }` |
| Auto ID | `BIGINT IDENTITY` | `ObjectId` (tự động) |
| Boolean | `BIT DEFAULT 0` | `Boolean, default: false` |

## Env Variables

### Xóa
```
DB_SERVER, DB_NAME, DB_USER, DB_PASS, DB_PORT, DB_AUTH, DB_DOMAIN
```

### Thêm
```
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/exterior_ai?retryWrites=true&w=majority
```

### Giữ nguyên
```
JWT_SECRET, PORT, CLOUDINARY_*, GEMINI_API_KEY, ...
```
