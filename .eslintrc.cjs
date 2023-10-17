module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "standard",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
    "plugin:react/jsx-runtime",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["react", "@typescript-eslint", "react-hooks"],
  settings: {
    react: {
      version: "detect",
    },
  },
  rules: {
    "no-use-before-define": 0,
    "dot-notation": 0,
    "n/handle-callback-err": 0,
    "@typescript-eslint/no-explicit-any": 0,
    "@typescript-eslint/no-empty-interface": 0,
    "max-len": ["error", { code: 100, tabWidth: 2, ignoreStrings: true, ignoreComments: true }],
  },
};
