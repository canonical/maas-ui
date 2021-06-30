import { useCallback, useEffect, useState } from "react";

import { usePrevious } from "@canonical/react-components/dist/hooks";
import { Route, Switch, useHistory, useLocation } from "react-router-dom";

import MachineListHeader from "./MachineList/MachineListHeader";
import type { MachineSelectedAction } from "./types";

import Section from "app/base/components/Section";
import NotFound from "app/base/views/NotFound";
import machineURLs from "app/machines/urls";
import AddChassisForm from "app/machines/views/AddChassis/AddChassisForm";
import AddMachineForm from "app/machines/views/AddMachine/AddMachineForm";
import MachineList from "app/machines/views/MachineList";
import poolsURLs from "app/pools/urls";
import PoolAdd from "app/pools/views/PoolAdd";
import PoolEdit from "app/pools/views/PoolEdit";
import Pools from "app/pools/views/Pools";
import { FilterMachines } from "app/store/machine/utils";

const Machines = (): JSX.Element => {
  const history = useHistory();
  const location = useLocation();
  const currentFilters = FilterMachines.queryStringToFilters(location.search);
  // The filter state is initialised from the URL.
  const [searchFilter, setFilter] = useState(
    FilterMachines.filtersToString(currentFilters)
  );
  const [selectedAction, setSelectedAction] =
    useState<MachineSelectedAction | null>(null);
  const previousPath = usePrevious(location.pathname);
  const previousHasSelectedAction = usePrevious(!!selectedAction);

  const setSearchFilter = useCallback(
    (searchText) => {
      setFilter(searchText);
      const filters = FilterMachines.getCurrentFilters(searchText);
      history.push({ search: FilterMachines.filtersToQueryString(filters) });
    },
    [history, setFilter]
  );

  useEffect(() => {
    // When the page changes (e.g. /pools -> /machines) then update the filters.
    if (location.pathname !== previousPath) {
      setFilter(FilterMachines.filtersToString(currentFilters));
    }
  }, [location.pathname, currentFilters, previousPath]);

  useEffect(() => {
    const hasSelectedAction = !!selectedAction;
    if (hasSelectedAction !== previousHasSelectedAction) {
      const filters = FilterMachines.getCurrentFilters(searchFilter);
      const newFilters = FilterMachines.toggleFilter(
        filters,
        "in",
        "selected",
        false,
        !!hasSelectedAction
      );
      setSearchFilter(FilterMachines.filtersToString(newFilters));
    }
  }, [
    searchFilter,
    selectedAction,
    setSearchFilter,
    previousHasSelectedAction,
  ]);

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
        <Route exact path={machineURLs.machines.index}>
          <MachineList
            headerFormOpen={!!selectedAction}
            searchFilter={searchFilter}
            setSearchFilter={setSearchFilter}
          />
        </Route>
        <Route exact path={machineURLs.machines.add}>
          <AddMachineForm />
        </Route>
        <Route exact path={machineURLs.machines.chassis.add}>
          <AddChassisForm />
        </Route>
        <Route exact path={poolsURLs.pools}>
          <Pools />
        </Route>
        <Route exact path={poolsURLs.add}>
          <PoolAdd />
        </Route>
        <Route exact path={poolsURLs.edit(null, true)}>
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
