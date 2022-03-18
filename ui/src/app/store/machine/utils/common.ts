import type { Machine, MachineDetails } from "app/store/machine/types";
import type { Tag, TagMeta } from "app/store/tag/types";

/**
 * Whether a machine has a Machine or MachineDetails type.
 * @param machine - The machine to check
 * @returns Whether the machine is MachineDetails.
 */
export const isMachineDetails = (
  machine?: Machine | null
  // Use "metadata" as the canary as it only exists for MachineDetails.
): machine is MachineDetails => !!machine && "metadata" in machine;

export type TagIdCountMap = Map<Tag[TagMeta.PK], number>;

/**
 * The tag ids for the given machines.
 * @param machines - The machines to get the tag ids from.
 * @returns A list of tag ids.
 */
export const getTagCountsForMachines = (machines: Machine[]): TagIdCountMap => {
  const ids = machines.reduce<Tag[TagMeta.PK][]>(
    (tagIds, machine) => tagIds.concat(machine.tags),
    []
  );
  const tagCounts = new Map();
  ids.forEach((id) => {
    if (!tagCounts.has(id)) {
      tagCounts.set(id, ids.filter((tagId) => tagId === id).length);
    }
  });
  return tagCounts;
};
