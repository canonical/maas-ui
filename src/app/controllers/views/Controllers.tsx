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
        path={controllersURLs.index}
        render={() => <ControllerList />}
      />
      {[
        controllersURLs.controller.commissioning.index(null),
        controllersURLs.controller.commissioning.scriptResult(null),
        controllersURLs.controller.configuration(null),
        controllersURLs.controller.index(null),
        controllersURLs.controller.logs.index(null),
        controllersURLs.controller.logs.events(null),
        controllersURLs.controller.logs.installationOutput(null),
        controllersURLs.controller.network(null),
        controllersURLs.controller.pciDevices(null),
        controllersURLs.controller.storage(null),
        controllersURLs.controller.summary(null),
        controllersURLs.controller.usbDevices(null),
        controllersURLs.controller.vlans(null),
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
