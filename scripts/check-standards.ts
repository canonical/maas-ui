// scripts/check-standards.ts
import { execSync } from "child_process";
import * as fs from "fs";
import * as path from "path";

interface Violation {
  file: string;
  line: number;
  message: string;
  doc: string;
}

const IGNORE_DIRECTIVE = "check-standards-ignore";

const violations: Violation[] = [];

interface GrepResult {
  file: string;
  line: number;
  match: string;
  ignoredWithoutReason?: boolean;
}

function grep(pattern: string, files: string[]): GrepResult[] {
  if (files.length === 0) return [];
  const results: GrepResult[] = [];
  for (const file of files) {
    const content = fs.readFileSync(file, "utf-8");
    const lines = content.split("\n");
    lines.forEach((lineContent, i) => {
      if (!new RegExp(pattern).test(lineContent)) return;
      const prevLine = i > 0 ? lines[i - 1].trim() : "";
      if (prevLine.includes(IGNORE_DIRECTIVE)) {
        const afterDirective =
          prevLine.split(IGNORE_DIRECTIVE)[1]?.trim() ?? "";
        const hasReason =
          afterDirective.startsWith(":") &&
          afterDirective.slice(1).trim().length > 0;
        if (hasReason) return; // valid ignore — suppress violation
        results.push({
          file,
          line: i,
          match: prevLine,
          ignoredWithoutReason: true,
        });
      } else {
        results.push({ file, line: i + 1, match: lineContent.trim() });
      }
    });
  }
  return results;
}

function addViolations(
  results: GrepResult[],
  message: string,
  doc: string
): void {
  results.forEach(({ file, line, ignoredWithoutReason }) => {
    if (ignoredWithoutReason) {
      violations.push({
        file,
        line,
        message: `check-standards-ignore requires a reason. Use: // check-standards-ignore: <explanation>`,
        doc: "",
      });
    } else {
      violations.push({ file, line, message, doc });
    }
  });
}

const changedOnly = process.argv.includes("--changed-only");
const showLegacy = process.argv.includes("--show-legacy");
const skipArg = process.argv.find((a) => a.startsWith("--skip="));
const skipKeywords = skipArg ? skipArg.replace("--skip=", "").split(",") : [];

// Files in these paths are legacy code — violations are hidden by default.
// Run with --show-legacy to include them.
const LEGACY_PATHS = ["src/app/base/sagas"];

function globToFind(pattern: string): string {
  // "src/**/*.{ts,tsx}"      → find src -type f \( -name "*.ts" -o -name "*.tsx" \)
  // "src/**/*.test.{ts,tsx}" → find src -type f \( -name "*.test.ts" -o -name "*.test.tsx" \)
  // "src/**/*.tsx"           → find src -type f -name "*.tsx"
  const [dir] = pattern.split("/**/");
  const extPart = pattern.split("/").pop() ?? "";
  const braceMatch = extPart.match(/^(.*)\.\{(.+)\}$/);
  if (braceMatch) {
    const prefix = braceMatch[1];
    const exts = braceMatch[2].split(",");
    const nameFlags = exts
      .map((e, i) =>
        i === 0 ? `-name "${prefix}.${e}"` : `-o -name "${prefix}.${e}"`
      )
      .join(" ");
    return `find ${dir} -type f \\( ${nameFlags} \\) 2>/dev/null`;
  }
  return `find ${dir} -type f -name "${extPart}" 2>/dev/null`;
}

function getFiles(pattern: string): string[] {
  const root = path.resolve(".");
  if (changedOnly) {
    const changed = execSync("git diff --name-only origin/main...HEAD")
      .toString()
      .split("\n")
      .filter(Boolean);
    // Replace ** before * to avoid corrupting .* during the * pass
    const regex = new RegExp(
      "^" +
        pattern
          .replace(/\*\*/g, "\x00")
          .replace(/\*/g, "[^/]*")
          .replace(/\x00/g, ".*")
          .replace(/\{([^}]+)\}/g, (_, g) => `(${g.split(",").join("|")})`) +
        "$"
    );
    return changed.filter(
      (f) => regex.test(f) && fs.existsSync(f) && !f.startsWith("docs/")
    );
  }
  return execSync(globToFind(pattern))
    .toString()
    .split("\n")
    .filter(Boolean)
    .map((f) => path.relative(root, f))
    .filter((f) => !f.startsWith("docs/"));
}

// Check: data-testid in JSX
const tsxFiles = getFiles("src/**/*.tsx");
addViolations(
  grep("data-testid=", tsxFiles),
  "data-testid attribute found. Use accessible queries (getByRole, getByLabelText) instead.",
  "docs/standards/testing.md"
);

