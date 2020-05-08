/* eslint-disable no-unused-vars */
/* eslint-disable func-names */
/* global window legacyApp */
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
  activeWhen: "/MAAS/",
});

start();
