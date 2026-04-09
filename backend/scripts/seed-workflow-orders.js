const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '../data/zanee.db');
const db = new Database(dbPath);

console.log('🔄 Seeding orders with different statuses for workflow testing...');

// Lấy user minhdev
const user = db.prepare('SELECT * FROM Users WHERE Username = ?').get('minhdev');
if (!user) {
  console.error('❌ User minhdev not found!');
  process.exit(1);
}

// Lấy một số sản phẩm
const products = db.prepare('SELECT * FROM Products LIMIT 5').all();
if (products.length === 0) {
  console.error('❌ No products found!');
  process.exit(1);
}

// Các trạng thái để test
const deliveryStatuses = [
  { status: 'Dang chuan bi giao', label: 'Đang chuẩn bị giao' },
  { status: 'Dang giao hang', label: 'Đang giao hàng' },
  { status: 'Da giao hang', label: 'Đã giao hàng' },
  { status: 'Da huy', label: 'Đã hủy' },
];

const pickupStatuses = [
  { status: 'Dang chuan bi giao', label: 'Đang chuẩn bị' },
  { status: 'Cho nhan tai store', label: 'Sẵn sàng nhận' },
  { status: 'Hoan thanh', label: 'Hoàn thành' },
  { status: 'Da huy', label: 'Đã hủy' },
];

let ordersCreated = 0;

// Tạo đơn giao hàng với các trạng thái khác nhau
deliveryStatuses.forEach((statusInfo, index) => {
  const orderId = `ord-workflow-delivery-${Date.now()}-${index}`;
  const product = products[index % products.length];
  const quantity = Math.floor(Math.random() * 2) + 1;
  const subtotal = product.Price * quantity;
  const shippingFee = 30000;
  const total = subtotal + shippingFee;
  const createdAt = new Date(Date.now() - (index * 3600000)); // Mỗi đơn cách nhau 1 giờ

  try {
    // Insert order
    db.prepare(`
      INSERT INTO Orders (Id, UserId, Username, Subtotal, ShippingFee, Total, FulfillmentMethod, PickupDate, Address, PaymentMethod, PaymentStatus, Status, CreatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      orderId,
      user.Id,
      user.Username,
      subtotal,
      shippingFee,
      total,
      'delivery',
      new Date(Date.now() + 86400000).toISOString(),
      '123 Đường Test, Quận Test, TP Test',
      'delivery',
      'pending-cod',
      statusInfo.status,
      createdAt.toISOString()
    );

    // Insert order items
    db.prepare(`
      INSERT INTO OrderItems (OrderId, ProductId, Quantity, UnitPrice, Subtotal)
      VALUES (?, ?, ?, ?, ?)
    `).run(
      orderId,
      product.Id,
      quantity,
      product.Price,
      subtotal
    );

    ordersCreated++;
    console.log(`✅ Created delivery order: ${orderId} - ${statusInfo.label}`);
  } catch (error) {
    console.error(`❌ Error creating delivery order ${index}:`, error.message);
  }
});

// Tạo đơn nhận tại store với các trạng thái khác nhau
pickupStatuses.forEach((statusInfo, index) => {
  const orderId = `ord-workflow-pickup-${Date.now()}-${index}`;
  const product = products[(index + 2) % products.length];
  const quantity = Math.floor(Math.random() * 2) + 1;
  const subtotal = product.Price * quantity;
  const shippingFee = 0;
  const total = subtotal + shippingFee;
  const createdAt = new Date(Date.now() - ((index + 4) * 3600000)); // Mỗi đơn cách nhau 1 giờ

  try {
    // Insert order
    db.prepare(`
      INSERT INTO Orders (Id, UserId, Username, Subtotal, ShippingFee, Total, FulfillmentMethod, PickupDate, Address, PaymentMethod, PaymentStatus, Status, CreatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      orderId,
      user.Id,
      user.Username,
      subtotal,
      shippingFee,
      total,
      'pickup',
      new Date(Date.now() + 86400000).toISOString(),
      '',
      'pickup',
      'pending-cod',
      statusInfo.status,
      createdAt.toISOString()
    );

    // Insert order items
    db.prepare(`
      INSERT INTO OrderItems (OrderId, ProductId, Quantity, UnitPrice, Subtotal)
      VALUES (?, ?, ?, ?, ?)
    `).run(
      orderId,
      product.Id,
      quantity,
      product.Price,
      subtotal
    );

    ordersCreated++;
    console.log(`✅ Created pickup order: ${orderId} - ${statusInfo.label}`);
  } catch (error) {
    console.error(`❌ Error creating pickup order ${index}:`, error.message);
  }
});

db.close();

console.log(`\n✅ Successfully created ${ordersCreated} workflow test orders!`);
console.log('\n📝 Test orders created:');
console.log('   - 4 delivery orders (Đang chuẩn bị → Đang giao → Đã giao → Đã hủy)');
console.log('   - 4 pickup orders (Đang chuẩn bị → Sẵn sàng → Hoàn thành → Đã hủy)');
console.log('\n🎯 Login as minhdev to see the workflow animations!');
console.log('   Username: minhdev');
console.log('   Password: User@123');
console.log('\n🚀 Go to Orders page to see the animated workflow!');
