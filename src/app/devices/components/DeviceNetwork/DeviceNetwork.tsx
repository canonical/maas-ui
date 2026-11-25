import { useSelector } from "react-redux";

import DeviceNetworkTable from "./DeviceNetworkTable";

import NetworkActionRow from "@/app/base/components/NetworkActionRow";
import NodeNetworkTab from "@/app/base/components/NodeNetworkTab";
import Spinner from "@/app/base/components/Spinner";
import { useCanEdit, useWindowTitle } from "@/app/base/hooks";
import deviceSelectors from "@/app/store/device/selectors";
import type { DeviceMeta, Device } from "@/app/store/device/types";
import type { RootState } from "@/app/store/root/types";

export enum Label {
  Title = "Device network",
}

type Props = {
  systemId: Device[DeviceMeta.PK];
};

const DeviceNetwork = ({ systemId }: Props): React.ReactElement => {
  const device = useSelector((state: RootState) =>
    deviceSelectors.getById(state, systemId)
  );
  const canEdit = useCanEdit(device, true);

  useWindowTitle(`${device?.fqdn ? `${device?.fqdn} ` : "Device"} network`);

  if (!device) {
    return <Spinner text="Loading..." />;
  }

  return (
    <>
      <NodeNetworkTab
        actions={() => (
          <NetworkActionRow addInterfaceDisabled={!canEdit} node={device} />
        )}
        aria-label={Label.Title}
        interfaceTable={() => <DeviceNetworkTable systemId={systemId} />}
      />
    </>
  );
};

export default DeviceNetwork;
