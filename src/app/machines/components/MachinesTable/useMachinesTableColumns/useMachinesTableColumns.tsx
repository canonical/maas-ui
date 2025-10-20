import type { Dispatch, ReactNode } from "react";
import { useMemo, useState } from "react";

import { formatBytes } from "@canonical/maas-react-components";
import type { MenuLink } from "@canonical/react-components";
import { Icon, Button, Spinner, Tooltip } from "@canonical/react-components";
import type { Column, ColumnDef, Header, Row } from "@tanstack/react-table";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router";
import type { UnknownAction } from "redux";

import { usePools } from "@/app/api/query/pools";
import { useUsers } from "@/app/api/query/users";
import { useZones } from "@/app/api/query/zones";
import type {
  ResourcePoolWithSummaryResponse,
  ZoneWithSummaryResponse,
} from "@/app/apiclient";
import DoubleRow from "@/app/base/components/DoubleRow";
import MacAddressDisplay from "@/app/base/components/MacAddressDisplay";
import NonBreakingSpace from "@/app/base/components/NonBreakingSpace";
import PowerIcon from "@/app/base/components/PowerIcon";
import TooltipButton from "@/app/base/components/TooltipButton";
import type { MachineMenuAction } from "@/app/base/hooks/node";
import urls from "@/app/base/urls";
import { useToggleMenu } from "@/app/machines/hooks";
import MachineListGroupCount from "@/app/machines/views/MachineList/MachineListTable/MachineListGroupCount";
import MachineTestStatus from "@/app/machines/views/MachineList/MachineListTable/MachineTestStatus";
import { PowerTypeNames } from "@/app/store/general/constants";
import {
  machineActions as machineActionsSelectors,
  osInfo as osInfoSelectors,
} from "@/app/store/general/selectors";
import type { OSInfoOptions } from "@/app/store/general/selectors/osInfo";
import type { MachineAction } from "@/app/store/general/types";
import { machineActions } from "@/app/store/machine";
import type {
  FetchFilters,
  FetchGroupKey,
  Machine,
  MachineStateListGroup,
} from "@/app/store/machine/types";
import { isTransientStatus } from "@/app/store/machine/utils";
import { isUnconfiguredPowerType } from "@/app/store/machine/utils/common";
import type { RootState } from "@/app/store/root/types";
import tagSelectors from "@/app/store/tag/selectors";
import type { Tag } from "@/app/store/tag/types";
import { getTagsDisplay } from "@/app/store/tag/utils";
import { PowerState } from "@/app/store/types/enum";
import {
  NodeActions,
  NodeStatusCode,
  TestStatusStatus,
} from "@/app/store/types/node";
import {
  breakLines,
  isEphemerallyDeployed,
  kebabToCamelCase,
} from "@/app/utils";

// Node statuses for which the failed test warning is not shown.
const hideFailedTestWarningStatuses = [
  NodeStatusCode.COMMISSIONING,
  NodeStatusCode.FAILED_COMMISSIONING,
  NodeStatusCode.FAILED_TESTING,
  NodeStatusCode.NEW,
  NodeStatusCode.TESTING,
];

// Node statuses for which the OS + release is made human-readable.
const formattedReleaseStatuses = [
  NodeStatusCode.DEPLOYED,
  NodeStatusCode.DEPLOYING,
];

export type MachineColumnDef = ColumnDef<Machine, Partial<Machine>>;

export const filterCells = (
  row: Row<Machine>,
  column: Column<Machine>
): boolean => {
  if (row.getIsGrouped()) {
    return ["group"].includes(column.id);
  } else {
    return !["group"].includes(column.id);
  }
};

export const filterHeaders = (header: Header<Machine, unknown>): boolean =>
  header.column.id !== "group";

