module.exports = {
  plugins: ["react"],
  rules: {
    "react/forbid-component-props": [
      "warn",
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
      "warn",
      {
        forbid: [
          {
            propName: "data-test",
            message: "Use `data-testid` instead of `data-test` attribute",
          },
        ],
      },
    ],
  },
};
