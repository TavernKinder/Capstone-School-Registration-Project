import express from "express";
import writeLog from "../../../serverFunctions/write-log.js";
import postgresCRUD from "../../../serverFunctions/postgress-CRUD-functions.js";

const adminLevel3StaffRoutes = express.Router();

function parseStaffId(value) {
	const staffId = Number(value);
	return Number.isInteger(staffId) && staffId > 0 ? staffId : null;
}

function parseAccessLevel(value) {
	if (value === undefined) {
		return undefined;
	}
	const accessLevel = Number(value);
	if (!Number.isInteger(accessLevel) || accessLevel < 0 || accessLevel > 3) {
		return null;
	}
	return accessLevel;
}

adminLevel3StaffRoutes.get("/", async (req, res) => {
	try {
		const rows = await postgresCRUD.QUERY(
			`
				SELECT *
				FROM staff
				ORDER BY staff_id
			`,
		);
		return res.json(rows);
	} catch (error) {
		writeLog(`Error fetching staff: ${error.message}`, "server.log");
		return res.status(500).json({ error: "Failed to fetch staff" });
	}
});

adminLevel3StaffRoutes.post("/", async (req, res) => {
	try {
		const {
			username,
			email,
			password,
			phone_number,
			address,
			access_level,
			first_name,
			middle_name,
			last_name,
			birth_date,
			position
		} = req.body ?? {};

		const parsedAccessLevel = parseAccessLevel(access_level);
		if (
			!username ||
			!email ||
			!password ||
			!first_name ||
			!last_name ||
			!position ||
			parsedAccessLevel === null
		) {
			return res.status(400).json({
				error:
					"Missing or invalid fields: username, email, password, first_name, last_name, position, access_level(0-3)",
			});
		}

		const rows = await postgresCRUD.QUERY(
			`
				WITH next_user AS (
					SELECT nextval(pg_get_serial_sequence('users', 'user_id')) AS user_id
				),
				inserted_staff AS (
					INSERT INTO staff (
						user_id,
						username,
						email,
						password,
						phone_number,
						address,
						access_level,
						assigned_cohort_ids,
						assigned_cohorts,
						assigned_classes,
						first_name,
						middle_name,
						last_name,
						birth_date,
						position
					)
					SELECT
						nu.user_id,
						$1,
						$2,
						$3,
						$4,
						$5,
						$6,
						$7,
						$8,
						$9,
						$10,
						$11,
						$12,
						$13,
						$14
					FROM next_user nu
					RETURNING *
				),
				inserted_user AS (
					INSERT INTO users (user_id, staff_id)
					SELECT nu.user_id, s.staff_id
					FROM next_user nu
					CROSS JOIN inserted_staff s
					RETURNING user_id, staff_id
				)
				SELECT s.*
				FROM inserted_staff s
				JOIN inserted_user u ON u.staff_id = s.staff_id
			`,
			[
				username,
				email,
				password,
				phone_number ?? null,
				address ?? null,
				parsedAccessLevel,
				Array.isArray(assigned_cohort_ids) ? assigned_cohort_ids : null,
				Array.isArray(assigned_cohorts) ? assigned_cohorts : null,
				Array.isArray(assigned_classes) ? assigned_classes : null,
				first_name,
				middle_name ?? null,
				last_name,
				birth_date ?? null,
				position,
			],
		);

		writeLog(`Created staff account ${rows[0].staff_id}`, "server.log");
		return res.status(201).json(rows[0]);
	} catch (error) {
		if (error?.code === "23505") {
			return res.status(409).json({ error: "Staff account already exists" });
		}
		writeLog(`Error creating staff account: ${error.message}`, "server.log");
		return res.status(500).json({ error: "Failed to create staff account" });
	}
});

adminLevel3StaffRoutes.get("/id/:staffId", async (req, res) => {
	const staffId = parseStaffId(req.params.staffId);
	if (!staffId) {
		return res.status(400).json({ error: "Invalid staff id" });
	}

	try {
		const [row] = await postgresCRUD.QUERY(
			`
				SELECT *
				FROM staff
				WHERE staff_id = $1
			`,
			[staffId],
		);

		if (!row) {
			return res.status(404).json({ error: "Staff not found" });
		}

		return res.json(row);
	} catch (error) {
		writeLog(`Error fetching staff ${staffId}: ${error.message}`, "server.log");
		return res.status(500).json({ error: "Failed to fetch staff account" });
	}
});

