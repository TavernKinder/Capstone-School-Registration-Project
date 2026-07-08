import express from "express";
import postgresCRUD from "../../serverFunctions/postgress-CRUD-functions.js";
import { sendJWTKey } from "../../serverFunctions/securityFunctions.js";
import writeLog from "../../serverFunctions/write-log.js";

const loginRoutes = express.Router();

async function sendLoginRequestToServer(userTable, req, res) {
  try {
    const { email, password } = req.body ?? {};

    if (typeof email !== "string" || typeof password !== "string") {
      res.status(400).json({ error: "Email and password are required" });
      writeLog(
        `Failed login attempt for ${userTable}: missing email or password`,
        "server.log",
      );
      return;
    }

    const user = await postgresCRUD.READ(userTable, { email });
    if (!user.length) {
      res.status(401).json({ error: "Invalid email or password" });
      writeLog(
        `Failed login attempt for ${userTable} with invalid email: ${email}`,
        "server.log",
      );
      return;
    }
    const foundUser = user[0];

    if (foundUser.password !== password) {
      res.status(401).json({ error: "Invalid email or password" });
      writeLog(
        `Failed login attempt for ${userTable} with email=${email} due to invalid password: ${password}`,
        "server.log",
      );
      return;
    }
    const token = sendJWTKey(foundUser);
    res.json({ ...foundUser, token });
    writeLog(
      `Successful login for ${userTable} with email=${email}`,
      "server.log",
    );
  } catch (error) {
    res.status(500).json({ error: "Failed to login" });
    writeLog(
      `Error during login for ${userTable} with email=${req.body?.email ?? "unknown"}: ${error.message}`,
      "server.log",
    );
  }
}

loginRoutes.post("/student", async (req, res) => {
  return sendLoginRequestToServer("students", req, res);
});

loginRoutes.post("/staff", async (req, res) => {
  return sendLoginRequestToServer("staff", req, res);
});

export default loginRoutes;
