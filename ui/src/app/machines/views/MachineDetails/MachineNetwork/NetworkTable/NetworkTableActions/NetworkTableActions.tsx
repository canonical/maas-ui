import { useSelector } from "react-redux";

import TableMenu from "app/base/components/TableMenu";
import machineSelectors from "app/store/machine/selectors";
import type {
  Machine,
  NetworkInterface,
  NetworkLink,
} from "app/store/machine/types";
import {
  getInterfaceTypeText,
  getLinkInterface,
  useIsAllNetworkingDisabled,
  useIsLimitedEditingAllowed,
} from "app/store/machine/utils";
import type { RootState } from "app/store/root/types";

type Props = {
  link?: NetworkLink | null;
  nic?: NetworkInterface | null;
  systemId: Machine["system_id"];
};

const NetworkTableActions = ({
  link,
  nic,
  systemId,
}: Props): JSX.Element | null => {
  const machine = useSelector((state: RootState) =>
    machineSelectors.getById(state, systemId)
  );
  if (machine && link && !nic) {
    [nic] = getLinkInterface(machine, link);
  }
  const isAllNetworkingDisabled = useIsAllNetworkingDisabled(machine);
  const isLimitedEditingAllowed = useIsLimitedEditingAllowed(nic, machine);
  // Placeholders for hook results that are not yet implemented.
  const canAddAliasOrVLAN = true;
  const canBeRemoved = true;
  const canMarkAsConnected = true;
  const canMarkAsDisconnected = true;
  const cannotEditInterface = false;
  let actions: { children: string }[] = [];
  if (machine && nic) {
    actions = [
      ...(canMarkAsConnected && [
        {
          children: "Mark as connected",
        },
      ]),
      ...(canMarkAsDisconnected && [
        {
          children: "Mark as disconnected",
        },
      ]),
      ...(canAddAliasOrVLAN && [
        {
          children: "Add alias or VLAN",
        },
      ]),
      ...(!cannotEditInterface && [
        {
          children: `Edit ${getInterfaceTypeText(machine, nic, link)}`,
        },
      ]),
      ...(canBeRemoved && [
        {
          children: `Remove ${getInterfaceTypeText(machine, nic, link)}...`,
        },
      ]),
    ];
  }
  return (
    <TableMenu
      disabled={isAllNetworkingDisabled && !isLimitedEditingAllowed}
      links={[actions]}
      position="right"
      title="Take action:"
    />
  );
};

export default NetworkTableActions;
