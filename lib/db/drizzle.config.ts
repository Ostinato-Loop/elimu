import { defineConfig } from "drizzle-kit";
import process from "node:process";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required for migrations");
}

export default defineConfig({
  schema: "./src/schema/index.ts",
  out: "./migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
  verbose: true,
  strict: true,
});
