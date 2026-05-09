/**
 * [ONEWEEKBRIEF_HEALTH] Health check endpoint.
 */

import { Hono } from "hono";

export const healthRoute = new Hono();

healthRoute.get("/", (c) =>
  c.json({
    status: "ok",
    service: "oneweekbrief-api",
    version: "0.1.0",
    ts: Date.now()
  })
);
