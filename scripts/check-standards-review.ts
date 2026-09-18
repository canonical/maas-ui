import { execSync } from "child_process";
import * as fs from "fs";
import * as path from "path";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const PR_NUMBER = process.env.PR_NUMBER;

const MODEL = "gemini-2.0-flash";
const MAX_DOC_SIZE = 50000;
const MAX_SOURCE_SAMPLE_SIZE = 15000;
const MAX_PROMPT_SIZE = 100000;
const MAX_SOURCE_FILES = 3;

interface Violation {
  file: string;
  line?: number;
  message: string;
  layer: "Layer 1" | "Layer 2";
}

interface RepoInfo {
  owner: string;
  repo: string;
}

function getRepoInfo(): RepoInfo {
  const remoteUrl = execSync("git config --get remote.origin.url")
    .toString()
    .trim();
  const match = remoteUrl.match(/github\.com[:/](.+?)\/(.+?)(\.git)?$/);
  if (!match) throw new Error("Could not parse GitHub repo from remote URL");
  return { owner: match[1], repo: match[2] };
}

function sanitizeForPrompt(text: string, maxSize: number): string {
  let sanitized = text.substring(0, maxSize);
  sanitized = sanitized.replace(/[\x00-\x08\x0b-\x0c\x0e-\x1f\x7f]/g, " ");
  return sanitized;
}

async function callGemini(prompt: string): Promise<string> {
  if (!GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY not set");
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Gemini API error (${response.status}): ${error}`);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = (await response.json()) as any;
    if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
      throw new Error("Unexpected Gemini response format");
    }
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to call Gemini API: ${msg}`);
  }
}

async function getPRChangedFiles(prNumber: number): Promise<string[]> {
  if (!GITHUB_TOKEN) {
    throw new Error("GITHUB_TOKEN not set");
  }

  const repo = getRepoInfo();

  try {
    const response = await fetch(
      `https://api.github.com/repos/${repo.owner}/${repo.repo}/pulls/${prNumber}/files`,
      {
        headers: { Authorization: `Bearer ${GITHUB_TOKEN}` },
      }
    );

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const files = (await response.json()) as any[];
    return files.map((f) => f.filename).filter((f) => !f.startsWith("docs/"));
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to fetch PR files: ${msg}`);
  }
}

function getFullCodebaseFiles(): string[] {
  try {
    const output = execSync(
      'find src cypress -type f \\( -name "*.ts" -o -name "*.tsx" \\) 2>/dev/null'
    )
      .toString()
      .trim();
    return output
      .split("\n")
      .filter((f) => f && !f.startsWith("docs/") && !f.includes("docs-links"));
  } catch {
    return [];
  }
}

function runLayer1Checks(files: string[]): Violation[] {
  if (files.length === 0) return [];

  try {
    const output = execSync(
      `npx tsx scripts/check-standards.ts --skip=data-testid`,
      { stdio: "pipe" }
    ).toString();

    const violations: Violation[] = [];
    const lines = output.split("\n");

    for (const line of lines) {
      const match = line.match(/^(.+?):(\d+):(\d+)\s+—\s+(.+?)\s+→\s+(.+)$/);
      if (match) {
        violations.push({
          file: match[1],
          line: parseInt(match[2], 10),
          message: match[4],
          layer: "Layer 1",
        });
      }
    }

    return violations;
  } catch (error) {
    console.error("Layer 1 check failed:", error);
    return [];
  }
}

async function runLayer2Checks(files: string[]): Promise<Violation[]> {
  if (files.length === 0 || !GEMINI_API_KEY) return [];

  const docsDir = "docs/standards";
  const violations: Violation[] = [];

  const relevantDocs = [
    "tables.md",
    "forms.md",
    "api-hooks.md",
    "architecture.md",
    "routing.md",
    "testing.md",
  ];

  for (const docFile of relevantDocs) {
    const docPath = path.join(docsDir, docFile);
    if (!fs.existsSync(docPath)) continue;

    let docContent = fs.readFileSync(docPath, "utf-8");
    docContent = sanitizeForPrompt(docContent, MAX_DOC_SIZE);

    const sampleFiles = files.slice(0, MAX_SOURCE_FILES);
    const samples: string[] = [];
    let totalSize = 0;

    for (const file of sampleFiles) {
      if (!fs.existsSync(file) || totalSize > MAX_SOURCE_SAMPLE_SIZE) break;

      try {
        let content = fs.readFileSync(file, "utf-8");
        content = sanitizeForPrompt(
          content,
          MAX_SOURCE_SAMPLE_SIZE - totalSize
        );
        samples.push(
          `File: ${path.basename(file)}\n\`\`\`\n${content}\n\`\`\``
        );
        totalSize += content.length;
      } catch {
        // skip
      }
    }

    const prompt = `You are a code standards reviewer for the maas-ui project.

Review this standards documentation and code samples. Identify semantic violations.

## Standards Documentation

\`\`\`markdown
${docContent}
\`\`\`

## Code Samples

${samples.join("\n\n")}

## Task

Scan the code for semantic violations of the standards in the documentation.

Check for patterns like:
- Tables: raw HTML <table> instead of GenericTable
- Forms: useState instead of FormikForm + Yup
- Hook naming: not following use<ResourcePlural>/useGet<Resource>
- Component elevation: cross-domain imports not promoted
- Routing: hardcoded URLs instead of urls.ts
- Cypress E2E: cy.get('[data-testid=...]') instead of accessible queries

Respond with EXACTLY:

VIOLATIONS: <count>

If count > 0, list each on new line:
<file>:<line> — <description>

If count = 0, respond only with: VIOLATIONS: 0`;

    if (prompt.length > MAX_PROMPT_SIZE) {
      console.warn(`Prompt too large for ${docFile}, skipping`);
      continue;
    }

    try {
      const response = await callGemini(prompt);
      const lines = response.split("\n");
      const firstLine = lines[0].trim();

      const countMatch = firstLine.match(/VIOLATIONS:\s*(\d+)/);
      if (!countMatch) continue;

      const count = parseInt(countMatch[1], 10);
      if (count === 0) continue;

      for (let i = 1; i < lines.length && violations.length < 50; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        const match = line.match(/^(.+?):(\d+)\s+—\s+(.+)$/);
        if (match) {
          violations.push({
            file: match[1],
            line: parseInt(match[2], 10),
            message: match[3],
            layer: "Layer 2",
          });
        }
      }
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      console.error(`Layer 2 check for ${docFile} failed: ${msg}`);
    }
  }

  return violations;
}

