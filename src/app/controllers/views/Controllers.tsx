import { Route, Switch } from "react-router-dom";

import ControllerDetails from "./ControllerDetails";
import ControllerList from "./ControllerList";

import { useScrollToTop } from "app/base/hooks";
import urls from "app/base/urls";
import NotFound from "app/base/views/NotFound";

const Controllers = (): JSX.Element => {
  useScrollToTop();

  return (
    <Switch>
      <Route
        exact
        path={urls.controllers.index}
        render={() => <ControllerList />}
      />
      {[
        urls.controllers.controller.commissioning.index(null),
        urls.controllers.controller.commissioning.scriptResult(null),
        urls.controllers.controller.configuration(null),
        urls.controllers.controller.index(null),
        urls.controllers.controller.logs.index(null),
        urls.controllers.controller.logs.events(null),
        urls.controllers.controller.logs.installationOutput(null),
        urls.controllers.controller.network(null),
        urls.controllers.controller.pciDevices(null),
        urls.controllers.controller.storage(null),
        urls.controllers.controller.summary(null),
        urls.controllers.controller.usbDevices(null),
        urls.controllers.controller.vlans(null),
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
