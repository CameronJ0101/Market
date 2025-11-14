import db from "#db/client";
import bcrypt from "bcrypt";

async function seed() {
  try {
    console.log("🌱 Seeding database...");

    // Clear existing data (just to be safe)
    await db.query(`DELETE FROM order_products;`);
    await db.query(`DELETE FROM orders;`);
    await db.query(`DELETE FROM products;`);
    await db.query(`DELETE FROM users;`);

    console.log("🔹 Inserting user...");

    const hashedPassword = await bcrypt.hash("password123", 10);

    const {
      rows: [user],
    } = await db.query(
      `
      INSERT INTO users (username, password_hash)
      VALUES ($1, $2)
      RETURNING *;
      `,
      ["testuser", hashedPassword]
    );

    console.log("🔹 Inserting products...");

    const productData = [
      ["Red Apple", "Fresh and crispy.", 0.99, null],
      ["Orange Juice", "100% pure orange juice.", 3.49, null],
      ["Chocolate Bar", "Milk chocolate treat.", 1.2, null],
      ["Granola Bar", "Healthy snack.", 1.1, null],
      ["Bag of Chips", "Salty and crunchy.", 2.5, null],
      ["Pasta", "Italian dry pasta.", 1.89, null],
      ["Bread Loaf", "Freshly baked.", 2.99, null],
      ["Milk", "1 gallon whole milk.", 4.29, null],
      ["Eggs", "Carton of 12 eggs.", 3.79, null],
      ["Ground Beef", "1 lb package.", 5.99, null],
    ];

    const products = [];

    for (let product of productData) {
      const {
        rows: [created],
      } = await db.query(
        `
        INSERT INTO products (name, description, price, image_url)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
        `,
        product
      );

      products.push(created);
    }

    console.log("🔹 Creating user order...");

    const {
      rows: [order],
    } = await db.query(
      `
      INSERT INTO orders (user_id)
      VALUES ($1)
      RETURNING *;
      `,
      [user.id]
    );

    console.log("🔹 Adding 5 products to order...");

    // Add the first 5 products
    for (let i = 0; i < 5; i++) {
      await db.query(
        `
        INSERT INTO order_products (order_id, product_id, quantity)
        VALUES ($1, $2, $3);
        `,
        [order.id, products[i].id, 1] // quantity 1 each
      );
    }

    console.log("✅ Seed complete!");
  } catch (err) {
    console.error("❌ Seeding error:", err);
  }
}

// Run seed
await db.connect();
await seed();
await db.end();
