/**
 * [ONEWEEKBRIEF_DB] Drizzle ORM client over postgres.js.
 */

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema.js";

const DATABASE_URL = process.env.DATABASE_URL ?? "postgresql://oneweekbrief:oneweekbrief_dev@localhost:5432/oneweekbrief";

// Migration client — separate connection because postgres.js can't be shared with query builder
export const migrationClient = postgres(DATABASE_URL, { max: 1 });

// Query client
export const queryClient = postgres(DATABASE_URL, {
  max: 10,
  idle_timeout: 30,
  connect_timeout: 10
});

export const db = drizzle(queryClient, { schema });

export async function checkConnection(): Promise<boolean> {
  try {
    const [row] = await queryClient`SELECT 1 AS ok`;
    return row?.ok === 1;
  } catch {
    return false;
  }
}

export async function closeConnection(): Promise<void> {
  await queryClient.end();
  await migrationClient.end();
}
