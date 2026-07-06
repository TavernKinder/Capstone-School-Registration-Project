import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import writeLog from "./serverFunctions/write-log.js";
import apiRoutes from "./serverFunctions/apiRoutes.js";
import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 3001;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientDistPath = path.resolve(__dirname, "../client/dist");
const clientIndexPath = path.join(clientDistPath, "index.html");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

function initializeServer() {
  //Check and initailize logs folder
  const logsDir = path.resolve(__dirname, "../logs");
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir);
  } else {
    writeLog(`Logs directory already exists at ${logsDir}`, "server.log");
    console.log(`Logs directory already exists at ${logsDir}`);
  }
  //Start Server
  app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
    writeLog(`Server started and listening on port ${PORT}`, "server.log");
  });
}

app.use("/api", apiRoutes);
app.use(express.static(clientDistPath));

// SPA fallback for non-API routes (e.g. /student, /student/courses).
app.get(/^\/(?!api).*/, (req, res) => {
  if (!fs.existsSync(clientIndexPath)) {
    return res.status(404).send("Client build not found. Run npm run build.");
  }
  return res.sendFile(clientIndexPath);
});

/// Run Initialize Server Function ///
initializeServer();
