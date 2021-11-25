import { useCallback, useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router";

import DeviceListControls from "./DeviceListControls";
import DeviceListHeader from "./DeviceListHeader";
import DeviceListTable from "./DeviceListTable";

import Section from "app/base/components/Section";
import { useWindowTitle } from "app/base/hooks";
import type { DeviceHeaderContent } from "app/devices/types";
import { actions as deviceActions } from "app/store/device";
import deviceSelectors from "app/store/device/selectors";
import { FilterDevices } from "app/store/device/utils";
import type { RootState } from "app/store/root/types";

const DeviceList = (): JSX.Element => {
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const currentFilters = FilterDevices.queryStringToFilters(location.search);
  const [headerContent, setHeaderContent] =
    useState<DeviceHeaderContent | null>(null);
  const [searchFilter, setFilter] = useState(
    // Initialise the filter state from the URL.
    FilterDevices.filtersToString(currentFilters)
  );
  const selectedIDs = useSelector(deviceSelectors.selectedIDs);
  const filteredDevices = useSelector((state: RootState) =>
    deviceSelectors.search(state, searchFilter || null, selectedIDs)
  );
  useWindowTitle("Devices");

  useEffect(() => {
    dispatch(deviceActions.fetch());
  }, [dispatch]);

  // Update the URL when filters are changed.
  const setSearchFilter = useCallback(
    (searchText) => {
      setFilter(searchText);
      const filters = FilterDevices.getCurrentFilters(searchText);
      history.push({ search: FilterDevices.filtersToQueryString(filters) });
    },
    [history, setFilter]
  );

  return (
    <Section
      header={
        <DeviceListHeader
          headerContent={headerContent}
          setHeaderContent={setHeaderContent}
        />
      }
    >
      <DeviceListControls filter={searchFilter} setFilter={setSearchFilter} />
      <DeviceListTable
        devices={filteredDevices}
        onSelectedChange={(deviceIDs) => {
          dispatch(deviceActions.setSelected(deviceIDs));
        }}
        selectedIDs={selectedIDs}
      />
    </Section>
  );
};

export default DeviceList;
