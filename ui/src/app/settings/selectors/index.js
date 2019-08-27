import config from "./config";
import dhcpsnippet from "./dhcpsnippet";
import general from "./general";
import repositories from "./repositories";
import subnet from "./subnet";
import users from "./users";

export const selectors = {
  config,
  dhcpsnippet,
  general,
  repositories,
  subnet,
  users
};

export default selectors;