// Check: class components — match only class declarations, not generic constraints like <C extends ComponentType>
addViolations(
  grep(
    "^\\s*(export\\s+)?(abstract\\s+)?class\\s+\\w.*\\bextends\\s+(React\\.Component|Component|PureComponent)\\b",
    tsxFiles
  ),
  "Class component found. Use function components only.",
  "docs/standards/architecture.md"
);

// Check: Playwright imports in cypress E2E (except docs-links)
const cypressFiles = getFiles("cypress/**/*.ts").filter(
  (f) => !f.includes("docs-links")
);
addViolations(
  grep("from ['\"]@playwright|require\\(['\"]playwright", cypressFiles),
  "Playwright import in E2E test. Use Cypress + Cucumber for E2E tests. Playwright is only for docs link checking.",
  "docs/standards/testing.md"
);

// Check: configureStore from redux-mock-store
const testFiles = getFiles("src/**/*.test.{ts,tsx}");
addViolations(
  grep("from ['\"]redux-mock-store['\"]", testFiles),
  "configureStore from redux-mock-store is banned. Use renderWithProviders with state instead.",
  "docs/standards/testing.md"
);

// Check: createSlice outside store/
const nonStoreFiles = getFiles("src/**/*.{ts,tsx}").filter(
  (f) => !f.includes("src/app/store/")
);
addViolations(
  grep("createSlice\\(", nonStoreFiles),
  "createSlice found outside src/app/store/. Do not add new Redux slices — use TanStack Query instead.",
  "docs/standards/store-management.md"
);

// Check: saga effects outside store/
addViolations(
  grep("(takeLatest|takeEvery|takeLeading)\\(", nonStoreFiles),
  "Redux-Saga effect found outside src/app/store/. New async logic must use TanStack Query, not sagas.",
  "docs/standards/store-management.md"
);

// Check: direct apiclient value imports in component files
// Allowed: import type (types only), react-query.gen (query key helpers for cache invalidation)
const componentFiles = getFiles("src/app/**/*.tsx").filter(
  (f) => !f.includes("/api/query/")
);
addViolations(
  grep("^import (?!type ).*from ['\"].*apiclient", componentFiles).filter(
    ({ match }) => !match.includes("react-query.gen")
  ),
  "Direct value import from apiclient/ in a component. Use the TanStack Query hooks in src/app/api/query/ instead. (import type and query key helpers from react-query.gen are allowed)",
  "docs/standards/api-hooks.md"
);

// Check: raw <form> element in component files
addViolations(
  grep("<form[ >]", componentFiles),
  "Raw <form> element found. Use FormikForm or ModelActionForm instead.",
  "docs/standards/forms.md"
);

// --- Report ---
const visibleViolations = violations.filter((v) => {
  if (!showLegacy && LEGACY_PATHS.some((p) => v.file.startsWith(p)))
    return false;
  if (skipKeywords.some((k) => v.doc.includes(k) || v.message.includes(k)))
    return false;
  return true;
});

const hiddenLegacy = violations.filter(
  (v) => !showLegacy && LEGACY_PATHS.some((p) => v.file.startsWith(p))
).length;
const hiddenSkip = violations.length - visibleViolations.length - hiddenLegacy;

if (hiddenLegacy > 0)
  console.log(
    `(hiding ${hiddenLegacy} legacy violation(s) in ${LEGACY_PATHS.join(", ")} — run with --show-legacy to include)`
  );
if (hiddenSkip > 0)
  console.log(
    `(skipping ${hiddenSkip} violation(s) matching: ${skipKeywords.join(", ")})`
  );
if (hiddenLegacy > 0 || hiddenSkip > 0) console.log();

if (visibleViolations.length === 0) {
  console.log("✓ No standards violations found.");
  process.exit(0);
}

// Summary by doc (printed first so it's always visible)
const byDoc = visibleViolations.reduce<Record<string, number>>((acc, v) => {
  const key = v.doc || "missing check-standards-ignore reason";
  acc[key] = (acc[key] ?? 0) + 1;
  return acc;
}, {});

console.log(`\n✗ ${visibleViolations.length} violation(s) found:\n`);
for (const [doc, count] of Object.entries(byDoc)) {
  console.log(`  ${count.toString().padStart(4)}  ${doc}`);
}
console.log("\n--- Details ---");

// Per-file details
const byFile = visibleViolations.reduce<Record<string, Violation[]>>(
  (acc, v) => {
    (acc[v.file] ??= []).push(v);
    return acc;
  },
  {}
);

for (const [file, fileViolations] of Object.entries(byFile)) {
  console.log(`\nFAIL ${file}`);
  for (const v of fileViolations) {
    console.log(`  ${v.file}:${v.line}:1 — ${v.message}`);
    if (v.doc) console.log(`  → ${v.doc}`);
  }
}

process.exit(1);
