/* eslint-disable no-unused-vars */
/* eslint-disable func-names */
import { registerApplication, start } from "single-spa";

function showWhenAnyOf(routes) {
  return function (location) {
    return routes.some((route) => location.pathname === route);
  };
}

function showWhenPrefix(routes) {
  return function (location) {
    return routes.some((route) => location.pathname.startsWith(route));
  };
}

function showExcept(routes) {
  return function (location) {
    return routes.every((route) => location.pathname !== route);
  };
}

registerApplication({
  name: "legacy",
  app: () => import("@maas-ui/maas-ui-legacy"),
  activeWhen: `${process.env.BASENAME}${process.env.ANGULAR_BASENAME}`,
});

registerApplication({
  name: "ui",
  app: () => import("@maas-ui/maas-ui"),
  activeWhen: `${process.env.BASENAME}${process.env.REACT_BASENAME}`,
});

start();
