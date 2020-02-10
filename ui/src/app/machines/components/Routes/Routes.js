import React from "react";
import { Route, Switch } from "react-router-dom";

import MachineList from "app/machines/views/MachineList";
import NotFound from "app/base/views/NotFound";
import Pools from "app/pools/views/Pools";
import PoolAdd from "app/pools/views/PoolAdd";

const Routes = () => {
  return (
    <Switch>
      <Route exact path="/machines" component={MachineList} />
      <Route exact path="/pools" component={Pools} />
      <Route exact path="/pools/add" component={PoolAdd} />
      <Route path="*" component={NotFound} />
    </Switch>
  );
};

export default Routes;
