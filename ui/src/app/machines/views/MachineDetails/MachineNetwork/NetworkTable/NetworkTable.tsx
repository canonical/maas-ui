import type { ReactNode } from "react";
import { useEffect } from "react";

import { Icon, MainTable, Spinner, Tooltip } from "@canonical/react-components";
import classNames from "classnames";
import { useDispatch, useSelector } from "react-redux";

import IPColumn from "./IPColumn";
import NetworkTableActions from "./NetworkTableActions";
import NetworkTableConfirmation from "./NetworkTableConfirmation";
import SubnetColumn from "./SubnetColumn";
import type { Expanded, SetExpanded } from "./types";

import DoubleRow from "app/base/components/DoubleRow";
import GroupCheckbox from "app/base/components/GroupCheckbox";
import LegacyLink from "app/base/components/LegacyLink";
import RowCheckbox from "app/base/components/RowCheckbox";
import TableHeader from "app/base/components/TableHeader";
import { useTableSort } from "app/base/hooks";
import type { Sort } from "app/base/hooks";
import { actions as fabricActions } from "app/store/fabric";
import fabricSelectors from "app/store/fabric/selectors";
import type { Fabric } from "app/store/fabric/types";
import machineSelectors from "app/store/machine/selectors";
import type {
  NetworkInterface,
  NetworkLink,
  Machine,
} from "app/store/machine/types";
import { NetworkInterfaceTypes } from "app/store/machine/types";
import {
  getInterfaceFabric,
  getInterfaceIPAddressOrMode,
  getInterfaceName,
  getInterfaceNumaNodes,
  getInterfaceSubnet,
  getInterfaceTypeText,
  getLinkInterface,
  hasInterfaceType,
  isBondOrBridgeChild,
  isBondOrBridgeParent,
  isBootInterface,
  isInterfaceConnected,
  useIsAllNetworkingDisabled,
} from "app/store/machine/utils";
import type { RootState } from "app/store/root/types";
import { actions as subnetActions } from "app/store/subnet";
import subnetSelectors from "app/store/subnet/selectors";
import type { Subnet } from "app/store/subnet/types";
import { getSubnetDisplay } from "app/store/subnet/utils";
import { actions as vlanActions } from "app/store/vlan";
import vlanSelectors from "app/store/vlan/selectors";
import type { VLAN } from "app/store/vlan/types";
import { getDHCPStatus, getVLANDisplay } from "app/store/vlan/utils";
import { formatSpeedUnits, generateCheckboxHandlers } from "app/utils";
import type { CheckboxHandlers } from "app/utils/generateCheckboxHandlers";

type NetworkRowSortData = {
  bondOrBridge: NetworkInterface["id"] | null;
  dhcp: string | null;
  fabric: string | null;
  ip: string | null;
  isABondOrBridgeChild: boolean;
  isABondOrBridgeParent: boolean;
  name: NetworkInterface["name"];
  pxe: boolean;
  speed: NetworkInterface["link_speed"];
  subnet: string | null;
  type: string | null;
};

// TODO: This should eventually extend the react-components table row type
// when it has been migrated to TypeScript.
type NetworkRow = {
  className: string | null;
  columns: { className?: string; content: ReactNode }[];
  expanded: boolean;
  expandedContent: ReactNode | null;
  key: NetworkInterface["name"];
  sortData: NetworkRowSortData;
};

type SortKey = keyof NetworkRowSortData;

const getSortValue = (sortKey: SortKey, row: NetworkRow) =>
  row.sortData[sortKey];

