import express from "express";
import postgresCRUD from "../../../serverFunctions/postgress-CRUD-functions.js";
import writeLog from "../../../serverFunctions/write-log.js";

const privateStaffCoursesQueueRoutes = express.Router({ mergeParams: true });

// Get students in the course queue in queue order.
privateStaffCoursesQueueRoutes.get("/", async (req, res) => {
  try {
    const result = await postgresCRUD.QUERY(
      `
        SELECT s.*, array_position(c.signup_queue, s.student_id) AS queue_position
        FROM courses c
        JOIN students s ON s.student_id = ANY(COALESCE(c.signup_queue, ARRAY[]::INT[]))
        WHERE c.course_id = $1
        ORDER BY queue_position
      `,
      [req.params.courseId],
    );
    return res.json(result);
  } catch (error) {
    writeLog(`Error retrieving course queue: ${error.message}`, "server.log");
    return res.status(500).json({ error: "Failed to retrieve course queue" });
  }
});

// Get one specific student in the course queue.
privateStaffCoursesQueueRoutes.get("/:studentId", async (req, res) => {
  try {
    const result = await postgresCRUD.QUERY(
      `
        SELECT s.*, array_position(c.signup_queue, s.student_id) AS queue_position
        FROM courses c
        JOIN students s ON s.student_id = ANY(COALESCE(c.signup_queue, ARRAY[]::INT[]))
        WHERE c.course_id = $1
          AND s.student_id = $2
      `,
      [req.params.courseId, req.params.studentId],
    );

    if (!result.length) {
      return res.status(404).json({ error: "Student not found in course queue" });
    }

    return res.json(result[0]);
  } catch (error) {
    writeLog(
      `Error retrieving student from course queue: ${error.message}`,
      "server.log",
    );
    return res
      .status(500)
      .json({ error: "Failed to retrieve student from course queue" });
  }
});

// Approve student in queue (removes from signup queue).
privateStaffCoursesQueueRoutes.post("/:studentId", async (req, res) => {
  try {
    const result = await postgresCRUD.QUERY(
      `
        UPDATE courses
        SET signup_queue = array_remove(COALESCE(signup_queue, ARRAY[]::INT[]), $2::INT)
        WHERE course_id = $1
          AND $2::INT = ANY(COALESCE(signup_queue, ARRAY[]::INT[]))
        RETURNING course_id
      `,
      [req.params.courseId, req.params.studentId],
    );

    if (!result.length) {
      return res.status(404).json({ error: "Student not found in course queue" });
    }

    return res.json({ message: "Student approved in course queue" });
  } catch (error) {
    writeLog(`Error approving student in course queue: ${error.message}`, "server.log");
    return res.status(500).json({ error: "Failed to approve student in course queue" });
  }
});

// Deny student in queue (also removes from signup queue).
privateStaffCoursesQueueRoutes.delete("/:studentId", async (req, res) => {
  try {
    const result = await postgresCRUD.QUERY(
      `
        UPDATE courses
        SET signup_queue = array_remove(COALESCE(signup_queue, ARRAY[]::INT[]), $2::INT)
        WHERE course_id = $1
          AND $2::INT = ANY(COALESCE(signup_queue, ARRAY[]::INT[]))
        RETURNING course_id
      `,
      [req.params.courseId, req.params.studentId],
    );

    if (!result.length) {
      return res.status(404).json({ error: "Student not found in course queue" });
    }

    return res.json({ message: "Student denied in course queue" });
  } catch (error) {
    writeLog(`Error denying student in course queue: ${error.message}`, "server.log");
    return res.status(500).json({ error: "Failed to deny student in course queue" });
  }
});

export default privateStaffCoursesQueueRoutes;
