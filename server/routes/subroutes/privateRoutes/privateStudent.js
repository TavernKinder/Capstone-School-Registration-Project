import express from "express";
import postgresCRUD from "../../../serverFunctions/postgress-CRUD-functions.js";

const privateStudentRoutes = express.Router();

async function requireStudentInCohort(req, res, next) {
    try {
        const cohortId = req.params.cohortId;
        const userId = req.auth?.user_id;

        const rows = await postgresCRUD.QUERY(
            `
            SELECT c.*
            FROM cohorts c
            JOIN users u ON u.user_id = $1
            WHERE c.cohort_id = $2
              AND u.student_id = ANY(c.student_ids)
            `,
            [userId, cohortId],
        );

        if (!rows.length) {
            return res.status(403).json({ error: "Access denied" });
        }

        req.cohort = rows[0];
        return next();
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed to retrieve cohort details" });
    }
}



//get available course list
privateStudentRoutes.get("/courses", async (req, res) => {
    try {
        const courses = await postgresCRUD.QUERY(
            "SELECT * FROM courses ORDER BY course_id",
        );
        res.json(courses);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to retrieve courses" });
    }
});
//get specific course details
privateStudentRoutes.get("/courses/:courseId", async (req, res) => {
    try {
        const courseId = req.params.courseId;
        const rows = await postgresCRUD.QUERY(
            "SELECT * FROM courses WHERE course_id = $1",
            [courseId],
        );
        const course = rows[0] ?? null;
        if (course) {
            res.json(course);
        } else {
            res.status(404).json({ error: "Course not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to retrieve course details" });
    }
});

//sighn up or drop a out for a specific course queue
privateStudentRoutes.post("/courses/:courseId", async (req, res) => {
    try {
        const courseId = req.params.courseId;
        const userId = req.auth?.user_id;
        const { action } = req.body; // action should be either "signup" or "drop"
        if (action === "signup") {
            const result = await postgresCRUD.signupForCourse(courseId, userId);
            res.json(result);
        } else if (action === "drop") {
            const result = await postgresCRUD.dropCourse(courseId, userId);
            res.json(result);
        } else {
            res.status(400).json({ error: "Invalid action" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to update course queue" });
    }
});

//get list of cohorts the student is part of
privateStudentRoutes.get("/cohorts", async (req, res) => {
    try {
        const cohorts = await postgresCRUD.QUERY(
            `
            SELECT c.*
            FROM users u
            JOIN cohorts c ON u.student_id = ANY(c.student_ids)
            WHERE u.user_id = $1
            ORDER BY c.cohort_id
            `,
            [req.auth?.user_id],
        );
        res.json(cohorts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to retrieve cohorts" });
    }
});

//get specific cohort details
privateStudentRoutes.get("/cohorts/:cohortId", requireStudentInCohort, async (req, res) => {
    return res.json(req.cohort);
});

export default privateStudentRoutes;
