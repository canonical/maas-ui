import { Route, Switch } from "react-router-dom";

import ControllerDetails from "./ControllerDetails";
import ControllerList from "./ControllerList";

import { useScrollToTop } from "app/base/hooks";
import NotFound from "app/base/views/NotFound";
import controllersURLs from "app/controllers/urls";

const Controllers = (): JSX.Element => {
  useScrollToTop();

  return (
    <Switch>
      <Route
        exact
        path={controllersURLs.controllers.index}
        render={() => <ControllerList />}
      />
      {[
        controllersURLs.controller.commissioning.index(null, true),
        controllersURLs.controller.commissioning.scriptResult(null, true),
        controllersURLs.controller.configuration(null, true),
        controllersURLs.controller.index(null, true),
        controllersURLs.controller.logs.index(null, true),
        controllersURLs.controller.logs.events(null, true),
        controllersURLs.controller.logs.installationOutput(null, true),
        controllersURLs.controller.network(null, true),
        controllersURLs.controller.pciDevices(null, true),
        controllersURLs.controller.storage(null, true),
        controllersURLs.controller.summary(null, true),
        controllersURLs.controller.usbDevices(null, true),
        controllersURLs.controller.vlans(null, true),
      ].map((path) => (
        <Route
          // using a single key as a workaround for Controller details pages
          // calling "get" and "setActive" on every route change
          exact
          key="controller-details"
          path={path}
          render={() => <ControllerDetails />}
        />
      ))}
      <Route path="*" render={() => <NotFound />} />
    </Switch>
  );
};

export default Controllers;
