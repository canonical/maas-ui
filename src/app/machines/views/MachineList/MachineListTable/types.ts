import type { ValueOf } from "@canonical/react-components";

import type { SortDirection } from "@/app/base/types";
import type {
  Machine,
  MachineStateListGroup,
  FetchGroupKey,
  FetchFilters,
} from "@/app/store/machine/types";

export type MachineListTableProps = {
  callId?: string | null;
  currentPage: number;
  filter?: string;
  grouping?: FetchGroupKey | null;
  groups: MachineStateListGroup[] | null;
  hiddenColumns?: string[];
  hiddenGroups?: (string | null)[];
  machineCount: number | null;
  machines: Machine[];
  machinesLoading?: boolean | null;
  pageSize: number;
  totalPages: number | null;
  setCurrentPage: (currentPage: number) => void;
  setHiddenGroups?: (hiddenGroups: (string | null)[]) => void;
  setPageSize?: (pageSize: number) => void;
  showActions?: boolean;
  sortDirection: ValueOf<typeof SortDirection>;
  sortKey: FetchGroupKey | null;
  setSortDirection: (sortDirection: ValueOf<typeof SortDirection>) => void;
  setSortKey: (sortKey: FetchGroupKey | null) => void;
};

export type GroupColumnProps = {
  callId?: string | null;
  filter: FetchFilters | null;
  hiddenGroups: NonNullable<MachineListTableProps["hiddenGroups"]>;
  setHiddenGroups: MachineListTableProps["setHiddenGroups"];
  showActions: MachineListTableProps["showActions"];
};

export type MachineGroupRow = {
  id: string;
  type: "group";
  group: MachineStateListGroup;
};

export type MachineRow = {
  id: Machine["system_id"];
  type: "machine";
  systemId: Machine["system_id"];
  groupValue: MachineStateListGroup["value"];
  // The visible machines in the same group, used for shift-click range selection.
  groupMachines: Machine[];
};

// Rows intentionally carry no machine fields so GenericTable's client-side
// sorting has nothing to compare and the server order is preserved.
export type MachineTableRow = MachineGroupRow | MachineRow;
