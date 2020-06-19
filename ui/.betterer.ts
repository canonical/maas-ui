import { typescriptBetterer } from "@betterer/typescript";
import { regexpBetterer } from '@betterer/regexp';

export default {
  "stricter compilation": typescriptBetterer("./tsconfig.json", {
    strict: true,
  }),
  "no TSFixMe types": regexpBetterer("**/*.ts", /(\s*TSFixMe)/i),
};
