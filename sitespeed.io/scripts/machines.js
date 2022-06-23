const fetchMachines = async (context, commands) => {
  await commands.measure.start("Fetch machines with cold cache");
  await commands.navigate(`${context.options.hostname}/MAAS/r/machines`);
  await commands.wait.byXpath("//*[text()='1000 Machines']", 30000);
  return commands.measure.stop();
};

const fetchMachinesWarm = async (context, commands) => {
  await commands.navigate(`${context.options.hostname}/MAAS/r/settings`);
  await commands.wait.bySelector(".p-side-navigation", 5000);
  const stopWatch = commands.stopWatch.get("Fetch machines with warm cache");
  await commands.click.byLinkText("Machines");
  await commands.wait.byXpath("//*[text()='1000 Machines']", 30000);
  stopWatch.stopAndAdd();
};

const fetchMachinesHot = async (context, commands) => {
  await commands.navigate(`${context.options.hostname}/MAAS/r/machines`);
  await commands.wait.byXpath("//*[text()='1000 Machines']", 30000);
  await commands.click.byLinkText("Settings");
  await commands.wait.bySelector(".p-side-navigation", 2000);
  const stopWatch = commands.stopWatch.get("Fetch machines with hot cache");
  await commands.click.byLinkText("Machines");
  await commands.wait.byXpath("//*[text()='1000 Machines']", 30000);
  stopWatch.stopAndAdd();
};

module.exports = async (context, commands) => {
  await fetchMachines(context, commands);
  await fetchMachinesWarm(context, commands);
  return fetchMachinesHot(context, commands);
};
