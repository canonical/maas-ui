import React from "react";
import { Route, Switch } from "react-router-dom";

import AddMachine from "app/machines/views/AddMachine";
import AddChassis from "app/machines/views/AddChassis";
import MachineList from "app/machines/views/MachineList";
import NotFound from "app/base/views/NotFound";
import PoolAdd from "app/pools/views/PoolAdd";
import PoolEdit from "app/pools/views/PoolEdit";
import Pools from "app/pools/views/Pools";

const Routes = () => (
  <Switch>
    <Route exact path="/machines" component={MachineList} />
    <Route exact path="/machines/add" component={AddMachine} />
    <Route exact path="/machines/chassis/add" component={AddChassis} />
    <Route exact path="/pools" component={Pools} />
    <Route exact path="/pools/add" component={PoolAdd} />
    <Route exact path="/pools/:id/edit" component={PoolEdit} />
    <Route path="*" component={NotFound} />
  </Switch>
);

export default Routes;
