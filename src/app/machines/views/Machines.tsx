import { useCallback, useState } from "react";

import { useLocation, useNavigate } from "react-router-dom-v5-compat";

import MachineListHeader from "./MachineList/MachineListHeader";

import Section from "app/base/components/Section";
import type { MachineHeaderContent } from "app/machines/types";
import MachineList from "app/machines/views/MachineList";
import { FilterMachines } from "app/store/machine/utils";

const Machines = (): JSX.Element => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentFilters = FilterMachines.queryStringToFilters(location.search);
  // The filter state is initialised from the URL.
  const [searchFilter, setFilter] = useState(
    FilterMachines.filtersToString(currentFilters)
  );
  const [headerContent, setHeaderContent] =
    useState<MachineHeaderContent | null>(null);

  const setSearchFilter = useCallback(
    (searchText) => {
      setFilter(searchText);
      const filters = FilterMachines.getCurrentFilters(searchText);
      navigate({ search: FilterMachines.filtersToQueryString(filters) });
    },
    [navigate, setFilter]
  );

  return (
    <Section
      header={
        <MachineListHeader
          headerContent={headerContent}
          searchFilter={searchFilter}
          setHeaderContent={setHeaderContent}
          setSearchFilter={setSearchFilter}
        />
      }
    >
      <MachineList
        headerFormOpen={!!headerContent}
        searchFilter={searchFilter}
        setSearchFilter={setSearchFilter}
      />
    </Section>
  );
};

export default Machines;
