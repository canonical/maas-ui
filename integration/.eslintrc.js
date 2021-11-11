module.exports = {
  parser: "@typescript-eslint/parser",
  extends: [
    "plugin:cypress/recommended",
    "plugin:prettier/recommended", // Ensure this is last in the list.
  ],
  plugins: [
    "cypress",
    "no-only-tests",
    "@typescript-eslint",
    "prettier",
    "eslint-plugin-import",
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: "module",
  },
  rules: {
    "no-only-tests/no-only-tests": "error",
    "cypress/no-force": "warn",
    "prettier/prettier": "error",
  },
};
