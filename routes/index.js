import express from "express";
import usersRouter from "./users.js";
import productsRouter from "./products.js";
import ordersRouter from "./orders.js";

const router = express.Router();

router.use("/users", usersRouter);
router.use("/products", productsRouter);
router.use("/orders", ordersRouter);

export default router;
