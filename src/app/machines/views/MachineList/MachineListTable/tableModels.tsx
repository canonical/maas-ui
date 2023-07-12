import { Button } from "@canonical/react-components";
import type { MainTableRow } from "@canonical/react-components/dist/components/MainTable/MainTable";
import classNames from "classnames";
import pluralize from "pluralize";

import CoresColumn from "./CoresColumn";
import DisksColumn from "./DisksColumn";
import FabricColumn from "./FabricColumn";
import GroupCheckbox from "./GroupCheckbox";
import NameColumn from "./NameColumn";
import OwnerColumn from "./OwnerColumn";
import PoolColumn from "./PoolColumn";
import PowerColumn from "./PowerColumn";
import RamColumn from "./RamColumn";
import StatusColumn from "./StatusColumn";
import StorageColumn from "./StorageColumn";
import ZoneColumn from "./ZoneColumn";
import type {
  Props,
  TableColumn,
  GenerateRowParams,
  RowContent,
} from "./types";

import DoubleRow from "app/base/components/DoubleRow";
import Placeholder from "app/base/components/Placeholder";
import { columnLabels, columns, MachineColumns } from "app/machines/constants";
import type { GetMachineMenuToggleHandler } from "app/machines/types";
import type {
  Machine,
  MachineStateListGroup,
  FetchGroupKey,
  FetchFilters,
} from "app/store/machine/types";

/**
 * Filters columns by hiddenColumns.
 *
 * If showActions is true, the "fqdn" column will not be filtered as action checkboxes
 * share the "fqdn" column.
 * @param {Array} columns - headers or rows
 * @param {string[]} hiddenColumns - columns to hide, e.g. ["zone"]
 * @param {bool} showActions - whether actions and associated checkboxes are displayed
 */
export const filterColumns = (
  columns: TableColumn[],
  hiddenColumns: NonNullable<Props["hiddenColumns"]>,
  showActions: Props["showActions"]
): TableColumn[] => {
  if (hiddenColumns.length === 0) {
    return columns;
  }
  return columns.filter(
    (column) =>
      !hiddenColumns.includes(column.key) ||
      (column.key === "fqdn" && showActions)
  );
};

export const generateRow = ({
  key,
  content,
  hiddenColumns,
  showActions,
  classes,
}: {
  key: string | number;
  content: RowContent;
  hiddenColumns: NonNullable<Props["hiddenColumns"]>;
  showActions: GenerateRowParams["showActions"];
  classes?: string;
}) => {
  const columns = [
    {
      "aria-label": columnLabels[MachineColumns.FQDN],
      key: MachineColumns.FQDN,
      className: "fqdn-col",
      content: content[MachineColumns.FQDN],
    },
    {
      "aria-label": columnLabels[MachineColumns.POWER],
      key: MachineColumns.POWER,
      className: "power-col",
      content: content[MachineColumns.POWER],
    },
    {
      "aria-label": columnLabels[MachineColumns.STATUS],
      key: MachineColumns.STATUS,
      className: "status-col",
      content: content[MachineColumns.STATUS],
    },
    {
      "aria-label": columnLabels[MachineColumns.OWNER],
      key: MachineColumns.OWNER,
      className: "owner-col",
      content: content[MachineColumns.OWNER],
    },
    {
      "aria-label": columnLabels[MachineColumns.POOL],
      key: MachineColumns.POOL,
      className: "pool-col",
      content: content[MachineColumns.POOL],
    },
    {
      "aria-label": columnLabels[MachineColumns.ZONE],
      key: MachineColumns.ZONE,
      className: "zone-col",
      content: content[MachineColumns.ZONE],
    },
    {
      "aria-label": columnLabels[MachineColumns.FABRIC],
      key: MachineColumns.FABRIC,
      className: "fabric-col",
      content: content[MachineColumns.FABRIC],
    },
    {
      "aria-label": columnLabels[MachineColumns.CPU],
      key: MachineColumns.CPU,
      className: "cores-col",
      content: content[MachineColumns.CPU],
    },
    {
      "aria-label": columnLabels[MachineColumns.MEMORY],
      key: MachineColumns.MEMORY,
      className: "ram-col",
      content: content[MachineColumns.MEMORY],
    },
    {
      "aria-label": columnLabels[MachineColumns.DISKS],
      key: MachineColumns.DISKS,
      className: "disks-col",
      content: content[MachineColumns.DISKS],
    },
    {
      "aria-label": columnLabels[MachineColumns.STORAGE],
      key: MachineColumns.STORAGE,
      className: "storage-col",
      content: content[MachineColumns.STORAGE],
    },
  ];

  return {
    key,
    className: classNames(
      "machine-list__machine",
      {
        "truncated-border": showActions,
      },
      classes
    ),
    columns: filterColumns(columns, hiddenColumns, showActions),
  };
};

