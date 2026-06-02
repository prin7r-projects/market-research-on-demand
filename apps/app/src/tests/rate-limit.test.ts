/**
 * [ONEWEEKBRIEF_RATE_LIMIT_TEST] Unit test for the rate limiter.
 *
 * Verifies that the 6th brief submission from the same IP in one hour returns 429.
 */

import assert from "node:assert";
import { test, describe, beforeEach } from "node:test";
import { checkRateLimit } from "../lib/rate-limit.js";

describe("rate limiter", () => {
  beforeEach(() => {
    // Reset internal state by using a unique IP per test run not possible here;
    // instead we rely on the fact that checkRateLimit uses a module-scoped Map
    // and we advance past the window if needed. For unit tests we use different IPs.
  });

  test("allows 5 brief submissions per IP per hour", () => {
    const testIp = `203.0.113.${Math.floor(Math.random() * 255)}`;
    for (let i = 0; i < 5; i++) {
      const result = checkRateLimit(testIp, "brief_submit");
      assert.strictEqual(result.allowed, true, `Request ${i + 1} should be allowed`);
    }
  });

  test("blocks the 6th brief submission per IP per hour", () => {
    const testIp = `203.0.113.${Math.floor(Math.random() * 255)}`;
    for (let i = 0; i < 5; i++) {
      checkRateLimit(testIp, "brief_submit");
    }
    const sixth = checkRateLimit(testIp, "brief_submit");
    assert.strictEqual(sixth.allowed, false, "6th request should be blocked");
    assert.ok(sixth.retryAfterMs > 0, "retryAfterMs should be positive");
  });

  test("allows checkout up to 30 requests per IP per hour", () => {
    const testIp = `203.0.113.${Math.floor(Math.random() * 255)}`;
    for (let i = 0; i < 30; i++) {
      const result = checkRateLimit(testIp, "checkout");
      assert.strictEqual(result.allowed, true, `Checkout request ${i + 1} should be allowed`);
    }
    const blocked = checkRateLimit(testIp, "checkout");
    assert.strictEqual(blocked.allowed, false, "31st checkout should be blocked");
  });
});
