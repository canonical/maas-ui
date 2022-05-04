import { useSelector } from "react-redux";

import type { SetExpanded } from "app/base/components/NodeNetworkTab/NodeNetworkTab";
import { ExpandedState } from "app/base/components/NodeNetworkTab/NodeNetworkTab";
import TableMenu from "app/base/components/TableMenu";
import type { Props as TableMenuProps } from "app/base/components/TableMenu/TableMenu";
import TooltipButton from "app/base/components/TooltipButton";
import { useIsAllNetworkingDisabled } from "app/base/hooks";
import machineSelectors from "app/store/machine/selectors";
import type { Machine } from "app/store/machine/types";
import {
  isMachineDetails,
  useCanAddVLAN,
  useIsLimitedEditingAllowed,
} from "app/store/machine/utils";
import type { RootState } from "app/store/root/types";
import { NetworkInterfaceTypes } from "app/store/types/enum";
import type { NetworkInterface, NetworkLink } from "app/store/types/node";
import {
  canAddAlias,
  hasInterfaceType,
  getInterfaceTypeText,
  getLinkInterface,
} from "app/store/utils";

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
  const canAddVLAN = useCanAddVLAN(machine, nic, link);
  const itCanAddAlias = canAddAlias(machine, nic, link);
  if (!isMachineDetails(machine)) {
    return null;
  }
  const isPhysical = hasInterfaceType(
    NetworkInterfaceTypes.PHYSICAL,
    machine,
    nic,
    link
  );
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
        disabled: !itCanAddAlias,
        inMenu:
          !isAllNetworkingDisabled &&
          !hasInterfaceType([NetworkInterfaceTypes.ALIAS], machine, nic, link),
        tooltip: itCanAddAlias
          ? null
          : "IP mode needs to be configured for this interface.",
        state: ExpandedState.ADD_ALIAS,
        label: "Add alias",
      },
      {
        disabled: !canAddVLAN,
        inMenu:
          !isAllNetworkingDisabled &&
          !hasInterfaceType(
            [NetworkInterfaceTypes.ALIAS, NetworkInterfaceTypes.VLAN],
            machine,
            nic,
            link
          ),
        state: ExpandedState.ADD_VLAN,
        tooltip: canAddVLAN
          ? null
          : "There are no unused VLANS for this interface.",
        label: "Add VLAN",
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
    ].reduce<TableMenuProps["links"]>((items, item) => {
      if (item.inMenu && item.state) {
        if (!items) {
          items = [];
        }
        items.push({
          children: item.tooltip ? (
            <span className="u-flex">
              <span className="u-flex--grow">{item.label}</span>
              <TooltipButton
                iconName="help"
                message={item.tooltip}
                position="top-right"
              />
            </span>
          ) : (
            item.label
          ),
          disabled: item.disabled,
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
