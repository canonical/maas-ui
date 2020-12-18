import {
  Table,
  TableCell,
  TableHeader,
  TableRow,
  Tooltip,
} from "@canonical/react-components";
import { useSelector } from "react-redux";

import fabricSelectors from "app/store/fabric/selectors";
import { getFabricDisplay } from "app/store/fabric/utils";
import type { NetworkInterface } from "app/store/machine/types";
import vlanSelectors from "app/store/vlan/selectors";
import { getDHCPStatus } from "app/store/vlan/utils";
import { formatSpeedUnits } from "app/utils";

type Props = { interfaces: NetworkInterface[] };

const NetworkCardInterface = ({ interfaces }: Props): JSX.Element => {
  const fabrics = useSelector(fabricSelectors.all);
  const vlans = useSelector(vlanSelectors.all);

  return (
    <Table className="network-card-table">
      <thead>
        <TableRow>
          <TableHeader className="name">Name</TableHeader>
          <TableHeader className="mac">MAC</TableHeader>
          <TableHeader className="speed">Link speed</TableHeader>
          <TableHeader className="fabric">
            Fabric
            <Tooltip message="Untagged traffic only" position="top-right">
              <div className="u-nudge-right--small">
                <i className="p-icon--information"></i>
              </div>
            </Tooltip>
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
              <TableCell className="name">{iface.name}</TableCell>
              <TableCell className="mac">{iface.mac_address}</TableCell>
              <TableCell className="speed">
                {formatSpeedUnits(iface.link_speed)}
              </TableCell>
              <TableCell className="fabric">
                {getFabricDisplay(fabric) || "Unknown"}
              </TableCell>
              <TableCell className="dhcp">
                {dhcpStatus}
                {dhcpStatus === "Relayed" && (
                  <Tooltip
                    message={getDHCPStatus(vlan, vlans, fabrics, true)}
                    position="btm-right"
                  >
                    <div className="u-nudge-right--small">
                      <i className="p-icon--information"></i>
                    </div>
                  </Tooltip>
                )}
              </TableCell>
              <TableCell className="sriov">
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
