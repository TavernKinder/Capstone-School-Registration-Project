import express from "express";
import writeLog from "../../serverFunctions/write-log.js";
import postgresCRUD from "../../serverFunctions/postgress-CRUD-functions.js";
import { authenticateStaffTokenAndLevel } from "../../serverFunctions/securityFunctions.js";

const adminRoutes = express.Router();

// Level 1 admin routes
// Student info Management
adminRoutes.use(
  "/Level1",
  authenticateStaffTokenAndLevel(1),
  (await import("./adminRoutes/adminLevel1.js")).default,
);

// Level 2 admin routes
// Global Course and Cohort Management
adminRoutes.use(
  "/Level2",
  authenticateStaffTokenAndLevel(2),
  (await import("./adminRoutes/adminLevel2.js")).default,
);

// Level 3 admin routes
// System-wide Management, including Staff account management, and direct SQL queries
adminRoutes.use(
  "/Level3",
  authenticateStaffTokenAndLevel(3),
  (await import("./adminRoutes/adminLevel3.js")).default,
);


export default adminRoutes;
