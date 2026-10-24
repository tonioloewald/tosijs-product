import js from "@eslint/js";
import tseslint from "typescript-eslint";
import globals from "globals";

// Ported from the legacy .eslintrc.json, which ESLint 9+ ignores (board #3481).
export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: { ...globals.browser, ...globals.node },
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      // `export interface TosiFoo extends ComponentAttrs<typeof TosiFoo.initAttributes> {}`
      // merged onto the class is how every component types its attributes. It is deliberate,
      // and the empty body is the point: the members come from the supertype.
      "@typescript-eslint/no-unsafe-declaration-merging": "off",
      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
    },
  },
  // Generated or vendored output: `tosijs-format` lints `.`, so scope lives here.
  {
    ignores: [
      "dist/",
      "docs/",
      "node_modules/",
      "tls/",
      "llms.txt",
      "happydom.ts",
    ],
  },
);
