/**
 * [ONEWEEKBRIEF_POSTMARK] Email delivery via Postmark.
 *
 * Sends transactional emails (receipt, queue confirmation, magic links).
 * Logs sandbox responses when POSTMARK_SERVER_TOKEN is set.
 */

import { ServerClient } from "postmark";
import { optionalEnv } from "./env.js";
import { logger } from "./logger.js";

const serverToken = optionalEnv("POSTMARK_SERVER_TOKEN");
const client = serverToken ? new ServerClient(serverToken) : null;

export interface SendQueueConfirmationInput {
  to: string;
  briefId: string;
  tier: string;
}

export async function sendQueueConfirmation(input: SendQueueConfirmationInput): Promise<void> {
  if (!client) {
    logger.warn({ briefId: input.briefId }, "Postmark not configured; skipping queue confirmation email");
    return;
  }

  try {
    const response = await client.sendEmail({
      From: "desk@prin7r.com",
      To: input.to,
      Subject: "Your dossier is in the queue — OneWeekBrief",
      TextBody: `Hi,

We received your ${input.tier} brief and it is now in the research queue.

Brief ID: ${input.briefId}
You will receive a magic-link email when your dossier is ready for review.

— The OneWeekBrief desk`,
      Tag: "queue-confirmation"
    });

    logger.info(
      { briefId: input.briefId, messageId: response.MessageID, to: redactEmail(input.to) },
      "Postmark queue confirmation sent"
    );
  } catch (err) {
    logger.error({ err, briefId: input.briefId }, "Postmark queue confirmation failed");
    // Non-blocking: email failure should not break the workflow
  }
}

function redactEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!domain) return "***";
  return `${local.slice(0, 2)}***@${domain}`;
}
