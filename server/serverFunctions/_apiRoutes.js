import express from "express";
import writeLog from "./write-log.js";
import postgresCRUD from "./postgress-CRUD-functions.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.json({ message: "Hello from server!" });
  writeLog("GET request received at /api", "server.log");
});

router.get("/students", async (req, res) => {
  try {
    const students = await postgresCRUD.READ("students");
    res.json(students);
    writeLog("GET request received at /api/students", "server.log");
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch students" });
    writeLog(`Error fetching students: ${error.message}`, "server.log");
  }
});

async function getStaffHandler(req, res, routeLabel) {
  try {
    const staff = await postgresCRUD.READ("staff");
    res.json(staff);
    writeLog(`GET request received at ${routeLabel}`, "server.log");
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch staff" });
    writeLog(`Error fetching staff: ${error.message}`, "server.log");
  }
}

router.get("/staff", async (req, res) => {
  return getStaffHandler(req, res, "/api/staff");
});

router.get("/teachers", async (req, res) => {
  return getStaffHandler(req, res, "/api/teachers");
});

router.get("/courses", async (req, res) => {
  try {
    const courses = await postgresCRUD.READ("courses");
    res.json(courses);
    writeLog("GET request received at /api/courses", "server.log");
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch courses" });
    writeLog(`Error fetching courses: ${error.message}`, "server.log");
  }
});

router.get("/cohorts", async (req, res) => {
  try {
    const cohorts = await postgresCRUD.READ("cohorts");
    res.json(cohorts);
    writeLog("GET request received at /api/cohorts", "server.log");
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch cohorts" });
    writeLog(`Error fetching cohorts: ${error.message}`, "server.log");
  }
});

export default router;
