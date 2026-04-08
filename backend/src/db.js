const path = require("path");
const Database = require("better-sqlite3");
const { categories, seedProducts, buildDemoUsers, demoFavorites, demoCart } = require("./seedData");

const DB_PATH = path.join(__dirname, "../data/zanee.db");

let _db;

function getDb() {
  if (!_db) {
    _db = new Database(DB_PATH);
    _db.pragma("journal_mode = WAL");
    _db.pragma("foreign_keys = ON");
  }
  return _db;
}

// Fake sql object to keep server.js sql.NVarChar etc. references working
const sql = {
  NVarChar: "TEXT",
  Int: "INTEGER",
  BigInt: "INTEGER",
  Bit: "INTEGER",
  DateTime2: "TEXT",
  MAX: "MAX",
  Transaction: class {
    constructor() { this._ops = []; }
    begin() {}
    commit() {}
    rollback() {}
  },
  Request: class {
    constructor() { this._params = {}; }
    input(name, type, value) { this._params[name] = value; return this; }
    query(sql) { return Promise.resolve({ recordset: [] }); }
  },
};

// Pool-like wrapper that translates mssql-style calls to SQLite
class SqlitePool {
  request() {
    return new SqliteRequest(getDb());
  }
  async close() {}
}

class SqliteRequest {
  constructor(db) {
    this._db = db;
    this._params = {};
  }

  input(name, type, value) {
    // Convert bit/boolean
    if (type === sql.Bit || typeof value === "boolean") {
      value = value ? 1 : 0;
    }
    // Convert Date to ISO string
    if (value instanceof Date) {
      value = value.toISOString();
    }
    this._params[name] = value;
    return this;
  }

  async query(sqlText) {
    return this._run(sqlText);
  }

  async batch(sqlText) {
    // Execute multiple statements (schema init)
    const db = this._db;
    // Split on semicolons, run each
    const stmts = sqlText.split(";").map(s => s.trim()).filter(Boolean);
    for (const stmt of stmts) {
      try { db.exec(stmt + ";"); } catch (e) { /* ignore */ }
    }
    return { recordset: [] };
  }

  _run(sqlText) {
    const db = this._db;
    const params = this._params;

    // Replace @paramName with ? and build ordered values
    const paramNames = [];
    const normalized = sqlText.replace(/@(\w+)/g, (_, name) => {
      paramNames.push(name);
      return "?";
    });

    const values = paramNames.map(n => params[n] !== undefined ? params[n] : null);

    const upper = normalized.trim().toUpperCase();

    try {
      if (upper.startsWith("SELECT") || upper.startsWith("WITH")) {
        const rows = db.prepare(normalized).all(...values);
        return Promise.resolve({ recordset: rows });
      } else if (upper.includes("MERGE")) {
        // Handle MERGE for CartItems upsert
        return this._handleMerge(sqlText, params);
      } else {
        db.prepare(normalized).run(...values);
        return Promise.resolve({ recordset: [] });
      }
    } catch (e) {
      return Promise.reject(e);
    }
  }

  _handleMerge(sqlText, params) {
    const db = this._db;
    // CartItems MERGE: upsert
    const userId = params["userId"];
    const productId = params["productId"];
    const quantity = params["quantity"];
    const existing = db.prepare("SELECT Quantity FROM CartItems WHERE UserId=? AND ProductId=?").get(userId, productId);
    if (existing) {
      db.prepare("UPDATE CartItems SET Quantity=? WHERE UserId=? AND ProductId=?").run(existing.Quantity + quantity, userId, productId);
    } else {
      db.prepare("INSERT INTO CartItems (UserId, ProductId, Quantity) VALUES (?,?,?)").run(userId, productId, quantity);
    }
    return Promise.resolve({ recordset: [] });
  }
}

let _pool;

async function getPool() {
  if (!_pool) {
    _pool = new SqlitePool();
  }
  return _pool;
}

function parseProduct(row) {
  return {
    id: row.Id,
    sku: row.Sku,
    name: row.Name,
    category: row.CategoryName,
    price: Number(row.Price),
    warrantyMonths: row.WarrantyMonths,
    stock: row.Stock,
    image: row.Image,
    specs: JSON.parse(row.Specs || "[]"),
    description: row.Description,
  };
}

function parseUser(row) {
  return {
    id: row.Id,
    username: row.Username,
    email: row.Email,
    phone: row.Phone,
    passwordHash: row.PasswordHash,
    role: row.Role,
    isLocked: Boolean(row.IsLocked),
    createdAt: row.CreatedAt,
  };
}

