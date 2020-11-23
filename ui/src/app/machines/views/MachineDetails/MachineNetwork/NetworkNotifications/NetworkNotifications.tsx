import React from "react";
import { useSelector } from "react-redux";

import MachineNotifications from "app/machines/views/MachineDetails/MachineNotifications";
import machineSelectors from "app/store/machine/selectors";
import { useIsAllNetworkingDisabled } from "app/store/machine/utils";

import type { Machine } from "app/store/machine/types";
import type { RootState } from "app/store/root/types";

type Props = {
  id: Machine["system_id"];
};

const NetworkNotifications = ({ id }: Props): JSX.Element | null => {
  const machine = useSelector((state: RootState) =>
    machineSelectors.getById(state, id)
  );
  const isAllNetworkingDisabled = useIsAllNetworkingDisabled(machine);

  if (!machine || !("on_network" in machine)) {
    return null;
  }

  return (
    <MachineNotifications
      notifications={[
        {
          active: !machine.on_network,
          content: "Machine must be connected to a network.",
          status: "Error:",
          type: "negative",
        },
        {
          active: isAllNetworkingDisabled,
          content:
            "Interface configuration cannot be modified unless the machine is New, Ready, Allocated or Broken.",
        },
        {
          active: machine.osystem === "custom",
          content:
            "Custom images may require special preparation to support custom network configuration.",
          status: "Important:",
          type: "caution",
        },
      ]}
    />
  );
};

export default NetworkNotifications;
