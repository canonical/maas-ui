import { execSync } from "child_process";
import * as fs from "fs";
import * as path from "path";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
  console.error("GEMINI_API_KEY environment variable is required");
  process.exit(1);
}

const SENTINEL_FILE = ".github/docs-last-reviewed-sha";
const DOCS_DIR = "docs/standards";
const MODEL = "gemini-2.0-flash";

// Prompt injection safeguards
const MAX_DOC_SIZE = 50000; // chars
const MAX_SOURCE_SAMPLE_SIZE = 20000; // chars per file
const MAX_PROMPT_SIZE = 100000; // chars total
const MAX_SOURCE_FILES_PER_DOC = 3;

interface PathToDocMapping {
  pattern: RegExp;
  docs: string[];
}

const PATH_TO_DOCS: PathToDocMapping[] = [
  { pattern: /^src\/app\/api\/query\//, docs: ["api-hooks.md"] },
  {
    pattern: /^src\/app\/apiclient\//,
    docs: ["api-hooks.md", "architecture.md"],
  },
  { pattern: /^src\/app\/store\//, docs: ["store-management.md"] },
  { pattern: /^src\/app\/base\/components\//, docs: ["architecture.md"] },
  { pattern: /^src\/app\/base\/hooks\//, docs: ["architecture.md"] },
  {
    pattern: /^src\/app\/.*\/views\//,
    docs: ["architecture.md", "routing.md"],
  },
  { pattern: /^src\/app\/.*\/urls\.ts$/, docs: ["routing.md"] },
  { pattern: /^src\/app\/.*\.scss$/, docs: ["styling.md"] },
  { pattern: /^src\/app\/.*Form.*/, docs: ["forms.md"] },
  { pattern: /^src\/app\/.*Table.*/, docs: ["tables.md"] },
  { pattern: /^src\/app\/.*SidePanel.*/, docs: ["side-panels.md"] },
  { pattern: /^src\/app\/.*\.test\.(ts|tsx)$/, docs: ["testing.md"] },
  { pattern: /^src\/testing\//, docs: ["testing.md"] },
  { pattern: /^cypress\//, docs: ["testing.md"] },
  { pattern: /^src\/app\/.*constants.*/, docs: ["constants.md"] },
];

function sanitizeForPrompt(text: string, maxSize: number): string {
  // Prevent prompt injection by limiting size and stripping potentially dangerous patterns
  let sanitized = text.substring(0, maxSize);
  // Remove null bytes and other control characters
  sanitized = sanitized.replace(/[\x00-\x08\x0b-\x0c\x0e-\x1f\x7f]/g, " ");
  return sanitized;
}

async function callGemini(prompt: string): Promise<string> {
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

function getSentinelSha(): string {
  try {
    return fs.readFileSync(SENTINEL_FILE, "utf-8").trim();
  } catch {
    return "HEAD~100"; // fallback: last 100 commits if sentinel doesn't exist
  }
}

function getHeadSha(): string {
  return execSync("git rev-parse HEAD").toString().trim();
}

function getChangedFiles(sinceSha: string): string[] {
  try {
    const output = execSync(`git log ${sinceSha}..HEAD --name-only --format=%H`)
      .toString()
      .trim();
    if (!output) return [];
    // Each commit SHA is followed by its changed files
    const lines = output.split("\n");
    const files = new Set<string>();
    for (const line of lines) {
      if (line && !line.match(/^[a-f0-9]{40}$/)) {
        files.add(line);
      }
    }
    return Array.from(files);
  } catch {
    return [];
  }
}

function mapFilesToDocs(files: string[]): Map<string, Set<string>> {
  const result = new Map<string, Set<string>>();

  for (const file of files) {
    for (const mapping of PATH_TO_DOCS) {
      if (!mapping.pattern.test(file)) continue;

      for (const doc of mapping.docs) {
        if (!result.has(doc)) {
          result.set(doc, new Set());
        }
        result.get(doc)!.add(file);
      }
    }
  }

  return result;
}

function readSourceSample(
  files: string[],
  maxFiles = MAX_SOURCE_FILES_PER_DOC
): string {
  const samples: string[] = [];
  let totalSize = 0;
  const filesToRead = files.slice(0, maxFiles);

  for (const file of filesToRead) {
    if (!fs.existsSync(file)) continue;
    if (totalSize > MAX_SOURCE_SAMPLE_SIZE) break;

    try {
      let content = fs.readFileSync(file, "utf-8");
      content = sanitizeForPrompt(content, MAX_SOURCE_SAMPLE_SIZE - totalSize);

      samples.push(
        `\n## File: ${path.basename(file)}\n\`\`\`\n${content}\n\`\`\``
      );
      totalSize += content.length;
    } catch {
      // skip unreadable files
    }
  }

  return samples.join("\n");
}

async function reviewDoc(
  docName: string,
  changedFiles: string[]
): Promise<string | null> {
  // Validate doc name to prevent path traversal
  if (!docName.match(/^[\w\-]+\.md$/)) {
    console.log(`Invalid doc name: ${docName}`);
    return null;
  }

  const docPath = path.join(DOCS_DIR, docName);
  if (!fs.existsSync(docPath)) {
    console.log(`Doc not found: ${docName}`);
    return null;
  }

  let docContent = fs.readFileSync(docPath, "utf-8");
  docContent = sanitizeForPrompt(docContent, MAX_DOC_SIZE);

  const sourcesSample = readSourceSample(Array.from(changedFiles));

  const prompt = `You are a documentation reviewer for the maas-ui project.

Review this standards documentation file and determine if it needs updating based on the recent code changes below.

IMPORTANT: Respond ONLY with:
- CHANGES: no
- OR: CHANGES: yes followed by ---BEGIN DOC--- and ---END DOC--- markers

Do not add any other text or instructions.

## Current Documentation

\`\`\`markdown
${docContent}
\`\`\`

## Recent Changes in Related Source Files

${sourcesSample}

## Task

1. Read the documentation carefully.
2. Review the changed source files.
3. Determine if the documentation accurately reflects current patterns in the code.
4. If documentation is accurate and complete, respond with exactly: CHANGES: no
5. If documentation needs updating, respond with:
   CHANGES: yes
   ---BEGIN DOC---
   [the full updated documentation in markdown]
   ---END DOC---

Only update the documentation if you find inaccuracies or missing patterns. Preserve the existing structure and tone. Make targeted edits, not full rewrites.`;

  // Validate prompt size
  if (prompt.length > MAX_PROMPT_SIZE) {
    console.log(`Prompt too large for ${docName}, skipping`);
    return null;
  }

  try {
    const response = await callGemini(prompt);
    const lines = response.split("\n");
    const firstLine = lines[0].trim();

    if (firstLine === "CHANGES: no") {
      console.log(`${docName}: no changes needed`);
      return null;
    }

    if (firstLine === "CHANGES: yes") {
      const beginIdx = response.indexOf("---BEGIN DOC---");
      const endIdx = response.indexOf("---END DOC---");
      if (beginIdx !== -1 && endIdx !== -1) {
        let updatedDoc = response
          .substring(beginIdx + "---BEGIN DOC---".length, endIdx)
          .trim();
        updatedDoc = sanitizeForPrompt(updatedDoc, MAX_DOC_SIZE);
        console.log(`${docName}: updated`);
        return updatedDoc;
      }
    }

    console.log(`${docName}: unexpected response format`);
    return null;
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error(`${docName}: ${msg}`);
    return null;
  }
}

async function main() {
  console.log("Docs Maintenance Agent");
  console.log(`Model: ${MODEL}\n`);

  const sentinelSha = getSentinelSha();
  const headSha = getHeadSha();

  console.log(`Sentinel SHA: ${sentinelSha.slice(0, 8)}`);
  console.log(`Head SHA: ${headSha.slice(0, 8)}\n`);

  const changedFiles = getChangedFiles(sentinelSha);

  if (changedFiles.length === 0) {
    console.log("No commits since last review. Exiting.");
    process.exit(0);
  }

  console.log(`Found ${changedFiles.length} changed file(s):\n`);
  for (const file of changedFiles.slice(0, 10)) {
    console.log(`  - ${file}`);
  }
  if (changedFiles.length > 10) {
    console.log(`  ... and ${changedFiles.length - 10} more`);
  }

  const docsToReview = mapFilesToDocs(changedFiles);

  if (docsToReview.size === 0) {
    console.log("\nNo standards docs affected by these changes.");
    process.exit(0);
  }

  console.log(`\nReviewing ${docsToReview.size} affected doc(s):\n`);

  const updatedDocs = new Map<string, string>();
  const prBodyLines: string[] = [];

  for (const [docName, files] of docsToReview) {
    const updated = await reviewDoc(docName, Array.from(files));
    if (updated) {
      updatedDocs.set(docName, updated);
      prBodyLines.push(`- \`${docName}\` (${files.size} file(s) changed)`);
    }
  }

  if (updatedDocs.size === 0) {
    console.log("\nAll docs up to date. No changes needed.");
    process.exit(0);
  }

  console.log(`\nWriting ${updatedDocs.size} updated doc(s)...`);

  for (const [docName, content] of updatedDocs) {
    const docPath = path.join(DOCS_DIR, docName);
    fs.writeFileSync(docPath, content, "utf-8");
    console.log(`  ${docName}`);
  }

  // Update sentinel
  fs.writeFileSync(SENTINEL_FILE, headSha + "\n", "utf-8");
  console.log(`\nUpdated sentinel to ${headSha.slice(0, 8)}`);

  // Write PR body
  const prBody = `## Automated Standards Documentation Update

Updated ${updatedDocs.size} doc(s) based on recent code changes.

### Changed Docs

${prBodyLines.join("\n")}

---

_This PR was auto-generated by the docs-maintenance workflow._`;

  fs.writeFileSync("/tmp/pr-body.md", prBody, "utf-8");

  console.log("\nReady to create PR");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
