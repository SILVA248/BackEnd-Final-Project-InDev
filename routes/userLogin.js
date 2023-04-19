import express from "express";
import { asyncCon } from "../config.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { authenticateToken } from "./authenticate.js";

const router = express.Router();


router.post('/', async (req, res) => {
  const { email, password } = req.body
  
  const [rows] = await asyncCon.query('SELECT * FROM users WHERE email = ?', [email])

  if (rows.length === 0) {
    res.status(401).json({ message: 'Invalid email or password' })
    return
  }

  const user = rows[0]
  console.log(password, user.passwordhash)
  const match = await bcrypt.compare(password, user.passwordhash)

  if (!match) {
    res.status(401).json({ message: 'Invalid email or password' })
    return
  }
 
  const token = jwt.sign({ role_id: user.role_id }, process.env.JWT_SECRET, { expiresIn: '2d' })

  res.json({ token })
})



export default router;