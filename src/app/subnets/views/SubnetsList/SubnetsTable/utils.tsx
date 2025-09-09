import type { SubnetsRowData } from "./useSubnetsTableColumns/useSubnetsTableColumns";

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
