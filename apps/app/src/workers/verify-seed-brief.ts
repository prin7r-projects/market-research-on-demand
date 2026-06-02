#!/usr/bin/env tsx
/**
 * Self-contained verification: runs the worker pipeline against a seed brief
 * without requiring a running PostgreSQL instance.
 *
 * Usage:
 *   tsx src/workers/verify-seed-brief.ts             — writes prompt, no LLM call
 *   tsx src/workers/verify-seed-brief.ts --live      — calls LLM (needs OPENAI_API_KEY)
 *
 * Verifies:
 *   1. Prompt is built correctly from scope text
 *   2. Artifacts are written to disk
 *   3. Sources are extracted from LLM output
 *   4. (--live) An actual LLM response is produced
 */

import * as fs from "node:fs";
import * as path from "node:path";
import OpenAI from "openai";
import { optionalEnv } from "../lib/env.js";
import { logger } from "../lib/logger.js";

/* ────────────────────────────────────────────
   Seed brief — a realistic market research scenario
   ──────────────────────────────────────────── */

const SEED_BRIEF_ID = "seed_ev_charging_europe_2026";
const SEED_BRIEF = {
  id: SEED_BRIEF_ID,
  tier: "standard",
  scopeMd: `I need a market research dossier on the electric vehicle charging infrastructure market in Europe.

I'm a Series A founder evaluating whether to build a B2B software platform for charge point operators (CPOs). I need to understand:

- Total market size (TAM, SAM, SOM) for EV charging in Europe
- Key players (CPOs, hardware manufacturers, software platforms)
- Regulatory tailwinds (EU AFIR mandates, country-level incentives)
- Competitive landscape for CPO management software
- Revenue models in the space
- Key risks and adoption barriers

My board meeting is in 10 days. I need defensible, cited data.`,
};

/* ────────────────────────────────────────────
   Prompt builder (identical to build-brief.ts)
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
   Source extractor (identical to build-brief.ts)
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

  const re = /(\d+)\.\s+\*\*"(.+?)"\*\*\s*(?:—\s*(.+?))?\s*\(\[URL\]\((.+?)\)\)/gi;
  let match;
  while ((match = re.exec(sourceSection)) !== null) {
    const [, num, title, , url] = match;
    sources.push({
      citeId: num,
      title: title.trim(),
      url: url.trim(),
      accessedAt: new Date().toISOString()
    });
  }

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
   Verification
   ──────────────────────────────────────────── */

