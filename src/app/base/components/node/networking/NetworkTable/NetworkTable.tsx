import { useEffect } from "react";

import { MainTable } from "@canonical/react-components";
import type { MainTableRow } from "@canonical/react-components/dist/components/MainTable/MainTable";
import classNames from "classnames";
import { useDispatch, useSelector } from "react-redux";

import IPColumn from "./IPColumn";
import PXEColumn from "./PXEColumn";
import SpeedColumn from "./SpeedColumn";

import GroupCheckbox from "app/base/components/GroupCheckbox";
import type {
  Expanded,
  SetExpanded,
} from "app/base/components/NodeNetworkTab/NodeNetworkTab";
import TableHeader from "app/base/components/TableHeader";
import DHCPColumn from "app/base/components/node/networking/DHCPColumn";
import FabricColumn from "app/base/components/node/networking/FabricColumn";
import NameColumn from "app/base/components/node/networking/NameColumn";
import SubnetColumn from "app/base/components/node/networking/SubnetColumn";
import TypeColumn from "app/base/components/node/networking/TypeColumn";
import type {
  Selected,
  SetSelected,
} from "app/base/components/node/networking/types";
import { useIsAllNetworkingDisabled, useTableSort } from "app/base/hooks";
import type { Sort } from "app/base/types";
import { SortDirection } from "app/base/types";
import NetworkTableActions from "app/machines/views/MachineDetails/MachineNetwork/NetworkTable/NetworkTableActions";
import NetworkTableConfirmation from "app/machines/views/MachineDetails/MachineNetwork/NetworkTable/NetworkTableConfirmation";
import type { ControllerDetails } from "app/store/controller/types";
import { actions as fabricActions } from "app/store/fabric";
import fabricSelectors from "app/store/fabric/selectors";
import type { Fabric } from "app/store/fabric/types";
import type { MachineDetails } from "app/store/machine/types";
import { actions as subnetActions } from "app/store/subnet";
import subnetSelectors from "app/store/subnet/selectors";
import type { Subnet } from "app/store/subnet/types";
import { getSubnetDisplay } from "app/store/subnet/utils";
import type { NetworkInterface, NetworkLink } from "app/store/types/node";
import {
  getInterfaceFabric,
  getInterfaceIPAddressOrMode,
  getInterfaceName,
  getInterfaceSubnet,
  getInterfaceTypeText,
  getLinkInterface,
  isBondOrBridgeChild,
  isBondOrBridgeParent,
  isBootInterface,
  nodeIsMachine,
} from "app/store/utils";
import { actions as vlanActions } from "app/store/vlan";
import vlanSelectors from "app/store/vlan/selectors";
import type { VLAN } from "app/store/vlan/types";
import { getDHCPStatus } from "app/store/vlan/utils";
import { generateCheckboxHandlers, isComparable } from "app/utils";
import type { CheckboxHandlers } from "app/utils/generateCheckboxHandlers";

export enum Label {
  Actions = "Actions",
  ActionsMenu = "Interface actions",
  DHCP = "DHCP",
  Fabric = "Fabric",
  IP = "IP Address",
  MAC = "MAC",
  Name = "Name",
  NUMA = "NUMA node",
  PXE = "PXE",
  Speed = "Link/interface speed",
  Status = "Status",
  Subnet = "Subnet",
  SubnetName = "Name",
  Type = "Type",
  VLAN = "VLAN",
}

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

type NetworkRow = Omit<MainTableRow, "sortData"> & {
  "data-testid"?: string;
  select: Selected | null;
  sortData: NetworkRowSortData;
};

type SortKey = keyof NetworkRowSortData;

const getSortValue = (sortKey: SortKey, row: NetworkRow) => {
  const value = row.sortData[sortKey];
  return isComparable(value) ? value : null;
};

