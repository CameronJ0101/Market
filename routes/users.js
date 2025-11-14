import express from "express";
import { createUser, verifyUser } from "#db/queries/users.js";
import requireBody from "#middleware/requireBody.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// POST /users/register
router.post(
  "/register",
  requireBody(["username", "password"]),
  async (req, res) => {
    try {
      const user = await createUser(req.body);
      res.status(201).json(user);
    } catch (err) {
      console.error(err);
      if (err.code === "23505") {
        // unique violation
        return res.status(400).send("Username already exists.");
      }
      res.status(500).send("Server error.");
    }
  }
);

// POST /users/login
router.post(
  "/login",
  requireBody(["username", "password"]),
  async (req, res) => {
    try {
      const user = await verifyUser(req.body.username, req.body.password);
      if (!user) return res.status(401).send("Invalid username or password.");

      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });

      res.json({ user, token });
    } catch (err) {
      console.error(err);
      res.status(500).send("Server error.");
    }
  }
);

export default router;
