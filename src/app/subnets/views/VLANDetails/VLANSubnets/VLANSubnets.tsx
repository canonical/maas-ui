import { GenericTable } from "@canonical/maas-react-components";
import { Icon } from "@canonical/react-components";
import type { ColumnDef } from "@tanstack/react-table";
import { useSelector } from "react-redux";

import SubnetLink from "@/app/base/components/SubnetLink";
import TitledSection from "@/app/base/components/TitledSection";
import type { RootState } from "@/app/store/root/types";
import subnetSelectors from "@/app/store/subnet/selectors";
import type { VLAN, VLANMeta } from "@/app/store/vlan/types";

type Props = {
  id: VLAN[VLANMeta.PK] | null;
};

type SubnetRow = {
  id: number;
  cidr: string;
  usage: number;
  usage_string: string;
  managed: boolean;
  allow_proxy: boolean;
  allow_dns: boolean;
};

const renderAccessibleCell = (label: string, content: React.ReactNode) => {
  return <span aria-label={label}>{content}</span>;
};

const columns: ColumnDef<SubnetRow>[] = [
  {
    accessorKey: "cidr",
    header: "Subnet",
    cell: ({ row }) =>
      renderAccessibleCell("Subnet", <SubnetLink id={row.original.id} />),
  },
  {
    accessorKey: "usage",
    header: "Usage",
    cell: ({ row }) => renderAccessibleCell("Usage", row.original.usage_string),
  },
  {
    accessorKey: "managed",
    header: "Managed allocation",
    cell: ({ row }) =>
      renderAccessibleCell(
        "Managed allocation",
        <Icon name={row.original.managed ? "tick" : "close"}>
          {row.original.managed ? "Yes" : "No"}
        </Icon>
      ),
  },
  {
    accessorKey: "allow_proxy",
    header: "Proxy access",
    cell: ({ row }) =>
      renderAccessibleCell(
        "Proxy access",
        <Icon name={row.original.allow_proxy ? "tick" : "close"}>
          {row.original.allow_proxy ? "Yes" : "No"}
        </Icon>
      ),
  },
  {
    accessorKey: "allow_dns",
    header: "Allows DNS resolution",
    cell: ({ row }) =>
      renderAccessibleCell(
        "Allows DNS resolution",
        <Icon name={row.original.allow_dns ? "tick" : "close"}>
          {row.original.allow_dns ? "Yes" : "No"}
        </Icon>
      ),
  },
];

const VLANSubnets = ({ id }: Props): React.ReactElement | null => {
  const subnets = useSelector((state: RootState) =>
    subnetSelectors.getByVLAN(state, id)
  );
  const subnetsLoading = useSelector(subnetSelectors.loading);

  return (
    <TitledSection title="Subnets on this VLAN">
      <GenericTable<SubnetRow>
        className="vlan-subnets"
        columns={columns}
        data={subnets.map((subnet) => ({
          id: subnet.id,
          cidr: subnet.cidr,
          usage: subnet.statistics.usage,
          usage_string: subnet.statistics.usage_string,
          managed: subnet.managed,
          allow_proxy: subnet.allow_proxy,
          allow_dns: subnet.allow_dns,
        }))}
        isLoading={subnetsLoading}
        noData="There are no subnets on this VLAN"
        sortBy={[{ id: "cidr", desc: false }]}
        variant="regular"
      />
    </TitledSection>
  );
};

export default VLANSubnets;