export const generateSkeletonRows = (
  hiddenColumns: NonNullable<Props["hiddenColumns"]>,
  showActions: GenerateRowParams["showActions"]
) => {
  return Array.from(Array(5)).map((_, i) => {
    const content = {
      [MachineColumns.FQDN]: (
        <DoubleRow
          primary={<Placeholder>xxxxxxxxx.xxxx</Placeholder>}
          secondary={<Placeholder>xxx.xxx.xx.x</Placeholder>}
        />
      ),
      [MachineColumns.POWER]: (
        <DoubleRow
          primary={<Placeholder>Xxxxxxxxxxx</Placeholder>}
          secondary={<Placeholder>Xxxxxxx</Placeholder>}
        />
      ),
      [MachineColumns.STATUS]: (
        <DoubleRow primary={<Placeholder>XXXXX XXXXX</Placeholder>} />
      ),
      [MachineColumns.OWNER]: (
        <DoubleRow
          primary={<Placeholder>Xxxx</Placeholder>}
          secondary={<Placeholder>XXXX, XXX</Placeholder>}
        />
      ),
      [MachineColumns.POOL]: (
        <DoubleRow primary={<Placeholder>Xxxxx</Placeholder>} />
      ),
      [MachineColumns.ZONE]: (
        <DoubleRow
          primary={<Placeholder>Xxxxxxx</Placeholder>}
          secondary={<Placeholder>Xxxxxxx</Placeholder>}
        />
      ),
      [MachineColumns.FABRIC]: (
        <DoubleRow
          primary={<Placeholder>Xxxxxxx-X</Placeholder>}
          secondary={<Placeholder>Xxxxx</Placeholder>}
        />
      ),
      [MachineColumns.CPU]: (
        <DoubleRow
          primary={<Placeholder>XX</Placeholder>}
          primaryClassName="u-align--right"
          secondary={<Placeholder>xxxXX</Placeholder>}
          secondaryClassName="u-align--right"
        />
      ),
      [MachineColumns.MEMORY]: (
        <DoubleRow
          primary={<Placeholder>XX xxx</Placeholder>}
          primaryClassName="u-align--right"
        />
      ),
      [MachineColumns.DISKS]: (
        <DoubleRow
          primary={<Placeholder>XX</Placeholder>}
          primaryClassName="u-align--right"
        />
      ),
      [MachineColumns.STORAGE]: (
        <DoubleRow
          primary={<Placeholder>X.XX</Placeholder>}
          primaryClassName="u-align--right"
        />
      ),
    };
    return generateRow({
      key: i,
      content,
      hiddenColumns,
      showActions,
      classes: "machine-list__machine--inactive",
    });
  });
};

