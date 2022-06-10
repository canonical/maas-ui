import { useCallback } from "react";

import type { ValueOf } from "@canonical/react-components";

import AddDeviceForm from "./AddDeviceForm";
import DeviceActionFormWrapper from "./DeviceActionFormWrapper";

import type { DeviceActionHeaderViews } from "app/devices/constants";
import { DeviceHeaderViews } from "app/devices/constants";
import type {
  DeviceHeaderContent,
  DeviceSetHeaderContent,
} from "app/devices/types";
import type { Device } from "app/store/device/types";

type Props = {
  devices: Device[];
  headerContent: DeviceHeaderContent;
  setHeaderContent: DeviceSetHeaderContent;
  viewingDetails?: boolean;
};

const DeviceHeaderForms = ({
  devices,
  headerContent,
  setHeaderContent,
  viewingDetails = false,
}: Props): JSX.Element | null => {
  const clearHeaderContent = useCallback(
    () => setHeaderContent(null),
    [setHeaderContent]
  );

  switch (headerContent.view) {
    case DeviceHeaderViews.ADD_DEVICE:
      return <AddDeviceForm clearHeaderContent={clearHeaderContent} />;
    default:
      // We need to explicitly cast headerContent.view here - TypeScript doesn't
      // seem to be able to infer remaining object tuple values as with string
      // values.
      // https://github.com/canonical-web-and-design/maas-ui/issues/3040
      const { view } = headerContent as {
        view: ValueOf<typeof DeviceActionHeaderViews>;
      };
      const [, action] = view;
      return (
        <DeviceActionFormWrapper
          action={action}
          clearHeaderContent={clearHeaderContent}
          devices={devices}
          viewingDetails={viewingDetails}
        />
      );
  }
};

export default DeviceHeaderForms;