const generateRow = (
  checkboxHandler: CheckboxHandlers<Selected> | null,
  fabrics: Fabric[],
  fabricsLoaded: boolean,
  isAllNetworkingDisabled: boolean,
  link: NetworkLink | null,
  node: MachineDetails | ControllerDetails,
  nic: NetworkInterface | null,
  selected: Props["selected"],
  subnets: Subnet[],
  vlans: VLAN[],
  vlansLoaded: boolean,
  hasActions: boolean,
  setExpanded?: SetExpanded,
  expanded?: Expanded | null
): NetworkRow | null => {
  if (link && !nic) {
    [nic] = getLinkInterface(node, link);
  }
  if (!nic) {
    return null;
  }
  const isABondOrBridgeParent = isBondOrBridgeParent(node, nic, link);
  const isABondOrBridgeChild = isBondOrBridgeChild(node, nic, link);
  const isBoot = isBootInterface(node, nic, link);
  const vlan = vlans.find(({ id }) => id === nic?.vlan_id);
  const fabric = getInterfaceFabric(node, fabrics, vlans, nic, link);
  const name = getInterfaceName(node, nic, link);
  const interfaceTypeDisplay = getInterfaceTypeText(node, nic, link, true);
  const shouldShowDHCP = !isABondOrBridgeParent && fabricsLoaded && vlansLoaded;
  const fabricContent = !isABondOrBridgeParent
    ? fabric?.name || "Disconnected"
    : null;
  const subnet = getInterfaceSubnet(
    node,
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
  const showCheckbox = !isABondOrBridgeParent && hasActions;
  const select = showCheckbox
    ? {
        linkId: link?.id,
        nicId: nic?.id,
      }
    : null;
  return {
    className: classNames("p-table__row", {
      "truncated-border": isABondOrBridgeParent,
      "is-active": isExpanded,
    }),
    columns: [
      {
        "aria-label": Label.Name,
        content: (
          <NameColumn
            checkSelected={checkboxHandler?.checkSelected}
            checkboxSpace={
              // When interfaces can't be selected then we still need to add space so
              // the parent rows appear nested under the bond or bridge.
              (!showCheckbox && hasActions) || isABondOrBridgeParent
            }
            handleRowCheckbox={checkboxHandler?.handleRowCheckbox}
            link={link}
            nic={nic}
            node={node}
            selected={selected}
            showCheckbox={showCheckbox}
          />
        ),
      },
      {
        "aria-label": Label.PXE,
        content: !isABondOrBridgeParent && (
          <PXEColumn link={link} nic={nic} node={node} />
        ),
        className: "u-align--center",
      },
      {
        "aria-label": Label.Speed,
        content: <SpeedColumn link={link} nic={nic} node={node} />,
      },
      {
        "aria-label": Label.Type,
        content: <TypeColumn link={link} nic={nic} node={node} />,
      },
      {
        "aria-label": Label.Fabric,
        content: !isABondOrBridgeParent && (
          <FabricColumn link={link} nic={nic} node={node} />
        ),
      },
      {
        "aria-label": Label.Subnet,
        content: !isABondOrBridgeParent && (
          <SubnetColumn link={link} nic={nic} node={node} />
        ),
      },
      {
        "aria-label": Label.IP,
        content: !isABondOrBridgeParent && (
          <IPColumn link={link} nic={nic} node={node} />
        ),
      },
      {
        "aria-label": Label.DHCP,
        content: !isABondOrBridgeParent && <DHCPColumn nic={nic} />,
      },
      ...(hasActions
        ? [
            {
              "aria-label": Label.Actions,
              className: "u-align--right",
              content:
                !isABondOrBridgeParent && nodeIsMachine(node) && setExpanded ? (
                  <NetworkTableActions
                    link={link}
                    nic={nic}
                    setExpanded={setExpanded}
                    systemId={node.system_id}
                  />
                ) : null,
            },
          ]
        : []),
    ],
    "data-testid": name,
    expanded: isExpanded,
    expandedContent:
      hasActions && isExpanded && nodeIsMachine(node) && setExpanded ? (
        <NetworkTableConfirmation
          expanded={expanded}
          link={link}
          nic={nic}
          setExpanded={setExpanded}
          systemId={node.system_id}
        />
      ) : null,
    key: name,
    select,
    sortData: {
      bondOrBridge:
        (isABondOrBridgeParent && nic.children[0]) ||
        (isABondOrBridgeChild && nic.id) ||
        null,
      dhcp: shouldShowDHCP ? getDHCPStatus(vlan, vlans, fabrics) : null,
      fabric: fabricContent,
      ip: getInterfaceIPAddressOrMode(node, fabrics, vlans, nic, link) || null,
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
  checkboxHandler: CheckboxHandlers<Selected> | null,
  fabrics: Fabric[],
  fabricsLoaded: boolean,
  isAllNetworkingDisabled: boolean,
  node: MachineDetails | ControllerDetails,
  selected: Props["selected"],
  subnets: Subnet[],
  vlans: VLAN[],
  vlansLoaded: boolean,
  hasActions: boolean,
  setExpanded?: (expanded: Expanded | null) => void,
  expanded?: Expanded | null
): NetworkRow[] => {
  const rows: NetworkRow[] = [];
  // Create a list of interfaces and aliases to use to generate the table rows.
  node.interfaces.forEach((nic: NetworkInterface) => {
    const createRow = (
      link: NetworkLink | null,
      nic: NetworkInterface | null
    ) =>
      generateRow(
        checkboxHandler,
        fabrics,
        fabricsLoaded,
        isAllNetworkingDisabled,
        link,
        node,
        nic,
        selected,
        subnets,
        vlans,
        vlansLoaded,
        hasActions,
        setExpanded,
        expanded
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
  _args: unknown,
  direction: Sort<SortKey>["direction"],
  rows: NetworkRow[]
) => {
  // By default sort by bonds and bridges.
  if (direction === SortDirection.NONE) {
    key = "bondOrBridge";
    direction = SortDirection.ASCENDING;
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
  let rowAValue = key
    ? getSortValue(key, childA && !inSameBondOrBridge ? childA : rowA)
    : null;
  let rowBValue = key
    ? getSortValue(key, childB && !inSameBondOrBridge ? childB : rowB)
    : null;
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
  if (
    (rowBValue && !rowAValue) ||
    (isComparable(rowAValue) &&
      isComparable(rowBValue) &&
      rowAValue < rowBValue)
  ) {
    return direction === SortDirection.DESCENDING ? -1 : 1;
  }
  if (
    (rowAValue && !rowBValue) ||
    (isComparable(rowAValue) &&
      isComparable(rowBValue) &&
      rowAValue > rowBValue)
  ) {
    return direction === SortDirection.DESCENDING ? 1 : -1;
  }
  return 0;
};

export const generateUniqueId = ({ linkId, nicId }: Selected): string =>
  `${nicId || ""}-${linkId || ""}`;

type BaseProps = {
  node: MachineDetails | ControllerDetails;
};

type ActionProps = BaseProps & {
  expanded?: Expanded | null;
  selected?: Selected[];
  setExpanded?: SetExpanded;
  setSelected?: SetSelected;
};

type WithoutActionProps = BaseProps & {
  expanded?: never;
  selected?: never;
  setExpanded?: never;
  setSelected?: never;
};

type Props = ActionProps | WithoutActionProps;

const NetworkTable = ({
  expanded,
  node,
  selected,
  setExpanded,
  setSelected,
}: Props): JSX.Element => {
  const dispatch = useDispatch();
  const fabrics = useSelector(fabricSelectors.all);
  const subnets = useSelector(subnetSelectors.all);
  const vlans = useSelector(vlanSelectors.all);
  const fabricsLoaded = useSelector(fabricSelectors.loaded);
  const vlansLoaded = useSelector(vlanSelectors.loaded);
  const isAllNetworkingDisabled = useIsAllNetworkingDisabled(node);
  const { currentSort, sortRows, updateSort } = useTableSort<
    NetworkRow,
    SortKey
  >(
    getSortValue,
    {
      key: "name",
      direction: SortDirection.DESCENDING,
    },
    rowSort
  );
  const checkboxHandler = setSelected
    ? generateCheckboxHandlers<Selected>(setSelected, generateUniqueId)
    : null;
  const hasActions = !!setExpanded;

  useEffect(() => {
    dispatch(fabricActions.fetch());
    dispatch(subnetActions.fetch());
    dispatch(vlanActions.fetch());
  }, [dispatch]);

  const rows = generateRows(
    checkboxHandler,
    fabrics,
    fabricsLoaded,
    isAllNetworkingDisabled,
    node,
    selected,
    subnets,
    vlans,
    vlansLoaded,
    hasActions,
    setExpanded,
    expanded
  );
  const sortedRows = sortRows(rows);
  // Generate a list of ids for interfaces that have checkboxes.
  const selectableIDs = rows.reduce<Selected[]>((selectable, { select }) => {
    if (select) {
      selectable.push(select);
    }
    return selectable;
  }, []);
  return (
    <MainTable
      className={classNames("p-table-expanding--light", "network-table", {
        "network-table--has-actions": hasActions,
      })}
      defaultSort="name"
      defaultSortDirection="descending"
      expanding
      headers={[
        {
          "aria-label": Label.Name,
          content: (
            <div className="u-flex">
              {hasActions && checkboxHandler && selected ? (
                <GroupCheckbox
                  checkAllSelected={checkboxHandler.checkAllSelected}
                  checkSelected={checkboxHandler.checkSelected}
                  disabled={isAllNetworkingDisabled}
                  handleGroupCheckbox={checkboxHandler.handleGroupCheckbox}
                  items={selectableIDs}
                  selectedItems={selected}
                />
              ) : null}
              <div>
                <TableHeader
                  currentSort={currentSort}
                  onClick={() => updateSort("name")}
                  sortKey="name"
                >
                  {Label.Name}
                </TableHeader>
                <TableHeader>{Label.MAC}</TableHeader>
              </div>
            </div>
          ),
        },
        {
          className: "u-align--center",
          content: (
            <>
              <TableHeader
                className="u-align--center"
                currentSort={currentSort}
                onClick={() => updateSort("pxe")}
                sortKey="pxe"
              >
                {Label.PXE}
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
              {Label.Speed}
            </TableHeader>
          ),
        },
        {
          "aria-label": Label.Type,
          content: (
            <div>
              <TableHeader
                className="p-double-row__header-spacer"
                currentSort={currentSort}
                onClick={() => updateSort("type")}
                sortKey="type"
              >
                {Label.Type}
              </TableHeader>
              <TableHeader className="p-double-row__header-spacer">
                {Label.NUMA}
              </TableHeader>
            </div>
          ),
        },
        {
          "aria-label": Label.Fabric,
          content: (
            <div>
              <TableHeader
                currentSort={currentSort}
                onClick={() => updateSort("fabric")}
                sortKey="fabric"
              >
                {Label.Fabric}
              </TableHeader>
              <TableHeader>{Label.VLAN}</TableHeader>
            </div>
          ),
        },
        {
          "aria-label": Label.Subnet,
          content: (
            <div>
              <TableHeader
                currentSort={currentSort}
                onClick={() => updateSort("subnet")}
                sortKey="subnet"
              >
                {Label.Subnet}
              </TableHeader>
              <TableHeader>{Label.SubnetName}</TableHeader>
            </div>
          ),
        },
        {
          "aria-label": Label.IP,
          content: (
            <div>
              <TableHeader
                currentSort={currentSort}
                onClick={() => updateSort("ip")}
                sortKey="ip"
              >
                {Label.IP}
              </TableHeader>
              <TableHeader>{Label.Status}</TableHeader>
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
              {Label.DHCP}
            </TableHeader>
          ),
        },
        ...(hasActions
          ? [
              {
                content: Label.Actions,
                className: "u-align--right",
              },
            ]
          : []),
      ]}
      rows={sortedRows}
    />
  );
};

export default NetworkTable;
