import js from "eslint/js";

export default [
  {
    ignores: ["node_modules/**", "dist/**", "coverage/**", "src/utils/mockData.js"],
  },
  js.configs.recommended,
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        process: "readonly",
        console: "readonly",
        Buffer: "readonly",
        __dirname: "readonly",
        setTimeout: "readonly",
        URL: "readonly",
      },
    },
    rules: {
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
      "no-console": "off",
    },
  },
  {
    files: ["**/tests/**/*.js", "**/*.test.js"],
    languageOptions: {
      globals: { process: "readonly", console: "readonly" },
    },
  },
];
