// Test script to check staff API

async function testStaffAPI() {
  try {
    // First login as staff
    console.log('1. Logging in as staff...');
    const loginResponse = await fetch('http://localhost:4000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'nhanvien',
        password: 'Staff@123'
      })
    });
    
    const loginData = await loginResponse.json();
    console.log('Login response:', loginData);
    
    if (!loginData.token) {
      console.error('❌ Failed to get token');
      return;
    }
    
    console.log('✅ Login successful, token:', loginData.token.substring(0, 20) + '...');
    
    // Now get staff orders
    console.log('\n2. Fetching staff orders...');
    const ordersResponse = await fetch('http://localhost:4000/api/staff/orders', {
      headers: {
        'Authorization': `Bearer ${loginData.token}`
      }
    });
    
    const orders = await ordersResponse.json();
    console.log('Orders response:', orders);
    console.log(`✅ Found ${orders.length} orders`);
    
    if (orders.length > 0) {
      console.log('\nFirst order sample:');
      console.log(JSON.stringify(orders[0], null, 2));
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testStaffAPI();
