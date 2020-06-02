import { registerApplication, start } from "single-spa";

import "./scss/base.scss";

const showLoading = () => {
  const loadingNode = document.querySelector(".root-loading");
  if (loadingNode.classList.contains("u-hide")) {
    loadingNode.classList.remove("u-hide");
  }
};

window.addEventListener("single-spa:before-app-change", (evt) => {
  const {
    legacy = "NOT_MOUNTED",
    ui = "NOT_MOUNTED",
  } = evt.detail.newAppStatuses;
  const uiStylesheet = document.querySelector(".ui-stylesheet");
  const legacyStylesheet = document.querySelector(".legacy-stylesheet");
  if (ui === "MOUNTED") {
    uiStylesheet.disabled = false;
  } else {
    uiStylesheet.disabled = true;
  }
  if (legacy === "MOUNTED") {
    legacyStylesheet.disabled = false;
  } else {
    legacyStylesheet.disabled = true;
  }
});

registerApplication({
  name: "legacy",
  app: () => {
    showLoading();
    return import("@maas-ui/maas-ui-legacy");
  },
  activeWhen: (location) =>
    location.pathname.startsWith(
      `${process.env.BASENAME}${process.env.ANGULAR_BASENAME}`
    ) || location.hash.startsWith("#"),
});

registerApplication({
  name: "ui",
  app: () => {
    showLoading();
    return import("@maas-ui/maas-ui");
  },
  activeWhen: `${process.env.BASENAME}${process.env.REACT_BASENAME}`,
});

start();
