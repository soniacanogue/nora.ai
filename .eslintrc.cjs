/* eslint-env node */
/** @type {import('eslint').Linter.Config} */
module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
  ],
  plugins: ["import", "react"],
  rules: {
    "import/no-unresolved": ["error", { "commonjs": true, "caseSensitive": false }],
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off"
  },
  settings: {
    "import/resolver": {
      "node": { "extensions": [".js", ".jsx", ".ts", ".tsx"] }
    },
    react: { version: "detect" }
  },
  "paths": {
    "@/*": ["./src/*"],
    "src/*": ["./src/*"]
  },
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: "module",
    ecmaFeatures: { jsx: true },
  },
};
