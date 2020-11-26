import { usePrevious } from "@canonical/react-components/dist/hooks";
import React, { useEffect, useState } from "react";
import { Route, Switch, useHistory, useLocation } from "react-router-dom";

import {
  filtersToQueryString,
  filtersToString,
  getCurrentFilters,
  queryStringToFilters,
} from "app/machines/search";
import AddChassisForm from "app/machines/views/AddChassis/AddChassisForm";
import AddMachineForm from "app/machines/views/AddMachine/AddMachineForm";
import AddRSDForm from "app/machines/views/AddRSD/AddRSDForm";
import MachineList from "app/machines/views/MachineList";
import MachineListHeader from "./MachineList/MachineListHeader";
import NotFound from "app/base/views/NotFound";
import PoolAdd from "app/pools/views/PoolAdd";
import PoolEdit from "app/pools/views/PoolEdit";
import Pools from "app/pools/views/Pools";
import Section from "app/base/components/Section";

const Machines = () => {
  const history = useHistory();
  const location = useLocation();
  const currentFilters = queryStringToFilters(location.search);
  // The filter state is initialised from the URL.
  const [searchFilter, setFilter] = useState(filtersToString(currentFilters));
  const [selectedAction, setSelectedAction] = useState();

  const setSearchFilter = (searchText) => {
    setFilter(searchText);
    const filters = getCurrentFilters(searchText);
    history.push({ search: filtersToQueryString(filters) });
  };

  const previousPath = usePrevious(location.pathname);

  useEffect(() => {
    // When the page changes (e.g. /pools -> /machines) then update the filters.
    if (location.pathname !== previousPath) {
      setFilter(filtersToString(currentFilters));
    }
  }, [location.pathname, currentFilters, previousPath]);

  return (
    <Section
      headerClassName="u-no-padding--bottom"
      header={
        <MachineListHeader
          searchFilter={searchFilter}
          selectedAction={selectedAction}
          setSearchFilter={setSearchFilter}
          setSelectedAction={setSelectedAction}
        />
      }
    >
      <Switch>
        <Route exact path="/machines">
          <MachineList
            headerFormOpen={!!selectedAction}
            searchFilter={searchFilter}
            setSearchFilter={setSearchFilter}
          />
        </Route>
        <Route exact path="/machines/add">
          <AddMachineForm />
        </Route>
        <Route exact path="/machines/chassis/add">
          <AddChassisForm />
        </Route>
        <Route exact path="/machines/rsd/add">
          <AddRSDForm />
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
