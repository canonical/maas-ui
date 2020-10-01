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
} from "@maas-ui/maas-ui-shared";

/* @ngInject */
function MasterController(
  $rootScope,
  $transitions,
  $window,
  $http,
  ErrorService
) {
  const debug = process.env.NODE_ENV === "development";
  const LOGOUT_API = generateBaseURL("/accounts/logout/");
  $rootScope.legacyURLBase = generateLegacyURL();
  $rootScope.newURLBase = generateNewURL();
  $rootScope.navigateToLegacy = navigateToLegacy;
  $rootScope.navigateToNew = navigateToNew;

  const renderHeader = () => {
    const headerNode = document.querySelector("#header");
    if (!headerNode) {
      return;
    }
    const {
      completed_intro,
      navigation_options,
      current_user,
      uuid,
      version,
    } = $window.CONFIG;
    ReactDOM.render(
      <Header
        authUser={current_user}
        completedIntro={
          completed_intro && current_user && current_user.completed_intro
        }
        debug={debug}
        enableAnalytics={window.CONFIG.enable_analytics}
        generateNewLink={(link, linkClass, appendNewBase) => (
          <a
            className={linkClass}
            href={link.url}
            target="_self"
            onClick={(evt) => {
              navigateToNew(link.url, evt);
            }}
          >
            {link.label}
          </a>
        )}
        generateLegacyLink={(link, linkClass, appendNewBase) => (
          <a
            className={linkClass}
            href={generateLegacyURL(link.url)}
            onClick={(evt) => {
              evt.preventDefault();
            }}
          >
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
        showRSD={navigation_options && navigation_options.rsd}
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
        maasName={$window.CONFIG.maas_name}
        version={$window.CONFIG.version}
      />,
      footerNode
    );
  };

  const displayTemplate = () => {
    $rootScope.site = window.CONFIG.maas_name;
    renderHeader();
    renderFooter();
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
