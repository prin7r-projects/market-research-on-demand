/**
 * [ONEWEEKBRIEF_RATE_LIMIT] Simple in-memory rate limiter for single-instance deployments.
 *
 * - brief_submit: 5 requests per IP per hour
 * - checkout: 30 requests per IP per hour
 *
 * For multi-instance, back this with Redis.
 */

interface Window {
  count: number;
  resetAt: number;
}

const windows = new Map<string, Window>();

/** Clean up stale entries every 10 minutes. */
setInterval(() => {
  const now = Date.now();
  for (const [key, win] of windows) {
    if (now > win.resetAt) {
      windows.delete(key);
    }
  }
}, 600_000).unref();

export type RateLimitAction = "brief_submit" | "checkout";

const LIMITS: Record<RateLimitAction, { max: number; windowMs: number }> = {
  brief_submit: { max: 5, windowMs: 3600_000 },
  checkout: { max: 30, windowMs: 3600_000 }
};

export function checkRateLimit(ip: string, action: RateLimitAction): { allowed: boolean; retryAfterMs: number } {
  const config = LIMITS[action];
  const key = `${ip}:${action}`;
  const now = Date.now();

  let win = windows.get(key);
  if (!win || now > win.resetAt) {
    win = { count: 0, resetAt: now + config.windowMs };
    windows.set(key, win);
  }

  if (win.count >= config.max) {
    return { allowed: false, retryAfterMs: win.resetAt - now };
  }

  win.count += 1;
  return { allowed: true, retryAfterMs: 0 };
}
