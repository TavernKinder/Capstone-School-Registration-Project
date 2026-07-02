import express from "express";
import postgresCRUD from "../postgress-CRUD-functions.js";
import writeLog from "../write-log.js";
 
const privateStaffRoutes = express.Router();

async function getAccessibleCohorts(req, res) {
    const userId = req.auth?.user_id;
    try {
        const rows = await postgresCRUD.QUERY(
            `
                        SELECT DISTINCT c.*
                        FROM cohorts c
                        JOIN courses crs ON crs.course_id = c.course_id
                        JOIN users u ON u.user_id = $1
                        WHERE u.staff_id IS NOT NULL
                            AND (
                                u.staff_id = ANY(COALESCE(c.teacher_ids, ARRAY[]::INT[]))
                                OR u.staff_id = crs.manager_staff_id
                            )
                        ORDER BY c.cohort_id
            `,
            [userId],
        );
        return res.json(rows);
    } catch (error) {
        writeLog(
            `Error fetching cohorts: ${error.message}`,
            "server.log",
        );
        return res.status(500).json({ error: "Failed to fetch cohorts" });
    }
}

async function requireCohortTeacherOrCourseManager(req, res, next) {
    try {
    const cohortIdRaw = req.params.cohortId;
    const cohortId = Number(cohortIdRaw);
        const userId = req.auth?.user_id;

        if (!Number.isInteger(cohortId) || cohortId <= 0) {
            return res.status(400).json({ error: "Invalid cohort id" });
        }

                const [cohortExists] = await postgresCRUD.QUERY(
                        "SELECT 1 FROM cohorts WHERE cohort_id = $1",
                        [cohortId],
                );

                if (!cohortExists) {
                        return res.status(404).json({ error: "Cohort not found" });
                }

        const rows = await postgresCRUD.QUERY(
            `
            SELECT c.*
            FROM cohorts c
                        JOIN courses crs ON crs.course_id = c.course_id
            WHERE c.cohort_id = $2
                            AND EXISTS (
                                SELECT 1
                                FROM users u
                                WHERE u.user_id = $1
                                    AND u.staff_id IS NOT NULL
                                    AND (
                                        u.staff_id = ANY(COALESCE(c.teacher_ids, ARRAY[]::INT[]))
                                        OR u.staff_id = crs.manager_staff_id
                                    )
                            )
            `,
            [userId, cohortId],
        );

        if (!rows.length) {
            return res.status(403).json({ error: "Access denied" });
        }

        req.cohort = rows[0];
        return next();
    } catch (error) {
        writeLog(
            `Error authorizing cohort access for user_id=${req.auth?.user_id}: ${error.message}`,
            "server.log",
        );
        return res.status(500).json({ error: "Failed to verify cohort access" });
    }
}
// Get all cohorts staff has access to.
privateStaffRoutes.get("/", getAccessibleCohorts);

