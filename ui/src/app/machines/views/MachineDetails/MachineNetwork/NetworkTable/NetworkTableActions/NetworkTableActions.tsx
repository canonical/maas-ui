import { useSelector } from "react-redux";

import TableMenu from "app/base/components/TableMenu";
import machineSelectors from "app/store/machine/selectors";
import type { NetworkInterface, Machine } from "app/store/machine/types";
import {
  getInterfaceTypeText,
  useIsAllNetworkingDisabled,
  useIsLimitedEditingAllowed,
} from "app/store/machine/utils";
import type { RootState } from "app/store/root/types";

type Props = { nic: NetworkInterface; systemId: Machine["system_id"] };

const NetworkTableActions = ({ nic, systemId }: Props): JSX.Element | null => {
  const machine = useSelector((state: RootState) =>
    machineSelectors.getById(state, systemId)
  );
  const isAllNetworkingDisabled = useIsAllNetworkingDisabled(machine);
  const isLimitedEditingAllowed = useIsLimitedEditingAllowed(nic, machine);
  // Placeholders for hook results that are not yet implemented.
  const canAddAliasOrVLAN = true;
  const canBeRemoved = true;
  const canMarkAsConnected = true;
  const canMarkAsDisconnected = true;
  const cannotEditInterface = false;
  const actions = [
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
        children: `Edit ${getInterfaceTypeText(nic)}`,
      },
    ]),
    ...(canBeRemoved && [
      {
        children: `Remove ${getInterfaceTypeText(nic)}...`,
      },
    ]),
  ];
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
