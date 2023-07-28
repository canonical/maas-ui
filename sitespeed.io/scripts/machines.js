const { constructURL } = require("../utils");

const TIMEOUT = 120000;
const allMachinesLoaded = "//h1[text()[normalize-space() = '1000']]";

const coldCache = async (context, commands) => {
  await commands.cache.clearKeepCookies();
  await commands.measure.start("Machine list - cold cache");
  await commands.navigate(constructURL(context, "/machines"));
  await commands.wait.byXpath(allMachinesLoaded, TIMEOUT);
  return commands.measure.stop();
};

const warmCache = async (context, commands) => {
  await commands.navigate(constructURL(context, "/machines"));
  await commands.measure.start("Machine list - warm cache");
  await commands.navigate(constructURL(context, "/machines"));
  await commands.wait.byXpath(allMachinesLoaded, TIMEOUT);
  return commands.measure.stop();
};

const customPageSize = async (context, commands, pageSize) => {
  // set group by to none
  await commands.js.run(`window.localStorage.setItem("grouping", '""')`);
  // set custom machine list page size
  await commands.js.run(
    `window.localStorage.setItem("machineListPageSize", ${pageSize})`
  );
  await commands.measure.start(`Machine list - ${pageSize} per page`);
  await commands.navigate(constructURL(context, "/machines"));
  await commands.wait.byCondition(
    `document.querySelectorAll('table[aria-label=\"Machines\"] tbody tr').length === ${pageSize}`,
    TIMEOUT
  );
  return commands.measure.stop();
};

module.exports = async (context, commands) => {
  await coldCache(context, commands);
  await warmCache(context, commands);
  await customPageSize(context, commands, 10);
  await customPageSize(context, commands, 20);
  await customPageSize(context, commands, 50);
  await customPageSize(context, commands, 100);
  return customPageSize(context, commands, 200);
};
