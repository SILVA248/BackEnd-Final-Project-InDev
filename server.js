import express from "express";
import con from "./config.js";
import cors from "cors";
import applications from "./routes/applications.js";
import jobs from "./routes/jobs.js";
import userLogin from "./routes/userLogin.js";
import newJob from "./routes/newJob.js";
import applicants from "./routes/applicants.js";
import bodyParser from "body-parser";
import client from "./routes/client.js";
import userRegister from "./routes/userRegister.js";

const port = 80;
const app = express();

//middleware, needed for the connection to the frontend
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", (_req, res) => res.send("<h1>Backend J3M3</h2>"));

//routes
app.use("/applications", applications);

app.use("/jobs", jobs);

app.use("/newJob", newJob);

app.use("/userLogin", userLogin);

app.use("/applicants", applicants);

app.use("/client", client);

app.use("/userRegister", userRegister);

app.listen(port, () => {
  console.log(`miles-backend is running on port ${port}`);
});
