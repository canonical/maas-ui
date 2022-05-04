import type { ReactNode } from "react";

import { useSelector } from "react-redux";

import DoubleRow from "app/base/components/DoubleRow";
import TooltipButton from "app/base/components/TooltipButton";
import machineSelectors from "app/store/machine/selectors";
import type { Machine } from "app/store/machine/types";
import type { RootState } from "app/store/root/types";
import { NetworkInterfaceTypes } from "app/store/types/enum";
import type { NetworkInterface, NetworkLink } from "app/store/types/node";
import {
  getLinkInterface,
  hasInterfaceType,
  isInterfaceConnected,
} from "app/store/utils";
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
  const isConnected = isInterfaceConnected(machine, nic, link);
  let icon: ReactNode = null;

  if (!isConnected) {
    icon = (
      <TooltipButton
        iconName="disconnected"
        message="This interface is disconnected."
        position="top-left"
      />
    );
  }
  if (isConnected && nic.link_speed < nic.interface_speed) {
    icon = (
      <TooltipButton
        iconName="warning"
        message="Link connected to slow interface."
        position="top-left"
      />
    );
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
      data-testid="speed"
      icon={icon}
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
