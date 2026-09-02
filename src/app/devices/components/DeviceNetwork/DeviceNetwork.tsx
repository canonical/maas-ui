import { Spinner } from "@canonical/react-components";
import { useSelector } from "react-redux";

import DeviceNetworkTable from "./DeviceNetworkTable";

import DHCPTable from "@/app/base/components/DHCPTable";
import NetworkActionRow from "@/app/base/components/NetworkActionRow";
import NodeNetworkTab from "@/app/base/components/NodeNetworkTab";
import { useHasEntitlements, useWindowTitle } from "@/app/base/hooks";
import { Entitlement } from "@/app/settings/views/UserManagement/views/Groups/constants";
import deviceSelectors from "@/app/store/device/selectors";
import { DeviceMeta } from "@/app/store/device/types";
import type { Device } from "@/app/store/device/types";
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
  const canEdit = useHasEntitlements([Entitlement.CAN_EDIT_GLOBAL_ENTITIES]);

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
        dhcpTable={() => (
          <DHCPTable
            className="u-no-padding--top"
            editDisabled={!canEdit}
            modelName={DeviceMeta.MODEL}
            node={device}
          />
        )}
        interfaceTable={() => <DeviceNetworkTable systemId={systemId} />}
      />
    </>
  );
};

export default DeviceNetwork;
