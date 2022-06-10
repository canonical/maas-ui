module.exports = {
  parser: "babel-eslint",
  plugins: [
    "react",
    "testing-library",
    "no-only-tests",
    "@typescript-eslint",
    "prettier",
    "eslint-plugin-import",
  ],
  extends: [
    "react-app", // Use the recommended rules from CRA.
    "./eslint/common",
    "./eslint/react",
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
      parser: "@typescript-eslint/parser",
      plugins: ["react", "@typescript-eslint", "prettier"],
      extends: [
        "react-app", // Uses the recommended rules from CRA.
        "./eslint/common",
        "./eslint/react",
        "plugin:@typescript-eslint/recommended", // Uses the recommended rules from @typescript-eslint/eslint-plugin
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
      files: [
        "src/**/__tests__/**/*.[jt]s?(x)",
        "src/**/?(*.)+(spec|test).[jt]s?(x)",
      ],
      extends: ["plugin:testing-library/react"],
      rules: {
        "testing-library/prefer-find-by": "off",
        "testing-library/prefer-explicit-assert": "error",
      },
    },
  ],
};
