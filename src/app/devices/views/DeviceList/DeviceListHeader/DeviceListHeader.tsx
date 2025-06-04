import { useEffect, useState } from "react";

import { MainToolbar } from "@canonical/maas-react-components";
import { Button, Col, Spinner } from "@canonical/react-components";
import { useSelector } from "react-redux";

import DeviceFilterAccordion from "./DeviceFilterAccordion";

import DebounceSearchBox from "@/app/base/components/DebounceSearchBox";
import ModelListSubtitle from "@/app/base/components/ModelListSubtitle";
import NodeActionMenu from "@/app/base/components/NodeActionMenu";
import type { SetSearchFilter } from "@/app/base/types";
import { DeviceSidePanelViews } from "@/app/devices/constants";
import type { DeviceSetSidePanelContent } from "@/app/devices/types";
import deviceSelectors from "@/app/store/device/selectors";

type Props = {
  readonly searchFilter: string;
  readonly setSidePanelContent: DeviceSetSidePanelContent;
  readonly setSearchFilter: SetSearchFilter;
};

const DeviceListHeader = ({
  searchFilter,
  setSidePanelContent,
  setSearchFilter,
}: Props): React.ReactElement => {
  const devices = useSelector(deviceSelectors.all);
  const devicesLoaded = useSelector(deviceSelectors.loaded);
  const selectedDevices = useSelector(deviceSelectors.selected);
  const [searchText, setSearchText] = useState(searchFilter);

  useEffect(() => {
    // If the filters change then update the search input text.
    setSearchText(searchFilter);
  }, [searchFilter]);

  return (
    <MainToolbar>
      <MainToolbar.Title data-testid="section-header-title">
        Devices
      </MainToolbar.Title>
      {devicesLoaded ? (
        <ModelListSubtitle
          available={devices.length}
          filterSelected={() => {
            setSearchFilter("in:(Selected)");
          }}
          modelName="device"
          selected={selectedDevices.length}
        />
      ) : (
        <Spinner text="Loading" />
      )}
      <MainToolbar.Controls>
        <Col size={3}>
          <DeviceFilterAccordion
            searchText={searchText}
            setSearchText={setSearchFilter}
          />
        </Col>
        <DebounceSearchBox
          onDebounced={(debouncedText) => {
            setSearchFilter(debouncedText);
          }}
          searchText={searchText}
          setSearchText={setSearchText}
        />
        <Button
          data-testid="add-device-button"
          disabled={selectedDevices.length > 0}
          onClick={() => {
            setSidePanelContent({ view: DeviceSidePanelViews.ADD_DEVICE });
          }}
        >
          Add device
        </Button>
        <NodeActionMenu
          filterActions
          hasSelection={selectedDevices.length > 0}
          nodeDisplay="device"
          nodes={selectedDevices}
          onActionClick={(action) => {
            const view = Object.values(DeviceSidePanelViews).find(
              ([, actionName]) => actionName === action
            );
            if (view) {
              setSidePanelContent({ view });
            }
          }}
          showCount
        />
      </MainToolbar.Controls>
    </MainToolbar>
  );
};

export default DeviceListHeader;
