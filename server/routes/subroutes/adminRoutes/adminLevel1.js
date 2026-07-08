import express from "express";
import writeLog from "../../../serverFunctions/write-log.js";
import postgresCRUD from "../../../serverFunctions/postgress-CRUD-functions.js";

const adminLevel1Routes = express.Router();

adminLevel1Routes.get("/", async (req, res) => {
	res.send("Admin Level 1 API");
});

adminLevel1Routes.get("/students", async (req, res) => {
	const students = await postgresCRUD.READ("students");
	res.json(students);
});

adminLevel1Routes.post("/students", async (req, res) => {
	const { email, name } = req.body;
	if (!email || !name) {
		return res.status(400).json({ error: "Missing required fields" });
	}
	const newStudent = await postgresCRUD.CREATE("students", { email, name });
	res.status(201).json(newStudent);
    writeLog(`Created student: ${JSON.stringify(newStudent)}`, "server.log");
});

adminLevel1Routes.get("/students/:id", async (req, res) => {
	const { id } = req.params;
	const student = await postgresCRUD.READ("students", { student_id: id });
	if (student.length === 0) {
		res.status(404).json({ error: "Student not found" });
	} else {
		res.json(student[0]);
	}
});

adminLevel1Routes.put("/students/:id", async (req, res) => {
	const { id } = req.params;
	const { email, name } = req.body;
	if (!email || !name) {
		return res.status(400).json({ error: "Missing required fields" });
	}
	const updatedStudent = await postgresCRUD.UPDATE("students", { student_id: id }, { email, name });
	if (updatedStudent.length === 0) {
		res.status(404).json({ error: "Student not found" });
	} else {
		res.json(updatedStudent[0]);
        writeLog(`Updated student: ${JSON.stringify(updatedStudent[0])}`, "server.log");
	}
});

adminLevel1Routes.delete("/students/:id", async (req, res) => {
	const { id } = req.params;
	const deletedStudent = await postgresCRUD.DELETE("students", { student_id: id });
	if (deletedStudent.length === 0) {
		res.status(404).json({ error: "Student not found" });
	} else {
		res.json(deletedStudent[0]);
        writeLog(`Deleted student: ${JSON.stringify(deletedStudent[0])}`, "server.log");
	}
});

export default adminLevel1Routes;