adminLevel3StaffRoutes.put("/id/:staffId", async (req, res) => {
	const staffId = parseStaffId(req.params.staffId);
	if (!staffId) {
		return res.status(400).json({ error: "Invalid staff id" });
	}

	try {
		const {
			username,
			email,
			password,
			phone_number,
			address,
			access_level,
			assigned_cohort_ids,
			assigned_cohorts,
			assigned_classes,
			first_name,
			middle_name,
			last_name,
			birth_date,
			position,
		} = req.body ?? {};

		const parsedAccessLevel = parseAccessLevel(access_level);
		if (access_level !== undefined && parsedAccessLevel === null) {
			return res.status(400).json({ error: "access_level must be an integer from 0 to 3" });
		}
		if (assigned_cohort_ids !== undefined && !Array.isArray(assigned_cohort_ids)) {
			return res.status(400).json({ error: "assigned_cohort_ids must be an array" });
		}
		if (assigned_cohorts !== undefined && !Array.isArray(assigned_cohorts)) {
			return res.status(400).json({ error: "assigned_cohorts must be an array" });
		}
		if (assigned_classes !== undefined && !Array.isArray(assigned_classes)) {
			return res.status(400).json({ error: "assigned_classes must be an array" });
		}

		const hasUpdates = [
			username,
			email,
			password,
			phone_number,
			address,
			access_level,
			assigned_cohort_ids,
			assigned_cohorts,
			assigned_classes,
			first_name,
			middle_name,
			last_name,
			birth_date,
			position,
		].some((value) => value !== undefined);

		if (!hasUpdates) {
			return res.status(400).json({ error: "No staff fields were provided" });
		}

		const rows = await postgresCRUD.QUERY(
			`
				UPDATE staff
				SET
					username = COALESCE($1, username),
					email = COALESCE($2, email),
					password = COALESCE($3, password),
					phone_number = COALESCE($4, phone_number),
					address = COALESCE($5, address),
					access_level = COALESCE($6, access_level),
					assigned_cohort_ids = COALESCE($7, assigned_cohort_ids),
					assigned_cohorts = COALESCE($8, assigned_cohorts),
					assigned_classes = COALESCE($9, assigned_classes),
					first_name = COALESCE($10, first_name),
					middle_name = COALESCE($11, middle_name),
					last_name = COALESCE($12, last_name),
					birth_date = COALESCE($13, birth_date),
					position = COALESCE($14, position)
				WHERE staff_id = $15
				RETURNING *
			`,
			[
				username ?? null,
				email ?? null,
				password ?? null,
				phone_number ?? null,
				address ?? null,
				parsedAccessLevel ?? null,
				assigned_cohort_ids ?? null,
				assigned_cohorts ?? null,
				assigned_classes ?? null,
				first_name ?? null,
				middle_name ?? null,
				last_name ?? null,
				birth_date ?? null,
				position ?? null,
				staffId,
			],
		);

		if (!rows.length) {
			return res.status(404).json({ error: "Staff not found" });
		}

		writeLog(`Updated staff account ${staffId}`, "server.log");
		return res.json(rows[0]);
	} catch (error) {
		if (error?.code === "23505") {
			return res.status(409).json({ error: "Updated values conflict with an existing account" });
		}
		writeLog(`Error updating staff account ${staffId}: ${error.message}`, "server.log");
		return res.status(500).json({ error: "Failed to update staff account" });
	}
});

adminLevel3StaffRoutes.delete("/id/:staffId", async (req, res) => {
	const staffId = parseStaffId(req.params.staffId);
	if (!staffId) {
		return res.status(400).json({ error: "Invalid staff id" });
	}

	try {
		const rows = await postgresCRUD.QUERY(
			`
				WITH deleted_user AS (
					DELETE FROM users
					WHERE staff_id = $1
				),
				deleted_staff AS (
					DELETE FROM staff
					WHERE staff_id = $1
					RETURNING *
				)
				SELECT *
				FROM deleted_staff
			`,
			[staffId],
		);

		if (!rows.length) {
			return res.status(404).json({ error: "Staff not found" });
		}

		writeLog(`Deleted staff account ${staffId}`, "server.log");
		return res.json(rows[0]);
	} catch (error) {
		writeLog(`Error deleting staff account ${staffId}: ${error.message}`, "server.log");
		return res.status(500).json({ error: "Failed to delete staff account" });
	}
});

export default adminLevel3StaffRoutes;