const getStatusText = (
  machine: Machine,
  osReleases: OSInfoOptions,
  osReleasesLoading: boolean
): string => {
  if (!machine) {
    return "Unknown";
  }

  let release: string;
  if (
    !machine ||
    !machine.osystem ||
    !machine.distro_series ||
    osReleasesLoading
  ) {
    release = "";
  } else {
    const machineRelease = Object.values(osReleases)
      .flat()
      .find((release) => release.value === machine.distro_series);
    if (machineRelease) {
      release =
        machine.osystem === "ubuntu"
          ? machineRelease.label.split('"')[0].trim()
          : machineRelease.label;
    }
    release = `${machine.osystem}/${machine.distro_series}`;
  }

  if (release && formattedReleaseStatuses.includes(machine.status_code)) {
    return machine.status_code === NodeStatusCode.DEPLOYING
      ? `Deploying ${release}`
      : release;
  }
  return machine.status;
};

const getMachineActionLinks = (
  actions: MachineMenuAction[],
  generalMachineActions: MachineAction[],
  dispatch: Dispatch<UnknownAction>,
  machine: Machine,
  noneMessage?: string
) => {
  const actionLinks: MenuLink = actions.map((action) => {
    let actionLabel = action.toString();
    generalMachineActions.forEach((machineAction) => {
      if (machineAction.name === action) {
        actionLabel = machineAction.title;
      }
    });
    return {
      children: actionLabel,
      onClick: () => {
        const actionMethod = kebabToCamelCase(action);
        const actionFunction = machineActions[actionMethod];
        if (actionFunction) {
          dispatch(actionFunction({ system_id: machine.system_id }));
        }
      },
    };
  });
  if (actionLinks.length === 0 && noneMessage) {
    return [
      {
        children: noneMessage,
        disabled: true,
      },
    ];
  }
  return actionLinks;
};

const getMachineTags = (machine: Machine, tags: Tag[]): Tag[] => {
  return tags.filter((tag) => machine.tags.includes(tag.id));
};

const getPoolLinks = (
  machine: Machine,
  resourcePools: ResourcePoolWithSummaryResponse[],
  dispatch: Dispatch<UnknownAction>
) => {
  let poolLinks;
  const machinePools = resourcePools.filter(
    (pool) => pool.id !== machine?.pool.id
  );
  if (machine?.actions.includes(NodeActions.SET_POOL)) {
    if (machinePools?.length !== 0) {
      poolLinks = machinePools?.map((pool) => ({
        children: pool.name,
        "data-testid": "change-pool-link",
        onClick: () => {
          dispatch(
            machineActions.setPool({
              pool_id: pool.id,
              system_id: machine.system_id,
            })
          );
        },
      }));
    } else {
      poolLinks = [{ children: "No other pools available.", disabled: true }];
    }
  } else {
    poolLinks = [
      { children: "Cannot change pool of this machine.", disabled: true },
    ];
  }
  return poolLinks;
};

const getZoneLinks = (
  machine: Machine,
  zones: ZoneWithSummaryResponse[],
  dispatch: Dispatch<UnknownAction>
) => {
  let zoneLinks;
  const machineZones = zones.filter((zone) => zone.id !== machine?.zone.id);
  if (machine?.actions.includes(NodeActions.SET_ZONE)) {
    if (machineZones?.length !== 0) {
      zoneLinks = machineZones?.map((zone) => ({
        children: zone.name,
        "data-testid": "change-zone-link",
        onClick: () => {
          dispatch(
            machineActions.setZone({
              system_id: machine.system_id,
              zone_id: zone.id,
            })
          );
        },
      }));
    } else {
      zoneLinks = [{ children: "No other zones available", disabled: true }];
    }
  } else {
    zoneLinks = [
      { children: "Cannot change zone of this machine", disabled: true },
    ];
  }
  return zoneLinks;
};

const getSpaces = (machine: Machine) => {
  if (machine.spaces.length > 1) {
    const sorted = [...machine.spaces].sort();
    return (
      <Tooltip message={sorted.join("\n")} position="btm-left">
        <span data-testid="spaces">{`${machine.spaces.length} spaces`}</span>
      </Tooltip>
    );
  }
  return (
    <span data-testid="spaces" title={machine.spaces[0]}>
      {machine.spaces[0]}
    </span>
  );
};

