// This function directly writes a log message to a specified log file with a timestamp. Automatically saves the file in the logs directory.
import fs from "fs";
export default function writeLog(message, logFileName) {
  const logMessage = `${new Date().toISOString()} - ${message}\n`;
  fs.appendFileSync(
    new URL(`../logs/${logFileName}`, import.meta.url),
    logMessage,
    "utf8",
  );
}
