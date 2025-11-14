// routes/products.js
import express from "express";
import {
  getAllProducts,
  getProductById,
  getOrdersByProduct,
} from "#db/queries/products.js";
import getUserFromToken from "#middleware/getUserFromToken.js";
import requireUser from "#middleware/requireUser.js";

const router = express.Router();

// GET /products
router.get("/", async (req, res) => {
  const products = await getAllProducts();
  res.json(products);
});

// GET /products/:id
router.get("/:id", async (req, res) => {
  const product = await getProductById(req.params.id);
  if (!product) return res.status(404).send("Product not found.");
  res.json(product);
});

// GET /products/:id/orders
router.get("/:id/orders", getUserFromToken, requireUser, async (req, res) => {
  const productId = req.params.id;
  const userId = req.user.id;

  const orders = await getOrdersByProduct(productId, userId);
  res.json(orders);
});

export default router;
