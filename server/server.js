import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import writeLog from "./serverFunctions/write-log.js";
import apiRoutes from "./serverFunctions/_apiRoutes.js";
import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 3001;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

function initializeServer() {
  //Check and initailize logs folder
  const logsDir = path.resolve(__dirname, "../logs");
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir);
  }
  //Start Server
  app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
    writeLog(`Server started and listening on port ${PORT}`, "server.log");
  });
}

app.use(express.static(path.resolve(__dirname, "../client/dist")));
app.use("/api", apiRoutes);

/// Run Initialize Server Function ///
initializeServer();
