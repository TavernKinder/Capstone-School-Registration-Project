import jwt from "jsonwebtoken";
import CRUD from "./postgress-CRUD-functions.js";
import dotenv from "dotenv";
import writeLog from "./write-log.js";

dotenv.config();

export const jwtSecret = process.env.JWT_SECRET ?? process.env.SUPERSECRETKEY;

if (!jwtSecret) {
  throw new Error("Missing JWT secret. Set JWT_SECRET or SUPERSECRETKEY.");
}

export function sendJWTKey(user) {
  const token = jwt.sign(
    {
      username: user.username,
      user_id: user.user_id,
      role: user.student_id ? "student" : "staff",
      access_level: user.access_level,
    },
    jwtSecret,
    {
      algorithm: "HS256",
      expiresIn: "1h",
    },
  );
  return token;
}

export async function authenticateToken(token) {
  switch (token) {
    case undefined:
      return { error: "Token is required" };
    case null:
      return { error: "Token cannot be null" };
    default:
      const blacklistCheck = await CRUD.READ("token_blacklist", { token });
      if (blacklistCheck.length > 0) {
        return { error: "Token is blacklisted" };
      } else {
        try {
          const decoded = jwt.verify(token, jwtSecret);
          return { decoded };
        } catch (error) {
          return { error: "Invalid token" };
        }
      }
  }
}

export async function blacklistToken(token) {
  if (!token) return;
  await CRUD.CREATE("token_blacklist", { token });
  writeLog(`Token blacklisted: ${token}`, "server.log");
}

export function checkStaffAccess() {}
