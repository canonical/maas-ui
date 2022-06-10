import { MainTable, Spinner } from "@canonical/react-components";
import { useSelector } from "react-redux";

import TitledSection from "app/base/components/TitledSection";
import NodeLink from "app/base/components/node/NodeLink";
import type { RootState } from "app/store/root/types";
import subnetSelectors from "app/store/subnet/selectors";
import type { Subnet, SubnetMeta } from "app/store/subnet/types";
import {
  getIPTypeDisplay,
  getIPUsageDisplay,
  isSubnetDetails,
} from "app/store/subnet/utils";

export type Props = {
  subnetId: Subnet[SubnetMeta.PK] | null;
};

export enum Labels {
  IpAddresses = "IP addresses",
  Type = "Type",
  Node = "Node",
  Interface = "interface",
  Usage = "Usage",
  Owner = "Owner",
  LastSeen = "Last Seen",
}

const generateRows = (subnet: Subnet | null) => {
  if (!isSubnetDetails(subnet)) {
    return [];
  }
  return subnet.ip_addresses.map((ip_address) => {
    const { alloc_type, ip, node_summary, updated, user } = ip_address;
    const type = getIPTypeDisplay(alloc_type);
    const usage = getIPUsageDisplay(ip_address);
    return {
      columns: [
        {
          "aria-label": Labels.IpAddresses,
          className: "u-break-word",
          content: ip,
        },
        {
          "aria-label": Labels.Type,
          content: type,
        },
        {
          "aria-label": Labels.Node,
          content: node_summary ? (
            <NodeLink
              nodeType={node_summary.node_type}
              systemId={node_summary.system_id}
            />
          ) : (
            "—"
          ),
        },
        {
          "aria-label": Labels.Interface,
          content: node_summary?.via || "—",
        },
        {
          "aria-label": Labels.Usage,
          content: usage,
        },
        {
          "aria-label": Labels.Owner,
          content: user || "—",
        },
        {
          "aria-label": Labels.LastSeen,
          content: updated,
        },
      ],
      sortData: {
        interface: node_summary?.via || "—",
        ip,
        node: node_summary?.hostname || "—",
        type,
        usage,
        user: user || "—",
      },
    };
  });
};

const SubnetUsedIPs = ({ subnetId }: Props): JSX.Element => {
  const subnet = useSelector((state: RootState) =>
    subnetSelectors.getById(state, subnetId)
  );
  const loading = useSelector(subnetSelectors.loading);

  return (
    <TitledSection title="Used IP addresses">
      <MainTable
        className="used-ip-table p-table-expanding--light"
        defaultSort="ip"
        defaultSortDirection="ascending"
        sortable
        responsive
        emptyStateMsg={
          loading ? (
            <Spinner text="Loading..." />
          ) : (
            "No IP addresses for this subnet."
          )
        }
        headers={[
          {
            content: Labels.IpAddresses,
            sortKey: "ip",
          },
          {
            content: Labels.Type,
            sortKey: "type",
          },
          {
            content: Labels.Node,
            sortKey: "node",
          },
          {
            content: Labels.Interface,
            sortKey: "interface",
          },
          {
            content: Labels.Usage,
            sortKey: "usage",
          },
          {
            content: Labels.Owner,
            sortKey: "user",
          },
          {
            content: Labels.LastSeen,
          },
        ]}
        rows={generateRows(subnet)}
      />
    </TitledSection>
  );
};

export default SubnetUsedIPs;