export const generateRows = ({
  callId,
  groupValue,
  hiddenColumns,
  machines,
  getToggleHandler,
  showActions,
  showMAC,
  showFullName,
}: GenerateRowParams) => {
  const getMenuHandler: GetMachineMenuToggleHandler = (...args) =>
    showActions ? getToggleHandler(...args) : () => undefined;

  return machines.map((row) => {
    const content = {
      [MachineColumns.FQDN]: (
        <NameColumn
          callId={callId}
          data-testid="fqdn-column"
          groupValue={groupValue}
          machines={machines}
          showActions={showActions}
          showMAC={showMAC}
          systemId={row.system_id}
        />
      ),
      [MachineColumns.POWER]: (
        <PowerColumn
          data-testid="power-column"
          onToggleMenu={getMenuHandler(MachineColumns.POWER)}
          systemId={row.system_id}
        />
      ),
      [MachineColumns.STATUS]: (
        <StatusColumn
          data-testid="status-column"
          onToggleMenu={getMenuHandler(MachineColumns.STATUS)}
          systemId={row.system_id}
        />
      ),
      [MachineColumns.OWNER]: (
        <OwnerColumn
          data-testid="owner-column"
          onToggleMenu={getMenuHandler(MachineColumns.OWNER)}
          showFullName={showFullName}
          systemId={row.system_id}
        />
      ),
      [MachineColumns.POOL]: (
        <PoolColumn
          data-testid="pool-column"
          onToggleMenu={getMenuHandler(MachineColumns.POOL)}
          systemId={row.system_id}
        />
      ),
      [MachineColumns.ZONE]: (
        <ZoneColumn
          data-testid="zone-column"
          onToggleMenu={getMenuHandler(MachineColumns.ZONE)}
          systemId={row.system_id}
        />
      ),
      [MachineColumns.FABRIC]: (
        <FabricColumn data-testid="fabric-column" systemId={row.system_id} />
      ),
      [MachineColumns.CPU]: (
        <CoresColumn data-testid="cpu-column" systemId={row.system_id} />
      ),
      [MachineColumns.MEMORY]: (
        <RamColumn data-testid="memory-column" systemId={row.system_id} />
      ),
      [MachineColumns.DISKS]: (
        <DisksColumn data-testid="disks-column" systemId={row.system_id} />
      ),
      [MachineColumns.STORAGE]: (
        <StorageColumn data-testid="storage-column" systemId={row.system_id} />
      ),
    };
    return generateRow({
      key: row.system_id,
      content,
      hiddenColumns,
      showActions,
    });
  });
};

export enum Label {
  HideGroup = "Hide",
  ShowGroup = "Show",
}

export const generateGroupRows = ({
  callId,
  grouping,
  groups,
  hiddenGroups,
  machines,
  setHiddenGroups,
  showActions,
  hiddenColumns,
  filter,
  ...rowProps
}: {
  callId?: string | null;
  grouping?: FetchGroupKey | null;
  groups: MachineStateListGroup[] | null;
  hiddenGroups: NonNullable<Props["hiddenGroups"]>;
  setHiddenGroups: Props["setHiddenGroups"];
  filter: FetchFilters | null;
} & Omit<GenerateRowParams, "groupValue">) => {
  let rows: MainTableRow[] = [];

  groups?.forEach((group) => {
    const { collapsed, count, items: machineIDs, name, value } = group;
    // When the table is set to ungrouped then there are no group headers.
    if (grouping) {
      rows.push({
        "aria-label": `${name} machines group`,
        className: "machine-list__group",
        columns: [
          {
            colSpan: columns.length - hiddenColumns.length,
            content: (
              <>
                <DoubleRow
                  data-testid="group-cell"
                  primary={
                    showActions ? (
                      <GroupCheckbox
                        callId={callId}
                        group={group}
                        groupName={name}
                        grouping={grouping}
                      />
                    ) : (
                      <strong>{name}</strong>
                    )
                  }
                  secondary={pluralize("machine", count, true)}
                  secondaryClassName={
                    showActions ? "u-nudge--secondary-row u-align--left" : null
                  }
                />
                <div className="machine-list__group-toggle">
                  <Button
                    appearance="base"
                    dense
                    hasIcon
                    onClick={() => {
                      if (collapsed) {
                        setHiddenGroups &&
                          setHiddenGroups(
                            hiddenGroups.filter(
                              (hiddenGroup) => hiddenGroup !== value
                            )
                          );
                      } else {
                        setHiddenGroups &&
                          setHiddenGroups(
                            hiddenGroups.concat([value as string])
                          );
                      }
                    }}
                  >
                    {collapsed ? (
                      <i className="p-icon--plus">{Label.ShowGroup}</i>
                    ) : (
                      <i className="p-icon--minus">{Label.HideGroup}</i>
                    )}
                  </Button>
                </div>
              </>
            ),
          },
        ],
      });
    }
    // Get the machines in this group using the list of machine ids provided by the group.
    const visibleMachines = collapsed
      ? []
      : machineIDs.reduce<Machine[]>((groupMachines, systemId) => {
          const machine = machines.find(
            ({ system_id }) => system_id === systemId
          );
          if (machine) {
            groupMachines.push(machine);
          }
          return groupMachines;
        }, []);
    rows = rows.concat(
      generateRows({
        ...rowProps,
        callId,
        groupValue: group.value,
        machines: visibleMachines,
        showActions,
        hiddenColumns,
      })
    );
  });
  return rows;
};
