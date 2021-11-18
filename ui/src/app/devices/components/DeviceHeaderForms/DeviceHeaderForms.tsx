import { useCallback } from "react";

import AddDeviceForm from "./AddDeviceForm";

import { DeviceHeaderViews } from "app/devices/constants";
import type {
  DeviceHeaderContent,
  DeviceSetHeaderContent,
} from "app/devices/types";

type Props = {
  headerContent: DeviceHeaderContent;
  setHeaderContent: DeviceSetHeaderContent;
};

const DeviceHeaderForms = ({
  headerContent,
  setHeaderContent,
}: Props): JSX.Element | null => {
  const clearHeaderContent = useCallback(
    () => setHeaderContent(null),
    [setHeaderContent]
  );

  switch (headerContent.view) {
    case DeviceHeaderViews.ADD_DEVICE:
      return <AddDeviceForm clearHeaderContent={clearHeaderContent} />;
    default:
      // TODO: Make machine ActionFormWrapper work across different node types
      // and use here.
      // https://github.com/canonical-web-and-design/app-tribe/issues/525
      return null;
  }
};

export default DeviceHeaderForms;