const generateRow = (
  expanded: Expanded | null,
  fabrics: Fabric[],
  fabricsLoaded: boolean,
  handleRowCheckbox: CheckboxHandlers<
    NetworkInterface["id"]
  >["handleRowCheckbox"],
  isAllNetworkingDisabled: boolean,
  link: NetworkLink | null,
  machine: Machine,
  nic: NetworkInterface | null,
  selected: Props["selected"],
  setExpanded: SetExpanded,
  subnets: Subnet[],
  vlans: VLAN[],
  vlansLoaded: boolean
): NetworkRow | null => {
  if (link && !nic) {
    [nic] = getLinkInterface(machine, link);
  }
  if (!nic) {
    return null;
  }
  const isABondOrBridgeParent = isBondOrBridgeParent(machine, nic, link);
  const isABondOrBridgeChild = isBondOrBridgeChild(machine, nic, link);
  const isBoot = isBootInterface(machine, nic, link);
  const numaNodes = getInterfaceNumaNodes(machine, nic, link);
  const vlan = vlans.find(({ id }) => id === nic?.vlan_id);
  const fabric = getInterfaceFabric(machine, fabrics, vlans, nic, link);
  const name = getInterfaceName(machine, nic, link);
  const interfaceTypeDisplay = getInterfaceTypeText(machine, nic, link);
  const shouldShowDHCP = !isABondOrBridgeParent && fabricsLoaded && vlansLoaded;
  const fabricContent = !isABondOrBridgeParent
    ? fabric?.name || "Disconnected"
    : null;
  const subnet = getInterfaceSubnet(
    machine,
    subnets,
    fabrics,
    vlans,
    isAllNetworkingDisabled,
    nic,
    link
  );
  const isExpanded =
    !!expanded &&
    ((link && expanded.linkId === link.id) ||
      (!link && expanded.nicId === nic?.id));
  const showCheckbox = !isABondOrBridgeParent;
  return {
    className: classNames("p-table__row", {
      "indented-border": isABondOrBridgeParent,
      "is-active": isExpanded,
    }),
    columns: [
      {
        content: (
          <DoubleRow
            primary={
              showCheckbox ? (
                <RowCheckbox
                  disabled={isAllNetworkingDisabled}
                  handleRowCheckbox={handleRowCheckbox}
                  item={nic.id}
                  items={selected}
                  inputLabel={<span data-test="name">{name}</span>}
                />
              ) : (
                <span data-test="name">{name}</span>
              )
            }
            secondary={nic.mac_address}
            primaryClassName={showCheckbox ? null : "u-nudge--primary-row"}
            secondaryClassName="u-nudge--secondary-row"
          />
        ),
      },
      {
        content:
          !isABondOrBridgeParent && isBoot ? (
            <span className="u-align--center">
              <Icon name="success" />
            </span>
          ) : null,
      },
      {
        content: hasInterfaceType(
          [
            NetworkInterfaceTypes.BOND,
            NetworkInterfaceTypes.BRIDGE,
            NetworkInterfaceTypes.VLAN,
          ],
          machine,
          nic,
          link
        ) ? null : (
          <DoubleRow
            data-test="speed"
            icon={
              <>
                {isInterfaceConnected(machine, nic, link) ? null : (
                  <Tooltip
                    position="top-left"
                    message="This interface is disconnected."
                  >
                    <Icon name="disconnected" />
                  </Tooltip>
                )}
                {isInterfaceConnected(machine, nic, link) &&
                nic.link_speed < nic.interface_speed ? (
                  <Tooltip
                    position="top-left"
                    message="Link connected to slow interface."
                  >
                    <Icon name="warning" />
                  </Tooltip>
                ) : null}
              </>
            }
            iconSpace={true}
            primary={
              <>
                {formatSpeedUnits(nic.link_speed)}/
                {formatSpeedUnits(nic.interface_speed)}
              </>
            }
          />
        ),
      },
      {
        content: (
          <DoubleRow
            data-test="type"
            icon={
              numaNodes && numaNodes.length > 1 ? (
                <Tooltip
                  position="top-left"
                  message="This bond is spread over multiple NUMA nodes. This may lead to suboptimal performance."
                >
                  <Icon name="warning" />
                </Tooltip>
              ) : null
            }
            iconSpace={true}
            primary={interfaceTypeDisplay}
            secondary={numaNodes ? numaNodes.join(", ") : null}
          />
        ),
      },
      {
        content: !isABondOrBridgeParent && fabricsLoaded && (
          <DoubleRow
            data-test="fabric"
            primary={
              fabric ? (
                <LegacyLink
                  className="p-link--soft"
                  route={`/fabric/${fabric.id}`}
                >
                  {fabricContent}
                </LegacyLink>
              ) : (
                fabricContent
              )
            }
            secondary={
              vlan ? (
                <LegacyLink
                  className="p-link--muted"
                  route={`/vlan/${vlan.id}`}
                >
                  {getVLANDisplay(vlan)}
                </LegacyLink>
              ) : null
            }
          />
        ),
      },
      {
        content: !isABondOrBridgeParent && (
          <SubnetColumn link={link} nic={nic} systemId={machine.system_id} />
        ),
      },
      {
        content: !isABondOrBridgeParent && (
          <IPColumn link={link} nic={nic} systemId={machine.system_id} />
        ),
      },
      {
        content: shouldShowDHCP ? (
          <DoubleRow
            data-test="dhcp"
            icon={
              vlan && vlan.relay_vlan ? (
                <Tooltip
                  position="btm-right"
                  message={getDHCPStatus(vlan, vlans, fabrics, true)}
                >
                  <Icon name="information" />
                </Tooltip>
              ) : null
            }
            iconSpace={true}
            primary={getDHCPStatus(vlan, vlans, fabrics)}
          />
        ) : null,
      },
      {
        className: "u-align--right",
        content: !isABondOrBridgeParent && (
          <NetworkTableActions
            link={link}
            nic={nic}
            setExpanded={setExpanded}
            systemId={machine.system_id}
          />
        ),
      },
    ],
    expanded: isExpanded,
    expandedContent: (
      <NetworkTableConfirmation
        expanded={expanded}
        link={link}
        nic={nic}
        setExpanded={setExpanded}
        systemId={machine.system_id}
      />
    ),
    key: name,
    sortData: {
      bondOrBridge:
        (isABondOrBridgeParent && nic.children[0]) ||
        (isABondOrBridgeChild && nic.id) ||
        null,
      dhcp: shouldShowDHCP ? getDHCPStatus(vlan, vlans, fabrics) : null,
      fabric: fabricContent,
      ip:
        getInterfaceIPAddressOrMode(machine, fabrics, vlans, nic, link) || null,
      isABondOrBridgeChild,
      isABondOrBridgeParent,
      name: name,
      pxe: isBoot,
      speed: nic.link_speed,
      subnet: getSubnetDisplay(subnet),
      type: interfaceTypeDisplay,
    },
  };
};

