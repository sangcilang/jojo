require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });

const { getPool, sql } = require("../src/db");
const { seedProducts } = require("../src/seedData");

async function main() {
  const pool = await getPool();

  for (const product of seedProducts) {
    await pool
      .request()
      .input("id", sql.NVarChar, product.id)
      .input("description", sql.NVarChar(sql.MAX), product.description)
      .input("specs", sql.NVarChar(sql.MAX), JSON.stringify(product.specs))
      .query(`
        UPDATE dbo.Products
        SET Description = @description,
            Specs = @specs
        WHERE Id = @id
      `);
  }

  console.log(`Đã cập nhật mô tả và thông số cho ${seedProducts.length} sản phẩm.`);
  process.exit(0);
}

main().catch((error) => {
  console.error("Cập nhật dữ liệu sản phẩm thất bại:", error.message);
  process.exit(1);
});
