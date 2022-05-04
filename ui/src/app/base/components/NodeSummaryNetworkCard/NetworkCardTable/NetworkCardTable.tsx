import {
  Table,
  TableCell,
  TableHeader,
  TableRow,
} from "@canonical/react-components";
import { useSelector } from "react-redux";

import TooltipButton from "app/base/components/TooltipButton";
import fabricSelectors from "app/store/fabric/selectors";
import { getFabricDisplay } from "app/store/fabric/utils";
import type { NetworkInterface } from "app/store/types/node";
import vlanSelectors from "app/store/vlan/selectors";
import { getDHCPStatus } from "app/store/vlan/utils";
import { formatSpeedUnits } from "app/utils";

type Props = { interfaces: NetworkInterface[] };

const NetworkCardInterface = ({ interfaces }: Props): JSX.Element => {
  const fabrics = useSelector(fabricSelectors.all);
  const vlans = useSelector(vlanSelectors.all);

  return (
    <Table className="network-card-table" responsive>
      <thead>
        <TableRow>
          <TableHeader className="name">Name</TableHeader>
          <TableHeader className="mac">MAC</TableHeader>
          <TableHeader className="speed">Link speed</TableHeader>
          <TableHeader className="fabric">
            Fabric
            <TooltipButton
              className="u-nudge-right--small"
              message="Untagged traffic only"
              position="top-right"
            />
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

          return (
            <TableRow key={iface.id}>
              <TableCell data-heading="Name" className="name">
                {iface.name}
              </TableCell>
              <TableCell data-heading="MAC" className="mac">
                {iface.mac_address}
              </TableCell>
              <TableCell data-heading="Link speed" className="speed">
                {formatSpeedUnits(iface.link_speed)}
              </TableCell>
              <TableCell data-heading="Fabric" className="fabric">
                {getFabricDisplay(fabric) || "Unknown"}
              </TableCell>
              <TableCell data-heading="DHCP" className="dhcp">
                {dhcpStatus}
                {dhcpStatus === "Relayed" && (
                  <TooltipButton
                    className="u-nudge-right--small"
                    message={getDHCPStatus(vlan, vlans, fabrics, true)}
                    position="btm-right"
                  />
                )}
              </TableCell>
              <TableCell data-heading="SR-IOV" className="sriov">
                {iface.sriov_max_vf > 0 ? "Yes" : "No"}
              </TableCell>
            </TableRow>
          );
        })}
      </tbody>
    </Table>
  );
};

export default NetworkCardInterface;
