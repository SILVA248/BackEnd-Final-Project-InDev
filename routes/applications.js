import express from "express";
import con from "../config.js";
import { asyncCon } from "../config.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { authenticateToken } from "./authenticate.js";

const router = express.Router();

router.get("/", authenticateToken, async (_req, res) => {
  const { page, perPage } = _req.query;

  console.log(page, perPage);

  if (perPage > 100) {
    res.status(400).send("Per Page cannot be greater than 100");
  }

  const offset = page > 0 ? page * perPage : 0;

  const promise1 = asyncCon.query(
    "SELECT COUNT(application_id) as totalApps FROM applications"
  );

  const promise2 = asyncCon.query(
    "SELECT application_id, first_name, last_name, email, phone, linkedinURL, salaryExp from applications LIMIT ?, ?",
    [offset, parseInt(perPage)]
  );

  const [result1, result2] = await Promise.all([promise1, promise2]);

  const [r] = result1;

  const [results] = result2;

  const resultDbValues = Object.values(results);

  const totalApps = r[0].totalApps;

  console.log(results);

  res.send({ data: resultDbValues, total: totalApps });
});

router.post("/", (_req, res) => {
  const { first_name, last_name, email, phone, linkedinURL, salaryExp } =
    _req.body;

  const sql = `INSERT INTO applications
              (first_name, last_name, email, phone, linkedinURL, salaryExp
              VALUES (?,?,?,?,?,?)`;
  con.query(
    sql,
    [first_name, last_name, email, phone, linkedinURL, salaryExp],
    (e, r) => {
      if (e) throw e;

      res.status(200).send("Successful");
    }
  );
});

export default router;
