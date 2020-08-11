import { generateLegacyURL, generateNewURL } from "@maas-ui/maas-ui-shared";
import { registerApplication, start } from "single-spa";
import { name as appName, version as appVersion } from "../../ui/package.json";

import "./scss/base.scss";

const showLoading = () => {
  const loadingNode = document.querySelector(".root-loading");
  if (loadingNode.classList.contains("u-hide")) {
    loadingNode.classList.remove("u-hide");
  }
};

console.info(`${appName} ${appVersion} (${process.env.GIT_SHA}).`);

window.addEventListener("single-spa:before-app-change", (evt) => {
  const { legacy, ui } = evt.detail.newAppStatuses;
  const uiStylesheet = document.querySelector(".ui-stylesheet");
  const legacyStylesheet = document.querySelector(".legacy-stylesheet");
  if (uiStylesheet) {
    if (ui === "MOUNTED") {
      uiStylesheet.disabled = false;
    } else if (ui === "NOT_MOUNTED") {
      uiStylesheet.disabled = true;
    }
  }
  if (legacyStylesheet) {
    if (legacy === "MOUNTED") {
      legacyStylesheet.disabled = false;
    } else if (legacy === "NOT_MOUNTED") {
      legacyStylesheet.disabled = true;
    }
  }
});

registerApplication({
  name: "legacy",
  app: () => {
    showLoading();
    return import("@maas-ui/maas-ui-legacy");
  },
  activeWhen: (location) =>
    location.pathname.startsWith(generateLegacyURL()) ||
    location.hash.startsWith("#"),
});

registerApplication({
  name: "ui",
  app: () => {
    showLoading();
    return import("@maas-ui/maas-ui");
  },
  activeWhen: (location) =>
    location.pathname.startsWith(generateNewURL()) &&
    !location.hash.startsWith("#"),
});

start();
