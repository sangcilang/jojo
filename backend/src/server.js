require("dotenv").config();

const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { sql, getPool, initializeDatabase, parseProduct, parseUser } = require("./db");

const app = express();
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || "zanee-store-secret";

app.use(cors());
app.use(express.json({ limit: "2mb" }));

function sanitizeUser(user) {
  const { passwordHash, ...safeUser } = user;
  return safeUser;
}

function issueToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      username: user.username,
      role: user.role,
      isLocked: user.isLocked,
    },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
}

async function getUserById(userId) {
  const pool = await getPool();
  const result = await pool.request().input("id", sql.NVarChar, userId).query("SELECT * FROM Users WHERE Id = @id");
  return result.recordset[0] ? parseUser(result.recordset[0]) : null;
}

async function getUserByUsername(username) {
  const pool = await getPool();
  const result = await pool.request().input("username", sql.NVarChar, username).query("SELECT * FROM Users WHERE Username = @username");
  return result.recordset[0] ? parseUser(result.recordset[0]) : null;
}

async function getProducts({ q = "", category = "" } = {}) {
  const pool = await getPool();
  const request = pool.request();
  request.input("q", sql.NVarChar, `%${q}%`);
  request.input("category", sql.NVarChar, category);
  const result = await request.query(`
    SELECT p.*, c.Name AS CategoryName
    FROM Products p
    INNER JOIN Categories c ON c.Id = p.CategoryId
    WHERE (@q = '%%' OR p.Name LIKE @q) AND (@category = '' OR c.Name = @category)
    ORDER BY p.Name
  `);
  return result.recordset.map(parseProduct);
}

async function getProductById(productId) {
  const pool = await getPool();
  const result = await pool.request().input("id", sql.NVarChar, productId).query(`
    SELECT p.*, c.Name AS CategoryName
    FROM Products p
    INNER JOIN Categories c ON c.Id = p.CategoryId
    WHERE p.Id = @id
  `);
  return result.recordset[0] ? parseProduct(result.recordset[0]) : null;
}

async function getFavorites(userId) {
  const pool = await getPool();
  const result = await pool.request().input("userId", sql.NVarChar, userId).query(`
    SELECT p.*, c.Name AS CategoryName
    FROM Favorites f
    INNER JOIN Products p ON p.Id = f.ProductId
    INNER JOIN Categories c ON c.Id = p.CategoryId
    WHERE f.UserId = @userId
  `);
  return result.recordset.map(parseProduct);
}

async function getCart(userId) {
  const pool = await getPool();
  const result = await pool.request().input("userId", sql.NVarChar, userId).query(`
    SELECT ci.UserId, ci.ProductId, ci.Quantity, p.*, c.Name AS CategoryName
    FROM CartItems ci
    INNER JOIN Products p ON p.Id = ci.ProductId
    INNER JOIN Categories c ON c.Id = p.CategoryId
    WHERE ci.UserId = @userId
  `);
  return result.recordset.map((row) => ({
    userId: row.UserId,
    productId: row.ProductId,
    quantity: row.Quantity,
    product: parseProduct(row),
    subtotal: Number(row.Price) * row.Quantity,
  }));
}

async function getOrders(userId) {
  const pool = await getPool();
  const ordersResult = await pool.request().input("userId", sql.NVarChar, userId).query(`
    SELECT * FROM Orders
    WHERE UserId = @userId
    ORDER BY CreatedAt DESC
  `);

  const orders = [];
  for (const order of ordersResult.recordset) {
    const itemsResult = await pool.request().input("orderId", sql.NVarChar, order.Id).query(`
      SELECT oi.*, p.Name, p.Sku, p.Image, p.Specs, p.Description, p.WarrantyMonths, p.Stock, c.Name AS CategoryName
      FROM OrderItems oi
      INNER JOIN Products p ON p.Id = oi.ProductId
      INNER JOIN Categories c ON c.Id = p.CategoryId
      WHERE oi.OrderId = @orderId
    `);

    orders.push({
      id: order.Id,
      userId: order.UserId,
      username: order.Username,
      subtotal: Number(order.Subtotal),
      shippingFee: Number(order.ShippingFee),
      total: Number(order.Total),
      fulfillmentMethod: order.FulfillmentMethod,
      pickupDate: order.PickupDate,
      address: order.Address || "",
      paymentMethod: order.PaymentMethod,
      paymentStatus: order.PaymentStatus,
      status: order.Status,
      createdAt: order.CreatedAt,
      items: itemsResult.recordset.map((item) => ({
        productId: item.ProductId,
        quantity: item.Quantity,
        unitPrice: Number(item.UnitPrice),
        subtotal: Number(item.Subtotal),
        product: parseProduct(item),
      })),
    });
  }
  return orders;
}

