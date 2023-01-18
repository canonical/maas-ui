import { Button } from "@canonical/react-components";
import { useSelector } from "react-redux";

import ModelListSubtitle from "app/base/components/ModelListSubtitle";
import NodeActionMenu from "app/base/components/NodeActionMenu";
import SectionHeader from "app/base/components/SectionHeader";
import type { SetSearchFilter } from "app/base/types";
import DeviceHeaderForms from "app/devices/components/DeviceHeaderForms";
import { DeviceHeaderViews } from "app/devices/constants";
import type {
  DeviceSidePanelContent,
  DeviceSetSidePanelContent,
} from "app/devices/types";
import { getHeaderTitle } from "app/devices/utils";
import deviceSelectors from "app/store/device/selectors";

type Props = {
  sidePanelContent: DeviceSidePanelContent | null;
  setSidePanelContent: DeviceSetSidePanelContent;
  setSearchFilter: SetSearchFilter;
};

const DeviceListHeader = ({
  sidePanelContent,
  setSidePanelContent,
  setSearchFilter,
}: Props): JSX.Element => {
  const devices = useSelector(deviceSelectors.all);
  const devicesLoaded = useSelector(deviceSelectors.loaded);
  const selectedDevices = useSelector(deviceSelectors.selected);

  return (
    <SectionHeader
      buttons={[
        <Button
          data-testid="add-device-button"
          disabled={selectedDevices.length > 0}
          onClick={() =>
            setSidePanelContent({ view: DeviceHeaderViews.ADD_DEVICE })
          }
        >
          Add device
        </Button>,
        <NodeActionMenu
          filterActions
          hasSelection={selectedDevices.length > 0}
          nodeDisplay="device"
          nodes={selectedDevices}
          onActionClick={(action) => {
            const view = Object.values(DeviceHeaderViews).find(
              ([, actionName]) => actionName === action
            );
            if (view) {
              setSidePanelContent({ view });
            }
          }}
          showCount
        />,
      ]}
      sidePanelContent={
        sidePanelContent && (
          <DeviceHeaderForms
            devices={selectedDevices}
            setSidePanelContent={setSidePanelContent}
            sidePanelContent={sidePanelContent}
          />
        )
      }
      sidePanelTitle={getHeaderTitle("Devices", sidePanelContent)}
      subtitle={
        <ModelListSubtitle
          available={devices.length}
          filterSelected={() => setSearchFilter("in:(Selected)")}
          modelName="device"
          selected={selectedDevices.length}
        />
      }
      subtitleLoading={!devicesLoaded}
      title="Devices"
    />
  );
};

export default DeviceListHeader;
