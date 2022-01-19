import { Route, Switch } from "react-router-dom";

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
      <Route path="*" render={() => <NotFound />} />
    </Switch>
  );
};

export default Controllers;
