/**
 * [ONEWEEKBRIEF_SERVER] Hono API server for the customer-facing surface.
 *
 * Routes:
 *   GET  /healthz
 *   POST /api/briefs
 *   POST /api/webhooks/nowpayments
 */

import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger as honoLogger } from "hono/logger";
import { checkConnection } from "./db/index.js";
import { logger } from "./lib/logger.js";
import { healthRoute } from "./routes/health.js";
import { briefsRoute } from "./routes/briefs.js";
import { webhooksRoute } from "./routes/webhooks.js";

const app = new Hono();

app.use("*", honoLogger());
app.use(
  "*",
  cors({
    origin: (origin) => origin ?? "*",
    allowMethods: ["GET", "POST", "OPTIONS"],
    allowHeaders: ["content-type", "x-request-id"],
    maxAge: 86400
  })
);

// Correlation ID middleware
app.use("*", async (c, next) => {
  const incoming = c.req.header("x-request-id");
  const correlationId = incoming || makeCorrelationId();
  c.set("correlationId", correlationId);
  c.header("x-oneweekbrief-correlation-id", correlationId);
  await next();
});

// Mount routes
app.route("/healthz", healthRoute);
app.route("/api/briefs", briefsRoute);
app.route("/api/webhooks/nowpayments", webhooksRoute);

// 404
app.notFound((c) =>
  c.json(
    {
      error: "not_found",
      message: `No route matches ${c.req.method} ${c.req.path}.`,
      correlationId: c.get("correlationId")
    },
    404
  )
);

// Error handler
app.onError((err, c) => {
  logger.error({ err, correlationId: c.get("correlationId") }, "Unhandled exception");
  return c.json(
    {
      error: "internal_error",
      message: "Unhandled exception. The error has been logged.",
      correlationId: c.get("correlationId")
    },
    500
  );
});

const port = Number(process.env.PORT ?? 8080);

async function startup() {
  const dbConnected = await checkConnection();
  if (dbConnected) {
    logger.info("Database connected");
  } else {
    logger.warn("No database connection. Persistence will fail.");
  }

  logger.info(`OneWeekBrief API listening on 0.0.0.0:${port}`);
}

startup();

export default {
  fetch: app.fetch,
  port,
  hostname: "0.0.0.0"
};

function makeCorrelationId() {
  const chars = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
  let out = "";
  const ts = Date.now().toString(36).toUpperCase().padStart(10, "0");
  for (let i = 0; i < 16; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return `${ts}${out}`;
}
