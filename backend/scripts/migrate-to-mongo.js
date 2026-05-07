/**
 * SQL Server → MongoDB Migration Script
 *
 * Usage:
 *   1. Set environment variables in backend/.env:
 *      - SQL_SERVER, SQL_DATABASE, SQL_USER, SQL_PASSWORD (or SQL_CONN_STRING)
 *      - MONGODB_URI
 *   2. Run: node backend/scripts/migrate-to-mongo.js
 *
 * This script reads all data from SQL Server and inserts it into MongoDB,
 * mapping old BIGINT/INT IDs to new ObjectIds while preserving foreign key relationships.
 */

const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const sql = require("mssql");
const mongoose = require("mongoose");

// Import all Mongoose models
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

// ID mapping: oldSqlId → newMongoObjectId
const idMap = {
  users: new Map(),
  generations: new Map(),
  regionalLibrary: new Map(),
  colorPalette: new Map(),
  paintBrands: new Map(),
  paintColors: new Map(),
};

async function connectSQL() {
  const config = {
    server: process.env.DB_SERVER || process.env.SQL_SERVER || "localhost",
    database: process.env.DB_NAME || process.env.SQL_DATABASE || "exterior_ai",
    user: process.env.DB_USER || process.env.SQL_USER,
    password: process.env.DB_PASS || process.env.SQL_PASSWORD,
    port: parseInt(process.env.DB_PORT) || 1433,
    options: {
      encrypt: false,
      trustServerCertificate: true,
    },
  };

  if (process.env.SQL_CONN_STRING) {
    return sql.connect(process.env.SQL_CONN_STRING);
  }

  return sql.connect(config);
}

async function connectMongo() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not defined in .env");
  await mongoose.connect(uri);
  console.log(`Connected to MongoDB: ${mongoose.connection.name}`);
}

function tryParseJSON(str) {
  if (!str || typeof str !== "string") return str;
  try {
    return JSON.parse(str);
  } catch {
    return str;
  }
}

async function migrateUsers(pool) {
  console.log("\n--- Migrating Users ---");
  const result = await pool.request().query("SELECT * FROM Users ORDER BY Id");
  const rows = result.recordset;
  console.log(`  Found ${rows.length} users in SQL`);

  for (const row of rows) {
    const doc = await User.create({
      email: row.Email,
      passwordHash: row.PasswordHash,
      role: (row.Role || "user").toLowerCase(),
      createdAt: row.CreatedAt,
    });
    idMap.users.set(row.Id, doc._id);
  }
  console.log(`  Migrated ${idMap.users.size} users`);
}

async function migrateProfiles(pool) {
  console.log("\n--- Migrating Profiles ---");
  const result = await pool.request().query("SELECT * FROM Profiles ORDER BY Id");
  const rows = result.recordset;
  console.log(`  Found ${rows.length} profiles in SQL`);

  let count = 0;
  for (const row of rows) {
    const userId = idMap.users.get(row.UserId);
    if (!userId) {
      console.warn(`  Skipping profile ${row.Id}: user ${row.UserId} not found`);
      continue;
    }
    await Profile.create({
      userId,
      areaSqm: row.AreaSqm,
      houseType: row.HouseType,
      style: row.Style,
      budget: row.Budget,
      updatedAt: row.UpdatedAt,
    });
    count++;
  }
  console.log(`  Migrated ${count} profiles`);
}

async function migrateGenerations(pool) {
  console.log("\n--- Migrating Generations ---");
  const result = await pool.request().query("SELECT * FROM Generations ORDER BY Id");
  const rows = result.recordset;
  console.log(`  Found ${rows.length} generations in SQL`);

  for (const row of rows) {
    const userId = idMap.users.get(row.UserId);
    if (!userId) {
      console.warn(`  Skipping generation ${row.Id}: user ${row.UserId} not found`);
      continue;
    }
    const doc = await Generation.create({
      userId,
      inputDesc: row.InputDesc,
      inputImageUrl: row.InputImageUrl,
      outputImageUrl: row.OutputImageUrl,
      style: row.Style,
      palette: row.Palette,
      seed: row.Seed,
      promptUsed: row.PromptUsed,
      description: row.Description,
      createdAt: row.CreatedAt,
    });
    idMap.generations.set(row.Id, doc._id);
  }
  console.log(`  Migrated ${idMap.generations.size} generations`);
}

