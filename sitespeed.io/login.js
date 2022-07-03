const { constructURL } = require("./utils");

const TIMEOUT = 5000;

module.exports = async function (context, commands) {
  await commands.cdp.send("Network.setCookie", {
    domain: context.options.domain,
    name: "skipsetupintro",
    value: "true",
  });
  await commands.cdp.send("Network.setCookie", {
    domain: context.options.domain,
    name: "skipintro",
    value: "true",
  });
  await commands.navigate(constructURL(context, "/dashboard"));
  await commands.wait.bySelector("input[name='username']", TIMEOUT);
  await commands.addText.byName("admin", "username");
  await commands.addText.byName("test", "password");
  await commands.click.bySelector("button.p-button--positive");
  await commands.wait.bySelector(
    "[data-testid='section-header-title-spinner']",
    TIMEOUT
  );
  await commands.wait.byXpath("//header//a[text()='admin']");
};
