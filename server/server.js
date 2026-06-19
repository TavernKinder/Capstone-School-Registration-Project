import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import writeLog from "./serverFunctions/write-log.js";
import postgresCRUD from "./serverFunctions/postgress-CRUD-functions.js";
import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 3001;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.static(path.resolve(__dirname, "../client/dist")));

app.get("/api", (req, res) => {
  res.json({ message: "Hello from server!" });
  writeLog("GET request received at /api", "server.log");
});

app.get("/api/students", async (req, res) => {
  try {
    const students = await postgresCRUD.READ("students");
    res.json(students);
    writeLog("GET request received at /api/students", "server.log");
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch students" });
    writeLog(`Error fetching students: ${error.message}`, "server.log");
  }
});

app.get("/api/teachers", async (req, res) => {
  try {
    const teachers = await postgresCRUD.READ("teachers");
    res.json(teachers);
    writeLog("GET request received at /api/teachers", "server.log");
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch teachers" });
    writeLog(`Error fetching teachers: ${error.message}`, "server.log");
  }
});

app.get("/api/courses", async (req, res) => {
  try {
    const courses = await postgresCRUD.READ("courses");
    res.json(courses);
    writeLog("GET request received at /api/courses", "server.log");
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch courses" });
    writeLog(`Error fetching courses: ${error.message}`, "server.log");
  }
});

app.get("/api/cohorts", async (req, res) => {
  try {
    const cohorts = await postgresCRUD.READ("cohorts");
    res.json(cohorts);
    writeLog("GET request received at /api/cohorts", "server.log");
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch cohorts" });
    writeLog(`Error fetching cohorts: ${error.message}`, "server.log");
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
  writeLog(`Server started and listening on port ${PORT}`, "server.log");
});
