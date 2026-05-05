-- Database schema for AI Exterior project

CREATE DATABASE exterior_ai;
GO
USE exterior_ai;
GO

-- Users table
CREATE TABLE Users (
  Id BIGINT IDENTITY PRIMARY KEY,
  Email NVARCHAR(191) NOT NULL UNIQUE,
  PasswordHash NVARCHAR(255) NOT NULL,
  Role NVARCHAR(20) DEFAULT N'user',
  CreatedAt DATETIME2 DEFAULT SYSDATETIME()
);

-- Profiles table (Dự phòng cho tương lai)
CREATE TABLE Profiles (
  Id BIGINT IDENTITY PRIMARY KEY,
  UserId BIGINT NOT NULL,
  AreaSqm INT NULL,
  HouseType NVARCHAR(100) NULL,
  Style NVARCHAR(200) NULL,
  Budget NVARCHAR(50) NULL,
  UpdatedAt DATETIME2 DEFAULT SYSDATETIME(),
  FOREIGN KEY (UserId) REFERENCES Users(Id)
);

-- Generations table (Lịch sử sinh ảnh Ngũ Hành)
CREATE TABLE Generations (
  Id BIGINT IDENTITY PRIMARY KEY,
  UserId BIGINT NOT NULL,
  InputDesc NVARCHAR(MAX) NULL,
  InputImageUrl NVARCHAR(500) NULL,
  OutputImageUrl NVARCHAR(500) NULL,
  Style NVARCHAR(200) NULL,
  Palette NVARCHAR(200) NULL,
  Seed BIGINT NULL,
  PromptUsed NVARCHAR(MAX) NULL,
  Description NVARCHAR(MAX) NULL,   -- Mô tả bổ sung cho phương án
  CreatedAt DATETIME2 DEFAULT SYSDATETIME(),
  FOREIGN KEY (UserId) REFERENCES Users(Id)
);

-- RegionalLibrary table (Thư viện mẫu nhà vùng miền)
CREATE TABLE RegionalLibrary (
  Id INT IDENTITY PRIMARY KEY,
  RegionName NVARCHAR(50) NOT NULL,  -- Bắc, Trung, Nam, Âu
  ImageUrl NVARCHAR(500) NULL,       -- URL ảnh mẫu nhà (Cloudinary)
  StyleData NVARCHAR(MAX) NULL,      -- JSON mô tả đặc điểm kiến trúc
  Description NVARCHAR(MAX) NULL,    -- Mô tả chi tiết
  CreatedAt DATETIME2 DEFAULT SYSDATETIME()
);

-- ColorPalette table (Bảng màu Ngũ Hành)
CREATE TABLE ColorPalette (
  Id INT IDENTITY PRIMARY KEY,
  ColorName NVARCHAR(100) NULL,      -- Tên thương mại màu
  HexCode NVARCHAR(7) NULL,          -- Mã màu HEX
  Brand NVARCHAR(100) NULL,          -- Hãng sơn (Dulux, Jotun...)
  Category NVARCHAR(50) NULL         -- Phân loại (Mệnh Kim, Sơn phủ...)
);

-- DesignConfigs table (Cấu hình phối màu)
CREATE TABLE DesignConfigs (
  Id BIGINT IDENTITY PRIMARY KEY,
  GenerationId BIGINT NOT NULL,
  UserId BIGINT NOT NULL,
  ConfigJson NVARCHAR(MAX) NULL,     -- JSON phối màu
  IsFinal BIT DEFAULT 0,             -- Đánh dấu bản chốt
  UpdatedAt DATETIME2 DEFAULT SYSDATETIME(),
  FOREIGN KEY (GenerationId) REFERENCES Generations(Id) ON DELETE CASCADE,
  FOREIGN KEY (UserId) REFERENCES Users(Id)
);

