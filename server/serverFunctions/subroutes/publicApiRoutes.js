import express from "express";
import writeLog from "../write-log.js";
import postgresCRUD from "../postgress-CRUD-functions.js";

const publicRouter = express.Router();

publicRouter.post("/students", async (req, res) => {
  try {
    const newStudent = req.body;
    const createdStudent = await postgresCRUD.CREATE("students", newStudent);
    res.status(201).json(createdStudent);
    writeLog("POST request received at /api/students", "server.log");
  } catch (error) {
    res.status(500).json({ error: "Failed to create student" });
    writeLog(`Error creating student: ${error.message}`, "server.log");
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

publicRouter.get("/staff", async (req, res) => {
  return getStaffHandler(req, res, "/api/staff");
});

publicRouter.get("/teachers", async (req, res) => {
  return getStaffHandler(req, res, "/api/teachers");
});

publicRouter.get("/courses", async (req, res) => {
  try {
    const courses = await postgresCRUD.READ("courses");
    res.json(courses);
    writeLog("GET request received at /api/courses", "server.log");
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch courses" });
    writeLog(`Error fetching courses: ${error.message}`, "server.log");
  }
});

export default publicRouter;