const useMachinesTableColumns = (
  grouping: FetchGroupKey,
  group: MachineStateListGroup,
  filter: FetchFilters
): MachineColumnDef[] => {
  const dispatch = useDispatch();
  const generalMachineActions = useSelector(machineActionsSelectors.get);
  const toggleMenu = useToggleMenu(null);
  const [showMAC, setShowMAC] = useState(false);
  const [showFullName, setShowFullName] = useState(true);

  const osReleasesLoading = useSelector(osInfoSelectors.loading);
  const osReleases = useSelector((state: RootState) =>
    osInfoSelectors.getAllOsReleases(state)
  );

  const tags = useSelector((state: RootState) => tagSelectors.all(state));
  const { data: users } = useUsers();
  const { data: resourcePools } = usePools();
  const { data: zones } = useZones();

  return useMemo(
    () =>
      [
        {
          id: "group",
          accessorKey: grouping,
          enableSorting: false,
          cell: ({ row }: { row: Row<Machine> }) => {
            if (!row.getIsGrouped()) return null;
            return (
              <DoubleRow
                primary={
                  <strong>
                    {row.original[grouping as keyof Machine]?.toString()}
                  </strong>
                }
                secondary={
                  <MachineListGroupCount
                    count={row.getLeafRows().length}
                    filter={filter}
                    group={group?.value}
                    grouping={grouping}
                  />
                }
              />
            );
          },
        },
        {
          id: "fqdn",
          accessorKey: "fqdn",
          meta: { isInteractiveHeader: true },
          // TODO: enable sorting by sub-headers (e.g. fqdn/pxe_mac, owner/ownerName) with v3
          header: (header) => {
            return (
              <>
                <Button
                  appearance="link"
                  className="p-button--column-header"
                  data-testid="fqdn-header"
                  onClick={(e) => {
                    e.stopPropagation();
                    const sortingFn = header.column.getToggleSortingHandler();
                    if (!showMAC && sortingFn) {
                      sortingFn(e);
                    } else {
                      setShowMAC(false);
                    }
                  }}
                  type="button"
                >
                  FQDN
                </Button>
                &nbsp;<strong>|</strong>&nbsp;
                <Button
                  appearance="link"
                  className="p-button--column-header"
                  data-testid="mac-header"
                  onClick={() => {
                    if (!showMAC) {
                      setShowMAC(true);
                    }
                  }}
                  type="button"
                >
                  MAC
                </Button>
                {{
                  asc: <Icon name={"chevron-up"}>ascending</Icon>,
                  desc: <Icon name={"chevron-down"}>descending</Icon>,
                }[header?.column?.getIsSorted() as string] ?? null}
                <br />
                <span>IP</span>
              </>
            );
          },
          cell: ({ row: { original: machine } }: { row: Row<Machine> }) => {
            const machineURL = urls.machines.machine.index({
              id: machine.system_id,
            });
            const ipAddresses: string[] = [];
            let bootIP;

            (machine.ip_addresses || []).forEach((address) => {
              let ip = address.ip;
              if (address.is_boot) {
                ip = `${ip} (PXE)`;
                bootIP = ip;
              }
              if (!ipAddresses.includes(ip)) {
                ipAddresses.push(ip);
              }
            });

            return (
              <DoubleRow
                primary={
                  showMAC ? (
                    <>
                      <Link title={machine.fqdn} to={machineURL}>
                        <MacAddressDisplay>{machine.pxe_mac}</MacAddressDisplay>
                      </Link>
                      {machine.extra_macs && machine.extra_macs.length > 0 ? (
                        <Link to={machineURL}>
                          {" "}
                          (+{machine.extra_macs.length})
                        </Link>
                      ) : null}
                    </>
                  ) : (
                    <Link title={machine.fqdn} to={machineURL}>
                      <strong data-testid="hostname">
                        {machine.locked ? (
                          <span title="This machine is locked. You have to unlock it to perform any actions.">
                            <i aria-label="Locked" className="p-icon--locked">
                              Locked:{" "}
                            </i>{" "}
                          </span>
                        ) : null}
                        {machine.hostname}
                      </strong>
                      <small>.{machine.domain.name}</small>
                    </Link>
                  )
                }
                secondary={
                  ipAddresses.length ? (
                    <>
                      <span
                        className="u-truncate"
                        data-testid="ip-addresses"
                        title={ipAddresses.length === 1 ? ipAddresses[0] : ""}
                      >
                        {bootIP || ipAddresses[0]}
                      </span>
                      {ipAddresses.length > 1 && (
                        <Tooltip
                          message={
                            <>
                              <strong>{ipAddresses.length} interfaces:</strong>
                              <ul className="p-list u-no-margin--bottom">
                                {ipAddresses.map((address) => (
                                  <li key={address}>{address}</li>
                                ))}
                              </ul>
                            </>
                          }
                          position="right"
                          positionElementClassName="p-double-row__tooltip-inner"
                        >
                          {ipAddresses.length > 1 ? (
                            <>
                              (
                              <Button
                                appearance="link"
                                className="p-double-row__button u-no-border u-no-margin u-no-padding"
                              >{`+${ipAddresses.length - 1}`}</Button>
                              )
                            </>
                          ) : null}
                        </Tooltip>
                      )}
                    </>
                  ) : (
                    <NonBreakingSpace />
                  )
                }
              />
            );
          },
        },
        {
          id: "power",
          accessorKey: "power",
          header: "Power",
          cell: ({ row: { original: machine } }: { row: Row<Machine> }) => {
            const powerState = machine.power_state || PowerState.UNKNOWN;
            const hasOnAction = machine.actions.includes(NodeActions.ON);
            const hasOffAction = machine.actions.includes(NodeActions.OFF);
            return (
              <DoubleRow
                icon={
                  <Tooltip
                    message={
                      powerState === PowerState.ERROR
                        ? breakLines(machine.status_message)
                        : null
                    }
                  >
                    <PowerIcon powerState={powerState} />
                  </Tooltip>
                }
                iconSpace
                menuClassName="p-table-menu-hasIcon"
                menuLinks={[
                  {
                    children: (
                      <PowerIcon powerState={PowerState.ON}>Turn on</PowerIcon>
                    ),
                    onClick: () => {
                      dispatch(
                        machineActions.on({ system_id: machine.system_id })
                      );
                    },
                    disabled: !hasOnAction || powerState === PowerState.ON,
                  },
                  {
                    children: (
                      <PowerIcon powerState={PowerState.OFF}>
                        Turn off
                      </PowerIcon>
                    ),
                    onClick: () => {
                      dispatch(
                        machineActions.off({ system_id: machine.system_id })
                      );
                    },
                    disabled: !hasOffAction || powerState === PowerState.OFF,
                  },
                  {
                    children: (
                      <PowerIcon powerState={PowerState.OFF}>
                        Soft power off
                      </PowerIcon>
                    ),
                    onClick: () => {
                      dispatch(
                        machineActions.softOff({
                          system_id: machine.system_id,
                        })
                      );
                    },
                    disabled:
                      !hasOffAction ||
                      powerState === PowerState.OFF ||
                      machine.power_type !== PowerTypeNames.IPMI,
                  },
                  {
                    children: (
                      <>
                        <span className="p-table-menu__icon-space"></span>
                        Check power
                      </>
                    ),
                    onClick: () => {
                      dispatch(machineActions.checkPower(machine.system_id));
                    },
                    disabled: powerState === PowerState.UNKNOWN,
                  },
                ]}
                menuTitle="Take action:"
                onToggleMenu={toggleMenu}
                primary={
                  <div
                    className="u-upper-case--first u-truncate"
                    data-testid="power_state"
                  >
                    {powerState}
                  </div>
                }
                primaryTitle={powerState}
                secondary={
                  <div
                    className="u-upper-case--first"
                    data-testid="power_type"
                    title={machine.power_type ?? undefined}
                  >
                    {machine.power_type}
                  </div>
                }
                secondaryTitle={machine.power_type}
              />
            );
          },
        },
        {
          id: "status",
          accessorKey: "status",
          header: "Status",
          cell: ({ row: { original: machine } }: { row: Row<Machine> }) => {
            const statusText = getStatusText(
              machine,
              osReleases,
              osReleasesLoading
            );
            let icon: ReactNode;
            if (isTransientStatus(machine.status_code)) {
              icon = <Spinner data-testid="status-icon" />;
            } else if (
              machine.testing_status === TestStatusStatus.FAILED &&
              !hideFailedTestWarningStatuses.includes(machine.status_code)
            ) {
              icon = (
                <TooltipButton
                  iconName="warning"
                  iconProps={{ "data-testid": "status-icon" }}
                  message="Machine has failed tests; use with caution."
                  position="top-left"
                />
              );
            } else if (isUnconfiguredPowerType(machine)) {
              icon = (
                <TooltipButton
                  aria-label="Unconfigured power type"
                  iconName="error"
                  message="Unconfigured power type. Go to the configuration tab of this machine."
                />
              );
            } else {
              icon = "";
            }

            const progressText =
              isTransientStatus(machine.status_code) && machine.status_message
                ? machine.status_message
                : "";

            const actions: MachineMenuAction[] = [
              NodeActions.ABORT,
              NodeActions.ACQUIRE,
              NodeActions.COMMISSION,
              NodeActions.DEPLOY,
              NodeActions.EXIT_RESCUE_MODE,
              NodeActions.LOCK,
              NodeActions.MARK_BROKEN,
              NodeActions.MARK_FIXED,
              NodeActions.OVERRIDE_FAILED_TESTING,
              NodeActions.RELEASE,
              NodeActions.RESCUE_MODE,
              NodeActions.TEST,
              NodeActions.UNLOCK,
            ];

            const menuLinks = [
              getMachineActionLinks(
                actions,
                generalMachineActions,
                dispatch,
                machine
              ),
              [
                {
                  children: "See logs",
                  element: Link,
                  to: `/machine/${machine.system_id}/logs`,
                },
              ],
            ];

            return (
              <DoubleRow
                icon={icon}
                iconSpace
                menuLinks={menuLinks}
                menuTitle="Take action:"
                onToggleMenu={toggleMenu}
                primary={
                  <span data-testid="status-text" title={statusText}>
                    {statusText}
                  </span>
                }
                secondary={
                  isEphemerallyDeployed(machine) ? (
                    <span>Deployed in memory</span>
                  ) : (
                    <>
                      <span data-testid="progress-text" title={progressText}>
                        {progressText}
                      </span>
                      <span data-testid="error-text">
                        {machine.error_description &&
                        machine.status_code === NodeStatusCode.BROKEN ? (
                          <Tooltip
                            message={breakLines(machine.error_description)}
                            position="btm-left"
                            positionElementClassName="p-double-row__tooltip-inner"
                            tooltipClassName="p-tooltip--fixed-width"
                          >
                            {machine.error_description}
                          </Tooltip>
                        ) : (
                          ""
                        )}
                      </span>
                    </>
                  )
                }
              />
            );
          },
        },
        {
          id: "owner",
          accessorKey: "owner",
          meta: { isInteractiveHeader: true },
          header: (header) => {
            return (
              <>
                <Button
                  appearance="link"
                  className="p-button--column-header"
                  data-testid="owner-header"
                  onClick={(e) => {
                    e.stopPropagation();
                    const sortingFn = header.column.getToggleSortingHandler();
                    if (!showFullName && sortingFn) {
                      sortingFn(e);
                    } else {
                      setShowFullName(false);
                    }
                  }}
                  type="button"
                >
                  Owner
                </Button>
                &nbsp;<strong>|</strong>&nbsp;
                <Button
                  appearance="link"
                  className="p-button--column-header"
                  data-testid="owner-name-header"
                  onClick={() => {
                    if (!showFullName) {
                      setShowFullName(true);
                    }
                  }}
                  type="button"
                >
                  Name
                </Button>
                {{
                  asc: <Icon name={"chevron-up"}>ascending</Icon>,
                  desc: <Icon name={"chevron-down"}>descending</Icon>,
                }[header?.column?.getIsSorted() as string] ?? null}
                <br />
                <span>Tags</span>
              </>
            );
          },
          cell: ({ row: { original: machine } }: { row: Row<Machine> }) => {
            const actions: MachineMenuAction[] = [
              NodeActions.ACQUIRE,
              NodeActions.RELEASE,
            ];
            const user = users?.items.find(
              (user) => user.username === machine.owner
            );
            const ownerDisplay = showFullName
              ? user?.last_name || machine?.owner || "-"
              : machine?.owner || "-";
            const menuLinks = getMachineActionLinks(
              actions,
              generalMachineActions,
              dispatch,
              machine,
              "No owner actions available."
            );
            const machineTags = getMachineTags(machine, tags);
            const tagsDisplay = getTagsDisplay(machineTags);
            return (
              <DoubleRow
                menuLinks={menuLinks}
                menuTitle="Take action:"
                onToggleMenu={toggleMenu}
                primary={<span data-testid="owner">{ownerDisplay}</span>}
                primaryTitle={ownerDisplay}
                secondary={
                  <span data-testid="tags" title={tagsDisplay}>
                    {tagsDisplay}
                  </span>
                }
                secondaryTitle={tagsDisplay}
              />
            );
          },
        },
        {
          id: "pool",
          accessorKey: "pool",
          header: () => {
            return (
              <>
                Pool
                <br />
                Note
              </>
            );
          },
          cell: ({ row: { original: machine } }: { row: Row<Machine> }) => {
            return (
              <DoubleRow
                menuLinks={getPoolLinks(
                  machine,
                  resourcePools?.items ?? [],
                  dispatch
                )}
                menuTitle="Change pool:"
                onToggleMenu={toggleMenu}
                primary={
                  <Link className="p-link--soft" to={urls.pools.index}>
                    {machine.pool.name}
                  </Link>
                }
                primaryAriaLabel="Pool"
                primaryTitle={machine.pool.name}
                secondary={
                  <span data-testid="note" title={machine.description}>
                    {machine.description}
                  </span>
                }
                secondaryAriaLabel="Note"
                secondaryTitle={machine.description}
              />
            );
          },
        },
        {
          id: "zone",
          accessorKey: "zone",
          header: () => {
            return (
              <>
                Zone
                <br />
                Spaces
              </>
            );
          },
          cell: ({ row: { original: machine } }: { row: Row<Machine> }) => {
            return (
              <DoubleRow
                menuLinks={getZoneLinks(machine, zones?.items ?? [], dispatch)}
                menuTitle="Change AZ:"
                onToggleMenu={toggleMenu}
                primary={
                  <Link className="p-link--soft" to={urls.zones.index}>
                    {machine.zone.name}
                  </Link>
                }
                primaryTitle={machine.zone.name}
                secondary={getSpaces(machine)}
              />
            );
          },
        },
        {
          id: "fabric",
          accessorKey: "fabric",
          // TODO: enable sorting by "fabric" when the API supports it
          enableSorting: false,
          header: () => {
            return (
              <>
                Fabric
                <br />
                VLAN
              </>
            );
          },
          cell: ({ row: { original: machine } }: { row: Row<Machine> }) => {
            const fabricID = machine.vlan && machine.vlan.fabric_id;
            const fabricName = machine.vlan && machine.vlan.fabric_name;
            const vlan =
              machine.vlan && machine.vlan.name ? machine.vlan.name : "";

            return (
              <DoubleRow
                primary={
                  <MachineTestStatus
                    data-testid="fabric"
                    status={machine.network_test_status.status}
                    tooltipPosition="top-left"
                  >
                    {fabricName && (fabricID || fabricID === 0) ? (
                      <Link
                        className="p-link--soft"
                        to={urls.subnets.fabric.index({ id: fabricID })}
                      >
                        {fabricName}
                      </Link>
                    ) : (
                      "-"
                    )}
                  </MachineTestStatus>
                }
                primaryAriaLabel="Fabric"
                primaryTitle={fabricName}
                secondary={<span data-testid="vlan">{vlan}</span>}
                secondaryAriaLabel="VLAN"
                secondaryTitle={vlan}
              />
            );
          },
        },
        {
          id: "cpu",
          accessorKey: "cpu_count",
          header: () => {
            return (
              <>
                Cores
                <br />
                Arch
              </>
            );
          },
          cell: ({ row: { original: machine } }: { row: Row<Machine> }) => {
            return (
              <DoubleRow
                className="u-align--right"
                primary={
                  <MachineTestStatus
                    data-testid="cores"
                    status={machine.cpu_test_status.status}
                    tooltipPosition="top-right"
                  >
                    {machine.cpu_count}
                  </MachineTestStatus>
                }
                primaryAriaLabel="Cores"
                primaryClassName="u-align--right"
                secondary={
                  <Tooltip message={machine.architecture} position="btm-left">
                    <span data-testid="arch">
                      {machine.architecture.includes("/generic")
                        ? machine.architecture.split("/")[0]
                        : machine.architecture}
                    </span>
                  </Tooltip>
                }
                secondaryAriaLabel="Architecture"
              />
            );
          },
        },
        {
          id: "memory",
          accessorKey: "memory",
          header: "RAM",
          cell: ({ row: { original: machine } }: { row: Row<Machine> }) => {
            return (
              <DoubleRow
                primary={
                  <MachineTestStatus
                    status={machine.memory_test_status.status}
                    tooltipPosition="top-right"
                  >
                    <span data-testid="memory">{machine.memory}</span>&nbsp;
                    <small className="u-text--light">GiB</small>
                  </MachineTestStatus>
                }
                primaryClassName="u-align--right"
              />
            );
          },
        },
        {
          id: "disks",
          accessorKey: "physical_disk_count",
          header: "Disks",
          cell: ({ row: { original: machine } }: { row: Row<Machine> }) => {
            return (
              <DoubleRow
                primary={
                  <MachineTestStatus
                    data-testid="disks"
                    status={machine.storage_test_status.status}
                    tooltipPosition="top-right"
                  >
                    {machine.physical_disk_count}
                  </MachineTestStatus>
                }
                primaryClassName="u-align--right"
              />
            );
          },
        },
        {
          id: "storage",
          accessorKey: "storage",
          header: "Storage",
          cell: ({ row: { original: machine } }: { row: Row<Machine> }) => {
            const formattedStorage = formatBytes({
              value: machine.storage,
              unit: "GB",
            });
            return (
              <DoubleRow
                primary={
                  <>
                    <span data-testid="storage-value">
                      {formattedStorage.value}
                    </span>
                    &nbsp;
                    <small className="u-text--light" data-testid="storage-unit">
                      {formattedStorage.unit}
                    </small>
                  </>
                }
                primaryClassName="u-align--right"
              />
            );
          },
        },
      ] as MachineColumnDef[],
    [
      dispatch,
      filter,
      generalMachineActions,
      group?.value,
      grouping,
      osReleases,
      osReleasesLoading,
      resourcePools?.items,
      showFullName,
      showMAC,
      tags,
      toggleMenu,
      users?.items,
      zones?.items,
    ]
  );
};

export default useMachinesTableColumns;
