import express from "express";
import postgresCRUD from "../postgress-CRUD-functions.js";
import writeLog from "../write-log.js";
import privateStaffCoursesQueue from "./privateStaffCoursesQueue.js";

async function requireCourseManager(req, res, next) {
    try {
        const courseId = req.params.courseId;
        const userId = req.auth?.user_id;

        const [courseExists] = await postgresCRUD.QUERY(
            "SELECT 1 FROM courses WHERE course_id = $1",
            [courseId],
        );

        if (!courseExists) {
            return res.status(404).json({ error: "Course not found" });
        }

        const rows = await postgresCRUD.QUERY(
            `
                SELECT c.*
                FROM courses c
                JOIN users u ON u.user_id = $1
                WHERE c.course_id = $2
                  AND u.staff_id IS NOT NULL
                  AND u.staff_id = c.manager_staff_id
            `,
            [userId, courseId],
        );

        if (!rows.length) {
            return res.status(403).json({ error: "Access denied" });
        }

        req.course = rows[0];
        return next();
    } catch (error) {
        writeLog(
            `Error authorizing course access for user_id=${req.auth?.user_id}: ${error.message}`,
            "server.log",
        );
        return res.status(500).json({ error: "Failed to verify course access" });
    }
}


const privateStaffCoursesRoutes = express.Router();
// Get all courses
privateStaffCoursesRoutes.get("/", async (req, res) => {
    try {
        const result = await postgresCRUD.QUERY(
            `
                SELECT *
                FROM courses
            `
        );
        return res.json(result);
    } catch (error) {
        writeLog(
            `Error fetching courses: ${error.message}`,
            "server.log",
        );
        return res.status(500).json({ error: "Failed to fetch courses" });
    }
});
// Create new course
privateStaffCoursesRoutes.post("/", async (req, res) => {
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
        } = req.body ?? {};

        const resolvedTitle = course_title ?? course_name ?? course_id;
        const resolvedDescription = course_description ?? description ?? null;

        if (!course_id) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const [creator] = await postgresCRUD.QUERY(
            `
                SELECT staff_id
                FROM users
                WHERE user_id = $1
                    AND staff_id IS NOT NULL
            `,
            [req.auth?.user_id],
        );

        if (!creator?.staff_id) {
            return res.status(403).json({ error: "Only staff can create courses" });
        }

        const result = await postgresCRUD.QUERY(
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
                creator.staff_id,
            ],
        );
        return res.status(201).json(result[0]);
    } catch (error) {
        if (error?.code === "23505") {
            return res.status(409).json({ error: "Course already exists" });
        }
        writeLog(
            `Error creating course: ${error.message}`,
            "server.log",
        );
        return res.status(500).json({ error: "Failed to create course" });
    }
});
// Get my courses
privateStaffCoursesRoutes.get("/my-courses", async (req, res) => {
    try {
        const result = await postgresCRUD.QUERY(
            `
                SELECT c.*
                FROM courses c
                JOIN users u ON u.user_id = $1
                WHERE u.staff_id IS NOT NULL
                    AND c.manager_staff_id = u.staff_id
                ORDER BY c.course_id
            `,
            [req.auth?.user_id]
        );
        return res.json(result);
    } catch (error) {
        writeLog(
            `Error fetching my courses for user_id=${req.auth?.user_id}: ${error.message}`,
            "server.log",
        );
        return res.status(500).json({ error: "Failed to fetch my courses" });
    }
});
// get specific course information
privateStaffCoursesRoutes.get("/course/:courseId", requireCourseManager, async (req, res) => {
    try {
        const result = await postgresCRUD.QUERY(
            `
                SELECT *
                FROM courses
                WHERE course_id = $1
            `,
            [req.params.courseId]
        );
        if (!result.length) {
            return res.status(404).json({ error: "Course not found" });
        }
        return res.json(result[0]);
    } catch (error) {
        writeLog(
            `Error fetching course: ${error.message}`,
            "server.log",
        );
        return res.status(500).json({ error: "Failed to fetch course" });
    }
});
// Update specific course information
privateStaffCoursesRoutes.put("/course/:courseId", requireCourseManager, async (req, res) => {
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
        ].some((value) => value !== undefined);

        if (!hasUpdates) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const result = await postgresCRUD.QUERY(
            `
                UPDATE courses
                SET
                    course_title = COALESCE($1, course_title),
                    course_description = COALESCE($2, course_description),
                    classroom_number = COALESCE($3, classroom_number),
                    capacity = COALESCE($4, capacity),
                    credit_hours = COALESCE($5, credit_hours),
                    tuition_cost = COALESCE($6, tuition_cost)
                WHERE course_id = $7
                RETURNING *
            `,
            [
                resolvedTitle ?? null,
                resolvedDescription ?? null,
                classroom_number ?? null,
                capacity ?? null,
                credit_hours ?? null,
                tuition_cost ?? null,
                req.params.courseId,
            ]
        );
        if (!result.length) {
            return res.status(404).json({ error: "Course not found" });
        }
        return res.json(result[0]);
    } catch (error) {
        writeLog(
            `Error updating course: ${error.message}`,
            "server.log",
        );
        return res.status(500).json({ error: "Failed to update course" });
    }
});
// Delete specific course
privateStaffCoursesRoutes.delete("/course/:courseId", requireCourseManager, async (req, res) => {
    try {
        const result = await postgresCRUD.QUERY(
            `
                DELETE FROM courses
                WHERE course_id = $1
                RETURNING *
            `,
            [req.params.courseId]
        );
        if (!result.length) {
            return res.status(404).json({ error: "Course not found" });
        }
        return res.json({ message: "Course deleted successfully" });
    } catch (error) {
        if (error?.code === "23503") {
            return res.status(409).json({
                error: "Cannot delete course while cohorts still reference it",
            });
        }
        writeLog(
            `Error deleting course: ${error.message}`,
            "server.log",
        );
        return res.status(500).json({ error: "Failed to delete course" });
    }
});
privateStaffCoursesRoutes.use("/course/:courseId/queue", requireCourseManager, privateStaffCoursesQueue); 
    
export default privateStaffCoursesRoutes;