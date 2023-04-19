import express from "express";
import bodyParser from "body-parser";
import con from "../config.js";
import { authenticateToken } from "./authenticate.js";

const router = express.Router();
const jsonParser = bodyParser.json();

router.post('/', authenticateToken, (req, res) => {
  const { company_name, job_position, description } = req.body;

  const sql = `INSERT INTO jobs
              (company_name, job_position, description) VALUES (?,?,?)`;
  
  con.query(sql, [company_name, job_position, description], (e, r) => {
    if (e) throw (e);

    
   res.status(200).send('Successful');  
    
  });
});

export default router;