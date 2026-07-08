import express from "express";

const adminLevel2Routes = express.Router();

adminLevel2Routes.get("/", async (req, res) => {
  res.send("Admin Level 2 API");
});

adminLevel2Routes.use("/courses", (await import("./adminLevel2Courses.js")).default);
adminLevel2Routes.use("/cohorts", (await import("./adminLevel2Cohorts.js")).default);

export default adminLevel2Routes;