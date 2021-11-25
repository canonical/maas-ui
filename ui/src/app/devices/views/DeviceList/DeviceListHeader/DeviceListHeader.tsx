import { Button } from "@canonical/react-components";
import { useSelector } from "react-redux";

import ModelListSubtitle from "app/base/components/ModelListSubtitle";
import NodeActionMenu from "app/base/components/NodeActionMenu";
import SectionHeader from "app/base/components/SectionHeader";
import DeviceHeaderForms from "app/devices/components/DeviceHeaderForms";
import { DeviceHeaderViews } from "app/devices/constants";
import type {
  DeviceHeaderContent,
  DeviceSetHeaderContent,
} from "app/devices/types";
import { getHeaderTitle } from "app/devices/utils";
import deviceSelectors from "app/store/device/selectors";

type Props = {
  headerContent: DeviceHeaderContent | null;
  setHeaderContent: DeviceSetHeaderContent;
};

const DeviceListHeader = ({
  headerContent,
  setHeaderContent,
}: Props): JSX.Element => {
  const devices = useSelector(deviceSelectors.all);
  const devicesLoaded = useSelector(deviceSelectors.loaded);
  const selectedDevices = useSelector(deviceSelectors.selected);

  return (
    <SectionHeader
      buttons={[
        <Button
          appearance="neutral"
          data-test="add-device-button"
          disabled={selectedDevices.length > 0}
          onClick={() =>
            setHeaderContent({ view: DeviceHeaderViews.ADD_DEVICE })
          }
        >
          Add device
        </Button>,
        <NodeActionMenu
          nodes={selectedDevices}
          nodeDisplay="device"
          onActionClick={(action) => {
            const view = Object.values(DeviceHeaderViews).find(
              ([, actionName]) => actionName === action
            );
            if (view) {
              setHeaderContent({ view });
            }
          }}
        />,
      ]}
      headerContent={
        headerContent && (
          <DeviceHeaderForms
            headerContent={headerContent}
            setHeaderContent={setHeaderContent}
          />
        )
      }
      subtitle={
        <ModelListSubtitle
          available={devices.length}
          modelName="device"
          selected={selectedDevices.length}
        />
      }
      subtitleLoading={!devicesLoaded}
      title={getHeaderTitle("Devices", headerContent)}
    />
  );
};

export default DeviceListHeader;
