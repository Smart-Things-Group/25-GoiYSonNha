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

-- Profiles table
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

-- Generations table
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
  CreatedAt DATETIME2 DEFAULT SYSDATETIME(),
  FOREIGN KEY (UserId) REFERENCES Users(Id)
);

-- RegionalLibrary table (Thư viện mẫu nhà vùng miền) [MỚI]
CREATE TABLE RegionalLibrary (
  Id INT IDENTITY PRIMARY KEY,
  RegionName NVARCHAR(50) NOT NULL,  -- Bắc, Trung, Nam, Âu
  ImageUrl NVARCHAR(500) NULL,       -- URL ảnh mẫu nhà (Cloudinary)
  StyleData NVARCHAR(MAX) NULL,      -- JSON mô tả đặc điểm kiến trúc
  Description NVARCHAR(MAX) NULL,    -- Mô tả chi tiết
  CreatedAt DATETIME2 DEFAULT SYSDATETIME()
);

-- ColorPalette table (Bảng màu sắc)
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

-- ImageMasks table (Dữ liệu phân vùng AI)
CREATE TABLE ImageMasks (
  Id BIGINT IDENTITY PRIMARY KEY,
  GenerationId BIGINT NOT NULL,
  Label NVARCHAR(100) NULL,          -- Tên vùng (wall, roof, window)
  PolygonData NVARCHAR(MAX) NULL,    -- Tọa độ polygon JSON
  CreatedAt DATETIME2 DEFAULT SYSDATETIME(),
  FOREIGN KEY (GenerationId) REFERENCES Generations(Id) ON DELETE CASCADE
);

