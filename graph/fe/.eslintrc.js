module.exports = {
  extends: ["airbnb", "prettier", "prettier/react"],
  plugins: ["react", "prettier"],
  rules: {
    "react/jsx-filename-extension": 0,
    "jsx-a11y/anchor-is-valid": [
      "error",
      {
        components: ["Link"],
        specialLink: [],
        specialLink: ["to"],
        aspects: ["noHref", "invalidHref", "preferButton"]
      }
    ],
    "prettier/prettier": ["error", { singleQuote: true }],
    "import/no-extraneous-dependencies": ["error", { devDependencies: true }]
  },
  "globals": {
    "it": true,
    "document": true
  }
};
