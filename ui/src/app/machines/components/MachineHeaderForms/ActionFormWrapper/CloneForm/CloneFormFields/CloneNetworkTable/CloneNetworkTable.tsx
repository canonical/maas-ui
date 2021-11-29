import { MainTable } from "@canonical/react-components";
import type { MainTableRow } from "@canonical/react-components/dist/components/MainTable/MainTable";
import classNames from "classnames";
import { useSelector } from "react-redux";

import DoubleRow from "app/base/components/DoubleRow";
import Placeholder from "app/base/components/Placeholder";
import fabricSelectors from "app/store/fabric/selectors";
import type { MachineDetails } from "app/store/machine/types";
import {
  getBondOrBridgeParents,
  getInterfaceFabric,
  getInterfaceName,
  getInterfaceNumaNodes,
  getInterfaceSubnet,
  getInterfaceTypeText,
  getLinkInterface,
  isBondOrBridgeParent,
  useIsAllNetworkingDisabled,
} from "app/store/machine/utils";
import subnetSelectors from "app/store/subnet/selectors";
import { getSubnetDisplay } from "app/store/subnet/utils";
import type { NetworkInterface, NetworkLink } from "app/store/types/node";
import vlanSelectors from "app/store/vlan/selectors";
import { getDHCPStatus, getVLANDisplay } from "app/store/vlan/utils";

type Props = {
  loadingMachineDetails?: boolean;
  machine: MachineDetails | null;
  selected: boolean;
};

export const CloneNetworkTable = ({
  loadingMachineDetails = false,
  machine,
  selected,
}: Props): JSX.Element => {
  const fabrics = useSelector(fabricSelectors.all);
  const subnets = useSelector(subnetSelectors.all);
  const vlans = useSelector(vlanSelectors.all);
  const isAllNetworkingDisabled = useIsAllNetworkingDisabled(machine);
  let rows: MainTableRow[] = [];

  if (loadingMachineDetails) {
    rows = Array.from(Array(4)).map(() => ({
      columns: [
        {
          className: "name-col",
          content: (
            <DoubleRow
              primary={<Placeholder>Name</Placeholder>}
              secondary={<Placeholder>Subnet</Placeholder>}
            />
          ),
        },
        {
          className: "fabric-col",
          content: (
            <DoubleRow
              primary={<Placeholder>Fabric name</Placeholder>}
              secondary={<Placeholder>VLAN</Placeholder>}
            />
          ),
        },
        {
          className: "type-col",
          content: (
            <DoubleRow
              primary={<Placeholder>Disk type</Placeholder>}
              secondary={<Placeholder>X, X</Placeholder>}
            />
          ),
        },
        {
          className: "dhcp-col",
          content: <Placeholder>DHCP</Placeholder>,
        },
      ],
    }));
  } else if (machine) {
    const generateRow = ({
      isParent,
      link,
      nic,
    }: {
      isParent: boolean;
      link: NetworkLink | null;
      nic: NetworkInterface | null;
    }) => {
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
        columns: [
          {
            className: "name-col",
            content: (
              <DoubleRow
                primary={nameDisplay}
                primaryTitle={nameDisplay}
                secondary={!isParent ? subnetDisplay : null}
                secondaryTitle={subnetDisplay}
              />
            ),
            "data-testid": "name-subnet",
          },
          {
            className: "fabric-col",
            content: !isParent ? (
              <DoubleRow
                primary={fabricDisplay}
                primaryTitle={fabricDisplay}
                secondary={vlanDisplay}
                secondaryTitle={vlanDisplay}
              />
            ) : null,
            "data-testid": "fabric-vlan",
          },
          {
            className: "type-col",
            content: (
              <DoubleRow
                primary={typeDisplay}
                primaryTitle={typeDisplay}
                secondary={numaDisplay}
                secondaryTitle={numaDisplay}
              />
            ),
            "data-testid": "type-numa",
          },
          {
            className: "dhcp-col",
            content: !isParent ? dhcpDisplay : null,
            "data-testid": "dhcp",
          },
        ],
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
    <MainTable
      className={classNames("clone-table--network", {
        "not-selected": !selected,
      })}
      emptyStateMsg={machine ? "No network information detected." : null}
      headers={[
        {
          className: "name-col",
          content: (
            <>
              <div>Interface</div>
              <div>Subnet</div>
            </>
          ),
        },
        {
          className: "fabric-col",
          content: (
            <>
              <div>Fabric</div>
              <div>VLAN</div>
            </>
          ),
        },
        {
          className: "type-col",
          content: (
            <>
              <div>Type</div>
              <div>NUMA node</div>
            </>
          ),
        },
        {
          className: "dhcp-col",
          content: "DHCP",
        },
      ]}
      rows={rows}
    />
  );
};

export default CloneNetworkTable;
