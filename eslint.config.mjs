import js from "@eslint/js";
import globals from "globals";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsparser from "@typescript-eslint/parser";
import solidPlugin from "eslint-plugin-solid";
import tsdocPlugin from "eslint-plugin-tsdoc";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,tsx}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: {
      globals: globals.browser,
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 2021,
        sourceType: "module",
        ecmaFeatures: { jsx: true },
      },
    },
  },

  {
    files: ["**/*.{ts,mts,cts,tsx}"],
    plugins: { "@typescript-eslint": tseslint },
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 2021,
        sourceType: "module",
        ecmaFeatures: { jsx: true },
      },
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      // TypeScript already reports undefined names, and `no-undef` does not
      // know DOM types such as `EventListener`.
      "no-undef": "off",
    },
  },

  {
    files: ["**/*.{tsx,ts}"],
    plugins: { solid: solidPlugin },
    rules: {
      "solid/reactivity": "warn",
      "solid/jsx-no-undef": "error",
    },
  },

  {
    files: ["**/*.{tsx,ts}"],
    plugins: { tsdoc: tsdocPlugin },
    rules: {
      "tsdoc/syntax": "warn",
    },
  },
]);
