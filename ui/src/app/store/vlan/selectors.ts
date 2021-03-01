import { createSelector } from "@reduxjs/toolkit";

import { NetworkInterfaceTypes } from "app/store/machine/types";
import type { Machine, NetworkInterface } from "app/store/machine/types";
import type { RootState } from "app/store/root/types";
import { generateBaseSelectors } from "app/store/utils";
import { VlanVid } from "app/store/vlan/types";
import type { VLAN, VLANState } from "app/store/vlan/types";

const searchFunction = (vlan: VLAN, term: string) => vlan.name.includes(term);

const defaultSelectors = generateBaseSelectors<VLANState, VLAN, "id">(
  "vlan",
  "id",
  searchFunction
);

/**
 * Get a list of unused VLANs for an interface.
 * @param machine - The nic's machine.
 * @param nic - A network interface.
 * @return Unused VLANs for an interface.
 */
const getUnusedForInterface = createSelector(
  [
    defaultSelectors.all,
    (
      _state: RootState,
      // Accept `undefined` instead of making these optional params otherwise
      // `createSelector` returns the wrong type for this selector.
      machine: Machine | null | undefined,
      nic: NetworkInterface | null | undefined
    ) => ({
      machine,
      nic,
    }),
  ],
  (vlans, { machine, nic }) => {
    if (!nic || !machine || !("interfaces" in machine)) {
      return [];
    }
    const currentVLAN = vlans.find(({ id }) => id === nic.vlan_id);
    // Remove the default VLAN.
    const allButDefault = vlans.filter(({ vid }) => vid !== VlanVid.UNTAGGED);
    // Get the VLANS in the current fabric.
    const vlansInFabric = allButDefault.filter(
      (vlan) => vlan.fabric === currentVLAN?.fabric
    );
    const usedVLANs: VLAN["id"][] = [];
    // Find VLANS that are used by children of this nic.
    machine.interfaces.forEach((networkInterface: NetworkInterface) => {
      if (
        networkInterface.type === NetworkInterfaceTypes.VLAN &&
        networkInterface.parents[0] === nic.id
      ) {
        usedVLANs.push(networkInterface.vlan_id);
      }
    });
    return vlansInFabric.filter(({ id }) => !usedVLANs.includes(id));
  }
);

const selectors = {
  ...defaultSelectors,
  getUnusedForInterface,
};

export default selectors;
