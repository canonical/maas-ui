import { useSelector } from "react-redux";

import type { RootState } from "app/store/root/types";
import subnetSelectors from "app/store/subnet/selectors";
import vlanSelectors from "app/store/vlan/selectors";
import type { VLAN, VLANMeta } from "app/store/vlan/types";

export const useGetVlanSubnets = (id: VLAN[VLANMeta.PK] | null) => {
  const vlan = useSelector((state: RootState) =>
    vlanSelectors.getById(state, id)
  );
  const vlanSubnets = useSelector((state: RootState) =>
    subnetSelectors.getByIds(state, vlan ? vlan.subnet_ids : [])
  );

  return vlanSubnets;
};
