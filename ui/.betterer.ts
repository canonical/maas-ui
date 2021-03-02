import { typescript } from "@betterer/typescript";
import { regexp } from "@betterer/regexp";
import { smaller } from "@betterer/constraints";

const { execSync } = require("child_process");

const jsFileCount = parseInt(
  execSync('find . -type f -name "*.js" -path "./src/*" | wc -l', {
    encoding: "utf8",
  })
    .replace("\n", "")
    .trim()
);

export default {
  "stricter compilation": typescript("./tsconfig.json", {
    strict: true,
  }),
  "no TSFixMe types": regexp(/(\s*TSFixMe)/i).include("**/*.ts"),
  "migrate js files to ts": {
    test: () => jsFileCount,
    constraint: smaller,
    goal: 0,
  },
};
