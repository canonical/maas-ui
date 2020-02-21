import React, { useState } from "react";
import { Route, Switch } from "react-router-dom";

import AddMachineForm from "app/machines/views/AddMachine/AddMachineForm";
import AddChassis from "app/machines/views/AddChassis";
import MachineList from "app/machines/views/MachineList";
import NotFound from "app/base/views/NotFound";
import PoolAdd from "app/pools/views/PoolAdd";
import PoolEdit from "app/pools/views/PoolEdit";
import Pools from "app/pools/views/Pools";
import HeaderStrip from "app/machines/components/HeaderStrip";
import Section from "app/base/components/Section";

const Machines = () => {
  const [selectedMachines, setSelectedMachines] = useState([]);

  return (
    <Section
      headerClassName="u-no-padding--bottom"
      title={
        <HeaderStrip
          selectedMachines={selectedMachines}
          setSelectedMachines={setSelectedMachines}
        />
      }
    >
      <Switch>
        <Route exact path="/machines">
          <MachineList
            selectedMachines={selectedMachines}
            setSelectedMachines={setSelectedMachines}
          />
        </Route>
        <Route exact path="/machines/add">
          <AddMachineForm />
        </Route>
        <Route exact path="/machines/chassis/add">
          <AddChassis />
        </Route>
        <Route exact path="/pools">
          <Pools />
        </Route>
        <Route exact path="/pools/add">
          <PoolAdd />
        </Route>
        <Route exact path="/pools/:id/edit">
          <PoolEdit />
        </Route>
        <Route path="*">
          <NotFound />
        </Route>
      </Switch>
    </Section>
  );
};

export default Machines;
