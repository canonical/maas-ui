import { Spinner } from "@canonical/react-components";
import { useSelector } from "react-redux";

import AddInterface from "./AddInterface";
import DeviceNetworkTable from "./DeviceNetworkTable";
import EditInterface from "./EditInterface";

import DHCPTable from "app/base/components/DHCPTable";
import NetworkActionRow from "app/base/components/NetworkActionRow";
import NodeNetworkTab from "app/base/components/NodeNetworkTab";
import { ExpandedState } from "app/base/components/NodeNetworkTab/NodeNetworkTab";
import { useWindowTitle } from "app/base/hooks";
import deviceSelectors from "app/store/device/selectors";
import { DeviceMeta } from "app/store/device/types";
import type { Device } from "app/store/device/types";
import type { RootState } from "app/store/root/types";

export enum Label {
  Title = "Device network",
}

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
        addInterface={(_, setExpanded) => (
          <AddInterface
            closeForm={() => setExpanded(null)}
            systemId={systemId}
          />
        )}
        aria-label={Label.Title}
        dhcpTable={() => (
          <DHCPTable
            className="u-no-padding--top"
            modelName={DeviceMeta.MODEL}
            node={device}
          />
        )}
        expandedForm={(expanded, setExpanded) => {
          if (expanded?.content === ExpandedState.EDIT) {
            return (
              <EditInterface
                closeForm={() => setExpanded(null)}
                linkId={expanded?.linkId}
                nicId={expanded?.nicId}
                systemId={systemId}
              />
            );
          }
          return null;
        }}
        interfaceTable={(expanded, setExpanded) => (
          <DeviceNetworkTable
            expanded={expanded}
            setExpanded={setExpanded}
            systemId={systemId}
          />
        )}
      />
    </>
  );
};

export default DeviceNetwork;
