import { Spinner } from "@canonical/react-components";
import { useSelector } from "react-redux";

import DHCPTable from "app/base/components/DHCPTable";
import NetworkActionRow from "app/base/components/NetworkActionRow";
import NodeNetworkTab from "app/base/components/NodeNetworkTab";
import { useWindowTitle } from "app/base/hooks";
import deviceSelectors from "app/store/device/selectors";
import { DeviceMeta } from "app/store/device/types";
import type { Device } from "app/store/device/types";
import type { RootState } from "app/store/root/types";

type Props = {
  systemId: Device[DeviceMeta.PK];
};

const DeviceNetwork = ({ systemId }: Props): JSX.Element => {
  const device = useSelector((state: RootState) =>
    deviceSelectors.getById(state, systemId)
  );

  useWindowTitle(`${device?.fqdn ? `${device?.fqdn} ` : "Device"} network`);

  if (!device) {
    return <Spinner text="Loading..." />;
  }

  return (
    <>
      <NodeNetworkTab
        actions={(expanded, setExpanded) => (
          <NetworkActionRow
            expanded={expanded}
            node={device}
            setExpanded={setExpanded}
          />
        )}
        addInterface={() => "Add interface"}
        dhcpTable={() => (
          <DHCPTable node={device} nodeType={DeviceMeta.MODEL} />
        )}
        expandedForm={() => null}
        interfaceTable={() => null}
      />
    </>
  );
};

export default DeviceNetwork;
