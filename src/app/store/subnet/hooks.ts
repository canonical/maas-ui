import { useSelector } from "react-redux";

import { getHasIPAddresses } from "./utils";

import { useFetchActions } from "app/base/hooks";
import type { RootState } from "app/store/root/types";
import { actions as subnetActions } from "app/store/subnet";
import subnetSelectors from "app/store/subnet/selectors";
import type { Subnet, SubnetMeta } from "app/store/subnet/types";
import { actions as vlanActions } from "app/store/vlan";
import vlanSelectors from "app/store/vlan/selectors";

/**
 * Get if DHCP is enabled on a given subnet
 * @param id - The id of the subnet to check.
 */
export const useIsDHCPEnabled = (
  id?: Subnet[SubnetMeta.PK] | null
): boolean => {
  const subnet = useSelector((state: RootState) =>
    subnetSelectors.getById(state, id)
  );
  const vlanOnSubnet = useSelector((state: RootState) =>
    vlanSelectors.getById(state, subnet?.vlan)
  );

  useFetchActions([vlanActions.fetch, subnetActions.fetch]);

  return vlanOnSubnet?.dhcp_on || false;
};

/**
 * Get if a subnet can be deleted.
 * @param id - The id of the subnet to check.
 */
export const useCanBeDeleted = (id?: Subnet[SubnetMeta.PK] | null): boolean => {
  const subnet = useSelector((state: RootState) =>
    subnetSelectors.getById(state, id)
  );
  const isDHCPEnabled = useIsDHCPEnabled(id);

  useFetchActions([subnetActions.fetch]);

  return !isDHCPEnabled || (isDHCPEnabled && !getHasIPAddresses(subnet));
};
