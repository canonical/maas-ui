module.exports = {
  root: true,
  plugins: ["prettier"],
  extends: [
    "react-app", // Use the recommended rules from CRA.
    "plugin:prettier/recommended", // Ensure this is last in the list.
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: "module",
  },
  rules: {
    "prettier/prettier": "error",
  },
  settings: {
    react: {
      version: "detect",
    },
  },
  globals: {
    usabilla_live: false,
  },
  overrides: [
    {
      files: ["src/**/*.ts?(x)"],
      extends: [
        "prettier",
        "plugin:import/errors",
        "plugin:import/warnings",
        "plugin:import/typescript",
        "plugin:prettier/recommended", // Ensure this is last in the list.
      ],
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        ecmaVersion: 2018,
        sourceType: "module",
      },
      rules: {
        "prettier/prettier": "error",
        "@typescript-eslint/no-unused-vars": [
          "error",
          {
            args: "none",
            ignoreRestSiblings: true,
          },
        ],
        "@typescript-eslint/consistent-type-imports": 2,
        "@typescript-eslint/explicit-module-boundary-types": ["error"],
        "import/namespace": "off",
        "import/no-named-as-default": 0,
        "import/order": [
          "error",
          {
            pathGroups: [
              {
                pattern: "react",
                group: "external",
                position: "before",
              },
              {
                pattern: "~/app",
                group: "internal",
              },
            ],
            pathGroupsExcludedImportTypes: ["react"],
            "newlines-between": "always",
            alphabetize: {
              order: "asc",
            },
          },
        ],
        "react/forbid-component-props": [
          "error",
          {
            forbid: [
              {
                propName: "data-test",
                message: "Use `data-testid` instead of `data-test` attribute",
              },
            ],
          },
        ],
        "react/forbid-dom-props": [
          "error",
          {
            forbid: [
              {
                propName: "data-test",
                message: "Use `data-testid` instead of `data-test` attribute",
              },
            ],
          },
        ],
        "react/jsx-sort-props": "error",
      },
      settings: {
        "import/resolver": {
          node: {
            paths: ["src"],
            extensions: [".js", ".jsx", ".ts", ".tsx"],
          },
        },
        react: {
          version: "detect",
        },
      },
    },
    {
      files: ["src/**/*.js?(x)"],
      rules: {
        "no-unused-vars": 2,
      },
    },
    {
      files: ["src/**/*.test.[jt]s?(x)"],
      extends: ["plugin:testing-library/react"],
      plugins: ["no-only-tests"],
      rules: {
        "no-only-tests/no-only-tests": "error",
        "testing-library/prefer-find-by": "off",
        "testing-library/prefer-explicit-assert": "error",
        "testing-library/prefer-user-event": [
          "error",
          {
            // Remove once sliders can be updated with user-event
            // https://github.com/testing-library/user-event/issues/871
            allowedMethods: ["change"],
          },
        ],
      },
    },
    {
      files: ["cypress/**/*.spec.[jt]s?(x)"],
      extends: ["plugin:cypress/recommended", "plugin:prettier/recommended"],
      plugins: ["cypress", "no-only-tests"],
      rules: {
        "no-only-tests/no-only-tests": "error",
        "cypress/no-force": "warn",
        "prettier/prettier": "error",
      },
    },
  ],
};
