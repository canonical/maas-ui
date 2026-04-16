import { readFileSync, readdirSync } from "fs";
import { join, resolve, relative, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

interface StepDefinition {
  keyword: string;
  pattern: string;
  body: string;
  normalizedBody: string;
  file: string;
  line: number;
}

// ── File discovery ────────────────────────────────────────────────────────────

function findFiles(dir: string, suffix: string): string[] {
  const results: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...findFiles(fullPath, suffix));
    } else if (entry.name.endsWith(suffix)) {
      results.push(fullPath);
    }
  }
  return results;
}

// ── Parsing helpers ───────────────────────────────────────────────────────────

/**
 * Extract the first argument of a step registration call (string or /regex/).
 * Returns the normalised pattern text and the position after the closing delimiter.
 */
function parsePattern(
  content: string,
  pos: number
): { pattern: string; endPos: number } | null {
  while (pos < content.length && /\s/.test(content[pos])) pos++;

  const ch = content[pos];

  if (ch === '"' || ch === "'") {
    const quote = ch;
    pos++;
    let str = "";
    while (pos < content.length && content[pos] !== quote) {
      if (content[pos] === "\\") {
        str += content[pos + 1]; // unescape
        pos += 2;
      } else {
        str += content[pos++];
      }
    }
    return { pattern: str, endPos: pos + 1 /* skip closing quote */ };
  }

  if (ch === "/") {
    pos++;
    let str = "";
    while (pos < content.length && content[pos] !== "/") {
      if (content[pos] === "\\") {
        str += `\\${content[pos + 1]}`;
        pos += 2;
      } else {
        str += content[pos++];
      }
    }
    pos++; // skip closing "/"
    while (pos < content.length && /[gimsuy]/.test(content[pos])) pos++; // skip flags
    return { pattern: `/${str}/`, endPos: pos };
  }

  return null;
}

/**
 * Skip a balanced parenthesised block, respecting string literals.
 * `start` must point at the opening `(`.
 * Returns the index immediately after the closing `)`, or -1 on failure.
 */
function skipBalancedParens(content: string, start: number): number {
  let depth = 0;
  let i = start;
  let inSingle = false;
  let inDouble = false;
  let inTemplate = false;

  while (i < content.length) {
    const ch = content[i];
    if (inSingle) {
      if (ch === "\\") i++;
      else if (ch === "'") inSingle = false;
    } else if (inDouble) {
      if (ch === "\\") i++;
      else if (ch === '"') inDouble = false;
    } else if (inTemplate) {
      if (ch === "\\") i++;
      else if (ch === "`") inTemplate = false;
    } else {
      if (ch === "'") inSingle = true;
      else if (ch === '"') inDouble = true;
      else if (ch === "`") inTemplate = true;
      else if (ch === "(") depth++;
      else if (ch === ")") {
        depth--;
        if (depth === 0) return i + 1;
      }
    }
    i++;
  }
  return -1;
}

/**
 * Extract the body of the callback that is the second argument of a step
 * registration call. Supports both arrow functions and `function` expressions
 * (the latter is used when steps need `this` context for shared state).
 */
function parseCallbackBody(
  content: string,
  afterPatternPos: number
): string | null {
  let pos = afterPatternPos;

  // Skip comma + whitespace between pattern and callback
  while (pos < content.length && /[\s,]/.test(content[pos])) pos++;

  // ── function / async function expression ────────────────────────────────
  const isAsync = content.startsWith("async", pos);
  if (isAsync) {
    pos += 5;
    while (pos < content.length && /\s/.test(content[pos])) pos++;
  }

  if (content.startsWith("function", pos)) {
    pos += 8; // skip "function"
    // Skip optional function name
    while (pos < content.length && /\s/.test(content[pos])) pos++;
    // Skip parameter list
    if (content[pos] === "(") {
      pos = skipBalancedParens(content, pos);
      if (pos === -1) return null;
    }
    // Skip to opening brace
    while (pos < content.length && content[pos] !== "{") pos++;
    if (pos >= content.length) return null;
    return extractBraceBlock(content, pos);
  }

  // ── Arrow function: (...params...) => { ... } ────────────────────────────
  // Balance the parameter list first so we don't accidentally pick up `=>`
  // from inside a regex or a later step.
  if (content[pos] === "(") {
    const afterParams = skipBalancedParens(content, pos);
    if (afterParams === -1) return null;
    pos = afterParams;
  }

  // Skip whitespace then expect `=>`
  while (pos < content.length && /[ \t]/.test(content[pos])) pos++;
  if (content[pos] !== "=" || content[pos + 1] !== ">") return null;
  pos += 2;
  while (pos < content.length && /[ \t]/.test(content[pos])) pos++;

  if (content[pos] === "{") {
    return extractBraceBlock(content, pos);
  }

  // Concise arrow body (single expression, no braces)
  const lineEnd = content.indexOf("\n", pos);
  return content.slice(pos, lineEnd !== -1 ? lineEnd : undefined).trim();
}

/**
 * Return the substring from `start` (which must point at `{`) to the
 * matching `}`, respecting string literals and nested braces.
 */
