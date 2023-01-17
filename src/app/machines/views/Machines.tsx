import { useCallback, useState } from "react";

import { useLocation, useNavigate } from "react-router-dom-v5-compat";

import MachineListHeader from "./MachineList/MachineListHeader";

import MainContentSection from "app/base/components/MainContentSection";
import type { MachineSidePanelContent } from "app/machines/types";
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
  const [sidePanelContent, setSidePanelContent] =
    useState<MachineSidePanelContent | null>(null);

  const setSearchFilter = useCallback(
    (searchText) => {
      setFilter(searchText);
      const filters = FilterMachines.getCurrentFilters(searchText);
      navigate({ search: FilterMachines.filtersToQueryString(filters) });
    },
    [navigate, setFilter]
  );

  return (
    <MainContentSection
      header={
        <MachineListHeader
          searchFilter={searchFilter}
          setSearchFilter={setSearchFilter}
          setSidePanelContent={setSidePanelContent}
          sidePanelContent={sidePanelContent}
        />
      }
    >
      <MachineList
        headerFormOpen={!!sidePanelContent}
        searchFilter={searchFilter}
        setSearchFilter={setSearchFilter}
      />
    </MainContentSection>
  );
};

export default Machines;
