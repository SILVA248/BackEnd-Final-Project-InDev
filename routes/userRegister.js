import express from "express";
import { asyncCon } from "../config.js";
import bcrypt from "bcrypt";

const router = express.Router();

router.post("/", async (req, res) => {
  const { email, password } = req.body;

  const [rows] = await asyncCon.query("SELECT * FROM users WHERE email = ?", [
    email,
  ]);

  if (rows.length > 0) {
    res.status(400).json({ message: "Email already exists" });
    return;
  }

  const saltRounds = 10;
  const passwordhash = await bcrypt.hash(password, saltRounds);

  await asyncCon.query(
    "INSERT INTO users (email, passwordhash, role_id) VALUES (?, ?, 1)",
    [email, passwordhash]
  );

  res.json({ message: "User created" });

  asyncCon.end();
});

export default router;
