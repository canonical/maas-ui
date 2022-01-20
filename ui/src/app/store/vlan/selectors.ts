import { createSelector } from "@reduxjs/toolkit";

import type { Machine } from "app/store/machine/types";
import { isMachineDetails } from "app/store/machine/utils";
import type { RootState } from "app/store/root/types";
import { NetworkInterfaceTypes } from "app/store/types/enum";
import type { NetworkInterface } from "app/store/types/node";
import { generateBaseSelectors } from "app/store/utils";
import { VLANMeta, VlanVid } from "app/store/vlan/types";
import type { VLAN, VLANState, VLANStatus } from "app/store/vlan/types";
import { isId } from "app/utils";

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

/**
 * Get the vlans statuses.
 * @param state - The redux state.
 * @returns The vlan statuses.
 */
const statuses = createSelector([vlanState], (vlanState) => vlanState.statuses);

/**
 * Get the statuses for a vlan.
 * @param state - The redux state.
 * @param id - A vlan's system id.
 * @returns The vlan's statuses
 */
const getStatusForVLAN = createSelector(
  [
    statuses,
    (
      _state: RootState,
      id: VLAN[VLANMeta.PK] | null,
      status: keyof VLANStatus
    ) => ({
      id,
      status,
    }),
  ],
  (allStatuses, { id, status }) =>
    isId(id) && id in allStatuses ? allStatuses[id][status] : false
);

/**
 * Returns the vlans which are configuring DHCP.
 * @param state - The redux state.
 * @returns VLANs configuring DHCP.
 */
const configuringDHCP = createSelector(
  [defaultSelectors.all, statuses],
  (vlans, statuses) =>
    vlans.filter(
      (vlan) => statuses[vlan[VLANMeta.PK]]?.configuringDHCP || false
    )
);

/**
 * Select the event errors for all vlans.
 * @param state - The redux state.
 * @returns The event errors.
 */
const eventErrors = createSelector(
  [vlanState],
  (vlanState) => vlanState.eventErrors
);

/**
 * Select the event errors for a vlan or vlans.
 * @param ids - One or more vlan IDs.
 * @param event - A vlan action event.
 * @returns The event errors for the vlan(s).
 */
const eventErrorsForVLANs = createSelector(
  [
    eventErrors,
    (
      _state: RootState,
      ids: VLAN[VLANMeta.PK] | VLAN[VLANMeta.PK][] | null,
      event?: string | null
    ) => ({
      ids,
      event,
    }),
  ],
  (errors: VLANState["eventErrors"][0][], { ids, event }) => {
    if (!errors || !ids) {
      return [];
    }
    // If a single id has been provided then turn into an array to operate over.
    const idArray = Array.isArray(ids) ? ids : [ids];
    return errors.reduce<VLANState["eventErrors"][0][]>((matches, error) => {
      let match = false;
      const matchesId = !!error.id && idArray.includes(error.id);
      // If an event has been provided as `null` then filter for errors with
      // a null event.
      if (event || event === null) {
        match = matchesId && error.event === event;
      } else {
        match = matchesId;
      }
      if (match) {
        matches.push(error);
      }
      return matches;
    }, []);
  }
);

const selectors = {
  ...defaultSelectors,
  active,
  activeID,
  configuringDHCP,
  eventErrors,
  eventErrorsForVLANs,
  getStatusForVLAN,
  getUnusedForInterface,
  vlanState,
};

export default selectors;
