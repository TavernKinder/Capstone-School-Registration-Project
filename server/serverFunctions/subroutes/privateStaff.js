import express from "express";

const privateStaffRoutes = express.Router();

privateStaffRoutes.use("/courses", (await import("./privateStaffCourses.js")).default);
privateStaffRoutes.use("/cohorts", (await import("./privateStaffCohorts.js")).default);

export default privateStaffRoutes;
