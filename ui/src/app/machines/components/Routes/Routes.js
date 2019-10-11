import React from "react";
import { Route, Switch } from "react-router-dom";

import { useRouter } from "app/base/hooks";
import MachineList from "app/machines/views/MachineList";
import NotFound from "app/base/views/NotFound";

const Routes = () => {
  const { match } = useRouter();
  return (
    <Switch>
      <Route exact path={`${match.path}/`} component={MachineList} />
      <Route path="*" component={NotFound} />
    </Switch>
  );
};

export default Routes;
