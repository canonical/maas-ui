import { createSelector } from "@reduxjs/toolkit";

import type { Machine } from "app/store/machine/types";
import { isMachineDetails } from "app/store/machine/utils";
import type { RootState } from "app/store/root/types";
import { NetworkInterfaceTypes } from "app/store/types/enum";
import type { NetworkInterface } from "app/store/types/node";
import { generateBaseSelectors } from "app/store/utils";
import { VLANMeta, VlanVid } from "app/store/vlan/types";
import type { VLAN, VLANState } from "app/store/vlan/types";

const searchFunction = (vlan: VLAN, term: string) => vlan.name.includes(term);

const defaultSelectors = generateBaseSelectors<VLANState, VLAN, VLANMeta.PK>(
  VLANMeta.MODEL,
  VLANMeta.PK,
  searchFunction
);

/**
 * Get the vlan state object.
 * @param state - The redux state.
 * @returns The vlan state.
 */
const vlanState = (state: RootState): VLANState => state[VLANMeta.MODEL];

/**
 * Returns currently active vlan's id.
 * @param state - The redux state.
 * @returns Active vlan id.
 */
const activeID = createSelector([vlanState], (vlanState) => vlanState.active);

/**
 * Returns currently active vlan.
 * @param state - The redux state.
 * @returns Active vlan.
 */
const active = createSelector(
  [defaultSelectors.all, activeID],
  (vlans: VLAN[], activeID: VLAN[VLANMeta.PK] | null) =>
    vlans.find((vlan) => activeID === vlan.id)
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
    if (!nic || !isMachineDetails(machine)) {
      return [];
    }
    const currentVLAN = vlans.find(({ id }) => id === nic.vlan_id);
    // Remove the default VLAN.
    const allButDefault = vlans.filter(({ vid }) => vid !== VlanVid.UNTAGGED);
    // Get the VLANS in the current fabric.
    const vlansInFabric = allButDefault.filter(
      (vlan) => vlan.fabric === currentVLAN?.fabric
    );
    const usedVLANs: VLAN[VLANMeta.PK][] = [];
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
  active,
  activeID,
  getUnusedForInterface,
  vlanState,
};

export default selectors;