// Dedicated alias to avoid accidental collision with /:cohortId.
privateStaffRoutes.get("/my-cohorts", getAccessibleCohorts);
// Create new cohort
privateStaffRoutes.post("/", async (req, res) => {
    let { course_id, cohort_name, starting_date, ending_date, teacher_ids, student_ids } = req.body;
    if (!course_id) {
        return res.status(400).json({ error: "course_id is required" });
    }
    if (typeof course_id !== "string") {
        return res.status(400).json({ error: "course_id must be a course code string" });
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
    try {
        await postgresCRUD.QUERY(
            `
                SELECT setval(
                    pg_get_serial_sequence('cohorts', 'cohort_id'),
                    COALESCE((SELECT MAX(cohort_id) FROM cohorts), 1),
                    true
                )
            `,
        );

        const rows = await postgresCRUD.QUERY(
            `
                INSERT INTO cohorts (course_id, cohort_name, starting_date, ending_date, teacher_ids, student_ids)
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING *
            `,
            [course_id, cohort_name, starting_date ?? null, ending_date ?? null, teacher_ids, student_ids],
        );
        return res.status(201).json(rows[0]);
    } catch (error) {
        writeLog(
            `Error creating cohort: ${error.message}`,
            "server.log",
        );
        return res.status(500).json({ error: "Failed to create cohort" });
    }
});
// Get specific cohort information
privateStaffRoutes.get("/:cohortId", requireCohortTeacherOrCourseManager, async (req, res) => {
    const { cohortId } = req.params;
    try {
        const rows = await postgresCRUD.QUERY(
            `
                SELECT *
                FROM cohorts
                WHERE cohort_id = $1
            `,
            [cohortId],
        );
        if (rows.length === 0) {
            return res.status(404).json({ error: "Cohort not found" });
        }
        return res.json(rows[0]);
    } catch (error) {
        writeLog(
            `Error fetching cohort: ${error.message}`,
            "server.log",
        );
        return res.status(500).json({ error: "Failed to fetch cohort" });
    }
});
// Update specific cohort information
privateStaffRoutes.put("/:cohortId", requireCohortTeacherOrCourseManager, async (req, res) => {
    const { cohortId } = req.params;
    const { course_id, cohort_name, starting_date, ending_date, teacher_ids, student_ids } = req.body ?? {};

    if (course_id !== undefined && typeof course_id !== "string") {
        return res.status(400).json({ error: "course_id must be a course code string" });
    }
    if (teacher_ids !== undefined && !Array.isArray(teacher_ids)) {
        return res.status(400).json({ error: "teacher_ids must be an array" });
    }
    if (student_ids !== undefined && !Array.isArray(student_ids)) {
        return res.status(400).json({ error: "student_ids must be an array" });
    }

    try {
        const rows = await postgresCRUD.QUERY(
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
        if (rows.length === 0) {
            return res.status(404).json({ error: "Cohort not found" });
        }
        return res.json(rows[0]);
    } catch (error) {
        writeLog(
            `Error updating cohort: ${error.message}`,
            "server.log",
        );
        return res.status(500).json({ error: "Failed to update cohort" });
    }
});
// Delete specific cohort
privateStaffRoutes.delete("/:cohortId", requireCohortTeacherOrCourseManager, async (req, res) => {
    const { cohortId } = req.params;
    try {
        const rows = await postgresCRUD.QUERY(
            `
                DELETE FROM cohorts
                WHERE cohort_id = $1
                RETURNING *
            `,
            [cohortId],
        );
        if (rows.length === 0) {
            return res.status(404).json({ error: "Cohort not found" });
        }
        return res.json(rows[0]);
    } catch (error) {
        writeLog(
            `Error deleting cohort ${cohortId}: ${error.message}`,
            "server.log",
        );
        return res.status(500).json({ error: "Failed to delete cohort" });
    }
});

// Get all students in a specific cohort
privateStaffRoutes.get("/:cohortId/students", requireCohortTeacherOrCourseManager, async (req, res) => {
    const { cohortId } = req.params;
    try {
        const rows = await postgresCRUD.QUERY(
            `
                SELECT s.*
                FROM cohorts c
                JOIN students s ON s.student_id = ANY(COALESCE(c.student_ids, ARRAY[]::INT[]))
                WHERE c.cohort_id = $1
                ORDER BY s.student_id
            `,
            [cohortId],
        );
        return res.json(rows);
    } catch (error) {
        writeLog(
            `Error fetching students for cohort ${cohortId}: ${error.message}`,
            "server.log",
        );
        return res.status(500).json({ error: "Failed to fetch students for cohort" });
    }
});
// Get specific student in a specific cohort
privateStaffRoutes.get("/:cohortId/students/:studentId", requireCohortTeacherOrCourseManager, async (req, res) => {
    const { cohortId, studentId } = req.params;
    try {
        const rows = await postgresCRUD.QUERY(
            `
                SELECT s.*
                FROM cohorts c
                JOIN students s ON s.student_id = ANY(COALESCE(c.student_ids, ARRAY[]::INT[]))
                WHERE c.cohort_id = $1
                    AND s.student_id = $2
            `,
            [cohortId, studentId],
        );
        if (rows.length === 0) {
            return res.status(404).json({ error: "Student not found in this cohort" });
        }
        return res.json(rows[0]);
    } catch (error) {
        writeLog(
            `Error fetching student ${studentId} for cohort ${cohortId}: ${error.message}`,
            "server.log",
        );
        return res.status(500).json({ error: "Failed to fetch student for cohort" });
    }
});
//remove student from a specific cohort
privateStaffRoutes.delete("/:cohortId/students/:studentId", requireCohortTeacherOrCourseManager, async (req, res) => {
    const { cohortId, studentId } = req.params;
    try {
        const rows = await postgresCRUD.QUERY(
            `
                SELECT s.student_id
                FROM cohorts c
                JOIN students s ON s.student_id = ANY(COALESCE(c.student_ids, ARRAY[]::INT[]))
                WHERE c.cohort_id = $1
                    AND s.student_id = $2
            `,
            [cohortId, studentId],
        );
        if (rows.length === 0) {
            return res.status(404).json({ error: "Student not found in this cohort" });
        }

        await postgresCRUD.QUERY(
            `
                UPDATE cohorts
                SET student_ids = array_remove(COALESCE(student_ids, ARRAY[]::INT[]), $2)
                WHERE cohort_id = $1
            `,
            [cohortId, studentId],
        );

        await postgresCRUD.QUERY(
            `
                UPDATE students
                SET enrolled_cohort_ids = array_remove(COALESCE(enrolled_cohort_ids, ARRAY[]::INT[]), $2)
                WHERE student_id = $1
            `,
            [studentId, cohortId],
        );

        return res.json({ message: "Student removed from cohort successfully" });
    } catch (error) {
        writeLog(
            `Error removing student ${studentId} from cohort ${cohortId}: ${error.message}`,
            "server.log",
        );
        return res.status(500).json({ error: "Failed to remove student from cohort" });
    }
});

export default privateStaffRoutes;