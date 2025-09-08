import { SubnetsColumns } from "./constants";
import type {
  FabricTableRow,
  GroupByKey,
  SortData,
  SpaceTableRow,
  SubnetsTableData,
  SubnetsTableRow,
} from "./types";
import type { SubnetsRowData } from "./useSubnetsTableColumns/useSubnetsTableColumns";

import type { Fabric } from "@/app/store/fabric/types";
import { getFabricById, getFabricDisplay } from "@/app/store/fabric/utils";
import type { Space } from "@/app/store/space/types";
import { getSpaceById, getSpaceDisplay } from "@/app/store/space/utils";
import type { Subnet } from "@/app/store/subnet/types";
import {
  getAvailableIPs,
  getSubnetDisplay,
  getSubnetsInSpace,
  getSubnetsInVLAN,
} from "@/app/store/subnet/utils";
import type { VLAN } from "@/app/store/vlan/types";
import {
  getDHCPStatus,
  getVlanById,
  getVLANDisplay,
  getVLANsInFabric,
} from "@/app/store/vlan/utils";
import {
  getFabricLink,
  getSpaceLink,
  getSubnetLink,
  getVLANLink,
} from "@/app/subnets/urls";
import { simpleSortByKey } from "@/app/utils";

const getColumn = (label: string | null, href?: string | null) => ({
  label,
  href: href ? href : null,
  isVisuallyHidden: false,
});

export const groupRowsByFabric = (
  sourceRows: SubnetsTableRow[]
): FabricTableRow[] => {
  const rows: FabricTableRow[] = [];
  sourceRows.forEach((sourceRow, index) => {
    const previousRow = rows[rows.length - 1];

    if (sourceRow && index > 0) {
      if (sourceRow.sortData?.fabricId === previousRow?.fabricId) {
        rows[rows.length - 1].networks.push(sourceRow);
      } else {
        rows.push({
          fabricId: sourceRow.sortData?.fabricId,
          fabricName: sourceRow.sortData?.fabricName,
          isCollapsed: false,
          networks: [sourceRow],
        });
      }
    }
    if (index === 0) {
      rows.push({
        fabricId: sourceRow.sortData?.fabricId,
        fabricName: sourceRow.sortData?.fabricName,
        isCollapsed: false,
        networks: [sourceRow],
      });
    }
  });
  return rows;
};

export const groupRowsBySpace = (
  sourceRows: SubnetsTableRow[]
): SpaceTableRow[] => {
  const rows: SpaceTableRow[] = [];
  sourceRows.forEach((sourceRow, index) => {
    const previousRow = rows[rows.length - 1];

    if (sourceRow && index > 0) {
      if (sourceRow.sortData?.spaceName === previousRow?.spaceName) {
        rows[rows.length - 1].networks.push(sourceRow);
      } else {
        rows.push({
          spaceName: sourceRow.sortData?.spaceName,
          isCollapsed: false,
          networks: [sourceRow],
        });
      }
    }
    if (index === 0) {
      rows.push({
        spaceName: sourceRow.sortData?.spaceName,
        isCollapsed: false,
        networks: [sourceRow],
      });
    }
  });
  return rows;
};

export const groupSubnetData = (
  data: SubnetsTableRow[],
  groupBy: GroupByKey = "fabric"
): Record<number | string, { count: number }> => {
  return data.reduce<Record<number | string, { count: number }>>((acc, cur) => {
    const name =
      groupBy === "fabric" ? cur.sortData?.fabricName : cur.sortData?.spaceName;
    if (acc[name]) {
      acc[name].count += 1;
    } else {
      acc[name] = { count: 1 };
    }

    return acc;
  }, {});
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
    "aria-label": fabric?.name,
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
        const vlanHasSubnets = vlan.subnet_ids.length > 0;
        if (!vlanHasSubnets) {
          const space = getSpaceById(data.spaces, vlan.space);
          rows.push(getRowData({ fabric, vlan, space, data }));
        } else {
          const subnetsInVLAN = getSubnetsInVLAN(data.subnets, vlan.id);
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
  data: SubnetsRowData[],
  searchText: string
) => {
  if (searchText.length === 0) {
    return data;
  } else {
    return data.filter(
      (subnet) =>
        subnet.name.includes(searchText) ||
        (subnet.vlan?.name && subnet.vlan.name.includes(searchText)) ||
        (subnet.fabric?.name && subnet.fabric.name.includes(searchText)) ||
        (subnet.space?.name && subnet.space.name.includes(searchText))
    );
  }
};

export const filterSubnetsBySearchText_LEGACY = (
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