async function postPRReview(
  prNumber: number,
  violations: Violation[]
): Promise<void> {
  if (!GITHUB_TOKEN) {
    throw new Error("GITHUB_TOKEN not set");
  }

  const repo = getRepoInfo();

  const layer1 = violations.filter((v) => v.layer === "Layer 1");
  const layer2 = violations.filter((v) => v.layer === "Layer 2");

  const body = `## Standards Compliance Check

### Layer 1 — Static Violations

${
  layer1.length === 0
    ? "None detected."
    : layer1
        .map((v) => `- \`${v.file}\` line ${v.line} — ${v.message}`)
        .join("\n")
}

### Layer 2 — Semantic Violations

${
  layer2.length === 0
    ? "None detected."
    : layer2.map((v) => `- \`${v.file}\` — ${v.message}`).join("\n")
}`;

  try {
    await fetch(
      `https://api.github.com/repos/${repo.owner}/${repo.repo}/pulls/${prNumber}/reviews`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          body,
          event: "COMMENT",
        }),
      }
    );

    console.log("Review comment posted to PR");
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error(`Failed to post review: ${msg}`);
  }
}

function writeWeeklyPRBody(violations: Violation[]): void {
  const layer1 = violations.filter((v) => v.layer === "Layer 1");
  const layer2 = violations.filter((v) => v.layer === "Layer 2");

  const date = new Date().toISOString().split("T")[0];

  const body = `## Weekly Standards Compliance Review — ${date}

### Layer 1 — Static Violations

${
  layer1.length === 0
    ? "None detected."
    : layer1
        .map((v) => `- \`${v.file}\` line ${v.line} — ${v.message}`)
        .join("\n")
}

### Layer 2 — Semantic Violations

${
  layer2.length === 0
    ? "None detected."
    : layer2.map((v) => `- \`${v.file}\` — ${v.message}`).join("\n")
}

---

_This PR was auto-generated by the standards-review workflow._`;

  fs.writeFileSync(".github/standards-review-findings.md", body, "utf-8");
}

async function main() {
  console.log("Standards Compliance Review");
  console.log(`Mode: ${PR_NUMBER ? `PR #${PR_NUMBER}` : "Weekly scan"}`);
  console.log("");

  let files: string[] = [];

  if (PR_NUMBER) {
    try {
      files = await getPRChangedFiles(parseInt(PR_NUMBER, 10));
      console.log(`Checking ${files.length} changed file(s) in PR\n`);
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      console.error(`Failed to get PR files: ${msg}`);
      process.exit(1);
    }
  } else {
    files = getFullCodebaseFiles();
    console.log(`Checking ${files.length} file(s) in codebase\n`);
  }

  let allViolations: Violation[] = [];

  if (files.length > 0) {
    console.log("Running Layer 1 (static checks)...");
    const layer1Violations = runLayer1Checks(files);
    console.log(`Found ${layer1Violations.length} violation(s)\n`);

    console.log("Running Layer 2 (semantic checks)...");
    const layer2Violations = await runLayer2Checks(files);
    console.log(`Found ${layer2Violations.length} violation(s)\n`);

    allViolations = [...layer1Violations, ...layer2Violations];
  } else {
    console.log("No files to check.");
  }

  if (PR_NUMBER) {
    await postPRReview(parseInt(PR_NUMBER, 10), allViolations);
  } else if (allViolations.length > 0) {
    writeWeeklyPRBody(allViolations);
    console.log(
      `Found ${allViolations.length} violation(s). PR will be created.`
    );
  } else {
    console.log("No violations found. No PR needed.");
  }
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
