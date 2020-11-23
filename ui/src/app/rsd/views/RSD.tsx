import React from "react";

import { Route, Switch } from "react-router-dom";

import RSDDetails from "./RSDDetails";
import RSDList from "./RSDList";

import NotFound from "app/base/views/NotFound";

const RSD = (): JSX.Element => {
  return (
    <Switch>
      <Route exact path={["/rsd", "/rsd/add"]}>
        <RSDList />
      </Route>
      <Route exact path={["/rsd/:id", "/rsd/:id/edit"]}>
        <RSDDetails />
      </Route>
      <Route path="*">
        <NotFound />
      </Route>
    </Switch>
  );
};

export default RSD;
