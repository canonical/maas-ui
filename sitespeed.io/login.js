module.exports = async function (context, commands) {
  await commands.cdp.send("Network.setCookie", {
    domain: "localhost",
    name: "skipsetupintro",
    value: "true",
  });
  await commands.cdp.send("Network.setCookie", {
    domain: "localhost",
    name: "skipintro",
    value: "true",
  });
  await commands.navigate(`${context.options.hostname}/MAAS/r/machines`);
  await commands.wait.bySelector("input[name='username']", 5000);
  await commands.addText.byName("admin", "username");
  await commands.addText.byName("test", "password");
  await commands.click.bySelector("button.p-button--positive");
  return commands.wait.bySelector(
    "[data-testid='section-header-title-spinner']",
    5000
  );
};
