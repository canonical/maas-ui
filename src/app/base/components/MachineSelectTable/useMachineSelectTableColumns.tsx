import { useMemo } from "react";

import { highlightSubString as baseHighlightSubString } from "@canonical/react-components/dist/utils";
import type { ColumnDef } from "@tanstack/react-table";

import DoubleRow from "@/app/base/components/DoubleRow";
import type { Machine } from "@/app/store/machine/types";
import type { Tag } from "@/app/store/tag/types";
import { getTagNamesForIds } from "@/app/store/tag/utils";

const safeGetRegexString = (searchText: string): string => {
  try {
    new RegExp(searchText, "i");
    return searchText;
  } catch {
    return "";
  }
};

const highlightSubString = (text: string, highlight: string) =>
  baseHighlightSubString(text, safeGetRegexString(highlight));

type Params = {
  onMachineClick: (machine: Machine | null) => void;
  searchText: string;
  setSearchText: (searchText: string) => void;
  tags: Tag[];
};

type MachineColumnDef = ColumnDef<Machine, Partial<Machine>>;

const useMachineSelectTableColumns = ({
  onMachineClick,
  searchText,
  setSearchText,
  tags,
}: Params): MachineColumnDef[] => {
  return useMemo(
    () => [
      {
        id: "hostname",
        accessorKey: "hostname",
        enableSorting: false,
        header: () => (
          <>
            <div>Hostname</div>
            <div>system_id</div>
          </>
        ),
        cell: ({ row }) => {
          const machine = row.original;
          const highlightedText = (text: string) => (
            <span
              dangerouslySetInnerHTML={{
                __html: highlightSubString(text, searchText).text,
              }}
            />
          );
          return (
            <div
              className="machine-select-table__cell"
              onClick={() => {
                setSearchText(machine.hostname);
                onMachineClick(machine);
              }}
            >
              <DoubleRow
                primary={highlightedText(machine.hostname)}
                secondary={highlightedText(machine.system_id)}
              />
            </div>
          );
        },
      },
      {
        id: "owner",
        accessorKey: "owner",
        enableSorting: false,
        header: () => (
          <>
            <div>Owner</div>
            <div>Tags</div>
          </>
        ),
        cell: ({ row }) => {
          const machine = row.original;
          const highlightedText = (text: string) => (
            <span
              dangerouslySetInnerHTML={{
                __html: highlightSubString(text, searchText).text,
              }}
            />
          );
          return (
            <div
              className="machine-select-table__cell"
              onClick={() => {
                setSearchText(machine.hostname);
                onMachineClick(machine);
              }}
            >
              <DoubleRow
                primary={machine.owner || "-"}
                secondary={
                  machine.tags.length
                    ? highlightedText(
                        getTagNamesForIds(machine.tags, tags).join(", ")
                      )
                    : "-"
                }
              />
            </div>
          );
        },
      },
    ],
    [onMachineClick, searchText, setSearchText, tags]
  );
};

export default useMachineSelectTableColumns;
