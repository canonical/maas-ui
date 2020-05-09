/* eslint-disable no-unused-vars */
/* eslint-disable func-names */
import { registerApplication, setBootstrapMaxTime, start } from "single-spa";

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

setBootstrapMaxTime(3000, true, 10000);

registerApplication({
  name: "legacy",
  app: () => import("@maas-ui/maas-ui-legacy"),
  activeWhen: "/MAAS/",
});

start();
