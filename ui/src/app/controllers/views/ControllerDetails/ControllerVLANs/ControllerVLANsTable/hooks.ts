import { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import controllerSelectors from "app/store/controller/selectors";
import type {
  Controller,
  ControllerDetails,
  ControllerMeta,
} from "app/store/controller/types";
import { actions as fabricActions } from "app/store/fabric";
import fabricSelectors from "app/store/fabric/selectors";
import type { Fabric } from "app/store/fabric/types";
import { getFabricById } from "app/store/fabric/utils";
import type { RootState } from "app/store/root/types";
import { actions as subnetActions } from "app/store/subnet";
import subnetSelectors from "app/store/subnet/selectors";
import type { Subnet } from "app/store/subnet/types";
import { getSubnetsInVLAN } from "app/store/subnet/utils";
import { NetworkInterfaceTypes } from "app/store/types/enum";
import type { NetworkInterface } from "app/store/types/node";
import { actions as vlanActions } from "app/store/vlan";
import vlanSelectors from "app/store/vlan/selectors";
import type { VLAN } from "app/store/vlan/types";
import { getVlanById, getVLANDisplay } from "app/store/vlan/utils";
import { simpleSortByKey } from "app/utils";

type ControllerTableData = {
  fabric?: Fabric | null;
  vlan?: VLAN | null;
  subnet?: Subnet[];
  primary_rack?: Controller[ControllerMeta.PK] | null;
  secondary_rack?: Controller[ControllerMeta.PK] | null;
  sortKey?: string;
};

const getTableData = (
  data: {
    fabrics: Fabric[];
    vlans: VLAN[];
    subnets: Subnet[];
  },
  controller: ControllerDetails
): ControllerTableData[] => {
  const rows: ControllerTableData[] = [];
  // Keep track of VLAN IDs we've processed
  const addedVlans: Record<number, boolean> = {};

  const originalInterfaces: Record<number, NetworkInterface> = {};
  controller.interfaces.forEach((nic) => {
    originalInterfaces[nic.id] = nic;
  });

  controller.interfaces.forEach((nic) => {
    // When a interface has a child that is a bond or bridge.
    // Then that interface is not included in the interface list.
    // Parent interface with a bond or bridge child can only have
    // one child.
    if (nic.children.length === 1) {
      const child = originalInterfaces[nic.children[0]];
      if (
        child.type === NetworkInterfaceTypes.BOND ||
        child.type === NetworkInterfaceTypes.BRIDGE
      ) {
        return;
      }
    }

    const controllerVlan = getVlanById(data.vlans, nic.vlan_id);
    const controllerFabric = controllerVlan
      ? getFabricById(data.fabrics, controllerVlan.fabric)
      : undefined;

    // Skip duplicate VLANs (by id, they can share names).
    if (!addedVlans[nic.vlan_id] && controllerFabric) {
      addedVlans[nic.vlan_id] = true;
      rows.push({
        fabric: controllerFabric,
        vlan: controllerVlan,
        subnet: getSubnetsInVLAN(data.subnets, nic.vlan_id),
        sortKey: controllerFabric
          ? controllerFabric.name + "|" + getVLANDisplay(controllerVlan)
          : undefined,
        primary_rack: controllerVlan?.primary_rack
          ? controllerVlan.primary_rack
          : null,
        secondary_rack: controllerVlan?.secondary_rack
          ? controllerVlan.secondary_rack
          : null,
      });
    }
  });

  return rows.sort(
    simpleSortByKey("sortKey", {
      alphanumeric: true,
    })
  );
};

export const useControllerVLANsTable = ({
  systemId,
}: {
  systemId: Controller[ControllerMeta.PK];
}): { data: ControllerTableData[]; loaded: boolean } => {
  const dispatch = useDispatch();
  const controller = useSelector((state: RootState) =>
    controllerSelectors.getById(state, systemId)
  ) as ControllerDetails;
  const fabrics = useSelector(fabricSelectors.all);
  const fabricsLoaded = useSelector(fabricSelectors.loaded);
  const vlans = useSelector(vlanSelectors.all);
  const vlansLoaded = useSelector(vlanSelectors.loaded);
  const subnetsLoaded = useSelector(subnetSelectors.loaded);
  const subnets = useSelector(subnetSelectors.all);
  const loaded = fabricsLoaded && vlansLoaded && subnetsLoaded;

  const [state, setState] = useState<{
    data: ControllerTableData[];
    loaded: boolean;
  }>({
    data: [],
    loaded: false,
  });

  useEffect(() => {
    if (!fabricsLoaded) dispatch(fabricActions.fetch());
    if (!vlansLoaded) dispatch(vlanActions.fetch());
    if (!subnetsLoaded) dispatch(subnetActions.fetch());
  }, [dispatch, fabricsLoaded, vlansLoaded, subnetsLoaded]);

  useEffect(() => {
    if (controller && loaded) {
      setState({
        data: getTableData({ fabrics, vlans, subnets }, controller),
        loaded: true,
      });
    }
  }, [loaded, fabrics, vlans, subnets, controller]);

  return state;
};
