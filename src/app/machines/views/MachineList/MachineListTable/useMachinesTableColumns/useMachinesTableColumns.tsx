import type { ReactNode } from "react";
import { useCallback, useMemo } from "react";

import type { ColumnDef, Row } from "@tanstack/react-table";

import AllCheckbox from "../AllCheckbox";
import CoresColumn from "../CoresColumn";
import DisksColumn from "../DisksColumn";
import FabricColumn from "../FabricColumn";
import GroupColumn from "../GroupColumn";
import NameColumn from "../NameColumn";
import OwnerColumn from "../OwnerColumn";
import PoolColumn from "../PoolColumn";
import PowerColumn from "../PowerColumn";
import RamColumn from "../RamColumn";
import StatusColumn from "../StatusColumn";
import StorageColumn from "../StorageColumn";
import ZoneColumn from "../ZoneColumn";
import type {
  GroupColumnProps,
  MachineListTableProps,
  MachineRow,
  MachineTableRow,
} from "../types";

import DoubleRow from "@/app/base/components/DoubleRow";
import Placeholder from "@/app/base/components/Placeholder";
import TableHeader from "@/app/base/components/TableHeader";
import { useSendAnalytics } from "@/app/base/hooks";
import type { Sort } from "@/app/base/types";
import { columnLabels, MachineColumns } from "@/app/machines/constants";
import type { GetMachineMenuToggleHandler } from "@/app/machines/types";
import { FetchGroupKey } from "@/app/store/machine/types";

export type MachineColumnDef = ColumnDef<
  MachineTableRow,
  Partial<MachineTableRow>
>;

type Props = GroupColumnProps & {
  currentSort: Sort<FetchGroupKey>;
  grouping: MachineListTableProps["grouping"];
  setShowFullName: (showFullName: boolean) => void;
  setShowMAC: (showMAC: boolean) => void;
  showFullName: boolean;
  showMAC: boolean;
  updateSort: (sortKey: FetchGroupKey | null) => void;
};

const machineCell =
  (render: (row: MachineRow) => ReactNode) =>
  ({ row }: { row: Row<MachineTableRow> }) =>
    row.original.type === "machine" ? render(row.original) : null;

const cellAriaLabel =
  (column: MachineColumns) =>
  (row: Row<MachineTableRow>): string =>
    row.original.type === "group"
      ? `${row.original.group.name} machines group`
      : columnLabels[column];

