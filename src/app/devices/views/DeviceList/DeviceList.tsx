import { useCallback, useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";
import { useNavigate } from "react-router-dom-v5-compat";

import DeviceListControls from "./DeviceListControls";
import DeviceListHeader from "./DeviceListHeader";
import DeviceListTable from "./DeviceListTable";

import MainContentSection from "app/base/components/MainContentSection";
import { useWindowTitle } from "app/base/hooks";
import type { DeviceSidePanelContent } from "app/devices/types";
import { actions as deviceActions } from "app/store/device";
import deviceSelectors from "app/store/device/selectors";
import { FilterDevices } from "app/store/device/utils";
import type { RootState } from "app/store/root/types";
import { actions as tagActions } from "app/store/tag";

const DeviceList = (): JSX.Element => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const currentFilters = FilterDevices.queryStringToFilters(location.search);
  const [sidePanelContent, setSidePanelContent] =
    useState<DeviceSidePanelContent | null>(null);
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

  useEffect(() => {
    dispatch(deviceActions.fetch());
    dispatch(tagActions.fetch());
  }, [dispatch]);

  // Update the URL when filters are changed.
  const setSearchFilter = useCallback(
    (searchText) => {
      setFilter(searchText);
      const filters = FilterDevices.getCurrentFilters(searchText);
      navigate({ search: FilterDevices.filtersToQueryString(filters) });
    },
    [navigate, setFilter]
  );

  return (
    <MainContentSection
      header={
        <DeviceListHeader
          setSearchFilter={setSearchFilter}
          setSidePanelContent={setSidePanelContent}
          sidePanelContent={sidePanelContent}
        />
      }
    >
      <DeviceListControls filter={searchFilter} setFilter={setSearchFilter} />
      <DeviceListTable
        devices={filteredDevices}
        hasFilter={!!searchFilter}
        loading={devicesLoading}
        onSelectedChange={(deviceIDs) => {
          dispatch(deviceActions.setSelected(deviceIDs));
        }}
        selectedIDs={selectedIDs}
      />
    </MainContentSection>
  );
};

export default DeviceList;
