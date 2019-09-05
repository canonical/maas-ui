import config from "./config";
import dhcpsnippet from "./dhcpsnippet";
import general from "./general";
import repositories from "./repositories";
import scripts from "./scripts";
import subnet from "./subnet";
import users from "./users";

export const selectors = {
  config,
  dhcpsnippet,
  general,
  repositories,
  scripts,
  subnet,
  users
};

export default selectors;