function extractBraceBlock(content: string, start: number): string {
  let depth = 0;
  let i = start;
  let inSingle = false;
  let inDouble = false;
  let inTemplate = false;

  while (i < content.length) {
    const ch = content[i];

    if (inSingle) {
      if (ch === "\\") i++;
      else if (ch === "'") inSingle = false;
    } else if (inDouble) {
      if (ch === "\\") i++;
      else if (ch === '"') inDouble = false;
    } else if (inTemplate) {
      if (ch === "\\") i++;
      else if (ch === "`") inTemplate = false;
    } else {
      if (ch === "'") inSingle = true;
      else if (ch === '"') inDouble = true;
      else if (ch === "`") inTemplate = true;
      else if (ch === "{") depth++;
      else if (ch === "}") {
        depth--;
        if (depth === 0) return content.slice(start, i + 1);
      }
    }

    i++;
  }

  return content.slice(start);
}

// ── Step-definition file parser ───────────────────────────────────────────────

function normalizeBody(body: string): string {
  return body
    .replace(/\/\/[^\n]*/g, "") // strip line comments
    .replace(/\/\*[\s\S]*?\*\//g, "") // strip block comments
    .replace(/\s+/g, " ")
    .trim();
}

function getLine(content: string, pos: number): number {
  return (content.slice(0, pos).match(/\n/g) ?? []).length + 1;
}

function parseStepFile(filePath: string): StepDefinition[] {
  const content = readFileSync(filePath, "utf-8");
  const defs: StepDefinition[] = [];
  const stepCallRe = /\b(Given|When|Then)\s*\(/g;
  let match: RegExpExecArray | null;

  while ((match = stepCallRe.exec(content)) !== null) {
    const keyword = match[1];
    const afterParen = match.index + match[0].length;

    const patternResult = parsePattern(content, afterParen);
    if (!patternResult) continue;

    const body = parseCallbackBody(content, patternResult.endPos);
    if (!body) continue;

    defs.push({
      keyword,
      pattern: patternResult.pattern,
      body,
      normalizedBody: normalizeBody(body),
      file: filePath,
      line: getLine(content, match.index),
    });
  }

  return defs;
}

// ── Reporting helpers ─────────────────────────────────────────────────────────

const rel = (p: string) => relative(ROOT, p);

const BOLD = "\x1b[1m";
const RED = "\x1b[31m";
const YELLOW = "\x1b[33m";
const GREEN = "\x1b[32m";
const RESET = "\x1b[0m";
const DIM = "\x1b[2m";

function heading(text: string, color: string = RED): void {
  console.log(`\n${color}${BOLD}${text}${RESET}`);
}

function printLocation(def: StepDefinition): void {
  console.log(
    `    ${DIM}[${def.keyword}]${RESET} "${def.pattern}"`,
    `\n    ${DIM}→ ${rel(def.file)}:${def.line}${RESET}`
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────

function main(): void {
  const stepDefsDir = resolve(ROOT, "cypress/support/step_definitions");
  const files = findFiles(stepDefsDir, ".steps.ts");

  if (files.length === 0) {
    console.log("No step definition files found.");
    process.exit(0);
  }

  console.log(`Scanning ${files.length} step definition file(s)…`);

  const allDefs: StepDefinition[] = files.flatMap(parseStepFile);

  console.log(`Found ${allDefs.length} step registration(s) in total.\n`);

  let issueCount = 0;

  // ── Check 1: Duplicate patterns ───────────────────────────────────────────
  {
    const byPattern = new Map<string, StepDefinition[]>();
    for (const def of allDefs) {
      const group = byPattern.get(def.pattern) ?? [];
      group.push(def);
      byPattern.set(def.pattern, group);
    }

    const duplicates = [...byPattern.values()].filter((g) => g.length > 1);

    if (duplicates.length === 0) {
      console.log(`${GREEN}✓ No duplicate step patterns found.${RESET}`);
    } else {
      heading(
        `✗ Duplicate step patterns (${duplicates.length} pattern(s) registered more than once):`
      );
      for (const group of duplicates) {
        console.log(`\n  Pattern: "${group[0].pattern}"`);
        for (const def of group) printLocation(def);
        issueCount++;
      }
    }
  }

  // ── Check 2: Different patterns sharing the same implementation body ───────
  {
    const byBody = new Map<string, StepDefinition[]>();
    for (const def of allDefs) {
      const group = byBody.get(def.normalizedBody) ?? [];
      group.push(def);
      byBody.set(def.normalizedBody, group);
    }

    // Only flag groups that contain at least two *distinct* patterns
    const clones = [...byBody.values()].filter((group) => {
      const patterns = new Set(group.map((d) => d.pattern));
      return patterns.size > 1;
    });

    if (clones.length === 0) {
      console.log(
        `${GREEN}✓ No different patterns sharing an identical implementation found.${RESET}`
      );
    } else {
      heading(
        `✗ Different patterns with identical implementation (${clones.length} group(s)):`,
        YELLOW
      );
      console.log(
        `${DIM}  These step patterns share the exact same callback body — they may be accidental duplicates or candidates for consolidation.${RESET}`
      );
      for (const group of clones) {
        const uniquePatterns = [
          ...new Set(group.map((d) => `[${d.keyword}] "${d.pattern}"`)),
        ];
        console.log(`\n  Shared body:\n    ${group[0].body.trim()}`);
        console.log(`\n  Used by ${uniquePatterns.length} pattern(s):`);
        for (const def of group) printLocation(def);
        issueCount++;
      }
    }
  }

  // ── Summary ───────────────────────────────────────────────────────────────
  if (issueCount > 0) {
    console.log(
      `\n${RED}${BOLD}Found ${issueCount} issue(s). Review the patterns above and deduplicate where appropriate.${RESET}`
    );
    process.exit(1);
  } else {
    console.log(`\n${GREEN}${BOLD}All checks passed!${RESET}`);
    process.exit(0);
  }
}

main();