const generateRows = (
  expanded: Expanded | null,
  fabrics: Fabric[],
  fabricsLoaded: boolean,
  handleRowCheckbox: CheckboxHandlers<
    NetworkInterface["id"]
  >["handleRowCheckbox"],
  isAllNetworkingDisabled: boolean,
  machine: Machine,
  selected: Props["selected"],
  setExpanded: (expanded: Expanded | null) => void,
  subnets: Subnet[],
  vlans: VLAN[],
  vlansLoaded: boolean
): NetworkRow[] => {
  if (!machine || !("interfaces" in machine)) {
    return [];
  }
  const rows: NetworkRow[] = [];
  // Create a list of interfaces and aliases to use to generate the table rows.
  machine.interfaces.forEach((nic: NetworkInterface) => {
    const createRow = (
      link: NetworkLink | null,
      nic: NetworkInterface | null
    ) =>
      generateRow(
        expanded,
        fabrics,
        fabricsLoaded,
        handleRowCheckbox,
        isAllNetworkingDisabled,
        link,
        machine,
        nic,
        selected,
        setExpanded,
        subnets,
        vlans,
        vlansLoaded
      );
    if (nic.links.length === 0) {
      const row = createRow(null, nic);
      if (row) {
        rows.push(row);
      }
    } else {
      nic.links.forEach((link: NetworkLink) => {
        const row = createRow(link, null);
        if (row) {
          rows.push(row);
        }
      });
    }
  });
  return rows;
};

