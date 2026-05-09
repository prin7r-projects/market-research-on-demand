/**
 * [ONEWEEKBRIEF_LOGGER] Pino JSON logger with PII redaction.
 *
 * Never logs raw email or scope_md. Keys containing these fragments are redacted.
 */

import pino from "pino";

export const logger = pino({
  name: "oneweekbrief",
  level: process.env.LOG_LEVEL ?? "info",
  redact: {
    paths: [
      "*.email",
      "*.scopeMd",
      "*.scope_md",
      "*.brief",
      "req.headers.authorization",
      "req.headers.cookie"
    ],
    remove: true
  }
});