async function migrateRegionalLibrary(pool) {
  console.log("\n--- Migrating RegionalLibrary ---");
  const result = await pool.request().query("SELECT * FROM RegionalLibrary ORDER BY Id");
  const rows = result.recordset;
  console.log(`  Found ${rows.length} regional library items in SQL`);

  for (const row of rows) {
    const doc = await RegionalLibrary.create({
      regionName: row.RegionName,
      imageUrl: row.ImageUrl,
      styleData: tryParseJSON(row.StyleData),
      description: row.Description,
      createdAt: row.CreatedAt,
    });
    idMap.regionalLibrary.set(row.Id, doc._id);
  }
  console.log(`  Migrated ${idMap.regionalLibrary.size} regional library items`);
}

async function migrateColorPalette(pool) {
  console.log("\n--- Migrating ColorPalette ---");
  const result = await pool.request().query("SELECT * FROM ColorPalette ORDER BY Id");
  const rows = result.recordset;
  console.log(`  Found ${rows.length} color palette items in SQL`);

  for (const row of rows) {
    const doc = await ColorPalette.create({
      colorName: row.ColorName,
      hexCode: row.HexCode,
      brand: row.Brand,
      category: row.Category,
    });
    idMap.colorPalette.set(row.Id, doc._id);
  }
  console.log(`  Migrated ${idMap.colorPalette.size} color palette items`);
}

async function migrateDesignConfigs(pool) {
  console.log("\n--- Migrating DesignConfigs ---");
  const result = await pool.request().query("SELECT * FROM DesignConfigs ORDER BY Id");
  const rows = result.recordset;
  console.log(`  Found ${rows.length} design configs in SQL`);

  let count = 0;
  for (const row of rows) {
    const generationId = idMap.generations.get(row.GenerationId);
    const userId = idMap.users.get(row.UserId);
    if (!generationId || !userId) {
      console.warn(`  Skipping design config ${row.Id}: generation or user not found`);
      continue;
    }
    await DesignConfig.create({
      generationId,
      userId,
      configJson: tryParseJSON(row.ConfigJson),
      isFinal: !!row.IsFinal,
      updatedAt: row.UpdatedAt,
    });
    count++;
  }
  console.log(`  Migrated ${count} design configs`);
}

async function migrateImageMasks(pool) {
  console.log("\n--- Migrating ImageMasks ---");
  const result = await pool.request().query("SELECT * FROM ImageMasks ORDER BY Id");
  const rows = result.recordset;
  console.log(`  Found ${rows.length} image masks in SQL`);

  let count = 0;
  for (const row of rows) {
    const generationId = idMap.generations.get(row.GenerationId);
    if (!generationId) {
      console.warn(`  Skipping image mask ${row.Id}: generation not found`);
      continue;
    }
    await ImageMask.create({
      generationId,
      label: row.Label,
      polygonData: tryParseJSON(row.PolygonData),
      createdAt: row.CreatedAt,
    });
    count++;
  }
  console.log(`  Migrated ${count} image masks`);
}

async function migratePaintBrands(pool) {
  console.log("\n--- Migrating PaintBrands ---");
  const result = await pool.request().query("SELECT * FROM PaintBrands ORDER BY Id");
  const rows = result.recordset;
  console.log(`  Found ${rows.length} paint brands in SQL`);

  for (const row of rows) {
    const doc = await PaintBrand.create({
      brandName: row.BrandName,
      brandLogoUrl: row.BrandLogoUrl,
      description: row.Description,
      websiteUrl: null,
      isActive: !!row.IsActive,
      displayOrder: row.DisplayOrder || 0,
    });
    idMap.paintBrands.set(row.Id, doc._id);
  }
  console.log(`  Migrated ${idMap.paintBrands.size} paint brands`);
}