async function getCategories() {
  const pool = await getPool();
  const result = await pool.request().query("SELECT Name FROM Categories ORDER BY Name");
  return result.recordset.map((row) => row.Name);
}

async function authRequired(req, res, next) {
  const auth = req.headers.authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : req.query.token || null;

  if (!token) {
    return res.status(401).json({ message: "Thieu token xac thuc." });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const user = await getUserById(payload.sub);
    if (!user) {
      return res.status(401).json({ message: "Phien dang nhap khong con hop le." });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token khong hop le." });
  }
}

function requireRole(role) {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).json({ message: "403 - Ban khong co quyen truy cap chuc nang nay." });
    }
    next();
  };
}

function recommendBuild(products, budget, purpose) {
  const purposeKey = Array.isArray(purpose) ? purpose[0] : purpose;
  const templates = {
    office: ["CPU", "Mainboard", "RAM", "SSD", "Case", "PSU", "Monitor"],
    basicGaming: ["CPU", "Mainboard", "RAM", "SSD", "GPU", "Case", "PSU", "Monitor", "Cooling"],
    heavyGaming: ["CPU", "Mainboard", "RAM", "SSD", "GPU", "Case", "PSU", "Monitor", "Cooling"],
    it: ["CPU", "Mainboard", "RAM", "SSD", "HDD", "Case", "PSU", "Monitor", "Cooling"],
    content: ["CPU", "Mainboard", "RAM", "SSD", "GPU", "Case", "PSU", "Monitor", "Cooling", "Accessory"],
  };
  const route = templates[purposeKey] || templates.office;
  const maxPerCategory = Math.max(Math.floor(budget / route.length), 500000);
  const selected = route
    .map((category) => {
      const candidates = products
        .filter((item) => item.category === category && item.price <= maxPerCategory * 2)
        .sort((a, b) => b.price - a.price);
      return candidates.find((item) => item.price <= maxPerCategory) || candidates[candidates.length - 1];
    })
    .filter(Boolean);

  let total = selected.reduce((sum, item) => sum + item.price, 0);
  if (total > budget) {
    selected.sort((a, b) => b.price - a.price);
    while (selected.length > 6 && total > budget) {
      const removed = selected.shift();
      total -= removed.price;
    }
  }
  return { items: selected, total, delta: budget - total };
}

app.get("/api/health", async (req, res) => {
  const pool = await getPool();
  await pool.request().query("SELECT 1 AS ok");
  res.json({ ok: true, service: "Zanee.Store API", database: process.env.DB_NAME || "ZaneeStore", timestamp: new Date().toISOString() });
});

app.get("/api/bootstrap", async (req, res) => {
  const [categoriesData, products] = await Promise.all([getCategories(), getProducts()]);
  res.json({
    categories: categoriesData,
    products,
    featured: products.slice(0, 8),
    credentialsHint: {
      admin: { username: "admin", password: "123456" },
      staff: { username: "nhanvien", password: "123456" },
      user: { username: "minhdev", password: "123456" },
      locked: { username: "blockeduser", password: "123456" },
    },
  });
});

app.get("/api/products", async (req, res) => {
  const products = await getProducts({ q: (req.query.q || "").toString(), category: req.query.category || "" });
  res.json(products);
});

app.get("/api/products/:id", async (req, res) => {
  const product = await getProductById(req.params.id);
  if (!product) {
    return res.status(404).json({ message: "Khong tim thay san pham." });
  }
  return res.json(product);
});

