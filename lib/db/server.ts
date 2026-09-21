/* eslint-disable @typescript-eslint/no-explicit-any */
import { createPool } from '../../src/db/index';

export function getDb(): any {
  if (!process.env.SQL_HOST) {
    return null;
  }
  
  const pool = createPool();
  return async (strings: TemplateStringsArray, ...values: any[]) => {
    // Construct parameterized query for pg
    const query = strings.reduce((acc, str, i) => acc + str + (i < values.length ? `$${i + 1}` : ''), '');
    try {
      const res = await pool.query(query, values);
      return res.rows;
    } catch (e) {
      console.error("Query failed:", query, e);
      throw e;
    }
  };
}
