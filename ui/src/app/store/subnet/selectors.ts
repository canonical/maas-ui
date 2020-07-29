import { createSelector } from "@reduxjs/toolkit";

import { generateBaseSelectors } from "app/store/utils";
import type { PodDetails } from "app/store/pod/types";
import type { RootState } from "app/store/root/types";
import type { Subnet, SubnetState } from "app/store/subnet/types";

const searchFunction = (subnet: Subnet, term: string) =>
  subnet.name.includes(term);

const defaultSelectors = generateBaseSelectors<SubnetState, Subnet, "id">(
  "subnet",
  "id",
  searchFunction
);

/**
 * Get subnets that are available to a given pod.
 * @param {RootState} state - The redux state.
 * @param {Pod} pod - The pod to query.
 * @returns {Subnet[]} Subnets that are available to a given pod.
 */
const getByPod = createSelector(
  [defaultSelectors.all, (_state: RootState, pod: PodDetails) => pod],
  (subnets, pod) => {
    if (!pod) {
      return [];
    }
    return subnets.filter((subnet) =>
      pod.attached_vlans?.includes(subnet.vlan)
    );
  }
);

const selectors = { ...defaultSelectors, getByPod };

export default selectors;
