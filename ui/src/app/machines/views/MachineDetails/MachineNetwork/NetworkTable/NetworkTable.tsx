import type { ReactNode } from "react";
import { useEffect } from "react";

import { Icon, MainTable, Spinner, Tooltip } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";

import IPColumn from "./IPColumn";
import NetworkTableActions from "./NetworkTableActions";
import SubnetColumn from "./SubnetColumn";

import DoubleRow from "app/base/components/DoubleRow";
import LegacyLink from "app/base/components/LegacyLink";
import TableHeader from "app/base/components/TableHeader";
import { useTableSort } from "app/base/hooks";
import { actions as fabricActions } from "app/store/fabric";
import fabricSelectors from "app/store/fabric/selectors";
import type { Fabric } from "app/store/fabric/types";
import machineSelectors from "app/store/machine/selectors";
import type {
  NetworkInterface,
  NetworkLink,
  NetworkLinkInterface,
  Machine,
} from "app/store/machine/types";
import {
  NetworkLinkMode,
  NetworkInterfaceTypes,
} from "app/store/machine/types";
import {
  getBondOrBridgeChild,
  getInterfaceNumaNodes,
  getInterfaceTypeText,
  isBootInterface,
  isInterfaceConnected,
  isBondOrBridgeParent,
} from "app/store/machine/utils";
import type { RootState } from "app/store/root/types";
import { actions as subnetActions } from "app/store/subnet";
import { actions as vlanActions } from "app/store/vlan";
import vlanSelectors from "app/store/vlan/selectors";
import type { VLAN } from "app/store/vlan/types";
import { getDHCPStatus, getVLANDisplay } from "app/store/vlan/utils";
import { formatSpeedUnits } from "app/utils";

type NetworkRowSortData = {
  name: NetworkInterface["name"];
  pxe: boolean;
  speed: NetworkInterface["link_speed"];
  type: null;
  fabric: null;
  subnet: null;
  ip: null;
  dhcp: null;
};

// TODO: This should eventually extend the react-components table row type
// when it has been migrated to TypeScript.
type NetworkRow = {
  columns: { className?: string; content: ReactNode }[];
  key: NetworkInterface["name"];
  sortData: NetworkRowSortData;
};

type SortKey = keyof NetworkRowSortData;

const getSortValue = (sortKey: SortKey, row: NetworkRow) =>
  row.sortData[sortKey];