async function main(): Promise<void> {
  const liveMode = process.argv.includes("--live");
  const artifactsDir = path.resolve(process.cwd(), "artifacts", SEED_BRIEF_ID);
  fs.mkdirSync(artifactsDir, { recursive: true });

  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("  OneWeekBrief Research Worker — Verification");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`  Brief ID:    ${SEED_BRIEF_ID}`);
  console.log(`  Tier:        ${SEED_BRIEF.tier}`);
  console.log(`  Mode:        ${liveMode ? "LIVE (LLM call)" : "DRY RUN (prompt only)"}`);
  console.log(`  Artifacts:   ${artifactsDir}/`);
  console.log("");

  // 1. Build the prompt
  const prompt = buildResearchPrompt(SEED_BRIEF.scopeMd, SEED_BRIEF.tier);
  const promptPath = path.join(artifactsDir, "prompt.txt");
  fs.writeFileSync(promptPath, prompt, "utf-8");
  console.log(`  ✓ Prompt written (${Buffer.byteLength(prompt).toLocaleString()} bytes)`);
  console.log(`    → ${promptPath}`);

  // 2. Verify prompt structure
  const checks = [
    { label: "Executive Summary section", pass: prompt.includes("## Executive Summary") },
    { label: "Market Landscape section", pass: prompt.includes("## Market Landscape") },
    { label: "Competitive Dynamics section", pass: prompt.includes("## Competitive Dynamics") },
    { label: "Key Trends & Signals section", pass: prompt.includes("## Key Trends & Signals") },
    { label: "Risks & Unknowns section", pass: prompt.includes("## Risks & Unknowns") },
    { label: "Strategic Implications section", pass: prompt.includes("## Strategic Implications") },
    { label: "Source Index section", pass: prompt.includes("## Source Index") },
    { label: "Client scope included", pass: prompt.includes("Series A founder") },
    { label: "Source target (8-15 for standard)", pass: prompt.includes("8-15") },
    { label: "SLA tier visible", pass: prompt.includes("STANDARD") },
    { label: "Voice guardrails (anti-AI-isms)", pass: prompt.includes("rapidly evolving landscape") },
  ];

  console.log("\n  Prompt structure checks:");
  let allPassed = true;
  for (const c of checks) {
    console.log(`    ${c.pass ? "✓" : "✗"} ${c.label}`);
    if (!c.pass) allPassed = false;
  }

  // 3. If live mode, call the LLM
  if (liveMode) {
    const apiKey = optionalEnv("OPENAI_API_KEY");
    if (!apiKey) {
      console.error("\n  ✗ OPENAI_API_KEY not set. Cannot run live mode.");
      process.exit(1);
    }

    const model = optionalEnv("OPENAI_RESEARCH_MODEL") ?? "gpt-5-mini";
    console.log(`\n  Calling ${model}...`);

    const openai = new OpenAI({ apiKey });
    const start = Date.now();

    const response = await openai.chat.completions.create({
      model,
      messages: [
        {
          role: "system",
          content: "You are a senior market-research editor. Every claim is cited. Output is markdown. Never fabricate URLs."
        },
        { role: "user", content: prompt }
      ],
      temperature: 0.4,
      max_tokens: 16_384
    });

    const elapsed = Date.now() - start;
    const markdown = response.choices[0]?.message?.content ?? "";

    console.log(`  ✓ LLM response received in ${elapsed}ms`);
    console.log(`    Model:        ${response.model}`);
    console.log(`    Tokens used:  ${response.usage?.total_tokens?.toLocaleString() ?? "N/A"}`);
    console.log(`    Output size:  ${Buffer.byteLength(markdown).toLocaleString()} bytes`);

    // Write artifacts
    const dossierPath = path.join(artifactsDir, "dossier.md");
    fs.writeFileSync(dossierPath, markdown, "utf-8");
    console.log(`    → ${dossierPath}`);

    const rawPath = path.join(artifactsDir, "raw_response.json");
    fs.writeFileSync(rawPath, JSON.stringify(response, null, 2), "utf-8");

    // Extract and save sources
    const sources = extractSources(markdown);
    const sourcesPath = path.join(artifactsDir, "sources.json");
    fs.writeFileSync(sourcesPath, JSON.stringify(sources, null, 2), "utf-8");
    console.log(`    → ${sourcesPath}`);

    console.log(`\n  Sources extracted: ${sources.length}`);
    if (sources.length > 0) {
      console.log(`    First source: [${sources[0].citeId}] ${sources[0].title}`);
      console.log(`    Last source:  [${sources[sources.length - 1].citeId}] ${sources[sources.length - 1].title}`);
    }

    // Show dossier preview
    const preview = markdown.split("\n").slice(0, 6).join("\n");
    console.log(`\n  Dossier preview:\n${preview}...\n`);
  } else {
    // Synthetic artifact for verification (simulate what the LLM would return)
    const syntheticMd = [
      "# EV Charging Infrastructure in Europe — A Software Platform Opportunity",
      "",
      "**Prepared for:** Series A Founder, B2B CPO Platform",
      `**Date:** ${new Date().toISOString().slice(0, 10)}`,
      "**SLA tier:** STANDARD",
      "**Sources:** 6 round-tripped, verified",
      "",
      "## Executive Summary",
      "Europe's EV charging market is projected to reach €45B by 2030...",
      "",
      "## Source Index",
      '1. **"European EV Charging Infrastructure Market Report 2025"** — BloombergNEF ([URL](https://about.bnef.com/blog/european-ev-charging-infrastructure-market-report-2025/))',
    ].join("\n");

    const dossierPath = path.join(artifactsDir, "dossier.md");
    fs.writeFileSync(dossierPath, syntheticMd, "utf-8");
    console.log(`\n  ✓ Synthetic dossier written for verification`);
    console.log(`    → ${dossierPath}`);

    const sources = extractSources(syntheticMd);
    const sourcesPath = path.join(artifactsDir, "sources.json");
    fs.writeFileSync(sourcesPath, JSON.stringify(sources, null, 2), "utf-8");
    console.log(`    → ${sourcesPath}`);

    if (sources.length > 0) {
      console.log(`\n  Sources extracted (synthetic): ${sources.length}`);
      console.log(`    [${sources[0].citeId}] ${sources[0].title} → ${sources[0].url}`);
    } else {
      console.log("\n  ⚠ No sources extracted from synthetic dossier — check regex");
      allPassed = false;
    }
  }

  // 4. Verify artifacts exist
  console.log("\n  Artifact files:");
  for (const f of ["prompt.txt", "dossier.md", "sources.json"]) {
    const fp = path.join(artifactsDir, f);
    const exists = fs.existsSync(fp);
    const size = exists ? fs.statSync(fp).size : 0;
    console.log(`    ${exists ? "✓" : "✗"} ${f} ${exists ? `(${size.toLocaleString()} bytes)` : "(MISSING)"}`);
    if (!exists) allPassed = false;
  }

  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`  VERDICT: ${allPassed ? "PASS ✓" : "FAIL ✗"}`);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

  process.exit(allPassed ? 0 : 1);
}

main().catch((err) => {
  logger.error({ err }, "Verification failed");
  process.exit(1);
});
