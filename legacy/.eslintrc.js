module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
    jest: true,
  },
  extends: ["eslint:recommended", "plugin:react/recommended"],
  globals: {
    __dirname: false,
    $: false,
    afterEach: false,
    angular: false,
    Atomics: "readonly",
    beforeEach: false,
    describe: false,
    expect: false,
    inject: false,
    it: false,
    jasmine: false,
    jest: false,
    CONFIG: false,
    module: false,
    require: false,
    setTimeout: false,
    SharedArrayBuffer: "readonly",
    spyOn: false,
  },
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
  },
  plugins: ["react"],
  rules: {
    "no-unused-vars": [2, { args: "none" }],
  },
  settings: {
    react: {
      version: "detect",
    },
  },
};
