import express from "express";
import writeLog from "../../../serverFunctions/write-log.js";
import postgresCRUD from "../../../serverFunctions/postgress-CRUD-functions.js";

const adminLevel2CoursesRoutes = express.Router();

adminLevel2CoursesRoutes.get("/", async (req, res) => {
	try {
		const courses = await postgresCRUD.QUERY(
			`
				SELECT *
				FROM courses
				ORDER BY course_id
			`,
		);
		return res.json(courses);
	} catch (error) {
		writeLog(`Error fetching courses: ${error.message}`, "server.log");
		return res.status(500).json({ error: "Failed to fetch courses" });
	}
});

adminLevel2CoursesRoutes.post("/", async (req, res) => {
	try {
		const {
			course_id,
			course_title,
			course_name,
			course_description,
			description,
			classroom_number,
			capacity,
			credit_hours,
			tuition_cost,
			manager_staff_id,
		} = req.body ?? {};

		const resolvedTitle = course_title ?? course_name;
		const resolvedDescription = course_description ?? description ?? null;

		if (!course_id || !resolvedTitle) {
			return res.status(400).json({
				error: "Missing required fields: course_id and course_title",
			});
		}

		const createdCourse = await postgresCRUD.QUERY(
			`
				INSERT INTO courses (
					course_id,
					course_title,
					course_description,
					classroom_number,
					capacity,
					credit_hours,
					tuition_cost,
					manager_staff_id
				)
				VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
				RETURNING *
			`,
			[
				course_id,
				resolvedTitle,
				resolvedDescription,
				classroom_number ?? null,
				capacity ?? null,
				credit_hours ?? null,
				tuition_cost ?? null,
				manager_staff_id ?? null,
			],
		);

		writeLog(`Created course ${course_id}`, "server.log");
		return res.status(201).json(createdCourse[0]);
	} catch (error) {
		if (error?.code === "23505") {
			return res.status(409).json({ error: "Course already exists" });
		}
		writeLog(`Error creating course: ${error.message}`, "server.log");
		return res.status(500).json({ error: "Failed to create course" });
	}
});

adminLevel2CoursesRoutes.get("/:courseId", async (req, res) => {
	try {
		const [course] = await postgresCRUD.QUERY(
			`
				SELECT *
				FROM courses
				WHERE course_id = $1
			`,
			[req.params.courseId],
		);

		if (!course) {
			return res.status(404).json({ error: "Course not found" });
		}

		return res.json(course);
	} catch (error) {
		writeLog(
			`Error fetching course ${req.params.courseId}: ${error.message}`,
			"server.log",
		);
		return res.status(500).json({ error: "Failed to fetch course" });
	}
});

adminLevel2CoursesRoutes.put("/:courseId", async (req, res) => {
	try {
		const {
			course_title,
			course_name,
			course_description,
			description,
			classroom_number,
			capacity,
			credit_hours,
			tuition_cost,
			manager_staff_id,
		} = req.body ?? {};

		const resolvedTitle = course_title ?? course_name;
		const resolvedDescription = course_description ?? description;

		const hasUpdates = [
			resolvedTitle,
			resolvedDescription,
			classroom_number,
			capacity,
			credit_hours,
			tuition_cost,
			manager_staff_id,
		].some((value) => value !== undefined);

		if (!hasUpdates) {
			return res.status(400).json({ error: "No course fields were provided" });
		}

		const updated = await postgresCRUD.QUERY(
			`
				UPDATE courses
				SET
					course_title = COALESCE($1, course_title),
					course_description = COALESCE($2, course_description),
					classroom_number = COALESCE($3, classroom_number),
					capacity = COALESCE($4, capacity),
					credit_hours = COALESCE($5, credit_hours),
					tuition_cost = COALESCE($6, tuition_cost),
					manager_staff_id = COALESCE($7, manager_staff_id)
				WHERE course_id = $8
				RETURNING *
			`,
			[
				resolvedTitle ?? null,
				resolvedDescription ?? null,
				classroom_number ?? null,
				capacity ?? null,
				credit_hours ?? null,
				tuition_cost ?? null,
				manager_staff_id ?? null,
				req.params.courseId,
			],
		);

		if (!updated.length) {
			return res.status(404).json({ error: "Course not found" });
		}

		writeLog(`Updated course ${req.params.courseId}`, "server.log");
		return res.json(updated[0]);
	} catch (error) {
		writeLog(
			`Error updating course ${req.params.courseId}: ${error.message}`,
			"server.log",
		);
		return res.status(500).json({ error: "Failed to update course" });
	}
});

adminLevel2CoursesRoutes.delete("/:courseId", async (req, res) => {
	try {
		const deleted = await postgresCRUD.QUERY(
			`
				DELETE FROM courses
				WHERE course_id = $1
				RETURNING *
			`,
			[req.params.courseId],
		);

		if (!deleted.length) {
			return res.status(404).json({ error: "Course not found" });
		}

		writeLog(`Deleted course ${req.params.courseId}`, "server.log");
		return res.json(deleted[0]);
	} catch (error) {
		writeLog(
			`Error deleting course ${req.params.courseId}: ${error.message}`,
			"server.log",
		);
		return res.status(500).json({ error: "Failed to delete course" });
	}
});

export default adminLevel2CoursesRoutes;
