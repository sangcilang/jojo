const path = require("path");
const Database = require("better-sqlite3");

const DB_PATH = path.join(__dirname, "../data/zanee.db");
const db = new Database(DB_PATH);

// Tạo đơn hàng từ 1/1/2026 đến hiện tại
const createHistoricalOrders = () => {
  const users = db.prepare("SELECT Id, Username FROM Users WHERE Role = 'user'").all();
  const products = db.prepare("SELECT Id, Price FROM Products").all();
  
  if (users.length === 0 || products.length === 0) {
    console.log("Không có user hoặc product để tạo đơn hàng");
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

  const startDate = new Date('2026-01-01');
  const endDate = new Date(); // Hôm nay
  const totalDays = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24));
  
  console.log(`Tạo đơn hàng từ ${startDate.toLocaleDateString()} đến ${endDate.toLocaleDateString()}`);
  console.log(`Tổng số ngày: ${totalDays}`);
  
  // Tạo khoảng 150-200 đơn hàng rải rác
  const totalOrders = 150 + Math.floor(Math.random() * 50);
  console.log(`Sẽ tạo ${totalOrders} đơn hàng\n`);
  
  let successCount = 0;
  
  for (let i = 0; i < totalOrders; i++) {
    const user = users[Math.floor(Math.random() * users.length)];
    
    // Random ngày trong khoảng từ 1/1/2026 đến hôm nay
    const randomDays = Math.floor(Math.random() * totalDays);
    const createdAt = new Date(startDate.getTime() + randomDays * 24 * 60 * 60 * 1000);
    
    // Thêm random giờ phút giây
    createdAt.setHours(Math.floor(Math.random() * 24));
    createdAt.setMinutes(Math.floor(Math.random() * 60));
    createdAt.setSeconds(Math.floor(Math.random() * 60));
    
    // Random 1-4 sản phẩm
    const numProducts = Math.floor(Math.random() * 4) + 1;
    let subtotal = 0;
    const orderItems = [];
    
    for (let j = 0; j < numProducts; j++) {
      const product = products[Math.floor(Math.random() * products.length)];
      const quantity = Math.floor(Math.random() * 3) + 1;
      const itemSubtotal = product.Price * quantity;
      subtotal += itemSubtotal;
      orderItems.push({ 
        productId: product.Id, 
        quantity, 
        unitPrice: product.Price, 
        subtotal: itemSubtotal 
      });
    }
    
    const fulfillmentMethod = Math.random() > 0.4 ? "pickup" : "delivery";
    const shippingFee = fulfillmentMethod === "delivery" ? 30000 : 0;
    const total = subtotal + shippingFee;
    const orderId = `ord-hist-${createdAt.getTime()}-${i}`;
    const pickupDate = new Date(createdAt.getTime() + 24 * 60 * 60 * 1000);
    
    // Đơn hàng cũ hơn thường đã hoàn thành
    const daysSinceOrder = Math.floor((endDate - createdAt) / (1000 * 60 * 60 * 24));
    let status;
    if (daysSinceOrder > 7) {
      // Đơn hàng cũ hơn 7 ngày: 80% đã giao, 15% đã hủy, 5% khác
      const rand = Math.random();
      if (rand < 0.8) status = "Da giao";
      else if (rand < 0.95) status = "Da huy";
      else status = statuses[Math.floor(Math.random() * statuses.length)];
    } else {
      // Đơn hàng mới: random tất cả trạng thái
      status = statuses[Math.floor(Math.random() * statuses.length)];
    }
    
    const paymentMethod = Math.random() > 0.6 ? "cod" : "vnpay";
    const paymentStatus = paymentMethod === "vnpay" ? "paid-sandbox" : 
                         (status === "Da giao" ? "paid-cod" : "pending-cod");
    
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
      
      successCount++;
      
      // Log mỗi 20 đơn
      if (successCount % 20 === 0) {
        console.log(`✓ Đã tạo ${successCount}/${totalOrders} đơn hàng...`);
      }
    } catch (error) {
      console.error(`✗ Lỗi tạo đơn hàng ${orderId}:`, error.message);
    }
  }
  
  console.log(`\n✅ Hoàn tất! Đã tạo ${successCount}/${totalOrders} đơn hàng`);
  
  // Thống kê
  const stats = db.prepare(`
    SELECT 
      COUNT(*) as total,
      SUM(Total) as revenue,
      MIN(CreatedAt) as firstOrder,
      MAX(CreatedAt) as lastOrder
    FROM Orders
  `).get();
  
  console.log("\n📊 Thống kê tổng quan:");
  console.log(`   Tổng đơn hàng: ${stats.total}`);
  console.log(`   Tổng doanh thu: ${stats.revenue.toLocaleString()}đ`);
  console.log(`   Đơn đầu tiên: ${new Date(stats.firstOrder).toLocaleDateString()}`);
  console.log(`   Đơn mới nhất: ${new Date(stats.lastOrder).toLocaleDateString()}`);
  
  // Thống kê theo tháng
  const monthlyStats = db.prepare(`
    SELECT 
      strftime('%Y-%m', CreatedAt) as month,
      COUNT(*) as orders,
      SUM(Total) as revenue
    FROM Orders
    GROUP BY strftime('%Y-%m', CreatedAt)
    ORDER BY month
  `).all();
  
  console.log("\n📅 Thống kê theo tháng:");
  monthlyStats.forEach(m => {
    console.log(`   ${m.month}: ${m.orders} đơn - ${m.revenue.toLocaleString()}đ`);
  });
};

console.log("🚀 Bắt đầu tạo dữ liệu lịch sử...\n");
createHistoricalOrders();
db.close();
