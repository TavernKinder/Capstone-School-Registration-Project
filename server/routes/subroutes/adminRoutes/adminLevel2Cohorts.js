import express from "express";
import writeLog from "../../../serverFunctions/write-log.js";
import postgresCRUD from "../../../serverFunctions/postgress-CRUD-functions.js";

const adminLevel2CohortsRoutes = express.Router();

adminLevel2CohortsRoutes.get("/", async (req, res) => {
	try {
		const cohorts = await postgresCRUD.QUERY(
			`
				SELECT *
				FROM cohorts
				ORDER BY cohort_id
			`,
		);
		return res.json(cohorts);
	} catch (error) {
		writeLog(`Error fetching cohorts: ${error.message}`, "server.log");
		return res.status(500).json({ error: "Failed to fetch cohorts" });
	}
});

adminLevel2CohortsRoutes.post("/", async (req, res) => {
	try {
		let {
			course_id,
			cohort_name,
			starting_date,
			ending_date,
			teacher_ids,
			student_ids,
		} = req.body ?? {};

		if (!course_id || typeof course_id !== "string") {
			return res
				.status(400)
				.json({ error: "course_id is required and must be a string" });
		}
		if (!cohort_name) {
			return res.status(400).json({ error: "cohort_name is required" });
		}

		if (!Array.isArray(teacher_ids)) {
			teacher_ids = [];
		}
		if (!Array.isArray(student_ids)) {
			student_ids = [];
		}

		const created = await postgresCRUD.QUERY(
			`
				INSERT INTO cohorts (
					course_id,
					cohort_name,
					starting_date,
					ending_date,
					teacher_ids,
					student_ids
				)
				VALUES ($1, $2, $3, $4, $5, $6)
				RETURNING *
			`,
			[
				course_id,
				cohort_name,
				starting_date ?? null,
				ending_date ?? null,
				teacher_ids,
				student_ids,
			],
		);

		writeLog(`Created cohort ${created[0].cohort_id}`, "server.log");
		return res.status(201).json(created[0]);
	} catch (error) {
		writeLog(`Error creating cohort: ${error.message}`, "server.log");
		return res.status(500).json({ error: "Failed to create cohort" });
	}
});

adminLevel2CohortsRoutes.get("/:cohortId", async (req, res) => {
	try {
		const cohortId = Number(req.params.cohortId);
		if (!Number.isInteger(cohortId) || cohortId <= 0) {
			return res.status(400).json({ error: "Invalid cohort id" });
		}

		const [cohort] = await postgresCRUD.QUERY(
			`
				SELECT *
				FROM cohorts
				WHERE cohort_id = $1
			`,
			[cohortId],
		);

		if (!cohort) {
			return res.status(404).json({ error: "Cohort not found" });
		}

		return res.json(cohort);
	} catch (error) {
		writeLog(
			`Error fetching cohort ${req.params.cohortId}: ${error.message}`,
			"server.log",
		);
		return res.status(500).json({ error: "Failed to fetch cohort" });
	}
});

adminLevel2CohortsRoutes.put("/:cohortId", async (req, res) => {
	try {
		const cohortId = Number(req.params.cohortId);
		if (!Number.isInteger(cohortId) || cohortId <= 0) {
			return res.status(400).json({ error: "Invalid cohort id" });
		}

		const {
			course_id,
			cohort_name,
			starting_date,
			ending_date,
			teacher_ids,
			student_ids,
		} = req.body ?? {};

		if (course_id !== undefined && typeof course_id !== "string") {
			return res.status(400).json({ error: "course_id must be a string" });
		}
		if (teacher_ids !== undefined && !Array.isArray(teacher_ids)) {
			return res.status(400).json({ error: "teacher_ids must be an array" });
		}
		if (student_ids !== undefined && !Array.isArray(student_ids)) {
			return res.status(400).json({ error: "student_ids must be an array" });
		}

		const hasUpdates = [
			course_id,
			cohort_name,
			starting_date,
			ending_date,
			teacher_ids,
			student_ids,
		].some((value) => value !== undefined);

		if (!hasUpdates) {
			return res.status(400).json({ error: "No cohort fields were provided" });
		}

		const updated = await postgresCRUD.QUERY(
			`
				UPDATE cohorts
				SET
					course_id = COALESCE($1, course_id),
					cohort_name = COALESCE($2, cohort_name),
					starting_date = COALESCE($3, starting_date),
					ending_date = COALESCE($4, ending_date),
					teacher_ids = COALESCE($5, teacher_ids),
					student_ids = COALESCE($6, student_ids)
				WHERE cohort_id = $7
				RETURNING *
			`,
			[
				course_id ?? null,
				cohort_name ?? null,
				starting_date ?? null,
				ending_date ?? null,
				teacher_ids ?? null,
				student_ids ?? null,
				cohortId,
			],
		);

		if (!updated.length) {
			return res.status(404).json({ error: "Cohort not found" });
		}

		writeLog(`Updated cohort ${cohortId}`, "server.log");
		return res.json(updated[0]);
	} catch (error) {
		writeLog(
			`Error updating cohort ${req.params.cohortId}: ${error.message}`,
			"server.log",
		);
		return res.status(500).json({ error: "Failed to update cohort" });
	}
});

adminLevel2CohortsRoutes.delete("/:cohortId", async (req, res) => {
	try {
		const cohortId = Number(req.params.cohortId);
		if (!Number.isInteger(cohortId) || cohortId <= 0) {
			return res.status(400).json({ error: "Invalid cohort id" });
		}

		const deleted = await postgresCRUD.QUERY(
			`
				DELETE FROM cohorts
				WHERE cohort_id = $1
				RETURNING *
			`,
			[cohortId],
		);

		if (!deleted.length) {
			return res.status(404).json({ error: "Cohort not found" });
		}

		writeLog(`Deleted cohort ${cohortId}`, "server.log");
		return res.json(deleted[0]);
	} catch (error) {
		writeLog(
			`Error deleting cohort ${req.params.cohortId}: ${error.message}`,
			"server.log",
		);
		return res.status(500).json({ error: "Failed to delete cohort" });
	}
});

export default adminLevel2CohortsRoutes;