app.post("/api/auth/register", async (req, res) => {
  const { username, email, phone, password } = req.body;
  if (!username || !email || !phone || !password) {
    return res.status(400).json({ message: "Vui long nhap du username, email, so dien thoai va mat khau." });
  }

  const pool = await getPool();
  const exists = await pool
    .request()
    .input("username", sql.NVarChar, username)
    .input("email", sql.NVarChar, email)
    .input("phone", sql.NVarChar, phone)
    .query("SELECT * FROM Users WHERE Username = @username OR Email = @email OR Phone = @phone LIMIT 1");

  if (exists.recordset[0]) {
    return res.status(409).json({ message: "Username, email hoac so dien thoai da ton tai." });
  }

  const user = {
    id: `usr-${Date.now()}`,
    username,
    email,
    phone,
    passwordHash: bcrypt.hashSync(password, 10),
    role: "user",
    isLocked: false,
    createdAt: new Date(),
  };

  try {
    await pool
      .request()
      .input("id", sql.NVarChar, user.id)
      .input("username", sql.NVarChar, user.username)
      .input("email", sql.NVarChar, user.email)
      .input("phone", sql.NVarChar, user.phone)
      .input("passwordHash", sql.NVarChar, user.passwordHash)
      .input("role", sql.NVarChar, user.role)
      .input("isLocked", sql.Bit, user.isLocked)
      .input("createdAt", sql.DateTime2, user.createdAt)
      .query(`
        INSERT INTO Users (Id, Username, Email, Phone, PasswordHash, Role, IsLocked, CreatedAt)
        VALUES (@id, @username, @email, @phone, @passwordHash, @role, @isLocked, @createdAt)
      `);

    return res.status(201).json({
      token: issueToken(user),
      user: sanitizeUser(user),
    });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({ message: "Loi khi tao tai khoan: " + error.message });
  }
});

app.post("/api/auth/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await getUserByUsername(username);
  if (!user || !bcrypt.compareSync(password || "", user.passwordHash)) {
    return res.status(401).json({ message: "Sai username hoac password." });
  }
  return res.json({ token: issueToken(user), user: sanitizeUser(user) });
});

app.post("/api/auth/reset-password", async (req, res) => {
  const { username, phone, newPassword } = req.body;
  const pool = await getPool();
  const result = await pool
    .request()
    .input("username", sql.NVarChar, username)
    .input("phone", sql.NVarChar, phone)
    .query("SELECT * FROM Users WHERE Username = @username AND Phone = @phone LIMIT 1");

  if (!result.recordset[0]) {
    return res.status(404).json({ message: "Thong tin xac thuc khong dung, khong the dat lai mat khau." });
  }

  await pool
    .request()
    .input("id", sql.NVarChar, result.recordset[0].Id)
    .input("passwordHash", sql.NVarChar, bcrypt.hashSync(newPassword || "123456", 10))
    .query("UPDATE Users SET PasswordHash = @passwordHash WHERE Id = @id");

  return res.json({ message: "Dat lai mat khau thanh cong." });
});

app.get("/api/me", authRequired, async (req, res) => {
  const [favorites, cart, orders] = await Promise.all([
    getFavorites(req.user.id),
    getCart(req.user.id),
    getOrders(req.user.id),
  ]);
  res.json({ user: sanitizeUser(req.user), favorites, cart, orders });
});

app.post("/api/favorites/:productId", authRequired, async (req, res) => {
  if (req.user.role !== "user") {
    return res.status(403).json({ message: "Admin khong su dung danh sach yeu thich." });
  }

  const pool = await getPool();
  const existing = await pool
    .request()
    .input("userId", sql.NVarChar, req.user.id)
    .input("productId", sql.NVarChar, req.params.productId)
    .query("SELECT * FROM Favorites WHERE UserId = @userId AND ProductId = @productId LIMIT 1");

  if (existing.recordset[0]) {
    await pool
      .request()
      .input("userId", sql.NVarChar, req.user.id)
      .input("productId", sql.NVarChar, req.params.productId)
      .query("DELETE FROM Favorites WHERE UserId = @userId AND ProductId = @productId");
  } else {
    await pool
      .request()
      .input("userId", sql.NVarChar, req.user.id)
      .input("productId", sql.NVarChar, req.params.productId)
      .query("INSERT INTO Favorites (UserId, ProductId) VALUES (@userId, @productId)");
  }

  res.json({ favorites: await getFavorites(req.user.id) });
});

