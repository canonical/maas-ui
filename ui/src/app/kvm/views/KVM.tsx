import React from "react";
import { Route, Switch } from "react-router-dom";

import KVMDetails from "./KVMDetails";
import KVMList from "./KVMList";

import NotFound from "app/base/views/NotFound";

const KVM = (): JSX.Element => {
  return (
    <Switch>
      <Route exact path={["/kvm", "/kvm/add"]}>
        <KVMList />
      </Route>
      <Route exact path={["/kvm/:id", "/kvm/:id/edit"]}>
        <KVMDetails />
      </Route>
      <Route path="*">
        <NotFound />
      </Route>
    </Switch>
  );
};

export default KVM;
