const fetchMachines = async (context, commands) => {
  await commands.measure.start("Fetch machines with cold cache");
  await commands.navigate(`${context.options.hostname}/MAAS/r/machines`);
  await commands.wait.byXpath("//*[text()='1000 Machines']", 10000);
  return commands.measure.stop();
};

const fetchMachinesWarm = async (context, commands) => {
  await commands.navigate(`${context.options.hostname}/MAAS/r/settings`);
  await commands.measure.start("Fetch machines with warm cache");
  await commands.click.byLinkText("Machines");
  await commands.wait.byXpath("//*[text()='1000 Machines']", 10000);
  return commands.measure.stop();
};

const fetchMachinesHot = async (context, commands) => {
  await commands.navigate(`${context.options.hostname}/MAAS/r/machines`);
  await commands.wait.byXpath("//*[text()='1000 Machines']", 10000);
  await commands.click.byLinkText("Settings");
  await commands.measure.start("Fetch machines with hot cache");
  await commands.click.byLinkText("Machines");
  await commands.wait.byXpath("//*[text()='1000 Machines']", 10000);
  return commands.measure.stop();
};

module.exports = async (context, commands) => {
  await fetchMachines(context, commands);
  await fetchMachinesWarm(context, commands);
  return fetchMachinesHot(context, commands);
};
