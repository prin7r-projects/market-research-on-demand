/**
 * [ONEWEEKBRIEF_REDIS] Redis client and Stream helpers.
 *
 * Uses ioredis for Redis Streams support (XADD, XRANGE, etc.).
 */

import { Redis } from "ioredis";
import { optionalEnv } from "./env.js";
import { logger } from "./logger.js";

const REDIS_URL = optionalEnv("REDIS_URL") ?? "redis://localhost:6379";

export const redis = new Redis(REDIS_URL, {
  maxRetriesPerRequest: 3,
  enableReadyCheck: true,
  retryStrategy(times) {
    return Math.min(times * 100, 3000);
  }
});

redis.on("error", (err) => {
  logger.error({ err: err.message }, "Redis connection error");
});

redis.on("connect", () => {
  logger.info("Redis connected");
});

/**
 * Push a brief.submitted event onto the Redis Stream.
 */
export async function pushBriefSubmitted(briefId: string, tier: string): Promise<void> {
  await redis.xadd(
    "brief.submitted",
    "*", // auto-generate ID
    "brief_id", briefId,
    "tier", tier,
    "ts", Date.now().toString()
  );
  logger.info({ briefId, tier }, "Pushed brief.submitted to Redis Stream");
}

/**
 * Read events from the brief.submitted stream (useful for diagnostics).
 */
export async function readBriefSubmitted(count = 10): Promise<Array<Record<string, string>>> {
  const results = await redis.xrange("brief.submitted", "-", "+", "COUNT", count);
  return results.map(([id, fields]) => {
    const obj: Record<string, string> = { id: String(id) };
    for (let i = 0; i < fields.length; i += 2) {
      obj[fields[i]] = fields[i + 1];
    }
    return obj;
  });
}
