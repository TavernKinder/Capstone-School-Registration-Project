import postgres from "postgres";
import dotenv from "dotenv";
dotenv.config();

const DATABASE = process.env.DATABASE_CONNECTION;

const db = postgres(DATABASE);

export default {
  async CREATE(table, data) {
    return await db.insert(data).into(table);
  },
  async READ(table, condition = {}) {
    return await db.select().from(table).where(condition);
  },
  async UPDATE(table, data, condition) {
    return await db(table).where(condition).update(data);
  },
  async DELETE(table, condition) {
    return await db(table).where(condition).delete();
  },
};
