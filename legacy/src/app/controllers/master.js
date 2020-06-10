import React from "react";
import ReactDOM from "react-dom";

import { Footer, Header } from "@maas-ui/maas-ui-shared";

/* @ngInject */
function MasterController($rootScope, $transitions, $window, $http, ErrorService) {
  const debug = process.env.NODE_ENV === "development";
  const LOGOUT_API = `${process.env.BASENAME}/accounts/logout/`;
  $rootScope.legacyURLBase = `${process.env.BASENAME}${process.env.ANGULAR_BASENAME}`;
  $rootScope.newURLBase = `${process.env.BASENAME}${process.env.REACT_BASENAME}`;
  $rootScope.navigateToLegacy = (route) => {
    window.history.pushState(null, null, `${$rootScope.legacyURLBase}${route}`);
  };
  $rootScope.navigateToNew = (route) => {
    window.history.pushState(null, null, `${$rootScope.newURLBase}${route}`);
  };

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
        basename={process.env.BASENAME}
        completedIntro={
          completed_intro && current_user && current_user.completed_intro
        }
        debug={debug}
        enableAnalytics={window.CONFIG.enable_analytics}
        location={window.location}
        logout={() => {
          localStorage.clear();
          $http.post(LOGOUT_API).then(() => {
            $rootScope.navigateToNew("/");
          });
        }}
        newURLPrefix={process.env.REACT_BASENAME}
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
        maasName={$window.CONFIG.maas_name}
        version={$window.CONFIG.version}
      />,
      footerNode
    );
  };

  const displayTemplate = () => {
    const loadingNode = document.querySelector(".root-loading");
    if (!loadingNode.classList.contains("u-hide")) {
      loadingNode.classList.add("u-hide");
    }
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
