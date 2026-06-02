#!/usr/bin/env tsx
/**
 * [ONEWEEKBRIEF_WORKER] Research worker — loads a Brief, calls gpt-5-mini,
 * and produces a fully-footnoted market-research dossier in Markdown.
 *
 * Usage:
 *   tsx src/workers/build-brief.ts <brief_id>
 *   tsx src/workers/build-brief.ts <brief_id> --dry-run   (prompt only, no LLM)
 *   tsx src/workers/build-brief.ts <brief_id> --model gpt-5-mini
 *
 * Env:
 *   OPENAI_API_KEY           required
 *   OPENAI_RESEARCH_MODEL    default: gpt-5-mini
 *   DATABASE_URL             default: postgresql://oneweekbrief:oneweekbrief_dev@localhost:5432/oneweekbrief
 *
 * Output:
 *   artifacts/<brief_id>/
 *     dossier.md          — the final markdown dossier
 *     sources.json        — extracted {citeId, title, url} list
 *     prompt.txt          — the prompt sent to the LLM (for audit)
 *     raw_response.json   — the raw API response (for debugging)
 */

import { db, closeConnection } from "../db/index.js";
import { briefs, deliveries, events } from "../db/schema.js";
import { eq } from "drizzle-orm";
import { logger } from "../lib/logger.js";
import { optionalEnv } from "../lib/env.js";
import OpenAI from "openai";
import * as fs from "node:fs";
import * as path from "node:path";

/* ────────────────────────────────────────────
   CLI argument parsing
   ──────────────────────────────────────────── */

const args = process.argv.slice(2);
if (args.length < 1) {
  console.error("Usage: tsx build-brief.ts <brief_id> [--dry-run] [--model <model>]");
  process.exit(2);
}

const briefId = args[0];
const dryRun = args.includes("--dry-run");
const modelIdx = args.indexOf("--model");
const model = modelIdx >= 0 ? args[modelIdx + 1] : optionalEnv("OPENAI_RESEARCH_MODEL") ?? "gpt-5-mini";

/* ────────────────────────────────────────────
   Artifact directory
   ──────────────────────────────────────────── */

const artifactsDir = path.resolve(process.cwd(), "artifacts", briefId);
fs.mkdirSync(artifactsDir, { recursive: true });

function writeArtifact(filename: string, content: string): void {
  const filePath = path.join(artifactsDir, filename);
  fs.writeFileSync(filePath, content, "utf-8");
  logger.info({ file: filePath, bytes: Buffer.byteLength(content) }, "Artifact written");
}

/* ────────────────────────────────────────────
   Research prompt builder
   ──────────────────────────────────────────── */

function buildResearchPrompt(scopeMd: string, tier: string): string {
  const sourceTarget = tier === "pro" || tier === "monitor" ? "15-25" : "8-15";
  return `You are a senior market-research editor producing a cited dossier for a client. Your output is the final deliverable — an editorial broadsheet-style market brief. Every factual claim must be backed by a live web source. You do not fabricate URLs. 

## Voice

Editorial, empirical, decisive. The tone of Stratechery, The Information, or a Financial Times deep-dive. No marketing fluff, no "in today's rapidly evolving landscape," no AI-isms. Every section earns its place.

## Structure

Produce the dossier in this exact Markdown structure:

---

# [Topic Title — concise, editorial, 5-9 words]

**Prepared for:** [Client implied from scope]
**Date:** [Today]
**SLA tier:** ${tier.toUpperCase()}
**Sources:** [N] round-tripped, verified

## Executive Summary
[3-4 crisp sentences. What the reader must know before the board meeting. No adverbs, no hedge words.]

## Market Landscape
[Size, growth rate, key players, concentration. Every number cited. Every player named with a source.]

## Competitive Dynamics
[Who competes, how they differ, what moats exist. Table where appropriate.]

## Key Trends & Signals
[3-5 trends with evidence. Each trend gets: what's happening, why it matters, a source.]

## Risks & Unknowns
[What could break the thesis. Honest, not alarmist.]

## Strategic Implications
[So what? For the client, for competitors, for the market. Actionable insight.]

## Source Index
[A numbered list. Every source in the document appears here. Format:
1. **"Article Title"** — Publication Name ([URL](https://...))]

---

## Source Requirements

- Target: ${sourceTarget} distinct, live sources.
- Prefer: primary sources, official data, named-analyst reports, trade press, financial filings.
- Avoid: paywalled-only sources unless there is a public abstract; random blog posts; Wikipedia as a primary (can cite for definitions).
- Every URL in the body must appear in the Source Index.
- Use inline cite markers like [1], [2] linking to the Source Index.

## The Client's Brief

${scopeMd}`;
}

/* ────────────────────────────────────────────
   Source extraction from LLM response
   ──────────────────────────────────────────── */

interface ExtractedSource {
  citeId: string;
  title: string;
  url: string;
  accessedAt: string;
}

