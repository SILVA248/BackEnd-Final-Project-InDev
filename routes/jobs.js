import express from "express";
import con from "../config.js";
import { asyncCon } from "../config.js";
import { authenticateToken } from "./authenticate.js";

const router = express.Router();

router.get("/",  authenticateToken, async (_req, res) => {

  const { page, perPage } = _req.query;

  console.log(page, perPage);

   if (perPage > 100) {
    res.status(400).send("Per Page cannot be greater than 100");
  }

  const offset = page > 0 ? ((page) * perPage) : 0;
  
  const promise1 = asyncCon.query("SELECT COUNT(job_id) as totalJobs FROM jobs")
    
  const promise2 = asyncCon.query(`SELECT job_id, job_position,                                                        company_name, description 
                                          FROM jobs j 
                                          LIMIT ?, ?`, 
                                          [offset, parseInt(perPage)]);  

  const [result1, result2] = await Promise.all([promise1, promise2]);

  const [r] = result1;
  
  const [results] = result2;
        
  const totalJobs = r[0].totalJobs;  
      
  const resultDBValues = Object.values(results)  
       
       console.log(results)
    
    res.send({'data': resultDBValues, 'total':totalJobs}) 
})

router.put('/:job_id', authenticateToken, (req, res) => {
  
  const { job_id } = req.params;
  const { company_name, job_position, description } = req.body;
  const sql = `UPDATE jobs 
               SET company_name = ?, job_position = ?, description = ?
               WHERE job_id = ?`;
  
  console.log(`Successful`);

  con.query(sql, [company_name, job_position, description, job_id ], (err, results) => {
    if (err) throw err;
  
  res.status(200).send('Successful');
});
})

router.delete('/:job_id',authenticateToken, (req, res) => {
  
  const { job_id } = req.params;
  const sql = `DELETE FROM jobs WHERE job_id = ?;`
  
  console.log(`Delete complete`);

  con.query(sql, [job_id], (err, results) => {
    if (err) throw err;
  
  res.status(200).send('Successful');
});
})

export default router;