app.post("/api/cart", authRequired, async (req, res) => {
  if (req.user.role !== "user") {
    return res.status(403).json({ message: "Admin khong co gio hang mua sam." });
  }
  const { productId, quantity = 1 } = req.body;
  const pool = await getPool();
  await pool
    .request()
    .input("userId", sql.NVarChar, req.user.id)
    .input("productId", sql.NVarChar, productId)
    .input("quantity", sql.Int, Number(quantity))
    .query(`
      MERGE CartItems AS target
      USING (SELECT @userId AS UserId, @productId AS ProductId, @quantity AS Quantity) AS source
      ON target.UserId = source.UserId AND target.ProductId = source.ProductId
      WHEN MATCHED THEN UPDATE SET Quantity = target.Quantity + source.Quantity
      WHEN NOT MATCHED THEN INSERT (UserId, ProductId, Quantity) VALUES (source.UserId, source.ProductId, source.Quantity);
    `);
  res.json({ cart: await getCart(req.user.id) });
});

app.patch("/api/cart/:productId", authRequired, async (req, res) => {
  const pool = await getPool();
  await pool
    .request()
    .input("userId", sql.NVarChar, req.user.id)
    .input("productId", sql.NVarChar, req.params.productId)
    .input("quantity", sql.Int, Math.max(1, Number(req.body.quantity) || 1))
    .query("UPDATE CartItems SET Quantity = @quantity WHERE UserId = @userId AND ProductId = @productId");
  res.json({ cart: await getCart(req.user.id) });
});

app.delete("/api/cart/:productId", authRequired, async (req, res) => {
  const pool = await getPool();
  await pool
    .request()
    .input("userId", sql.NVarChar, req.user.id)
    .input("productId", sql.NVarChar, req.params.productId)
    .query("DELETE FROM CartItems WHERE UserId = @userId AND ProductId = @productId");
  res.json({ cart: await getCart(req.user.id) });
});

app.post("/api/pc-builder", authRequired, async (req, res) => {
  if (req.user.role !== "user") {
    return res.status(403).json({ message: "Chuc nang build PC chi danh cho user." });
  }
  const products = await getProducts();
  const plan = recommendBuild(products, Number(req.body.budget || 0), req.body.purpose || []);
  const pool = await getPool();
  await pool.request().input("userId", sql.NVarChar, req.user.id).query("DELETE FROM CartItems WHERE UserId = @userId");
  for (const item of plan.items) {
    await pool
      .request()
      .input("userId", sql.NVarChar, req.user.id)
      .input("productId", sql.NVarChar, item.id)
      .input("quantity", sql.Int, 1)
      .query("INSERT INTO CartItems (UserId, ProductId, Quantity) VALUES (@userId, @productId, @quantity)");
  }
  res.json({ ...plan, cart: await getCart(req.user.id) });
});

