import express from "express";
import writeLog from "../../../serverFunctions/write-log.js";
import postgresCRUD from "../../../serverFunctions/postgress-CRUD-functions.js";

const adminLevel3Routes = express.Router();

adminLevel3Routes.get("/", async (req, res) => {
    res.send("Admin Level 3 API");
});

// Staff account managment
adminLevel3Routes.use("/staff", (await import("./adminLevel3Staff.js")).default);

// Raw SQL query execution
adminLevel3Routes.post("/sql", async (req, res) => {
    try {
        const { query, params } = req.body ?? {};
        if (!query || typeof query !== "string") {
            return res.status(400).json({ error: "Query is required and must be a string" });
        }
        const result = await postgresCRUD.QUERY(query, params ?? []);
        return res.json(result);
    } catch (error) {
        writeLog(`Error executing raw SQL query: ${error.message}`, "server.log");
        return res.status(500).json({ error: "Failed to execute SQL query" });
    }
});

export default adminLevel3Routes;