-- ========================================
-- Mix & Match Feature - Database Migration
-- Date: 2026-01-22
-- Description: Add tables for Paint Brands, Paint Colors, and Mix & Match Projects
-- ========================================

USE [exterior_ai]
GO

-- ========================================
-- 1. CREATE PaintBrands TABLE
-- ========================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'PaintBrands')
BEGIN
    CREATE TABLE PaintBrands (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        BrandName NVARCHAR(100) NOT NULL UNIQUE,
        BrandLogoUrl NVARCHAR(500) NULL,
        Description NVARCHAR(MAX) NULL,
        WebsiteUrl NVARCHAR(500) NULL,
        IsActive BIT DEFAULT 1,
        DisplayOrder INT DEFAULT 0,
        CreatedAt DATETIME2 DEFAULT SYSDATETIME(),
        UpdatedAt DATETIME2 DEFAULT SYSDATETIME()
    );

    CREATE INDEX IX_PaintBrands_IsActive_DisplayOrder
        ON PaintBrands(IsActive, DisplayOrder);

    PRINT 'Table PaintBrands created successfully';
END
ELSE
BEGIN
    PRINT 'Table PaintBrands already exists, skipping...';
END
GO

-- ========================================
-- 2. CREATE PaintColors TABLE
-- ========================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'PaintColors')
BEGIN
    CREATE TABLE PaintColors (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        BrandId INT NOT NULL,
        ColorName NVARCHAR(200) NOT NULL,
        ColorCode NVARCHAR(50) NOT NULL,
        HexCode NVARCHAR(7) NOT NULL,
        ComponentType NVARCHAR(50) NOT NULL,
        ImageUrl NVARCHAR(500) NULL,
        Description NVARCHAR(MAX) NULL,
        IsActive BIT DEFAULT 1,
        CreatedAt DATETIME2 DEFAULT SYSDATETIME(),
        UpdatedAt DATETIME2 DEFAULT SYSDATETIME(),

        CONSTRAINT FK_PaintColors_Brand FOREIGN KEY (BrandId)
            REFERENCES PaintBrands(Id) ON DELETE CASCADE,
        CONSTRAINT CHK_ComponentType
            CHECK (ComponentType IN ('wall', 'roof', 'column', 'all')),
        CONSTRAINT CHK_HexCode CHECK (HexCode LIKE '#%')
    );

    CREATE INDEX IX_PaintColors_BrandId ON PaintColors(BrandId);
    CREATE INDEX IX_PaintColors_ComponentType ON PaintColors(ComponentType);
    CREATE INDEX IX_PaintColors_IsActive ON PaintColors(IsActive);

    PRINT 'Table PaintColors created successfully';
END
ELSE
BEGIN
    PRINT 'Table PaintColors already exists, skipping...';
END
GO

-- ========================================
-- 3. CREATE MixMatchProjects TABLE
-- ========================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'MixMatchProjects')
BEGIN
    CREATE TABLE MixMatchProjects (
        Id BIGINT IDENTITY(1,1) PRIMARY KEY,
        UserId BIGINT NOT NULL,
        InputImageUrl NVARCHAR(500) NOT NULL,
        OutputImageUrl NVARCHAR(500) NULL,
        RegionalStyleId INT NULL,
        WallColorId INT NULL,
        RoofColorId INT NULL,
        ColumnColorId INT NULL,
        CustomNotes NVARCHAR(MAX) NULL,
        PromptUsed NVARCHAR(MAX) NULL,
        Status NVARCHAR(50) DEFAULT 'pending',
        CreatedAt DATETIME2 DEFAULT SYSDATETIME(),
        CompletedAt DATETIME2 NULL,

        CONSTRAINT FK_MixMatch_User FOREIGN KEY (UserId)
            REFERENCES Users(Id) ON DELETE CASCADE,
        CONSTRAINT FK_MixMatch_RegionalStyle FOREIGN KEY (RegionalStyleId)
            REFERENCES RegionalLibrary(Id) ON DELETE SET NULL,
        CONSTRAINT FK_MixMatch_WallColor FOREIGN KEY (WallColorId)
            REFERENCES PaintColors(Id) ON DELETE NO ACTION,
        CONSTRAINT FK_MixMatch_RoofColor FOREIGN KEY (RoofColorId)
            REFERENCES PaintColors(Id) ON DELETE NO ACTION,
        CONSTRAINT FK_MixMatch_ColumnColor FOREIGN KEY (ColumnColorId)
            REFERENCES PaintColors(Id) ON DELETE NO ACTION
    );

    CREATE INDEX IX_MixMatch_UserId ON MixMatchProjects(UserId);
    CREATE INDEX IX_MixMatch_Status ON MixMatchProjects(Status);
    CREATE INDEX IX_MixMatch_CreatedAt ON MixMatchProjects(CreatedAt DESC);

    PRINT 'Table MixMatchProjects created successfully';