async function initializeDatabase() {
  const db = getDb();

  // Create tables
  db.exec(`
    CREATE TABLE IF NOT EXISTS Users (
      Id TEXT NOT NULL PRIMARY KEY,
      Username TEXT NOT NULL UNIQUE,
      Email TEXT NOT NULL UNIQUE,
      Phone TEXT NOT NULL UNIQUE,
      PasswordHash TEXT NOT NULL,
      Role TEXT NOT NULL,
      IsLocked INTEGER NOT NULL DEFAULT 0,
      CreatedAt TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS Categories (
      Id INTEGER PRIMARY KEY AUTOINCREMENT,
      Name TEXT NOT NULL UNIQUE
    );
    CREATE TABLE IF NOT EXISTS Products (
      Id TEXT NOT NULL PRIMARY KEY,
      Sku TEXT NOT NULL UNIQUE,
      Name TEXT NOT NULL,
      CategoryId INTEGER NOT NULL,
      Price INTEGER NOT NULL,
      WarrantyMonths INTEGER NOT NULL,
      Stock INTEGER NOT NULL,
      Image TEXT,
      Specs TEXT NOT NULL,
      Description TEXT NOT NULL,
      FOREIGN KEY (CategoryId) REFERENCES Categories(Id)
    );
    CREATE TABLE IF NOT EXISTS Favorites (
      UserId TEXT NOT NULL,
      ProductId TEXT NOT NULL,
      PRIMARY KEY (UserId, ProductId),
      FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE,
      FOREIGN KEY (ProductId) REFERENCES Products(Id) ON DELETE CASCADE
    );
    CREATE TABLE IF NOT EXISTS CartItems (
      UserId TEXT NOT NULL,
      ProductId TEXT NOT NULL,
      Quantity INTEGER NOT NULL,
      PRIMARY KEY (UserId, ProductId),
      FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE,
      FOREIGN KEY (ProductId) REFERENCES Products(Id) ON DELETE CASCADE
    );
    CREATE TABLE IF NOT EXISTS Orders (
      Id TEXT NOT NULL PRIMARY KEY,
      UserId TEXT NOT NULL,
      Username TEXT NOT NULL,
      Subtotal INTEGER NOT NULL,
      ShippingFee INTEGER NOT NULL,
      Total INTEGER NOT NULL,
      FulfillmentMethod TEXT NOT NULL,
      PickupDate TEXT,
      Address TEXT,
      PaymentMethod TEXT NOT NULL,
      PaymentStatus TEXT NOT NULL,
      Status TEXT NOT NULL,
      CreatedAt TEXT NOT NULL,
      FOREIGN KEY (UserId) REFERENCES Users(Id)
    );
    CREATE TABLE IF NOT EXISTS OrderItems (
      Id INTEGER PRIMARY KEY AUTOINCREMENT,
      OrderId TEXT NOT NULL,
      ProductId TEXT NOT NULL,
      Quantity INTEGER NOT NULL,
      UnitPrice INTEGER NOT NULL,
      Subtotal INTEGER NOT NULL,
      FOREIGN KEY (OrderId) REFERENCES Orders(Id) ON DELETE CASCADE,
      FOREIGN KEY (ProductId) REFERENCES Products(Id)
    );
  `);

  // Seed categories
  const catCount = db.prepare("SELECT COUNT(*) as count FROM Categories").get();
  if (!catCount.count) {
    const insertCat = db.prepare("INSERT OR IGNORE INTO Categories (Name) VALUES (?)");
    for (const cat of categories) insertCat.run(cat);
  }

  // Seed products
  const prodCount = db.prepare("SELECT COUNT(*) as count FROM Products").get();
  if (!prodCount.count) {
    const insertProd = db.prepare(`
      INSERT OR IGNORE INTO Products (Id, Sku, Name, CategoryId, Price, WarrantyMonths, Stock, Image, Specs, Description)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    for (const p of seedProducts) {
      const cat = db.prepare("SELECT Id FROM Categories WHERE Name=?").get(p.category);
      if (cat) insertProd.run(p.id, p.sku, p.name, cat.Id, p.price, p.warrantyMonths, p.stock, p.image, JSON.stringify(p.specs), p.description);
    }
  }

  // Seed users
  const userCount = db.prepare("SELECT COUNT(*) as count FROM Users").get();
  if (!userCount.count) {
    const insertUser = db.prepare(`
      INSERT OR IGNORE INTO Users (Id, Username, Email, Phone, PasswordHash, Role, IsLocked, CreatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    for (const u of buildDemoUsers()) {
      insertUser.run(u.id, u.username, u.email, u.phone, u.passwordHash, u.role, u.isLocked ? 1 : 0, new Date(u.createdAt).toISOString());
    }
    const insertFav = db.prepare("INSERT OR IGNORE INTO Favorites (UserId, ProductId) VALUES (?, ?)");
    for (const f of demoFavorites) insertFav.run(f.userId, f.productId);
    const insertCart = db.prepare("INSERT OR IGNORE INTO CartItems (UserId, ProductId, Quantity) VALUES (?, ?, ?)");
    for (const c of demoCart) insertCart.run(c.userId, c.productId, c.quantity);
  }
}

module.exports = { sql, getPool, initializeDatabase, parseProduct, parseUser };
