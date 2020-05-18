import React from "react";
import ReactDOM from "react-dom";

import { Footer, Header } from "@maas-ui/maas-ui-shared";

/* @ngInject */
function MasterController($rootScope, $transitions, $window, $http) {
  const debug = process.env.NODE_ENV === "development";
  const LOGOUT_API = `${process.env.BASENAME}/accounts/logout/`;

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
            $window.location.href = `${process.env.BASENAME}${process.env.REACT_BASENAME}`;
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
    $rootScope.site = window.CONFIG.maas_name;
    renderHeader();
    renderFooter();
  };

  $transitions.onSuccess({}, () => {
    // Update the header when the route changes.
    renderHeader();
  });

  displayTemplate();
}

export default MasterController;
