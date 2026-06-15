import pg from "pg";
import { drizzle as drizzlePg, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { drizzle as drizzleSupabase } from "drizzle-orm/supabase";
import { createClient } from "@supabase/supabase-js";
import * as schema from "./schema";

export * from "./schema";
export type Schema = typeof schema;
export type Db = NodePgDatabase<Schema>;

const { DATABASE_URL, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = process.env;

if (!DATABASE_URL && !(SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY)) {
  throw new Error(
    "Either DATABASE_URL or both SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set.",
  );
}

export const db: Db = (() => {
  if (DATABASE_URL) {
    const { Pool } = pg;
    const pool = new Pool({ connectionString: DATABASE_URL });
    return drizzlePg(pool, { schema });
  }
  const client = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);
  return drizzleSupabase(client) as unknown as Db;
})();
