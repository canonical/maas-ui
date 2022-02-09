import { MainTable, Spinner } from "@canonical/react-components";
import { useSelector } from "react-redux";

import TitledSection from "app/base/components/TitledSection";
import type { RootState } from "app/store/root/types";
import subnetSelectors from "app/store/subnet/selectors";
import type {
  Subnet,
  SubnetDetails,
  SubnetIP,
  SubnetMeta,
} from "app/store/subnet/types";
import { IPAddressType, IPAddressTypeLabel } from "app/store/subnet/types/enum";
import { NodeType, NodeTypeDisplay } from "app/store/types/node";

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

const getType = (ip: SubnetIP) => {
  return IPAddressTypeLabel[
    IPAddressType[ip.alloc_type] as keyof typeof IPAddressTypeLabel
  ];
};

const getUsage = (ip: SubnetIP) => {
  const isContainer = ip.node_summary?.is_container;
  const nodeType = ip.node_summary?.node_type;
  if (nodeType === 1 && isContainer) {
    return "Container";
  }
  if (nodeType) {
    return NodeTypeDisplay[NodeType[nodeType] as keyof typeof NodeTypeDisplay];
  } else {
    return "Unknown";
  }
};

const SubnetUsedIPs = ({ subnetId }: Props): JSX.Element => {
  const subnet = useSelector((state: RootState) =>
    subnetSelectors.getById(state, subnetId)
  ) as SubnetDetails;
  const loading = useSelector(subnetSelectors.loading);
  const ip_addresses = subnet.ip_addresses;

  return (
    <TitledSection title="Used IP addresses">
      <MainTable
        className="p-table-expanding--light"
        defaultSort="name"
        defaultSortDirection="descending"
        sortable
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
            sortKey: "ip_addresses",
          },
          {
            content: Labels.Type,
            sortKey: "end_ip",
          },
          {
            content: Labels.Node,
            sortKey: "owner",
          },
          {
            content: Labels.Interface,
            sortKey: "type",
          },
          {
            content: Labels.Usage,
            sortKey: "comment",
          },
          {
            content: Labels.Owner,
            sortKey: "owner",
          },
          {
            content: Labels.LastSeen,
            sortKey: "updated",
          },
        ]}
        rows={ip_addresses?.map((ip_address) => {
          const type = getType(ip_address);
          const usage = getUsage(ip_address);
          return {
            columns: [
              {
                "aria-label": Labels.IpAddresses,
                content: ip_address.ip,
              },
              {
                "aria-label": Labels.Type,
                content: type,
              },
              {
                "aria-label": Labels.Node,
                content: ip_address.node_summary?.hostname,
              },
              {
                "aria-label": Labels.Interface,
                content: ip_address.node_summary?.via,
              },
              {
                "aria-label": Labels.Usage,
                content: usage,
              },
              {
                "aria-label": Labels.Owner,
                content: ip_address.user,
              },
              {
                "aria-label": Labels.LastSeen,
                content: ip_address.updated,
              },
            ],
          };
        })}
      />
    </TitledSection>
  );
};

export default SubnetUsedIPs;
