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

export const getRowPropsAreEqual = (
  prevProps: SubnetsTableRow,
  nextProps: SubnetsTableRow
): boolean => {
  return (
    prevProps.columns.fabric.label === nextProps.columns.fabric.label &&
    prevProps.columns.vlan.label === nextProps.columns.vlan.label &&
    prevProps.columns.vlan.href === nextProps.columns.vlan.href &&
    prevProps.columns.dhcp.label === nextProps.columns.dhcp.label &&
    prevProps.columns.subnet.label === nextProps.columns.subnet.label &&
    prevProps.columns.subnet.href === nextProps.columns.subnet.href &&
    prevProps.columns.ips.label === nextProps.columns.ips.label &&
    prevProps.columns.space.label === nextProps.columns.space.label &&
    prevProps.columns.space.href === nextProps.columns.space.href &&
    prevProps.columns.space.isVisuallyHidden ===
      nextProps.columns.space.isVisuallyHidden &&
    prevProps.columns.vlan.isVisuallyHidden ===
      nextProps.columns.vlan.isVisuallyHidden &&
    prevProps.columns.fabric.isVisuallyHidden ===
      nextProps.columns.fabric.isVisuallyHidden
  );
};

const sortBySortKey =
  (key: keyof SortData, { reverse } = { reverse: false }) =>
  (a: SubnetsTableRow, b: SubnetsTableRow): number => {
    if (a.sortData[key] > b.sortData[key]) return reverse ? -1 : 1;
    if (a.sortData[key] < b.sortData[key]) return reverse ? 1 : -1;
    return 0;
  };

const getColumn = (label: string | null, href?: string | null) => ({
  label,
  href: href ? href : null,
  isVisuallyHidden: false,
});

const markRepeatedFabricRows = (rows: SubnetsTableRow[]): SubnetsTableRow[] => {
  rows.forEach((row, index) => {
    const previousRow: SubnetsTableRow = rows[index - 1];

    if (row.columns && index > 0) {
      if (row.sortData?.fabricId === previousRow?.sortData?.fabricId) {
        row.columns.fabric = { ...row.columns.fabric, isVisuallyHidden: true };
      }
      if (row.sortData?.vlanId === previousRow?.sortData?.vlanId) {
        row.columns.vlan = { ...row.columns.vlan, isVisuallyHidden: true };
      }
    }
  });

  return rows;
};

const markRepeatedSpaceRows = (rows: SubnetsTableRow[]): SubnetsTableRow[] => {
  rows.forEach((row, index) => {
    const previousRow: SubnetsTableRow = rows[index - 1];

    if (row.columns.space?.label === previousRow?.columns.space?.label) {
      row.columns.space = { ...row.columns.space, isVisuallyHidden: true };
    }
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
    columns: {
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
    },
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

  return markRepeatedSpaceRows(rows.sort(sortBySortKey("cidr")));
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

  return markRepeatedSpaceRows(rows.sort(sortBySortKey("spaceName")));
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

  return markRepeatedFabricRows(rows.sort(sortBySortKey("fabricName")));
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
