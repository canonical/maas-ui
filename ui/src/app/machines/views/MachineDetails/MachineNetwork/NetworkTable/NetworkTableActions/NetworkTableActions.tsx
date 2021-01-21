import type { MenuLink } from "@canonical/react-components/dist/components/ContextualMenu/ContextualMenuDropdown/ContextualMenuDropdown";
import { useSelector } from "react-redux";

import type { SetExpanded } from "../types";
import { ExpandedState } from "../types";

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
  setExpanded: SetExpanded;
  systemId: Machine["system_id"];
};

const NetworkTableActions = ({
  link,
  nic,
  setExpanded,
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
  const canMarkAsConnected = true;
  const canMarkAsDisconnected = true;
  const cannotEditInterface = false;
  let actions: MenuLink[] = [];
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
      ...(!isAllNetworkingDisabled
        ? [
            {
              children: `Remove ${getInterfaceTypeText(machine, nic, link)}...`,
              onClick: () => {
                setExpanded({
                  content: ExpandedState.REMOVE,
                  linkId: link?.id,
                  nicId: link ? null : nic?.id,
                });
              },
            },
          ]
        : []),
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
