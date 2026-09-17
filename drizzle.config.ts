import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const host = process.env.SQL_HOST || "127.0.0.1";
const database = process.env.SQL_DB_NAME || "yusuf_os";
const user = process.env.SQL_USER || "postgres";
const password = process.env.SQL_PASSWORD || "";

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  schemaFilter: ["public"],
  dbCredentials: {
    host,
    user,
    password,
    database,
    ssl: false,
  },
  verbose: true,
  strict: true,
});
