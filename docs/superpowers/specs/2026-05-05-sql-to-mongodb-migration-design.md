# SQL Server to MongoDB Migration Design

**Date:** 2026-05-05
**Status:** Approved
**Approach:** Big Bang (full migration at once)

## Context

NgoaiThat-AI currently uses Microsoft SQL Server (`mssql` npm package) with 10 tables. The goal is to migrate entirely to MongoDB Atlas using Mongoose as the ODM. Data structure will remain similar to SQL (each table = 1 collection with references instead of embedded documents).

## Mongoose Models

All models go in `backend/src/models/`. Each SQL table maps to one Mongoose model.

### User.js (from Users table)

```js
{
  email: { type: String, required: true, unique: true, maxlength: 191 },
  passwordHash: { type: String, required: true, maxlength: 255 },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  createdAt: { type: Date, default: Date.now }
}
```

### Profile.js (from Profiles table)

```js
{
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  areaSqm: Number,
  houseType: { type: String, maxlength: 100 },
  style: { type: String, maxlength: 200 },
  budget: { type: String, maxlength: 50 },
  updatedAt: { type: Date, default: Date.now }
}
```

### Generation.js (from Generations table)

```js
{
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  inputDesc: String,
  inputImageUrl: { type: String, maxlength: 500 },
  outputImageUrl: { type: String, maxlength: 500 },
  style: { type: String, maxlength: 200 },
  palette: { type: String, maxlength: 200 },
  seed: Number,
  promptUsed: String,
  description: String,
  createdAt: { type: Date, default: Date.now }
}
```

### RegionalLibrary.js (from RegionalLibrary table)

```js
{
  regionName: { type: String, maxlength: 50 },
  imageUrl: { type: String, maxlength: 500 },
  styleData: { type: Schema.Types.Mixed },  // stored as Object, not JSON string
  description: String,
  createdAt: { type: Date, default: Date.now }
}
```

### ColorPalette.js (from ColorPalette table)

```js
{
  colorName: { type: String, maxlength: 100 },
  hexCode: { type: String, maxlength: 7 },
  brand: { type: String, maxlength: 100 },
  category: { type: String, maxlength: 50 }
}
```

### DesignConfig.js (from DesignConfigs table)

```js
{
  generationId: { type: Schema.Types.ObjectId, ref: 'Generation', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  configJson: { type: Schema.Types.Mixed },  // stored as Object, not JSON string
  isFinal: { type: Boolean, default: false },
  updatedAt: { type: Date, default: Date.now }
}
```

### ImageMask.js (from ImageMasks table)

```js
{
  generationId: { type: Schema.Types.ObjectId, ref: 'Generation', required: true },
  label: { type: String, maxlength: 100 },
  polygonData: { type: Schema.Types.Mixed },  // stored as Object, not JSON string
  createdAt: { type: Date, default: Date.now }
}
```

### PaintBrand.js (from PaintBrands table)

```js
{
  brandName: { type: String, maxlength: 100 },
  brandLogoUrl: { type: String, maxlength: 500 },
  description: String,
  isActive: { type: Boolean, default: true },
  displayOrder: { type: Number, default: 0 }
}
```

### PaintColor.js (from PaintColors table)

```js
{
  colorName: { type: String, maxlength: 100 },
  colorCode: { type: String, maxlength: 50 },
  hexCode: { type: String, maxlength: 7 },
  componentType: { type: String, enum: ['wall', 'roof', 'column', 'all'], maxlength: 50 },
  imageUrl: String,
  description: String,
  brandId: { type: Schema.Types.ObjectId, ref: 'PaintBrand', required: true },
  isActive: { type: Boolean, default: true }
}
```

### MixMatchProject.js (from MixMatchProjects table)

```js
{
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  inputImageUrl: String,
  outputImageUrl: String,
  regionalStyleId: { type: Schema.Types.ObjectId, ref: 'RegionalLibrary' },
  wallColorId: { type: Schema.Types.ObjectId, ref: 'PaintColor' },
  roofColorId: { type: Schema.Types.ObjectId, ref: 'PaintColor' },
  columnColorId: { type: Schema.Types.ObjectId, ref: 'PaintColor' },
  customNotes: String,
  promptUsed: String,
  status: { type: String, default: 'pending', maxlength: 50 },
  createdAt: { type: Date, default: Date.now },
  completedAt: Date
}
```

## Connection Layer

### db.js replacement

Replace the entire `backend/src/db.js` with Mongoose connection:

