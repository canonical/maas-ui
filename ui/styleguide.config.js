const webpackConfig = require("react-scripts/config/webpack.config");

webpackConfig.devServer = { disableHostCheck: true };

module.exports = {
  components: "src/app/base/components/**/[A-Z]*.js",
  exampleMode: "expand",
  ignore: ["src/app/base/components/**/*.test.js"],
  pagePerSection: true,
  skipComponentsWithoutExample: true,
  styles: {
    "grid-demo [class*='col-']": {
      background: "rgba(199,22,43,0.1)"
    }
  },
  template: {
    head: {
      links: [
        {
          rel: "stylesheet",
          href:
            "https://assets.ubuntu.com/v1/vanilla-framework-version-2.3.0.min.css"
        }
      ]
    }
  },
  title: "Vanilla React components",
  usageMode: "expand",
  webpackConfig
};