app.post("/api/orders", authRequired, async (req, res) => {
  if (req.user.role !== "user") {
    return res.status(403).json({ message: "Chuc nang mua hang chi danh cho user." });
  }

  const cart = await getCart(req.user.id);
  if (!cart.length) {
    return res.status(400).json({ message: "Gio hang dang trong." });
  }

  const { fulfillmentMethod, address = "", paymentMethod } = req.body;
  const subtotal = cart.reduce((sum, item) => sum + item.subtotal, 0);
  const shippingFee = fulfillmentMethod === "delivery" ? 30000 : 0;
  const total = subtotal + shippingFee;
  const orderId = `ord-${Date.now()}`;
  const pickupDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
  // Đơn nhận tại cửa hàng mặc định là Hoàn thành
  const status = fulfillmentMethod === "pickup" ? "Hoan thanh" : "Dang chuan bi giao";

  const pool = await getPool();
  try {
    await pool.request()
      .input("id", sql.NVarChar, orderId)
      .input("userId", sql.NVarChar, req.user.id)
      .input("username", sql.NVarChar, req.user.username)
      .input("subtotal", sql.BigInt, subtotal)
      .input("shippingFee", sql.BigInt, shippingFee)
      .input("total", sql.BigInt, total)
      .input("fulfillmentMethod", sql.NVarChar, fulfillmentMethod)
      .input("pickupDate", sql.DateTime2, pickupDate)
      .input("address", sql.NVarChar, address)
      .input("paymentMethod", sql.NVarChar, paymentMethod)
      .input("paymentStatus", sql.NVarChar, paymentMethod === "vnpay" ? "paid-sandbox" : "pending-cod")
      .input("status", sql.NVarChar, status)
      .input("createdAt", sql.DateTime2, new Date())
      .query(`
        INSERT INTO Orders
        (Id, UserId, Username, Subtotal, ShippingFee, Total, FulfillmentMethod, PickupDate, Address, PaymentMethod, PaymentStatus, Status, CreatedAt)
        VALUES
        (@id, @userId, @username, @subtotal, @shippingFee, @total, @fulfillmentMethod, @pickupDate, @address, @paymentMethod, @paymentStatus, @status, @createdAt)
      `);

    for (const item of cart) {
      await pool.request()
        .input("orderId", sql.NVarChar, orderId)
        .input("productId", sql.NVarChar, item.productId)
        .input("quantity", sql.Int, item.quantity)
        .input("unitPrice", sql.BigInt, item.product.price)
        .input("subtotal", sql.BigInt, item.subtotal)
        .query(`
          INSERT INTO OrderItems (OrderId, ProductId, Quantity, UnitPrice, Subtotal)
          VALUES (@orderId, @productId, @quantity, @unitPrice, @subtotal)
        `);
    }

    await pool.request()
      .input("userId", sql.NVarChar, req.user.id)
      .query("DELETE FROM CartItems WHERE UserId = @userId");
  } catch (error) {
    throw error;
  }

  const orders = await getOrders(req.user.id);
  const order = orders.find((item) => item.id === orderId);
  
  // For VNPay, return URL to mock payment page in frontend
  const paymentUrl = paymentMethod === "vnpay" 
    ? `http://localhost:3000/#/vnpay-mock?orderId=${orderId}&amount=${total}&orderInfo=${encodeURIComponent('Thanh toan don hang ' + orderId)}`
    : null;
  
  res.status(201).json({
    message: "Thanh toan thanh cong, hoa don da duoc luu.",
    order,
    paymentUrl,
  });
});

app.get("/api/orders/:id/stream", authRequired, async (req, res) => {
  const orders = await getOrders(req.user.id);
  const order = orders.find((item) => item.id === req.params.id);
  if (!order) {
    return res.status(404).json({ message: "Khong tim thay don hang." });
  }
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders?.();

  const pushEvent = () => {
    const etaMinutes = Math.max(0, Math.round((new Date(order.pickupDate).getTime() - Date.now()) / 60000));
    res.write(`data: ${JSON.stringify({ orderId: order.id, status: order.status, etaMinutes })}\n\n`);
  };
  pushEvent();
  const timer = setInterval(pushEvent, 5000);
  req.on("close", () => clearInterval(timer));
});

app.patch("/api/orders/:id/confirm-received", authRequired, async (req, res) => {
  if (req.user.role !== "user") {
    return res.status(403).json({ message: "Chuc nang nay chi danh cho user." });
  }

  const orders = await getOrders(req.user.id);
  const order = orders.find((item) => item.id === req.params.id);
  
  if (!order) {
    return res.status(404).json({ message: "Khong tim thay don hang." });
  }

  if (order.status !== "Da giao hang") {
    return res.status(400).json({ message: "Chi co the xac nhan don hang da duoc giao." });
  }

  const pool = await getPool();
  await pool
    .request()
    .input("id", sql.NVarChar, req.params.id)
    .input("status", sql.NVarChar, "Hoan thanh")
    .query("UPDATE Orders SET Status = @status WHERE Id = @id");

  const updatedOrders = await getOrders(req.user.id);
  const updatedOrder = updatedOrders.find((item) => item.id === req.params.id);
  
  res.json({ message: "Da xac nhan nhan hang thanh cong.", order: updatedOrder });
});

app.patch("/api/account/password", authRequired, async (req, res) => {
  const currentUser = await getUserById(req.user.id);
  if (!bcrypt.compareSync(req.body.currentPassword || "", currentUser.passwordHash)) {
    return res.status(400).json({ message: "Mat khau hien tai khong dung." });
  }
  const pool = await getPool();
  await pool
    .request()
    .input("id", sql.NVarChar, req.user.id)
    .input("passwordHash", sql.NVarChar, bcrypt.hashSync(req.body.newPassword, 10))
    .query("UPDATE Users SET PasswordHash = @passwordHash WHERE Id = @id");
  res.json({ message: "Doi mat khau thanh cong." });
});