- Use `mongoose.connect(process.env.MONGODB_URI)` with Atlas connection string
- Export `connectDB()` async function
- Export `mongoose` instance for direct access if needed
- Connection options: `retryWrites=true`, `w=majority` (Atlas defaults)

### Environment Variables

**Add:**
- `MONGODB_URI` — MongoDB Atlas connection string (format: `mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/<dbname>`)

**Remove (after migration complete):**
- `DB_SERVER`, `DB_NAME`, `DB_PORT`, `DB_USER`, `DB_PASS`, `DB_AUTH`, `DB_DOMAIN`

### app.js changes

- Import `connectDB` from new `db.js`
- Call `await connectDB()` before `app.listen()`
- Remove all `mssql`-related imports

## Route Changes

### users.js

| Operation | SQL (current) | Mongoose (new) |
|-----------|--------------|----------------|
| Register | `INSERT INTO Users (Email, PasswordHash, Role, CreatedAt)` | `User.create({ email, passwordHash, role: 'user' })` |
| Login | `SELECT * FROM Users WHERE Email = @Email` | `User.findOne({ email })` |
| List users | `SELECT U.*, COUNT(G.Id)... FROM Users U LEFT JOIN Generations G...` | `User.aggregate([{ $lookup: { from: 'generations', localField: '_id', foreignField: 'userId', as: 'generations' } }, { $addFields: { generationCount: { $size: '$generations' } } }])` or two separate queries |

### histories.js

| Operation | SQL | Mongoose |
|-----------|-----|---------|
| Count | `SELECT COUNT(*) FROM Generations WHERE UserId = @UserId` | `Generation.countDocuments({ userId })` |
| List | `SELECT...ORDER BY CreatedAt DESC OFFSET...FETCH NEXT` | `Generation.find({ userId }).sort({ createdAt: -1 }).skip(offset).limit(pageSize)` |

### wizard.js

| Operation | SQL | Mongoose |
|-----------|-----|---------|
| Save generation | `INSERT INTO Generations (UserId, InputImageUrl, OutputImageUrl, Style, PromptUsed, CreatedAt)` | `Generation.create({ userId, inputImageUrl, outputImageUrl, style, promptUsed })` |

AI service logic (Gemini, Stability AI, etc.) remains completely unchanged.

### admin.js

Most complex file — 15 endpoints:

| Operation | SQL | Mongoose |
|-----------|-----|---------|
| Stats dashboard | Multi-resultset query | Multiple queries: `User.countDocuments()`, `Generation.countDocuments()`, `Generation.aggregate()` for top styles/users |
| User CRUD | Direct SQL INSERT/UPDATE/DELETE | `User.create()`, `User.findByIdAndUpdate()`, `User.findByIdAndDelete()` |
| Generation CRUD | SQL with JOIN to Users | `Generation.find().populate('userId')`, `Generation.findByIdAndDelete()` |
| Library CRUD | Direct SQL | `RegionalLibrary.create()`, `.findByIdAndUpdate()`, `.findByIdAndDelete()` |
| PDF export | SQL query then pdfkit | `Generation.findById().populate('userId')` then same pdfkit logic |

### mixmatch.js

| Operation | SQL | Mongoose |
|-----------|-----|---------|
| List styles | `SELECT...FROM RegionalLibrary` | `RegionalLibrary.find()` |
| List brands | `SELECT...FROM PaintBrands WHERE IsActive = 1` | `PaintBrand.find({ isActive: true })` |
| List colors | `SELECT...JOIN PaintBrands` | `PaintColor.find({ componentType, brandId }).populate('brandId')` |
| Generate | SQL with interpolated `colorIds` (**SQL injection risk**) | `PaintColor.find({ _id: { $in: colorIds } })` — **injection fixed** |
| Save project | `INSERT INTO MixMatchProjects` | `MixMatchProject.create({...})` |
| History | Complex 5-table JOIN | `MixMatchProject.find({ userId }).populate('regionalStyleId wallColorId roofColorId columnColorId')` |

### colors.js (via colorService)

`SELECT * FROM ColorPalette ORDER BY Brand, ColorName` → `ColorPalette.find().sort({ brand: 1, colorName: 1 })`

### designs.js (via designService)

- Save: `IF EXISTS...UPDATE...ELSE INSERT` → `DesignConfig.findOneAndUpdate({ generationId }, {...}, { upsert: true, new: true })`
- Get: `SELECT ConfigJson FROM DesignConfigs WHERE GenerationId = @id` → `DesignConfig.findOne({ generationId })`

