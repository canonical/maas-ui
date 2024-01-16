import { useCallback } from "react";

import type { SidePanelContentTypes } from "@/app/base/side-panel-context";
import { DeviceSidePanelViews } from "@/app/devices/constants";
import AddInterface from "@/app/devices/views/DeviceDetails/DeviceNetwork/AddInterface";
import RemoveInterface from "@/app/devices/views/DeviceDetails/DeviceNetwork/DeviceNetworkTable/RemoveInterface";
import EditInterface from "@/app/devices/views/DeviceDetails/DeviceNetwork/EditInterface";
import type { Device } from "@/app/store/device/types";

type Props = SidePanelContentTypes & {
  systemId: Device["system_id"];
};

const DeviceNetworkForms = ({
  systemId,
  sidePanelContent,
  setSidePanelContent,
}: Props): JSX.Element | null => {
  const clearSidePanelContent = useCallback(
    () => setSidePanelContent(null),
    [setSidePanelContent]
  );

  if (!sidePanelContent) {
    return null;
  }

  const linkId =
    sidePanelContent.extras && "linkId" in sidePanelContent.extras
      ? sidePanelContent.extras.linkId
      : null;

  const nicId =
    sidePanelContent.extras && "nicId" in sidePanelContent.extras
      ? sidePanelContent.extras.nicId
      : null;

  switch (sidePanelContent.view) {
    case DeviceSidePanelViews.ADD_INTERFACE:
      return (
        <AddInterface closeForm={clearSidePanelContent} systemId={systemId} />
      );
    case DeviceSidePanelViews.EDIT_INTERFACE:
      return (
        <EditInterface
          closeForm={clearSidePanelContent}
          linkId={linkId}
          nicId={nicId}
          systemId={systemId}
        />
      );
    case DeviceSidePanelViews.REMOVE_INTERFACE:
      return nicId ? (
        <RemoveInterface
          closeForm={clearSidePanelContent}
          nicId={nicId}
          systemId={systemId}
        />
      ) : null;

    default:
      return null;
  }
};

export default DeviceNetworkForms;