const useMachinesTableColumns = ({
  callId,
  currentSort,
  filter,
  grouping,
  hiddenGroups,
  setHiddenGroups,
  setShowFullName,
  setShowMAC,
  showActions,
  showFullName,
  showMAC,
  updateSort,
}: Props): MachineColumnDef[] => {
  const sendAnalytics = useSendAnalytics();

  const getMenuHandler: GetMachineMenuToggleHandler = useCallback(
    (columnName: string) => (open: boolean) => {
      if (showActions) {
        sendAnalytics(
          "Machine list",
          open ? "Inline actions open" : "Inline actions close",
          `${columnName} column`
        );
      }
    },
    [sendAnalytics, showActions]
  );

  return useMemo(
    (): MachineColumnDef[] => [
      {
        id: MachineColumns.FQDN,
        enableSorting: false,
        header: () => (
          <div className="u-flex">
            {showActions && <AllCheckbox callId={callId} filter={filter} />}
            <div>
              <TableHeader
                currentSort={currentSort}
                // TODO: change this to "fqdn" when the API supports it:
                // https://github.com/canonical/app-tribe/issues/1268
                onClick={() => {
                  setShowMAC(false);
                  updateSort(FetchGroupKey.Hostname);
                }}
                sortKey={FetchGroupKey.Hostname}
              >
                {columnLabels[MachineColumns.FQDN]}
              </TableHeader>
              &nbsp;<strong>|</strong>&nbsp;
              <TableHeader
                currentSort={currentSort}
                // TODO: enable sorting by "pxe_mac" when the API supports it:
                // https://github.com/canonical/app-tribe/issues/1268
                onClick={() => {
                  setShowMAC(true);
                }}
              >
                MAC
              </TableHeader>
              <TableHeader>IP</TableHeader>
            </div>
          </div>
        ),
        cell: ({ row }) =>
          row.original.type === "group" ? (
            grouping ? (
              <GroupColumn
                callId={callId}
                filter={filter}
                group={row.original.group}
                grouping={grouping}
                hiddenGroups={hiddenGroups}
                setHiddenGroups={setHiddenGroups}
                showActions={showActions}
              />
            ) : null
          ) : (
            <NameColumn
              callId={callId}
              groupValue={row.original.groupValue}
              machines={row.original.groupMachines}
              showActions={showActions}
              showMAC={showMAC}
              systemId={row.original.systemId}
            />
          ),
        meta: {
          headerAriaLabel: columnLabels[MachineColumns.FQDN],
          cellAriaLabel: cellAriaLabel(MachineColumns.FQDN),
          skeleton: () => (
            <DoubleRow
              primary={<Placeholder>xxxxxxxxx.xxxx</Placeholder>}
              secondary={<Placeholder>xxx.xxx.xx.x</Placeholder>}
            />
          ),
        },
      },
      {
        id: MachineColumns.POWER,
        enableSorting: false,
        header: () => (
          <TableHeader
            className="p-double-row__header-spacer"
            currentSort={currentSort}
            onClick={() => {
              updateSort(FetchGroupKey.PowerState);
            }}
            sortKey={FetchGroupKey.PowerState}
          >
            {columnLabels[MachineColumns.POWER]}
          </TableHeader>
        ),
        cell: machineCell(({ systemId }) => (
          <PowerColumn
            onToggleMenu={getMenuHandler(MachineColumns.POWER)}
            systemId={systemId}
          />
        )),
        meta: {
          headerAriaLabel: columnLabels[MachineColumns.POWER],
          cellAriaLabel: cellAriaLabel(MachineColumns.POWER),
          skeleton: () => (
            <DoubleRow
              primary={<Placeholder>Xxxxxxxxxxx</Placeholder>}
              secondary={<Placeholder>Xxxxxxxxxxx</Placeholder>}
            />
          ),
        },
      },
      {
        id: MachineColumns.STATUS,
        enableSorting: false,
        header: () => (
          <TableHeader
            className="p-double-row__header-spacer"
            currentSort={currentSort}
            onClick={() => {
              updateSort(FetchGroupKey.Status);
            }}
            sortKey={FetchGroupKey.Status}
          >
            {columnLabels[MachineColumns.STATUS]}
          </TableHeader>
        ),
        cell: machineCell(({ systemId }) => (
          <StatusColumn
            onToggleMenu={getMenuHandler(MachineColumns.STATUS)}
            systemId={systemId}
          />
        )),
        meta: {
          headerAriaLabel: columnLabels[MachineColumns.STATUS],
          cellAriaLabel: cellAriaLabel(MachineColumns.STATUS),
          skeleton: () => (
            <DoubleRow primary={<Placeholder>XXXXX XXXXX</Placeholder>} />
          ),
        },
      },
      {
        id: MachineColumns.OWNER,
        enableSorting: false,
        header: () => (
          <>
            <TableHeader
              currentSort={currentSort}
              onClick={() => {
                setShowFullName(false);
                updateSort(FetchGroupKey.Owner);
              }}
              sortKey={FetchGroupKey.Owner}
            >
              {columnLabels[MachineColumns.OWNER]}
            </TableHeader>
            &nbsp;<strong>|</strong>&nbsp;
            <TableHeader
              currentSort={currentSort}
              onClick={() => {
                sendAnalytics(
                  "Machine list",
                  "Column header",
                  "Show owner full name"
                );
                setShowFullName(true);
              }}
            >
              Name
            </TableHeader>
            <TableHeader>Tags</TableHeader>
          </>
        ),
        cell: machineCell(({ systemId }) => (
          <OwnerColumn
            onToggleMenu={getMenuHandler(MachineColumns.OWNER)}
            showFullName={showFullName}
            systemId={systemId}
          />
        )),
        meta: {
          headerAriaLabel: columnLabels[MachineColumns.OWNER],
          cellAriaLabel: cellAriaLabel(MachineColumns.OWNER),
          skeleton: () => (
            <DoubleRow
              primary={<Placeholder>Xxxx</Placeholder>}
              secondary={<Placeholder>XXXX, XXX</Placeholder>}
            />
          ),
        },
      },
      {
        id: MachineColumns.POOL,
        enableSorting: false,
        header: () => (
          <>
            <TableHeader
              currentSort={currentSort}
              onClick={() => {
                updateSort(FetchGroupKey.Pool);
              }}
              sortKey={FetchGroupKey.Pool}
            >
              {columnLabels[MachineColumns.POOL]}
            </TableHeader>
            <TableHeader>Note</TableHeader>
          </>
        ),
        cell: machineCell(({ systemId }) => (
          <PoolColumn
            onToggleMenu={getMenuHandler(MachineColumns.POOL)}
            systemId={systemId}
          />
        )),
        meta: {
          headerAriaLabel: columnLabels[MachineColumns.POOL],
          cellAriaLabel: cellAriaLabel(MachineColumns.POOL),
          skeleton: () => (
            <DoubleRow primary={<Placeholder>Xxxxx</Placeholder>} />
          ),
        },
      },
      {
        id: MachineColumns.ZONE,
        enableSorting: false,
        header: () => (
          <>
            <TableHeader
              currentSort={currentSort}
              onClick={() => {
                updateSort(FetchGroupKey.Zone);
              }}
              sortKey={FetchGroupKey.Zone}
            >
              {columnLabels[MachineColumns.ZONE]}
            </TableHeader>
            <TableHeader>Spaces</TableHeader>
          </>
        ),
        cell: machineCell(({ systemId }) => (
          <ZoneColumn
            onToggleMenu={getMenuHandler(MachineColumns.ZONE)}
            systemId={systemId}
          />
        )),
        meta: {
          headerAriaLabel: columnLabels[MachineColumns.ZONE],
          cellAriaLabel: cellAriaLabel(MachineColumns.ZONE),
          skeleton: () => (
            <DoubleRow
              primary={<Placeholder>Xxxxxxx</Placeholder>}
              secondary={<Placeholder>Xxxxxxx</Placeholder>}
            />
          ),
        },
      },
      {
        id: MachineColumns.FABRIC,
        enableSorting: false,
        header: () => (
          <>
            {/* TODO: enable sorting by "fabric" when the API supports it:
                https://github.com/canonical/app-tribe/issues/1268 */}
            <TableHeader currentSort={currentSort}>
              {columnLabels[MachineColumns.FABRIC]}
            </TableHeader>
            <TableHeader>VLAN</TableHeader>
          </>
        ),
        cell: machineCell(({ systemId }) => (
          <FabricColumn systemId={systemId} />
        )),
        meta: {
          headerAriaLabel: columnLabels[MachineColumns.FABRIC],
          cellAriaLabel: cellAriaLabel(MachineColumns.FABRIC),
          skeleton: () => (
            <DoubleRow
              primary={<Placeholder>Xxxxxxx-X</Placeholder>}
              secondary={<Placeholder>Xxxxx</Placeholder>}
            />
          ),
        },
      },
      {
        id: MachineColumns.CPU,
        enableSorting: false,
        header: () => (
          <>
            <TableHeader
              currentSort={currentSort}
              onClick={() => {
                updateSort(FetchGroupKey.CpuCount);
              }}
              sortKey={FetchGroupKey.CpuCount}
            >
              {columnLabels[MachineColumns.CPU]}
            </TableHeader>
            <TableHeader>Arch</TableHeader>
          </>
        ),
        cell: machineCell(({ systemId }) => (
          <CoresColumn systemId={systemId} />
        )),
        meta: {
          headerAriaLabel: columnLabels[MachineColumns.CPU],
          cellAriaLabel: cellAriaLabel(MachineColumns.CPU),
          skeleton: () => (
            <DoubleRow
              primary={<Placeholder>XX</Placeholder>}
              primaryClassName="u-align--right"
              secondary={<Placeholder>xxxXX</Placeholder>}
              secondaryClassName="u-align--right"
            />
          ),
        },
      },
      {
        id: MachineColumns.MEMORY,
        enableSorting: false,
        header: () => (
          <TableHeader
            currentSort={currentSort}
            onClick={() => {
              updateSort(FetchGroupKey.Memory);
            }}
            sortKey={FetchGroupKey.Memory}
          >
            {columnLabels[MachineColumns.MEMORY]}
          </TableHeader>
        ),
        cell: machineCell(({ systemId }) => <RamColumn systemId={systemId} />),
        meta: {
          headerAriaLabel: columnLabels[MachineColumns.MEMORY],
          cellAriaLabel: cellAriaLabel(MachineColumns.MEMORY),
          skeleton: () => (
            <DoubleRow
              primary={<Placeholder>XX xxx</Placeholder>}
              primaryClassName="u-align--right"
            />
          ),
        },
      },
      {
        id: MachineColumns.DISKS,
        enableSorting: false,
        header: () => (
          <TableHeader
            currentSort={currentSort}
            onClick={() => {
              updateSort(FetchGroupKey.PhysicalDiskCount);
            }}
            sortKey={FetchGroupKey.PhysicalDiskCount}
          >
            {columnLabels[MachineColumns.DISKS]}
          </TableHeader>
        ),
        cell: machineCell(({ systemId }) => (
          <DisksColumn systemId={systemId} />
        )),
        meta: {
          headerAriaLabel: columnLabels[MachineColumns.DISKS],
          cellAriaLabel: cellAriaLabel(MachineColumns.DISKS),
          skeleton: () => (
            <DoubleRow
              primary={<Placeholder>XX</Placeholder>}
              primaryClassName="u-align--right"
            />
          ),
        },
      },
      {
        id: MachineColumns.STORAGE,
        enableSorting: false,
        header: () => (
          <TableHeader
            currentSort={currentSort}
            onClick={() => {
              updateSort(FetchGroupKey.TotalStorage);
            }}
            sortKey={FetchGroupKey.TotalStorage}
          >
            {columnLabels[MachineColumns.STORAGE]}
          </TableHeader>
        ),
        cell: machineCell(({ systemId }) => (
          <StorageColumn systemId={systemId} />
        )),
        meta: {
          headerAriaLabel: columnLabels[MachineColumns.STORAGE],
          cellAriaLabel: cellAriaLabel(MachineColumns.STORAGE),
          skeleton: () => (
            <DoubleRow
              primary={<Placeholder>X.XX</Placeholder>}
              primaryClassName="u-align--right"
            />
          ),
        },
      },
    ],
    [
      callId,
      currentSort,
      filter,
      getMenuHandler,
      grouping,
      hiddenGroups,
      sendAnalytics,
      setHiddenGroups,
      setShowFullName,
      setShowMAC,
      showActions,
      showFullName,
      showMAC,
      updateSort,
    ]
  );
};

export default useMachinesTableColumns;
