import type { MachineListTableProps, MachineTableRow } from "./types";

import type { Machine } from "@/app/store/machine/types";

/**
 * Flatten the server-provided groups into table rows, preserving the server
 * order. When grouping is enabled, each group is preceded by a group row.
 * Collapsed groups render only their group row.
 */
export const generateMachineTableRows = ({
  grouping,
  groups,
  machines,
}: Pick<
  MachineListTableProps,
  "grouping" | "groups" | "machines"
>): MachineTableRow[] => {
  const rows: MachineTableRow[] = [];
  groups?.forEach((group, index) => {
    if (grouping) {
      rows.push({
        id: `group-${index}-${group.value}`,
        type: "group",
        group,
      });
    }
    const groupMachines = group.collapsed
      ? []
      : group.items.reduce<Machine[]>((visibleMachines, systemId) => {
          const machine = machines.find(
            ({ system_id }) => system_id === systemId
          );
          if (machine) {
            visibleMachines.push(machine);
          }
          return visibleMachines;
        }, []);
    groupMachines.forEach((machine) => {
      rows.push({
        id: machine.system_id,
        type: "machine",
        systemId: machine.system_id,
        groupValue: group.value,
        groupMachines,
      });
    });
  });
  return rows;
};
