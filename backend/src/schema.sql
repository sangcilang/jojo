IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Users]') AND type in (N'U'))
BEGIN
  CREATE TABLE dbo.Users (
    Id NVARCHAR(50) NOT NULL PRIMARY KEY,
    Username NVARCHAR(50) NOT NULL UNIQUE,
    Email NVARCHAR(120) NOT NULL UNIQUE,
    Phone NVARCHAR(20) NOT NULL UNIQUE,
    PasswordHash NVARCHAR(255) NOT NULL,
    Role NVARCHAR(20) NOT NULL,
    IsLocked BIT NOT NULL DEFAULT 0,
    CreatedAt DATETIME2 NOT NULL
  );
END;

IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Categories]') AND type in (N'U'))
BEGIN
  CREATE TABLE dbo.Categories (
    Id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    Name NVARCHAR(100) NOT NULL UNIQUE
  );
END;

IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Products]') AND type in (N'U'))
BEGIN
  CREATE TABLE dbo.Products (
    Id NVARCHAR(50) NOT NULL PRIMARY KEY,
    Sku NVARCHAR(50) NOT NULL UNIQUE,
    Name NVARCHAR(255) NOT NULL,
    CategoryId INT NOT NULL,
    Price BIGINT NOT NULL,
    WarrantyMonths INT NOT NULL,
    Stock INT NOT NULL,
    Image NVARCHAR(500) NULL,
    Specs NVARCHAR(MAX) NOT NULL,
    Description NVARCHAR(MAX) NOT NULL,
    CONSTRAINT FK_Products_Categories FOREIGN KEY (CategoryId) REFERENCES dbo.Categories(Id)
  );
END;

IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Favorites]') AND type in (N'U'))
BEGIN
  CREATE TABLE dbo.Favorites (
    UserId NVARCHAR(50) NOT NULL,
    ProductId NVARCHAR(50) NOT NULL,
    PRIMARY KEY (UserId, ProductId),
    CONSTRAINT FK_Favorites_Users FOREIGN KEY (UserId) REFERENCES dbo.Users(Id) ON DELETE CASCADE,
    CONSTRAINT FK_Favorites_Products FOREIGN KEY (ProductId) REFERENCES dbo.Products(Id) ON DELETE CASCADE
  );
END;

IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[CartItems]') AND type in (N'U'))
BEGIN
  CREATE TABLE dbo.CartItems (
    UserId NVARCHAR(50) NOT NULL,
    ProductId NVARCHAR(50) NOT NULL,
    Quantity INT NOT NULL,
    PRIMARY KEY (UserId, ProductId),
    CONSTRAINT FK_CartItems_Users FOREIGN KEY (UserId) REFERENCES dbo.Users(Id) ON DELETE CASCADE,
    CONSTRAINT FK_CartItems_Products FOREIGN KEY (ProductId) REFERENCES dbo.Products(Id) ON DELETE CASCADE
  );
END;

IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Orders]') AND type in (N'U'))
BEGIN
  CREATE TABLE dbo.Orders (
    Id NVARCHAR(50) NOT NULL PRIMARY KEY,
    UserId NVARCHAR(50) NOT NULL,
    Username NVARCHAR(50) NOT NULL,
    Subtotal BIGINT NOT NULL,
    ShippingFee BIGINT NOT NULL,
    Total BIGINT NOT NULL,
    FulfillmentMethod NVARCHAR(30) NOT NULL,
    PickupDate DATETIME2 NULL,
    Address NVARCHAR(500) NULL,
    PaymentMethod NVARCHAR(30) NOT NULL,
    PaymentStatus NVARCHAR(30) NOT NULL,
    Status NVARCHAR(100) NOT NULL,
    CreatedAt DATETIME2 NOT NULL,
    CONSTRAINT FK_Orders_Users FOREIGN KEY (UserId) REFERENCES dbo.Users(Id)
  );
END;

IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[OrderItems]') AND type in (N'U'))
BEGIN
  CREATE TABLE dbo.OrderItems (
    Id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    OrderId NVARCHAR(50) NOT NULL,
    ProductId NVARCHAR(50) NOT NULL,
    Quantity INT NOT NULL,
    UnitPrice BIGINT NOT NULL,
    Subtotal BIGINT NOT NULL,
    CONSTRAINT FK_OrderItems_Orders FOREIGN KEY (OrderId) REFERENCES dbo.Orders(Id) ON DELETE CASCADE,
    CONSTRAINT FK_OrderItems_Products FOREIGN KEY (ProductId) REFERENCES dbo.Products(Id)
  );
END;