END
ELSE
BEGIN
    PRINT 'Table MixMatchProjects already exists, skipping...';
END
GO

-- ========================================
-- 4. SEED DATA - Paint Brands
-- ========================================
IF NOT EXISTS (SELECT * FROM PaintBrands WHERE BrandName = 'Jotun')
BEGIN
    INSERT INTO PaintBrands (BrandName, Description, DisplayOrder) VALUES
    ('Jotun', N'Thương hiệu sơn cao cấp từ Na Uy, nổi tiếng với chất lượng vượt trội', 1),
    ('Dulux', N'Sơn AkzoNobel chất lượng cao, được tin dùng toàn cầu', 2),
    ('Kova', N'Sơn Việt Nam uy tín, phù hợp với khí hậu nhiệt đới', 3),
    ('Nippon', N'Sơn Nhật Bản cao cấp, bền màu và chống thấm tốt', 4),
    ('TOA', N'Sơn Thái Lan chất lượng, giá thành hợp lý', 5);

    PRINT 'Seeded 5 paint brands';
END
ELSE
BEGIN
    PRINT 'Paint brands already exist, skipping seed...';
END
GO

-- ========================================
-- 5. SEED DATA - Paint Colors (Sample)
-- ========================================
DECLARE @JotunId INT, @DuluxId INT, @KovaId INT, @NipponId INT, @TOAId INT;

SELECT @JotunId = Id FROM PaintBrands WHERE BrandName = 'Jotun';
SELECT @DuluxId = Id FROM PaintBrands WHERE BrandName = 'Dulux';
SELECT @KovaId = Id FROM PaintBrands WHERE BrandName = 'Kova';
SELECT @NipponId = Id FROM PaintBrands WHERE BrandName = 'Nippon';
SELECT @TOAId = Id FROM PaintBrands WHERE BrandName = 'TOA';

