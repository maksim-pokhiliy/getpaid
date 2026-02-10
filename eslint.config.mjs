import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import simpleImportSort from "eslint-plugin-simple-import-sort";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
  {
    plugins: { "simple-import-sort": simpleImportSort },
    rules: {
      "simple-import-sort/imports": [
        "error",
        {
          groups: [
            ["^react", "^next"],
            ["^@mui"],
            ["^@?\\w"],
            ["^@app/shared"],
            ["^@app/features"],
            ["^@app/server"],
            ["^@app"],
            ["^\\."],
          ],
        },
      ],
      "simple-import-sort/exports": "error",
      "no-warning-comments": [
        "error",
        { terms: ["todo", "fixme", "hack", "xxx"], location: "anywhere" },
      ],
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/no-non-null-assertion": "error",
      "no-magic-numbers": "off",
      "no-console": ["error", { allow: ["warn", "error"] }],
      "prefer-const": "error",
      "no-var": "error",
      eqeqeq: ["error", "always"],
      curly: ["error", "all"],
      "no-nested-ternary": "error",
      "padding-line-between-statements": [
        "error",
        { blankLine: "always", prev: ["const", "let", "var"], next: "*" },
        { blankLine: "any", prev: ["const", "let", "var"], next: ["const", "let", "var"] },
        { blankLine: "always", prev: "*", next: "return" },
        { blankLine: "always", prev: "directive", next: "*" },
        { blankLine: "always", prev: "*", next: ["if", "for", "while", "do", "switch", "try"] },
        { blankLine: "always", prev: ["if", "for", "while", "do", "switch", "try"], next: "*" },
        { blankLine: "always", prev: "*", next: ["function", "class"] },
        { blankLine: "always", prev: ["function", "class"], next: "*" },
      ],
      "max-lines": ["error", { max: 300, skipBlankLines: true, skipComments: true }],
      "max-lines-per-function": ["error", { max: 100, skipBlankLines: true, skipComments: true }],
      "max-depth": ["error", 4],
      complexity: ["error", 15],
    },
  },
  {
    files: ["src/app/api/**/*.ts"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@app/server/db"],
              message: "API routes should not import prisma directly. Use service layer instead.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["src/shared/config/**/*.ts"],
    rules: {
      "no-magic-numbers": "off",
      "max-lines": ["error", { max: 400, skipBlankLines: true, skipComments: true }],
    },
  },
  {
    files: ["src/providers/theme*.ts"],
    rules: {
      "no-magic-numbers": "off",
    },
  },
  {
    files: [
      "src/app/app/(main)/invoices/new/page.tsx",
      "src/app/app/(main)/recurring/new/page.tsx",
      "src/app/app/(main)/templates/new/page.tsx",
    ],
    rules: {
      "react-hooks/incompatible-library": "off",
    },
  },
  {
    files: [
      "src/app/**/page.tsx",
      "src/app/**/*.tsx",
      "src/features/**/*.tsx",
      "src/shared/**/*.tsx",
    ],
    rules: {
      "max-lines-per-function": ["error", { max: 450, skipBlankLines: true, skipComments: true }],
      complexity: ["error", 50],
    },
  },
  {
    files: ["src/shared/lib/export/pdf.ts"],
    rules: {
      "max-lines-per-function": ["error", { max: 200, skipBlankLines: true, skipComments: true }],
      complexity: ["error", 20],
    },
  },
  {
    files: ["src/**/*.ts", "src/**/*.tsx"],
    ignores: ["src/shared/config/env.ts"],
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector: "MemberExpression[object.name='process'][property.name='env']",
          message: "Use `env` from '@app/shared/config/env' instead of process.env.",
        },
      ],
    },
  },
]);

export default eslintConfig;
