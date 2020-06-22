import { typescriptBetterer } from "@betterer/typescript";
import { regexpBetterer } from "@betterer/regexp";
import { smaller } from "@betterer/constraints";

const { execSync } = require("child_process");

const jsFileCount = parseInt(execSync(
  'find . -type f -name "*.js" -not -path "./node_modules/*" | wc -l',
  { encoding: "utf8" }
)
  .replace("\n", "")
  .trim());

export default {
  "stricter compilation": typescriptBetterer("./tsconfig.json", {
    strict: true,
  }),
  "no TSFixMe types": regexpBetterer("**/*.ts", /(\s*TSFixMe)/i),
  "migrate js files to ts": {
    test: () => jsFileCount,
    constraint: smaller,
    goal: 0,
  },
};
