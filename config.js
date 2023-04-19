import mysql from "mysql2"
import asyncMysql from 'mysql2/promise'

var con = mysql.createConnection({ 
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

con.connect(function(err) {
  if (err) throw "Error connecting to DB: " + err.stack;

  console.log("Database connection established.");
});

export const asyncCon = await asyncMysql.createConnection({ 
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

export default con;