app.get("/api/admin/stats", authRequired, requireRole("admin"), async (req, res) => {
  const pool = await getPool();
  const timeRange = req.query.range || '7days'; // 7days, 30days, 12months, all
  
  const [users, products, orders, revenue] = await Promise.all([
    pool.request().query("SELECT SUM(CASE WHEN Role = 'user' THEN 1 ELSE 0 END) AS totalUsers, SUM(CASE WHEN Role = 'admin' THEN 1 ELSE 0 END) AS totalAdmins FROM Users"),
    pool.request().query("SELECT COUNT(*) AS totalProducts FROM Products"),
    pool.request().query("SELECT COUNT(*) AS totalOrders FROM Orders"),
    pool.request().query("SELECT COALESCE(SUM(Total), 0) AS totalRevenue FROM Orders"),
  ]);

  // Doanh thu theo thời gian
  let revenueQuery;
  if (timeRange === '7days') {
    revenueQuery = `
      SELECT 
        DATE(CreatedAt) as date,
        SUM(Total) as revenue
      FROM Orders
      WHERE CreatedAt >= DATE('now', '-7 days')
      GROUP BY DATE(CreatedAt)
      ORDER BY date
    `;
  } else if (timeRange === '30days') {
    revenueQuery = `
      SELECT 
        DATE(CreatedAt) as date,
        SUM(Total) as revenue
      FROM Orders
      WHERE CreatedAt >= DATE('now', '-30 days')
      GROUP BY DATE(CreatedAt)
      ORDER BY date
    `;
  } else if (timeRange === '12months') {
    revenueQuery = `
      SELECT 
        strftime('%Y-%m', CreatedAt) as date,
        SUM(Total) as revenue
      FROM Orders
      WHERE CreatedAt >= DATE('now', '-12 months')
      GROUP BY strftime('%Y-%m', CreatedAt)
      ORDER BY date
    `;
  } else { // all
    revenueQuery = `
      SELECT 
        strftime('%Y-%m', CreatedAt) as date,
        SUM(Total) as revenue
      FROM Orders
      GROUP BY strftime('%Y-%m', CreatedAt)
      ORDER BY date
    `;
  }
  
  const revenueByTime = await pool.request().query(revenueQuery);

  // Trạng thái đơn hàng
  const ordersByStatus = await pool.request().query(`
    SELECT Status, COUNT(*) as count
    FROM Orders
    GROUP BY Status
  `);

  // Top 5 sản phẩm bán chạy
  const topProducts = await pool.request().query(`
    SELECT p.Name, SUM(oi.Quantity) as totalSold
    FROM OrderItems oi
    INNER JOIN Products p ON p.Id = oi.ProductId
    GROUP BY p.Id, p.Name
    ORDER BY totalSold DESC
    LIMIT 5
  `);

  // Người dùng mới theo tháng
  const newUsersByMonth = await pool.request().query(`
    SELECT 
      strftime('%Y-%m', CreatedAt) as month,
      COUNT(*) as count
    FROM Users
    WHERE Role = 'user'
    GROUP BY strftime('%Y-%m', CreatedAt)
    ORDER BY month DESC
    LIMIT 12
  `);

  res.json({
    totalUsers: users.recordset[0].totalUsers || 0,
    totalAdmins: users.recordset[0].totalAdmins || 0,
    totalProducts: products.recordset[0].totalProducts || 0,
    totalOrders: orders.recordset[0].totalOrders || 0,
    totalRevenue: Number(revenue.recordset[0].totalRevenue || 0),
    revenueByTime: revenueByTime.recordset.map(r => ({ date: r.date, revenue: Number(r.revenue) })),
    ordersByStatus: ordersByStatus.recordset.map(r => ({ status: r.Status, count: r.count })),
    topProducts: topProducts.recordset.map(r => ({ name: r.Name, sold: r.totalSold })),
    newUsersByMonth: newUsersByMonth.recordset.map(r => ({ month: r.month, count: r.count })),
    timeRange,
  });
});

app.get("/api/admin/users", authRequired, requireRole("admin"), async (req, res) => {
  const pool = await getPool();
  const result = await pool.request().query("SELECT * FROM Users ORDER BY CreatedAt DESC");
  res.json(result.recordset.map((row) => sanitizeUser(parseUser(row))));
});

