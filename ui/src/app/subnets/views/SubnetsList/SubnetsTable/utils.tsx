import cloneDeep from "clone-deep";

import { SubnetsColumns } from "./constants";
import type {
  SubnetsTableRow,
  SubnetsTableData,
  GroupByKey,
  SortData,
} from "./types";

import type { Fabric } from "app/store/fabric/types";
import { getFabricById, getFabricDisplay } from "app/store/fabric/utils";
import type { Space } from "app/store/space/types";
import { getSpaceDisplay, getSpaceById } from "app/store/space/utils";
import type { Subnet } from "app/store/subnet/types";
import {
  getAvailableIPs,
  getSubnetDisplay,
  getSubnetsInSpace,
  getSubnetsInVLAN,
} from "app/store/subnet/utils";
import type { VLAN } from "app/store/vlan/types";
import {
  getDHCPStatus,
  getVlanById,
  getVLANDisplay,
  getVLANsInFabric,
} from "app/store/vlan/utils";
import {
  getFabricLink,
  getSpaceLink,
  getSubnetLink,
  getVLANLink,
} from "app/subnets/urls";
import { simpleSortByKey } from "app/utils";

const getColumn = (label: string | null, href?: string | null) => ({
  label,
  href: href ? href : null,
  isVisuallyHidden: false,
});

export const groupRowsByFabricAndVlan = (
  sourceRows: SubnetsTableRow[]
): SubnetsTableRow[] => {
  const rows: SubnetsTableRow[] = [];

  sourceRows.forEach((sourceRow, index) => {
    const row = cloneDeep(sourceRow);
    const previousRow = rows[index - 1];

    if (row && index > 0) {
      if (row.sortData?.fabricId === previousRow?.sortData?.fabricId) {
        row.fabric = { ...row.fabric, isVisuallyHidden: true };
      }
      if (row.sortData?.vlanId === previousRow?.sortData?.vlanId) {
        row.vlan = { ...row.vlan, isVisuallyHidden: true };
      }
    }

    rows.push(row);
  });

  return rows;
};

export const groupRowsBySpace = (
  sourceRows: SubnetsTableRow[]
): SubnetsTableRow[] => {
  const rows: SubnetsTableRow[] = [];

  sourceRows.forEach((sourceRow, index) => {
    const row = cloneDeep(sourceRow);
    const previousRow = rows[index - 1];

    if (row && index > 0) {
      if (row.space?.label === previousRow?.space?.label) {
        row.space = { ...row.space, isVisuallyHidden: true };
      }
    }
    rows.push(row);
  });

  return rows;
};

const getRowData = ({
  fabric,
  vlan,
  subnet,
  space,
  data,
}: {
  fabric?: Fabric;
  vlan?: VLAN;
  subnet?: Subnet;
  space?: Space;
  data?: SubnetsTableData;
}): SubnetsTableRow => {
  return {
    fabric: getColumn(getFabricDisplay(fabric), getFabricLink(fabric?.id)),
    vlan: getColumn(
      getVLANDisplay(vlan),
      vlan?.id ? getVLANLink(vlan?.id) : null
    ),
    dhcp: getColumn(
      data ? getDHCPStatus(vlan, data.vlans, data.fabrics, true) : null
    ),
    subnet: getColumn(
      subnet?.id ? getSubnetDisplay(subnet) : null,
      subnet?.id ? getSubnetLink(subnet?.id) : null
    ),
    ips: getColumn(subnet ? getAvailableIPs(subnet) : null),
    space: getColumn(getSpaceDisplay(space), getSpaceLink(space?.id)),
    sortData: {
      fabricId: fabric?.id || "",
      fabricName: getFabricDisplay(fabric)?.toLowerCase() || "",
      vlanId: vlan?.id || "",

      spaceName: getSpaceDisplay(space)?.toLowerCase() || "",
      cidr: subnet?.cidr || "",
    },
  };
};

const getOrphanVLANs = (data: SubnetsTableData): SubnetsTableRow[] => {
  const rows: SubnetsTableRow[] = [];
  const subnets = [...data.subnets].filter((subnet) => subnet.space === null);
  subnets.forEach((subnet) => {
    const vlan = getVlanById(data.vlans, subnet.vlan) as VLAN;
    const fabric = getFabricById(data.fabrics, vlan.fabric) as Fabric;
    rows.push(getRowData({ fabric, vlan, subnet, space: undefined, data }));
  });

  return rows.sort((a, b) =>
    simpleSortByKey<SortData, "cidr">("cidr", { alphanumeric: true })(
      a.sortData,
      b.sortData
    )
  );
};

const getBySpaces = (data: SubnetsTableData): SubnetsTableRow[] => {
  const rows: SubnetsTableRow[] = [];

  if (data.spaces.length > 0) {
    data.spaces.forEach((space) => {
      const subnets = getSubnetsInSpace(data.subnets, space.id);

      if (subnets.length < 1) {
        rows.push(getRowData({ space, data }));
      }
      subnets.forEach((subnet) => {
        const vlan = getVlanById(data.vlans, subnet.vlan) as VLAN;
        const fabric = getFabricById(data.fabrics, vlan.fabric) as Fabric;
        rows.push(getRowData({ fabric, vlan, subnet, space, data }));
      });
    });
  }

  return rows.sort((a, b) =>
    simpleSortByKey<SortData, "spaceName">("spaceName", {
      alphanumeric: true,
    })(a.sortData, b.sortData)
  );
};

const getByFabric = (data: SubnetsTableData): SubnetsTableRow[] => {
  const rows: SubnetsTableRow[] = [];

  data.fabrics.forEach((fabric) => {
    const fabricHasVLANs = fabric.vlan_ids.length > 0;
    if (!fabricHasVLANs) {
      rows.push(getRowData({ fabric }));
    } else {
      const vlansInFabric = getVLANsInFabric(data.vlans, fabric.id).sort(
        simpleSortByKey("vid")
      );
      vlansInFabric.forEach((vlan) => {
        const subnetsInVLAN = getSubnetsInVLAN(data.subnets, vlan.id);
        const vlanHasSubnets = subnetsInVLAN.length > 0;
        if (!vlanHasSubnets) {
          const space = getSpaceById(data.spaces, vlan.space);
          rows.push(getRowData({ fabric, vlan, space, data }));
        } else {
          subnetsInVLAN.forEach((subnet) => {
            const space = getSpaceById(data.spaces, subnet.space);
            rows.push(getRowData({ fabric, vlan, subnet, space, data }));
          });
        }
      });
    }
  });

  return rows.sort((a, b) =>
    simpleSortByKey<SortData, "fabricName">("fabricName", {
      alphanumeric: true,
    })(a.sortData, b.sortData)
  );
};

export const getTableData = (
  data: SubnetsTableData,
  filterBy: GroupByKey
): SubnetsTableRow[] => {
  if (filterBy === "fabric") {
    return getByFabric(data);
  } else {
    return [...getBySpaces(data), ...getOrphanVLANs(data)];
  }
};

export const filterSubnetsBySearchText = (
  rows: SubnetsTableRow[],
  searchText: string
): SubnetsTableRow[] =>
  searchText.length === 0
    ? rows
    : rows.filter(
        (row) =>
          row?.[SubnetsColumns.SUBNET]?.label?.includes(searchText) ||
          row?.[SubnetsColumns.FABRIC]?.label?.includes(searchText) ||
          row?.[SubnetsColumns.VLAN]?.label?.includes(searchText) ||
          row?.[SubnetsColumns.SPACE]?.label?.includes(searchText)
      );
