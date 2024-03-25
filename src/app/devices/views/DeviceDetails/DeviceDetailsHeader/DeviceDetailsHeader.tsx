import { useState } from "react";

import { useSelector } from "react-redux";
import { useLocation } from "react-router";
import { Link } from "react-router-dom";

import DeviceName from "./DeviceName";

import NodeActionMenu from "@/app/base/components/NodeActionMenu";
import SectionHeader from "@/app/base/components/SectionHeader";
import urls from "@/app/base/urls";
import { DeviceSidePanelViews } from "@/app/devices/constants";
import type { DeviceSetSidePanelContent } from "@/app/devices/types";
import deviceSelectors from "@/app/store/device/selectors";
import type { Device } from "@/app/store/device/types";
import { isDeviceDetails } from "@/app/store/device/utils";
import type { RootState } from "@/app/store/root/types";

type Props = {
  setSidePanelContent: DeviceSetSidePanelContent;
  systemId: Device["system_id"];
};

const DeviceDetailsHeader = ({
  setSidePanelContent,
  systemId,
}: Props): JSX.Element => {
  const [editingName, setEditingName] = useState(false);
  const device = useSelector((state: RootState) =>
    deviceSelectors.getById(state, systemId)
  );
  const { pathname } = useLocation();

  if (!device) {
    return <SectionHeader loading />;
  }

  return (
    <SectionHeader
      buttons={[
        <NodeActionMenu
          filterActions
          hasSelection={true}
          nodeDisplay="device"
          nodes={[device]}
          onActionClick={(action) => {
            const view = Object.values(DeviceSidePanelViews).find(
              ([, actionName]) => actionName === action
            );
            if (view) {
              setSidePanelContent({ view });
            }
          }}
        />,
      ]}
      subtitleLoading={!isDeviceDetails(device)}
      tabLinks={[
        {
          active: pathname.startsWith(
            urls.devices.device.summary({ id: systemId })
          ),
          component: Link,
          label: "Summary",
          to: urls.devices.device.summary({ id: systemId }),
        },
        {
          active: pathname.startsWith(
            urls.devices.device.network({ id: systemId })
          ),
          component: Link,
          label: "Network",
          to: urls.devices.device.network({ id: systemId }),
        },
        {
          active: pathname.startsWith(
            urls.devices.device.configuration({ id: systemId })
          ),
          component: Link,
          label: "Configuration",
          to: urls.devices.device.configuration({ id: systemId }),
        },
      ]}
      title={
        <DeviceName
          data-testid="DeviceName"
          editingName={editingName}
          id={systemId}
          setEditingName={setEditingName}
        />
      }
    />
  );
};

export default DeviceDetailsHeader;
