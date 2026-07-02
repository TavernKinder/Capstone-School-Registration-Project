import postgres from "postgres";
import { Pool } from "pg";
import dotenv from "dotenv";
dotenv.config();

const DATABASE = process.env.DATABASE_CONNECTION;

const pool = new Pool({
  connectionString: DATABASE,
});

export default {
  async QUERY(sql, params = []) {
    const result = await pool.query(sql, params);
    return result.rows;
  },
  async CREATE(table, data) {
    return await pool.query(
      `INSERT INTO ${table} (${Object.keys(data).join(", ")}) VALUES (${Object.values(
        data,
      )
        .map((_, i) => `$${i + 1}`)
        .join(", ")}) RETURNING *`,
      Object.values(data),
    );
  },
  async READ(table, condition = {}) {
    const conditionKeys = Object.keys(condition);
    const conditionValues = Object.values(condition);
    const whereClause = conditionKeys.length
      ? `WHERE ${conditionKeys.map((key, i) => `${key} = $${i + 1}`).join(" AND ")}`
      : "";
    const result = await pool.query(
      `SELECT * FROM ${table} ${whereClause}`,
      conditionValues,
    );
    return result.rows;
  },
  async UPDATE(table, data, condition) {
    const dataKeys = Object.keys(data);
    const dataValues = Object.values(data);
    const conditionKeys = Object.keys(condition);
    const conditionValues = Object.values(condition);
    const setClause = dataKeys.map((key, i) => `${key} = $${i + 1}`).join(", ");
    const whereClause = conditionKeys
      .map((key, i) => `${key} = $${i + 1 + dataKeys.length}`)
      .join(" AND ");
    const result = await pool.query(
      `UPDATE ${table} SET ${setClause} WHERE ${whereClause} RETURNING *`,
      [...dataValues, ...conditionValues],
    );
    return result.rows;
  },
  async DELETE(table, condition) {
    const conditionKeys = Object.keys(condition);
    const conditionValues = Object.values(condition);
    const whereClause = conditionKeys
      .map((key, i) => `${key} = $${i + 1}`)
      .join(" AND ");
    const result = await pool.query(
      `DELETE FROM ${table} ${whereClause} RETURNING *`,
      conditionValues,
    );
    return result.rows;
  },
};
