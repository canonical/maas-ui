import { fixupConfigRules, fixupPluginRules } from "@eslint/compat";
import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";

import cypress from "eslint-plugin-cypress";
import noOnlyTests from "eslint-plugin-no-only-tests";
import prettier from "eslint-plugin-prettier";
import react from "eslint-plugin-react";
import unusedImports from "eslint-plugin-unused-imports";

import path from "path";
import { fileURLToPath } from "url";

import tseslint from "typescript-eslint";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default tseslint.config(
  tseslint.configs.recommended,
  ...fixupConfigRules(
    compat.extends(
      "plugin:prettier/recommended",
      "plugin:storybook/recommended"
    )
  ),
  {
    plugins: {
      "unused-imports": unusedImports,
      react,
      prettier: fixupPluginRules(prettier),
    },

    languageOptions: {
      globals: {
        usabilla_live: false,
      },

      ecmaVersion: 2018,
      sourceType: "module",

      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },

    settings: {
      react: {
        version: "detect",
      },

      "import/resolver": {
        typescript: {
          alias: {
            "@": path.resolve(__dirname, "src"),
          },
        },
      },
    },

    rules: {
      "prettier/prettier": "error",
    },
  },
  ...fixupConfigRules(
    compat.extends(
      "prettier",
      "plugin:import/errors",
      "plugin:import/warnings",
      "plugin:import/typescript",
      "plugin:prettier/recommended"
    )
  ).map((config) => ({
    ...config,
    files: ["src/**/*.ts?(x)"],
  })),
  {
    files: ["src/**/*.ts?(x)"],
    plugins: {
      "unused-imports": unusedImports,
      react,
    },

    languageOptions: {
      ecmaVersion: 2018,
      sourceType: "module",

      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
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

    rules: {
      "prettier/prettier": "error",

      complexity: [
        "error",
        {
          max: 25,
        },
      ],

      "@typescript-eslint/no-unused-vars": "off",
      "unused-imports/no-unused-imports": "error",
      "@typescript-eslint/no-unused-expressions": [
        "error",
        {
          allowShortCircuit: true,
          allowTernary: true,
        },
      ],

      "unused-imports/no-unused-vars": [
        "warn",
        {
          vars: "all",
          varsIgnorePattern: "^_",
          args: "after-used",
          ignoreRestSiblings: true,
          argsIgnorePattern: "^_",
        },
      ],

      "@typescript-eslint/consistent-type-imports": 2,
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

      "no-console": "warn",

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
  },
  {
    files: ["src/**/*.js?(x)"],

    rules: {
      "no-unused-vars": 2,
    },
  },
  {
    files: ["src/**/*.tsx"],

    rules: {
      "react/no-multi-comp": ["off"],
    },
  },
  {
    files: ["src/app/apiclient/**/*.[jt]s?(x)"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/ban-ts-comment": "off",
    },
  },
  ...compat.extends("plugin:testing-library/react").map((config) => ({
    ...config,
    files: ["src/**/*.test.[jt]s?(x)"],
  })),
  {
    files: ["src/**/*.test.[jt]s?(x)"],

    plugins: {
      "no-only-tests": noOnlyTests,
    },

    rules: {
      "no-only-tests/no-only-tests": "error",
      "testing-library/prefer-find-by": "off",
      "testing-library/prefer-explicit-assert": "error",

      "testing-library/prefer-user-event": [
        "error",
        {
          allowedMethods: ["change"],
        },
      ],

      "react/no-multi-comp": "off",
    },
  },
  ...fixupConfigRules(
    compat.extends("plugin:cypress/recommended", "plugin:prettier/recommended")
  ).map((config) => ({
    ...config,
    files: ["cypress/**/*.spec.[jt]s?(x)", "cypress/support/*.ts"],
  })),
  {
    files: ["cypress/**/*.spec.[jt]s?(x)", "cypress/support/*.ts"],

    plugins: {
      cypress: fixupPluginRules(cypress),
      "no-only-tests": noOnlyTests,
    },

    rules: {
      "no-only-tests/no-only-tests": "error",
      "cypress/no-force": "off",
      "prettier/prettier": "error",
      "@typescript-eslint/no-unused-expressions": [
        "error",
        {
          allowShortCircuit: true,
          allowTernary: true,
        },
      ],
    },
  },
  ...compat.extends("plugin:playwright/recommended").map((config) => ({
    ...config,
    files: ["tests/**/*.[jt]s?(x)"],
  })),
  {
    files: ["tests/**/*.[jt]s?(x)"],

    rules: {
      "playwright/no-force-option": "off",
      "no-only-tests/no-only-tests": "error",
      "prettier/prettier": "error",
    },
  }
);