app.patch("/api/admin/users/:id/toggle-lock", authRequired, requireRole("admin"), async (req, res) => {
  const user = await getUserById(req.params.id);
  if (!user) {
    return res.status(404).json({ message: "Khong tim thay nguoi dung." });
  }
  if (user.role === "admin") {
    return res.status(400).json({ message: "Khong the khoa tai khoan admin." });
  }
  const pool = await getPool();
  await pool
    .request()
    .input("id", sql.NVarChar, user.id)
    .input("isLocked", sql.Bit, !user.isLocked)
    .query("UPDATE Users SET IsLocked = @isLocked WHERE Id = @id");
  const updated = await getUserById(user.id);
  res.json({ user: sanitizeUser(updated) });
});

app.get("/api/admin/orders", authRequired, requireRole("admin"), async (req, res) => {
  const pool = await getPool();
  const usersOrders = await pool.request().query("SELECT DISTINCT UserId FROM Orders");
  const orders = [];
  for (const row of usersOrders.recordset) {
    orders.push(...(await getOrders(row.UserId)));
  }
  res.json(orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
});

app.get("/api/admin/categories", authRequired, requireRole("admin"), async (req, res) => {
  res.json(await getCategories());
});

app.post("/api/admin/categories", authRequired, requireRole("admin"), async (req, res) => {
  const name = String(req.body.name || "").trim();
  if (!name) {
    return res.status(400).json({ message: "Ten danh muc khong duoc de trong." });
  }
  const pool = await getPool();
  await pool.request().input("name", sql.NVarChar, name).query("INSERT INTO Categories (Name) VALUES (@name)");
  res.status(201).json(await getCategories());
});

app.put("/api/admin/categories/:name", authRequired, requireRole("admin"), async (req, res) => {
  const oldName = req.params.name;
  const newName = String(req.body.name || "").trim();
  const pool = await getPool();
  await pool
    .request()
    .input("oldName", sql.NVarChar, oldName)
    .input("newName", sql.NVarChar, newName)
    .query("UPDATE Categories SET Name = @newName WHERE Name = @oldName");
  res.json(await getCategories());
});

app.delete("/api/admin/categories/:name", authRequired, requireRole("admin"), async (req, res) => {
  const pool = await getPool();
  let otherCategory = await pool.request().query("SELECT Id FROM Categories WHERE Name = 'Khac' LIMIT 1");
  if (!otherCategory.recordset[0]) {
    await pool.request().query("INSERT INTO Categories (Name) VALUES ('Khac')");
    otherCategory = await pool.request().query("SELECT Id FROM Categories WHERE Name = 'Khac' LIMIT 1");
  }
  const deleteCategory = await pool.request().input("name", sql.NVarChar, req.params.name).query("SELECT Id FROM Categories WHERE Name = @name LIMIT 1");
  if (deleteCategory.recordset[0]) {
    await pool
      .request()
      .input("categoryId", sql.Int, deleteCategory.recordset[0].Id)
      .input("otherCategoryId", sql.Int, otherCategory.recordset[0].Id)
      .query("UPDATE Products SET CategoryId = @otherCategoryId WHERE CategoryId = @categoryId");
    await pool.request().input("categoryId", sql.Int, deleteCategory.recordset[0].Id).query("DELETE FROM Categories WHERE Id = @categoryId");
  }
  res.json(await getCategories());
});

app.post("/api/admin/products", authRequired, requireRole("admin"), async (req, res) => {
  const pool = await getPool();
  const category = await pool.request().input("name", sql.NVarChar, req.body.category).query("SELECT Id FROM Categories WHERE Name = @name LIMIT 1");
  const product = {
    id: `prd-${Date.now()}`,
    sku: `ZNS-${Date.now()}`,
    image: req.body.image || "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80",
  };
  await pool
    .request()
    .input("id", sql.NVarChar, product.id)
    .input("sku", sql.NVarChar, product.sku)
    .input("name", sql.NVarChar, req.body.name)
    .input("categoryId", sql.Int, category.recordset[0].Id)
    .input("price", sql.BigInt, Number(req.body.price))
    .input("warrantyMonths", sql.Int, Number(req.body.warrantyMonths))
    .input("stock", sql.Int, Number(req.body.stock))
    .input("image", sql.NVarChar, product.image)
    .input("specs", sql.NVarChar(sql.MAX), JSON.stringify(Array.isArray(req.body.specs) ? req.body.specs : []))
    .input("description", sql.NVarChar(sql.MAX), req.body.description)
    .query(`
      INSERT INTO Products (Id, Sku, Name, CategoryId, Price, WarrantyMonths, Stock, Image, Specs, Description)
      VALUES (@id, @sku, @name, @categoryId, @price, @warrantyMonths, @stock, @image, @specs, @description)
    `);
  res.status(201).json(await getProductById(product.id));
});

app.put("/api/admin/products/:id", authRequired, requireRole("admin"), async (req, res) => {
  const pool = await getPool();
  const category = await pool.request().input("name", sql.NVarChar, req.body.category).query("SELECT Id FROM Categories WHERE Name = @name LIMIT 1");
  await pool
    .request()
    .input("id", sql.NVarChar, req.params.id)
    .input("name", sql.NVarChar, req.body.name)
    .input("categoryId", sql.Int, category.recordset[0].Id)
    .input("price", sql.BigInt, Number(req.body.price))
    .input("warrantyMonths", sql.Int, Number(req.body.warrantyMonths))
    .input("stock", sql.Int, Number(req.body.stock))
    .input("image", sql.NVarChar, req.body.image || "")
    .input("specs", sql.NVarChar(sql.MAX), JSON.stringify(Array.isArray(req.body.specs) ? req.body.specs : []))
    .input("description", sql.NVarChar(sql.MAX), req.body.description)
    .query(`
      UPDATE Products
      SET Name = @name, CategoryId = @categoryId, Price = @price, WarrantyMonths = @warrantyMonths,
          Stock = @stock, Image = @image, Specs = @specs, Description = @description
      WHERE Id = @id
    `);
  res.json(await getProductById(req.params.id));
});

app.delete("/api/admin/products/:id", authRequired, requireRole("admin"), async (req, res) => {
  const pool = await getPool();
  await pool.request().input("id", sql.NVarChar, req.params.id).query("DELETE FROM Products WHERE Id = @id");
  res.json({ message: "Da xoa san pham." });
});

// ============ STAFF ROUTES ============
app.get("/api/staff/orders", authRequired, requireRole("staff"), async (req, res) => {
  const pool = await getPool();
  const usersOrders = await pool.request().query("SELECT DISTINCT UserId FROM Orders");
  const orders = [];
  for (const row of usersOrders.recordset) {
    orders.push(...(await getOrders(row.UserId)));
  }
  res.json(orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
});

app.patch("/api/staff/orders/:id/status", authRequired, requireRole("staff"), async (req, res) => {
  const { status } = req.body;
  const validStatuses = [
    "Cho nhan tai store",
    "Dang chuan bi giao",
    "Dang giao hang",
    "Da giao hang",
    "Hoan thanh",
    "Da huy"
  ];
  
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: "Trang thai khong hop le." });
  }

  const pool = await getPool();
  await pool
    .request()
    .input("id", sql.NVarChar, req.params.id)
    .input("status", sql.NVarChar, status)
    .query("UPDATE Orders SET Status = @status WHERE Id = @id");

  // Get updated order
  const result = await pool.request().input("id", sql.NVarChar, req.params.id).query("SELECT UserId FROM Orders WHERE Id = @id");
  if (result.recordset[0]) {
    const orders = await getOrders(result.recordset[0].UserId);
    const order = orders.find(o => o.id === req.params.id);
    res.json({ message: "Cap nhat trang thai thanh cong.", order });
  } else {
    res.status(404).json({ message: "Khong tim thay don hang." });
  }
});

app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({ message: error.message || "Loi server." });
});

app.use((req, res) => {
  res.status(404).json({ message: "API khong ton tai." });
});

(async () => {
  try {
    await initializeDatabase();
    app.listen(PORT, () => {
      console.log(`Zanee.Store API is running at http://localhost:${PORT}`);
      console.log(`Connected SQL Server DB: ${process.env.DB_NAME || "ZaneeStore"}`);
    });
  } catch (error) {
    console.error("Failed to start backend with SQL Server:", error.message);
    process.exit(1);
  }
})();
