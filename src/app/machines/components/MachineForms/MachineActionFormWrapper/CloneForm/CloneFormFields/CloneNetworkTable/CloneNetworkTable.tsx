import { GenericTable } from "@canonical/maas-react-components";
import classNames from "classnames";
import { useSelector } from "react-redux";

import type { CloneNetworkRowData } from "./useCloneNetworkTableColumns/useCloneNetworkTableColumns";
import useCloneNetworkTableColumns from "./useCloneNetworkTableColumns/useCloneNetworkTableColumns";

import { useIsAllNetworkingDisabled } from "@/app/base/hooks";
import fabricSelectors from "@/app/store/fabric/selectors";
import type { MachineDetails } from "@/app/store/machine/types";
import subnetSelectors from "@/app/store/subnet/selectors";
import { getSubnetDisplay } from "@/app/store/subnet/utils";
import type { NetworkInterface, NetworkLink } from "@/app/store/types/node";
import {
  getBondOrBridgeParents,
  getInterfaceFabric,
  getInterfaceName,
  getInterfaceNumaNodes,
  getInterfaceSubnet,
  getInterfaceTypeText,
  getLinkInterface,
  isBondOrBridgeParent,
} from "@/app/store/utils";
import vlanSelectors from "@/app/store/vlan/selectors";
import { getDHCPStatus, getVLANDisplay } from "@/app/store/vlan/utils";

type Props = {
  loadingMachineDetails?: boolean;
  machine: MachineDetails | null;
  selected: boolean;
};

export const CloneNetworkTable = ({
  loadingMachineDetails = false,
  machine,
  selected,
}: Props): React.ReactElement => {
  const fabrics = useSelector(fabricSelectors.all);
  const subnets = useSelector(subnetSelectors.all);
  const vlans = useSelector(vlanSelectors.all);
  const isAllNetworkingDisabled = useIsAllNetworkingDisabled(machine);
  let rows: CloneNetworkRowData[] = [];

  const columns = useCloneNetworkTableColumns();

  if (machine) {
    const generateRow = ({
      isParent,
      link,
      nic,
    }: {
      isParent: boolean;
      link: NetworkLink | null;
      nic: NetworkInterface | null;
    }): CloneNetworkRowData => {
      if (link && !nic) {
        [nic] = getLinkInterface(machine, link);
      }
      const fabric = getInterfaceFabric(machine, fabrics, vlans, nic, link);
      const vlan = vlans.find(({ id }) => id === nic?.vlan_id);
      const subnet = getInterfaceSubnet(
        machine,
        subnets,
        fabrics,
        vlans,
        isAllNetworkingDisabled,
        nic,
        link
      );
      const nameDisplay = getInterfaceName(machine, nic, link);
      const subnetDisplay = getSubnetDisplay(subnet, true);
      const fabricDisplay = fabric?.name || "Unconfigured";
      const vlanDisplay = getVLANDisplay(vlan);
      const typeDisplay = getInterfaceTypeText(machine, nic, link, true);
      const numaDisplay = (getInterfaceNumaNodes(machine, nic) || []).join(
        ", "
      );
      const dhcpDisplay = getDHCPStatus(vlan, vlans, fabrics);

      return {
        id: nic!.id,
        name: nameDisplay,
        subnet: subnetDisplay,
        fabric: fabricDisplay,
        vlan: vlanDisplay,
        type: typeDisplay,
        numaNodes: numaDisplay,
        dhcp: dhcpDisplay,
        isParent,
      };
    };
    rows = [];
    machine.interfaces.forEach((nic) => {
      // Childless nics are always rendered normally. Next, if the nic has any
      // parents they will be rendered right after, in order to show the
      // parent-child hierarchy. Finally, any aliases are rendered after the
      // parent-child grouping.
      if (!isBondOrBridgeParent(machine, nic)) {
        const firstLink = nic.links.length >= 1 ? nic.links[0] : null;
        const row = generateRow({
          isParent: false,
          link: firstLink,
          nic: firstLink ? null : nic,
        });
        rows.push(row);

        const parents = getBondOrBridgeParents(machine, nic);
        parents.forEach((parentNic) => {
          const row = generateRow({
            isParent: true,
            link: null,
            nic: parentNic,
          });
          rows.push(row);
        });

        // "links" refers to aliases, however the first link in the array is
        // an analog of the interface itself, so we only render the links from
        // the second link onward.
        if (nic.links.length >= 2) {
          nic.links.forEach((link, i) => {
            if (i > 0) {
              const row = generateRow({
                isParent: false,
                link,
                nic: null,
              });
              rows.push(row);
            }
          });
        }
      }
    });
  }

  return (
    <GenericTable
      aria-label="Clone network"
      className={classNames("clone-table--network", {
        "not-selected": !selected,
      })}
      columns={columns}
      data={rows}
      isLoading={loadingMachineDetails}
      noData={machine ? "No network information detected." : null}
    />
  );
};

export default CloneNetworkTable;
