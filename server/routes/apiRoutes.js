import express from "express";
import writeLog from "../serverFunctions/write-log.js";
import { authenticateToken, blacklistToken } from "../serverFunctions/securityFunctions.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.json({ message: "Hello from server!" });
  writeLog("GET request received at /api", "server.log");
});

router.use("/public", (await import("./subroutes/publicApiRoutes.js")).default);
router.use(
  "/private",
  (await import("./subroutes/privateApiRoutes.js")).default,
);
router.use("/admin", (await import("./subroutes/adminApiRoutes.js")).default);
router.use("/login", (await import("./subroutes/loginApiRoutes.js")).default);
router.post("/logout", async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  const result = await authenticateToken(token);

  if (result.error) {
    res.status(401).json({ error: result.error });
    writeLog(`Failed logout attempt: ${result.error}`, "server.log");
  } else {
    await blacklistToken(token);
    res.json({ message: "Logged out successfully" });
    writeLog("POST request received at /api/logout", "server.log");
  }
  return;
});

export default router;
