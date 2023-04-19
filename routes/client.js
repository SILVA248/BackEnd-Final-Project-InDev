import express from "express";
import con from "../config.js";
import { asyncCon } from "../config.js";

const router = express.Router();

router.get("/", async (_req, res) => {

  const { page, perPage } = _req.query;

  console.log(page, perPage);

   if (perPage > 100) {
    res.status(400).send("Per Page cannot be greater than 100");
  }

  const offset = page > 0 ? ((page) * perPage) : 0;

  const promise1 = asyncCon.query("SELECT COUNT(job_id) as totalJobs FROM jobs")

  const promise2 = asyncCon.query(`SELECT * FROM jobs j LIMIT ?, ?`, [offset, parseInt(perPage)]);

  const [result1, result2] = await Promise.all([promise1, promise2]);

  const [r] = result1;

  const [results] = result2;

  const totalJobs = r[0].totalJobs;
  console.log(totalJobs)

  const resultDBValues = Object.values(results)

       //console.log(resultDBValues)

    res.send({'data': resultDBValues, 'total':totalJobs}) 
})


export default router;