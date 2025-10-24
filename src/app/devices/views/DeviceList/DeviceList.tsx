import { useCallback, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";

import DeviceListHeader from "../../components/DeviceListHeader";
import DeviceListTable from "../../components/DeviceListTable";

import PageContent from "@/app/base/components/PageContent";
import { useFetchActions, useWindowTitle } from "@/app/base/hooks";
import type { SyncNavigateFunction } from "@/app/base/types";
import { deviceActions } from "@/app/store/device";
import deviceSelectors from "@/app/store/device/selectors";
import { FilterDevices } from "@/app/store/device/utils";
import type { RootState } from "@/app/store/root/types";
import { tagActions } from "@/app/store/tag";

const DeviceList = (): React.ReactElement => {
  const dispatch = useDispatch();
  const navigate: SyncNavigateFunction = useNavigate();
  const location = useLocation();
  const currentFilters = FilterDevices.queryStringToFilters(location.search);
  const [searchFilter, setFilter] = useState(
    // Initialise the filter state from the URL.
    FilterDevices.filtersToString(currentFilters)
  );
  const selectedIDs = useSelector(deviceSelectors.selectedIDs);
  const filteredDevices = useSelector((state: RootState) =>
    deviceSelectors.search(state, searchFilter || null, selectedIDs)
  );
  const devicesLoading = useSelector(deviceSelectors.loading);
  useWindowTitle("Devices");

  useFetchActions([deviceActions.fetch, tagActions.fetch]);

  // Update the URL when filters are changed.
  const setSearchFilter = useCallback(
    (searchText: string) => {
      setFilter(searchText);
      const filters = FilterDevices.getCurrentFilters(searchText);
      navigate({ search: FilterDevices.filtersToQueryString(filters) });
    },
    [navigate, setFilter]
  );

  return (
    <PageContent
      header={
        <DeviceListHeader
          searchFilter={searchFilter}
          setSearchFilter={setSearchFilter}
        />
      }
      sidePanelContent={undefined}
      sidePanelTitle={null}
      useNewSidePanelContext={true}
    >
      <DeviceListTable
        devices={filteredDevices}
        hasFilter={!!searchFilter}
        loading={devicesLoading}
        onSelectedChange={(deviceIDs) => {
          dispatch(deviceActions.setSelected(deviceIDs));
        }}
        selectedIDs={selectedIDs}
      />
    </PageContent>
  );
};

export default DeviceList;