function extractSources(markdown: string): ExtractedSource[] {
  const sources: ExtractedSource[] = [];
  const sourceSection = markdown.split(/##\s+Source\s+Index/i)[1];
  if (!sourceSection) return sources;

  // Match lines like: 1. **"Article Title"** — Publication Name ([URL](https://...))
  const re = /(\d+)\.\s+\*\*"(.+?)"\*\*\s*(?:—\s*(.+?))?\s*\(\[URL\]\((.+?)\)\)/gi;
  let match;
  while ((match = re.exec(sourceSection)) !== null) {
    const [, num, title, _publication, url] = match;
    sources.push({
      citeId: num,
      title: title.trim(),
      url: url.trim(),
      accessedAt: new Date().toISOString()
    });
  }

  // Fallback: match bare markdown links with preceding bold title
  if (sources.length === 0) {
    const altRe = /(\d+)\.\s+\*\*"?(.+?)"?\*\*.*?\[(.+?)\]\((.+?)\)/gi;
    while ((match = altRe.exec(sourceSection)) !== null) {
      const [, num, title, , url] = match;
      sources.push({
        citeId: num,
        title: title.trim(),
        url: url.trim(),
        accessedAt: new Date().toISOString()
      });
    }
  }

  return sources;
}

/* ────────────────────────────────────────────
   LLM call
   ──────────────────────────────────────────── */

async function callLLM(prompt: string, modelName: string): Promise<{ markdown: string; raw: unknown }> {
  const apiKey = optionalEnv("OPENAI_API_KEY");
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is required. Set it in the environment.");
  }

  const openai = new OpenAI({ apiKey });

  logger.info({ model: modelName, promptBytes: Buffer.byteLength(prompt) }, "Calling LLM");

  const start = Date.now();

  const response = await openai.chat.completions.create({
    model: modelName,
    messages: [
      {
        role: "system",
        content: "You are a senior market-research editor. You write for an audience of founders, operators, and investors. Every claim is cited. Your output is markdown. You never fabricate URLs — only reference real, known websites. When you don't know a specific URL, you note it as [source needed] rather than inventing one."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    temperature: 0.4,
    max_tokens: 16_384
  });

  const elapsed = Date.now() - start;
  const content = response.choices[0]?.message?.content ?? "";

  logger.info(
    {
      model: response.model,
      elapsedMs: elapsed,
      usageTotalTokens: response.usage?.total_tokens,
      contentBytes: Buffer.byteLength(content)
    },
    "LLM response received"
  );

  return { markdown: content, raw: response };
}

/* ────────────────────────────────────────────
   Main workflow
   ──────────────────────────────────────────── */

async function main(): Promise<void> {
  logger.info({ briefId, model, dryRun }, "build-brief worker starting");

  // 1. Load the brief
  const brief = await db.query.briefs.findFirst({
    where: eq(briefs.id, briefId),
    with: {
      user: true
    }
  });

  if (!brief) {
    logger.error({ briefId }, "Brief not found");
    process.exit(1);
  }

  logger.info(
    {
      briefId: brief.id,
      tier: brief.tier,
      status: brief.status,
      scopeBytes: Buffer.byteLength(brief.scopeMd)
    },
    "Brief loaded"
  );

  // 2. Build the research prompt
  const prompt = buildResearchPrompt(brief.scopeMd, brief.tier);
  writeArtifact("prompt.txt", prompt);

  if (dryRun) {
    logger.info({ briefId }, "Dry run complete — prompt written to artifacts dir, no LLM called.");
    await closeConnection();
    process.exit(0);
  }

  // 3. Call the LLM
  const { markdown, raw } = await callLLM(prompt, model);
  writeArtifact("dossier.md", markdown);
  writeArtifact("raw_response.json", JSON.stringify(raw, null, 2));

  // 4. Extract sources
  const sources = extractSources(markdown);
  writeArtifact("sources.json", JSON.stringify(sources, null, 2));
  logger.info({ sourceCount: sources.length }, "Sources extracted");

  // 5. Persist delivery record
  const artifactUrl = `artifacts/${briefId}/dossier.md`; // local path; B2 URL in production
  await db
    .insert(deliveries)
    .values({
      briefId: brief.id,
      artifactUrl,
      sources: sources as any,
      deliveredAt: new Date()
    })
    .onConflictDoUpdate({
      target: deliveries.briefId,
      set: {
        artifactUrl,
        sources: sources as any,
        deliveredAt: new Date()
      }
    });

  // 6. Write delivery event
  await db.insert(events).values({
    briefId: brief.id,
    type: "delivered",
    payload: {
      artifactUrl,
      sourceCount: sources.length,
      model,
      elapsedNote: "engine worker produced draft"
    }
  });

  // 7. Update brief status
  await db
    .update(briefs)
    .set({ status: "editor_review", deliveredAt: new Date() })
    .where(eq(briefs.id, brief.id));

  logger.info(
    {
      briefId: brief.id,
      artifactUrl,
      sourceCount: sources.length,
      artifactBytes: Buffer.byteLength(markdown)
    },
    "Brief artifact produced. Status → editor_review."
  );

  await closeConnection();
  process.exit(0);
}

main().catch((err) => {
  logger.error({ err }, "build-brief worker failed");
  closeConnection().finally(() => process.exit(1));
});