const getChild = (row: NetworkRow, rows: NetworkRow[]): NetworkRow | null => {
  if (!row.sortData.isABondOrBridgeParent) {
    return null;
  }
  return (
    rows.find(
      ({ sortData }) =>
        sortData.isABondOrBridgeChild &&
        sortData.bondOrBridge === row.sortData.bondOrBridge
    ) || null
  );
};

const rowSort = (
  rowA: NetworkRow,
  rowB: NetworkRow,
  key: Sort<SortKey>["key"],
  _args: unknown[],
  direction: Sort<SortKey>["direction"],
  rows: NetworkRow[]
) => {
  // By default sort by bonds and bridges.
  if (direction === "none") {
    key = "bondOrBridge";
    direction = "ascending";
  }
  // Get the bond or bridge child rows.
  const childA = getChild(rowA, rows);
  const childB = getChild(rowB, rows);
  const inSameBondOrBridge =
    rowA.sortData.bondOrBridge === rowB.sortData.bondOrBridge;
  // Get the values to sort by. When comparing bond or bridge parents (the
  // "siblings" of the bond or bridge) then use the row values, otherwise use
  // the value from the child (the main row that preceeds the parents) so that all
  // the rows for a bond or bridge end up together.
  let rowAValue = getSortValue(
    key,
    childA && !inSameBondOrBridge ? childA : rowA
  );
  let rowBValue = getSortValue(
    key,
    childB && !inSameBondOrBridge ? childB : rowB
  );
  // If the rows are in the same bond or bridge then put the child first.
  if (inSameBondOrBridge) {
    if (
      rowA.sortData.isABondOrBridgeChild &&
      !rowB.sortData.isABondOrBridgeChild
    ) {
      return -1;
    }
    if (rowB.sortData.isABondOrBridgeChild) {
      return 0;
    }
  }
  if (rowAValue === rowBValue) {
    // Rows that have the same value need to be sorted by the bond or bridge id
    // so that they don't lose their grouping.
    rowAValue = getSortValue("bondOrBridge", rowA);
    rowBValue = getSortValue("bondOrBridge", rowB);
  }
  // From this point on compare the values as normal.
  if (!rowAValue && !rowBValue) {
    return 0;
  }
  if ((rowBValue && !rowAValue) || rowAValue < rowBValue) {
    return direction === "descending" ? -1 : 1;
  }
  if ((rowAValue && !rowBValue) || rowAValue > rowBValue) {
    return direction === "descending" ? 1 : -1;
  }
  return 0;
};

type Props = {
  expanded: Expanded | null;
  selected: NetworkInterface["id"][];
  setExpanded: SetExpanded;
  setSelected: (selected: NetworkInterface["id"][]) => void;
  systemId: Machine["system_id"];
};