IF NOT EXISTS (SELECT * FROM PaintColors WHERE ColorCode = 'JT-0001')
BEGIN
    -- Jotun Colors
    INSERT INTO PaintColors (BrandId, ColorName, ColorCode, HexCode, ComponentType, Description) VALUES
    (@JotunId, N'Jotun Pure White', 'JT-0001', '#FFFFFF', 'all', N'Trắng tinh khôi, phù hợp mọi bộ phận'),
    (@JotunId, N'Jotun Beige Elegance', 'JT-0234', '#F5F5DC', 'wall', N'Be thanh lịch cho tường'),
    (@JotunId, N'Jotun Warm Cream', 'JT-0120', '#FFFDD0', 'wall', N'Kem ấm áp'),
    (@JotunId, N'Jotun Light Grey', 'JT-5010', '#D3D3D3', 'wall', N'Xám nhạt hiện đại'),
    (@JotunId, N'Jotun Terracotta Red', 'JT-7001', '#B7410E', 'roof', N'Đỏ ngói truyền thống'),
    (@JotunId, N'Jotun Charcoal Grey', 'JT-9000', '#36454F', 'roof', N'Xám than chống nóng'),
    (@JotunId, N'Jotun Stone Grey', 'JT-5500', '#808080', 'column', N'Xám đá cho cột');

    -- Dulux Colors
    INSERT INTO PaintColors (BrandId, ColorName, ColorCode, HexCode, ComponentType, Description) VALUES
    (@DuluxId, N'Dulux Natural White', 'DLX-1001', '#FAFAFA', 'all', N'Trắng tự nhiên'),
    (@DuluxId, N'Dulux Soft Ivory', 'DLX-1020', '#FFFFF0', 'wall', N'Ngà mềm mại'),
    (@DuluxId, N'Dulux Warm Beige', 'DLX-2030', '#F5DEB3', 'wall', N'Be ấm'),
    (@DuluxId, N'Dulux Charcoal', 'DLX-9000', '#36454F', 'roof', N'Than chì cao cấp'),
    (@DuluxId, N'Dulux Brick Red', 'DLX-7010', '#CB4154', 'roof', N'Đỏ gạch'),
    (@DuluxId, N'Dulux Concrete Grey', 'DLX-5050', '#A9A9A9', 'column', N'Xám bê tông');

    -- Kova Colors
    INSERT INTO PaintColors (BrandId, ColorName, ColorCode, HexCode, ComponentType, Description) VALUES
    (@KovaId, N'Kova Classic White', 'KV-0001', '#FFFFFF', 'all', N'Trắng cổ điển'),
    (@KovaId, N'Kova Cream Yellow', 'KV-1010', '#FFFACD', 'wall', N'Vàng kem'),
    (@KovaId, N'Kova Sand Beige', 'KV-2020', '#F4A460', 'wall', N'Be cát'),
    (@KovaId, N'Kova Classic Grey', 'KV-5050', '#808080', 'all', N'Xám cổ điển'),
    (@KovaId, N'Kova Tile Red', 'KV-7001', '#D2691E', 'roof', N'Đỏ ngói Việt');

    -- Nippon Colors
    INSERT INTO PaintColors (BrandId, ColorName, ColorCode, HexCode, ComponentType, Description) VALUES
    (@NipponId, N'Nippon Snow White', 'NP-W001', '#FFFAFA', 'all', N'Trắng tuyết'),
    (@NipponId, N'Nippon Silk Cream', 'NP-C010', '#FFF8DC', 'wall', N'Kem lụa'),
    (@NipponId, N'Nippon Ash Grey', 'NP-G050', '#B2BEB5', 'wall', N'Xám tro'),
    (@NipponId, N'Nippon Dark Slate', 'NP-R900', '#2F4F4F', 'roof', N'Đá phiến tối'),
    (@NipponId, N'Nippon Stone Column', 'NP-S500', '#696969', 'column', N'Cột đá');

    -- TOA Colors
    INSERT INTO PaintColors (BrandId, ColorName, ColorCode, HexCode, ComponentType, Description) VALUES
    (@TOAId, N'TOA Pure White', 'TOA-W100', '#FFFFFF', 'all', N'Trắng tinh khiết'),
    (@TOAId, N'TOA Vanilla Cream', 'TOA-Y110', '#F3E5AB', 'wall', N'Kem vani'),
    (@TOAId, N'TOA Mocha Brown', 'TOA-B210', '#8B4513', 'wall', N'Nâu mocha'),
    (@TOAId, N'TOA Tropical Red', 'TOA-R701', '#C04000', 'roof', N'Đỏ nhiệt đới'),
    (@TOAId, N'TOA Silver Grey', 'TOA-G505', '#C0C0C0', 'column', N'Bạc xám');

    PRINT 'Seeded paint colors for all brands';
END
ELSE
BEGIN
    PRINT 'Paint colors already exist, skipping seed...';
END
GO

-- ========================================
-- 6. VERIFICATION QUERIES
-- ========================================
PRINT '========================================';
PRINT 'VERIFICATION RESULTS:';
PRINT '========================================';

SELECT 'PaintBrands' AS TableName, COUNT(*) AS RecordCount FROM PaintBrands
UNION ALL
SELECT 'PaintColors', COUNT(*) FROM PaintColors
UNION ALL
SELECT 'MixMatchProjects', COUNT(*) FROM MixMatchProjects;

PRINT '';
PRINT 'Sample Colors by Component Type:';
SELECT
    ComponentType,
    COUNT(*) AS ColorCount,
    STRING_AGG(CONCAT(b.BrandName, ' - ', c.ColorName), ', ') AS SampleColors
FROM PaintColors c
INNER JOIN PaintBrands b ON c.BrandId = b.Id
GROUP BY ComponentType;

PRINT '';
PRINT '========================================';
PRINT 'Migration completed successfully!';
PRINT '========================================';
GO
