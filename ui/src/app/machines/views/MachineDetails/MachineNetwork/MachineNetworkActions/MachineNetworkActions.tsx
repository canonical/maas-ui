import { Button } from "@canonical/react-components";
import { useSelector } from "react-redux";

import type { Selected } from "../NetworkTable/types";

import NetworkActionRow from "app/base/components/NetworkActionRow";
import { NETWORK_DISABLED_MESSAGE } from "app/base/components/NetworkActionRow/NetworkActionRow";
import type {
  Expanded,
  SetExpanded,
} from "app/base/components/NodeNetworkTab/NodeNetworkTab";
import { ExpandedState } from "app/base/components/NodeNetworkTab/NodeNetworkTab";
import { useIsAllNetworkingDisabled, useSendAnalytics } from "app/base/hooks";
import { MachineHeaderViews } from "app/machines/constants";
import type { MachineSetHeaderContent } from "app/machines/types";
import machineSelectors from "app/store/machine/selectors";
import type { Machine } from "app/store/machine/types";
import {
  getInterfaceType,
  getInterfaceById,
  getLinkFromNic,
} from "app/store/machine/utils";
import type { RootState } from "app/store/root/types";
import { NetworkInterfaceTypes } from "app/store/types/enum";

type Action = {
  disabled: [boolean, string?][];
  label: string;
  state: ExpandedState;
};

type Props = {
  expanded: Expanded | null;
  selected: Selected[];
  setExpanded: SetExpanded;
  setHeaderContent: MachineSetHeaderContent;
  systemId: Machine["system_id"];
};

// Check if any of the selected interfaces includes the provided type.
const selectedIncludesType = (
  machine: Machine,
  selected: Selected[],
  interfaceType: NetworkInterfaceTypes
): boolean =>
  selected.some(({ nicId, linkId }) => {
    const nic = getInterfaceById(machine, nicId, linkId);
    const link = getLinkFromNic(nic, linkId);
    return interfaceType === getInterfaceType(machine, nic, link);
  });

// Check if any of the selected interfaces does not have the provided type.
const selectedAllOfType = (
  machine: Machine,
  selected: Selected[],
  interfaceType: NetworkInterfaceTypes
): boolean =>
  selected.every(({ nicId, linkId }) => {
    const nic = getInterfaceById(machine, nicId, linkId);
    const link = getLinkFromNic(nic, linkId);
    return interfaceType === getInterfaceType(machine, nic, link);
  });

// Check if any of the selected interfaces has a different VLAN.
const selectedDifferentVLANs = (
  machine: Machine,
  selected: Selected[]
): boolean => {
  let firstVLAN: number;
  return selected.some(({ nicId, linkId }) => {
    const nic = getInterfaceById(machine, nicId, linkId);
    // Store the first VLAN.
    if (nic && typeof firstVLAN !== "number") {
      firstVLAN = nic.vlan_id;
    }
    // Use the first VLAN as the predicate for all other selected interfaces.
    return nic?.vlan_id !== firstVLAN;
  });
};

const MachineNetworkActions = ({
  expanded,
  setExpanded,
  selected,
  setHeaderContent,
  systemId,
}: Props): JSX.Element | null => {
  const machine = useSelector((state: RootState) =>
    machineSelectors.getById(state, systemId)
  );
  const isAllNetworkingDisabled = useIsAllNetworkingDisabled(machine);
  const sendAnalytics = useSendAnalytics();

  if (!machine) {
    return null;
  }

  const actions: Action[] = [
    {
      disabled: [
        [isAllNetworkingDisabled, NETWORK_DISABLED_MESSAGE],
        [selected.length === 0, "No interfaces are selected"],
        [selected.length === 1, "A bond must include more than one interface"],
        [
          !selectedAllOfType(machine, selected, NetworkInterfaceTypes.PHYSICAL),
          "A bond can only include physical interfaces",
        ],
        [
          selectedDifferentVLANs(machine, selected),
          "All selected interfaces must be on the same VLAN",
        ],
      ],
      label: "Create bond",
      state: ExpandedState.ADD_BOND,
    },
    {
      disabled: [
        [isAllNetworkingDisabled, NETWORK_DISABLED_MESSAGE],
        [selected.length === 0, "No interfaces are selected"],
        [
          selected.length > 1,
          "A bridge can only be created from one interface",
        ],
        [
          selectedIncludesType(machine, selected, NetworkInterfaceTypes.ALIAS),
          "A bridge can not be created from an alias",
        ],
        [
          selectedIncludesType(machine, selected, NetworkInterfaceTypes.BRIDGE),
          "A bridge can not be created from another bridge",
        ],
      ],
      label: "Create bridge",
      state: ExpandedState.ADD_BRIDGE,
    },
  ];

  return (
    <NetworkActionRow
      expanded={expanded}
      extraActions={actions}
      node={machine}
      rightContent={
        <Button
          className="u-no-margin--bottom"
          disabled={isAllNetworkingDisabled}
          onClick={() => {
            setHeaderContent({
              view: MachineHeaderViews.TEST_MACHINE,
              extras: { applyConfiguredNetworking: true },
            });
            sendAnalytics(
              "Machine details",
              "Validate network configuration",
              "Network tab"
            );
          }}
        >
          Validate network configuration
        </Button>
      }
      setExpanded={setExpanded}
    />
  );
};

export default MachineNetworkActions;
