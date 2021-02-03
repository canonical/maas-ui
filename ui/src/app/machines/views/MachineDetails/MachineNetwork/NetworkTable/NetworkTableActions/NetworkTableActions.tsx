import { useSelector } from "react-redux";

import type { SetExpanded } from "../types";
import { ExpandedState } from "../types";

import TableMenu from "app/base/components/TableMenu";
import type { Props as TableMenuProps } from "app/base/components/TableMenu/TableMenu";
import machineSelectors from "app/store/machine/selectors";
import type {
  Machine,
  NetworkInterface,
  NetworkLink,
} from "app/store/machine/types";
import { NetworkInterfaceTypes } from "app/store/machine/types";
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
  const isPhysical = nic?.type === NetworkInterfaceTypes.PHYSICAL;
  let actions: TableMenuProps["links"] = [];
  if (machine && nic) {
    actions = [
      {
        inMenu: !nic.link_connected && isPhysical,
        state: ExpandedState.MARK_CONNECTED,
        label: "Mark as connected",
      },
      {
        inMenu: nic.link_connected && isPhysical,
        state: ExpandedState.MARK_DISCONNECTED,
        label: "Mark as disconnected",
      },
      {
        inMenu: canAddAliasOrVLAN,
        state: ExpandedState.MARK_DISCONNECTED,
        label: "Add alias or VLAN",
      },
      {
        inMenu: true,
        state:
          isPhysical && !nic?.link_connected
            ? ExpandedState.DISCONNECTED_WARNING
            : ExpandedState.EDIT,
        label: `Edit ${getInterfaceTypeText(machine, nic, link)}`,
      },
      {
        inMenu: !isAllNetworkingDisabled,
        state: ExpandedState.REMOVE,
        label: `Remove ${getInterfaceTypeText(machine, nic, link)}...`,
      },
    ].reduce<TableMenuProps["links"]>((items = [], item) => {
      if (item.inMenu && item.state) {
        items.push({
          children: item.label,
          onClick: () => {
            setExpanded({
              content: item.state,
              linkId: link?.id,
              nicId: link ? null : nic?.id,
            });
          },
        });
      }
      return items;
    }, []);
  }
  return (
    <TableMenu
      disabled={isAllNetworkingDisabled && !isLimitedEditingAllowed}
      links={actions}
      position="right"
      title="Take action:"
    />
  );
};

export default NetworkTableActions;
