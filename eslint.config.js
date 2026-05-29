const { FlatCompat } = require("@eslint/eslintrc");

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

module.exports = [
  {
    ignores: ["build/**"],
  },
  ...compat.extends("universe/native", "universe/web"),
  {
    rules: {
      "node/handle-callback-err": "off",
    },
  },
];
