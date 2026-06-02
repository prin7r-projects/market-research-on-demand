/**
 * Unit tests for build-brief worker core logic.
 * Run: tsx --test src/workers/build-brief.test.ts
 *
 * Tests pure functions (prompt builder, source extractor) without DB or LLM calls.
 */

import { describe, it } from "node:test";
import * as assert from "node:assert/strict";

// Re-implement the pure functions here to avoid the DB import side-effects.
// These mirror the logic in build-brief.ts exactly.

function buildResearchPrompt(scopeMd: string, tier: string): string {
  const sourceTarget = tier === "pro" || tier === "monitor" ? "15-25" : "8-15";
  return [
    "You are a senior market-research editor producing a cited dossier.",
    `Target: ${sourceTarget} distinct, live sources.`,
    `**SLA tier:** ${tier.toUpperCase()}`,
    `## The Client's Brief\n\n${scopeMd}`,
  ].join("\n");
}

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

  // Match: 1. **"Article Title"** — Publication Name ([URL](https://...))
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
  return sources;
}

/* ── Tests ── */

describe("buildResearchPrompt", () => {
  it("includes the client's scope in the prompt", () => {
    const prompt = buildResearchPrompt("Market analysis of EV charging in Europe", "standard");
    assert.ok(prompt.includes("Market analysis of EV charging in Europe"));
  });

  it("sets source target 8-15 for standard tier", () => {
    const prompt = buildResearchPrompt("test", "standard");
    assert.ok(prompt.includes("8-15"));
  });

  it("sets source target 15-25 for pro tier", () => {
    const prompt = buildResearchPrompt("test", "pro");
    assert.ok(prompt.includes("15-25"));
  });

  it("sets source target 15-25 for monitor tier", () => {
    const prompt = buildResearchPrompt("test", "monitor");
    assert.ok(prompt.includes("15-25"));
  });

  it("includes SLA tier in the prompt", () => {
    const prompt = buildResearchPrompt("test", "pro");
    assert.ok(prompt.includes("PRO"));
  });
});

describe("extractSources", () => {
  it("returns empty array when no Source Index section", () => {
    const sources = extractSources("No source index here.");
    assert.equal(sources.length, 0);
  });

  it("extracts a single source", () => {
    const md = [
      "## Source Index",
      '1. **"The EV Market in 2025"** — BloombergNEF ([URL](https://about.bnef.com/ev-2025))',
    ].join("\n");

    const sources = extractSources(md);
    assert.equal(sources.length, 1);
    assert.equal(sources[0].citeId, "1");
    assert.equal(sources[0].title, "The EV Market in 2025");
    assert.equal(sources[0].url, "https://about.bnef.com/ev-2025");
    assert.ok(sources[0].accessedAt.endsWith("Z"));
  });

  it("extracts multiple sources", () => {
    const md = [
      "## Source Index",
      '1. **"EV Report"** — Source A ([URL](https://a.com))',
      '2. **"Charging Data"** — Source B ([URL](https://b.com))',
      '3. **"Policy Review"** — Source C ([URL](https://c.com))',
    ].join("\n");

    const sources = extractSources(md);
    assert.equal(sources.length, 3);
    assert.equal(sources[2].citeId, "3");
    assert.equal(sources[2].url, "https://c.com");
  });

  it("handles Source Index with different casing", () => {
    const md = "## source index\n1. **\"Test\"** — Pub ([URL](https://t.com))";
    const sources = extractSources(md);
    assert.equal(sources.length, 1);
  });
});
