import React from "react";
import ReactDOM from "react-dom";

import {
  Footer,
  generateBaseURL,
  generateLegacyURL,
  generateNewURL,
  Header,
  navigateToLegacy,
  navigateToNew,
  StatusBar,
} from "@maas-ui/maas-ui-shared";

/* @ngInject */
function MasterController(
  $rootScope,
  $transitions,
  $window,
  $http,
  $cookies,
  ErrorService
) {
  const debug = process.env.NODE_ENV === "development";
  const LOGOUT_API = generateBaseURL("/accounts/logout/");
  $rootScope.legacyURLBase = generateLegacyURL();
  $rootScope.newURLBase = generateNewURL();
  $rootScope.navigateToLegacy = navigateToLegacy;
  $rootScope.navigateToNew = navigateToNew;
  // the skipintro cookie is set by Cypress to make integration testing easier
  const skipIntro = $cookies.get("skipintro");

  const renderHeader = () => {
    const headerNode = document.querySelector("#header");
    if (!headerNode) {
      return;
    }
    const {
      completed_intro,
      current_user,
      uuid,
      version,
    } = $window.CONFIG;
    ReactDOM.render(
      <Header
        authUser={current_user}
        completedIntro={
          (completed_intro && current_user && current_user.completed_intro) ||
          !!skipIntro
        }
        debug={debug}
        enableAnalytics={window.CONFIG.enable_analytics}
        generateNewLink={(link, linkClass, appendNewBase) => (
          <a
            className={linkClass}
            href={generateNewURL(link.url)}
            target="_self"
            onClick={(evt) => {
              navigateToNew(link.url, evt);
            }}
          >
            {link.label}
          </a>
        )}
        generateLegacyLink={(link, linkClass, appendNewBase) => (
          <a className={linkClass} href={generateLegacyURL(link.url)}>
            {link.label}
          </a>
        )}
        location={window.location}
        logout={() => {
          localStorage.clear();
          $http.post(LOGOUT_API).then(() => {
            window.location = generateNewURL();
          });
        }}
        onSkip={() => {
          // Call skip inside this function because skip won't exist when the
          // header is first rendered.
          $rootScope.skip();
        }}
        rootScope={$rootScope}
        uuid={uuid}
        version={version}
      />,
      headerNode
    );
  };

  const renderFooter = () => {
    const footerNode = document.querySelector("#footer");
    if (!footerNode) {
      return;
    }
    ReactDOM.render(
      <Footer
        debug={debug}
        enableAnalytics={$window.CONFIG.enable_analytics}
        version={$window.CONFIG.version}
      />,
      footerNode
    );
  };

  const renderStatusBar = () => {
    const statusBarNode = document.querySelector("#status-bar");
    if (!statusBarNode) {
      return;
    }
    ReactDOM.render(
      <StatusBar
        maasName={$window.CONFIG.maas_name}
        version={$window.CONFIG.version}
      />,
      statusBarNode
    );
  };

  const displayTemplate = () => {
    $rootScope.site = window.CONFIG.maas_name;
    renderHeader();
    renderFooter();
    renderStatusBar();
  };

  $transitions.onStart({}, () => {
    // Clear the error overlay if it exists.
    ErrorService.clearError();
  });

  $transitions.onSuccess({}, () => {
    // Update the header when the route changes.
    renderHeader();
  });

  $rootScope.$watch("title", () => {
    const maasName = window.CONFIG.maas_name;
    const maasNamePart = maasName ? `${maasName} ` : "";
    const titlePart = $rootScope.title ? `${$rootScope.title} | ` : "";
    $window.document.title = `${titlePart}${maasNamePart}MAAS`;
  });

  displayTemplate();
}

export default MasterController;
