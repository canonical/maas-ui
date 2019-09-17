import React from "react";
import { Route, Switch } from "react-router-dom";

import { useRouter } from "app/base/hooks";
import MachineList from "app/machines/views/MachineList";

const Routes = () => {
  const { match } = useRouter();
  return (
    <Switch>
      <Route exact path={`${match.path}/`} component={MachineList} />
    </Switch>
  );
};

export default Routes;
