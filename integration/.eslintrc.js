module.exports = {
  parser: "@typescript-eslint/parser",
  extends: [
    "plugin:cypress/recommended",
    "../eslint/common",
    "plugin:prettier/recommended", // Ensure this is last in the list.
  ],
  plugins: [
    "cypress",
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
    "cypress/no-force": "warn",
    "prettier/prettier": "error",
  },
};
