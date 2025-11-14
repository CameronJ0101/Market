// db/queries/orders.js
import db from "#db/client.js";

/** Create a new order for a user */
export async function createOrder(userId) {
  const { rows } = await db.query(
    `INSERT INTO orders (user_id) VALUES ($1) RETURNING *;`,
    [userId]
  );
  return rows[0];
}

/** Get all orders for a specific user */
export async function getOrdersByUser(userId) {
  const { rows } = await db.query(
    `SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC;`,
    [userId]
  );
  return rows;
}

/** Get a specific order by ID */
export async function getOrderById(orderId) {
  const { rows } = await db.query(`SELECT * FROM orders WHERE id = $1;`, [
    orderId,
  ]);
  return rows[0] || null;
}

/** Add a product to an order */
export async function addProductToOrder(orderId, productId, quantity) {
  const { rows } = await db.query(
    `
    INSERT INTO order_products (order_id, product_id, quantity)
    VALUES ($1, $2, $3)
    ON CONFLICT (order_id, product_id)
    DO UPDATE SET quantity = order_products.quantity + EXCLUDED.quantity
    RETURNING *;
    `,
    [orderId, productId, quantity]
  );
  return rows[0];
}

/** Get all products in a specific order */
export async function getProductsInOrder(orderId) {
  const { rows } = await db.query(
    `
    SELECT p.id, p.name, p.description, p.price, op.quantity
    FROM order_products op
    JOIN products p ON op.product_id = p.id
    WHERE op.order_id = $1;
    `,
    [orderId]
  );
  return rows;
}
