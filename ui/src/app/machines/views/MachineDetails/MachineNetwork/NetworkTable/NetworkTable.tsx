import type { ReactNode } from "react";

import { Icon, MainTable, Spinner, Tooltip } from "@canonical/react-components";
import { useSelector } from "react-redux";

import DoubleRow from "app/base/components/DoubleRow";
import TableHeader from "app/base/components/TableHeader";
import { useTableSort } from "app/base/hooks";
import machineSelectors from "app/store/machine/selectors";
import type { NetworkInterface, Machine } from "app/store/machine/types";
import { NetworkInterfaceTypes } from "app/store/machine/types";
import { isBootInterface, isInterfaceConnected } from "app/store/machine/utils";
import type { RootState } from "app/store/root/types";
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
  columns: { content: ReactNode }[];
  key: NetworkInterface["id"];
  sortData: NetworkRowSortData;
};

type SortKey = keyof NetworkRowSortData;

const getSortValue = (sortKey: SortKey, row: NetworkRow) =>
  row.sortData[sortKey];

const generateRows = (machine: Machine): NetworkRow[] => {
  if (!machine || !("interfaces" in machine)) {
    return [];
  }
  return machine.interfaces.map((nic: NetworkInterface) => {
    const isBoot = isBootInterface(machine, nic);
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
          content: isBoot ? (
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
      ],
      key: nic.id,
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
  });
};

type Props = { systemId: Machine["system_id"] };

const NetworkTable = ({ systemId }: Props): JSX.Element => {
  const { currentSort, sortRows, updateSort } = useTableSort<
    NetworkRow,
    SortKey
  >(getSortValue, {
    key: "name",
    direction: "ascending",
  });

  const machine = useSelector((state: RootState) =>
    machineSelectors.getById(state, systemId)
  );
  if (!machine || !("interfaces" in machine)) {
    return <Spinner text="Loading..." />;
  }
  const sortedRows = sortRows(generateRows(machine));
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
