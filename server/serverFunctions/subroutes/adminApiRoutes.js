import express from "express";
import writeLog from "../write-log.js";
import postgresCRUD from "../postgress-CRUD-functions.js";
import { authenticateToken } from "../securityFunctions.js";

const adminRoutes = express.Router();

adminRoutes.use(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.slice(7)
    : undefined;
  const result = await authenticateToken(token);

  if (result.error) {
    return res.status(401).json({ error: result.error });
  }

  req.auth = result.decoded;
  return next();
});

adminRoutes.get("/students", async (req, res) => {
  try {
    const students = await postgresCRUD.READ("students");
    res.json(students);
    writeLog("GET request received at /api/students", "server.log");
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch students" });
    writeLog(`Error fetching students: ${error.message}`, "server.log");
  }
});

adminRoutes.get("/cohorts", async (req, res) => {
  try {
    const cohorts = await postgresCRUD.READ("cohorts");
    res.json(cohorts);
    writeLog("GET request received at /api/cohorts", "server.log");
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch cohorts" });
    writeLog(`Error fetching cohorts: ${error.message}`, "server.log");
  }
});

export default adminRoutes;
