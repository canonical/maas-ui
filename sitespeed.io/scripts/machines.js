const { constructURL } = require("../utils");

const TIMEOUT = 120000;

const coldCache = async (context, commands) => {
  await commands.cache.clearKeepCookies();
  await commands.measure.start("Machine list - cold cache");
  await commands.navigate(constructURL(context, "/machines"));
  await commands.wait.byXpath("//*[text()='1000 Machines']", TIMEOUT);
  return commands.measure.stop();
};

const warmCache = async (context, commands) => {
  await commands.navigate(constructURL(context, "/machines"));
  await commands.measure.start("Machine list - warm cache");
  await commands.navigate(constructURL(context, "/machines"));
  await commands.wait.byXpath("//*[text()='1000 Machines']", TIMEOUT);
  return commands.measure.stop();
};

module.exports = async (context, commands) => {
  await coldCache(context, commands);
  return warmCache(context, commands);
};