const generateRow = (
  nic: NetworkLinkInterface,
  machine: Machine,
  fabrics: Fabric[],
  vlans: VLAN[],
  fabricsLoaded: boolean,
  vlansLoaded: boolean
): NetworkRow => {
  const isABondOrBridgeParent = isBondOrBridgeParent(machine, nic);
  const connectingInterface = getBondOrBridgeChild(machine, nic);
  const isBoot = isBootInterface(machine, nic);
  const numaNodes = getInterfaceNumaNodes(machine, nic);
  const vlan = vlans.find(({ id }) => id === nic.vlan_id);
  const fabric = vlan ? fabrics.find(({ id }) => id === vlan.fabric) : null;
  return {
    columns: [
      {
        content: (
          <DoubleRow
            data-test="name"
            primary={nic.name}
            secondary={nic.mac_address}
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
        content: [
          NetworkInterfaceTypes.BOND,
          NetworkInterfaceTypes.BRIDGE,
          NetworkInterfaceTypes.VLAN,
        ].includes(nic.type) ? null : (
          <DoubleRow
            data-test="speed"
            icon={
              <>
                {isInterfaceConnected(nic) ? null : (
                  <Tooltip
                    position="top-left"
                    message="This interface is disconnected."
                  >
                    <Icon name="disconnected" />
                  </Tooltip>
                )}
                {isInterfaceConnected(nic) &&
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
              numaNodes.length > 1 ? (
                <Tooltip
                  position="top-left"
                  message="This bond is spread over multiple NUMA nodes. This may lead to suboptimal performance."
                >
                  <Icon name="warning" />
                </Tooltip>
              ) : null
            }
            iconSpace={true}
            primary={
              isABondOrBridgeParent && connectingInterface
                ? getInterfaceTypeText(connectingInterface, nic)
                : getInterfaceTypeText(nic)
            }
            secondary={numaNodes.join(", ")}
          />
        ),
      },
      {
        content: !isABondOrBridgeParent && (
          <DoubleRow
            data-test="fabric"
            primary={
              fabric ? (
                <LegacyLink
                  className="p-link--soft"
                  route={`/fabric/${fabric.id}`}
                >
                  {fabric.name}
                </LegacyLink>
              ) : (
                "Disconnected"
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
          <SubnetColumn nic={nic} systemId={machine.system_id} />
        ),
      },
      {
        content: !isABondOrBridgeParent && (
          <IPColumn nic={nic} systemId={machine.system_id} />
        ),
      },
      {
        content:
          !isABondOrBridgeParent && fabricsLoaded && vlansLoaded ? (
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
          <NetworkTableActions nic={nic} systemId={machine.system_id} />
        ),
      },
    ],
    key: nic.name,
    sortData: {
      name: nic.name,
      pxe: isBoot,
      speed: nic.link_speed,
      type: null,
      fabric: null,
      subnet: null,
      ip: null,
      dhcp: null,
    },
  };
};

const generateRows = (
  machine: Machine,
  fabrics: Fabric[],
  vlans: VLAN[],
  fabricsLoaded: boolean,
  vlansLoaded: boolean
): NetworkRow[] => {
  if (!machine || !("interfaces" in machine)) {
    return [];
  }
  const interfaces: NetworkLinkInterface[] = [];
  // Create a list of interfaces and aliases to use to generate the table rows.
  machine.interfaces.forEach((nic: NetworkInterface) => {
    // Clean up the id (it's not applicable to the NetworkLinkInterface type).
    const { id: interfaceID, ...cleanedNic } = nic;
    // Define the non-alias interface.
    let linkInterface: NetworkLinkInterface = {
      ...cleanedNic,
      interfaceID: interfaceID,
      isLink: false,
      // If the interface is either disabled or has no links it means the interface
      // is in LINK_UP mode. This would be overwritten below if the mode is in a different state.
      mode: NetworkLinkMode.LINK_UP,
    };
    if (nic.links.length > 0) {
      nic.links.forEach((link: NetworkLink, i) => {
        if (i === 0) {
          // The first link provides supplementary data for the non-alias interface.
          linkInterface = {
            ...linkInterface,
            ...link,
          };
        } else {
          // Any additional links are aliases.
          const interfaceLink: NetworkLinkInterface = {
            ...cleanedNic,
            ...link,
            interfaceID: interfaceID,
            isLink: true,
            name: `${nic.name}:${i}`,
            type: NetworkInterfaceTypes.ALIAS,
          };
          // Aliases should not retain the link data.
          delete interfaceLink.links;
          // Append the alias so that a row can be created for the table.
          interfaces.push(interfaceLink);
        }
      });
    }
    interfaces.push(linkInterface);
  });
  const rows: NetworkRow[] = [];
  interfaces.forEach((nic: NetworkLinkInterface) => {
    rows.push(
      generateRow(nic, machine, fabrics, vlans, fabricsLoaded, vlansLoaded)
    );
  });
  return rows;
};

type Props = { systemId: Machine["system_id"] };

const NetworkTable = ({ systemId }: Props): JSX.Element => {
  const dispatch = useDispatch();
  const machine = useSelector((state: RootState) =>
    machineSelectors.getById(state, systemId)
  );
  const fabrics = useSelector(fabricSelectors.all);
  const vlans = useSelector(vlanSelectors.all);
  const fabricsLoaded = useSelector(fabricSelectors.loaded);
  const vlansLoaded = useSelector(vlanSelectors.loaded);
  const { currentSort, sortRows, updateSort } = useTableSort<
    NetworkRow,
    SortKey
  >(getSortValue, {
    key: "name",
    direction: "ascending",
  });

  useEffect(() => {
    dispatch(fabricActions.fetch());
    dispatch(subnetActions.fetch());
    dispatch(vlanActions.fetch());
  }, [dispatch]);

  if (!machine || !("interfaces" in machine)) {
    return <Spinner text="Loading..." />;
  }

  const rows = generateRows(
    machine,
    fabrics,
    vlans,
    fabricsLoaded,
    vlansLoaded
  );
  const sortedRows = sortRows(rows);
  return (
    <MainTable
      defaultSort="name"
      defaultSortDirection="ascending"
      headers={[
        {
          content: (
            <>
              <TableHeader
                currentSort={currentSort}
                onClick={() => updateSort("name")}
                sortKey="name"
              >
                Name
              </TableHeader>
              <TableHeader>MAC</TableHeader>
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
            <>
              <TableHeader
                className="p-double-row__header-spacer"
                currentSort={currentSort}
                onClick={() => updateSort("type")}
                sortKey="type"
              >
                Type
              </TableHeader>
              <TableHeader>NUMA node</TableHeader>
            </>
          ),
        },
        {
          content: (
            <>
              <TableHeader
                currentSort={currentSort}
                onClick={() => updateSort("fabric")}
                sortKey="fabric"
              >
                Fabric
              </TableHeader>
              <TableHeader>VLAN</TableHeader>
            </>
          ),
        },
        {
          content: (
            <>
              <TableHeader
                currentSort={currentSort}
                onClick={() => updateSort("subnet")}
                sortKey="subnet"
              >
                Subnet
              </TableHeader>
              <TableHeader>Name</TableHeader>
            </>
          ),
        },
        {
          content: (
            <>
              <TableHeader
                currentSort={currentSort}
                onClick={() => updateSort("ip")}
                sortKey="ip"
              >
                IP Address
              </TableHeader>
              <TableHeader>Status</TableHeader>
            </>
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
