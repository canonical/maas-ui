import {
  Table,
  TableCell,
  TableHeader,
  TableRow,
  Tooltip,
} from "@canonical/react-components";
import { useSelector } from "react-redux";

import MacAddressDisplay from "@/app/base/components/MacAddressDisplay";
import TooltipButton from "@/app/base/components/TooltipButton";
import { useIsAllNetworkingDisabled } from "@/app/base/hooks";
import type { Device } from "@/app/store/device/types";
import fabricSelectors from "@/app/store/fabric/selectors";
import { getFabricDisplay } from "@/app/store/fabric/utils";
import type { MachineDetails } from "@/app/store/machine/types";
import subnetSelectors from "@/app/store/subnet/selectors";
import type { NetworkInterface } from "@/app/store/types/node";
import {
  getInterfaceIPAddressOrMode,
  getInterfaceSubnet,
} from "@/app/store/utils";
import vlanSelectors from "@/app/store/vlan/selectors";
import { getDHCPStatus } from "@/app/store/vlan/utils";
import { formatSpeedUnits } from "@/app/utils";

type Props = {
  interfaces: NetworkInterface[];
  node: Device | MachineDetails;
};

const NetworkCardTable = ({ interfaces, node }: Props): React.ReactElement => {
  const fabrics = useSelector(fabricSelectors.all);
  const vlans = useSelector(vlanSelectors.all);
  const subnets = useSelector(subnetSelectors.all);
  const isAllNetworkingDisabled = useIsAllNetworkingDisabled(node);

  return (
    <Table className="network-card-table" responsive>
      <thead>
        <TableRow>
          <TableHeader className="name">
            Name
            <br />
            <span className="u-text--muted">MAC address</span>
          </TableHeader>
          <TableHeader className="ip">
            IP address
            <br />
            <span className="u-text--muted">Subnet</span>
          </TableHeader>
          <TableHeader className="speed">Link speed</TableHeader>
          <TableHeader className="fabric">
            Fabric
            <TooltipButton
              className="u-nudge-right--small"
              message="Untagged traffic only"
              position="top-right"
            />
            <br />
            <span className="u-text--muted">VLAN</span>
          </TableHeader>
          <TableHeader className="dhcp">DHCP</TableHeader>
          <TableHeader className="sriov">SR-IOV</TableHeader>
        </TableRow>
      </thead>
      <tbody>
        {interfaces.map((iface) => {
          const vlan = vlans.find((vlan) => vlan.id === iface.vlan_id);
          const fabric = vlan
            ? fabrics.find((fabric) => fabric.id === vlan.fabric)
            : null;
          const dhcpStatus = getDHCPStatus(vlan, vlans, fabrics);
          const subnet = getInterfaceSubnet(
            node,
            subnets,
            fabrics,
            vlans,
            isAllNetworkingDisabled,
            iface,
            iface.links ? iface.links[0] : null
          );

          return (
            <TableRow key={iface.id}>
              <TableCell className="name" data-heading="Name | MAC address">
                {iface.name}
                <br />
                <Tooltip message={iface.mac_address}>
                  <MacAddressDisplay>{iface.mac_address}</MacAddressDisplay>
                </Tooltip>
              </TableCell>
              <TableCell className="ip" data-heading="IP address | Subnet">
                {getInterfaceIPAddressOrMode(
                  node,
                  fabrics,
                  vlans,
                  iface,
                  iface.links ? iface.links[0] : null
                )}
                <br />
                <small className="u-text--muted">{subnet?.cidr}</small>
              </TableCell>
              <TableCell className="speed" data-heading="Link speed">
                {formatSpeedUnits(iface.link_speed)}
              </TableCell>
              <TableCell className="fabric" data-heading="Fabric | VLAN">
                {getFabricDisplay(fabric) || "Unknown"}
                <br />
                <small className="u-text--muted">{vlan?.name}</small>
              </TableCell>
              <TableCell className="dhcp" data-heading="DHCP">
                {dhcpStatus}
                {dhcpStatus === "Relayed" && (
                  <TooltipButton
                    className="u-nudge-right--small"
                    message={getDHCPStatus(vlan, vlans, fabrics, true)}
                    position="btm-right"
                  />
                )}
              </TableCell>
              <TableCell className="sriov" data-heading="SR-IOV">
                {iface.sriov_max_vf > 0 ? "Yes" : "No"}
              </TableCell>
            </TableRow>
          );
        })}
      </tbody>
    </Table>
  );
};

export default NetworkCardTable;