const NetworkTable = ({
  expanded,
  selected,
  setExpanded,
  setSelected,
  systemId,
}: Props): JSX.Element => {
  const dispatch = useDispatch();
  const machine = useSelector((state: RootState) =>
    machineSelectors.getById(state, systemId)
  );
  const fabrics = useSelector(fabricSelectors.all);
  const subnets = useSelector(subnetSelectors.all);
  const vlans = useSelector(vlanSelectors.all);
  const fabricsLoaded = useSelector(fabricSelectors.loaded);
  const vlansLoaded = useSelector(vlanSelectors.loaded);
  const isAllNetworkingDisabled = useIsAllNetworkingDisabled(machine);
  const { currentSort, sortRows, updateSort } = useTableSort<
    NetworkRow,
    SortKey
  >(
    getSortValue,
    {
      key: "name",
      direction: "descending",
    },
    rowSort
  );
  const { handleGroupCheckbox, handleRowCheckbox } = generateCheckboxHandlers<
    NetworkInterface["id"]
  >(setSelected);

  useEffect(() => {
    dispatch(fabricActions.fetch());
    dispatch(subnetActions.fetch());
    dispatch(vlanActions.fetch());
  }, [dispatch]);

  if (!machine || !("interfaces" in machine)) {
    return <Spinner text="Loading..." />;
  }

  const rows = generateRows(
    expanded,
    fabrics,
    fabricsLoaded,
    handleRowCheckbox,
    isAllNetworkingDisabled,
    machine,
    selected,
    setExpanded,
    subnets,
    vlans,
    vlansLoaded
  );
  const sortedRows = sortRows(rows);
  const nicIds = machine.interfaces.reduce<NetworkInterface["id"][]>(
    (nics = [], nic) => {
      if (!isBondOrBridgeParent(machine, nic)) {
        nics.push(nic.id);
      }
      return nics;
    },
    []
  );
  return (
    <MainTable
      className="p-table-expanding--light machine-network-table"
      defaultSort="name"
      defaultSortDirection="descending"
      expanding
      headers={[
        {
          content: (
            <>
              <GroupCheckbox
                disabled={isAllNetworkingDisabled}
                items={nicIds}
                selectedItems={selected}
                handleGroupCheckbox={handleGroupCheckbox}
              />
              <div>
                <TableHeader
                  currentSort={currentSort}
                  onClick={() => updateSort("name")}
                  sortKey="name"
                >
                  Name
                </TableHeader>
                <TableHeader>MAC</TableHeader>
              </div>
            </>
          ),
        },
        {
          content: (
            <>
              <TableHeader
                className="u-align--center"
                currentSort={currentSort}
                onClick={() => updateSort("pxe")}
                sortKey="pxe"
              >
                PXE
              </TableHeader>
            </>
          ),
        },
        {
          content: (
            <TableHeader
              className="p-double-row__header-spacer"
              currentSort={currentSort}
              onClick={() => updateSort("speed")}
              sortKey="speed"
            >
              Link/interface speed
            </TableHeader>
          ),
        },
        {
          content: (
            <div>
              <TableHeader
                className="p-double-row__header-spacer"
                currentSort={currentSort}
                onClick={() => updateSort("type")}
                sortKey="type"
              >
                Type
              </TableHeader>
              <TableHeader className="p-double-row__header-spacer">
                NUMA node
              </TableHeader>
            </div>
          ),
        },
        {
          content: (
            <div>
              <TableHeader
                currentSort={currentSort}
                onClick={() => updateSort("fabric")}
                sortKey="fabric"
              >
                Fabric
              </TableHeader>
              <TableHeader>VLAN</TableHeader>
            </div>
          ),
        },
        {
          content: (
            <div>
              <TableHeader
                currentSort={currentSort}
                onClick={() => updateSort("subnet")}
                sortKey="subnet"
              >
                Subnet
              </TableHeader>
              <TableHeader>Name</TableHeader>
            </div>
          ),
        },
        {
          content: (
            <div>
              <TableHeader
                currentSort={currentSort}
                onClick={() => updateSort("ip")}
                sortKey="ip"
              >
                IP Address
              </TableHeader>
              <TableHeader>Status</TableHeader>
            </div>
          ),
        },
        {
          content: (
            <TableHeader
              className="p-double-row__header-spacer"
              currentSort={currentSort}
              onClick={() => updateSort("dhcp")}
              sortKey="dhcp"
            >
              DHCP
            </TableHeader>
          ),
        },
        {
          content: "Actions",
          className: "u-align--right",
        },
      ]}
      rows={sortedRows}
    />
  );
};

export default NetworkTable;
