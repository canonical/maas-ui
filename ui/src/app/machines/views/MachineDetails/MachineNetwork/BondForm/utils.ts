import type { Selected } from "../NetworkTable/types";

import type { Machine } from "app/store/machine/types";
import {
  getInterfaceById,
  getInterfaceName,
  getLinkFromNic,
} from "app/store/machine/utils";

export const getFirstSelected = (
  machine: Machine,
  selected: Selected[]
): Selected => {
  const [firstSelected] = selected.sort((selectedA, selectedB) => {
    const nicA = getInterfaceById(machine, selectedA.nicId, selectedA.linkId);
    const linkA = getLinkFromNic(nicA, selectedA.linkId);
    const nicB = getInterfaceById(machine, selectedB.nicId, selectedB.linkId);
    const linkB = getLinkFromNic(nicB, selectedB.linkId);
    const nameA = getInterfaceName(machine, nicA, linkA);
    const nameB = getInterfaceName(machine, nicB, linkB);
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    return 0;
  });
  return firstSelected;
};
