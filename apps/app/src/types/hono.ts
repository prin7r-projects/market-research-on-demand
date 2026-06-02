/**
 * [ONEWEEKBRIEF_HONO_TYPES] Shared Hono typing primitives.
 *
 * Declares the per-request Variables shape so `c.set` / `c.get` calls on
 * `correlationId` typecheck across the Hono app and its route sub-apps.
 */

import type { Context, MiddlewareHandler } from "hono";

export type OneWeekBriefVariables = {
  correlationId: string;
};

export type OneWeekBriefEnv = {
  Variables: OneWeekBriefVariables;
};

export type OneWeekBriefContext = Context<OneWeekBriefEnv>;
export type OneWeekBriefMiddleware = MiddlewareHandler<OneWeekBriefEnv>;