async function migratePaintColors(pool) {
  console.log("\n--- Migrating PaintColors ---");
  const result = await pool.request().query("SELECT * FROM PaintColors ORDER BY Id");
  const rows = result.recordset;
  console.log(`  Found ${rows.length} paint colors in SQL`);

  for (const row of rows) {
    const brandId = idMap.paintBrands.get(row.BrandId);
    if (!brandId) {
      console.warn(`  Skipping paint color ${row.Id}: brand ${row.BrandId} not found`);
      continue;
    }
    const doc = await PaintColor.create({
      brandId,
      colorName: row.ColorName,
      colorCode: row.ColorCode,
      hexCode: row.HexCode,
      componentType: (row.ComponentType || "all").toLowerCase(),
      imageUrl: row.ImageUrl,
      description: row.Description,
      isActive: row.IsActive !== undefined ? !!row.IsActive : true,
    });
    idMap.paintColors.set(row.Id, doc._id);
  }
  console.log(`  Migrated ${idMap.paintColors.size} paint colors`);
}

async function migrateMixMatchProjects(pool) {
  console.log("\n--- Migrating MixMatchProjects ---");
  const result = await pool.request().query("SELECT * FROM MixMatchProjects ORDER BY Id");
  const rows = result.recordset;
  console.log(`  Found ${rows.length} mix match projects in SQL`);

  let count = 0;
  for (const row of rows) {
    const userId = idMap.users.get(row.UserId);
    if (!userId) {
      console.warn(`  Skipping mix match project ${row.Id}: user ${row.UserId} not found`);
      continue;
    }

    await MixMatchProject.create({
      userId,
      inputImageUrl: row.InputImageUrl,
      outputImageUrl: row.OutputImageUrl,
      regionalStyleId: row.RegionalStyleId ? idMap.regionalLibrary.get(row.RegionalStyleId) || null : null,
      wallColorId: row.WallColorId ? idMap.paintColors.get(row.WallColorId) || null : null,
      roofColorId: row.RoofColorId ? idMap.paintColors.get(row.RoofColorId) || null : null,
      columnColorId: row.ColumnColorId ? idMap.paintColors.get(row.ColumnColorId) || null : null,
      customNotes: row.CustomNotes,
      promptUsed: row.PromptUsed,
      status: (row.Status || "pending").toLowerCase(),
      createdAt: row.CreatedAt,
      completedAt: row.CompletedAt,
    });
    count++;
  }
  console.log(`  Migrated ${count} mix match projects`);
}

async function main() {
  console.log("=== SQL Server → MongoDB Migration ===\n");

  try {
    // Connect to both databases
    console.log("Connecting to SQL Server...");
    const pool = await connectSQL();
    console.log("Connected to SQL Server");

    console.log("Connecting to MongoDB...");
    await connectMongo();

    // Clear existing MongoDB data before migration
    console.log("\nClearing existing MongoDB collections...");
    const collections = [User, Profile, Generation, RegionalLibrary, ColorPalette, DesignConfig, ImageMask, PaintBrand, PaintColor, MixMatchProject];
    for (const Model of collections) {
      const deleted = await Model.deleteMany({});
      if (deleted.deletedCount > 0) {
        console.log(`  Cleared ${Model.modelName}: ${deleted.deletedCount} docs`);
      }
    }

    // Migrate tables in dependency order
    await migrateUsers(pool);
    await migrateProfiles(pool);
    await migrateGenerations(pool);
    await migrateRegionalLibrary(pool);
    await migrateColorPalette(pool);
    await migrateDesignConfigs(pool);
    await migrateImageMasks(pool);
    await migratePaintBrands(pool);
    await migratePaintColors(pool);
    await migrateMixMatchProjects(pool);

    // Summary
    console.log("\n=== Migration Complete ===");
    console.log(`  Users:            ${idMap.users.size}`);
    console.log(`  Generations:      ${idMap.generations.size}`);
    console.log(`  Regional Library: ${idMap.regionalLibrary.size}`);
    console.log(`  Color Palette:    ${idMap.colorPalette.size}`);
    console.log(`  Paint Brands:     ${idMap.paintBrands.size}`);
    console.log(`  Paint Colors:     ${idMap.paintColors.size}`);

    // Close connections
    await pool.close();
    await mongoose.disconnect();
    console.log("\nConnections closed. Done!");
  } catch (err) {
    console.error("\nMigration failed:", err);
    process.exit(1);
  }
}

main();
