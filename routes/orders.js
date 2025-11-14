import express from "express";
import getUserFromToken from "#middleware/getUserFromToken.js";
import requireUser from "#middleware/requireUser.js";
import requireBody from "#middleware/requireBody.js";
import {
  createOrder,
  getOrdersByUser,
  getOrderById,
  addProductToOrder,
  getProductsInOrder,
} from "#db/queries/orders.js";

const router = express.Router();

// All routes require user
router.use(getUserFromToken, requireUser);

// GET /orders
router.get("/", async (req, res) => {
  const orders = await getOrdersByUser(req.user.id);
  res.json(orders);
});

// POST /orders
router.post("/", async (req, res) => {
  const order = await createOrder(req.user.id);
  res.status(201).json(order);
});

// GET /orders/:id
router.get("/:id", async (req, res) => {
  const order = await getOrderById(req.params.id);
  if (!order || order.user_id !== req.user.id)
    return res.status(403).send("Access denied.");
  res.json(order);
});

// POST /orders/:id/products
router.post(
  "/:id/products",
  requireBody(["productId", "quantity"]),
  async (req, res) => {
    const order = await getOrderById(req.params.id);
    if (!order || order.user_id !== req.user.id)
      return res.status(403).send("Access denied.");

    const added = await addProductToOrder(
      order.id,
      req.body.productId,
      req.body.quantity
    );
    res.status(201).json(added);
  }
);

// GET /orders/:id/products
router.get("/:id/products", async (req, res) => {
  const order = await getOrderById(req.params.id);
  if (!order || order.user_id !== req.user.id)
    return res.status(403).send("Access denied.");

  const products = await getProductsInOrder(order.id);
  res.json(products);
});

export default router;
