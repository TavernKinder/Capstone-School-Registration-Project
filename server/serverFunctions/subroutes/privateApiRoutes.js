import express from "express";
import postgresCRUD from "../postgress-CRUD-functions.js";
import { authenticateToken, checkRole } from "../securityFunctions.js";
import writeLog from "../write-log.js";

const privateRoutes = express.Router();

privateRoutes.use(async (req, res, next) => {
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

privateRoutes.get("/my-info", async (req, res) => {
  const userId = Number(req.auth?.user_id);

  try {
    if (!Number.isInteger(userId) || userId <= 0) {
      return res
        .status(401)
        .json({ error: "Invalid or missing token identity" });
    }

    const rows = await postgresCRUD.QUERY(
      `
				SELECT
					u.user_id,
					u.staff_id,
					u.student_id,
					CASE
						WHEN u.staff_id IS NOT NULL THEN 'staff'
						WHEN u.student_id IS NOT NULL THEN 'student'
						ELSE NULL
					END AS role,
					CASE
						WHEN u.staff_id IS NOT NULL THEN row_to_json(st)
						WHEN u.student_id IS NOT NULL THEN row_to_json(s)
						ELSE NULL
					END AS profile
				FROM users u
				LEFT JOIN staff st ON st.staff_id = u.staff_id
				LEFT JOIN students s ON s.student_id = u.student_id
				WHERE u.user_id = $1
			`,
      [userId],
    );

    if (!rows.length) {
      writeLog(`No user found for user_id=${userId}`, "server.log");
      return res.status(404).json({ error: "User not found" });
    }

    writeLog(
      `GET request received at /api/private/my-info for user_id=${userId}`,
      "server.log",
    );
    return res.json(rows[0]);
  } catch (error) {
    writeLog(
      `Error fetching my-info for user_id=${userId}: ${error.message}`,
      "server.log",
    );
    return res.status(500).json({ error: "Failed to fetch user info" });
  }
});

privateRoutes.post("/my-info", async (req, res) => {
  const userId = Number(req.auth?.user_id);

  try {
    if (!Number.isInteger(userId) || userId <= 0) {
      return res
        .status(401)
        .json({ error: "Invalid or missing token identity" });
    }
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ error: "No profile fields were provided" });
    }

    const allowedKeys = new Set([
      "username",
      "email",
      "password",
      "phone_number",
      "address",
      "first_name",
      "middle_name",
      "last_name",
      "birth_date",
    ]);
    const updateData = Object.fromEntries(
      Object.entries(req.body).filter(([key]) => allowedKeys.has(key)),
    );

    if (Object.keys(updateData).length === 0) {
      return res
        .status(400)
        .json({ error: "No valid profile fields were provided" });
    }

    const [currentUser] = await postgresCRUD.QUERY(
      `
				SELECT user_id, staff_id, student_id
				FROM users
				WHERE user_id = $1
			`,
      [userId],
    );

    if (!currentUser) {
      return res.status(404).json({ error: "User not found" });
    }

    let updatedRows = [];

    if (currentUser.student_id) {
      updatedRows = await postgresCRUD.UPDATE("students", updateData, {
        student_id: currentUser.student_id,
      });
    } else if (currentUser.staff_id) {
      updatedRows = await postgresCRUD.UPDATE("staff", updateData, {
        staff_id: currentUser.staff_id,
      });
    }

    if (!updatedRows.length) {
      return res.status(404).json({ error: "Profile update failed" });
    }

    writeLog(
      `POST request received at /api/private/my-info for user_id=${userId}`,
      "server.log",
    );
    return res.json({
      message: "Profile updated successfully",
      profile: updatedRows[0],
    });
  } catch (error) {
    writeLog(
      `Error updating profile for user_id=${userId}: ${error.message}`,
      "server.log",
    );
    return res.status(500).json({ error: "Failed to update profile" });
  }
});

privateRoutes.use(
  "/student",
  checkRole("student"),
  (await import("./privateStudent.js")).default,
);
privateRoutes.use(
  "/staff",
  checkRole("staff"),
  (await import("./privateStaff.js")).default,
);

export default privateRoutes;
