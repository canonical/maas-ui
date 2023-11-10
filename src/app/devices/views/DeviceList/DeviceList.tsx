import { useCallback, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";
import { useNavigate } from "react-router-dom-v5-compat";

import DeviceListControls from "./DeviceListControls";
import DeviceListHeader from "./DeviceListHeader";
import DeviceListTable from "./DeviceListTable";

import PageContent from "@/app/base/components/PageContent";
import { useFetchActions, useWindowTitle } from "@/app/base/hooks";
import { useSidePanel } from "@/app/base/side-panel-context";
import DeviceHeaderForms from "@/app/devices/components/DeviceHeaderForms";
import { actions as deviceActions } from "@/app/store/device";
import deviceSelectors from "@/app/store/device/selectors";
import { FilterDevices } from "@/app/store/device/utils";
import type { RootState } from "@/app/store/root/types";
import { actions as tagActions } from "@/app/store/tag";
import { getSidePanelTitle } from "@/app/store/utils/node/base";

const DeviceList = (): JSX.Element => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const currentFilters = FilterDevices.queryStringToFilters(location.search);
  const { sidePanelContent, setSidePanelContent } = useSidePanel();
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
  const selectedDevices = useSelector(deviceSelectors.selected);

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
          setSearchFilter={setSearchFilter}
          setSidePanelContent={setSidePanelContent}
        />
      }
      sidePanelContent={
        sidePanelContent && (
          <DeviceHeaderForms
            devices={selectedDevices}
            setSidePanelContent={setSidePanelContent}
            sidePanelContent={sidePanelContent}
          />
        )
      }
      sidePanelTitle={getSidePanelTitle("Devices", sidePanelContent)}
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
    </PageContent>
  );
};

export default DeviceList;
