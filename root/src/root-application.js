import { generateLegacyURL, generateNewURL } from "@maas-ui/maas-ui-shared";
import {
  addErrorHandler,
  getAppStatus,
  registerApplication,
  setBootstrapMaxTime,
  setMountMaxTime,
  start,
} from "single-spa";
import { name as appName, version as appVersion } from "../../ui/package.json";

import "./scss/base.scss";

const showElement = (className, show) => {
  const element = document.querySelector(className);
  if (show && element.classList.contains("u-hide")) {
    element.classList.remove("u-hide");
  } else if (!show && !element.classList.contains("u-hide")) {
    element.classList.add("u-hide");
  }
};

const showRoot = (show) => {
  showElement(".root", show);
};

const showLoading = (show) => {
  showRoot(show);
  showElement(".root-loading", show);
};

const showError = (show) => {
  showLoading(false);
  showRoot(show);
  showElement(".root-error", show);
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

window.addEventListener("single-spa:app-change", (evt) => {
  if (evt.detail.appsByNewStatus.MOUNTED.length > 0) {
    showLoading(false);
    showError(false);
  }
});

// Don't display an error or warning about slow bootstrap/mount unless it takes
// more than 30 seconds.
setBootstrapMaxTime(30000, false, 30000);
setMountMaxTime(30000, false, 30000);

addErrorHandler((err) => {
  showError(true);
  console.error(
    "App",
    err.appOrParcelName,
    "failed with status:",
    getAppStatus(err.appOrParcelName)
  );
  console.error(err);
});

registerApplication({
  name: "legacy",
  app: () => {
    showLoading(true);
    return import("@maas-ui/maas-ui-legacy");
  },
  activeWhen: (location) =>
    location.pathname.startsWith(generateLegacyURL()) ||
    location.hash.startsWith("#"),
});

registerApplication({
  name: "ui",
  app: () => {
    showLoading(true);
    return import("@maas-ui/maas-ui");
  },
  activeWhen: (location) =>
    location.pathname.startsWith(generateNewURL()) &&
    !location.hash.startsWith("#"),
});

start();
