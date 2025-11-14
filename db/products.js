import db from "#db/client.js";

/** Get all products */
export async function getAllProducts() {
  const { rows } = await db.query(`SELECT * FROM products ORDER BY id;`);
  return rows;
}

/** Get a product by ID */
export async function getProductById(id) {
  const { rows } = await db.query(`SELECT * FROM products WHERE id = $1;`, [
    id,
  ]);
  return rows[0] || null;
}

/** Get all orders containing this product for a specific user */
export async function getOrdersByProduct(productId, userId) {
  const { rows } = await db.query(
    `
    SELECT o.id AS order_id, o.status, o.created_at
    FROM orders o
    JOIN order_products op ON o.id = op.order_id
    WHERE op.product_id = $1 AND o.user_id = $2
    ORDER BY o.created_at DESC;
    `,
    [productId, userId]
  );
  return rows;
}