## Service Changes

| Service | Changes |
|---------|---------|
| `colorService.js` | SQL query → Mongoose query (see above) |
| `designService.js` | SQL queries → Mongoose queries (see above) |
| `adminSeeder.js` | SQL queries → `User.findOne()`, `User.create()`, `User.findByIdAndUpdate()` |
| `cloud.js` | No changes (Cloudinary, not DB-related) |
| `gemini.js` | No changes (AI service) |
| `external-ai.js` | No changes (AI service) |
| `aws.js` | No changes (AWS services) |

## Middleware Changes

| Middleware | Changes |
|-----------|---------|
| `auth.js` | `SELECT...FROM Users WHERE Id = @Id` → `User.findById(userId).select('_id email role')` |
| `isAdmin.js` | No changes (checks `req.user.role`) |
| `asyncHandler.js` | No changes |
| `respond.js` | No changes |
| `error.js` | No changes |
| `activityLogger.js` | No changes |

## Data Migration

### Script: `backend/scripts/migrate-to-mongo.js`

A one-time script that connects to both SQL Server and MongoDB simultaneously, reads all SQL data, and inserts into MongoDB collections.

### Migration order (respecting foreign key dependencies):

**Batch 1 — No foreign keys:**
1. `Users` → `users` collection
2. `ColorPalette` → `colorpalettes` collection
3. `PaintBrands` → `paintbrands` collection
4. `RegionalLibrary` → `regionallibraries` collection

**Batch 2 — Single foreign key:**
5. `Profiles` → `profiles` collection (needs User ID mapping)
6. `Generations` → `generations` collection (needs User ID mapping)
7. `PaintColors` → `paintcolors` collection (needs PaintBrand ID mapping)

**Batch 3 — Multiple foreign keys:**
8. `DesignConfigs` → `designconfigs` collection (needs Generation + User ID mapping)
9. `ImageMasks` → `imagemasks` collection (needs Generation ID mapping)
10. `MixMatchProjects` → `mixmatchprojects` collection (needs User + RegionalLibrary + PaintColor ID mapping)

### ID Mapping Strategy

Maintain in-memory `Map<oldSqlId, newObjectId>` for each table. When inserting records with foreign keys, look up the new ObjectId from the map.

### Data transformations during migration:
- `StyleData` (NVARCHAR JSON string) → parsed JavaScript Object
- `ConfigJson` (NVARCHAR JSON string) → parsed JavaScript Object
- `PolygonData` (NVARCHAR JSON string) → parsed JavaScript Object
- `DATETIME2` → JavaScript `Date`
- `BIT` → JavaScript `Boolean`
- `BIGINT IDENTITY` → MongoDB `ObjectId` (with mapping preserved)

### Script behavior:
- Connects to both databases
- Migrates in dependency order
- Logs progress: `[TableName] Migrated X/Y records`
- Logs errors with row details for debugging
- Exits with code 0 on success, 1 on failure

## Package Changes

### package.json

**Add:**
- `mongoose` — MongoDB ODM

**Remove (after migration verified):**
- `mssql` — SQL Server driver

**Temporary (during migration only):**
- Keep both `mssql` and `mongoose` until migration script runs successfully

## Frontend Changes

**None.** The frontend API files (`auth.js`, `wizard.js`, `mixmatch.js`, `admin.js`) communicate via HTTP endpoints. The API contract (request/response format) stays identical. The only difference is internal: `Id` (number) becomes `_id` (string) in responses, but the frontend already accesses these as `item.Id` or `item.id` — Mongoose can handle this via `toJSON` virtuals or we ensure response mapping.

### ID field handling

SQL Server returns `Id` (number). MongoDB returns `_id` (ObjectId string). Two changes needed:

1. **Backend:** Configure all Mongoose schemas with `toJSON: { virtuals: true }` and `toObject: { virtuals: true }`. Mongoose automatically provides a virtual `id` field (string version of `_id`). This ensures API responses include both `_id` and `id`.
2. **Frontend:** Search all frontend code for references to `.Id` (capital I) and update to `.id` (lowercase) or `._id`. This includes component props, API response handling, and URL params that use record IDs.

## Testing Strategy

Manual verification after migration:
1. Auth flow: register → login → get token → access protected routes
2. Wizard flow: upload sample → generate style → generate final
3. Mix & Match flow: select colors → upload image → generate
4. Admin panel: stats, user CRUD, generation CRUD, library CRUD
5. Data integrity: compare record counts SQL vs MongoDB via Compass
