// Script to update all user passwords to 123456
const bcrypt = require('bcryptjs');
const { getPool, sql } = require('../src/db');

async function updatePasswords() {
  try {
    console.log('🔄 Updating all user passwords to 123456...');
    
    const newPasswordHash = bcrypt.hashSync('123456', 10);
    const pool = await getPool();
    
    // Update all users
    await pool.request()
      .input('passwordHash', sql.NVarChar, newPasswordHash)
      .query('UPDATE Users SET PasswordHash = @passwordHash');
    
    console.log('✅ Successfully updated all passwords to 123456!');
    console.log('\nTài khoản test:');
    console.log('- Admin: admin / 123456');
    console.log('- Staff: nhanvien / 123456');
    console.log('- User: minhdev / 123456');
    console.log('- Locked: blockeduser / 123456');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

updatePasswords();
