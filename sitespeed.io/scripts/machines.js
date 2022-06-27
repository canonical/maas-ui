const { constructURL } = require("../utils");

const TIMEOUT = 120000;

module.exports = async (context, commands) => {
  await commands.measure.start("Machine list");
  await commands.navigate(constructURL(context, "/machines"));
  await commands.wait.byXpath("//*[text()='1000 Machines']", TIMEOUT);
  return commands.measure.stop();
};
