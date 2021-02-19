import { Icon, Tooltip } from "@canonical/react-components";
import { useSelector } from "react-redux";

import DoubleRow from "app/base/components/DoubleRow";
import machineSelectors from "app/store/machine/selectors";
import { NetworkInterfaceTypes } from "app/store/machine/types";
import type {
  Machine,
  NetworkInterface,
  NetworkLink,
} from "app/store/machine/types";
import {
  getLinkInterface,
  hasInterfaceType,
  isInterfaceConnected,
} from "app/store/machine/utils";
import type { RootState } from "app/store/root/types";
import { formatSpeedUnits } from "app/utils";

type Props = {
  link?: NetworkLink | null;
  nic?: NetworkInterface | null;
  systemId: Machine["system_id"];
};

const SpeedColumn = ({ link, nic, systemId }: Props): JSX.Element | null => {
  const machine = useSelector((state: RootState) =>
    machineSelectors.getById(state, systemId)
  );
  if (!machine) {
    return null;
  }
  if (link && !nic) {
    [nic] = getLinkInterface(machine, link);
  }
  if (!nic) {
    return null;
  }

  return hasInterfaceType(
    [
      NetworkInterfaceTypes.BOND,
      NetworkInterfaceTypes.BRIDGE,
      NetworkInterfaceTypes.VLAN,
    ],
    machine,
    nic,
    link
  ) ? null : (
    <DoubleRow
      data-test="speed"
      icon={
        <>
          {isInterfaceConnected(machine, nic, link) ? null : (
            <Tooltip
              position="top-left"
              message="This interface is disconnected."
            >
              <Icon name="disconnected" />
            </Tooltip>
          )}
          {isInterfaceConnected(machine, nic, link) &&
          nic.link_speed < nic.interface_speed ? (
            <Tooltip
              position="top-left"
              message="Link connected to slow interface."
            >
              <Icon name="warning" />
            </Tooltip>
          ) : null}
        </>
      }
      iconSpace={true}
      primary={
        <>
          {formatSpeedUnits(nic.link_speed)}/
          {formatSpeedUnits(nic.interface_speed)}
        </>
      }
    />
  );
};

export default SpeedColumn;
