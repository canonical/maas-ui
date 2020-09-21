import React from "react";
import { Route, Switch } from "react-router-dom";

import RSDList from "./RSDList";
import NotFound from "app/base/views/NotFound";

const RSD = (): JSX.Element => {
  return (
    <Switch>
      <Route exact path={["/rsd", "/rsd/add"]}>
        <RSDList />
      </Route>
      <Route path="*">
        <NotFound />
      </Route>
    </Switch>
  );
};

export default RSD;
