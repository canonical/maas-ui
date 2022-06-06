import { Route, Switch } from "react-router-dom";

import ControllerDetails from "./ControllerDetails";
import ControllerList from "./ControllerList";

import NotFound from "app/base/views/NotFound";
import controllersURLs from "app/controllers/urls";

const Controllers = (): JSX.Element => {
  return (
    <Switch>
      <Route
        exact
        path={controllersURLs.controllers.index}
        render={() => <ControllerList />}
      />
      {[
        controllersURLs.controller.commissioning(null, true),
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
        <Route exact path={path} render={() => <ControllerDetails />} />
      ))}
      <Route path="*" render={() => <NotFound />} />
    </Switch>
  );
};

export default Controllers;
