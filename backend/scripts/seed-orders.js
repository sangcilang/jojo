const path = require("path");
const Database = require("better-sqlite3");

const DB_PATH = path.join(__dirname, "../data/zanee.db");
const db = new Database(DB_PATH);

// Tạo đơn hàng mẫu cho 7 ngày gần đây
const createSampleOrders = () => {
  const users = db.prepare("SELECT Id, Username FROM Users WHERE Role = 'user'").all();
  const products = db.prepare("SELECT Id, Price FROM Products LIMIT 10").all();
  
  if (users.length === 0 || products.length === 0) {
    console.log("Không có user hoặc product để tạo đơn hàng mẫu");
    return;
  }

  const statuses = [
    "Cho nhan tai store",
    "Dang chuan bi giao",
    "Dang giao",
    "Da giao",
    "Da huy"
  ];

  const insertOrder = db.prepare(`
    INSERT INTO Orders (Id, UserId, Username, Subtotal, ShippingFee, Total, FulfillmentMethod, PickupDate, Address, PaymentMethod, PaymentStatus, Status, CreatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertOrderItem = db.prepare(`
    INSERT INTO OrderItems (OrderId, ProductId, Quantity, UnitPrice, Subtotal)
    VALUES (?, ?, ?, ?, ?)
  `);

  // Tạo 20 đơn hàng trong 7 ngày gần đây
  for (let i = 0; i < 20; i++) {
    const user = users[Math.floor(Math.random() * users.length)];
    const daysAgo = Math.floor(Math.random() * 7);
    const createdAt = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
    
    // Random 1-3 sản phẩm
    const numProducts = Math.floor(Math.random() * 3) + 1;
    let subtotal = 0;
    const orderItems = [];
    
    for (let j = 0; j < numProducts; j++) {
      const product = products[Math.floor(Math.random() * products.length)];
      const quantity = Math.floor(Math.random() * 2) + 1;
      const itemSubtotal = product.Price * quantity;
      subtotal += itemSubtotal;
      orderItems.push({ productId: product.Id, quantity, unitPrice: product.Price, subtotal: itemSubtotal });
    }
    
    const fulfillmentMethod = Math.random() > 0.5 ? "pickup" : "delivery";
    const shippingFee = fulfillmentMethod === "delivery" ? 30000 : 0;
    const total = subtotal + shippingFee;
    const orderId = `ord-sample-${Date.now()}-${i}`;
    const pickupDate = new Date(createdAt.getTime() + 24 * 60 * 60 * 1000);
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const paymentMethod = Math.random() > 0.5 ? "cod" : "vnpay";
    const paymentStatus = paymentMethod === "vnpay" ? "paid-sandbox" : "pending-cod";
    
    try {
      insertOrder.run(
        orderId,
        user.Id,
        user.Username,
        subtotal,
        shippingFee,
        total,
        fulfillmentMethod,
        pickupDate.toISOString(),
        fulfillmentMethod === "delivery" ? "355 Xuân Đỉnh, Bắc Từ Liêm, Hà Nội" : "",
        paymentMethod,
        paymentStatus,
        status,
        createdAt.toISOString()
      );
      
      for (const item of orderItems) {
        insertOrderItem.run(orderId, item.productId, item.quantity, item.unitPrice, item.subtotal);
      }
      
      console.log(`✓ Tạo đơn hàng ${orderId} - ${total.toLocaleString()}đ`);
    } catch (error) {
      console.error(`✗ Lỗi tạo đơn hàng ${orderId}:`, error.message);
    }
  }
};

console.log("Bắt đầu tạo đơn hàng mẫu...");
createSampleOrders();
console.log("Hoàn tất!");
db.close();
