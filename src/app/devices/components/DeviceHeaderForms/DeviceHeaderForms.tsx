import { useCallback } from "react";

import type { ValueOf } from "@canonical/react-components";

import AddDeviceForm from "./AddDeviceForm";
import DeviceActionFormWrapper from "./DeviceActionFormWrapper";

import type { SidePanelContentTypes } from "@/app/base/side-panel-context";
import type { DeviceActionHeaderViews } from "@/app/devices/constants";
import { DeviceSidePanelViews } from "@/app/devices/constants";
import type { Device } from "@/app/store/device/types";

type Props = SidePanelContentTypes & {
  devices: Device[];
  viewingDetails?: boolean;
};

const DeviceHeaderForms = ({
  devices,
  sidePanelContent,
  setSidePanelContent,
  viewingDetails = false,
}: Props): React.ReactElement | null => {
  const clearSidePanelContent = useCallback(
    () => setSidePanelContent(null),
    [setSidePanelContent]
  );

  if (!sidePanelContent) {
    return null;
  }

  switch (sidePanelContent.view) {
    case DeviceSidePanelViews.ADD_DEVICE:
      return <AddDeviceForm clearSidePanelContent={clearSidePanelContent} />;
    default:
      // We need to explicitly cast sidePanelContent.view here - TypeScript doesn't
      // seem to be able to infer remaining object tuple values as with string
      // values.
      // https://github.com/canonical/maas-ui/issues/3040
      const { view } = sidePanelContent as {
        view: ValueOf<typeof DeviceActionHeaderViews>;
      };
      const [, action] = view;
      return (
        <DeviceActionFormWrapper
          action={action}
          clearSidePanelContent={clearSidePanelContent}
          devices={devices}
          viewingDetails={viewingDetails}
        />
      );
  }
};

export default DeviceHeaderForms;
