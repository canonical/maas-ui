import {
  Table,
  TableCell,
  TableHeader,
  TableRow,
  Tooltip,
} from "@canonical/react-components";
import { useSelector } from "react-redux";

import fabricSelectors from "app/store/fabric/selectors";
import type { Fabric } from "app/store/fabric/types";
import type { NetworkInterface } from "app/store/machine/types";
import vlanSelectors from "app/store/vlan/selectors";
import type { VLAN } from "app/store/vlan/types";
import { formatSpeedUnits } from "app/utils";

/**
 * Returns the name of an interface's fabric.
 * @param iface - the interface from which to get the fabric name.
 * @param fabrics - list of fabrics to search.
 * @param vlans - list of VLANs to search.
 * @returns the interface's fabric name.
 */
const getInterfaceFabricName = (
  iface: NetworkInterface,
  fabrics: Fabric[],
  vlans: VLAN[]
): string => {
  const vlan = vlans.find((vlan) => vlan.id === iface.vlan_id);
  if (vlan) {
    const fabric = fabrics.find((fabric) => fabric.id === vlan.fabric);
    if (fabric) {
      return fabric.name;
    }
  }
  return "Unknown";
};

/**
 * Returns the DHCP status of an interface.
 * @param iface - the interface from which to get the DHCP status.
 * @param fabrics - list of fabrics to search.
 * @param vlans - list of VLANs to search.
 * @param verbose - whether to return additional relay information, if applicable
 * @returns interface's DHCP status.
 */
const getInterfaceDHCPStatus = (
  iface: NetworkInterface,
  fabrics: Fabric[],
  vlans: VLAN[],
  verbose = false
): string => {
  const vlan = vlans.find((vlan) => vlan.id === iface.vlan_id);
  if (vlan) {
    if (vlan.external_dhcp) {
      return `External (${vlan.external_dhcp})`;
    }

    if (vlan.dhcp_on) {
      return "MAAS-provided";
    }

    if (vlan.relay_vlan) {
      const fabric = fabrics.find((fabric) => fabric.id === vlan.fabric);
      if (fabric && verbose) {
        return `Relayed via ${getInterfaceFabricName(iface, fabrics, vlans)}.${
          vlan.name
        }`;
      }
      return "Relayed";
    }
  }
  return "No DHCP";
};

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
          const dhcpStatus = getInterfaceDHCPStatus(iface, fabrics, vlans);

          return (
            <TableRow key={iface.id}>
              <TableCell className="name">{iface.name}</TableCell>
              <TableCell className="mac">{iface.mac_address}</TableCell>
              <TableCell className="speed">
                {formatSpeedUnits(iface.link_speed)}
              </TableCell>
              <TableCell className="fabric">
                {getInterfaceFabricName(iface, fabrics, vlans)}
              </TableCell>
              <TableCell className="dhcp">
                {dhcpStatus}
                {dhcpStatus === "Relayed" && (
                  <Tooltip
                    message={getInterfaceDHCPStatus(
                      iface,
                      fabrics,
                      vlans,
                      true
                    )}
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
