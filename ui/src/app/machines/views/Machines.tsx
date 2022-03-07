import { useCallback, useEffect, useState } from "react";

import { usePrevious } from "@canonical/react-components/dist/hooks";
import { Route, Switch, useHistory, useLocation } from "react-router-dom";

import MachineListHeader from "./MachineList/MachineListHeader";

import Section from "app/base/components/Section";
import NotFound from "app/base/views/NotFound";
import type { MachineHeaderContent } from "app/machines/types";
import machineURLs from "app/machines/urls";
import MachineList from "app/machines/views/MachineList";
import { FilterMachines } from "app/store/machine/utils";

const Machines = (): JSX.Element => {
  const history = useHistory();
  const location = useLocation();
  const currentFilters = FilterMachines.queryStringToFilters(location.search);
  // The filter state is initialised from the URL.
  const [searchFilter, setFilter] = useState(
    FilterMachines.filtersToString(currentFilters)
  );
  const [headerContent, setHeaderContent] =
    useState<MachineHeaderContent | null>(null);
  const actionSelected = headerContent?.view[0] === "machineActionForm";
  const previousActionSelected = usePrevious(actionSelected);

  const setSearchFilter = useCallback(
    (searchText) => {
      setFilter(searchText);
      const filters = FilterMachines.getCurrentFilters(searchText);
      history.push({ search: FilterMachines.filtersToQueryString(filters) });
    },
    [history, setFilter]
  );

  useEffect(() => {
    if (actionSelected !== previousActionSelected) {
      const filters = FilterMachines.getCurrentFilters(searchFilter);
      const newFilters = FilterMachines.toggleFilter(
        filters,
        "in",
        "selected",
        false,
        actionSelected
      );
      setSearchFilter(FilterMachines.filtersToString(newFilters));
    }
  }, [actionSelected, previousActionSelected, searchFilter, setSearchFilter]);

  return (
    <Section
      header={
        <MachineListHeader
          headerContent={headerContent}
          setSearchFilter={setSearchFilter}
          setHeaderContent={setHeaderContent}
        />
      }
    >
      <Switch>
        <Route
          exact
          path={machineURLs.machines.index}
          render={() => (
            <MachineList
              headerFormOpen={!!headerContent}
              searchFilter={searchFilter}
              setSearchFilter={setSearchFilter}
            />
          )}
        />
        <Route path="*" render={() => <NotFound />} />
      </Switch>
    </Section>
  );
};

export default Machines;
