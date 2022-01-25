import type { Fabric } from "app/store/fabric/types";
import type { Space } from "app/store/space/types";
import type { Subnet } from "app/store/subnet/types";
import type { VLAN } from "app/store/vlan/types";

export type GroupByKey = "fabric" | "space";

export type SubnetsTableData = {
  fabrics: Fabric[];
  vlans: VLAN[];
  subnets: Subnet[];
  spaces: Space[];
};

export type SubnetsTableColumn = {
  isVisuallyHidden: boolean;
  label: string | null;
  href: string | null;
};

type SortKey = number | string;

export type SortData = {
  fabricId: SortKey;
  fabricName: SortKey;
  vlanId: SortKey;
  spaceName: SortKey;
  cidr: SortKey;
};

export type SubnetGroupByProps = {
  groupBy: GroupByKey;
  setGroupBy: (group: GroupByKey) => void;
};

export type SortDataKey =
  | "fabricId"
  | "fabricName"
  | "vlanId"
  | "spaceName"
  | "cidr";

export type SubnetsTableRow = {
  columns: {
    fabric: SubnetsTableColumn;
    vlan: SubnetsTableColumn;
    dhcp: SubnetsTableColumn;
    subnet: SubnetsTableColumn;
    ips: SubnetsTableColumn;
    space: SubnetsTableColumn;
  };
  sortData: SortData;
  children?: React.ReactChildren[];
};
