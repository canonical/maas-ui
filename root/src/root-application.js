import { registerApplication, start } from "single-spa";

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
