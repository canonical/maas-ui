import { execSync } from "child_process";

const arg = process.argv[2];
if (arg !== "--patch" && arg !== "--minor" && arg !== "--major") {
  console.error("Usage: node scripts/upgrade-deps.js --patch | --minor | --major");
  process.exit(1);
}

const NCU = "npx --yes npm-check-updates";
// ncu uses "latest" to mean greatest released version (includes major bumps)
const ncuTarget = arg === "--major" ? "latest" : arg.slice(2);
const TARGET = `--target ${ncuTarget}`;
const label = arg.slice(2);

let upgraded;
try {
  const raw = execSync(`${NCU} ${TARGET} --jsonUpgraded`, {
    encoding: "utf-8",
    stdio: ["ignore", "pipe", "pipe"],
  });
  upgraded = JSON.parse(raw);
} catch {
  console.error("ncu check failed — check your network/registry access.");
  process.exit(1);
}

const packages = Object.entries(upgraded);

if (packages.length === 0) {
  console.log(`All ${label}-level dependencies are already up to date.`);
  process.exit(0);
}

console.log(`Upgrading ${packages.length} package(s) to latest ${label}:\n`);
for (const [name, version] of packages) {
  console.log(`  ${name}  →  ${version}`);
}
console.log("");

execSync(`${NCU} ${TARGET} --upgrade`, { stdio: "inherit" });

console.log("\nRunning yarn install...");
execSync("yarn install", { stdio: "inherit" });

console.log("\nDone. Verify with: yarn lint && yarn test");