-- ImageMasks table (Dữ liệu phân vùng AI - dự phòng cho tương lai)
CREATE TABLE ImageMasks (
  Id BIGINT IDENTITY PRIMARY KEY,
  GenerationId BIGINT NOT NULL,
  Label NVARCHAR(100) NULL,          -- Tên vùng (wall, roof, window)
  PolygonData NVARCHAR(MAX) NULL,    -- Tọa độ polygon JSON
  CreatedAt DATETIME2 DEFAULT SYSDATETIME(),
  FOREIGN KEY (GenerationId) REFERENCES Generations(Id) ON DELETE CASCADE
);

-- =============================================
-- MODULE MIX & MATCH
-- =============================================

-- PaintBrands table (Thương hiệu sơn)
CREATE TABLE PaintBrands (
  Id INT IDENTITY PRIMARY KEY,
  BrandName NVARCHAR(100) NOT NULL,  -- Tên hãng sơn (Dulux, Jotun, Nippon...)
  BrandLogoUrl NVARCHAR(500) NULL,   -- URL logo hãng sơn
  Description NVARCHAR(MAX) NULL,    -- Mô tả hãng sơn
  IsActive BIT DEFAULT 1,            -- Trạng thái hoạt động
  DisplayOrder INT DEFAULT 0         -- Thứ tự hiển thị
);

-- PaintColors table (Màu sơn thực tế theo hãng)
CREATE TABLE PaintColors (
  Id INT IDENTITY PRIMARY KEY,
  ColorName NVARCHAR(100) NULL,      -- Tên màu (VD: Trắng Ngọc Trai)
  ColorCode NVARCHAR(50) NULL,       -- Mã sơn của hãng (VD: NP OW 1009 P)
  HexCode NVARCHAR(7) NULL,          -- Mã màu HEX (#FFFFFF)
  ComponentType NVARCHAR(50) NULL,   -- Loại bộ phận: wall / roof / column / all
  ImageUrl NVARCHAR(500) NULL,       -- URL ảnh mẫu màu
  Description NVARCHAR(MAX) NULL,    -- Mô tả màu
  BrandId INT NOT NULL,              -- FK → PaintBrands
  IsActive BIT DEFAULT 1,            -- Trạng thái hoạt động
  FOREIGN KEY (BrandId) REFERENCES PaintBrands(Id)
);

-- MixMatchProjects table (Dự án phối màu Mix & Match)
CREATE TABLE MixMatchProjects (
  Id BIGINT IDENTITY PRIMARY KEY,
  UserId BIGINT NOT NULL,
  InputImageUrl NVARCHAR(500) NULL,      -- Ảnh nhà thô (Cloudinary)
  OutputImageUrl NVARCHAR(500) NULL,     -- Ảnh kết quả AI (Cloudinary)
  RegionalStyleId INT NULL,              -- FK → RegionalLibrary (phong cách vùng miền)
  WallColorId INT NULL,                  -- FK → PaintColors (màu tường)
  RoofColorId INT NULL,                  -- FK → PaintColors (màu mái)
  ColumnColorId INT NULL,                -- FK → PaintColors (màu cột)
  CustomNotes NVARCHAR(MAX) NULL,        -- Ghi chú tùy chỉnh của user
  PromptUsed NVARCHAR(MAX) NULL,         -- Prompt gửi cho AI
  Status NVARCHAR(50) DEFAULT N'pending', -- Trạng thái: pending / completed / failed
  CreatedAt DATETIME2 DEFAULT SYSDATETIME(),
  CompletedAt DATETIME2 NULL,            -- Thời điểm hoàn thành
  FOREIGN KEY (UserId) REFERENCES Users(Id),
  FOREIGN KEY (RegionalStyleId) REFERENCES RegionalLibrary(Id),
  FOREIGN KEY (WallColorId) REFERENCES PaintColors(Id),
  FOREIGN KEY (RoofColorId) REFERENCES PaintColors(Id),
  FOREIGN KEY (ColumnColorId) REFERENCES PaintColors(Id)
);
